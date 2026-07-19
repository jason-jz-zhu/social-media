#!/usr/bin/env python3
"""v4 assembly: full-motion frame sequences + subs overlay + audio -> xfade + BGM -> out/master-v4.mp4"""
import json, subprocess, os, sys, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

FPS = 30
HEAD_PAD, TAIL_PAD, LAST_PAD = 0.30, 0.35, 0.90
XFADE_D = 0.4
BGM, BGM_VOL = 'assets/bgm-covert-affair.mp3', 0.09

sb = json.load(open('storyboard.json'))
durs = json.load(open('audio/durations.json'))
os.makedirs('out/tmp4', exist_ok=True)

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
clips = []
for i, s in enumerate(scenes):
    nn = f"{s['id']:02d}"
    audio_d = durs[nn]
    head = HEAD_PAD if i == 0 else 0.0
    tail = TAIL_PAD + (LAST_PAD if i == len(scenes) - 1 else 0.0)
    scene_d = round(head + audio_d + tail, 3)
    nframes = len(glob.glob(f'out/v4frames/{nn}/f_*.jpg'))
    if nframes < scene_d * FPS - 2:
        print(f"scene {nn}: only {nframes} frames, need ~{int(scene_d*FPS)}"); sys.exit(1)
    clip = f"out/tmp4/clip-{nn}.mp4"

    chunks = split_subtitle(s['narration'])
    total_chars = sum(len(c) for c in chunks) or 1
    windows, t = [], head
    for k, c in enumerate(chunks):
        cd = audio_d * len(c) / total_chars
        windows.append((f"out/subs/sub-{nn}-{k}.png", round(t, 3), round(min(t + cd, head + audio_d), 3)))
        t += cd

    inputs = ['-framerate', str(FPS), '-i', f'out/v4frames/{nn}/f_%05d.jpg',
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

    cmd = ['ffmpeg', '-y'] + inputs + [
        '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-t', str(scene_d),
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
        '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', clip,
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"FAIL scene {nn}\n{r.stderr[-1200:]}"); sys.exit(1)
    clips.append(clip)
    print(f"clip {nn}  frames={nframes} scene={scene_d:.2f}s subs={len(chunks)}", flush=True)

cdurs = [float(subprocess.run(['ffprobe','-v','quiet','-show_entries','format=duration','-of','csv=p=0', c],
        capture_output=True, text=True).stdout.strip()) for c in clips]
N = len(clips)
total = sum(cdurs) - XFADE_D * (N - 1)
inputs = []
for c in clips: inputs += ['-i', c]
inputs += ['-stream_loop', '-1', '-i', BGM]

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
fc.append(f"[{acur}][bgm]amix=inputs=2:duration=first:normalize=0[aout]")

r = subprocess.run(['ffmpeg', '-y'] + inputs + [
    '-filter_complex', ';'.join(fc), '-map', '[vout]', '-map', '[aout]', '-t', f"{total:.3f}",
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '192k',
    'out/master-v4.mp4'], capture_output=True, text=True)
if r.returncode != 0:
    print("XFADE FAIL\n" + r.stderr[-1500:]); sys.exit(1)
probe = subprocess.run(['ffprobe','-v','quiet','-show_entries','format=duration,size','-of','csv=p=0',
                        'out/master-v4.mp4'], capture_output=True, text=True).stdout.strip()
print("DONE out/master-v4.mp4 ", probe)
