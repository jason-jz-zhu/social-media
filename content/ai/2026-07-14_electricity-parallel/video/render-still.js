// QC snapshot: node render-still.js <NN> <t> <out.png> [variant-dir]
const p = require('puppeteer-core');
const path = require('path');

(async () => {
  const [nn, t, out, dir] = process.argv.slice(2);
  const file = path.join(__dirname, 'build', dir || 'v4', `scene-${nn}.html`);
  const b = await p.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'shell' });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1920, height: 1080 });
  await pg.goto(`file://${file}`, { waitUntil: 'networkidle0' });
  await pg.evaluate(() => document.fonts.ready.then(() => true));
  await pg.evaluate(`seek(${parseFloat(t)})`);
  await pg.screenshot({ path: out });
  await b.close();
  console.log('ok', out);
})().catch(e => { console.error(e.message); process.exit(1); });
