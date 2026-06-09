/* vocab.js — 单词闪卡:间隔重复复习 + 学新词 */
(function () {
  let queue = [];      // 本次会话队列 [{w, isNew}]
  let idx = 0;
  let revealed = false;
  let viewRef = null;
  let stats = { reviewed: 0, learned: 0 };

  function buildQueue() {
    const due = SRS.dueToday().map(w => ({ w, isNew: false }));
    const fresh = SRS.newToday().map(w => ({ w, isNew: true }));
    // 复习优先,穿插新词
    queue = due.concat(fresh);
    idx = 0; revealed = false; stats = { reviewed: 0, learned: 0 };
  }

  function render(view) {
    viewRef = view;
    buildQueue();
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

  function done(view, nothingDue) {
    // 标记今日单词任务完成
    Store.markTask('vocab', true);
    App.refreshStreak();
    if (!nothingDue && (stats.reviewed + stats.learned) > 0) window.Celebrate && window.Celebrate();
    view.innerHTML = '';
    const s = SRS.stats();
    view.appendChild(el(`
      <div class="empty">
        <div class="big">${nothingDue ? '🌟' : '🎉'}</div>
        <h2>${nothingDue ? '今天没有待复习的单词' : '单词练习完成！'}</h2>
        <p class="muted">本次复习 ${stats.reviewed} · 新学 ${stats.learned}<br>累计已学 ${s.learned} / ${s.total} 词,已掌握 ${s.mastered}</p>
        <div class="row" style="justify-content:center;gap:10px" class="mt16">
          <button class="btn ghost" onclick="App.go('today')">返回今日</button>
          <button class="btn" id="more">再来一组</button>
        </div>
      </div>
    `));
    const more = view.querySelector('#more');
    more.onclick = () => render(view);
    // 若确实没有可学的了,隐藏"再来一组"
    if (nothingDue && s.newAvail === 0) more.style.display = 'none';
  }

  function highlight(sentence, word) {
    try {
      const re = new RegExp('\\b(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*)\\b', 'ig');
      return esc(sentence).replace(re, '<b>$1</b>');
    } catch (e) { return esc(sentence); }
  }

  window.Vocab = { render };
})();
