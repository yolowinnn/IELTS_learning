/* Cloudflare Pages Function: /api/gemini
   口语 AI 考官 — Workers 运行时(Web Crypto 手签 RS256 JWT 取 Vertex token)。
   环境变量 VERTEX_SA_KEY = 压成一行的服务账号 JSON(服务端,绝不下发客户端)。
   与 Vercel 版 (../api/gemini.js, Node 运行时) 并存,前端都请求 /api/gemini。 */

let cachedToken = null, cachedExp = 0;

function b64url(data) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const encSeg = (o) => b64url(new TextEncoder().encode(JSON.stringify(o)));

async function importKey(pem) {
  const body = pem.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\s+/g, '');
  const bin = atob(body);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return crypto.subtle.importKey('pkcs8', buf.buffer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedExp - 120) return cachedToken;
  const head = encSeg({ alg: 'RS256', typ: 'JWT' });
  const claim = encSeg({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600
  });
  const signingInput = head + '.' + claim;
  const key = await importKey(sa.private_key);
  const sigBuf = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
  const jwt = signingInput + '.' + b64url(sigBuf);
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
- Do NOT introduce yourself with any name and never say "my name is". Never use placeholders or brackets like "[Examiner's Name]" or stage directions. Begin directly with a brief warm greeting and your first question.
- Speak English. If the candidate replies in Chinese, gently encourage English.
- When the candidate asks for feedback (or says "feedback"/"评分"/"end"), STOP asking and give: estimated band (0-9) for Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation; then 3 concrete improvement tips. Be encouraging and concise.`;
}

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const jsonResp = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json', ...CORS } });

export async function onRequestOptions() { return new Response(null, { status: 204, headers: CORS }); }

export async function onRequestPost(context) {
  try {
    const sa = JSON.parse(context.env.VERTEX_SA_KEY || '{}');
    if (!sa.private_key) return jsonResp({ error: 'VERTEX_SA_KEY not configured' }, 500);
    const body = await context.request.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const topic = body.topic || '';
    const token = await getAccessToken(sa);
    const url = `https://aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/global/publishers/google/models/gemini-2.5-flash:generateContent`;
    const contents = messages.slice(-20).map(m => ({
      role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user',
      parts: [{ text: String(m.text || '') }]
    }));
    if (!contents.length) contents.push({ role: 'user', parts: [{ text: 'Please start the IELTS speaking mock test with your first question.' }] });
    const payload = {
      systemInstruction: { parts: [{ text: examinerSystem(topic) }] },
      contents,
      generationConfig: { temperature: 0.85, maxOutputTokens: 500 }
    };
    const r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const j = await r.json();
    if (!r.ok) return jsonResp({ error: 'vertex', detail: JSON.stringify(j).slice(0, 500) }, r.status);
    const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [])
      .map(p => p.text || '').join('').trim();
    return jsonResp({ text: text || '(no reply)' });
  } catch (e) {
    return jsonResp({ error: String((e && e.message) || e) }, 500);
  }
}
