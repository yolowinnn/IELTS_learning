/* listening.js — 听力:TTS 朗读脚本 + 题目。原文默认遮挡。 */
(function () {
  function find(id) { return (window.IELTS_DATA.listening || []).find(l => l.id === id) || (window.IELTS_DATA.listening || [])[0]; }
  const DEFAULT_SRC = 'IELTS Academic Listening · Cambridge 20 (2025) standard · original practice';
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
        <div><h2>${esc(l.title)}</h2><div class="faint">${esc(l.section || '')} · ${esc(l.scenario || '')}</div><div class="src-tag">📘 ${esc(l.source || DEFAULT_SRC)}</div></div>
      </div>
    `));

    // 播放器
    const rate = Store.get('ttsRate', 1.0);
    const player = el(`
      <div class="card center">
        ${(!AudioFX.usingFiles(l) && !TTS.supported) ? '<div class="explain">⚠️ No built-in audio or speech synthesis here — read the transcript below.</div>' : ''}
        <button class="btn" id="play" style="width:120px;height:120px;border-radius:50%;font-size:40px;flex-direction:column">▶<small style="font-size:12px;font-weight:600">Play</small></button>
        <div class="row mt12" style="justify-content:center;gap:14px">
          <button class="btn ghost sm" id="replay">↺ Replay</button>
          <label class="faint">Speed
            <select id="rate">
              <option value="0.7">0.7×</option><option value="0.85">0.85×</option>
              <option value="1">1.0×</option><option value="1.15">1.15×</option>
            </select>
          </label>
        </div>
        <div class="bar mt16" style="height:8px"><i id="pbar" style="width:0%"></i></div>
        <div class="faint mt8" id="lc">Tap play to start</div>
      </div>
    `);
    // 双栏:左=播放器+原文,右=题目(宽屏同屏)
    const split = el('<div class="split-layout"></div>');
    const left = el('<div class="col-left"></div>');
    left.appendChild(el('<div class="col-head">🎧 Listening</div>'));
    left.appendChild(player);

    // 原文(遮挡)
    const transWrap = el(`
      <div class="card">
        <div class="spread"><div class="card-title">📝 Transcript</div><button class="btn ghost sm" id="toggleT">Show transcript</button></div>
        <div id="trans" class="hidden mt12"></div>
      </div>
    `);
    const trans = transWrap.querySelector('#trans');
    (l.lines || []).forEach(ln => {
      trans.appendChild(el(`<div class="script-line"><span class="spk">${esc(ln.speaker || '')}:</span> ${esc(ln.text)}</div>`));
    });
    left.appendChild(transWrap);

    const right = el('<div class="col-right"></div>');
    right.appendChild(el(`<div class="col-head">✍️ Questions (${(l.questions || []).length})</div>`));
    const qbox = el('<div class="card"></div>');
    right.appendChild(qbox);

    split.appendChild(left); split.appendChild(right);
    wrap.appendChild(split);
    view.appendChild(wrap);

    // 事件
    const playBtn = wrap.querySelector('#play');
    const lc = wrap.querySelector('#lc');
    const pbar = wrap.querySelector('#pbar');
    const rateSel = wrap.querySelector('#rate'); rateSel.value = String(rate);
    rateSel.onchange = () => Store.set('ttsRate', parseFloat(rateSel.value));

    const setBtn = (icon, label) => { playBtn.innerHTML = icon + '<small style="font-size:12px;font-weight:600">' + label + '</small>'; };
    function play() {
      if (playing) { AudioFX.stop(); playing = false; setBtn('▶', 'Play'); lc.textContent = 'Paused'; return; }
      playing = true; setBtn('⏸', 'Stop'); pbar.style.width = '0%';
      AudioFX.playListening(l, {
        rate: parseFloat(rateSel.value),
        onIndex: (i, n) => { lc.textContent = `Playing ${i}/${n}`; },
        onProgress: (f) => { pbar.style.width = Math.round(f * 100) + '%'; },
        onEnd: () => { playing = false; setBtn('▶', 'Replay'); pbar.style.width = '100%'; if ((lc.textContent || '').indexOf('Playing') === 0) lc.textContent = 'Finished ✓'; }
      });
    }
    playBtn.onclick = play;
    wrap.querySelector('#replay').onclick = () => { AudioFX.stop(); playing = false; pbar.style.width = '0%'; play(); };
    wrap.querySelector('#toggleT').onclick = (e) => {
      trans.classList.toggle('hidden');
      e.target.textContent = trans.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    };

    Quiz.render(qbox, l.questions || [], {
      onComplete: (sc, total, again) => {
        if (again) { App.back(); return; }
        AudioFX.stop(); playing = false;
        Store.markTask('listening', true);
        Store.update('scores', {}, m => { (m.listening = m.listening || []).push({ id: l.id, sc, total, date: Store.todayStr() }); return m; });
        App.refreshStreak();
        Toast(`Listening done ${sc}/${total}`);
      }
    });
  }

  function empty(view) { view.innerHTML = `<div class="empty"><div class="big">🎧</div><p>No listening content yet</p><button class="btn" onclick="App.go('today')">Back</button></div>`; }

  window.Listening = { render };
})();
