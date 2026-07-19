#!/usr/bin/env python3
"""Golden-master regression test for the generalized pipeline.

Golden topic: content/ai/2026-07-14_electricity-parallel/video (v5/v51 artifacts).
Runs each generalized stage into out-test/ and compares against golden outputs.

Checks:
  A strips   — gen_strips.py output count identical + pixel SSIM >= 0.995 (sampled)
  B frames   — capture.js on sampled scenes, driven by GOLDEN durations (deterministic),
               SSIM >= 0.98 on first/mid/late frames
  C audio    — gen_audio.py durations within 3% of golden (edge-tts drift tolerance)
  D assemble — assemble.py on golden inputs -> duration within 0.3s of master-v51, 1080p30

Usage: test_golden.py [--skip A,B,...]"""
import json, os, shutil, subprocess, sys, glob, re

PIPE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(PIPE))
GOLD = os.path.join(REPO, 'content/ai/2026-07-14_electricity-parallel/video')
TEST = os.path.join(GOLD, 'out-test')
SAMPLE_SCENES = [1, 8, 13]

skip = set()
if '--skip' in sys.argv:
    skip = set(sys.argv[sys.argv.index('--skip') + 1].split(','))

results = {}

def ssim(a, b):
    r = subprocess.run(['ffmpeg', '-i', a, '-i', b, '-lavfi', 'ssim', '-f', 'null', '-'],
                       capture_output=True, text=True)
    m = re.search(r'All:([\d.]+)', r.stderr)
    return float(m.group(1)) if m else 0.0

os.makedirs(TEST, exist_ok=True)

# ---- A: strips ----------------------------------------------------------
if 'A' not in skip:
    subprocess.run([sys.executable, os.path.join(PIPE, 'gen_strips.py'), GOLD,
                    '--subs-dir', os.path.join(TEST, 'subs')], check=True, capture_output=True)
    gold_strips = sorted(os.path.basename(p) for p in glob.glob(f'{GOLD}/out/subs/sub-*.png'))
    test_strips = sorted(os.path.basename(p) for p in glob.glob(f'{TEST}/subs/sub-*.png'))
    ok = gold_strips == test_strips
    scores = []
    if ok:
        for name in gold_strips[::9]:
            scores.append(ssim(f'{GOLD}/out/subs/{name}', f'{TEST}/subs/{name}'))
        ok = all(s >= 0.995 for s in scores)
    results['A strips'] = (ok, f'count {len(test_strips)}/{len(gold_strips)} ssim_min {min(scores) if scores else "-"}')

# ---- B: frames ----------------------------------------------------------
if 'B' not in skip:
    fdir = os.path.join(TEST, 'frames')
    shutil.rmtree(fdir, ignore_errors=True)
    r = subprocess.run(['node', os.path.join(PIPE, 'capture.js'), GOLD, '--frames-dir', fdir]
                       + [str(s) for s in SAMPLE_SCENES], capture_output=True, text=True)
    ok, details = r.returncode == 0, []
    if ok:
        for sid in SAMPLE_SCENES:
            nn = f'{sid:02d}'
            gold_frames = sorted(glob.glob(f'{GOLD}/out/v5frames/{nn}/f_*.jpg'))
            test_frames = sorted(glob.glob(f'{fdir}/{nn}/f_*.jpg'))
            n = min(len(gold_frames), len(test_frames))
            for idx in (0, n // 2, n - 2):
                s = ssim(gold_frames[idx], test_frames[idx])
                details.append(round(s, 4))
                if s < 0.98: ok = False
    results['B frames'] = (ok, f'ssim {details}' if details else r.stderr[-200:])

# ---- C: audio -----------------------------------------------------------
if 'C' not in skip:
    adir = os.path.join(TEST, 'audio')
    subprocess.run([sys.executable, os.path.join(PIPE, 'gen_audio.py'), GOLD,
                    '--audio-dir', adir], check=True, capture_output=True)
    gold_d = json.load(open(f'{GOLD}/audio/durations.json'))
    test_d = json.load(open(f'{adir}/durations.json'))
    drifts = {k: abs(test_d[k] - gold_d[k]) / gold_d[k] for k in gold_d}
    worst = max(drifts.values())
    results['C audio'] = (worst < 0.03, f'worst drift {worst*100:.1f}%')

# ---- D: assemble --------------------------------------------------------
if 'D' not in skip:
    out = os.path.join(TEST, 'master-test.mp4')
    r = subprocess.run([sys.executable, os.path.join(PIPE, 'assemble.py'), GOLD, 'test',
                        '--frames-dir', f'{GOLD}/out/v5frames', '--subs-dir', f'{GOLD}/out/subs',
                        '--audio-dir', f'{GOLD}/audio', '--out', out],
                       capture_output=True, text=True)
    ok = r.returncode == 0 and os.path.exists(out)
    detail = ''
    if ok:
        def probe(p, entry):
            return subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', entry, '-of', 'csv=p=0', p],
                                  capture_output=True, text=True).stdout.strip()
        d_test = float(probe(out, 'format=duration'))
        d_gold = float(probe(f'{GOLD}/out/master-v51.mp4', 'format=duration'))
        spec = probe(out, 'stream=width,height,r_frame_rate').splitlines()[0]
        ok = abs(d_test - d_gold) < 0.3 and spec.startswith('1920,1080')
        detail = f'dur {d_test:.1f} vs {d_gold:.1f}, spec {spec}'
    else:
        detail = (r.stdout + r.stderr)[-300:]
    results['D assemble'] = (ok, detail)

print('\n===== GOLDEN TEST =====')
all_ok = True
for k, (ok, detail) in results.items():
    print(f"{'PASS' if ok else 'FAIL'}  {k}  {detail}")
    all_ok &= ok
print('ALL PASS' if all_ok else 'FAILURES PRESENT')
sys.exit(0 if all_ok else 1)
