// v4 full-duration capture: every frame at 30fps (continuous motion), JPEG.
// Usage: node capture-v4.js [NN ...]   (default: all 17)
const p = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FPS = 30;
const HEAD_PAD = 0.30, TAIL_PAD = 0.35, LAST_PAD = 0.90;

const durs = JSON.parse(fs.readFileSync(path.join(ROOT, 'audio/durations.json'), 'utf8'));

function sceneDur(id) {
  const nn = String(id).padStart(2, '0');
  const head = id === 1 ? HEAD_PAD : 0;
  const tail = TAIL_PAD + (id === 17 ? LAST_PAD : 0);
  return head + durs[nn] + tail;
}

(async () => {
  const args = process.argv.slice(2);
  const ids = args.length ? args.map(Number) : Array.from({ length: 17 }, (_, i) => i + 1);
  const b = await p.launch({ executablePath: CHROME, headless: 'shell' });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  for (const id of ids) {
    const nn = String(id).padStart(2, '0');
    const dir = path.join(ROOT, 'out', 'v5frames', nn);
    fs.mkdirSync(dir, { recursive: true });
    const F = Math.round(sceneDur(id) * FPS) + 1;
    const existing = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).length;
    if (existing >= F) { console.log(`${nn}: cached (${existing})`); continue; }
    await pg.goto(`file://${path.join(ROOT, 'build', 'v5', `scene-${nn}.html`)}`, { waitUntil: 'networkidle0' });
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
