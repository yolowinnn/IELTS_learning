/* dashboard.js — 今日首页:计划、打卡、进度 */
(function () {
  function render(view) {
    const t = Plan.today();
    const prog = Store.dayProgress();
    const srs = SRS.stats();
    const pct = Plan.overallPercent();
    const doneCount = t.tasks.filter(x => prog[x.key]).length;

    const wrap = el('<div></div>');

    // Hero — 大环显示「今日完成度」(即时成就感),底部细条显示总进度
    const todayPct = t.tasks.length ? Math.round(doneCount / t.tasks.length * 100) : 0;
    wrap.appendChild(el(`
      <div class="hero">
        <div class="hero-top">
          <div>
            <div class="hero-sub">第 ${t.week} 周 · 共 8 周</div>
            <div class="day-num">Day ${t.day} <span style="font-size:18px;font-weight:600;opacity:.7">/ ${t.totalDays}</span></div>
            <div class="theme-pill">🎯 ${esc(t.info.theme)}</div>
          </div>
          <div class="ring">${ring(todayPct, '今日')}</div>
        </div>
        <div class="hero-sub mt12">${esc(t.info.focus).replace(/[;；]/g, ' · ')}</div>
        <div class="hero-bar">
          <div class="hero-bar-track"><i style="width:${pct}%"></i></div>
          <span class="hero-bar-tx">总进度 ${pct}%</span>
        </div>
      </div>
    `));

    // 今日打卡进度条
    wrap.appendChild(el(`
      <div class="card">
        <div class="spread mb8">
          <div class="card-title">✅ 今日任务 ${doneCount}/${t.tasks.length}</div>
          <div class="pill ${doneCount === t.tasks.length ? 'good' : 'accent'}">${doneCount === t.tasks.length ? '全部完成 🎉' : '还差 ' + (t.tasks.length - doneCount) + ' 项'}</div>
        </div>
        <div class="bar"><i style="width:${Math.round(doneCount / t.tasks.length * 100)}%"></i></div>
        <div id="tasklist" class="mt12"></div>
      </div>
    `));

    // SRS 快览
    wrap.appendChild(el(`
      <div class="card">
        <div class="card-title mb8">🗂️ 单词记忆</div>
        <div class="stat-grid">
          <div class="stat"><b style="color:var(--warn)">${srs.due}</b><small>待复习</small></div>
          <div class="stat"><b style="color:var(--accent)">${srs.newAvail}</b><small>今日新词</small></div>
          <div class="stat"><b style="color:var(--good)">${srs.learned}</b><small>已学</small></div>
          <div class="stat"><b>${srs.mastered}</b><small>已掌握</small></div>
        </div>
        <button class="btn block mt12" onclick="App.go('vocab')">开始背单词 →</button>
      </div>
    `));

    view.appendChild(wrap);

    // 渲染任务清单
    const list = wrap.querySelector('#tasklist');
    t.tasks.forEach(task => {
      const done = !!prog[task.key];
      const node = el(`
        <div class="task ${done ? 'done' : ''}" data-skill="${task.key}">
          <div class="t-ic">${task.ic}</div>
          <div class="t-main">
            <b>${esc(task.label)}</b>
            <div class="t-sub">${esc(task.sub || '')} · ${esc(task.est || '')}</div>
          </div>
          <div class="t-check" title="标记完成">${done ? '✓' : ''}</div>
        </div>
      `);
      // 点击主体:进入模块
      node.addEventListener('click', (e) => {
        if (e.target.closest('.t-check')) {
          Store.markTask(task.key, !prog[task.key]);
          App.go('today');
          return;
        }
        if (task.tab) App.go(task.tab);
        else if (task.open) App.open(task.open.mod, task.open.id);
      });
      list.appendChild(node);
    });

    // 今日全部完成 → 庆祝一次
    if (doneCount === t.tasks.length && t.tasks.length > 0 && Store.get('celebratedDate') !== Store.todayStr()) {
      Store.set('celebratedDate', Store.todayStr());
      setTimeout(() => { window.Celebrate && window.Celebrate(); Toast('🎉 今日五项全部完成,太棒了!'); }, 350);
    }
  }

  function ring(pct, label) {
    const r = 46, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return `
      <svg width="104" height="104" viewBox="0 0 104 104">
        <circle cx="52" cy="52" r="${r}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="9"/>
        <circle cx="52" cy="52" r="${r}" fill="none" stroke="url(#g)" stroke-width="9" stroke-linecap="round"
          stroke-dasharray="${c}" stroke-dashoffset="${off}"/>
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#67e8f9"/><stop offset="1" stop-color="#a5b4fc"/>
        </linearGradient></defs>
      </svg>
      <div class="ring-tx"><b>${pct}%</b><small>${label || '总进度'}</small></div>`;
  }

  window.Dashboard = { render };
})();
