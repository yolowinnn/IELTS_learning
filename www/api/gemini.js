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
    const call = async (payload) => {
      const r = await fetch(url, { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json();
      const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || '').join('').trim();
      return { ok: r.ok, status: r.status, text, j };
    };

    if (mode === 'score') {
      const audios = Array.isArray(body.audios) ? body.audios : [];
      const transcript = messages.map(m => (m.role === 'model' || m.role === 'assistant' ? 'Examiner: ' : 'Candidate: ') + (m.text || '(audio)')).join('\n');
      const parts = [{ text: 'Conversation transcript:\n' + transcript + '\n\nThe candidate audio answers follow. Score now.' }];
      audios.slice(0, 4).forEach(a => a && a.data && parts.push({ inlineData: { mimeType: a.mimeType || 'audio/webm', data: a.data } }));
      const out = await call({ systemInstruction: { parts: [{ text: scoringSystem(topic) }] }, contents: [{ role: 'user', parts }], generationConfig: { temperature: 0.4, maxOutputTokens: 900 } });
      if (!out.ok) return res.status(out.status).json({ error: 'gemini', detail: JSON.stringify(out.j).slice(0, 500) });
      return res.status(200).json({ text: out.text || '(no score)' });
    }

    const contents = messages.slice(-16).map(m => ({ role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user', parts: partsFor(m) }));
    if (!contents.length) contents.push({ role: 'user', parts: [{ text: 'Please start the IELTS speaking mock with your first question.' }] });
    const lastHasAudio = messages.length && messages[messages.length - 1].audio;
    const gen = { temperature: 0.85, maxOutputTokens: 600 };
    if (lastHasAudio) { gen.responseMimeType = 'application/json'; gen.responseSchema = { type: 'object', properties: { transcript: { type: 'string' }, reply: { type: 'string' } }, required: ['transcript', 'reply'] }; }
    const sys = examinerSystem(topic) + (lastHasAudio ? '\nThe last turn is the candidate audio. Return JSON: transcript = a faithful transcription of what the candidate said; reply = your next examiner turn.' : '');
    const out = await call({ systemInstruction: { parts: [{ text: sys }] }, contents, generationConfig: gen });
    if (!out.ok) return res.status(out.status).json({ error: 'gemini', detail: JSON.stringify(out.j).slice(0, 500) });
    if (lastHasAudio) { try { const o = JSON.parse(out.text); return res.status(200).json({ transcript: o.transcript || '', reply: o.reply || '' }); } catch (e) { return res.status(200).json({ transcript: '', reply: out.text }); } }
    return res.status(200).json({ text: out.text || '(no reply)' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
