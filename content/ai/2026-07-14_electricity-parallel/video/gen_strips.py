#!/usr/bin/env python3
"""Render all subtitle strips (brand-styled, coral keywords) from mapped narration."""
import json, subprocess, os, re, html, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

KEYWORDS = ['重建工厂', '电费账单', '单位成本', '三十年', '筛选期', '泡沫和革命', '流水线', '单元驱动']

MAP = json.load(open('tts_map.json'))
def map_text(t):
    for a, b in MAP: t = t.replace(a, b)
    return t

def split_subtitle(text, max_len=20):
    parts = re.split(r'([，。？！：；、,.?!])', text)
    merged, buf = [], ''
    for p in parts:
        if not p: continue
        if re.fullmatch(r'[，。？！：；、,.?!]', p): buf += p; continue
        if buf and len(buf) + len(p) > max_len: merged.append(buf); buf = p
        else: buf += p
    if buf: merged.append(buf)
    out = []
    for m in merged:
        while len(m) > max_len + 4: out.append(m[:max_len]); m = m[max_len:]
        out.append(m)
    return [s.strip('，。：；、,.') or s for s in out if s.strip()]

def style_chunk(c):
    e = html.escape(c)
    for k in KEYWORDS:
        e = e.replace(k, f'<span class="kw">{k}</span>')
    return e

HEAD = """<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
* { margin:0; padding:0; } body { background:transparent; }
.page { width:1920px; height:1080px; position:relative; }
.sub { position:absolute; bottom:34px; left:0; right:0; text-align:center;
  font-family:'Noto Sans SC',sans-serif; font-weight:700; font-size:52px;
  color:#FAF3E7; letter-spacing:2px;
  text-shadow: -3px -3px 0 #1E2A3A, 3px -3px 0 #1E2A3A, -3px 3px 0 #1E2A3A, 3px 3px 0 #1E2A3A,
               -3px 0 0 #1E2A3A, 3px 0 0 #1E2A3A, 0 -3px 0 #1E2A3A, 0 3px 0 #1E2A3A,
               0 6px 14px rgba(30,42,58,0.45); }
.sub .kw { color:#FF8A8A; }
</style></head><body>"""

shutil.rmtree('out/subs', ignore_errors=True)
os.makedirs('out/subs', exist_ok=True)
sb = json.load(open('storyboard.json'))
for s in sb['scenes']:
    nn = f"{s['id']:02d}"
    chunks = split_subtitle(map_text(s['narration']))
    n = len(chunks)
    body = "".join(f'<div class="page"><div class="sub">{style_chunk(c)}</div></div>' for c in chunks)
    open('out/subs/_tall.html', 'w').write(HEAD + body + "</body></html>")
    r = subprocess.run([CHROME, '--headless', '--disable-gpu', '--hide-scrollbars',
        '--screenshot=out/subs/_tall.png', f'--window-size=1920,{1080*n}',
        '--default-background-color=00000000', '--virtual-time-budget=8000',
        f"file://{os.path.abspath('out/subs/_tall.html')}"], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr[-300:]
    for k in range(n):
        subprocess.run(['ffmpeg', '-y', '-i', 'out/subs/_tall.png', '-vf', f'crop=1920:1080:0:{1080*k}',
                        f"out/subs/sub-{nn}-{k}.png"], check=True, capture_output=True)
    print(nn, n, flush=True)
for f in ('out/subs/_tall.html', 'out/subs/_tall.png'):
    if os.path.exists(f): os.remove(f)
print('strips done')
