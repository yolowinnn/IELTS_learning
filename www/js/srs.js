/* srs.js — 间隔重复引擎(SM-2 变体),管理单词记忆调度 */
(function () {
  const DEFAULT_EASE = 2.5;
  const MIN_EASE = 1.3;

  // 全部 SRS 状态: { [wordId]: { ease, interval, reps, due, lapses, seen } }
  function states() { return Store.get('srs', {}); }
  function saveStates(s) { Store.set('srs', s); }

  function getState(id) { return states()[id] || null; }

  // 评分: 0=Again 3=Hard 4=Good 5=Easy
  function grade(id, q) {
    const s = states();
    let st = s[id] || { ease: DEFAULT_EASE, interval: 0, reps: 0, due: Store.todayStr(), lapses: 0, seen: 0 };
    st.seen++;
    if (q < 3) {
      st.reps = 0;
      st.interval = 1;
      st.lapses++;
    } else {
      if (st.reps === 0) st.interval = 1;
      else if (st.reps === 1) st.interval = (q >= 4 ? 4 : 3);
      else st.interval = Math.max(1, Math.round(st.interval * st.ease * (q === 3 ? 0.8 : 1)));
      st.reps++;
      st.ease = Math.max(MIN_EASE, st.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
      if (q === 5) st.interval = Math.round(st.interval * 1.15);
    }
    const due = new Date(); due.setDate(due.getDate() + st.interval);
    st.due = Store.todayStr(due);
    s[id] = st;
    saveStates(s);
    return st;
  }

  // 全部单词(扁平)
  function allWords() { return (window.IELTS_DATA.vocab || []); }

  // 今日到期复习的词
  function dueToday() {
    const s = states(); const today = Store.todayStr();
    return allWords().filter(w => s[w.id] && s[w.id].due <= today);
  }

  // 今日应学新词:从未学过的词按顺序取,数量由"每日新词数"控制(不再硬性按天锁)
  function newToday() {
    const s = states();
    const limit = Store.get('dailyNew', 20);
    const learnedToday = Store.get('newLearned', {})[Store.todayStr()] || 0;
    const remaining = Math.max(0, limit - learnedToday);
    const pool = allWords().filter(w => !s[w.id]).sort((a, b) => ((a.day || 1) - (b.day || 1)) || (String(a.id) < String(b.id) ? -1 : 1));
    return pool.slice(0, remaining);
  }

  // 标记一个新词今天已开始学
  function countNewLearned() {
    Store.update('newLearned', {}, (m) => { const t = Store.todayStr(); m[t] = (m[t] || 0) + 1; return m; });
  }

  // 统计
  function stats() {
    const s = states();
    const ids = Object.keys(s);
    const mastered = ids.filter(id => s[id].interval >= 21).length; // 间隔≥21天视为掌握
    return {
      total: allWords().length,
      learned: ids.length,
      mastered,
      due: dueToday().length,
      newAvail: newToday().length
    };
  }

  window.SRS = { grade, getState, dueToday, newToday, countNewLearned, stats, allWords };
})();
