// v5 atmosphere layer: tonal washes, skyline, halftone ground, dust — plus
// targeted per-scene extras. Deterministic (seeded by scene number). Wraps seek(t).
(function () {
  const svg = document.querySelector('#camera svg');
  if (!svg || !window.seek) return;
  const W = +svg.getAttribute('width'), H = +svg.getAttribute('height');
  const m = document.title.match(/(\d+)\s*$/);
  const SID = m ? +m[1] : 0;

  let s = (SID + 7) * 747796405 + 2891336453;
  const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s >>> 8) / 16777216; };
  const NS = 'http://www.w3.org/2000/svg';

  // ---------- back layer ----------
  const back = document.createElementNS(NS, 'g');
  const defs = document.createElementNS(NS, 'defs');
  defs.innerHTML = `<filter id="atmoBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="48"/></filter>
    <pattern id="atmoHt" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.4" fill="rgba(30,42,58,0.35)"/></pattern>`;
  back.appendChild(defs);

  // ink-wash tonal blobs: sepia copper / slate blue / warm grey
  const COLS = ['rgba(200,152,96,0.11)', 'rgba(110,136,152,0.10)', 'rgba(200,152,96,0.07)',
                'rgba(110,136,152,0.065)', 'rgba(154,138,110,0.09)', 'rgba(200,152,96,0.05)'];
  const washes = [];
  for (let i = 0; i < 6; i++) {
    const e = document.createElementNS(NS, 'ellipse');
    e.setAttribute('cx', rnd() * W);
    e.setAttribute('cy', 100 + rnd() * (H - 280));
    e.setAttribute('rx', 280 + rnd() * 360);
    e.setAttribute('ry', 170 + rnd() * 230);
    e.setAttribute('fill', COLS[i % COLS.length]);
    e.setAttribute('filter', 'url(#atmoBlur)');
    back.appendChild(e);
    washes.push({ e, ph: rnd() });
  }

  // distant 1900s skyline silhouette
  let sky = '', x = -60;
  while (x < W) {
    const bw = 90 + rnd() * 170, bh = 60 + rnd() * 180;
    sky += `<rect x="${x.toFixed(0)}" y="${(H - 158 - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}"/>`;
    if (rnd() > 0.55) sky += `<rect x="${(x + bw * 0.3).toFixed(0)}" y="${(H - 158 - bh - 44).toFixed(0)}" width="15" height="44"/>`;
    x += bw + 34 + rnd() * 70;
  }
  const skyg = document.createElementNS(NS, 'g');
  skyg.innerHTML = sky;
  skyg.setAttribute('fill', 'rgba(30,42,58,0.055)');
  back.appendChild(skyg);

  // halftone ground band
  const band = document.createElementNS(NS, 'rect');
  band.setAttribute('x', 0); band.setAttribute('y', H - 148);
  band.setAttribute('width', W); band.setAttribute('height', 148);
  band.setAttribute('fill', 'url(#atmoHt)'); band.setAttribute('opacity', '0.26');
  back.appendChild(band);

  svg.insertBefore(back, svg.firstChild);

  // ---------- front dust ----------
  const front = document.createElementNS(NS, 'g');
  const motes = [];
  for (let i = 0; i < 10; i++) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', (1.8 + rnd() * 2.8).toFixed(1));
    c.setAttribute('fill', 'rgba(30,42,58,0.22)');
    front.appendChild(c);
    motes.push({ c, x: rnd() * W, p: 5 + rnd() * 7, ph: rnd(), drift: 22 + rnd() * 34 });
  }
  svg.appendChild(front);

  // ---------- targeted per-scene extras ----------
  let extraAnim = null;
  const add = (parent, markup) => { const g = document.createElementNS(NS, 'g'); g.innerHTML = markup; parent.appendChild(g); return g; };

  if (SID === 1) {
    // street lamp + cobblestones + onlooker silhouettes
    add(back, `<g stroke="#1E2A3A" stroke-width="6" fill="none" opacity="0.85">
      <line x1="300" y1="900" x2="300" y2="440"/><path d="M300 440 Q300 400 350 400"/><circle cx="356" cy="404" r="16"/></g>
      <g fill="rgba(30,42,58,0.35)"><circle cx="120" cy="828" r="16"/><path d="M120 844 L112 900 M120 844 L130 900 M120 852 L102 876 M120 852 L138 874" stroke="rgba(30,42,58,0.35)" stroke-width="7" fill="none"/>
      <circle cx="185" cy="836" r="13"/><path d="M185 849 L179 900 M185 849 L192 900" stroke="rgba(30,42,58,0.35)" stroke-width="6" fill="none"/></g>`);
    let cob = '<g stroke="rgba(30,42,58,0.30)" stroke-width="3" fill="none">';
    for (let cx = 80; cx < 2500; cx += 46 + rnd() * 30) cob += `<path d="M${cx} 906 q14 8 28 0"/>`;
    add(back, cob + '</g>');
    const lampGlow = add(back, `<circle cx="356" cy="404" r="60" fill="rgba(200,152,96,0.16)" filter="url(#atmoBlur)"/>`);
    extraAnim = t => { lampGlow.firstChild.style.opacity = 0.5 + 0.4 * Math.max(0, Math.sin(t / 1.3 * 6.283)); };
  }
  if (SID === 3) {
    add(back, `<line x1="60" y1="880" x2="2540" y2="880" stroke="rgba(30,42,58,0.25)" stroke-width="4"/>
      <rect x="1080" y="906" width="440" height="16" fill="rgba(30,42,58,0.18)"/><line x1="1140" y1="922" x2="1140" y2="958" stroke="rgba(30,42,58,0.2)" stroke-width="8"/><line x1="1460" y1="922" x2="1460" y2="958" stroke="rgba(30,42,58,0.2)" stroke-width="8"/>
      <path d="M420 240 L320 60 L720 60 Z" fill="rgba(200,152,96,0.07)" filter="url(#atmoBlur)"/>
      <path d="M1200 240 L1100 60 L1500 60 Z" fill="rgba(200,152,96,0.07)" filter="url(#atmoBlur)"/>
      <path d="M1980 240 L1880 60 L2280 60 Z" fill="rgba(255,107,107,0.06)" filter="url(#atmoBlur)"/>`);
  }
  if (SID === 8 || SID === 9) {
    // study-room props around the chart wall
    add(back, `<g stroke="#1E2A3A" stroke-width="5" fill="rgba(30,42,58,0.06)" opacity="0.8">
      <rect x="${W - 480}" y="120" width="220" height="300"/><line x1="${W - 480}" y1="220" x2="${W - 260}" y2="220" stroke-width="4"/><line x1="${W - 370}" y1="120" x2="${W - 370}" y2="420" stroke-width="4"/></g>
      <g fill="rgba(30,42,58,0.5)"><rect x="${W - 460}" y="960" width="130" height="18"/><rect x="${W - 445}" y="938" width="100" height="18"/><rect x="${W - 430}" y="916" width="70" height="18"/></g>
      <circle cx="${W - 560}" cy="965" r="26" fill="none" stroke="rgba(30,42,58,0.4)" stroke-width="5"/>`);
  }
  if (SID === 13) {
    // two slow wall gears + floor shadow
    const gear = (cx, cy, r) => {
      let g2 = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(30,42,58,0.30)" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="${r * 0.32}" fill="none" stroke="rgba(30,42,58,0.30)" stroke-width="5"/>`;
      for (let a = 0; a < 360; a += 30) g2 += `<line x1="${cx + Math.cos(a * 0.01745) * r}" y1="${cy + Math.sin(a * 0.01745) * r}" x2="${cx + Math.cos(a * 0.01745) * (r + 16)}" y2="${cy + Math.sin(a * 0.01745) * (r + 16)}" stroke="rgba(30,42,58,0.30)" stroke-width="6"/>`;
      return g2;
    };
    const g1 = add(back, gear(260, 300, 70));
    const g2 = add(back, gear(1950, 220, 52));
    add(back, `<ellipse cx="1100" cy="560" rx="150" ry="22" fill="rgba(30,42,58,0.12)" filter="url(#atmoBlur)"/>`);
    extraAnim = t => {
      g1.setAttribute('transform', `rotate(${(t * 14) % 360} 260 300)`);
      g2.setAttribute('transform', `rotate(${-(t * 20) % 360} 1950 220)`);
    };
  }
  if (SID === 17) {
    let tiles = '<g stroke="rgba(30,42,58,0.22)" stroke-width="3" fill="none">';
    for (let i = 0; i < 12; i++) tiles += `<line x1="${100 + i * 175}" y1="920" x2="${-140 + i * 210}" y2="1080"/>`;
    tiles += `<line x1="100" y1="975" x2="2100" y2="975"/><line x1="100" y1="1035" x2="2100" y2="1035"/></g>`;
    add(back, tiles);
    const sc = add(back, `<circle cx="240" cy="430" r="14" fill="rgba(200,152,96,0.5)"/><circle cx="1960" cy="430" r="14" fill="rgba(200,152,96,0.5)"/>
      <line x1="240" y1="444" x2="240" y2="500" stroke="rgba(30,42,58,0.3)" stroke-width="5"/><line x1="1960" y1="444" x2="1960" y2="500" stroke="rgba(30,42,58,0.3)" stroke-width="5"/>`);
    extraAnim = t => { sc.style.opacity = 0.6 + 0.4 * Math.max(0, Math.sin(t / 2.1 * 6.283)); };
  }

  // ---------- wrap seek ----------
  const orig = window.seek;
  window.seek = function (t) {
    orig(t);
    washes.forEach(w => {
      w.e.setAttribute('transform', `translate(${Math.sin((t / 19 + w.ph) * 6.283) * 26} ${Math.sin((t / 26 + w.ph) * 6.283) * 15})`);
    });
    motes.forEach(mo => {
      const ph = ((t / mo.p + mo.ph) % 1 + 1) % 1;
      mo.c.setAttribute('cx', (mo.x + Math.sin((t / 7 + mo.ph) * 6.283) * mo.drift).toFixed(1));
      mo.c.setAttribute('cy', ((1 - ph) * H).toFixed(1));
      mo.c.style.opacity = Math.sin(ph * Math.PI) * 0.35;
    });
    if (extraAnim) extraAnim(t);
  };
  window.seek(0);
})();
