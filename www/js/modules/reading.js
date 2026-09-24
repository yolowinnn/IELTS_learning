/* reading.js — 阅读:原创文章(文字) 或 课程包真题(原卷页图) + 题目 */
(function () {
  const DEFAULT_SRC = 'IELTS Academic Reading · Cambridge 20 (2025) standard · original practice';
  function find(id) { return (window.IELTS_DATA.reading || []).find(r => r.id === id) || (window.IELTS_DATA.reading || [])[0]; }

  // 整篇朗读:课程包条目自带 audio;内置文章看 audio_index 里的 reading 表(离线内置的 MP3)。
  function audioSrc(r) {
    if (r.audio) return r.audio;
    const idx = ((window.IELTS_DATA.audioIndex || {}).reading) || {};
    return idx[r.id] ? 'audio/reading/' + r.id + '.mp3' : '';
  }

  function render(view, id) {
    const r = find(id);
    if (!r) return empty(view, 'No reading content yet');
    view.innerHTML = '';
    const wrap = el('<div></div>');
    wrap.appendChild(el(`
      <div class="subhead">
        <button class="back" onclick="App.back()">←</button>
        <div><h2>${esc(r.title)}</h2><div class="faint">${esc(r.topic || '')}${r.words ? ' · ~' + r.words + ' words' : ''}</div><div class="src-tag">${r.pack ? '🎓' : '📘'} ${esc(r.source || DEFAULT_SRC)}</div></div>
      </div>
    `));

    const split = el('<div class="split-layout"></div>');
    const left = el('<div class="col-left"></div>');
    left.appendChild(el('<div class="col-head">📖 Passage</div>'));
    const aSrc = audioSrc(r);
    if (aSrc && window.Player) left.appendChild(Player.file({ src: aSrc, tag: '🔊 read aloud' }));
    if (r.sheets && r.sheets.length) {
      const box = el('<div class="card"></div>');
      box.appendChild(Sheets.render(r.sheets));
      left.appendChild(box);
    } else {
      const passage = el('<div class="card passage"></div>');
      (r.paras || []).forEach((p, i) => {
        passage.appendChild(el(`<p><span class="para-label">${String.fromCharCode(65 + i)}</span>${esc(p)}</p>`));
      });
      left.appendChild(passage);
    }

    const right = el('<div class="col-right"></div>');
    const qn = (r.questions || []).length;
    const qm = (r.questions || []).reduce((a, q) => a + Math.max(1, Number(q.marks) || 1), 0);
    right.appendChild(el(`<div class="col-head">✍️ Questions (${qm === qn ? qn : qn + ' · ' + qm + ' marks'})</div>`));
    if (r.questionSheets && r.questionSheets.length) {
      const sc = el('<div class="card"><div class="card-title mb8">📄 Exam paper</div></div>');
      sc.appendChild(Sheets.render(r.questionSheets));
      right.appendChild(sc);
    }
    if (r.instructions) right.appendChild(el(`<div class="notice">${esc(r.instructions)}</div>`));
    const qbox = el('<div class="card"></div>');
    right.appendChild(qbox);

    split.appendChild(left); split.appendChild(right);
    wrap.appendChild(split);
    if (r.notes && r.notes.length) {
      const c = el('<div class="card"><div class="card-title mb8">🧠 In-class points</div></div>');
      r.notes.forEach(n => c.appendChild(el(`<div class="note-row"><b>${esc(n.t || '')}</b><div>${esc(n.d || '')}</div></div>`)));
      wrap.appendChild(c);
    }
    view.appendChild(wrap);

    Quiz.render(qbox, r.questions || [], {
      onComplete: (sc, total, again) => {
        if (again) { App.back(); return; }
        Store.markTask('reading', true);
        Store.update('scores', {}, m => { (m.reading = m.reading || []).push({ id: r.id, sc, total, date: Store.todayStr() }); return m; });
        App.refreshStreak();
        Toast(`Reading done ${sc}/${total}`);
      }
    });
  }

  function empty(view, msg) { view.innerHTML = `<div class="empty"><div class="big">📖</div><p>${msg}</p><button class="btn" onclick="App.go('today')">Back</button></div>`; }

  window.Reading = { render };
})();
