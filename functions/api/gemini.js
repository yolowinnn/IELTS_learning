/* Cloudflare Pages Function: /api/gemini
   口语 AI 考官。改用 Google AI Studio 的 Gemini API(generativelanguage),密钥存 Cloudflare secret GEMINI_API_KEY(服务端)。
   - mode 'chat':文字或【音频】对话。音频时返回 {transcript, reply}。
   - mode 'score':接收候选人音频 + 对话,基于【真实语音】给 IELTS 四项评分。
   模型 gemini-flash-latest(支持音频输入)。functions/ 必须在项目根目录。 */

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

function pcmToWavB64(pcmB64, sampleRate) {
  const bin = atob(pcmB64); const pcm = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) pcm[i] = bin.charCodeAt(i);
  const channels = 1, bits = 16, byteRate = sampleRate * channels * bits / 8, blockAlign = channels * bits / 8;
  const buf = new ArrayBuffer(44 + pcm.length), dv = new DataView(buf);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); dv.setUint32(4, 36 + pcm.length, true); ws(8, 'WAVE'); ws(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, channels, true); dv.setUint32(24, sampleRate, true); dv.setUint32(28, byteRate, true); dv.setUint16(32, blockAlign, true); dv.setUint16(34, bits, true); ws(36, 'data'); dv.setUint32(40, pcm.length, true);
  new Uint8Array(buf, 44).set(pcm);
  let out = ''; const u8 = new Uint8Array(buf); for (let i = 0; i < u8.length; i++) out += String.fromCharCode(u8[i]); return btoa(out);
}
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const jsonResp = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json', ...CORS } });
export async function onRequestOptions() { return new Response(null, { status: 204, headers: CORS }); }

export async function onRequestPost(context) {
  try {
    const KEY = context.env.GEMINI_API_KEY;
    if (!KEY) return jsonResp({ error: 'GEMINI_API_KEY not configured' }, 500);
    const MODEL = context.env.GEMINI_MODEL || 'gemini-flash-latest';
    const body = await context.request.json().catch(() => ({}));
    const mode = body.mode || 'chat';
    const topic = body.topic || '';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
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
    const errResp = (out) => {
      if (out.status === 429) {
        let ra = 20; try { const d = (out.j.error && out.j.error.details) || []; const ri = d.find(x => String(x['@type'] || '').includes('RetryInfo')); if (ri && ri.retryDelay) { const s = parseFloat(ri.retryDelay); if (!isNaN(s)) ra = Math.ceil(s); } } catch (e) {}
        return jsonResp({ error: 'rate_limited', rate: true, retryAfter: ra, detail: '免费额度限速(约 20 次/分),请稍等 ' + ra + ' 秒再试' }, 429);
      }
      return errResp(out);
    };

    if (mode === 'tts') {
      const text = String(body.text || '').slice(0, 1400);
      if (!text) return jsonResp({ error: 'no text' }, 400);
      const voice = body.voice || 'Kore';
      const style = body.style || 'in a warm, clear, professional British IELTS examiner voice';
      const ttsModel = context.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
      const tr = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent`, { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: `Say ${style}: ${text}` }] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } } }) });
      const tj = await tr.json();
      const part = tj.candidates && tj.candidates[0] && tj.candidates[0].content && tj.candidates[0].content.parts && tj.candidates[0].content.parts[0];
      const inline = part && part.inlineData;
      if (!tr.ok || !inline || !inline.data) return jsonResp({ error: 'tts', detail: JSON.stringify(tj).slice(0, 400) }, tr.status || 500);
      const rateM = /rate=(\d+)/.exec(inline.mimeType || ''); const rate = rateM ? parseInt(rateM[1], 10) : 24000;
      return jsonResp({ audio: pcmToWavB64(inline.data, rate), mimeType: 'audio/wav' });
    }

    if (mode === 'score') {
      const audios = Array.isArray(body.audios) ? body.audios : [];
      const transcript = messages.map(m => (m.role === 'model' || m.role === 'assistant' ? 'Examiner: ' : 'Candidate: ') + (m.text || '(audio)')).join('\n');
      const parts = [{ text: 'Conversation transcript:\n' + transcript + '\n\nThe candidate audio answers follow. Score now.' }];
      audios.slice(0, 4).forEach(a => a && a.data && parts.push({ inlineData: { mimeType: a.mimeType || 'audio/webm', data: a.data } }));
      const out = await call({ systemInstruction: { parts: [{ text: scoringSystem(topic) }] }, contents: [{ role: 'user', parts }], generationConfig: { temperature: 0.4, maxOutputTokens: 900 } });
      if (!out.ok) return errResp(out);
      return jsonResp({ text: out.text || '(no score)' });
    }

    const lastHasAudio = messages.length && messages[messages.length - 1].audio;
    if (lastHasAudio) {
      const au = messages[messages.length - 1].audio;
      const trOut = await call({
        systemInstruction: { parts: [{ text: 'You are a precise speech-to-text transcriber. Transcribe the audio EXACTLY word-for-word as actually spoken. Do NOT paraphrase, translate, correct, complete, or invent ANY content — transcribe only what you truly hear. If the audio is silent/empty or you cannot make out any speech, output exactly: [inaudible]. Output ONLY the raw transcription, nothing else.' }] },
        contents: [{ role: 'user', parts: [{ inlineData: { mimeType: au.mimeType || 'audio/wav', data: au.data } }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 500 }
      });
      if (!trOut.ok) return errResp(trOut);
      const transcript = (trOut.text || '').trim();
      if (!transcript || /^\[?\s*inaudible\s*\]?\.?$/i.test(transcript)) {
        return jsonResp({ transcript: '', reply: "Sorry, I didn't quite catch that — could you say your answer again, a little louder and closer to the mic?" });
      }
      const hist = messages.slice(-16, -1).map(m => ({ role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user', parts: [{ text: String(m.text || '') }] }));
      hist.push({ role: 'user', parts: [{ text: transcript }] });
      const rOut = await call({ systemInstruction: { parts: [{ text: examinerSystem(topic) }] }, contents: hist, generationConfig: { temperature: 0.85, maxOutputTokens: 400 } });
      if (!rOut.ok) return errResp(rOut);
      return jsonResp({ transcript, reply: rOut.text || '' });
    }
    const contents = messages.slice(-16).map(m => ({ role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user', parts: partsFor(m) }));
    if (!contents.length) contents.push({ role: 'user', parts: [{ text: 'Please start the IELTS speaking mock with your first question.' }] });
    const out = await call({ systemInstruction: { parts: [{ text: examinerSystem(topic) }] }, contents, generationConfig: { temperature: 0.85, maxOutputTokens: 600 } });
    if (!out.ok) return errResp(out);
    return jsonResp({ text: out.text || '(no reply)' });
  } catch (e) {
    return jsonResp({ error: String((e && e.message) || e) }, 500);
  }
}
