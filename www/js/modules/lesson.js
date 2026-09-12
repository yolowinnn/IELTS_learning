/* lesson.js — 课程页:每次上完课的内容包在这里一站式打开
   听力(真题录音+原卷) · 阅读(原卷) · 本节生词 · 老师讲的技巧/同义替换 · 课后作业打卡 */
(function () {
  function fmtDate(d) {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch (e) { return d; }
  }

  // ---- 课程列表(Practice → Lessons) ----
  function list(view) {
    const packs = Packs.list();
    const wrap = el('<div></div>');
    wrap.appendChild(el(`<div class="notice"><b>🎓 My classes</b><br>Everything from each lesson: the real exam audio, the exam paper, the words, and the homework. New packs arrive automatically after each class — pull down "Check for new lessons" in Profile if you are impatient.</div>`));
    if (!packs.length) {
      wrap.appendChild(el(`<div class="empty"><div class="big">🎓</div><p>No lesson packs yet</p></div>`));
      view.appendChild(wrap); return;
    }
    const box = el('<div class="li-grid"></div>');
    packs.forEach(p => {
      const c = p.counts || {};
      const bits = [];
      if (c.listening) bits.push(`🎧 ${c.listening}`);
      if (c.reading) bits.push(`📖 ${c.reading}`);
      if (c.vocab) bits.push(`🗂️ ${c.vocab} words`);
      if (c.writing) bits.push(`✍️ ${c.writing}`);
      if (c.speaking) bits.push(`🗣️ ${c.speaking}`);
      const item = el(`
        <div class="list-item">
          <div class="li-ic">🎓</div>
          <div class="li-main">
            <b>${esc(p.title)}</b>
            <div class="faint">${esc(fmtDate(p.date))} · ${bits.join(' · ')}</div>
            ${p.source ? `<div class="src-tag">🎓 ${esc(p.source)}</div>` : ''}
          </div>
          <div class="li-arrow">›</div>
        </div>`);
      item.onclick = () => App.open('lesson', p.id);
      box.appendChild(item);
    });
    wrap.appendChild(box);
    view.appendChild(wrap);
  }

  // ---- 单个课程包 ----
  function render(view, id) {
    const packs = Packs.list();
    const info = (id && Packs.get(id)) || packs[0];
    if (!info) { view.innerHTML = `<div class="empty"><div class="big">🎓</div><p>No lesson packs yet</p><button class="btn" onclick="App.go('today')">Back</button></div>`; return; }
    const p = info.pack;
    view.innerHTML = '';
    const wrap = el('<div></div>');
    wrap.appendChild(el(`
      <div class="subhead">
        <button class="back" onclick="App.back()">←</button>
        <div><h2>${esc(p.title || info.id)}</h2><div class="faint">${esc(fmtDate(p.date))}${p.teacher ? ' · ' + esc(p.teacher) : ''}</div>${p.source ? `<div class="src-tag">🎓 ${esc(p.source)}</div>` : ''}</div>
      </div>`));

    if (p.summary) wrap.appendChild(el(`<div class="notice">${esc(p.summary)}</div>`));

    // 练习入口
    const doBox = el('<div class="card"><div class="card-title mb8">📚 Practise what you did in class</div></div>');
    let n = 0;
    (p.listening || []).forEach(x => { doBox.appendChild(itemRow('🎧', x, 'listening')); n++; });
    (p.reading || []).forEach(x => { doBox.appendChild(itemRow('📖', x, 'reading')); n++; });
    (p.writing || []).forEach(x => { doBox.appendChild(itemRow('✍️', x, 'writing')); n++; });
    (p.speaking || []).forEach(x => { doBox.appendChild(itemRow('🗣️', x, 'speaking')); n++; });
    if (n) wrap.appendChild(doBox);

    // 本节生词
    const words = (window.IELTS_DATA.vocab || []).filter(w => w.pack === info.id);
    if (words.length) {
      const learned = words.filter(w => SRS.getState(w.id)).length;
      const vc = el(`
        <div class="card">
          <div class="spread mb8"><div class="card-title">🗂️ Words from this class</div><span class="pill ${learned >= words.length ? 'good' : 'accent'}">${learned}/${words.length}</span></div>
          <div class="faint mb8">${esc(words.slice(0, 8).map(w => w.word).join(' · '))}${words.length > 8 ? ' …' : ''}</div>
          <button class="btn block" id="studyWords">Study these ${words.length} words →</button>
        </div>`);
      vc.querySelector('#studyWords').onclick = () => {
        if (window.Vocab && Vocab.startSession) Vocab.startSession(view, words);
      };
      wrap.appendChild(vc);
    }

    // 老师讲的点
    if (p.notes && p.notes.length) {
      const c = el('<div class="card"><div class="card-title mb8">🧠 In-class points</div></div>');
      p.notes.forEach(nt => c.appendChild(el(`<div class="note-row"><b>${esc(nt.t || '')}</b><div>${esc(nt.d || '')}</div></div>`)));
      wrap.appendChild(c);
    }

    // 同义替换(听力/阅读最值钱的东西)
    if (p.synonyms && p.synonyms.length) {
      const c = el('<div class="card"><div class="card-title mb8">🔁 Paraphrase pairs</div><div class="faint mb8">Exam wording ← → what you actually hear or read.</div></div>');
      p.synonyms.forEach(s => c.appendChild(el(
        `<div class="syn-row"><span class="syn-a">${esc(s.q || s.a)}</span><span class="syn-arrow">≈</span><span class="syn-b">${esc(s.src || s.b)}</span>${s.note ? `<div class="faint" style="flex-basis:100%">${esc(s.note)}</div>` : ''}</div>`)));
      wrap.appendChild(c);
    }

    // 课后作业
    if (p.homework && p.homework.length) {
      const done = Store.get('lessonHw', {})[info.id] || {};
      const c = el('<div class="card"><div class="card-title mb8">✅ Homework</div><div id="hw"></div></div>');
      const box = c.querySelector('#hw');
      p.homework.forEach((h, i) => {
        const text = typeof h === 'string' ? h : h.t;
        const row = el(`<label class="hw-row"><input type="checkbox" ${done[i] ? 'checked' : ''}/><span>${esc(text)}</span></label>`);
        row.querySelector('input').onchange = (e) => {
          Store.update('lessonHw', {}, m => {
            m[info.id] = m[info.id] || {};
            m[info.id][i] = e.target.checked;
            return m;
          });
          const all = Store.get('lessonHw', {})[info.id] || {};
          if (p.homework.every((_, k) => all[k])) { Store.markTask('review', true); Toast('Homework done 🎉'); App.refreshStreak(); }
        };
        box.appendChild(row);
      });
      wrap.appendChild(c);
    }

    view.appendChild(wrap);
  }

  function marksOf(x) {
    return (x.questions || []).reduce((a, q) => a + (Math.max(1, Number(q.marks) || 1)), 0);
  }

  function itemRow(ic, x, mod) {
    const scores = Store.get('scores', {})[mod] || [];
    const best = scores.filter(s => s.id === x.id).sort((a, b) => b.sc - a.sc)[0];
    const row = el(`
      <div class="list-item">
        <div class="li-ic">${ic}</div>
        <div class="li-main"><b>${esc(x.title)}</b><div class="faint">${esc(x.section || x.topic || x.type || '')}${x.questions && x.questions.length ? ' · ' + marksOf(x) + ' marks' : ''}</div></div>
        ${best ? `<span class="pill good">${best.sc}/${best.total}</span>` : ''}
        <div class="li-arrow">›</div>
      </div>`);
    row.onclick = () => App.open(mod, x.id);
    return row;
  }

  window.Lesson = { render, list };
})();
