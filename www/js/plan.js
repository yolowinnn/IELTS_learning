/* plan.js — 8周(56天)学习计划引擎。保证每天五个模块全覆盖,内容自动轮换。 */
(function () {
  const TOTAL_DAYS = 56;

  function weeks() { return window.IELTS_DATA.plan?.weeks || []; }
  function weekOf(day) { return Math.min(8, Math.ceil(day / 7)); }
  function weekInfo(day) {
    const w = weeks();
    return w[weekOf(day) - 1] || { theme: 'Review & Consolidate', focus: 'Fill the gaps, keep all five skills active', target: 'Consolidate' };
  }

  function pool(name) { return window.IELTS_DATA[name] || []; }
  function pick(arr, day) { return arr.length ? arr[(day - 1) % arr.length] : null; }

  // 给定天的五项任务
  function tasksFor(day) {
    const reading = pick(pool('reading'), day);
    const listening = pick(pool('listening'), day);
    // 写作:奇偶天交替 Task1 / Task2
    const writingPool = pool('writing');
    const t1 = writingPool.filter(w => w.task === 1);
    const t2 = writingPool.filter(w => w.task === 2);
    const writing = (day % 2 === 1)
      ? (pick(t2, Math.ceil(day / 2)) || pick(writingPool, day))
      : (pick(t1, day / 2) || pick(writingPool, day));
    const speaking = pick(pool('speaking'), day);

    const list = [
      { key: 'vocab', ic: '🗂️', label: 'Vocabulary', sub: 'Review due + learn new', est: '15 min', tab: 'vocab' },
    ];
    if (reading)   list.push({ key: 'reading',   ic: '📖', label: 'Reading', sub: reading.title,   est: '20 min', open: { mod: 'reading', id: reading.id } });
    if (listening) list.push({ key: 'listening', ic: '🎧', label: 'Listening', sub: listening.title, est: '15 min', open: { mod: 'listening', id: listening.id } });
    if (writing)   list.push({ key: 'writing',   ic: '✍️', label: 'Writing', sub: (writing.task === 1 ? 'Task 1 · ' : 'Task 2 · ') + writing.title, est: '20 min', open: { mod: 'writing', id: writing.id } });
    if (speaking)  list.push({ key: 'speaking',  ic: '🗣️', label: 'Speaking', sub: speaking.title, est: '10 min', open: { mod: 'speaking', id: speaking.id } });
    return list;
  }

  function today() {
    const day = Store.currentDay();
    return { day, week: weekOf(day), info: weekInfo(day), tasks: tasksFor(day), totalDays: TOTAL_DAYS };
  }

  // 整体进度(基于天数)
  function overallPercent() {
    return Math.min(100, Math.round(Store.currentDay() / TOTAL_DAYS * 100));
  }

  window.Plan = { today, tasksFor, weekInfo, weekOf, weeks, overallPercent, TOTAL_DAYS };
})();
