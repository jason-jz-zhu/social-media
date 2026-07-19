#!/usr/bin/env python3
"""Phase A: crossfade transitions + BGM -> out/master-v2.mp4 (v1 untouched).

BGM: "Covert Affair" Kevin MacLeod (incompetech.com), CC-BY 4.0.
"""
import subprocess, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

XFADE_D = 0.4
BGM = 'assets/bgm-covert-affair.mp3'
BGM_VOL = 0.09           # ~ -21 dB under narration
N = 17

clips = [f"out/tmp/clip-{i:02d}.mp4" for i in range(1, N + 1)]
durs = []
for c in clips:
    if not os.path.exists(c):
        print(f"missing {c} — run assemble.py first"); sys.exit(1)
    durs.append(float(subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries',
                 'format=duration', '-of', 'csv=p=0', c], capture_output=True, text=True).stdout.strip()))

total = sum(durs) - XFADE_D * (N - 1)
inputs = []
for c in clips:
    inputs += ['-i', c]
inputs += ['-stream_loop', '-1', '-i', BGM]

# video xfade chain
fc, cur, offset = [], '0:v', 0.0
for i in range(1, N):
    offset += durs[i - 1] - XFADE_D
    nxt = f"vx{i}"
    fc.append(f"[{cur}][{i}:v]xfade=transition=fade:duration={XFADE_D}:offset={offset:.3f}[{nxt}]")
    cur = nxt
fc.append(f"[{cur}]format=yuv420p[vout]")

# narration acrossfade chain
acur = '0:a'
for i in range(1, N):
    nxt = f"ax{i}"
    fc.append(f"[{acur}][{i}:a]acrossfade=d={XFADE_D}[{nxt}]")
    acur = nxt

# bgm: loop trimmed, ducked, fade out; mix under narration
fc.append(f"[{N}:a]atrim=0:{total:.3f},volume={BGM_VOL},afade=t=out:st={total - 3.5:.3f}:d=3.5[bgm]")
fc.append(f"[{acur}][bgm]amix=inputs=2:duration=first:normalize=0[aout]")

cmd = ['ffmpeg', '-y'] + inputs + [
    '-filter_complex', ';'.join(fc),
    '-map', '[vout]', '-map', '[aout]',
    '-t', f"{total:.3f}",
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-c:a', 'aac', '-b:a', '192k',
    'out/master-v2.mp4',
]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode != 0:
    print("FAIL\n" + r.stderr[-1500:]); sys.exit(1)
probe = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration,size',
                        '-of', 'csv=p=0', 'out/master-v2.mp4'], capture_output=True, text=True).stdout.strip()
print("DONE out/master-v2.mp4 ", probe)
