#!/usr/bin/env node
/* build_pack.mjs — 校验并安装课程包(流水线 第 4 步)

  node tools/lesson/build_pack.mjs www/packs/lesson-20260912/pack.json
  node tools/lesson/build_pack.mjs --all          # 重新校验并重建索引

做四件事:
  1) 校验 pack.json(字段、题型、答案合法性、资源文件是否存在、ID 是否与老内容冲突)
  2) 放到 www/packs/<id>/pack.json
  3) 重建 www/packs/index.json      → App 联网增量更新读这个
  4) 重建 www/data/packs.js         → 网页/APK 打包内置,离线直接可用
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const PACKS_DIR = path.join(ROOT, 'www/packs');
const DATA_DIR = path.join(ROOT, 'www/data');
const KINDS = ['listening', 'reading', 'writing', 'speaking', 'vocab'];

const errs = [];
const warns = [];
const E = (m) => errs.push(m);
const W = (m) => warns.push(m);

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

// 老内容里已经用掉的 id(避免课程包覆盖原有题目/单词)
function existingIds() {
  const ids = new Set();
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!f.endsWith('.js') || f === 'packs.js') continue;
    const s = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
    for (const m of s.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)) ids.add(m[1]);
  }
  return ids;
}

function validateQuestion(q, where) {
  const t = q.type || 'mc';
  if (!q.q) E(`${where}: missing question text`);
  if (t === 'mc') {
    if (!Array.isArray(q.options) || q.options.length < 2) E(`${where}: mc needs options`);
    else if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length))
      E(`${where}: mc answer must be an option index (0-${q.options.length - 1})`);
  } else if (t === 'multi') {
    if (!Array.isArray(q.options) || !Array.isArray(q.answer) || !q.answer.length)
      E(`${where}: multi needs options[] and answer[]`);
    else {
      q.answer.forEach(a => { if (!(Number.isInteger(a) && a >= 0 && a < q.options.length)) E(`${where}: multi answer index ${a} out of range`); });
      if (q.pick && q.pick !== q.answer.length) W(`${where}: pick=${q.pick} but ${q.answer.length} answers`);
      if (q.marks && q.marks !== q.answer.length) W(`${where}: marks=${q.marks} for ${q.answer.length} answers (IELTS gives 1 mark each)`);
    }
  } else if (t === 'match') {
    if (!Array.isArray(q.bank) || !q.bank.length) E(`${where}: match needs bank[]`);
    else if (!q.bank.some(b => String(b.k).toUpperCase() === String(q.answer).toUpperCase()))
      E(`${where}: match answer "${q.answer}" is not a key in bank`);
  } else if (t === 'gap') {
    const a = Array.isArray(q.answer) ? q.answer : [q.answer];
    if (!a.length || a.some(x => !String(x || '').trim())) E(`${where}: gap needs a non-empty answer`);
  } else if (t === 'tfng' || t === 'ynng') {
    const ok = t === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];
    if (!ok.includes(String(q.answer).toUpperCase())) E(`${where}: ${t} answer must be one of ${ok.join(' / ')}`);
  } else E(`${where}: unknown question type "${t}"`);
}

// 资源既可以跟包放一起,也可以托管在对象存储(pack.assetBase 为绝对地址时)
function assetsAreRemote(pack) { return /^https?:\/\//.test(pack.assetBase || ''); }

function validate(pack, packDir, known) {
  if (!/^[\w.-]+$/.test(pack.id || '')) E('pack.id missing or has odd characters');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pack.date || '')) E('pack.date must be YYYY-MM-DD');
  if (!pack.title) W('pack.title is empty');
  if (!Number.isInteger(pack.rev) || pack.rev < 1) E('pack.rev must be an integer ≥ 1 (bump it on every re-release)');
  if (!KINDS.some(k => Array.isArray(pack[k]) && pack[k].length)) E('pack has no content at all');

  const seen = new Set();
  for (const kind of KINDS) {
    for (const [i, item] of (pack[kind] || []).entries()) {
      const where = `${kind}[${i}] ${item.id || '(no id)'}`;
      if (!item.id) E(`${where}: missing id`);
      if (seen.has(item.id)) E(`${where}: duplicate id inside this pack`);
      seen.add(item.id);
      if (known.has(item.id)) E(`${where}: id already used by the built-in content — pick another`);
      if (!item.title && kind !== 'vocab') E(`${where}: missing title`);
      if (kind === 'vocab') {
        if (!item.word) E(`${where}: vocab needs word`);
        if (!item.def_en) W(`${where}: no English definition`);
        if (!item.example) W(`${where}: no example sentence`);
        continue;
      }
      // 资源文件必须真的存在(托管到对象存储后本地没有 → 降级为提醒)
      const remote = assetsAreRemote(pack);
      const missing = (f) => !/^https?:/.test(f) && !fs.existsSync(path.join(packDir, f));
      for (const f of [item.audio].filter(Boolean)) {
        if (missing(f)) (remote ? W : E)(`${where}: audio not in the repo → ${f}${remote ? ' (assetBase 指向远端,请确认已上传)' : ''}`);
      }
      for (const key of ['sheets', 'questionSheets', 'transcriptSheets']) {
        for (const s of item[key] || []) {
          const src = typeof s === 'string' ? s : s.src;
          if (!src) { E(`${where}: ${key} entry without src`); continue; }
          if (missing(src)) (remote ? W : E)(`${where}: ${key} not in the repo → ${src}${remote ? ' (assetBase 指向远端,请确认已上传)' : ''}`);
        }
      }
      if (kind === 'listening' || kind === 'reading') {
        if (!Array.isArray(item.questions) || !item.questions.length) W(`${where}: no questions`);
        (item.questions || []).forEach((q, qi) => validateQuestion(q, `${where} Q${q.no || qi + 1}`));
      }
    }
  }
  // 单词跨包查重
  const words = (pack.vocab || []).map(v => (v.word || '').toLowerCase());
  words.forEach((w, i) => { if (w && words.indexOf(w) !== i) W(`vocab: "${w}" appears twice in this pack`); });
}

function dirSize(dir) {
  let n = 0;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    n += f.isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return n;
}

function rebuildIndex() {
  const packs = [];
  for (const d of fs.readdirSync(PACKS_DIR)) {
    const pj = path.join(PACKS_DIR, d, 'pack.json');
    if (!fs.existsSync(pj)) continue;
    const p = readJSON(pj);
    const counts = {};
    KINDS.forEach(k => { if (Array.isArray(p[k]) && p[k].length) counts[k] = p[k].length; });
    packs.push({ id: p.id, date: p.date, title: p.title || p.id, rev: p.rev || 1,
                 source: p.source || '', counts, bytes: dirSize(path.join(PACKS_DIR, d)) });
  }
  packs.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const index = { version: 1, updatedAt: new Date().toISOString().slice(0, 10), packs };
  fs.writeFileSync(path.join(PACKS_DIR, 'index.json'), JSON.stringify(index, null, 2) + '\n');

  // 打包内置版本(网页/APK 离线用)
  const full = packs.map(p => readJSON(path.join(PACKS_DIR, p.id, 'pack.json')));
  const js = '/* packs.js — 自动生成,勿手改。来源:www/packs/<id>/pack.json(tools/lesson/build_pack.mjs)\n'
    + '   打包内置的课程包;联网增量更新见 js/packs.js */\n'
    + 'window.IELTS_PACKS = ' + JSON.stringify(full, null, 1) + ';\n';
  fs.writeFileSync(path.join(DATA_DIR, 'packs.js'), js);
  return { index, bytes: js.length };
}

