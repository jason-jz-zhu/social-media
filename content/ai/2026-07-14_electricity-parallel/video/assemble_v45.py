#!/usr/bin/env python3
"""v4.5: rebuild per-scene clips from v4 frames + new voice, then final mix with
xfade + BGM + beat-mapped SFX -> out/master-{}.mp4"""
import json, subprocess, os, sys, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

FPS = 30
HEAD_PAD, TAIL_PAD, LAST_PAD = 0.30, 0.35, 0.90
XFADE_D = 0.4
BGM, BGM_VOL = 'assets/bgm-covert-affair.mp3', 0.09
SFX_VOL = 0.22

# beat map: (scene_id, local_time, sfx_name, gain)
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

VER = sys.argv[1] if len(sys.argv) > 1 else 'v45'
FRAMES_DIR = os.environ.get('FRAMES_DIR', 'out/v4frames')
sb = json.load(open('storyboard.json'))
durs = json.load(open('audio/durations.json'))
os.makedirs(f'out/tmp{VER}', exist_ok=True)

TTS_MAP = json.load(open('tts_map.json')) if os.path.exists('tts_map.json') else []
def map_text(txt):
    for a, b in TTS_MAP: txt = txt.replace(a, b)
    return txt

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

scenes = sb['scenes']
clips, scene_ds = [], {}
for i, s in enumerate(scenes):
    nn = f"{s['id']:02d}"
    audio_d = durs[nn]
    head = HEAD_PAD if i == 0 else 0.0
    tail = TAIL_PAD + (LAST_PAD if i == len(scenes) - 1 else 0.0)
    scene_d = round(head + audio_d + tail, 3)
    scene_ds[s['id']] = scene_d
    nframes = len(glob.glob(f'{FRAMES_DIR}/{nn}/f_*.jpg'))
    if nframes < scene_d * FPS - 2:
        print(f"scene {nn}: {nframes} frames < needed {int(scene_d*FPS)}"); sys.exit(1)
    clip = f"out/tmp{VER}/clip-{nn}.mp4"

    chunks = split_subtitle(map_text(s['narration']))
    total_chars = sum(len(c) for c in chunks) or 1
    windows, t = [], head
    for k, c in enumerate(chunks):
        cd = audio_d * len(c) / total_chars
        windows.append((f"out/subs/sub-{nn}-{k}.png", round(t, 3), round(min(t + cd, head + audio_d), 3)))
        t += cd

    inputs = ['-framerate', str(FPS), '-i', f'{FRAMES_DIR}/{nn}/f_%05d.jpg',
              '-i', f'audio/scene-{nn}.mp3']
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
        print(f"FAIL scene {nn}\n{r.stderr[-1200:]}"); sys.exit(1)
    clips.append(clip)
    print(f"clip {nn}  scene={scene_d:.2f}s", flush=True)

# ---- final: xfade + BGM + SFX beats ------------------------------------
cdurs = [float(subprocess.run(['ffprobe','-v','quiet','-show_entries','format=duration','-of','csv=p=0', c],
        capture_output=True, text=True).stdout.strip()) for c in clips]
N = len(clips)
total = sum(cdurs) - XFADE_D * (N - 1)

# global start time of each scene on the joined timeline
starts = {}
acc = 0.0
for i, s in enumerate(scenes):
    starts[s['id']] = acc
    acc += cdurs[i] - XFADE_D

inputs = []
for c in clips: inputs += ['-i', c]
inputs += ['-stream_loop', '-1', '-i', BGM]
sfx_events = []
for sid, lt, name, gain in BEATS:
    g = starts[sid] + lt
    if g < total - 0.5:
        sfx_events.append((g, name, gain))
for _, name, _ in sfx_events:
    pass
for g, name, gain in sfx_events:
    inputs += ['-i', f'assets/sfx/{name}.wav']

fc, cur, offset = [], '0:v', 0.0
for i in range(1, N):
    offset += cdurs[i - 1] - XFADE_D
    fc.append(f"[{cur}][{i}:v]xfade=transition=fade:duration={XFADE_D}:offset={offset:.3f}[vx{i}]")
    cur = f"vx{i}"
fc.append(f"[{cur}]format=yuv420p[vout]")
acur = '0:a'
for i in range(1, N):
    fc.append(f"[{acur}][{i}:a]acrossfade=d={XFADE_D}[ax{i}]")
    acur = f"ax{i}"
fc.append(f"[{N}:a]atrim=0:{total:.3f},volume={BGM_VOL},afade=t=out:st={total-3.5:.3f}:d=3.5[bgm]")

mix_ins = [f"[{acur}]", "[bgm]"]
for j, (g, name, gain) in enumerate(sfx_events):
    idx = N + 1 + j
    fc.append(f"[{idx}:a]volume={SFX_VOL * gain:.3f},adelay={int(g*1000)}|{int(g*1000)},apad=whole_dur={total:.3f}[sfx{j}]")
    mix_ins.append(f"[sfx{j}]")
fc.append(f"{''.join(mix_ins)}amix=inputs={len(mix_ins)}:duration=first:normalize=0[aout]")

r = subprocess.run(['ffmpeg', '-y'] + inputs + [
    '-filter_complex', ';'.join(fc), '-map', '[vout]', '-map', '[aout]', '-t', f"{total:.3f}",
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '192k',
    f'out/master-{VER}.mp4'], capture_output=True, text=True)
if r.returncode != 0:
    print("MIX FAIL\n" + r.stderr[-1500:]); sys.exit(1)
probe = subprocess.run(['ffprobe','-v','quiet','-show_entries','format=duration,size','-of','csv=p=0',
                        f'out/master-{VER}.mp4'], capture_output=True, text=True).stdout.strip()
print(f"DONE out/master-{VER}.mp4  {probe}  sfx_events={len(sfx_events)}")
