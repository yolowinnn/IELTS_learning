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
    const conv = [];
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const card = el(`
      <div class="card" style="background:linear-gradient(135deg,#064e3b,#065f46);border:1px solid #34d399;color:#eafff5">
        <div class="card-title mb8" style="color:#fff">🎙️ 实时 AI 对练 · Gemini 考官</div>
        <div class="faint" style="color:#a7f3d0">点「开始」考官用英语提问 → 点麦克风说出回答 → 它实时追问。想要评分就点"结束并评分"。</div>
        <div id="liveLog" class="live-log"></div>
        <div class="row mt12" style="gap:8px">
          <button class="btn good" id="liveStart" style="flex:1">▶ 开始对话</button>
          <button class="btn" id="liveMic" style="flex:1;display:none">🎤 点击说话</button>
          <button class="btn ghost" id="liveFb" style="display:none">结束并评分</button>
        </div>
        <div class="faint mt8" id="liveStatus" style="color:#a7f3d0"></div>
      </div>
    `);
    const logEl = card.querySelector('#liveLog');
    const startBtn = card.querySelector('#liveStart');
    const micBtn = card.querySelector('#liveMic');
    const fbBtn = card.querySelector('#liveFb');
    const setStatus = (t) => { card.querySelector('#liveStatus').textContent = t || ''; };
    const addLog = (who, text, me) => { logEl.appendChild(el(`<div class="lv-msg ${me ? 'lv-me' : 'lv-ex'}"><b>${esc(who)}</b>${esc(text)}</div>`)); logEl.scrollTop = logEl.scrollHeight; };

    let busy = false;
    async function ask() {
      if (busy) return; busy = true; micBtn.disabled = true; setStatus('考官思考中…');
      try {
        const r = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, messages: conv }) });
        const j = await r.json();
        if (r.ok && j.text) { conv.push({ role: 'assistant', text: j.text }); addLog('考官', j.text, false); setStatus('🔊 朗读中…'); speakReply(j.text, () => setStatus('轮到你 — 点麦克风回答')); }
        else { setStatus('出错:' + (j.error || j.detail || r.status) + ' · 可用下方跳转 Gemini'); }
      } catch (e) { setStatus('网络错误:' + e.message); }
      busy = false; micBtn.disabled = false;
    }
    function speakReply(text, done) {
      try {
        if (window.TTS && TTS.supported) { TTS.cancel(); TTS.speak(text, { voice: TTS.pickVoice('en-GB'), rate: 1.0 }).then(done); }
        else done && done();
      } catch (e) { done && done(); }
    }
    startBtn.onclick = () => {
      startBtn.style.display = 'none'; micBtn.style.display = ''; fbBtn.style.display = '';
      addLog('提示', '雅思口语模拟开始,考官将先提问。', true);
      ask();
    };
    fbBtn.onclick = () => { if (busy) return; conv.push({ role: 'user', text: 'Please end the test now and give me my IELTS band scores (Fluency, Lexical, Grammar, Pronunciation) and 3 specific tips.' }); addLog('你', '(请求评分)', true); ask(); };
    if (!SR) {
      startBtn.onclick = () => setStatus('此浏览器不支持语音识别,请用 Chrome;或用下方"跳转 Gemini App"。');
    } else {
      micBtn.onclick = () => {
        if (busy) return;
        const rec = new SR(); rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
        setStatus('🎤 请用英语说…'); micBtn.classList.add('rec');
        rec.onresult = (e) => { const t = e.results[0][0].transcript; conv.push({ role: 'user', text: t }); addLog('你', t, true); ask(); };
        rec.onerror = (e) => { setStatus('没听清(' + e.error + '),再点一次'); micBtn.classList.remove('rec'); };
        rec.onend = () => micBtn.classList.remove('rec');
        try { rec.start(); } catch (e) { setStatus('麦克风启动失败,再试'); }
      };
    }
    if (window.App && App.onLeave) App.onLeave(() => { try { if (window.TTS) TTS.cancel(); } catch (e) {} });
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
