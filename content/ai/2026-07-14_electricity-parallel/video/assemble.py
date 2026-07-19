#!/usr/bin/env python3
"""Video assembly: scene PNGs + TTS audio -> Ken Burns master with burned subtitles.

Inputs (relative to this file's dir):
  storyboard.json          scenes: id, narration, motion
  build/scene-NN.png       2560x1440 renders
  audio/scene-NN.mp3       per-scene narration
  audio/durations.json     scene -> seconds
Output:
  out/master-169.mp4       1920x1080 30fps h264+aac
"""
import json, subprocess, os, sys, re

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

FPS = 30
W, H = 1920, 1080
HEAD_PAD = 0.30   # lead-in silence, scene 1 only
TAIL_PAD = 0.35   # breathing gap after each scene
LAST_PAD = 0.90   # extra hold on final card
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

SUB_HTML = """<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
* {{ margin:0; padding:0; }}
body {{ width:1920px; height:1080px; background:transparent; position:relative; }}
.sub {{
  position:absolute; bottom:34px; left:0; right:0; text-align:center;
  font-family:'Noto Sans SC',sans-serif; font-weight:700; font-size:52px;
  color:#FAF3E7; letter-spacing:2px;
  text-shadow: -3px -3px 0 #1E2A3A, 3px -3px 0 #1E2A3A, -3px 3px 0 #1E2A3A, 3px 3px 0 #1E2A3A,
               -3px 0 0 #1E2A3A, 3px 0 0 #1E2A3A, 0 -3px 0 #1E2A3A, 0 3px 0 #1E2A3A,
               0 6px 14px rgba(30,42,58,0.45);
}}
</style></head><body><div class="sub">{text}</div></body></html>"""

def render_sub_strip(text: str, out_png: str):
    import html as _html
    tmp = out_png.replace('.png', '.html')
    open(tmp, 'w').write(SUB_HTML.format(text=_html.escape(text)))
    r = subprocess.run([CHROME, '--headless', '--disable-gpu', '--hide-scrollbars',
                        f'--screenshot={out_png}', '--window-size=1920,1080',
                        '--default-background-color=00000000', '--virtual-time-budget=6000',
                        f'file://{os.path.abspath(tmp)}'], capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(out_png):
        print(f"SUB RENDER FAIL {out_png}\n{r.stderr[-400:]}"); sys.exit(1)
    os.remove(tmp)

sb = json.load(open('storyboard.json'))
durs = json.load(open('audio/durations.json'))
os.makedirs('out/tmp', exist_ok=True)

def kb_filter(motion: str, frames: int) -> str:
    """Ken Burns via zoompan. Input 2560x1440 -> output 1920x1080."""
    d = frames
    common = f"d={d}:s={W}x{H}:fps={FPS}"
    if motion == 'zoom_in':
        return f"zoompan=z='1+0.085*on/{d}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':{common}"
    if motion == 'zoom_out':
        return f"zoompan=z='1.085-0.085*on/{d}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':{common}"
    if motion == 'pan_right':
        return f"zoompan=z='1.06':x='(iw-iw/zoom)*on/{d}':y='(ih-ih/zoom)/2':{common}"
    if motion == 'pan_left':
        return f"zoompan=z='1.06':x='(iw-iw/zoom)*(1-on/{d})':y='(ih-ih/zoom)/2':{common}"
    return f"zoompan=z='1.02':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':{common}"  # static

def split_subtitle(text: str, max_len: int = 20):
    """Split narration into subtitle chunks at punctuation."""
    parts = re.split(r'([，。？！：；、,.?!])', text)
    merged, buf = [], ''
    for p in parts:
        if not p:
            continue
        if re.fullmatch(r'[，。？！：；、,.?!]', p):
            buf += p
            continue
        if buf and len(buf) + len(p) > max_len:
            merged.append(buf)
            buf = p
        else:
            buf += p
    if buf:
        merged.append(buf)
    out = []
    for m in merged:
        while len(m) > max_len + 4:
            out.append(m[:max_len]); m = m[max_len:]
        out.append(m)
    return [s.strip('，。：；、,.') or s for s in out if s.strip()]

def ass_time(t: float) -> str:
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{int(s):02d}.{int(round((s % 1) * 100)):02d}"

# ---- per-scene clips (subtitles overlaid per-scene, Chrome-rendered) ----
os.makedirs('out/subs', exist_ok=True)
concat_list = []
scenes = sb['scenes']
for i, s in enumerate(scenes):
    nn = f"{s['id']:02d}"
    audio_d = durs[nn]
    head = HEAD_PAD if i == 0 else 0.0
    tail = TAIL_PAD + (LAST_PAD if i == len(scenes) - 1 else 0.0)
    scene_d = round(head + audio_d + tail, 3)
    frames = int(scene_d * FPS) + 1
    clip = f"out/tmp/clip-{nn}.mp4"

    # subtitle strips + scene-local timing windows
    chunks = split_subtitle(s['narration'])
    total_chars = sum(len(c) for c in chunks) or 1
    windows, t = [], head
    for k, c in enumerate(chunks):
        cd = audio_d * len(c) / total_chars
        strip = f"out/subs/sub-{nn}-{k}.png"
        if not os.path.exists(strip):
            render_sub_strip(c, strip)
        windows.append((strip, round(t, 3), round(min(t + cd, head + audio_d), 3)))
        t += cd

    inputs = ['-loop', '1', '-framerate', str(FPS), '-i', f'build/scene-{nn}.png',
              '-i', f'audio/scene-{nn}.mp3']
    for strip, _, _ in windows:
        inputs += ['-loop', '1', '-framerate', str(FPS), '-i', strip]

    fc = f"[0:v]{kb_filter(s['motion'], frames)}[v0]"
    cur = 'v0'
    for k, (_, st, en) in enumerate(windows):
        fc += f";[{cur}][{k+2}:v]overlay=0:0:enable='between(t,{st},{en})'[v{k+1}]"
        cur = f"v{k+1}"
    af = f"adelay={int(head*1000)}|{int(head*1000)},apad" if head else "apad"
    fc += f";[{cur}]format=yuv420p[v];[1:a]{af}[a]"

    cmd = ['ffmpeg', '-y'] + inputs + [
        '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-t', str(scene_d),
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
        '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', clip,
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"FAIL scene {nn}\n{r.stderr[-1200:]}"); sys.exit(1)
    concat_list.append(f"file 'tmp/clip-{nn}.mp4'")
    print(f"clip {nn}  audio={audio_d:.2f}s  scene={scene_d:.2f}s  subs={len(chunks)}", flush=True)

# ---- concat + opening fade ----------------------------------------------
open('out/concat.txt', 'w').write("\n".join(concat_list) + "\n")
r = subprocess.run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', 'out/concat.txt',
                    '-c', 'copy', 'out/tmp/joined.mp4'], capture_output=True, text=True)
if r.returncode != 0:
    print("CONCAT FAIL\n" + r.stderr[-1200:]); sys.exit(1)
r = subprocess.run(['ffmpeg', '-y', '-i', 'out/tmp/joined.mp4',
                    '-vf', "fade=t=in:st=0:d=0.5",
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
                    '-c:a', 'copy', 'out/master-169.mp4'], capture_output=True, text=True)
if r.returncode != 0:
    print("FADE FAIL\n" + r.stderr[-1200:]); sys.exit(1)

probe = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration,size',
                        '-of', 'csv=p=0', 'out/master-169.mp4'], capture_output=True, text=True).stdout.strip()
print("DONE out/master-169.mp4 ", probe)
