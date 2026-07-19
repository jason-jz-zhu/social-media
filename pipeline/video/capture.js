// Frame capture: node capture.js <topic_dir> [--frames-dir DIR] [NN ...]
const p = require(require('path').join(__dirname, '..', '..', 'node_modules', 'puppeteer-core'));
const fs = require('fs');
const path = require('path');

const FPS = 30;
const HEAD_PAD = 0.30, TAIL_PAD = 0.35, LAST_PAD = 0.90;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const args = process.argv.slice(2);
  const topic = path.resolve(args.shift());
  let framesDir = null;
  const fi = args.indexOf('--frames-dir');
  if (fi >= 0) { framesDir = path.resolve(args.splice(fi, 2)[1]); }

  const sb = JSON.parse(fs.readFileSync(path.join(topic, 'storyboard.json'), 'utf8'));
  const v = sb.video || {};
  const buildDir = path.join(topic, v.buildDir || 'build');
  framesDir = framesDir || path.join(topic, v.framesDir || 'out/frames');
  const audioDir = path.join(topic, v.audioDir || 'audio');
  const durs = JSON.parse(fs.readFileSync(path.join(audioDir, 'durations.json'), 'utf8'));
  const allIds = sb.scenes.map(s => s.id);
  const ids = args.length ? args.map(Number) : allIds;

  const sceneDur = id => {
    const nn = String(id).padStart(2, '0');
    const head = id === allIds[0] ? HEAD_PAD : 0;
    const tail = TAIL_PAD + (id === allIds[allIds.length - 1] ? LAST_PAD : 0);
    return head + durs[nn] + tail;
  };

  const b = await p.launch({ executablePath: CHROME, headless: 'shell' });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  for (const id of ids) {
    const nn = String(id).padStart(2, '0');
    const dir = path.join(framesDir, nn);
    fs.mkdirSync(dir, { recursive: true });
    const F = Math.round(sceneDur(id) * FPS) + 1;
    const existing = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).length;
    if (existing >= F) { console.log(`${nn}: cached (${existing})`); continue; }
    await pg.goto(`file://${path.join(buildDir, `scene-${nn}.html`)}`, { waitUntil: 'networkidle0' });
    await pg.evaluate(() => document.fonts.ready.then(() => true));
    const t0 = Date.now();
    for (let f = 0; f < F; f++) {
      await pg.evaluate(`seek(${(f / FPS).toFixed(4)})`);
      await pg.screenshot({ path: path.join(dir, `f_${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 86 });
    }
    console.log(`${nn}: ${F} frames (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
