#!/usr/bin/env python3
"""TTS for all scenes. Usage: gen_audio.py <topic_dir> [--audio-dir DIR]"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vcommon import load_topic, map_text, probe_dur

def main():
    topic = sys.argv[1]
    cfg = load_topic(topic)
    audio_dir = cfg['audioDir']
    if '--audio-dir' in sys.argv:
        audio_dir = os.path.abspath(sys.argv[sys.argv.index('--audio-dir') + 1])
    os.makedirs(audio_dir, exist_ok=True)
    durs = {}
    for s in cfg['sb']['scenes']:
        nn = f"{s['id']:02d}"
        out = os.path.join(audio_dir, f'scene-{nn}.mp3')
        subprocess.run(['edge-tts', f"--voice={cfg['voice']}", f"--rate={cfg['rate']}",
                        f"--text={map_text(cfg, s['narration'])}", f'--write-media={out}'],
                       check=True, capture_output=True)
        durs[nn] = round(probe_dur(out), 3)
        print(nn, durs[nn], flush=True)
    json.dump(durs, open(os.path.join(audio_dir, 'durations.json'), 'w'), indent=1)
    print('TOTAL', round(sum(durs.values()) / 60, 2), 'min')

if __name__ == '__main__':
    main()
