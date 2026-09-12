/* packs.js — 课程内容包(lesson pack)运行时。
   这是"上完课 → 增量更新到 App"的通用接口:
   - 打包内置:data/packs.js 里的 window.IELTS_PACKS(网页每次部署自动最新;APK 打包时内置)
   - 联网增量:从 <base>/packs/index.json 拉新包,存 localStorage → 老 APK 不用重装也能拿到新课
   - 手动导入:Profile 页选一个 pack.json 文件(完全离线可用)
   三条路径产出同一个结果:把包里的 listening/reading/vocab/writing/speaking 合并进 IELTS_DATA。 */
(function () {
  const STORE_KEY = 'packs';            // { [id]: {pack, base, installedAt, origin} }
  const SEEN_KEY = 'packsSeen';         // 已提示过的包 id,避免重复 toast
  const BASE_KEY = 'packBase';          // 用户可覆盖的远程站点
  const DEFAULT_REMOTE = 'https://ielts75.pages.dev';
  const KINDS = ['listening', 'reading', 'writing', 'speaking', 'vocab'];

  const merged = {};                    // id -> {pack, base}
  const listeners = [];

  function cache() { return Store.get(STORE_KEY, {}); }
  function saveCache(v) { return Store.set(STORE_KEY, v); }

  // 站内运行时用同源(免 CORS);APK/file:// 用远程站点
  function remoteBase() {
    const override = Store.get(BASE_KEY, '');
    if (override) return override.replace(/\/+$/, '');
    if (/^https?:$/.test(location.protocol)) return location.origin;
    return DEFAULT_REMOTE;
  }
  function setRemoteBase(url) { Store.set(BASE_KEY, (url || '').trim().replace(/\/+$/, '')); }

  function absolute(base, src) {
    if (!src) return src;
    if (/^(https?:|data:|blob:|\/)/.test(src)) return src;
    return base.replace(/\/+$/, '') + '/' + src.replace(/^\.?\//, '');
  }

  // 资源(音频/页图)可以不跟 pack.json 放一起:pack.assetBase 指到对象存储/别的域名
  function assetRoot(pack, base) {
    const ab = pack.assetBase;
    if (!ab) return base;
    return String(ab).replace(/^\.?\//, '').replace(/\/+$/, '');
  }

  // 把包里一条内容装配成 App 能直接用的对象(补上来源、把相对路径变成可用地址)
  function decorate(item, pack, base, kind) {
    const o = Object.assign({}, item);
    o.pack = pack.id;
    o.packTitle = pack.title || '';
    o.lessonDate = pack.date || '';
    o.base = base;
    const ab = assetRoot(pack, base);
    if (!o.source && pack.source) o.source = pack.source;
    if (o.audio) o.audio = absolute(ab, o.audio);
    ['sheets', 'questionSheets', 'transcriptSheets'].forEach(k => {
      if (Array.isArray(o[k])) o[k] = o[k].map(s => (typeof s === 'string'
        ? { src: absolute(ab, s) }
        : Object.assign({}, s, { src: absolute(ab, s.src) })));
    });
    if (kind === 'vocab' && o.day == null) o.day = 0;   // 课程词优先进每日新词队列
    return o;
  }

  function mergeInto(pack, base) {
    KINDS.forEach(kind => {
      const items = pack[kind];
      if (!Array.isArray(items) || !items.length) return;
      const arr = (window.IELTS_DATA[kind] = window.IELTS_DATA[kind] || []);
      items.forEach(it => {
        const o = decorate(it, pack, base, kind);
        const at = arr.findIndex(x => x && x.id === o.id);
        if (at >= 0) arr[at] = o; else arr.push(o);
      });
    });
    merged[pack.id] = { pack, base };
  }

  function unmerge(id) {
    KINDS.forEach(kind => {
      const arr = window.IELTS_DATA[kind];
      if (Array.isArray(arr)) window.IELTS_DATA[kind] = arr.filter(x => !x || x.pack !== id);
    });
    delete merged[id];
  }

  function validate(pack) {
    if (!pack || typeof pack !== 'object') return 'not an object';
    if (!pack.id || !/^[\w.-]+$/.test(pack.id)) return 'missing or invalid id';
    if (!pack.date || !/^\d{4}-\d{2}-\d{2}$/.test(pack.date)) return 'missing date (YYYY-MM-DD)';
    if (!KINDS.some(k => Array.isArray(pack[k]) && pack[k].length)) return 'pack has no content';
    return null;
  }

  // 安装一个包对象(persist=true 时写 localStorage,下次离线也在)
  function install(pack, opts) {
    opts = opts || {};
    const err = validate(pack);
    if (err) throw new Error('Invalid pack: ' + err);
    const base = (opts.base || ('packs/' + pack.id)).replace(/\/+$/, '');
    if (merged[pack.id]) unmerge(pack.id);
    mergeInto(pack, base);
    if (opts.persist) {
      const c = cache();
      c[pack.id] = { pack, base, installedAt: Date.now(), origin: opts.origin || 'remote' };
      saveCache(c);
    }
    return summary(pack.id);
  }

  function remove(id) {
    unmerge(id);
    const c = cache(); delete c[id]; saveCache(c);
  }

  function counts(pack) {
    const o = {};
    KINDS.forEach(k => { if (Array.isArray(pack[k]) && pack[k].length) o[k] = pack[k].length; });
    return o;
  }
  function summary(id) {
    const m = merged[id]; if (!m) return null;
    return { id, date: m.pack.date, title: m.pack.title || id, base: m.base,
             source: m.pack.source || '', counts: counts(m.pack), pack: m.pack };
  }
  function list() {
    return Object.keys(merged).map(summary)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }
  function get(id) { return summary(id); }
  function onChange(fn) { listeners.push(fn); }
  function fire(info) { listeners.forEach(fn => { try { fn(info); } catch (e) {} }); }

  // ---- 远程增量更新 ----
  async function fetchJSON(url, timeout) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const t = setTimeout(() => ctl && ctl.abort(), timeout || 12000);
    try {
      const r = await fetch(url, { cache: 'no-store', signal: ctl && ctl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }

  // 拉 packs/index.json,装上本地还没有(或版本更新)的包。返回新装的包摘要数组。
  async function checkRemote(opts) {
    opts = opts || {};
    const base = opts.base || remoteBase();
    const index = await fetchJSON(base + '/packs/index.json');
    const entries = (index && index.packs) || [];
    const added = [];
    for (const e of entries) {
      if (!e || !e.id) continue;
      const have = merged[e.id];
      const haveRev = have && (have.pack.rev || 0);
      if (have && !(e.rev > haveRev)) continue;         // 已是最新
      try {
        const packBase = base + '/packs/' + e.id;
        const pack = await fetchJSON(packBase + '/pack.json');
        install(pack, { base: packBase, persist: true, origin: 'remote' });
        added.push(summary(pack.id));
      } catch (err) { /* 单个包失败不影响其它 */ }
    }
    Store.set('packsCheckedAt', Date.now());
    if (added.length) fire({ added });
    return added;
  }

  // 手动导入:一个 pack.json 文件(assets 走远程或已内置)
  function importFile(file) {
    return new Promise((resolve, reject) => {
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const pack = JSON.parse(rd.result);
          const info = install(pack, { persist: true, origin: 'import',
            base: pack.assetBase || (remoteBase() + '/packs/' + pack.id) });
          fire({ added: [info] });
          resolve(info);
        } catch (e) { reject(e); }
      };
      rd.onerror = () => reject(new Error('read failed'));
      rd.readAsText(file);
    });
  }

  // ---- 启动 ----
  function init() {
    // 1) 打包内置的包(网页/APK 里的 data/packs.js)
    (window.IELTS_PACKS || []).forEach(p => {
      try { install(p, { base: 'packs/' + p.id, persist: false }); } catch (e) {}
    });
    // 2) 之前联网/导入装过的包(离线也在)
    const c = cache();
    Object.keys(c).forEach(id => {
      const rec = c[id];
      if (!rec || !rec.pack) return;
      if (merged[id]) {                      // 内置版本更新则丢弃缓存
        const bundledRev = merged[id].pack.rev || 0;
        if (bundledRev >= (rec.pack.rev || 0)) { delete c[id]; saveCache(c); return; }
      }
      try { install(rec.pack, { base: rec.base, persist: false }); } catch (e) {}
    });
  }

  // 后台静默检查(不阻塞启动;失败静默)
  function autoCheck(delay) {
    setTimeout(() => {
      checkRemote().then(added => {
        if (!added.length) return;
        const seen = Store.get(SEEN_KEY, []);
        const fresh = added.filter(a => seen.indexOf(a.id) < 0);
        Store.set(SEEN_KEY, seen.concat(added.map(a => a.id)));
        if (fresh.length && window.Toast) Toast(`📦 ${fresh.length} new lesson pack${fresh.length > 1 ? 's' : ''} added`);
      }).catch(() => {});
    }, delay || 2500);
  }

  window.Packs = { init, install, remove, list, get, importFile, checkRemote, autoCheck,
                   remoteBase, setRemoteBase, onChange, validate, DEFAULT_REMOTE };
  init();
})();
