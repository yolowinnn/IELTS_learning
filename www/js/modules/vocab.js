/* vocab.js — 单词闪卡:间隔重复复习 + 学新词 */
(function () {
  let queue = [];      // 本次会话队列 [{w, isNew}]
  let idx = 0;
  let revealed = false;
  let viewRef = null;
  let curMode = 'daily';
  let stats = { reviewed: 0, learned: 0 };

  function buildQueue(mode) {
    curMode = mode || 'daily';
    if (curMode === 'more') {
      queue = SRS.moreNew(20).map(w => ({ w, isNew: true }));            // 不限量学新词(含之前漏背的)
    } else if (curMode === 'review') {
      queue = SRS.reviewPool(20).map(w => ({ w, isNew: false }));        // 复习已学过的词(不只到期的)
    } else {
      const due = SRS.dueToday().map(w => ({ w, isNew: false }));
      const fresh = SRS.newToday().map(w => ({ w, isNew: true }));
      queue = due.concat(fresh);
    }
    idx = 0; revealed = false; stats = { reviewed: 0, learned: 0 };
  }

  function render(view, mode) {
    if (!mode || mode === 'menu') return renderMenu(view);
    viewRef = view;
    buildQueue(mode);
    if (!queue.length) return done(view, true);
    paint();
  }

  // 指定一组单词开练(按天浏览用)
  function startSession(view, words) {
    viewRef = view; curMode = 'day';
    queue = (words || []).map(w => ({ w, isNew: !SRS.getState(w.id) }));
    idx = 0; revealed = false; stats = { reviewed: 0, learned: 0 };
    if (!queue.length) return done(view, true);
    paint();
  }

  function groupByDay() {
    const map = {};
    SRS.allWords().forEach(w => { const d = w.day || 1; (map[d] = map[d] || []).push(w); });
    const start = Store.startDate();
    return Object.keys(map).map(Number).sort((a, b) => a - b).map(day => {
      const words = map[day];
      const dt = new Date(start + 'T00:00:00'); dt.setDate(dt.getDate() + (day - 1));
      let date; try { date = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch (e) { date = (dt.getMonth() + 1) + '/' + dt.getDate(); }
      const topics = [...new Set(words.map(w => w.topic).filter(Boolean))].slice(0, 3).join(' · ');
      const learned = words.filter(w => SRS.getState(w.id)).length;
      return { day, date, topics, total: words.length, learned, words };
    });
  }

  // 单词页菜单:今日 + 按天浏览
  function renderMenu(view) {
    viewRef = view; view.innerHTML = '';
    const s = SRS.stats();
    const wrap = el('<div></div>');
    wrap.appendChild(el(`
      <div class="card">
        <div class="card-title mb8">🗂️ Today's Vocabulary</div>
        <div class="stat-grid">
          <div class="stat"><b style="color:var(--warn)">${s.due}</b><small>Due review</small></div>
          <div class="stat"><b style="color:var(--brand)">${s.newAvail}</b><small>New today</small></div>
        </div>
        <button class="btn block mt12" id="startToday">Start today's words →</button>
        <div class="row mt8" style="gap:8px">
          <button class="btn ghost" id="more" style="flex:1">Keep learning</button>
          <button class="btn ghost" id="review" style="flex:1">Review (${s.learned})</button>
        </div>
      </div>`));
    wrap.appendChild(el(`<div class="card"><div class="card-title mb8">📊 Progress</div><div class="stat-grid"><div class="stat"><b>${s.learned}/${s.total}</b><small>Learned</small></div><div class="stat"><b>${s.mastered}</b><small>Mastered</small></div></div></div>`));
    const list = el('<div class="card"><div class="card-title mb8">📅 Browse by day</div><div class="faint mb8">Pick any day to study or revise — catch up on days you missed.</div><div id="dayList"></div></div>');
    const dl = list.querySelector('#dayList');
    groupByDay().forEach(d => {
      const item = el(`<div class="list-item"><div class="li-ic">📘</div><div class="li-main"><b>Day ${d.day} · ${esc(d.date)}</b><div class="faint">${esc(d.topics || '')} · ${d.total} words · ${d.learned} learned</div></div>${d.learned >= d.total ? '<span class="pill good">done</span>' : ''}<div class="li-arrow">›</div></div>`);
      item.onclick = () => startSession(view, d.words);
      dl.appendChild(item);
    });
    wrap.appendChild(list);
    view.appendChild(wrap);
    wrap.querySelector('#startToday').onclick = () => render(view, 'daily');
    wrap.querySelector('#more').onclick = () => render(view, 'more');
    wrap.querySelector('#review').onclick = () => render(view, 'review');
  }

  function paint() {
    const view = viewRef;
    if (idx >= queue.length) return done(view, false);
    const { w, isNew } = queue[idx];
    const remain = queue.length - idx;
    revealed = false;
    view.innerHTML = '';

    const wrap = el('<div></div>');
    // 进度条 + 标签
    const total = queue.length;
    wrap.appendChild(el(`
      <div class="spread mb8">
        <div class="pill ${isNew ? 'accent' : 'warn'}">${isNew ? '🆕 新词' : '🔁 复习'}</div>
        <div class="faint">${total - remain + 1} / ${total} · ${esc(w.topic || '通用')}</div>
      </div>
      <div class="bar mb8" style="height:6px"><i style="width:${Math.round((total - remain) / total * 100)}%"></i></div>
    `));

    const card = el(`
      <div class="flash">
        <div class="flip" id="flip">
          <div class="flip-inner">
            <div class="flip-face flip-front">
              <div class="word">${esc(w.word)}</div>
              <div class="ipa">${esc(w.ipa || '')}<span class="say-btn" id="say">🔊</span></div>
              <div class="pos">${esc(w.pos || '')}</div>
              <div class="tap-hint">👆 点击卡片查看释义</div>
            </div>
            <div class="flip-face flip-back">
              <div class="def">${esc(w.def_en || '')}</div>
              <div class="def-zh">${esc(w.def_zh || '')}</div>
              ${w.example ? `<div class="ex">"${highlight(w.example, w.word)}"</div>` : ''}
              ${w.synonyms ? `<div class="syn">近义:${esc(w.synonyms)}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `);
    wrap.appendChild(card);

    const footer = el('<div id="vfooter"></div>');
    const revealBtn = el('<button class="btn block mt16">显示释义</button>');
    footer.appendChild(revealBtn);
    wrap.appendChild(footer);
    view.appendChild(wrap);

    const flip = wrap.querySelector('#flip');
    const doFlip = () => {
      if (revealed) return;
      revealed = true;
      flip.classList.add('flipped');
      footer.innerHTML = '';
      const gr = el(`
        <div class="grade-row pop-in">
          <button class="btn bad"  data-q="0">忘记<small>&lt;1天</small></button>
          <button class="btn ghost" data-q="3">困难<small>较短</small></button>
          <button class="btn" data-q="4">记得<small>正常</small></button>
          <button class="btn good" data-q="5">简单<small>更久</small></button>
        </div>`);
      footer.appendChild(gr);
      gr.querySelectorAll('[data-q]').forEach(b => b.onclick = () => gradeCurrent(parseInt(b.dataset.q, 10)));
    };
    revealBtn.onclick = doFlip;
    flip.onclick = doFlip;

    const say = wrap.querySelector('#say');
    if (say) say.onclick = (e) => { e.stopPropagation(); AudioFX.speakWord(w.id, w.word, 0.95); };
    if (Store.get('autoSpeak', true)) AudioFX.speakWord(w.id, w.word, 0.95);
  }

  function gradeCurrent(q) {
    const { w, isNew } = queue[idx];
    SRS.grade(w.id, q);
    if (isNew) { SRS.countNewLearned(); stats.learned++; } else { stats.reviewed++; }
    idx++; revealed = false;
    paint();
  }

  function done(view, nothingEmpty) {
    // 标记今日单词任务完成
    Store.markTask('vocab', true);
    App.refreshStreak();
    if (!nothingEmpty && (stats.reviewed + stats.learned) > 0) window.Celebrate && window.Celebrate();
    view.innerHTML = '';
    const s = SRS.stats();
    const allDone = s.moreAvail === 0;
    const head = nothingEmpty
      ? (curMode === 'review' ? 'No words to review yet' : (curMode === 'more' ? 'You have learned the whole deck 🎓' : "Today's review & new words are done 👍"))
      : 'Set complete!';
    const btns = [];
    if (s.moreAvail > 0) btns.push(`<button class="btn block" id="more">Keep learning (${s.moreAvail} left)</button>`);
    if (s.learned > 0) btns.push(`<button class="btn ghost block" id="review">Review learned (${s.learned})</button>`);
    btns.push(`<button class="btn ghost block" id="menu">Back to vocabulary</button>`);
    view.appendChild(el(`
      <div class="empty">
        <div class="big">${allDone ? '🎓' : '🎉'}</div>
        <h2>${head}</h2>
        <p class="muted">This set · reviewed ${stats.reviewed} · new ${stats.learned}<br>Learned ${s.learned}/${s.total} · mastered ${s.mastered} · due ${s.due}</p>
        <div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:18px auto 0">${btns.join('')}</div>
      </div>
    `));
    const more = view.querySelector('#more'); if (more) more.onclick = () => render(view, 'more');
    const review = view.querySelector('#review'); if (review) review.onclick = () => render(view, 'review');
    view.querySelector('#menu').onclick = () => renderMenu(view);
  }

  function highlight(sentence, word) {
    try {
      const re = new RegExp('\\b(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*)\\b', 'ig');
      return esc(sentence).replace(re, '<b>$1</b>');
    } catch (e) { return esc(sentence); }
  }

  window.Vocab = { render };
})();
