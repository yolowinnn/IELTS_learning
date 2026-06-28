/* practice.js — Practice library: browse all content by skill & day */
(function () {
  const TABS = [
    { key: 'reading', ic: '📖', label: 'Reading', mod: 'reading' },
    { key: 'listening', ic: '🎧', label: 'Listening', mod: 'listening' },
    { key: 'writing', ic: '✍️', label: 'Writing', mod: 'writing' },
    { key: 'speaking', ic: '🗣️', label: 'Speaking', mod: 'speaking' },
  ];
  let active = 'listening';

  function dateForDay(day) {
    const dt = new Date(Store.startDate() + 'T00:00:00'); dt.setDate(dt.getDate() + (day - 1));
    try { return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch (e) { return (dt.getMonth() + 1) + '/' + dt.getDate(); }
  }

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
    wrap.appendChild(el(`<div class="faint mb8" style="margin-left:4px">Pick any day to practise — by date & topic.</div>`));
    if (active === 'reading' || active === 'listening') {
      wrap.appendChild(el(`<div class="notice"><b>📘 About these materials</b><br>Original IELTS-format practice written to the latest <b>Cambridge IELTS 19 (2024)</b> standard — same question types, length & difficulty. Real exam papers are confidential and never published; the official benchmark is the Cambridge IELTS series. Every test is labelled with its level.</div>`));
    }

    const list = el('<div></div>');
    const data = window.IELTS_DATA[active] || [];
    const scores = Store.get('scores', {})[active] || [];
    const doneIds = new Set(scores.map(x => x.id));

    if (!data.length) list.appendChild(el(`<div class="empty"><div class="big">📭</div><p>More ${active} content coming soon</p></div>`));

    data.forEach((item, i) => {
      const tab = TABS.find(t => t.key === active);
      const day = i + 1;
      const title = active === 'writing' ? `Task ${item.task} · ${item.title}` : item.title;
      const meta = active === 'reading' ? `${item.topic || ''} · ${item.words || '?'} words`
        : active === 'listening' ? (item.section || '')
        : active === 'writing' ? (item.type || '')
        : (item.topic || '');
      const li = el(`
        <div class="list-item">
          <div class="li-ic">${tab.ic}</div>
          <div class="li-main">
            <b>${esc(title)}</b>
            <div class="faint">Day ${day} · ${dateForDay(day)}${meta ? ' · ' + esc(meta) : ''}</div>
            ${(active === 'reading' || active === 'listening') ? `<div class="src-tag">📘 ${esc(item.source || 'Cambridge 19 (2024) standard')}</div>` : ''}
          </div>
          ${doneIds.has(item.id) ? '<span class="pill good">done</span>' : ''}
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
