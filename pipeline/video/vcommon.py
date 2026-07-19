"""Shared helpers for the video pipeline. Topic layout convention:

<topic>/storyboard.json     scenes + "video" config block (see below)
<topic>/tts_map.json        optional: TTS-text replacements (English -> Chinese)
<topic>/<buildDir>/         scene-NN.html animated stage worlds (+ lib/ symlinked or copied)
<topic>/audio/              scene-NN.mp3 + durations.json
<topic>/out/                frames/, subs/, tmp*/, master-*.mp4

storyboard.json "video" block (all optional, defaults shown):
{
  "voice": "zh-CN-YunxiNeural", "rate": "-5%",
  "buildDir": "build", "framesDir": "out/frames",
  "bgm": "<pipeline>/assets/bgm-covert-affair.mp3", "bgmVol": 0.13,
  "opencard": "<buildDir>/opencard.html", "openDur": 2.8,
  "beats": [[sceneId, localSec, sfxName, gain], ...],
  "transitions": {"7": "smoothleft"},        # transition INTO scene id
  "subtitleKeywords": ["重建工厂", ...]
}
"""
import json, os, re, subprocess

PIPE = os.path.dirname(os.path.abspath(__file__))
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
FPS = 30
HEAD_PAD, TAIL_PAD, LAST_PAD = 0.30, 0.35, 0.90
XFADE_D = 0.4

def load_topic(topic):
    topic = os.path.abspath(topic)
    sb = json.load(open(os.path.join(topic, 'storyboard.json')))
    v = sb.get('video', {})
    cfg = {
        'topic': topic,
        'sb': sb,
        'voice': v.get('voice', sb.get('voice', 'zh-CN-YunxiNeural')),
        'rate': v.get('rate', sb.get('rate', '-5%')),
        'buildDir': os.path.join(topic, v.get('buildDir', 'build')),
        'framesDir': os.path.join(topic, v.get('framesDir', 'out/frames')),
        'audioDir': os.path.join(topic, v.get('audioDir', 'audio')),
        'subsDir': os.path.join(topic, v.get('subsDir', 'out/subs')),
        'bgm': v.get('bgm', os.path.join(PIPE, 'assets/bgm-covert-affair.mp3')),
        'bgmVol': v.get('bgmVol', 0.13),
        'sfxVol': v.get('sfxVol', 0.22),
        'opencard': v.get('opencard'),
        'openDur': v.get('openDur', 2.8),
        'beats': [tuple(b) for b in v.get('beats', [])],
        'transitions': {int(k): t for k, t in v.get('transitions', {}).items()},
        'keywords': v.get('subtitleKeywords', []),
    }
    if cfg['opencard']:
        cfg['opencard'] = os.path.join(topic, cfg['opencard'])
    mp = os.path.join(topic, 'tts_map.json')
    cfg['tts_map'] = json.load(open(mp)) if os.path.exists(mp) else []
    return cfg

def map_text(cfg, t):
    for a, b in cfg['tts_map']:
        t = t.replace(a, b)
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

def scene_dur(cfg, i, durs):
    s = cfg['sb']['scenes'][i]
    nn = f"{s['id']:02d}"
    head = HEAD_PAD if i == 0 else 0.0
    tail = TAIL_PAD + (LAST_PAD if i == len(cfg['sb']['scenes']) - 1 else 0.0)
    return round(head + durs[nn] + tail, 3), head, nn

def probe_dur(path):
    return float(subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
                                 '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip())

def run(cmd, err_label):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{err_label}\n{r.stderr[-1200:]}")
    return r

def chrome_shot(html, png, w, h, transparent=False, dsf=None):
    cmd = [CHROME, '--headless', '--disable-gpu', '--hide-scrollbars',
           f'--screenshot={png}', f'--window-size={w},{h}', '--virtual-time-budget=8000']
    if transparent: cmd.append('--default-background-color=00000000')
    if dsf: cmd.append(f'--force-device-scale-factor={dsf}')
    cmd.append(f'file://{os.path.abspath(html)}')
    run(cmd, f'chrome shot failed: {html}')
    assert os.path.exists(png), f'no output: {png}'
