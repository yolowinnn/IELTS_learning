/* Cloudflare Pages Function: /api/gemini
   口语 AI 考官(Vertex Gemini 2.5,多模态)。支持:
   - mode 'chat':文字或【音频】对话。音频时返回 {transcript, reply}(转写候选人话 + 考官追问)。
   - mode 'score':接收候选人音频 + 对话,基于【真实语音】给 IELTS 四项评分。
   VERTEX_SA_KEY 存 Cloudflare secret(服务端)。functions/ 必须在项目根目录。 */

let cachedToken = null, cachedExp = 0;

function b64url(data) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const encSeg = (o) => b64url(new TextEncoder().encode(JSON.stringify(o)));

async function importKey(pem) {
  const body = pem.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\s+/g, '');
  const bin = atob(body); const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return crypto.subtle.importKey('pkcs8', buf.buffer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}
async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedExp - 120) return cachedToken;
  const head = encSeg({ alg: 'RS256', typ: 'JWT' });
  const claim = encSeg({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/cloud-platform', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const signingInput = head + '.' + claim;
  const key = await importKey(sa.private_key);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
  const jwt = signingInput + '.' + b64url(sig);
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

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const jsonResp = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json', ...CORS } });
export async function onRequestOptions() { return new Response(null, { status: 204, headers: CORS }); }

export async function onRequestPost(context) {
  try {
    const sa = JSON.parse(context.env.VERTEX_SA_KEY || '{}');
    if (!sa.private_key) return jsonResp({ error: 'VERTEX_SA_KEY not configured' }, 500);
    const body = await context.request.json().catch(() => ({}));
    const mode = body.mode || 'chat';
    const topic = body.topic || '';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const token = await getAccessToken(sa);
    const url = `https://aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/global/publishers/google/models/gemini-2.5-flash:generateContent`;

    if (mode === 'score') {
      const audios = Array.isArray(body.audios) ? body.audios : [];
      const transcript = messages.map(m => (m.role === 'model' || m.role === 'assistant' ? 'Examiner: ' : 'Candidate: ') + (m.text || '(audio)')).join('\n');
      const parts = [{ text: 'Conversation transcript:\n' + transcript + '\n\nThe candidate audio answers follow. Score now.' }];
      audios.slice(0, 4).forEach(a => a && a.data && parts.push({ inlineData: { mimeType: a.mimeType || 'audio/webm', data: a.data } }));
      const payload = { systemInstruction: { parts: [{ text: scoringSystem(topic) }] }, contents: [{ role: 'user', parts }], generationConfig: { temperature: 0.4, maxOutputTokens: 900 } };
      const r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!r.ok) return jsonResp({ error: 'vertex', detail: JSON.stringify(j).slice(0, 500) }, r.status);
      const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || '').join('').trim();
      return jsonResp({ text: text || '(no score)' });
    }

    // chat
    const contents = messages.slice(-16).map(m => ({ role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user', parts: partsFor(m) }));
    if (!contents.length) contents.push({ role: 'user', parts: [{ text: 'Please start the IELTS speaking mock with your first question.' }] });
    const lastHasAudio = messages.length && messages[messages.length - 1].audio;
    const gen = { temperature: 0.85, maxOutputTokens: 600 };
    if (lastHasAudio) { gen.responseMimeType = 'application/json'; gen.responseSchema = { type: 'object', properties: { transcript: { type: 'string' }, reply: { type: 'string' } }, required: ['transcript', 'reply'] }; }
    const sys = examinerSystem(topic) + (lastHasAudio ? '\nThe last turn is the candidate audio. Return JSON: transcript = a faithful transcription of what the candidate said; reply = your next examiner turn.' : '');
    const payload = { systemInstruction: { parts: [{ text: sys }] }, contents, generationConfig: gen };
    const r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const j = await r.json();
    if (!r.ok) return jsonResp({ error: 'vertex', detail: JSON.stringify(j).slice(0, 500) }, r.status);
    const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || '').join('').trim();
    if (lastHasAudio) { try { const o = JSON.parse(text); return jsonResp({ transcript: o.transcript || '', reply: o.reply || '' }); } catch (e) { return jsonResp({ transcript: '', reply: text }); } }
    return jsonResp({ text: text || '(no reply)' });
  } catch (e) {
    return jsonResp({ error: String((e && e.message) || e) }, 500);
  }
}
