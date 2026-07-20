// QC snapshot: node render-still.js <topic_dir> <NN> <t> <out.png>
const p = require(require('path').join(__dirname, '..', '..', 'node_modules', 'puppeteer-core'));
const path = require('path');
const fs = require('fs');

(async () => {
  const [topic, nn, t, out] = process.argv.slice(2);
  const sb = JSON.parse(fs.readFileSync(path.join(topic, 'storyboard.json'), 'utf8'));
  const buildDir = path.join(path.resolve(topic), (sb.video || {}).buildDir || 'build');
  const b = await p.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'shell' });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1920, height: 1080 });
  await pg.goto(`file://${path.join(buildDir, `scene-${nn}.html`)}`, { waitUntil: 'networkidle0' });
  await pg.evaluate(() => document.fonts.ready.then(() => true));
  await pg.evaluate(`seek(${parseFloat(t)})`);
  await pg.screenshot({ path: out });
  await b.close();
  console.log('ok', out);
})().catch(e => { console.error(e.message); process.exit(1); });
