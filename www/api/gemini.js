/* /api/gemini — 服务端调用 Vertex AI Gemini 作为雅思口语考官。
   Vertex 服务账号 key 存在 Vercel 环境变量 VERTEX_SA_KEY(服务端,绝不下发客户端)。
   无第三方依赖:用 node:crypto 手写 RS256 JWT 换取 access token。 */
const crypto = require('crypto');

let cachedToken = null, cachedExp = 0;

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedExp - 120) return cachedToken;
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const head = b64({ alg: 'RS256', typ: 'JWT' });
  const claim = b64({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600
  });
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(head + '.' + claim);
  const sig = signer.sign(sa.private_key, 'base64url');
  const jwt = head + '.' + claim + '.' + sig;
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt
  });
  const j = await resp.json();
  if (!j.access_token) throw new Error('token error: ' + JSON.stringify(j).slice(0, 200));
  cachedToken = j.access_token; cachedExp = now + (j.expires_in || 3600);
  return cachedToken;
}

function examinerSystem(topic) {
  return `You are a warm, professional IELTS speaking examiner conducting a spoken mock test on the topic "${topic || 'general'}".
Rules:
- Ask ONE question at a time, then wait. Keep YOUR turns short and natural (1-2 sentences) because this is spoken aloud.
- Flow: a few Part 1 warm-up questions → one Part 2 cue card (give the prompt, tell them to talk for ~2 minutes) → Part 3 deeper discussion.
- React briefly and naturally to the candidate's answer before the next question.
- Speak English. If the candidate replies in Chinese, gently encourage English.
- When the candidate asks for feedback (or says "feedback"/"评分"/"end"), STOP asking and give: estimated band (0-9) for Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation; then 3 concrete, specific improvement tips. Be encouraging and concise.`;
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
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const topic = body.topic || '';
    const token = await getAccessToken(sa);
    const location = 'global';
    const model = 'gemini-2.5-flash';
    const url = `https://aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/${location}/publishers/google/models/${model}:generateContent`;
    const contents = messages.slice(-20).map(m => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.text || '') }]
    }));
    if (!contents.length) contents.push({ role: 'user', parts: [{ text: 'Please start the IELTS speaking mock test with your first question.' }] });
    const payload = {
      systemInstruction: { parts: [{ text: examinerSystem(topic) }] },
      contents,
      generationConfig: { temperature: 0.85, maxOutputTokens: 500 }
    };
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'vertex', detail: JSON.stringify(j).slice(0, 500) });
    const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [])
      .map(p => p.text || '').join('').trim();
    return res.status(200).json({ text: text || '(no reply)' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
