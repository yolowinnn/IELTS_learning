#!/usr/bin/env python3
"""gen_read_audio.py — 给「整篇朗读」预生成 MP3:阅读文章 + 写作范文。

和 tools/lesson/gen_pack_audio.py 同一套做法(macOS 自带 en_GB 语音 → ffmpeg 转单声道 MP3),
完全本机离线生成,不花钱、不依赖网络。用户网络慢,所以音频一律内置,播放时零请求。

两种用法:

  # 1) 内置的原创阅读文章(www/data/reading*.js 里带 paras 的条目)
  python3 tools/gen_read_audio.py builtin              # 全部,已存在的跳过
  python3 tools/gen_read_audio.py builtin --only r001  # 只做某一篇
  产出 www/audio/reading/<id>.mp3,并把时长写进 www/data/audio_index.js 的 reading 表。

  # 2) 课程包里的条目(reading 的 paras / writing 的 model_answer)
  python3 tools/gen_read_audio.py pack www/packs/lesson-20260919/pack.json
  产出 <包>/assets/reading-<id>.mp3 与 assets/writing-<id>-model.mp3,
  并把 audio / model_audio 字段写回 pack.json。之后 rev +1 再跑 build_pack.mjs。

为什么是 32k 单声道:朗读是人声,32 kbps 单声道听感足够,一篇 750 词的文章约 1 MB。
28 篇加起来约 29 MB,可以进 APK 离线用;再高就把包撑爆了。
剑桥真题的文章只有页图、仓库里没有正文,不会也不应该在这里合成(见 lesson-pack-format.md)。
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RATE = 168          # 接近雅思录音语速,比读单词慢一点,适合跟读
VOICE = 'Daniel'    # macOS 自带英音
BITRATE = '32k'


def need(binary):
    if not shutil.which(binary):
        sys.exit(f'缺少命令 {binary}')


def synth(text, dst: Path, voice: str, rate: int, bitrate: str):
    """把一段文字合成成单声道 MP3。长文本走临时文件,避免超命令行长度上限。"""
    dst.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        aiff = Path(td) / 'a.aiff'
        txt = Path(td) / 'in.txt'
        txt.write_text(text, encoding='utf-8')
        subprocess.run(['say', '-v', voice, '-r', str(rate), '-f', str(txt), '-o', str(aiff)], check=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(aiff),
                        '-ac', '1', '-ar', '22050', '-b:a', bitrate,
                        '-map_metadata', '-1', str(dst)], check=True)
    return dst.stat().st_size


def duration(p: Path):
    try:
        out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                              '-of', 'csv=p=0', str(p)], capture_output=True, text=True, check=True)
        return float(out.stdout.strip())
    except Exception:
        return 0.0


def clean(text):
    """朗读前的最小清理:压掉多余空白;段落之间留一个空行,say 会自然停顿。"""
    paras = ([re.sub(r'\s+', ' ', str(p)).strip() for p in text]
             if isinstance(text, list) else [re.sub(r'\s+', ' ', str(text)).strip()])
    return '\n\n'.join(p for p in paras if p)


def read_index():
    p = ROOT / 'www/data/audio_index.js'
    m = re.search(r'window\.IELTS_DATA\.audioIndex\s*=\s*(\{.*?\});?\s*$', p.read_text(encoding='utf-8'), re.S)
    return json.loads(m.group(1)) if m else {}


def write_index(idx):
    p = ROOT / 'www/data/audio_index.js'
    p.write_text('/* auto-generated */\nwindow.IELTS_DATA.audioIndex = '
                 + json.dumps(idx, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')


# ---------- 内置阅读文章 ----------

def load_builtin_reading():
    """用 node 把 www/data/reading*.js 读出来(它们是挂在 window 上的普通 JS)。"""
    script = r'''
      global.window = { IELTS_DATA: {} };
      const fs = require('fs'), path = require('path');
      const dir = process.argv[1];
      fs.readdirSync(dir).filter(f => /^reading.*\.js$/.test(f)).sort()
        .forEach(f => { try { require(path.join(dir, f)); } catch (e) {} });
      const out = (window.IELTS_DATA.reading || [])
        .filter(r => Array.isArray(r.paras) && r.paras.length)
        .map(r => ({ id: r.id, title: r.title || '', paras: r.paras }));
      process.stdout.write(JSON.stringify(out));
    '''
    out = subprocess.run(['node', '-e', script, str(ROOT / 'www/data')],
                         capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def do_builtin(args):
    items = load_builtin_reading()
    if args.only:
        items = [r for r in items if r['id'] in args.only]
    dest = ROOT / 'www/audio/reading'
    idx = read_index()
    have = idx.get('reading') or {}

    total = made = 0
    for r in items:
        out = dest / f"{r['id']}.mp3"
        if out.exists() and not args.force:
            have[r['id']] = round(duration(out))
            print(f"  · {r['id']} 已有,跳过", flush=True)
            continue
        size = synth(clean(r['paras']), out, args.voice, args.rate, args.bitrate)
        have[r['id']] = round(duration(out))
        total += size
        made += 1
        print(f"  ✓ {r['id']} {r['title'][:38]} — {size // 1024} KB / {have[r['id']]}s", flush=True)
    idx['reading'] = have
    write_index(idx)
    print(f"\n✅ 新生成 {made} 个,共 {total // 1024} KB;audio_index 里现有 {len(have)} 篇朗读")


# ---------- 课程包 ----------

def do_pack(args):
    pj = Path(args.pack).resolve()
    pack = json.loads(pj.read_text(encoding='utf-8'))
    root = pj.parent
    total = made = 0

    for r in pack.get('reading') or []:
        if not (r.get('paras') or []):
            print(f"  · reading {r.get('id')} 只有页图、没有正文,跳过(剑桥原文不入库)", flush=True)
            continue
        rel = f"assets/reading-{r['id']}.mp3"
        if args.force or not (root / rel).exists():
            total += synth(clean(r['paras']), root / rel, args.voice, args.rate, args.bitrate)
            made += 1
        r['audio'] = rel
        r['audioKind'] = 'read-aloud'
        print(f"  ✓ reading {r['id']}", flush=True)

    for w in pack.get('writing') or []:
        model = (w.get('model_answer') or '').strip()
        if not model:
            print(f"  · writing {w.get('id')} 没有范文,跳过", flush=True)
            continue
        rel = f"assets/writing-{w['id']}-model.mp3"
        if args.force or not (root / rel).exists():
            total += synth(clean(model.split('\n\n')), root / rel, args.voice, args.rate, args.bitrate)
            made += 1
        w['model_audio'] = rel
        print(f"  ✓ writing {w['id']} 范文朗读", flush=True)

    pj.write_text(json.dumps(pack, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"\n✅ 新生成 {made} 个音频,共 {total // 1024} KB,已写回 {pj.name}")
    print("   下一步:pack.json 的 rev +1,再跑 node tools/lesson/build_pack.mjs --all")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    for name in ('builtin', 'pack'):
        s = sub.add_parser(name)
        s.add_argument('--voice', default=VOICE)
        s.add_argument('--rate', type=int, default=RATE)
        s.add_argument('--bitrate', default=BITRATE)
        s.add_argument('--force', action='store_true')
        if name == 'builtin':
            s.add_argument('--only', nargs='*', default=None)
        else:
            s.add_argument('pack')
    args = ap.parse_args()
    need('say'); need('ffmpeg')
    (do_builtin if args.cmd == 'builtin' else do_pack)(args)


if __name__ == '__main__':
    main()
