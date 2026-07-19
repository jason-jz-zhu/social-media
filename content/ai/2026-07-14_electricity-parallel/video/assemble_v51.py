#!/usr/bin/env python3
"""v5.1 final: cold-open card + per-chapter transitions + BGM sidechain ducking
+ brand subtitles + SFX -> out/master-v51.mp4"""
import json, subprocess, os, sys, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

FPS = 30
HEAD_PAD, TAIL_PAD, LAST_PAD = 0.30, 0.35, 0.90
XFADE_D = 0.4
OPEN_D = 2.8
BGM, BGM_VOL = 'assets/bgm-covert-affair.mp3', 0.13
SFX_VOL = 0.22
FRAMES_DIR = 'out/v5frames'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

BEATS = [
    (1, 0.30, 'whoosh', 1.0), (1, 4.60, 'thud', 1.0),
    (2, 1.90, 'whoosh', 0.8), (2, 2.70, 'thud', 1.0), (2, 3.05, 'whoosh', 0.8), (2, 11.5, 'ding', 0.7),
    (3, 6.30, 'pop', 1.0),
    (4, 7.00, 'whoosh', 0.9), (4, 10.5, 'ding', 0.5),
    (5, 1.20, 'thud', 0.8), (5, 4.00, 'pop', 0.8), (5, 7.20, 'pop', 0.9), (5, 8.80, 'ding', 0.7),
    (6, 2.50, 'whoosh', 0.7), (6, 5.00, 'thud', 0.8), (6, 12.0, 'tear', 1.0),
    (7, 7.00, 'ding', 0.9), (7, 11.2, 'pop', 0.7), (7, 12.0, 'pop', 0.7),
    (8, 0.90, 'thud', 0.7), (8, 12.3, 'pop', 0.9),
    (9, 3.30, 'riser', 1.0), (9, 5.00, 'ding', 0.9), (9, 9.20, 'pop', 0.8), (9, 10.2, 'pop', 0.8),
    (10, 9.45, 'whoosh', 1.0), (10, 9.95, 'whoosh', 1.0), (10, 10.8, 'ding', 0.8),
    (11, 4.60, 'pop', 0.7), (11, 5.05, 'pop', 0.7), (11, 5.50, 'pop', 0.7), (11, 5.95, 'pop', 0.7), (11, 6.40, 'pop', 0.7), (11, 8.90, 'whoosh', 0.8),
    (12, 10.6, 'whoosh', 0.7), (12, 12.0, 'ding', 0.9),
    (13, 5.30, 'ding', 0.6), (13, 8.50, 'ding', 0.7),
    (14, 2.60, 'thud', 0.6), (14, 6.90, 'thud', 0.6), (14, 11.4, 'thud', 0.6),
    (15, 3.20, 'riser', 1.0), (15, 6.70, 'whoosh', 1.0), (15, 8.30, 'thud', 1.0), (15, 14.2, 'pop', 0.7),
    (16, 1.20, 'whoosh', 0.8), (16, 2.40, 'pop', 0.7), (16, 3.00, 'pop', 0.7), (16, 7.50, 'whoosh', 1.0),
    (17, 1.40, 'ding', 0.8), (17, 12.6, 'pop', 0.8),
]
# transition INTO scene id (default fade)
TRANS = {1: 'fade', 7: 'smoothleft', 13: 'smoothup', 17: 'fadeblack'}

sb = json.load(open('storyboard.json'))
durs = json.load(open('audio/durations.json'))
os.makedirs('out/tmpv51', exist_ok=True)

TTS_MAP = json.load(open('tts_map.json'))
def map_text(t):
    for a, b in TTS_MAP: t = t.replace(a, b)
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

# ---- clip 0: cold-open card --------------------------------------------
card_png = 'out/tmpv51/opencard.png'
if not os.path.exists(card_png):
    r = subprocess.run([CHROME, '--headless', '--disable-gpu', '--hide-scrollbars',
        f'--screenshot={card_png}', '--window-size=1920,1080', '--force-device-scale-factor=1.3333',
        '--virtual-time-budget=8000', f"file://{os.path.abspath('build/v5/opencard.html')}"],
        capture_output=True, text=True)
    assert os.path.exists(card_png), r.stderr[-300:]
open_frames = int(OPEN_D * FPS) + 1
r = subprocess.run(['ffmpeg', '-y', '-loop', '1', '-framerate', str(FPS), '-i', card_png,
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-filter_complex',
    f"[0:v]zoompan=z='1+0.05*on/{open_frames}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps={FPS},format=yuv420p[v]",
    '-map', '[v]', '-map', '1:a', '-t', str(OPEN_D),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2',
    'out/tmpv51/clip-00.mp4'], capture_output=True, text=True)
if r.returncode != 0:
    print("OPENCARD FAIL\n" + r.stderr[-800:]); sys.exit(1)
print("clip 00 (open card)", flush=True)

