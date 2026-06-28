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
      wrap.appendChild(el(`<div class="notice"><b>📘 About these materials</b><br>The newest official real papers are <b>Cambridge IELTS 20 (2025)</b> — get those from Cambridge for verbatim retired exams. The tests here are <b>original practice at Cambridge 20 standard</b>, many built on <b>topics from recent 2026 exams</b> (e.g. Australian Parrots, Marine Biodiversity, History of Pigments) and dated. Live exam papers are never published, so matching the real topics + standard is the closest legitimate option. Every test is labelled.</div>`));
    }
    if (active === 'speaking' || active === 'writing') {
      wrap.appendChild(el(`<div class="notice"><b>📋 Exam question bank (机经 / recalled)</b><br>Items tagged <b>机经</b> are <b>current & recent real exam questions reported by test-takers worldwide</b> — Speaking Part 2 (May–Aug 2026 rotation) and Writing Task 2 (2025–2026). This is the closest thing to the live exam. Practise speaking with the AI examiner, or write and get AI band feedback.</div>`));
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
            ${item.source ? `<div class="src-tag">${/机经|recalled/.test(item.source) ? '📋' : '📘'} ${esc(item.source)}</div>` : ((active === 'reading' || active === 'listening') ? `<div class="src-tag">📘 Cambridge 20 (2025) standard</div>` : '')}
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
