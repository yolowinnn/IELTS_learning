/* /api/gemini (Vercel Node 运行时).
   mode 'chat'(文字/音频对话,音频返回 {transcript,reply}) + mode 'score'(基于真实语音评分)。
   改用 Google AI Studio 的 Gemini API(generativelanguage),密钥存 Vercel 环境变量 GEMINI_API_KEY(服务端,不暴露给前端)。
   模型 gemini-flash-latest:始终指向当前 flash,支持音频输入。 */
const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';

function examinerSystem(topic) {
  return `You are a warm, professional IELTS speaking examiner conducting a spoken mock test on the topic "${topic || 'general'}".
- Ask ONE question at a time, then wait. Keep YOUR turns short and natural (1-2 sentences) — this is spoken aloud.
- Flow: a few Part 1 warm-ups → one Part 2 cue card (give prompt, tell them to talk ~2 min) → Part 3 deeper discussion.
- React briefly and naturally to the candidate's answer before the next question.
- Do NOT introduce yourself with any name or say "my name is". Never use brackets/placeholders or stage directions. Begin directly with a brief greeting and your first question.
- Speak English. If the candidate replies in Chinese, gently encourage English.`;
}
function scoringSystem(topic) {
  return `You are a senior IELTS speaking examiner. You are given the candidate's ACTUAL spoken answers as AUDIO plus the conversation transcript, on the topic "${topic || 'general'}".
Assess the real audio — pronunciation, intonation, fluency, hesitation, not only the words.
Return a clear report:
**Estimated Band Scores (0–9, .5 allowed)**
- Fluency & Coherence: X
- Lexical Resource: X
- Grammatical Range & Accuracy: X
- Pronunciation: X
- Overall: X
**What went well** (2–3 bullets, cite specifics they said)
**To improve** (4–5 concrete, specific tips with better example phrasings)
Be honest but encouraging. Plain text, no JSON.`;
}
function partsFor(m) {
  if (m.audio && m.audio.data) return [{ inlineData: { mimeType: m.audio.mimeType || 'audio/webm', data: m.audio.data } }, { text: '(candidate audio answer)' }];
  return [{ text: String(m.text || '') }];
}
// 把 Gemini TTS 返回的 PCM(L16, 单声道)封成 WAV,前端可直接 <audio> 播放
function pcmToWav(pcm, sampleRate) {
  const channels = 1, bits = 16;
  const byteRate = sampleRate * channels * bits / 8, blockAlign = channels * bits / 8;
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(channels, 22);
  h.writeUInt32LE(sampleRate, 24); h.writeUInt32LE(byteRate, 28); h.writeUInt16LE(blockAlign, 32); h.writeUInt16LE(bits, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const KEY = process.env.GEMINI_API_KEY;
    if (!KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const mode = body.mode || 'chat';
    const topic = body.topic || '';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    // 免费额度限速(429)时按建议延迟重试一次(封顶 6s),平滑突发
    const call = async (payload, retries) => {
      retries = (retries == null) ? 1 : retries;
      const r = await fetch(url, { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (r.status === 429 && retries > 0) {
        let wait = 3000;
        try { const d = (j.error && j.error.details) || []; const ri = d.find(x => String(x['@type'] || '').includes('RetryInfo')); if (ri && ri.retryDelay) { const s = parseFloat(ri.retryDelay); if (!isNaN(s)) wait = Math.min(6000, Math.ceil(s * 1000) + 200); } } catch (e) {}
        await sleep(wait);
        return call(payload, retries - 1);
      }
      const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || '').join('').trim();
      return { ok: r.ok, status: r.status, text, j };
    };
    // 429 → 前端可识别的友好限速响应(不当成普通错误,提示稍等重试)
    const errResp = (out) => {
      if (out.status === 429) {
        let ra = 20; try { const d = (out.j.error && out.j.error.details) || []; const ri = d.find(x => String(x['@type'] || '').includes('RetryInfo')); if (ri && ri.retryDelay) { const s = parseFloat(ri.retryDelay); if (!isNaN(s)) ra = Math.ceil(s); } } catch (e) {}
        return res.status(429).json({ error: 'rate_limited', rate: true, retryAfter: ra, detail: '免费额度限速(约 20 次/分),请稍等 ' + ra + ' 秒再试' });
      }
      // 非 429 的上游错误:回一个前端能显示的 detail(原来这里递归调用自己 → 栈溢出)
      const detail = (out.j && out.j.error && out.j.error.message) || ('Gemini API ' + out.status);
      return res.status(502).json({ error: 'gemini_failed', status: out.status, detail });
    };

    if (mode === 'tts') {
      const text = String(body.text || '').slice(0, 1400);
      if (!text) return res.status(400).json({ error: 'no text' });
      const voice = body.voice || 'Kore';
      const style = body.style || 'in a warm, clear, professional British IELTS examiner voice';
      const ttsModel = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
      const turl = `https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent`;
      const tr = await fetch(turl, { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({
        contents: [{ parts: [{ text: `Say ${style}: ${text}` }] }],
        generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } }
      }) });
      const tj = await tr.json();
      const part = tj.candidates && tj.candidates[0] && tj.candidates[0].content && tj.candidates[0].content.parts && tj.candidates[0].content.parts[0];
      const inline = part && part.inlineData;
      if (!tr.ok || !inline || !inline.data) return res.status(tr.status || 500).json({ error: 'tts', detail: JSON.stringify(tj).slice(0, 400) });
      const rateM = /rate=(\d+)/.exec(inline.mimeType || ''); const rate = rateM ? parseInt(rateM[1], 10) : 24000;
      const wav = pcmToWav(Buffer.from(inline.data, 'base64'), rate);
      return res.status(200).json({ audio: wav.toString('base64'), mimeType: 'audio/wav' });
    }

    if (mode === 'score') {
      const audios = Array.isArray(body.audios) ? body.audios : [];
      const transcript = messages.map(m => (m.role === 'model' || m.role === 'assistant' ? 'Examiner: ' : 'Candidate: ') + (m.text || '(audio)')).join('\n');
      const parts = [{ text: 'Conversation transcript:\n' + transcript + '\n\nThe candidate audio answers follow. Score now.' }];
      audios.slice(0, 4).forEach(a => a && a.data && parts.push({ inlineData: { mimeType: a.mimeType || 'audio/webm', data: a.data } }));
      const out = await call({ systemInstruction: { parts: [{ text: scoringSystem(topic) }] }, contents: [{ role: 'user', parts }], generationConfig: { temperature: 0.4, maxOutputTokens: 900 } });
      if (!out.ok) return errResp(out);
      return res.status(200).json({ text: out.text || '(no score)' });
    }

    const lastHasAudio = messages.length && messages[messages.length - 1].audio;
    if (lastHasAudio) {
      // 第一步:专职严格转写(temp 0,只转不编,听不清就 [inaudible]) —— 避免模型编套路默认答案
      const au = messages[messages.length - 1].audio;
      const trOut = await call({
        systemInstruction: { parts: [{ text: 'You are a precise speech-to-text transcriber. Transcribe the audio EXACTLY word-for-word as actually spoken. Do NOT paraphrase, translate, correct, complete, or invent ANY content — transcribe only what you truly hear. If the audio is silent/empty or you cannot make out any speech, output exactly: [inaudible]. Output ONLY the raw transcription, nothing else.' }] },
        contents: [{ role: 'user', parts: [{ inlineData: { mimeType: au.mimeType || 'audio/wav', data: au.data } }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 500 }
      });
      if (!trOut.ok) return errResp(trOut);
      const transcript = (trOut.text || '').trim();
      if (!transcript || /^\[?\s*inaudible\s*\]?\.?$/i.test(transcript)) {
        return res.status(200).json({ transcript: '', reply: "Sorry, I didn't quite catch that — could you say your answer again, a little louder and closer to the mic?" });
      }
      // 第二步:考官基于【文字转写】接话
      const hist = messages.slice(-16, -1).map(m => ({ role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user', parts: [{ text: String(m.text || '') }] }));
      hist.push({ role: 'user', parts: [{ text: transcript }] });
      const rOut = await call({ systemInstruction: { parts: [{ text: examinerSystem(topic) }] }, contents: hist, generationConfig: { temperature: 0.85, maxOutputTokens: 400 } });
      if (!rOut.ok) return errResp(rOut);
      return res.status(200).json({ transcript, reply: rOut.text || '' });
    }
    const contents = messages.slice(-16).map(m => ({ role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user', parts: partsFor(m) }));
    if (!contents.length) contents.push({ role: 'user', parts: [{ text: 'Please start the IELTS speaking mock with your first question.' }] });
    const out = await call({ systemInstruction: { parts: [{ text: examinerSystem(topic) }] }, contents, generationConfig: { temperature: 0.85, maxOutputTokens: 600 } });
    if (!out.ok) return errResp(out);
    return res.status(200).json({ text: out.text || '(no reply)' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
