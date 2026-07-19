// Deterministic animation runtime: window.seek(t) renders card state at time t.
// Auto-choreography: masthead/colophon fade -> stage blocks rise -> SVG ink draw-in -> stamps slam last.
window.__setupAnim = function () {
  const els = [];
  const mast = document.querySelector('.masthead');
  const colo = document.querySelector('.colophon');
  const stage = document.querySelector('.stage');
  const stamps = [...document.querySelectorAll('.stamp')];

  if (mast) els.push({ el: mast, type: 'fade', delay: 0.0, dur: 0.5 });
  if (colo) els.push({ el: colo, type: 'fade', delay: 0.15, dur: 0.5 });

  let t = 0.25;
  const blocks = stage ? [...stage.children].filter(c => !c.classList.contains('stamps')) : [];
  for (const b of blocks) {
    els.push({ el: b, type: 'rise', delay: t, dur: 0.6 });
    t += 0.4;
  }

  // ink draw-in for stroked SVG geometry
  let di = 0;
  const geo = stage ? [...stage.querySelectorAll('path,line,rect,circle,polyline,ellipse')] : [];
  for (const s of geo) {
    if (!s.getTotalLength) continue;
    let L; try { L = s.getTotalLength(); } catch (e) { continue; }
    if (!L || !isFinite(L) || L < 4) continue;
    const cs = getComputedStyle(s);
    if (cs.stroke === 'none' || !cs.stroke) continue;
    els.push({ el: s, type: 'draw', delay: 0.7 + di * 0.07, dur: 0.75, len: L });
    di++;
  }

  const stampT = Math.max(t + 0.3, 0.7 + di * 0.07 + 0.5);
  stamps.forEach((s, i) => {
    const base = getComputedStyle(s).transform;
    els.push({ el: s, type: 'stamp', delay: stampT + i * 0.3, dur: 0.32, base: base === 'none' ? '' : base });
  });

  window.__anim = els;
  window.__animEnd = Math.max(...els.map(e => e.delay + e.dur), 1) + 0.25;
  return window.__animEnd;
};

window.seek = function (t) {
  for (const a of window.__anim) {
    const p = Math.min(1, Math.max(0, (t - a.delay) / a.dur));
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const el = a.el;
    if (a.type === 'fade') {
      el.style.opacity = p;
    } else if (a.type === 'rise') {
      el.style.opacity = p;
      el.style.transform = `translateY(${(1 - e) * 26}px)`;
    } else if (a.type === 'draw') {
      el.style.strokeDasharray = `${a.len}`;
      el.style.strokeDashoffset = `${(1 - e) * a.len}`;
      el.style.opacity = p > 0 ? '' : 0;
    } else if (a.type === 'stamp') {
      el.style.opacity = p > 0 ? Math.min(1, p * 2.5) : 0;
      el.style.transform = `${a.base} scale(${1.6 - 0.6 * e})`;
    }
  }
  return true;
};
