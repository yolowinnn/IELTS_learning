/* storage.js — 本地存储封装(localStorage),带默认值与命名空间 */
(function () {
  const NS = 'ielts75:';
  const cache = {};
  let changeHook = null;       // 同步引擎注册:数据变更时回调
  let suspendHook = false;     // 应用云端数据时临时关闭,避免回写风暴

  function onChange(fn) { changeHook = fn; }

  function get(key, def) {
    if (key in cache) return cache[key];
    try {
      const raw = localStorage.getItem(NS + key);
      const val = raw === null ? def : JSON.parse(raw);
      cache[key] = val;
      return val;
    } catch (e) { return def; }
  }
  function set(key, val) {
    cache[key] = val;
    try { localStorage.setItem(NS + key, JSON.stringify(val)); } catch (e) {}
    if (changeHook && !suspendHook) { try { changeHook(key); } catch (e) {} }
    return val;
  }

  // 读取多个键的快照(供同步上传)
  function snapshot(keys) { const o = {}; keys.forEach(k => { const v = get(k, null); if (v !== null) o[k] = v; }); return o; }

  // 应用云端(合并后)数据,不触发回写钩子
  function applyRemote(obj) {
    suspendHook = true;
    try { Object.keys(obj || {}).forEach(k => { if (obj[k] !== undefined && obj[k] !== null) set(k, obj[k]); }); }
    finally { suspendHook = false; }
  }
  function update(key, def, fn) {
    const v = get(key, def);
    const nv = fn(v) ?? v;
    return set(key, nv);
  }
  function remove(key) { delete cache[key]; try { localStorage.removeItem(NS + key); } catch (e) {} }

  // 日期工具:本地日期字符串 YYYY-MM-DD
  function todayStr(d) {
    d = d || new Date();
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  function daysBetween(a, b) {
    const da = new Date(a + 'T00:00:00'), db = new Date(b + 'T00:00:00');
    return Math.round((db - da) / 86400000);
  }

  // ---- 高频领域方法 ----
  // 学习起始日(首次打开即设定)
  function startDate() {
    let s = get('startDate', null);
    if (!s) { s = todayStr(); set('startDate', s); }
    return s;
  }
  // 当前是第几天(1-based)
  function currentDay() {
    return Math.max(1, daysBetween(startDate(), todayStr()) + 1);
  }

  // 任务完成状态:按 "YYYY-MM-DD" -> { vocab:bool, reading:bool, ... }
  function dayProgress(date) {
    date = date || todayStr();
    const all = get('progress', {});
    return all[date] || {};
  }
  function markTask(taskKey, value, date) {
    date = date || todayStr();
    update('progress', {}, (all) => {
      all[date] = all[date] || {};
      all[date][taskKey] = value;
      return all;
    });
    Streak.recompute();
  }

  // 连续打卡:某天若完成 >=1 个任务即算活跃
  const Streak = {
    recompute() {
      const all = get('progress', {});
      const dates = Object.keys(all).filter(d => Object.values(all[d]).some(Boolean)).sort();
      set('activeDates', dates);
      // 计算当前连胜
      let streak = 0;
      let cur = todayStr();
      const setDates = new Set(dates);
      // 如果今天没活跃,从昨天开始算
      if (!setDates.has(cur)) {
        const y = new Date(); y.setDate(y.getDate() - 1); cur = todayStr(y);
      }
      while (setDates.has(cur)) {
        streak++;
        const d = new Date(cur + 'T00:00:00'); d.setDate(d.getDate() - 1); cur = todayStr(d);
      }
      set('streak', streak);
      return streak;
    },
    get() { return get('streak', 0); }
  };

  window.Store = { get, set, update, remove, todayStr, daysBetween, startDate, currentDay, dayProgress, markTask, Streak, onChange, snapshot, applyRemote };
})();