// ---- main ----
const args = process.argv.slice(2);
const all = args.includes('--all');
const targets = all
  ? fs.readdirSync(PACKS_DIR).map(d => path.join(PACKS_DIR, d, 'pack.json')).filter(fs.existsSync)
  : args.filter(a => !a.startsWith('-')).map(a => {
      const p = path.resolve(a);
      return fs.statSync(p).isDirectory() ? path.join(p, 'pack.json') : p;
    });

if (!targets.length) {
  console.error('用法: node tools/lesson/build_pack.mjs <pack.json|包目录> [...]  或  --all');
  process.exit(2);
}

const known = existingIds();
let installed = [];
for (const t of targets) {
  const pack = readJSON(t);
  let packDir = path.dirname(t);
  validate(pack, packDir, known);
  if (errs.length) break;
  const dest = path.join(PACKS_DIR, pack.id);
  if (path.resolve(packDir) !== path.resolve(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(packDir, dest, { recursive: true });
    packDir = dest;
  }
  fs.writeFileSync(path.join(dest, 'pack.json'), JSON.stringify(pack, null, 2) + '\n');
  installed.push(pack);
}

if (errs.length) {
  console.error('❌ 校验不通过:');
  errs.forEach(e => console.error('   · ' + e));
  process.exit(1);
}
const { index, bytes } = rebuildIndex();
warns.forEach(w => console.warn('⚠️  ' + w));
console.log('✅ 课程包已安装');
installed.forEach(p => {
  const c = KINDS.filter(k => (p[k] || []).length).map(k => `${k} ${p[k].length}`).join(' · ');
  console.log(`   ${p.id} (rev ${p.rev}) ${p.title} — ${c}`);
});
console.log(`   索引 www/packs/index.json:${index.packs.length} 个包`);
console.log(`   内置 www/data/packs.js:${Math.round(bytes / 1024)} KB`);
console.log('   下一步:本地预览确认 → 部署网页 → (可选)bash build_apk.sh');
