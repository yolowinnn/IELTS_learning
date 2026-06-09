/* listening.js — 听力:TTS 朗读脚本 + 题目。原文默认遮挡。 */
(function () {
  function find(id) { return (window.IELTS_DATA.listening || []).find(l => l.id === id) || (window.IELTS_DATA.listening || [])[0]; }
  let playing = false;

  function render(view, id) {
    const l = find(id);
    if (!l) return empty(view);
    AudioFX.stop(); playing = false;
    view.innerHTML = '';
    App.onLeave(() => { playing = false; AudioFX.stop(); });
    const wrap = el('<div></div>');
    wrap.appendChild(el(`
      <div class="subhead">
        <button class="back" onclick="App.back()">←</button>
        <div><h2>${esc(l.title)}</h2><div class="faint">${esc(l.section || '')} · ${esc(l.scenario || '')}</div></div>
      </div>
    `));

    // 播放器
    const rate = Store.get('ttsRate', 1.0);
    const player = el(`
      <div class="card center">
        ${(!AudioFX.usingFiles(l) && !TTS.supported) ? '<div class="explain">⚠️ 本机暂无内置音频且不支持语音合成,可直接看原文。</div>' : ''}
        <button class="btn" id="play" style="width:120px;height:120px;border-radius:50%;font-size:40px;flex-direction:column">▶<small style="font-size:12px;font-weight:600">播放</small></button>
        <div class="row mt12" style="justify-content:center;gap:14px">
          <button class="btn ghost sm" id="replay">↺ 重听</button>
          <label class="faint">语速
            <select id="rate">
              <option value="0.7">0.7×</option><option value="0.85">0.85×</option>
              <option value="1">1.0×</option><option value="1.15">1.15×</option>
            </select>
          </label>
        </div>
        <div class="faint mt8" id="lc"></div>
      </div>
    `);
    // 双栏:左=播放器+原文,右=题目(宽屏同屏)
    const split = el('<div class="split-layout"></div>');
    const left = el('<div class="col-left"></div>');
    left.appendChild(el('<div class="col-head">🎧 听力</div>'));
    left.appendChild(player);

    // 原文(遮挡)
    const transWrap = el(`
      <div class="card">
        <div class="spread"><div class="card-title">📝 听力原文</div><button class="btn ghost sm" id="toggleT">显示原文</button></div>
        <div id="trans" class="hidden mt12"></div>
      </div>
    `);
    const trans = transWrap.querySelector('#trans');
    (l.lines || []).forEach(ln => {
      trans.appendChild(el(`<div class="script-line"><span class="spk">${esc(ln.speaker || '')}:</span> ${esc(ln.text)}</div>`));
    });
    left.appendChild(transWrap);

    const right = el('<div class="col-right"></div>');
    right.appendChild(el(`<div class="col-head">✍️ 题目 (${(l.questions || []).length})</div>`));
    const qbox = el('<div class="card"></div>');
    right.appendChild(qbox);

    split.appendChild(left); split.appendChild(right);
    wrap.appendChild(split);
    view.appendChild(wrap);

    // 事件
    const playBtn = wrap.querySelector('#play');
    const lc = wrap.querySelector('#lc');
    const rateSel = wrap.querySelector('#rate'); rateSel.value = String(rate);
    rateSel.onchange = () => Store.set('ttsRate', parseFloat(rateSel.value));

    const setBtn = (icon, label) => { playBtn.innerHTML = icon + '<small style="font-size:12px;font-weight:600">' + label + '</small>'; };
    function play() {
      if (playing) { AudioFX.stop(); playing = false; setBtn('▶', '播放'); lc.textContent = ''; return; }
      playing = true; setBtn('⏸', '停止');
      AudioFX.playListening(l, {
        rate: parseFloat(rateSel.value),
        onIndex: (i, n) => { lc.textContent = `播放中 ${i}/${n}`; },
        onEnd: () => { playing = false; setBtn('▶', '重播'); if ((lc.textContent || '').indexOf('播放中') === 0) lc.textContent = '播放完毕'; }
      });
    }
    playBtn.onclick = play;
    wrap.querySelector('#replay').onclick = () => { AudioFX.stop(); playing = false; play(); };
    wrap.querySelector('#toggleT').onclick = (e) => {
      trans.classList.toggle('hidden');
      e.target.textContent = trans.classList.contains('hidden') ? '显示原文' : '隐藏原文';
    };

    Quiz.render(qbox, l.questions || [], {
      onComplete: (sc, total, again) => {
        if (again) { App.back(); return; }
        AudioFX.stop(); playing = false;
        Store.markTask('listening', true);
        Store.update('scores', {}, m => { (m.listening = m.listening || []).push({ id: l.id, sc, total, date: Store.todayStr() }); return m; });
        App.refreshStreak();
        Toast(`听力完成 ${sc}/${total}`);
      }
    });
  }

  function empty(view) { view.innerHTML = `<div class="empty"><div class="big">🎧</div><p>暂无听力内容</p><button class="btn" onclick="App.go('today')">返回</button></div>`; }

  window.Listening = { render };
})();
