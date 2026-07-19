#!/usr/bin/env python3
"""Final assembly: cold-open card + scene clips + transitions + BGM ducking + SFX.
Usage: assemble.py <topic_dir> [version] [--frames-dir D] [--subs-dir D] [--audio-dir D] [--out F]"""
import json, os, subprocess, sys, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vcommon import (load_topic, map_text, split_subtitle, scene_dur, probe_dur, run,
                     chrome_shot, PIPE, FPS, XFADE_D)

def arg_opt(name, default):
    return os.path.abspath(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default

def main():
    topic = sys.argv[1]
    ver = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else 'v1'
    cfg = load_topic(topic)
    frames_dir = arg_opt('--frames-dir', cfg['framesDir'])
    subs_dir = arg_opt('--subs-dir', cfg['subsDir'])
    audio_dir = arg_opt('--audio-dir', cfg['audioDir'])
    out_master = arg_opt('--out', os.path.join(cfg['topic'], f'out/master-{ver}.mp4'))
    tmp = os.path.join(cfg['topic'], f'out/tmp-{ver}')
    os.makedirs(tmp, exist_ok=True)
    durs = json.load(open(os.path.join(audio_dir, 'durations.json')))
    scenes = cfg['sb']['scenes']

    clips, clip_ids = [], []
    # cold-open card
    if cfg['opencard']:
        card_png = os.path.join(tmp, 'opencard.png')
        if not os.path.exists(card_png):
            chrome_shot(cfg['opencard'], card_png, 1920, 1080, dsf=1.3333)
        od = cfg['openDur']
        of = int(od * FPS) + 1
        clip0 = os.path.join(tmp, 'clip-00.mp4')
        run(['ffmpeg', '-y', '-loop', '1', '-framerate', str(FPS), '-i', card_png,
             '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
             '-filter_complex',
             f"[0:v]zoompan=z='1+0.05*on/{of}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps={FPS},format=yuv420p[v]",
             '-map', '[v]', '-map', '1:a', '-t', str(od),
             '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
             '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', clip0], 'opencard clip')
        clips.append(clip0); clip_ids.append(0)
        print('clip 00 (open card)', flush=True)

    for i, s in enumerate(scenes):
        sd, head, nn = scene_dur(cfg, i, durs)
        nframes = len(glob.glob(f'{frames_dir}/{nn}/f_*.jpg'))
        if nframes < sd * FPS - 2:
            print(f"scene {nn}: {nframes} frames < {int(sd*FPS)} — run capture.js first"); sys.exit(1)
        clip = os.path.join(tmp, f'clip-{nn}.mp4')
        chunks = split_subtitle(map_text(cfg, s['narration']))
        total_chars = sum(len(c) for c in chunks) or 1
        windows, t = [], head
        for k, c in enumerate(chunks):
            cd = durs[nn] * len(c) / total_chars
            windows.append((os.path.join(subs_dir, f'sub-{nn}-{k}.png'),
                            round(t, 3), round(min(t + cd, head + durs[nn]), 3)))
            t += cd
        inputs = ['-framerate', str(FPS), '-i', f'{frames_dir}/{nn}/f_%05d.jpg',
                  '-i', os.path.join(audio_dir, f'scene-{nn}.mp3')]
        for strip, _, _ in windows:
            inputs += ['-loop', '1', '-framerate', str(FPS), '-i', strip]
        fc, cur = "[0:v]null[v0]", 'v0'
        for k, (_, st, en) in enumerate(windows):
            fc += f";[{cur}][{k+2}:v]overlay=0:0:enable='between(t,{st},{en})'[v{k+1}]"
            cur = f"v{k+1}"
        af = f"adelay={int(head*1000)}|{int(head*1000)},apad" if head else "apad"
        fc += f";[{cur}]format=yuv420p[v];[1:a]{af}[a]"
        run(['ffmpeg', '-y'] + inputs + ['-filter_complex', fc, '-map', '[v]', '-map', '[a]',
             '-t', str(sd), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
             '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', clip], f'scene {nn}')
        clips.append(clip); clip_ids.append(s['id'])
        print(f'clip {nn}  {sd:.2f}s', flush=True)

    # final chain
    cdurs = [probe_dur(c) for c in clips]
    N = len(clips)
    total = sum(cdurs) - XFADE_D * (N - 1)
    starts, acc = {}, 0.0
    for cid, cd in zip(clip_ids, cdurs):
        starts[cid] = acc
        acc += cd - XFADE_D

    inputs = []
    for c in clips: inputs += ['-i', c]
    inputs += ['-stream_loop', '-1', '-i', cfg['bgm']]
    sfx_events = [(starts[sid] + lt, name, gain) for sid, lt, name, gain in cfg['beats']
                  if sid in starts and starts[sid] + lt < total - 0.5]
    if cfg['opencard']:
        sfx_events.append((0.15, 'whoosh', 0.9))
    for _, name, _ in sfx_events:
        inputs += ['-i', os.path.join(PIPE, f'assets/sfx/{name}.wav')]

    fc, cur, offset = [], '0:v', 0.0
    for i in range(1, N):
        offset += cdurs[i - 1] - XFADE_D
        tr = cfg['transitions'].get(clip_ids[i], 'fade')
        fc.append(f"[{cur}][{i}:v]xfade=transition={tr}:duration={XFADE_D}:offset={offset:.3f}[vx{i}]")
        cur = f"vx{i}"
    fc.append(f"[{cur}]format=yuv420p[vout]")
    acur = '0:a'
    for i in range(1, N):
        fc.append(f"[{acur}][{i}:a]acrossfade=d={XFADE_D}[ax{i}]")
        acur = f"ax{i}"
    fc.append(f"[{acur}]asplit=2[nar1][nar2]")
    fc.append(f"[{N}:a]atrim=0:{total:.3f},volume={cfg['bgmVol']},afade=t=out:st={total-3.5:.3f}:d=3.5[bgmpre]")
    fc.append("[bgmpre][nar1]sidechaincompress=threshold=0.015:ratio=7:attack=60:release=500:makeup=1[bgm]")
    mix = ["[nar2]", "[bgm]"]
    for j, (g, name, gain) in enumerate(sfx_events):
        idx = N + 1 + j
        fc.append(f"[{idx}:a]volume={cfg['sfxVol'] * gain:.3f},adelay={int(g*1000)}|{int(g*1000)},apad=whole_dur={total:.3f}[sfx{j}]")
        mix.append(f"[sfx{j}]")
    fc.append(f"{''.join(mix)}amix=inputs={len(mix)}:duration=first:normalize=0[aout]")

    run(['ffmpeg', '-y'] + inputs + ['-filter_complex', ';'.join(fc),
         '-map', '[vout]', '-map', '[aout]', '-t', f'{total:.3f}',
         '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
         '-c:a', 'aac', '-b:a', '192k', out_master], 'final mix')
    print(f'DONE {out_master}  dur={probe_dur(out_master):.1f}s  sfx={len(sfx_events)}')

if __name__ == '__main__':
    main()
