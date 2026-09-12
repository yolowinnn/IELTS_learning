#!/usr/bin/env python3
"""assets.py — 把预处理结果里选中的页图/音频装进课程包的 assets/(流水线 第 2 步)

子命令:
  pages  从 prep.py 生成的页图里挑几页,改成规范文件名放进包里
  audio  转码/裁剪音频(单声道 64k mp3,手机流量友好)

例:
  python3 tools/lesson/assets.py pages \
      --src work/2026-09-12/pages/IELTS_18_Test_1 --pages 2,3 \
      --dest www/packs/lesson-20260912/assets --prefix listening-p2-q

  python3 tools/lesson/assets.py audio \
      --src "data/剑桥雅思/剑18真题/剑桥雅思18听力音频/Test 1/Test 1 Part 2.mp3" \
      --dest www/packs/lesson-20260912/assets/listening-p2.mp3
"""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


def parse_pages(spec: str):
    out = []
    for part in spec.split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            a, b = part.split('-')
            out.extend(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return out


def cmd_pages(a):
    src = Path(a.src)
    dest = Path(a.dest)
    dest.mkdir(parents=True, exist_ok=True)
    made = []
    for i, n in enumerate(parse_pages(a.pages), 1):
        cands = list(src.glob(f'p-{n:02d}.*')) + list(src.glob(f'p-{n}.*'))
        if not cands:
            sys.exit(f'找不到第 {n} 页: {src}/p-{n:02d}.webp')
        s = cands[0]
        d = dest / f'{a.prefix}{i}{s.suffix}'
        shutil.copy2(s, d)
        made.append({'page': n, 'file': str(d), 'bytes': d.stat().st_size})
        print(f'  p{n} → {d.name} ({d.stat().st_size // 1024} KB)')
    print(json.dumps([m['file'] for m in made], ensure_ascii=False))


def cmd_audio(a):
    dest = Path(a.dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    cmd = ['ffmpeg', '-y', '-loglevel', 'error']
    if a.start:
        cmd += ['-ss', a.start]
    cmd += ['-i', a.src]
    if a.end:
        cmd += ['-to', a.end]
    cmd += ['-vn', '-ac', '1', '-ar', '32000', '-b:a', a.bitrate,
            '-map_metadata', '-1', str(dest)]
    subprocess.run(cmd, check=True)
    size = dest.stat().st_size
    dur = None
    try:
        r = subprocess.run(['ffprobe', '-v', 'quiet', '-print_format', 'json',
                            '-show_format', str(dest)], capture_output=True, text=True)
        dur = round(float(json.loads(r.stdout)['format']['duration']), 1)
    except Exception:
        pass
    print(f'  → {dest} ({size // 1024} KB, {dur}s)')
    print(json.dumps({'file': str(dest), 'bytes': size, 'duration': dur}, ensure_ascii=False))


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)

    p = sub.add_parser('pages')
    p.add_argument('--src', required=True, help='prep.py 输出的某个 PDF 页图目录')
    p.add_argument('--pages', required=True, help='页码,如 2,3 或 7-10(PDF 物理页)')
    p.add_argument('--dest', required=True, help='包的 assets 目录')
    p.add_argument('--prefix', required=True, help='文件名前缀,如 listening-p2-q')
    p.set_defaults(fn=cmd_pages)

    a = sub.add_parser('audio')
    a.add_argument('--src', required=True)
    a.add_argument('--dest', required=True)
    a.add_argument('--start', default=None, help='裁剪起点 hh:mm:ss')
    a.add_argument('--end', default=None, help='裁剪终点 hh:mm:ss')
    a.add_argument('--bitrate', default='64k')
    a.set_defaults(fn=cmd_audio)

    args = ap.parse_args()
    args.fn(args)


if __name__ == '__main__':
    main()