# ---- scene clips --------------------------------------------------------
scenes = sb['scenes']
clips = ['out/tmpv51/clip-00.mp4']
clip_ids = [0]
for i, s in enumerate(scenes):
    nn = f"{s['id']:02d}"
    audio_d = durs[nn]
    head = HEAD_PAD if i == 0 else 0.0
    tail = TAIL_PAD + (LAST_PAD if i == len(scenes) - 1 else 0.0)
    scene_d = round(head + audio_d + tail, 3)
    nframes = len(glob.glob(f'{FRAMES_DIR}/{nn}/f_*.jpg'))
    if nframes < scene_d * FPS - 2:
        print(f"scene {nn}: {nframes} frames < {int(scene_d*FPS)}"); sys.exit(1)
    clip = f"out/tmpv51/clip-{nn}.mp4"

    chunks = split_subtitle(map_text(s['narration']))
    total_chars = sum(len(c) for c in chunks) or 1
    windows, t = [], head
    for k, c in enumerate(chunks):
        cd = audio_d * len(c) / total_chars
        windows.append((f"out/subs/sub-{nn}-{k}.png", round(t, 3), round(min(t + cd, head + audio_d), 3)))
        t += cd

    inputs = ['-framerate', str(FPS), '-i', f'{FRAMES_DIR}/{nn}/f_%05d.jpg', '-i', f'audio/scene-{nn}.mp3']
    for strip, _, _ in windows:
        inputs += ['-loop', '1', '-framerate', str(FPS), '-i', strip]
    fc = "[0:v]null[v0]"
    cur = 'v0'
    for k, (_, st, en) in enumerate(windows):
        fc += f";[{cur}][{k+2}:v]overlay=0:0:enable='between(t,{st},{en})'[v{k+1}]"
        cur = f"v{k+1}"
    af = f"adelay={int(head*1000)}|{int(head*1000)},apad" if head else "apad"
    fc += f";[{cur}]format=yuv420p[v];[1:a]{af}[a]"
    r = subprocess.run(['ffmpeg', '-y'] + inputs + [
        '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-t', str(scene_d),
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
        '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', clip],
        capture_output=True, text=True)
    if r.returncode != 0:
        print(f"FAIL {nn}\n{r.stderr[-1000:]}"); sys.exit(1)
    clips.append(clip); clip_ids.append(s['id'])
    print(f"clip {nn}  {scene_d:.2f}s", flush=True)

# ---- final chain --------------------------------------------------------
cdurs = [float(subprocess.run(['ffprobe','-v','quiet','-show_entries','format=duration','-of','csv=p=0', c],
        capture_output=True, text=True).stdout.strip()) for c in clips]
N = len(clips)
total = sum(cdurs) - XFADE_D * (N - 1)

starts = {}
acc = 0.0
for cid, cd in zip(clip_ids, cdurs):
    starts[cid] = acc
    acc += cd - XFADE_D

inputs = []
for c in clips: inputs += ['-i', c]
inputs += ['-stream_loop', '-1', '-i', BGM]
sfx_events = [(starts[sid] + lt, name, gain) for sid, lt, name, gain in BEATS if starts[sid] + lt < total - 0.5]
sfx_events.append((0.15, 'whoosh', 0.9))   # open card whoosh
for g, name, gain in sfx_events:
    inputs += ['-i', f'assets/sfx/{name}.wav']

fc, cur, offset = [], '0:v', 0.0
for i in range(1, N):
    offset += cdurs[i - 1] - XFADE_D
    tr = TRANS.get(clip_ids[i], 'fade')
    fc.append(f"[{cur}][{i}:v]xfade=transition={tr}:duration={XFADE_D}:offset={offset:.3f}[vx{i}]")
    cur = f"vx{i}"
fc.append(f"[{cur}]format=yuv420p[vout]")
acur = '0:a'
for i in range(1, N):
    fc.append(f"[{acur}][{i}:a]acrossfade=d={XFADE_D}[ax{i}]")
    acur = f"ax{i}"
# narration split: one copy ducks the BGM, one goes to the mix
fc.append(f"[{acur}]asplit=2[nar1][nar2]")
fc.append(f"[{N}:a]atrim=0:{total:.3f},volume={BGM_VOL},afade=t=out:st={total-3.5:.3f}:d=3.5[bgmpre]")
fc.append("[bgmpre][nar1]sidechaincompress=threshold=0.015:ratio=7:attack=60:release=500:makeup=1[bgm]")
mix_ins = ["[nar2]", "[bgm]"]
for j, (g, name, gain) in enumerate(sfx_events):
    idx = N + 1 + j
    fc.append(f"[{idx}:a]volume={SFX_VOL * gain:.3f},adelay={int(g*1000)}|{int(g*1000)},apad=whole_dur={total:.3f}[sfx{j}]")
    mix_ins.append(f"[sfx{j}]")
fc.append(f"{''.join(mix_ins)}amix=inputs={len(mix_ins)}:duration=first:normalize=0[aout]")

r = subprocess.run(['ffmpeg', '-y'] + inputs + [
    '-filter_complex', ';'.join(fc), '-map', '[vout]', '-map', '[aout]', '-t', f"{total:.3f}",
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '192k',
    'out/master-v51.mp4'], capture_output=True, text=True)
if r.returncode != 0:
    print("MIX FAIL\n" + r.stderr[-1500:]); sys.exit(1)
probe = subprocess.run(['ffprobe','-v','quiet','-show_entries','format=duration,size','-of','csv=p=0',
                        'out/master-v51.mp4'], capture_output=True, text=True).stdout.strip()
print(f"DONE out/master-v51.mp4  {probe}  sfx={len(sfx_events)}")
