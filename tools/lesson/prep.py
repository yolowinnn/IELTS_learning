#!/usr/bin/env python3
"""prep.py — 课后素材预处理(雅思课程增量包流水线 第 1 步)

把一次课丢进来的原始文件(docx 讲义 / pdf 真题 / mp3 音频)整理成:
  work/<date>/inventory.json   机器可读清单(给 Claude 读)
  work/<date>/text/*.txt       docx / 可复制 pdf 的文字
  work/<date>/pages/<pdf>/p-XX.webp   每页页图(给 App 直接展示)
  work/<date>/pages/<pdf>/contact-N.jpg 缩略拼版(给 Claude 快速识别页面用途)

用法:
  python3 tools/lesson/prep.py data/20260912 --date 2026-09-12
  python3 tools/lesson/prep.py <drop_dir> [--out work] [--dpi 150] [--no-contact]

只做无损整理,不做任何内容判断。判断交给 Claude(见 .claude/skills/ielts-lesson)。
"""
import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

AUDIO_EXT = {'.mp3', '.m4a', '.wav', '.aac', '.ogg', '.flac', '.mp4'}
DOC_EXT = {'.docx', '.doc'}
PDF_EXT = {'.pdf'}
IMG_EXT = {'.png', '.jpg', '.jpeg', '.webp', '.heic'}


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw)


def have(binary):
    return shutil.which(binary) is not None


def docx_text(path: Path) -> str:
    """不依赖 python-docx,直接读 word/document.xml,按段落切行。"""
    with zipfile.ZipFile(path) as z:
        xml = z.read('word/document.xml').decode('utf-8', 'ignore')
    xml = re.sub(r'<w:p[ >]', '\n<w:p ', xml)
    xml = re.sub(r'<w:tab[^>]*/>', '\t', xml)
    txt = re.sub(r'<[^>]+>', '', xml)
    txt = html.unescape(txt)
    lines = [ln.rstrip() for ln in txt.split('\n')]
    out, blank = [], 0
    for ln in lines:
        if ln.strip():
            out.append(ln.strip())
            blank = 0
        else:
            blank += 1
            if blank == 1:
                out.append('')
    return '\n'.join(out).strip()


def pdf_text(path: Path) -> str:
    if not have('pdftotext'):
        return ''
    try:
        r = subprocess.run(['pdftotext', '-layout', str(path), '-'],
                           capture_output=True, text=True)
        return r.stdout.strip()
    except Exception:
        return ''


def pdf_pages(path: Path, outdir: Path, dpi: int) -> list:
    """整页渲染成 webp。扫描件也能用(页图即题目原样)。"""
    outdir.mkdir(parents=True, exist_ok=True)
    tmp = outdir / '_tmp'
    tmp.mkdir(exist_ok=True)
    run(['pdftoppm', '-r', str(dpi), '-png', str(path), str(tmp / 'p')])
    from PIL import Image
    pages = []
    for png in sorted(tmp.glob('p-*.png')):
        n = png.stem.split('-')[-1]
        dst = outdir / f'p-{n}.webp'
        im = Image.open(png).convert('RGB')
        im.save(dst, 'WEBP', quality=72, method=5)
        pages.append({'page': int(n), 'file': str(dst), 'w': im.width, 'h': im.height,
                      'bytes': dst.stat().st_size})
    shutil.rmtree(tmp, ignore_errors=True)
    return pages


