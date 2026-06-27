/* /api/gemini (Vercel Node 运行时). 与 Cloudflare 版 functions/api/gemini.js 功能一致:
   mode 'chat'(文字/音频对话,音频返回 {transcript,reply}) + mode 'score'(基于真实语音评分)。
   VERTEX_SA_KEY 存 Vercel 环境变量(服务端)。 */
const crypto = require('crypto');
let cachedToken = null, cachedExp = 0;

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedExp - 120) return cachedToken;
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const head = b64({ alg: 'RS256', typ: 'JWT' });
  const claim = b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/cloud-platform', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const s = crypto.createSign('RSA-SHA256'); s.update(head + '.' + claim);
  const jwt = head + '.' + claim + '.' + s.sign(sa.private_key, 'base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt });
  const j = await r.json();
  if (!j.access_token) throw new Error('token error: ' + JSON.stringify(j).slice(0, 200));
  cachedToken = j.access_token; cachedExp = now + (j.expires_in || 3600);
  return cachedToken;
}
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
    const sa = JSON.parse(process.env.VERTEX_SA_KEY || '{}');
    if (!sa.private_key) return res.status(500).json({ error: 'VERTEX_SA_KEY not configured' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const mode = body.mode || 'chat';
    const topic = body.topic || '';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const token = await getAccessToken(sa);
    const url = `https://aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/global/publishers/google/models/gemini-2.5-flash:generateContent`;
    const call = async (payload) => {
      const r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
      if (!out.ok) return res.status(out.status).json({ error: 'vertex', detail: JSON.stringify(out.j).slice(0, 500) });
      return res.status(200).json({ text: out.text || '(no score)' });
    }

    const contents = messages.slice(-16).map(m => ({ role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user', parts: partsFor(m) }));
    if (!contents.length) contents.push({ role: 'user', parts: [{ text: 'Please start the IELTS speaking mock with your first question.' }] });
    const lastHasAudio = messages.length && messages[messages.length - 1].audio;
    const gen = { temperature: 0.85, maxOutputTokens: 600 };
    if (lastHasAudio) { gen.responseMimeType = 'application/json'; gen.responseSchema = { type: 'object', properties: { transcript: { type: 'string' }, reply: { type: 'string' } }, required: ['transcript', 'reply'] }; }
    const sys = examinerSystem(topic) + (lastHasAudio ? '\nThe last turn is the candidate audio. Return JSON: transcript = a faithful transcription of what the candidate said; reply = your next examiner turn.' : '');
    const out = await call({ systemInstruction: { parts: [{ text: sys }] }, contents, generationConfig: gen });
    if (!out.ok) return res.status(out.status).json({ error: 'vertex', detail: JSON.stringify(out.j).slice(0, 500) });
    if (lastHasAudio) { try { const o = JSON.parse(out.text); return res.status(200).json({ transcript: o.transcript || '', reply: o.reply || '' }); } catch (e) { return res.status(200).json({ transcript: '', reply: out.text }); } }
    return res.status(200).json({ text: out.text || '(no reply)' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
