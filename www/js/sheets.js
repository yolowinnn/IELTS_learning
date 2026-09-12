/* sheets.js — 原卷页图查看器(真题题目/文章/脚本按原样显示)。
   点击放大:全屏可缩放、可左右翻页;手机上也能看清小字。 */
(function () {
  function render(sheets, opts) {
    opts = opts || {};
    const list = (sheets || []).filter(s => s && s.src);
    const wrap = el('<div class="sheets"></div>');
    if (!list.length) return wrap;
    list.forEach((s, i) => {
      const fig = el('<figure class="sheet"></figure>');
      const img = el(`<img loading="lazy" src="${esc(s.src)}" alt="${esc(s.label || 'exam page')}" />`);
      img.onclick = () => open(list, i);
      fig.appendChild(img);
      fig.appendChild(el(`<figcaption>${esc(s.label || ('Page ' + (i + 1)))} · tap to zoom</figcaption>`));
      wrap.appendChild(fig);
    });
    return wrap;
  }

  function open(list, idx) {
    let i = idx, zoom = 1;
    const box = el(`
      <div class="lightbox">
        <div class="lb-bar">
          <button class="lb-btn" data-a="prev">‹</button>
          <span class="lb-label"></span>
          <button class="lb-btn" data-a="next">›</button>
          <span style="flex:1"></span>
          <button class="lb-btn" data-a="out">−</button>
          <button class="lb-btn" data-a="in">＋</button>
          <button class="lb-btn" data-a="close">✕</button>
        </div>
        <div class="lb-scroll"><img class="lb-img" /></div>
      </div>`);
    const img = box.querySelector('.lb-img');
    const label = box.querySelector('.lb-label');
    function paint() {
      img.src = list[i].src;
      img.style.width = Math.round(zoom * 100) + '%';
      label.textContent = (list[i].label || ('Page ' + (i + 1))) + `  (${i + 1}/${list.length})`;
    }
    box.onclick = (e) => {
      const a = e.target.closest('[data-a]') && e.target.closest('[data-a]').dataset.a;
      if (a === 'close' || e.target === box) { close(); return; }
      if (a === 'prev') { i = (i - 1 + list.length) % list.length; paint(); }
      if (a === 'next') { i = (i + 1) % list.length; paint(); }
      if (a === 'in') { zoom = Math.min(4, zoom + 0.35); paint(); }
      if (a === 'out') { zoom = Math.max(1, zoom - 0.35); paint(); }
    };
    function close() { box.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') { i = (i + 1) % list.length; paint(); }
      if (e.key === 'ArrowLeft') { i = (i - 1 + list.length) % list.length; paint(); }
    }
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
    paint();
  }

  window.Sheets = { render, open };
})();