def contact_sheets(pages: list, outdir: Path, cols=5, rows=6) -> list:
    """把页图拼成带页码的缩略图大图,方便一次看清整本 PDF 的结构。"""
    from PIL import Image, ImageDraw
    sheets = []
    per = cols * rows
    for s in range((len(pages) + per - 1) // per):
        chunk = pages[s * per:(s + 1) * per]
        w, h = 420, 594
        sheet = Image.new('RGB', (cols * w, ((len(chunk) + cols - 1) // cols) * h), 'white')
        d = ImageDraw.Draw(sheet)
        for i, p in enumerate(chunk):
            im = Image.open(p['file']).convert('RGB').resize((w, h))
            x, y = (i % cols) * w, (i // cols) * h
            sheet.paste(im, (x, y))
            d.rectangle([x, y, x + 74, y + 30], fill='red')
            d.text((x + 8, y + 9), f"p{p['page']}", fill='white')
        dst = outdir / f'contact-{s + 1}.jpg'
        sheet.save(dst, quality=70)
        sheets.append(str(dst))
    return sheets


def audio_info(path: Path) -> dict:
    info = {'duration': None, 'bitrate': None}
    if not have('ffprobe'):
        return info
    try:
        r = run(['ffprobe', '-v', 'quiet', '-print_format', 'json',
                 '-show_format', str(path)])
        fmt = json.loads(r.stdout).get('format', {})
        info['duration'] = round(float(fmt.get('duration', 0)), 1)
        info['bitrate'] = int(fmt.get('bit_rate', 0)) // 1000
    except Exception:
        pass
    return info


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('drop', help='本次课的素材文件夹,例如 data/20260912')
    ap.add_argument('--out', default='work', help='输出根目录(默认 work/)')
    ap.add_argument('--date', default=None, help='课程日期 YYYY-MM-DD(默认取文件夹名)')
    ap.add_argument('--dpi', type=int, default=150, help='PDF 页图分辨率(默认 150)')
    ap.add_argument('--no-contact', action='store_true', help='不生成缩略拼版')
    args = ap.parse_args()

    drop = Path(args.drop).expanduser().resolve()
    if not drop.is_dir():
        sys.exit(f'找不到素材文件夹: {drop}')

    name = drop.name
    date = args.date
    if not date:
        m = re.search(r'(20\d{2})[-_]?(\d{2})[-_]?(\d{2})', name)
        date = f'{m.group(1)}-{m.group(2)}-{m.group(3)}' if m else ''

    out = Path(args.out).resolve() / (date or name)
    (out / 'text').mkdir(parents=True, exist_ok=True)

    for tool in ('pdftoppm',):
        if not have(tool):
            sys.exit(f'缺少命令 {tool}(brew install poppler)')

    inv = {'date': date, 'dropDir': str(drop), 'workDir': str(out),
           'docs': [], 'pdfs': [], 'audio': [], 'images': [], 'other': []}

    for f in sorted(drop.rglob('*')):
        if f.is_dir() or f.name.startswith('.'):
            continue
        ext = f.suffix.lower()
        rel = str(f.relative_to(drop))
        if ext in DOC_EXT:
            txt = docx_text(f) if ext == '.docx' else ''
            tf = out / 'text' / (f.stem + '.txt')
            tf.write_text(txt, encoding='utf-8')
            inv['docs'].append({'file': str(f), 'name': rel, 'text': str(tf),
                                'chars': len(txt)})
        elif ext in PDF_EXT:
            pdir = out / 'pages' / re.sub(r'[^\w一-鿿-]+', '_', f.stem)[:40]
            pages = pdf_pages(f, pdir, args.dpi)
            txt = pdf_text(f)
            entry = {'file': str(f), 'name': rel, 'pageCount': len(pages),
                     'pagesDir': str(pdir), 'pages': pages,
                     'scanned': len(txt) < 200 * len(pages) / 10}
            if txt:
                tf = out / 'text' / (f.stem + '.txt')
                tf.write_text(txt, encoding='utf-8')
                entry['text'] = str(tf)
            if not args.no_contact:
                entry['contactSheets'] = contact_sheets(pages, pdir)
            inv['pdfs'].append(entry)
        elif ext in AUDIO_EXT:
            inv['audio'].append({'file': str(f), 'name': rel,
                                 'bytes': f.stat().st_size, **audio_info(f)})
        elif ext in IMG_EXT:
            inv['images'].append({'file': str(f), 'name': rel})
        else:
            inv['other'].append({'file': str(f), 'name': rel})

    inv_path = out / 'inventory.json'
    inv_path.write_text(json.dumps(inv, ensure_ascii=False, indent=2), encoding='utf-8')

    print(f'✅ 预处理完成 → {out}')
    print(f'   讲义 {len(inv["docs"])} · PDF {len(inv["pdfs"])} · 音频 {len(inv["audio"])} · 图片 {len(inv["images"])}')
    for p in inv['pdfs']:
        print(f'   PDF {p["name"]}: {p["pageCount"]} 页 → {p["pagesDir"]}'
              + (' (扫描件)' if p['scanned'] else ''))
    for a in inv['audio']:
        print(f'   音频 {a["name"]}: {a.get("duration")}s {a.get("bitrate")}kbps')
    print(f'   清单: {inv_path}')


if __name__ == '__main__':
    main()
