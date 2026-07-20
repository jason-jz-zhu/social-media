// v4 animation library — deterministic seek(t) helpers for full-bleed animated scenes.
window.A = {
  clamp: (v, a, b) => Math.min(b, Math.max(a, v)),
  // one-shot progress: 0 before st, 0..1 during [st, st+d], 1 after
  once: (t, st, d) => window.A.clamp((t - st) / d, 0, 1),
  ease: p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
  easeOut: p => 1 - Math.pow(1 - p, 3),
  // looping phase 0..1
  loop: (t, period, phase = 0) => ((t / period + phase) % 1 + 1) % 1,
  sin: (t, period, phase = 0) => Math.sin((t / period + phase) * Math.PI * 2),
  lerp: (a, b, p) => a + (b - a) * p,
  // camera keyframes: [{t, x, y?, z?}] -> interpolated {x,y,z}
  kf(frames, t) {
    if (t <= frames[0].t) return { x: frames[0].x, y: frames[0].y || 0, z: frames[0].z || 1 };
    for (let i = 1; i < frames.length; i++) {
      if (t <= frames[i].t) {
        const a = frames[i - 1], b = frames[i];
        const p = window.A.ease((t - a.t) / (b.t - a.t));
        return {
          x: window.A.lerp(a.x, b.x, p),
          y: window.A.lerp(a.y || 0, b.y || 0, p),
          z: window.A.lerp(a.z || 1, b.z || 1, p),
        };
      }
    }
    const l = frames[frames.length - 1];
    return { x: l.x, y: l.y || 0, z: l.z || 1 };
  },
  // ink draw-in: p 0..1
  draw(el, p) {
    const L = el.__L || (el.__L = el.getTotalLength());
    el.style.strokeDasharray = `${L}`;
    el.style.strokeDashoffset = `${(1 - p) * L}`;
  },
  // scroll a dashed stroke (belts, current flow). speed px/s
  flow(el, t, speed) { el.style.strokeDashoffset = `${-t * speed}`; },
  rot(el, deg, cx, cy) { el.setAttribute('transform', `rotate(${deg} ${cx} ${cy})`); },
  xy(el, x, y) { el.setAttribute('transform', `translate(${x} ${y})`); },
  show(el, p) { el.style.opacity = p; },
};

window.applyCam = function (c) {
  const cam = document.getElementById('camera');
  cam.style.transformOrigin = '0 0';
  cam.style.transform = `scale(${c.z || 1}) translate(${-c.x}px, ${-(c.y || 0)}px)`;
};

// stick-figure walker: returns SVG group markup; drive with A.walk(id, t, opts)
window.A.walkerSVG = function (id, ink = '#1E2A3A') {
  return `<g id="${id}">
    <circle class="w-head" cx="0" cy="-92" r="16" fill="${ink}"/>
    <line class="w-body" x1="0" y1="-76" x2="0" y2="-34" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
    <line class="w-armL" x1="0" y1="-66" x2="-14" y2="-40" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>
    <line class="w-armR" x1="0" y1="-66" x2="14" y2="-40" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>
    <line class="w-legL" x1="0" y1="-34" x2="-10" y2="0" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
    <line class="w-legR" x1="0" y1="-34" x2="10" y2="0" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
  </g>`;
};
// place walker at (x, groundY), walking phase from t (stride ~0.55s), facing: 1 right, -1 left
window.A.walk = function (id, t, x, groundY, opts = {}) {
  const g = document.getElementById(id);
  if (!g) return;
  const stride = opts.stride || 0.55;
  const ph = window.A.sin(t, stride);
  const ph2 = window.A.sin(t, stride, 0.5);
  const bob = Math.abs(window.A.sin(t, stride / 2)) * 2.5;
  const face = opts.face || 1;
  const s = opts.scale || 1;
  g.setAttribute('transform', `translate(${x} ${groundY - bob * s}) scale(${face * s} ${s})`);
  const set = (cls, x2, y2) => { const e = g.querySelector('.' + cls); e.setAttribute('x2', x2); e.setAttribute('y2', y2); };
  if (opts.still) { set('w-legL', -8, 0); set('w-legR', 8, 0); set('w-armL', -12, -40); set('w-armR', 12, -40); }
  else {
    set('w-legL', ph * 16, 0); set('w-legR', ph2 * 16, 0);
    set('w-armL', ph2 * 13, -40); set('w-armR', ph * 13, -40);
  }
};
