/* speaking.js — 口语:每日主题 Part1/2/3 + 题卡计时 + 录音回放 + 跳 Gemini */
(function () {
  function find(id) { return (window.IELTS_DATA.speaking || []).find(s => s.id === id) || (window.IELTS_DATA.speaking || [])[0]; }

  function render(view, id) {
    const s = find(id);
    if (!s) return empty(view);
    view.innerHTML = '';
    const wrap = el('<div></div>');
    wrap.appendChild(el(`
      <div class="subhead">
        <button class="back" onclick="App.back()">←</button>
        <div><h2>口语 · ${esc(s.title)}</h2><div class="faint">主题:${esc(s.topic || '')}</div></div>
      </div>
    `));

    // Gemini 练习卡(置顶,核心)
    const gp = s.gemini_prompt || defaultGeminiPrompt(s);
    const gcard = el(`
      <div class="card" style="background:linear-gradient(135deg,#1e293b,#164e3b);border-color:#10b981">
        <div class="card-title mb8">🔗 或:跳转 Gemini App 对练(备用)</div>
        <div class="faint mb8">没有麦克风/想用手机 Gemini 时:点按钮复制"考官提示词"并打开 Gemini,粘贴发送即可。</div>
        <div class="row" style="gap:8px">
          <button class="btn good" id="gemini" style="flex:1">复制提示词并打开 Gemini</button>
          <button class="btn ghost" id="copyOnly">仅复制</button>
        </div>
        <details class="mt8"><summary class="faint">查看提示词</summary><div class="phrase mt8">${esc(gp)}</div></details>
      </div>
    `);
    wrap.appendChild(liveCard(s));
    wrap.appendChild(gcard);

    // Part 1
    if (s.intro_questions && s.intro_questions.length) {
      wrap.appendChild(section('🗣️ Part 1 · 热身问答', s.intro_questions.map(q => qLine(q))));
    }

    // Part 2 题卡
    if (s.cue_card) {
      const cc = el(`
        <div class="card">
          <div class="card-title mb8">🎴 Part 2 · 题卡</div>
          <div style="font-weight:600">${esc(s.cue_card.prompt)}</div>
          <div class="mt8">${(s.cue_card.bullets || []).map(b => `<div class="phrase">• ${esc(b)}</div>`).join('')}</div>
          <div class="row mt12" style="gap:8px">
            <button class="btn ghost" id="prep" style="flex:1">⏱️ 1分钟准备</button>
            <button class="btn" id="talk" style="flex:1">🎙️ 2分钟陈述</button>
          </div>
          <div class="center mt8 faint" id="cueTimer"></div>
        </div>
      `);
      wrap.appendChild(cc);
    }

    // Part 3
    if (s.part3_questions && s.part3_questions.length) {
      wrap.appendChild(section('💬 Part 3 · 深入讨论', s.part3_questions.map(q => qLine(q))));
    }

    // 录音回放
    wrap.appendChild(recorderCard());

    // 实用句型
    if (s.useful_phrases && s.useful_phrases.length) {
      const p = el(`<div class="card"><div class="card-title mb8">💡 高分句型</div><div></div></div>`);
      const body = p.querySelector('div:last-child');
      s.useful_phrases.forEach(ph => body.appendChild(el(`<div class="phrase">${esc(ph.en || ph)}${ph.zh ? `<span class="ph-zh">${esc(ph.zh)}</span>` : ''}</div>`)));
      wrap.appendChild(p);
    }

    // 范例
    if (s.sample_answer) {
      const m = el(`<div class="card"><div class="spread"><div class="card-title">⭐ 参考范例</div><button class="btn ghost sm" id="sm">显示</button></div><div id="smBody" class="hidden mt12 passage">${s.sample_answer.split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join('')}</div></div>`);
      m.querySelector('#sm').onclick = (e) => { const b = m.querySelector('#smBody'); b.classList.toggle('hidden'); e.target.textContent = b.classList.contains('hidden') ? '显示' : '隐藏'; };
      wrap.appendChild(m);
    }

    // 完成
    wrap.appendChild(el(`<button class="btn block mt8" id="done">标记口语完成 ✅</button>`));
    view.appendChild(wrap);

    // ---- 事件 ----
    wrap.querySelectorAll('[data-say]').forEach(b => b.onclick = () => TTS.speak(b.dataset.say, { rate: 0.95 }));

    wrap.querySelector('#gemini').onclick = async () => {
      await copy(gp);
      Toast('提示词已复制,正在打开 Gemini');
      openGemini();
    };
    wrap.querySelector('#copyOnly').onclick = async () => { await copy(gp); Toast('提示词已复制 ✅'); };

    // 题卡计时
    if (s.cue_card) {
      const ct = wrap.querySelector('#cueTimer');
      let timerId = null;
      App.onLeave(() => clearInterval(timerId));
      const run = (secs, label, after) => {
        clearInterval(timerId); let r = secs;
        const tick = () => { ct.textContent = `${label} ${String(Math.floor(r / 60)).padStart(2, '0')}:${String(r % 60).padStart(2, '0')}`; if (r-- <= 0) { clearInterval(timerId); ct.textContent = label + ' 结束 ✅'; after && after(); } };
        tick(); timerId = setInterval(tick, 1000);
      };
      wrap.querySelector('#prep').onclick = () => run(60, '准备中', () => Toast('开始陈述!'));
      wrap.querySelector('#talk').onclick = () => run(120, '陈述中');
    }

    wrap.querySelector('#done').onclick = () => {
      Store.markTask('speaking', true);
      Store.update('scores', {}, mp => { (mp.speaking = mp.speaking || []).push({ id: s.id, date: Store.todayStr() }); return mp; });
      App.refreshStreak(); Toast('口语完成 ✅'); App.go('today');
    };
  }

  // 实时 AI 对练:语音识别 → /api/gemini(Vertex Gemini 考官)→ 朗读
  function liveCard(s) {
    const topic = s.topic || s.title || '';
    const conv = [];      // {role:'user'|'assistant', text}  (text history)
    const audios = [];    // {data(base64), mimeType, url}    (for replay + scoring)
    let busy = false, recorder = null, stream = null, chunks = [], recTimer = null, recStart = 0;

    const card = el(`
      <div class="card" style="background:linear-gradient(135deg,#064e3b,#065f46);border:1px solid #34d399;color:#eafff5">
        <div class="card-title mb8" style="color:#fff">🎙️ Live AI Examiner · Gemini</div>
        <div class="faint" style="color:#a7f3d0">A real IELTS-style mock: the examiner speaks, you answer out loud, and it scores your real voice & pronunciation.</div>
        <div id="liveLog" class="live-log"></div>
        <div id="liveControls" class="mt12"></div>
        <div class="faint mt8" id="liveStatus" style="color:#a7f3d0"></div>
      </div>
    `);
    const logEl = card.querySelector('#liveLog');
    const controls = card.querySelector('#liveControls');
    const setStatus = (t) => { card.querySelector('#liveStatus').innerHTML = t || ''; };
    function addLog(who, text, me, audioUrl) {
      const m = el(`<div class="lv-msg ${me ? 'lv-me' : 'lv-ex'}"><b>${esc(who)}</b><span>${esc(text)}</span></div>`);
      if (audioUrl) { const b = el(`<button class="lv-replay">▶</button>`); b.onclick = () => { const a = new Audio(audioUrl); a.play(); }; m.appendChild(b); }
      logEl.appendChild(m); logEl.scrollTop = logEl.scrollHeight; return m;
    }
    function speak(text, done) {
      try { if (window.TTS && TTS.supported) { TTS.cancel(); TTS.speak(text, { voice: TTS.pickVoice('en-GB'), rate: 0.98 }).then(done); } else done && done(); }
      catch (e) { done && done(); }
    }

    // 控制区:不同阶段不同按钮
    function showStart() { controls.innerHTML = ''; const b = el('<button class="btn good block">▶ Start mock test</button>'); b.onclick = begin; controls.appendChild(b); }
    function showAnswer() {
      controls.innerHTML = '';
      const rec = el('<button class="btn block" id="recBtn">🎤 Record your answer</button>');
      const fin = el('<button class="btn ghost block mt8" id="finBtn">Finish & get my score</button>');
      rec.onclick = toggleRecord; fin.onclick = finishScore;
      controls.appendChild(rec); controls.appendChild(fin);
    }

    async function begin() {
      controls.innerHTML = '';
      speak('Let\'s begin.');   // 用户手势内解锁 TTS
      let n = 3; setStatus('<b style="font-size:28px;color:#fff">' + n + '</b>');
      const t = setInterval(() => { n--; if (n > 0) setStatus('<b style="font-size:28px;color:#fff">' + n + '</b>'); else { clearInterval(t); setStatus(''); ask(); } }, 1000);
    }

    // 调考官(可带音频)。audioMsg: {data,mimeType} 或 null
    async function ask(audioMsg) {
      if (busy) return; busy = true;
      setStatus('🤔 Examiner is thinking…');
      const msgs = audioMsg ? conv.concat([{ role: 'user', audio: audioMsg }]) : conv.slice();
      try {
        const r = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'chat', topic, messages: msgs }) });
        const j = await r.json();
        if (!r.ok) { setStatus('Error: ' + (j.error || j.detail || r.status)); busy = false; showAnswer(); return; }
        if (audioMsg) {
          const tr = (j.transcript || '').trim();
          if (tr) { conv.push({ role: 'user', text: tr }); const last = logEl.lastElementChild; if (last && last.querySelector('span')) last.querySelector('span').textContent = tr; }
          const reply = (j.reply || '').trim();
          conv.push({ role: 'assistant', text: reply });
          addLog('Examiner', reply, false);
          setStatus('🔊 Speaking…'); speak(reply, () => { setStatus(''); showAnswer(); });
        } else {
          const reply = (j.text || j.reply || '').trim();
          conv.push({ role: 'assistant', text: reply });
          addLog('Examiner', reply, false);
          setStatus('🔊 Speaking…'); speak(reply, () => { setStatus(''); showAnswer(); });
        }
      } catch (e) { setStatus('Network error: ' + e.message); showAnswer(); }
      busy = false;
    }

    async function toggleRecord() {
      const recBtn = controls.querySelector('#recBtn');
      if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        let mime = 'audio/webm;codecs=opus';
        if (!(window.MediaRecorder && MediaRecorder.isTypeSupported(mime))) mime = (window.MediaRecorder && MediaRecorder.isTypeSupported('audio/webm')) ? 'audio/webm' : '';
        recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        chunks = [];
        recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        recorder.onstop = onRecStop;
        recorder.start();
        recStart = Date.now();
        recBtn.classList.add('rec'); recBtn.innerHTML = '⏹ Stop & send <span id="recT">0:00</span>';
        recTimer = setInterval(() => { const s = Math.floor((Date.now() - recStart) / 1000); const el2 = controls.querySelector('#recT'); if (el2) el2.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }, 500);
        setStatus('🔴 Recording… speak your answer, then tap stop. (Take your time — minutes are fine.)');
      } catch (e) { setStatus('Mic blocked. Allow microphone access and retry.'); }
    }
    function onRecStop() {
      clearInterval(recTimer);
      if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
      const type = (recorder && recorder.mimeType) || 'audio/webm';
      const blob = new Blob(chunks, { type });
      const url = URL.createObjectURL(blob);
      const mime = type.split(';')[0];           // Gemini 用裸 mime
      addLog('You', '…', true, url);             // 先占位,转写回来再填
      const rd = new FileReader();
      rd.onload = () => { const b64 = String(rd.result).split(',')[1]; audios.push({ data: b64, mimeType: mime, url }); controls.innerHTML = ''; ask({ data: b64, mimeType: mime }); };
      rd.readAsDataURL(blob);
    }

    async function finishScore() {
      if (busy) return; busy = true;
      controls.innerHTML = ''; setStatus('📝 Scoring your real voice…');
      try {
        const r = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'score', topic, messages: conv, audios: audios.slice(-4).map(a => ({ data: a.data, mimeType: a.mimeType })) }) });
        const j = await r.json();
        if (!r.ok || !j.text) { setStatus('Score error: ' + (j.error || j.detail || r.status)); busy = false; showAnswer(); return; }
        Store.markTask('speaking', true); App.refreshStreak();
        setStatus('');
        const md = esc(j.text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
        const sc = el(`<div class="card" style="background:#fff;color:var(--tx)"><div class="card-title mb8">🏅 Your IELTS Speaking Report</div><div style="font-size:14px;line-height:1.6">${md}</div><button class="btn ghost block mt12" id="again">Practise again</button></div>`);
        sc.querySelector('#again').onclick = () => { conv.length = 0; audios.length = 0; logEl.innerHTML = ''; showStart(); sc.remove(); };
        controls.parentElement.insertBefore(sc, controls.nextSibling);
      } catch (e) { setStatus('Network error: ' + e.message); showAnswer(); }
      busy = false;
    }

    showStart();
    if (window.App && App.onLeave) App.onLeave(() => { try { if (window.TTS) TTS.cancel(); if (recorder && recorder.state === 'recording') recorder.stop(); if (stream) stream.getTracks().forEach(t => t.stop()); } catch (e) {} });
    return card;
  }

  function section(title, lines) {
    const c = el(`<div class="card"><div class="card-title mb8">${title}</div><div></div></div>`);
    const body = c.querySelector('div:last-child');
    lines.forEach(n => body.appendChild(n));
    return c;
  }
  function qLine(q) {
    return el(`<div class="phrase row" style="justify-content:space-between"><span>${esc(q)}</span><span data-say="${esc(q)}" style="cursor:pointer">🔊</span></div>`);
  }

  // ---- 录音 ----
  function recorderCard() {
    const c = el(`
      <div class="card">
        <div class="card-title mb8">🎙️ 录音自评(录下来听自己说)</div>
        <div class="row" style="gap:8px">
          <button class="btn" id="rec" style="flex:1">● 开始录音</button>
        </div>
        <audio id="pb" controls class="hidden" style="width:100%;margin-top:10px"></audio>
        <div class="faint mt8" id="recHint">录完可回放,自查发音、流利度、连贯性。</div>
      </div>
    `);
    let mediaRec = null, chunks = [], recording = false, activeStream = null;
    const btn = c.querySelector('#rec'), pb = c.querySelector('#pb'), hint = c.querySelector('#recHint');
    App.onLeave(() => { try { if (recording && mediaRec) mediaRec.stop(); if (activeStream) activeStream.getTracks().forEach(t => t.stop()); } catch (e) {} });
    btn.onclick = async () => {
      if (recording) { mediaRec && mediaRec.stop(); return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        activeStream = stream;
        mediaRec = new MediaRecorder(stream); chunks = [];
        mediaRec.ondataavailable = e => chunks.push(e.data);
        mediaRec.onstop = () => {
          const blob = new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' });
          pb.src = URL.createObjectURL(blob); pb.classList.remove('hidden');
          stream.getTracks().forEach(t => t.stop());
          recording = false; btn.textContent = '● 重新录音'; btn.classList.remove('bad');
        };
        mediaRec.start(); recording = true; btn.textContent = '■ 停止录音'; btn.classList.add('bad'); hint.textContent = '录音中…';
      } catch (e) { Toast('无法访问麦克风,请在手机上授权'); }
    };
    return c;
  }

  function defaultGeminiPrompt(s) {
    return `You are my IELTS speaking examiner. Today's topic is "${s.topic}". Conduct a full mock: Part 1 (3-4 warm-up questions), then this Part 2 cue card: "${s.cue_card?.prompt || s.title}" (give me 1 min to prepare, 2 min to talk), then 3 Part 3 discussion questions one at a time. After I finish, score me on Fluency, Lexical Resource, Grammar, and Pronunciation (band 0-9 each), and give 3 concrete tips to reach band 7.5. Ask one question at a time and wait for my spoken answer.`;
  }
  function openGemini() {
    // 优先尝试 Gemini App,失败回退网页版
    const t = setTimeout(() => { window.open('https://gemini.google.com/app', '_blank'); }, 400);
    try { window.location.href = 'googleapp://'; } catch (e) {}
    try { window.open('https://gemini.google.com/app', '_blank'); clearTimeout(t); } catch (e) {}
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e2) {} ta.remove(); return true;
    }
  }

  function empty(view) { view.innerHTML = `<div class="empty"><div class="big">🗣️</div><p>暂无口语主题</p><button class="btn" onclick="App.go('today')">返回</button></div>`; }

  window.Speaking = { render };
})();
