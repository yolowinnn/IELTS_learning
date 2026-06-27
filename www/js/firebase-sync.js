/* firebase-sync.js — Google 登录 + Firestore 跨设备进度同步。
   设计要点:
   - Firebase SDK 从 CDN 动态加载;离线/未配置时自动降级为"仅本地",绝不影响使用。
   - 登录后:拉云端 → 与本地智能合并 → 写回两端;之后本地变更防抖上传;切回前台再拉取。
   - 数据以 JSON 字符串存于 users/{uid},规避 Firestore 字段名限制。 */
(function () {
  const SYNC_KEYS = ['srs', 'progress', 'scores', 'writingDrafts', 'newLearned', 'startDate',
    'dailyNew', 'ttsRate', 'ttsVoice', 'autoSpeak', 'celebratedDate'];
  const SDK = '10.12.2';
  let app = null, auth = null, db = null, user = null;
  let ready = false, pushTimer = null, authReady = false;
  const authCbs = [], statusCbs = [], readyCbs = [];
  function onReady(fn) { if (authReady) { try { fn(); } catch (e) {} } else readyCbs.push(fn); }
  function fireReady() { if (authReady) return; authReady = true; readyCbs.forEach(fn => { try { fn(); } catch (e) {} }); readyCbs.length = 0; }
  let status = 'local'; // local | connecting | signed-in | syncing | synced | error

  function configured() { const c = window.FIREBASE_CONFIG || {}; return !!(c.apiKey && c.projectId); }
  function setStatus(s) { status = s; statusCbs.forEach(fn => { try { fn(s); } catch (e) {} }); }
  function onAuth(fn) { authCbs.push(fn); fn(user); }
  function onStatus(fn) { statusCbs.push(fn); fn(status); }
  function currentUser() { return user; }

  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  async function loadSDK() {
    if (window.firebase && firebase.firestore) return true;
    const base = 'https://www.gstatic.com/firebasejs/' + SDK + '/';
    await loadScript(base + 'firebase-app-compat.js');
    await loadScript(base + 'firebase-auth-compat.js');
    await loadScript(base + 'firebase-firestore-compat.js');
    return !!(window.firebase && firebase.firestore);
  }

  async function init() {
    if (!configured()) { setStatus('local'); fireReady(); return; }
    setStatus('connecting');
    try {
      const ok = await loadSDK();
      if (!ok) throw new Error('SDK load failed');
      app = firebase.initializeApp(window.FIREBASE_CONFIG);
      auth = firebase.auth(); db = firebase.firestore();
      try { await db.enablePersistence({ synchronizeTabs: true }); } catch (e) {}
      ready = true;
      auth.onAuthStateChanged(async (u) => {
        user = u; authCbs.forEach(fn => { try { fn(u); } catch (e) {} });
        fireReady();
        if (u) { setStatus('signed-in'); registerLocalHook(); await pullMergePush(u.uid); }
        else setStatus('local');
      });
      // 切回前台拉取最新
      document.addEventListener('visibilitychange', () => { if (!document.hidden && user) pull(user.uid); });
    } catch (e) { console.warn('Firebase init failed, 仅本地', e); setStatus('error'); fireReady(); }
  }

  let signingIn = false;
  async function signIn() {
    if (signingIn) return;            // 防连点导致 cancelled-popup-request
    if (!ready) { await init(); }
    if (!auth) { Toast && Toast('云同步未配置'); return; }
    signingIn = true;
    try {
      await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (e) {
      const code = e.code || e.message || '';
      // 弹窗被拦/被打断 → 退回重定向方式(更稳,自动化/移动端友好)
      if (/popup|cancelled-popup|operation-not-supported/i.test(code)) {
        try { await auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()); return; }
        catch (e2) { Toast && Toast(friendlyAuthErr(e2.code || e2.message)); }
      } else { console.warn(e); Toast && Toast(friendlyAuthErr(code)); }
    } finally { signingIn = false; }
  }
  async function signOut() { if (auth) { try { await auth.signOut(); Toast && Toast('已退出登录'); } catch (e) {} } }

  async function ensureAuth() { if (!ready) await init(); return !!auth; }
  async function signInEmail(email, pw) {
    if (!(await ensureAuth())) return { error: '云同步未配置' };
    try { await auth.signInWithEmailAndPassword(email, pw); return { ok: true }; }
    catch (e) { return { error: friendlyAuthErr(e.code || e.message) }; }
  }
  async function signUpEmail(email, pw) {
    if (!(await ensureAuth())) return { error: '云同步未配置' };
    try { await auth.createUserWithEmailAndPassword(email, pw); return { ok: true }; }
    catch (e) { return { error: friendlyAuthErr(e.code || e.message) }; }
  }
  async function resetEmail(email) {
    if (!(await ensureAuth())) return { error: '云同步未配置' };
    try { await auth.sendPasswordResetEmail(email); return { ok: true }; }
    catch (e) { return { error: friendlyAuthErr(e.code || e.message) }; }
  }
  function friendlyAuthErr(code) {
    const m = {
      'auth/invalid-email': '邮箱格式不正确',
      'auth/user-not-found': '该邮箱未注册,请先注册',
      'auth/wrong-password': '密码错误',
      'auth/invalid-credential': '邮箱或密码错误',
      'auth/email-already-in-use': '该邮箱已注册,请直接登录',
      'auth/weak-password': '密码太短(至少 6 位)',
      'auth/missing-password': '请输入密码',
      'auth/too-many-requests': '尝试过多,请稍后再试',
      'auth/operation-not-allowed': '邮箱登录未启用(需在 Firebase 控制台开启)',
      'auth/unauthorized-domain': '本网址未在 Firebase 授权域名中(请在控制台加上本站域名)',
      'auth/popup-closed-by-user': '登录弹窗被关闭了,请重试',
      'auth/cancelled-popup-request': '弹窗被打断,请只点一次或改用邮箱登录',
      'auth/network-request-failed': '网络错误,请检查连接'
    };
    return m[code] || ('登录失败:' + code);
  }

  function docRef(uid) { return db.collection('users').doc(uid); }

  async function pull(uid) {
    if (!db) return;
    try {
      setStatus('syncing');
      const snap = await docRef(uid).get();
      if (snap.exists) {
        const remote = parse(snap.data());
        const merged = mergeData(Store.snapshot(SYNC_KEYS), remote);
        Store.applyRemote(merged);
        Store.Streak.recompute();
        refreshUI();
      }
      setStatus('synced');
    } catch (e) { console.warn('pull', e); setStatus('error'); }
  }

  async function pullMergePush(uid) {
    if (!db) return;
    try {
      setStatus('syncing');
      const snap = await docRef(uid).get();
      const local = Store.snapshot(SYNC_KEYS);
      const merged = snap.exists ? mergeData(local, parse(snap.data())) : local;
      Store.applyRemote(merged);
      Store.Streak.recompute();
      await docRef(uid).set({ json: JSON.stringify(Store.snapshot(SYNC_KEYS)), updatedAt: Date.now(), email: user && user.email || '' });
      refreshUI();
      setStatus('synced');
    } catch (e) { console.warn('pullMergePush', e); setStatus('error'); }
  }

  function registerLocalHook() {
    Store.onChange(() => { if (user) schedulePush(); });
  }
  function schedulePush() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushNow, 1500);
  }
  async function pushNow() {
    if (!db || !user) return;
    try {
      setStatus('syncing');
      await docRef(user.uid).set({ json: JSON.stringify(Store.snapshot(SYNC_KEYS)), updatedAt: Date.now(), email: user.email || '' });
      setStatus('synced');
    } catch (e) { console.warn('push', e); setStatus('error'); }
  }

  function parse(d) { try { return d && d.json ? JSON.parse(d.json) : (d || {}); } catch (e) { return {}; } }
  function refreshUI() {
    try {
      if (!window.App) return;
      App.refreshStreak && App.refreshStreak();
      // 仅当安全地停在今日页(非子页面)时才刷新,避免把用户从听力/单词等弹回首页
      if (App.currentTab && App.currentTab() === 'today' && (!App.isSubView || !App.isSubView())) App.go('today');
    } catch (e) {}
  }

  // ---------- 合并逻辑(跨设备安全) ----------
  function mergeData(a, b) {
    a = a || {}; b = b || {};
    return {
      srs: mergeSrs(a.srs, b.srs),
      progress: mergeProgress(a.progress, b.progress),
      scores: mergeScores(a.scores, b.scores),
      writingDrafts: mergeByDate(a.writingDrafts, b.writingDrafts),
      newLearned: mergeMax(a.newLearned, b.newLearned),
      startDate: earliest(a.startDate, b.startDate),
      dailyNew: pick(a.dailyNew, b.dailyNew),
      ttsRate: pick(a.ttsRate, b.ttsRate),
      ttsVoice: pick(a.ttsVoice, b.ttsVoice),
      autoSpeak: a.autoSpeak != null ? a.autoSpeak : b.autoSpeak,
      celebratedDate: laterStr(a.celebratedDate, b.celebratedDate)
    };
  }
  function pick(x, y) { return x != null ? x : y; }
  function earliest(x, y) { if (!x) return y; if (!y) return x; return x < y ? x : y; }
  function laterStr(x, y) { if (!x) return y; if (!y) return x; return x > y ? x : y; }
  function mergeSrs(a, b) { a = a || {}; b = b || {}; const o = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => { const x = a[k], y = b[k]; if (!x) o[k] = y; else if (!y) o[k] = x; else o[k] = ((x.seen || 0) >= (y.seen || 0)) ? ((x.seen === y.seen && (y.due || '') > (x.due || '')) ? y : x) : y; }); return o; }
  function mergeProgress(a, b) { a = a || {}; b = b || {}; const o = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(d => { o[d] = Object.assign({}, a[d] || {}); const bd = b[d] || {}; Object.keys(bd).forEach(k => { o[d][k] = o[d][k] || bd[k]; }); }); return o; }
  function mergeScores(a, b) { a = a || {}; b = b || {}; const o = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(sk => { const seen = new Set(); o[sk] = []; [...(a[sk] || []), ...(b[sk] || [])].forEach(x => { const key = (x.id || '') + '|' + (x.date || '') + '|' + (x.sc != null ? x.sc : ''); if (!seen.has(key)) { seen.add(key); o[sk].push(x); } }); }); return o; }
  function mergeByDate(a, b) { a = a || {}; b = b || {}; const o = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => { const x = a[k], y = b[k]; if (!x) o[k] = y; else if (!y) o[k] = x; else o[k] = ((y.date || '') > (x.date || '')) ? y : x; }); return o; }
  function mergeMax(a, b) { a = a || {}; b = b || {}; const o = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => { o[k] = Math.max(a[k] || 0, b[k] || 0); }); return o; }

  window.Sync = { init, signIn, signInEmail, signUpEmail, resetEmail, signOut, onAuth, onStatus, onReady, currentUser, configured, pushNow, get status() { return status; }, get authReady() { return authReady; } };
})();
