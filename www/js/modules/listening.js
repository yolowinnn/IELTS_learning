/* listening.js — 听力:
   ① 课程包真题:真人录音(单文件 MP3)+ 原卷题目页图 + 原文脚本页图
   ② 原创练习:TTS 朗读 lines + 文字原文
   两种内容共用同一个答题组件。 */
(function () {
  function find(id) { return (window.IELTS_DATA.listening || []).find(l => l.id === id) || (window.IELTS_DATA.listening || [])[0]; }
  const DEFAULT_SRC = 'IELTS Academic Listening · Cambridge 20 (2025) standard · original practice';
  let playing = false;

  function render(view, id) {
    const l = find(id);
    if (!l) return empty(view);
    AudioFX.stop(); playing = false;
    view.innerHTML = '';
    const wrap = el('<div></div>');
    wrap.appendChild(el(`
      <div class="subhead">
        <button class="back" onclick="App.back()">←</button>
        <div><h2>${esc(l.title)}</h2><div class="faint">${esc(l.section || '')}${l.scenario ? ' · ' + esc(l.scenario) : ''}</div><div class="src-tag">${l.pack ? '🎓' : '📘'} ${esc(l.source || DEFAULT_SRC)}</div></div>
      </div>
    `));

    const split = el('<div class="split-layout"></div>');
    const left = el('<div class="col-left"></div>');
    left.appendChild(el('<div class="col-head">🎧 Listening</div>'));
    left.appendChild(l.audio
      ? Player.file({ src: l.audio, markers: l.markers, tag: 'real exam audio' })
      : ttsPlayer(l, wrap));

    // 原文:课程包给页图,原创内容给文字
    const hasScript = (l.transcriptSheets && l.transcriptSheets.length) || (l.lines && l.lines.length);
    if (hasScript) {
      const transWrap = el(`
        <div class="card">
          <div class="spread"><div class="card-title">📝 Transcript</div><button class="btn ghost sm" id="toggleT">Show transcript</button></div>
          <div id="trans" class="hidden mt12"></div>
        </div>`);
      const trans = transWrap.querySelector('#trans');
      if (l.transcriptSheets && l.transcriptSheets.length) trans.appendChild(Sheets.render(l.transcriptSheets));
      else (l.lines || []).forEach(ln => trans.appendChild(el(`<div class="script-line"><span class="spk">${esc(ln.speaker || '')}:</span> ${esc(ln.text)}</div>`)));
      transWrap.querySelector('#toggleT').onclick = (e) => {
        trans.classList.toggle('hidden');
        e.target.textContent = trans.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
      };
      left.appendChild(transWrap);
    }

    const right = el('<div class="col-right"></div>');
    const qn = (l.questions || []).length;
    const qm = (l.questions || []).reduce((a, q) => a + Math.max(1, Number(q.marks) || 1), 0);
    right.appendChild(el(`<div class="col-head">✍️ Questions (${qm === qn ? qn : qn + ' · ' + qm + ' marks'})</div>`));
    if (l.sheets && l.sheets.length) {
      const sc = el('<div class="card"><div class="card-title mb8">📄 Exam paper</div></div>');
      sc.appendChild(Sheets.render(l.sheets));
      right.appendChild(sc);
    }
    if (l.instructions) right.appendChild(el(`<div class="notice">${esc(l.instructions)}</div>`));
    const qbox = el('<div class="card"></div>');
    right.appendChild(qbox);

    split.appendChild(left); split.appendChild(right);
    wrap.appendChild(split);
    if (l.notes && l.notes.length) wrap.appendChild(notesCard(l.notes));
    view.appendChild(wrap);

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

  // 真题录音播放器已抽到 js/player.js(Player.file),阅读朗读 / 写作范文共用同一个:
  // 整段下完才播,网速慢也不会播到一半断掉。

  // ---- 原创内容:TTS 逐句朗读 ----
  function ttsPlayer(l, wrap) {
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
      </div>`);
    App.onLeave(() => { playing = false; AudioFX.stop(); });
    const playBtn = player.querySelector('#play');
    const lc = player.querySelector('#lc');
    const pbar = player.querySelector('#pbar');
    const rateSel = player.querySelector('#rate'); rateSel.value = String(rate);
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
    player.querySelector('#replay').onclick = () => { AudioFX.stop(); playing = false; pbar.style.width = '0%'; play(); };
    return player;
  }

  function notesCard(notes) {
    const c = el('<div class="card"><div class="card-title mb8">🧠 In-class points</div></div>');
    notes.forEach(n => c.appendChild(el(`<div class="note-row"><b>${esc(n.t || '')}</b><div>${esc(n.d || '')}</div></div>`)));
    return c;
  }

  function empty(view) { view.innerHTML = `<div class="empty"><div class="big">🎧</div><p>No listening content yet</p><button class="btn" onclick="App.go('today')">Back</button></div>`; }

  window.Listening = { render };
})();
