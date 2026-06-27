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
    viewRef = view;
    buildQueue(mode);
    if (!queue.length) return done(view, true);
    paint();
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
      ? (curMode === 'review' ? '没有可复习的单词了' : (curMode === 'more' ? '词库已全部学过 🎓' : '今日复习与新词都完成了 👍'))
      : '这一组完成！';
    const btns = [];
    if (s.moreAvail > 0) btns.push(`<button class="btn block" id="more">继续学新词(库里还剩 ${s.moreAvail} 个)</button>`);
    if (s.learned > 0) btns.push(`<button class="btn ghost block" id="review">复习已学单词(${s.learned} 个)</button>`);
    btns.push(`<button class="btn ghost block" id="back">返回今日</button>`);
    view.appendChild(el(`
      <div class="empty">
        <div class="big">${allDone ? '🎓' : '🎉'}</div>
        <h2>${head}</h2>
        <p class="muted">本组 · 复习 ${stats.reviewed} · 新学 ${stats.learned}<br>累计已学 ${s.learned} / ${s.total},已掌握 ${s.mastered},待复习 ${s.due}</p>
        <div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:18px auto 0">${btns.join('')}</div>
      </div>
    `));
    const more = view.querySelector('#more'); if (more) more.onclick = () => render(view, 'more');
    const review = view.querySelector('#review'); if (review) review.onclick = () => render(view, 'review');
    view.querySelector('#back').onclick = () => App.go('today');
  }

  function highlight(sentence, word) {
    try {
      const re = new RegExp('\\b(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*)\\b', 'ig');
      return esc(sentence).replace(re, '<b>$1</b>');
    } catch (e) { return esc(sentence); }
  }

  window.Vocab = { render };
})();
