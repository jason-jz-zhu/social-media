// Capture animated burst frames for each scene card at 30fps, 2560x1440.
// Usage: node capture.js [sceneNN ...]  (default: all 17)
const p = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FPS = 30;

(async () => {
  const args = process.argv.slice(2);
  const ids = args.length ? args.map(Number) : Array.from({ length: 17 }, (_, i) => i + 1);
  const b = await p.launch({ executablePath: CHROME, headless: 'shell' });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 4 / 3 });
  const animSrc = fs.readFileSync(path.join(ROOT, 'anim.js'), 'utf8');

  for (const id of ids) {
    const nn = String(id).padStart(2, '0');
    const dir = path.join(ROOT, 'out', 'animframes', nn);
    fs.mkdirSync(dir, { recursive: true });
    await pg.goto(`file://${path.join(ROOT, 'build', `scene-${nn}.html`)}`, { waitUntil: 'networkidle0' });
    await pg.evaluate(() => document.fonts.ready.then(() => true));
    await pg.addScriptTag({ content: animSrc });
    const end = await pg.evaluate('window.__setupAnim()');
    const F = Math.ceil((end + 0.2) * FPS);
    const t0 = Date.now();
    for (let f = 0; f < F; f++) {
      await pg.evaluate(`seek(${(f / FPS).toFixed(4)})`);
      await pg.screenshot({ path: path.join(dir, `f_${String(f).padStart(4, '0')}.png`) });
    }
    console.log(`${nn}: ${F} frames (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
