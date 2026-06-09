/* practice.js — 题库:按技能浏览全部内容,自由练习 */
(function () {
  const TABS = [
    { key: 'reading', ic: '📖', label: '阅读', mod: 'reading' },
    { key: 'listening', ic: '🎧', label: '听力', mod: 'listening' },
    { key: 'writing', ic: '✍️', label: '写作', mod: 'writing' },
    { key: 'speaking', ic: '🗣️', label: '口语', mod: 'speaking' },
  ];
  let active = 'reading';

  function render(view) {
    view.innerHTML = '';
    const wrap = el('<div></div>');

    const bar = el('<div class="toolbar"></div>');
    TABS.forEach(t => {
      const b = el(`<button class="btn ${t.key === active ? '' : 'ghost'} sm">${t.ic} ${t.label}</button>`);
      b.onclick = () => { active = t.key; render(view); };
      bar.appendChild(b);
    });
    wrap.appendChild(bar);

    const list = el('<div></div>');
    const data = window.IELTS_DATA[active] || [];
    const scores = Store.get('scores', {})[active] || [];
    const doneIds = new Set(scores.map(x => x.id));

    if (!data.length) {
      list.appendChild(el(`<div class="empty"><div class="big">📭</div><p>该模块内容正在持续补充中</p></div>`));
    }
    data.forEach((item, i) => {
      const tab = TABS.find(t => t.key === active);
      const title = active === 'writing' ? `Task ${item.task} · ${item.title}` : item.title;
      const sub = active === 'reading' ? `${item.topic || ''} · ${item.words || '?'}词`
        : active === 'listening' ? (item.section || '')
        : active === 'writing' ? (item.type || '')
        : (item.topic || '');
      const li = el(`
        <div class="list-item">
          <div class="li-ic">${tab.ic}</div>
          <div class="li-main"><b>${esc(title)}</b><div class="faint">${esc(sub)}</div></div>
          ${doneIds.has(item.id) ? '<span class="pill good">已练</span>' : ''}
          <div class="li-arrow">›</div>
        </div>
      `);
      li.onclick = () => App.open(tab.mod, item.id);
      list.appendChild(li);
    });
    wrap.appendChild(list);
    view.appendChild(wrap);
  }

  window.Practice = { render };
})();
