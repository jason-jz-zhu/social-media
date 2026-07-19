#!/usr/bin/env python3
"""Brand subtitle strips (coral keywords). Usage: gen_strips.py <topic_dir> [--subs-dir DIR]"""
import html, json, os, shutil, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vcommon import load_topic, map_text, split_subtitle, chrome_shot

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

def main():
    cfg = load_topic(sys.argv[1])
    subs = cfg['subsDir']
    if '--subs-dir' in sys.argv:
        subs = os.path.abspath(sys.argv[sys.argv.index('--subs-dir') + 1])
    shutil.rmtree(subs, ignore_errors=True)
    os.makedirs(subs, exist_ok=True)

    def style(c):
        e = html.escape(c)
        for k in cfg['keywords']:
            e = e.replace(k, f'<span class="kw">{k}</span>')
        return e

    tall_html = os.path.join(subs, '_tall.html')
    tall_png = os.path.join(subs, '_tall.png')
    for s in cfg['sb']['scenes']:
        nn = f"{s['id']:02d}"
        chunks = split_subtitle(map_text(cfg, s['narration']))
        body = "".join(f'<div class="page"><div class="sub">{style(c)}</div></div>' for c in chunks)
        open(tall_html, 'w').write(HEAD + body + "</body></html>")
        chrome_shot(tall_html, tall_png, 1920, 1080 * len(chunks), transparent=True)
        for k in range(len(chunks)):
            subprocess.run(['ffmpeg', '-y', '-i', tall_png, '-vf', f'crop=1920:1080:0:{1080*k}',
                            os.path.join(subs, f'sub-{nn}-{k}.png')], check=True, capture_output=True)
        print(nn, len(chunks), flush=True)
    for f in (tall_html, tall_png):
        if os.path.exists(f): os.remove(f)
    print('strips done')

if __name__ == '__main__':
    main()
