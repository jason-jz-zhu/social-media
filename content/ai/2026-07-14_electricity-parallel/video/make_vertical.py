#!/usr/bin/env python3
"""Vertical 9:16 wrap of the master + XHS cover PNG."""
import subprocess, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
SRC = sys.argv[1] if len(sys.argv) > 1 else 'out/master-v51.mp4'

def shot(html, png, w, h):
    r = subprocess.run([CHROME, '--headless', '--disable-gpu', '--hide-scrollbars',
        f'--screenshot={png}', f'--window-size={w},{h}', '--virtual-time-budget=8000',
        f"file://{os.path.abspath(html)}"], capture_output=True, text=True)
    assert os.path.exists(png), r.stderr[-300:]

shot('build/v5/vertical-bg.html', 'out/vertical-bg.png', 1080, 1920)
shot('build/v5/cover-video.html', 'out/cover-video.png', 1080, 1440)
print('bg + cover rendered')

r = subprocess.run(['ffmpeg', '-y', '-loop', '1', '-i', 'out/vertical-bg.png', '-i', SRC,
    '-filter_complex',
    "[1:v]scale=1080:-2[vid];[0:v][vid]overlay=0:656:shortest=1,format=yuv420p[v]",
    '-map', '[v]', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
    '-c:a', 'copy', 'out/master-v51-vertical.mp4'], capture_output=True, text=True)
if r.returncode != 0:
    print("VERTICAL FAIL\n" + r.stderr[-800:]); sys.exit(1)
probe = subprocess.run(['ffprobe','-v','quiet','-show_entries','format=duration,size','-of','csv=p=0',
                        'out/master-v51-vertical.mp4'], capture_output=True, text=True).stdout.strip()
print('DONE out/master-v51-vertical.mp4 ', probe)
