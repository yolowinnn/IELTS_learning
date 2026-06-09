/* reading.js — 阅读:学术文章 + 题目 */
(function () {
  function find(id) { return (window.IELTS_DATA.reading || []).find(r => r.id === id) || (window.IELTS_DATA.reading || [])[0]; }

  function render(view, id) {
    const r = find(id);
    if (!r) return empty(view, '暂无阅读内容');
    view.innerHTML = '';
    const wrap = el('<div></div>');
    wrap.appendChild(el(`
      <div class="subhead">
        <button class="back" onclick="App.back()">←</button>
        <div><h2>${esc(r.title)}</h2><div class="faint">${esc(r.topic || '')} · 约 ${r.words || '?'} 词</div></div>
      </div>
    `));

    // 双栏:左文章 / 右题目(宽屏同屏,窄屏堆叠)
    const split = el('<div class="split-layout"></div>');
    const left = el('<div class="col-left"></div>');
    left.appendChild(el('<div class="col-head">📖 阅读文章</div>'));
    const passage = el('<div class="card passage"></div>');
    (r.paras || []).forEach((p, i) => {
      passage.appendChild(el(`<p><span class="para-label">${String.fromCharCode(65 + i)}</span>${esc(p)}</p>`));
    });
    left.appendChild(passage);

    const right = el('<div class="col-right"></div>');
    right.appendChild(el(`<div class="col-head">✍️ 题目 (${(r.questions || []).length})</div>`));
    const qbox = el('<div class="card"></div>');
    right.appendChild(qbox);

    split.appendChild(left); split.appendChild(right);
    wrap.appendChild(split);
    view.appendChild(wrap);

    Quiz.render(qbox, r.questions || [], {
      onComplete: (sc, total, again) => {
        if (again) { App.back(); return; }
        Store.markTask('reading', true);
        Store.update('scores', {}, m => { (m.reading = m.reading || []).push({ id: r.id, sc, total, date: Store.todayStr() }); return m; });
        App.refreshStreak();
        Toast(`阅读完成 ${sc}/${total}`);
      }
    });
  }

  function empty(view, msg) { view.innerHTML = `<div class="empty"><div class="big">📖</div><p>${msg}</p><button class="btn" onclick="App.go('today')">返回</button></div>`; }

  window.Reading = { render };
})();
