#!/usr/bin/env python3
"""gen_pack_audio.py — 给课程包的生词预生成发音(单词 + 例句),离线、不用任何云服务。

用 macOS 自带的英式发音 Daniel(en_GB)合成,再用 ffmpeg 转成单声道 64k MP3。
好处:装好的 APK 里内置,手机没有语音引擎也能出声;不依赖网络,也不花钱。

用法:
  python3 tools/lesson/gen_pack_audio.py www/packs/lesson-20260912/pack.json
  python3 tools/lesson/gen_pack_audio.py <pack.json> [--voice Daniel] [--force]

会做两件事:
  1) 写出 assets/vocab/<vocabId>.mp3(单词)和 <vocabId>-ex.mp3(例句)
  2) 把 audio / audioEx 字段写回 pack.json
之后记得跑 tools/lesson/build_pack.mjs 重建索引。
"""
import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

# 单词念慢一点听清音节,句子按接近考试的语速
WORD_RATE = 150
SENT_RATE = 175


def need(binary):
    if not shutil.which(binary):
        sys.exit(f'缺少命令 {binary}')


def synth(text, dst: Path, voice: str, rate: int):
    dst.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        aiff = Path(td) / 'a.aiff'
        subprocess.run(['say', '-v', voice, '-r', str(rate), '-o', str(aiff), text], check=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(aiff),
                        '-ac', '1', '-ar', '32000', '-b:a', '64k',
                        '-map_metadata', '-1', str(dst)], check=True)
    return dst.stat().st_size


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pack', help='www/packs/<id>/pack.json')
    ap.add_argument('--voice', default='Daniel', help='macOS 语音名(默认 Daniel,英音)')
    ap.add_argument('--force', action='store_true', help='已有音频也重新生成')
    ap.add_argument('--no-examples', action='store_true', help='只生成单词,不生成例句')
    args = ap.parse_args()

    need('say')
    need('ffmpeg')

    pj = Path(args.pack).resolve()
    pack = json.loads(pj.read_text(encoding='utf-8'))
    root = pj.parent
    vocab = pack.get('vocab') or []
    if not vocab:
        sys.exit('这个包里没有 vocab')

    total = 0
    made = 0
    for v in vocab:
        vid = v.get('id')
        word = (v.get('word') or '').strip()
        if not vid or not word:
            continue
        rel = f'assets/vocab/{vid}.mp3'
        if args.force or not (root / rel).exists():
            total += synth(word, root / rel, args.voice, WORD_RATE)
            made += 1
        v['audio'] = rel

        ex = (v.get('example') or '').strip()
        if ex and not args.no_examples:
            rel_ex = f'assets/vocab/{vid}-ex.mp3'
            if args.force or not (root / rel_ex).exists():
                total += synth(ex, root / rel_ex, args.voice, SENT_RATE)
                made += 1
            v['audioEx'] = rel_ex
        print(f'  ✓ {word}')

    pj.write_text(json.dumps(pack, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'\n✅ 生成 {made} 个音频,共 {total // 1024} KB,已写回 {pj.name}')
    print('   下一步:node tools/lesson/build_pack.mjs --all')


if __name__ == '__main__':
    main()
