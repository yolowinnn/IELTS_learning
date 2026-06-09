/* gen_audio.mjs — 打包时用 Google Cloud TTS 生成离线音频(单词 + 听力逐句)。
   key 仅在本机使用,不进 APK。带缓存:文本未变则跳过。
   用法: node tools/gen_audio.mjs   (可选环境变量 SA_KEY 覆盖 key 路径) */
import { GoogleAuth } from 'google-auth-library';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const WWW = path.join(ROOT, 'www');
const AUDIO = path.join(WWW, 'audio');
const KEY = process.env.SA_KEY || '/Users/jiaweili/main_folder/projects/imdatamgmt/im-drawing-462011-cc19ce1b6850.json';

// 英音 Neural2 嗓音
const FEMALE = ['en-GB-Neural2-A', 'en-GB-Neural2-C'];
const MALE = ['en-GB-Neural2-B', 'en-GB-Neural2-D'];
const VOCAB_VOICE = 'en-GB-Neural2-C';

function loadData() {
  const window = { IELTS_DATA: {} };
  const files = ['vocab', 'vocab_b2', 'vocab_b3', 'vocab_b4', 'vocab_b5', 'vocab_b6', 'vocab_b7', 'vocab_b8',
    'reading', 'reading_b2', 'reading_b3', 'reading_b4', 'listening', 'listening_b2', 'listening_b3', 'listening_b4',
    'writing', 'writing_b2', 'writing_b3', 'writing_b4', 'speaking', 'speaking_b2', 'speaking_b3', 'speaking_b4', 'plan'];
  for (const f of files) {
    const p = path.join(WWW, 'data', f + '.js');
    if (fs.existsSync(p)) new Function('window', fs.readFileSync(p, 'utf8'))(window);
  }
  return window.IELTS_DATA;
}

const manifestPath = path.join(AUDIO, '.manifest.json');
let manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

let token = null;
async function getToken() {
  if (token) return token;
  const auth = new GoogleAuth({ keyFile: KEY, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  token = (await client.getAccessToken()).token;
  return token;
}

async function synth(text, voice, outPath, rate = 1.0) {
  const rel = path.relative(AUDIO, outPath);
  const h = crypto.createHash('md5').update(text + '|' + voice + '|' + rate).digest('hex');
  if (manifest[rel] === h && fs.existsSync(outPath)) return 'cached';
  const t = await getToken();
  const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text }, voice: { languageCode: 'en-GB', name: voice },
      audioConfig: { audioEncoding: 'MP3', speakingRate: rate, pitch: 0 }
    })
  });
  const j = await res.json();
  if (!j.audioContent) throw new Error('status ' + res.status + ' ' + JSON.stringify(j).slice(0, 200));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(j.audioContent, 'base64'));
  manifest[rel] = h;
  return 'generated';
}

async function pool(items, fn, n = 8) {
  let i = 0; const results = [];
  async function worker() { while (i < items.length) { const idx = i++; results[idx] = await fn(items[idx], idx); } }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return results;
}

function femaleSpeaker(name, idx) {
  if (/man\b|male|\bmr\b|lecturer|guide|agent|tutor|receptionist/i.test(name || '')) {
    return /woman|female|\bms\b|\bmrs\b|miss|receptionist/i.test(name || '');
  }
  return /woman|female|\bms\b|\bmrs\b|miss|she|her|girl|anna|sarah|emma|kate|lucy|caller|student|receptionist/i.test(name || '') || idx % 2 === 1;
}

const D = loadData();
// 与 App 一致的去重:同一单词只保留首次出现
const _seen = new Set();
D.vocab = (D.vocab || []).filter(w => { const k = (w.word || '').trim().toLowerCase(); if (!k || _seen.has(k)) return false; _seen.add(k); return true; });
const tasks = [];
// 单词
for (const w of (D.vocab || [])) tasks.push({ text: w.word, voice: VOCAB_VOICE, out: path.join(AUDIO, 'vocab', w.id + '.mp3'), rate: 0.92 });
// 听力逐句(按说话人分配嗓音)
for (const l of (D.listening || [])) {
  const speakers = [...new Set((l.lines || []).map(x => x.speaker || 'X'))];
  const vmap = {}; let mi = 0, fi = 0;
  speakers.forEach((s, i) => { vmap[s] = femaleSpeaker(s, i) ? FEMALE[fi++ % FEMALE.length] : MALE[mi++ % MALE.length]; });
  (l.lines || []).forEach((ln, idx) => tasks.push({ text: ln.text, voice: vmap[ln.speaker || 'X'] || MALE[0], out: path.join(AUDIO, 'listening', l.id, idx + '.mp3'), rate: 1.0 }));
}

console.log(`待生成任务: ${tasks.length}(单词 ${(D.vocab || []).length} + 听力句子 ${tasks.length - (D.vocab || []).length})`);
let gen = 0, cache = 0, fail = 0;
await pool(tasks, async (t) => {
  try { const r = await synth(t.text, t.voice, t.out, t.rate); r === 'cached' ? cache++ : gen++; if ((gen + cache) % 40 === 0) console.log(`  进度 ${gen + cache}/${tasks.length}`); }
  catch (e) { fail++; console.log('FAIL', path.relative(AUDIO, t.out), e.message); }
}, 8);
fs.mkdirSync(AUDIO, { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// 生成 audio_index.js,告诉 App 哪些有音频
const index = { vocab: {}, listening: {} };
for (const w of (D.vocab || [])) if (fs.existsSync(path.join(AUDIO, 'vocab', w.id + '.mp3'))) index.vocab[w.id] = 1;
for (const l of (D.listening || [])) {
  const n = (l.lines || []).length; let ok = n > 0;
  for (let i = 0; i < n; i++) if (!fs.existsSync(path.join(AUDIO, 'listening', l.id, i + '.mp3'))) ok = false;
  if (ok) index.listening[l.id] = n;
}
fs.writeFileSync(path.join(WWW, 'data', 'audio_index.js'), '/* auto-generated */\nwindow.IELTS_DATA.audioIndex = ' + JSON.stringify(index) + ';\n');
console.log(`完成: 新生成 ${gen}, 缓存命中 ${cache}, 失败 ${fail}`);
console.log(`音频索引: 单词 ${Object.keys(index.vocab).length} 个, 听力 ${Object.keys(index.listening).length} 段`);
