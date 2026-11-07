#!/usr/bin/env node
/**
 * Генератор анимированных SVG для профиля MAN1K3N.
 * Запуск:  node tools/generate-assets.js
 * Результат: assets/header.svg, assets/mannequin-fall.svg, assets/footer.svg
 */
'use strict';

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');
fs.mkdirSync(OUT, { recursive: true });

const CYCLE = 6.8;        // длительность цикла, сек
const IMPACT = 0.155;     // доля цикла, когда манекен бьётся о пол
const FLOOR = 520;        // линия пола
const SKIN = '#d8d2c8';   // цвет манекена
const JOINT = '#8f8880';  // цвет шарниров

const FIGURES = [
  { x: 190, scale: 1.05, delay: 0, accent: '#22d3ee', tilt: -9 },
  { x: 520, scale: 0.85, delay: 0.55, accent: '#a78bfa', tilt: 8 },
  { x: 850, scale: 1.22, delay: 1.1, accent: '#f472b6', tilt: -7 },
  { x: 1180, scale: 0.95, delay: 1.65, accent: '#22d3ee', tilt: 10 },
  { x: 1470, scale: 1.1, delay: 2.2, accent: '#a78bfa', tilt: -8 }
];

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(0x4d414e31);
const rr = (a, b) => a + (b - a) * rand();
const f = (n) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------ */
/*  header.svg                                                         */
/* ------------------------------------------------------------------ */

function header() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 320" width="1280" height="320" role="img" aria-labelledby="hTitle">
  <title id="hTitle">MAN1K3N — game developer</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#05060b"/>
      <stop offset="1" stop-color="#0b0a18"/>
    </linearGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.48" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#f472b6"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#f472b6" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glowC" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.30"/>
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowM" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#f472b6" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#f472b6" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
    <style>
      .glow  { animation: drift 9s ease-in-out infinite; }
      .glow2 { animation: drift 11s ease-in-out infinite reverse; }
      .scan  { animation: scan 5.5s linear infinite; }
      .jit   { animation: jitter 7s steps(1) infinite; }
      .uline { transform-box: fill-box; transform-origin: left center; animation: grow 6s ease-in-out infinite; }
      .dot   { animation: pulse 1.6s ease-in-out infinite; }
      .sub   { animation: fadeIn 2.4s ease-out both; }
      @keyframes drift {
        0%,100% { opacity: .55; transform: translate3d(0,0,0); }
        50%     { opacity: .95; transform: translate3d(22px,-12px,0); }
      }
      @keyframes scan {
        0%   { transform: translateY(-30px); opacity: 0; }
        10%  { opacity: .55; }
        90%  { opacity: .35; }
        100% { transform: translateY(330px); opacity: 0; }
      }
      @keyframes jitter {
        0%, 91%, 100% { transform: translate(0,0); }
        92% { transform: translate(-3px, 1px); }
        94% { transform: translate(2px, -2px); }
        96% { transform: translate(-1px, 2px); }
      }
      @keyframes grow {
        0%        { transform: scaleX(0); }
        22%, 82%  { transform: scaleX(1); }
        100%      { transform: scaleX(0); }
      }
      @keyframes pulse {
        0%,100% { opacity: 1; r: 4; }
        50%     { opacity: .35; r: 6; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        .glow,.glow2,.scan,.jit,.uline,.dot,.sub { animation: none !important; }
      }
    </style>
  </defs>

  <rect width="1280" height="320" fill="url(#bg)"/>
  <rect width="1280" height="320" fill="url(#grid)"/>

  <ellipse class="glow"  cx="250" cy="60"  rx="360" ry="200" fill="url(#glowC)"/>
  <ellipse class="glow2" cx="1040" cy="280" rx="420" ry="230" fill="url(#glowM)"/>

  <text x="64" y="52" font-family="'Cascadia Code','Consolas',monospace" font-size="15" fill="#4b5563">root@man1k3n:~$ whoami</text>
  <text x="1216" y="52" text-anchor="end" font-family="'Cascadia Code','Consolas',monospace" font-size="15" fill="#4b5563">game dev / godot / unity</text>

  <g class="jit">
    <text x="640" y="196" text-anchor="middle" font-family="'Segoe UI Black','Arial Black',Impact,sans-serif"
          font-weight="900" font-size="126" letter-spacing="10" fill="#22d3ee" opacity="0.5" transform="translate(-3,-2)">MAN1K3N</text>
    <text x="640" y="196" text-anchor="middle" font-family="'Segoe UI Black','Arial Black',Impact,sans-serif"
          font-weight="900" font-size="126" letter-spacing="10" fill="#f472b6" opacity="0.5" transform="translate(3,2)">MAN1K3N</text>
    <text x="640" y="196" text-anchor="middle" font-family="'Segoe UI Black','Arial Black',Impact,sans-serif"
          font-weight="900" font-size="126" letter-spacing="10" fill="url(#name)">MAN1K3N</text>
  </g>

  <rect class="uline" x="380" y="228" width="520" height="2" fill="url(#line)"/>

  <text class="sub" x="640" y="268" text-anchor="middle" font-family="'Cascadia Code','Consolas',monospace" font-size="17" fill="#9ca3af">game developer · godot · gdscript · unity</text>

  <g class="dot">
    <circle cx="468" cy="296" r="4" fill="#22d3ee"/>
  </g>
  <text x="482" y="301" font-family="'Cascadia Code','Consolas',monospace" font-size="13" fill="#4b5563">build · break · repeat</text>

  <rect class="scan" x="0" y="0" width="1280" height="2" fill="#22d3ee" opacity="0.25"/>
  <rect x="0" y="0" width="1280" height="320" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>
</svg>
`;
}

/* ------------------------------------------------------------------ */
/*  mannequin-fall.svg                                                 */
/* ------------------------------------------------------------------ */

/** Разбирает манекена на части: каждая — свой фрагмент со своим центром. */
function mannequinParts() {
  const P = [];

  P.push({
    cx: 0, cy: -214,
    svg: `<circle cx="0" cy="-214" r="15" fill="${SKIN}"/>` +
         `<path d="M -9 -220 a 9 9 0 0 1 18 0" fill="none" stroke="${JOINT}" stroke-opacity="0.35" stroke-width="2"/>`
  });

  P.push({
    cx: 0, cy: -197,
    svg: `<rect x="-5" y="-203" width="10" height="13" rx="4" fill="${JOINT}"/>`
  });

  P.push({
    cx: 0, cy: -164,
    svg: `<path d="M -27 -191 C -31 -172 -27 -152 -18 -138 L 18 -138 C 27 -152 31 -172 27 -191 Z" fill="${SKIN}"/>`
  });

  P.push({
    cx: 0, cy: -130,
    svg: `<rect x="-17" y="-139" width="34" height="18" rx="8" fill="${SKIN}"/>`
  });

  for (const s of [-1, 1]) {
    const sh = [26 * s, -188];
    const el = [40 * s, -149];
    const wr = [33 * s, -107];
    const hip = [11 * s, -132];
    const knee = [15 * s, -68];
    const ankle = [12 * s, -6];

    P.push({
      cx: (sh[0] + el[0]) / 2, cy: (sh[1] + el[1]) / 2,
      svg: `<path d="M${sh[0]} ${sh[1]} L${el[0]} ${el[1]}" stroke="${SKIN}" stroke-width="12" stroke-linecap="round" fill="none"/>` +
           `<circle cx="${sh[0]}" cy="${sh[1]}" r="5.5" fill="${JOINT}"/>` +
           `<circle cx="${el[0]}" cy="${el[1]}" r="5.5" fill="${JOINT}"/>`
    });

    P.push({
      cx: (el[0] + wr[0]) / 2, cy: (el[1] + wr[1]) / 2,
      svg: `<path d="M${el[0]} ${el[1]} L${wr[0]} ${wr[1]}" stroke="${SKIN}" stroke-width="11" stroke-linecap="round" fill="none"/>` +
           `<circle cx="${wr[0]}" cy="${wr[1]}" r="5" fill="${JOINT}"/>`
    });

    P.push({
      cx: (hip[0] + knee[0]) / 2, cy: (hip[1] + knee[1]) / 2,
      svg: `<path d="M${hip[0]} ${hip[1]} L${knee[0]} ${knee[1]}" stroke="${SKIN}" stroke-width="14" stroke-linecap="round" fill="none"/>` +
           `<circle cx="${hip[0]}" cy="${hip[1]}" r="6" fill="${JOINT}"/>` +
           `<circle cx="${knee[0]}" cy="${knee[1]}" r="6" fill="${JOINT}"/>`
    });

    P.push({
      cx: (knee[0] + ankle[0]) / 2, cy: (knee[1] + ankle[1]) / 2,
      svg: `<path d="M${knee[0]} ${knee[1]} L${ankle[0]} ${ankle[1]}" stroke="${SKIN}" stroke-width="13" stroke-linecap="round" fill="none"/>` +
           `<circle cx="${ankle[0]}" cy="${ankle[1]}" r="5.5" fill="${JOINT}"/>` +
           `<ellipse cx="${12 * s}" cy="-4" rx="12" ry="5" fill="${SKIN}"/>`
    });
  }

  return P;
}

/** Разлетающиеся обломки: та же геометрия, но каждый вращается вокруг своего центра. */
function debris(parts, x, y, scale, color, begin) {
  const dur = `${CYCLE}s`;
  const b = `${f(begin)}s`;

  return parts.map((p, i) => {
    const dir = p.cx === 0 ? (rand() < 0.5 ? -1 : 1) : Math.sign(p.cx);
    const dx = f(dir * rr(45, 165));
    const dy = f(rr(-175, -25) * (i === 0 ? 1.25 : 1));
    const rot = f(rr(-300, 300));

    return `
    <g transform="translate(${x},${y}) scale(${scale})" opacity="0">
      <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;${IMPACT};${f(IMPACT + 0.01)};0.3;0.55;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0 0;0 0;${dx} ${dy};${dx} ${dy}" keyTimes="0;${IMPACT};0.6;1"
          dur="${dur}" begin="${b}" repeatCount="indefinite"/>
        <g transform="translate(${f(p.cx)},${f(p.cy)})">
          <animateTransform attributeName="transform" type="rotate"
            values="0;0;${rot};${rot}" keyTimes="0;${IMPACT};0.6;1"
            dur="${dur}" begin="${b}" repeatCount="indefinite"/>
          <g transform="translate(${f(-p.cx)},${f(-p.cy)})">${p.svg}</g>
        </g>
      </g>
    </g>`;
  }).join('');
}

/** Пыль, вспышка, трещины и искры в точке удара. */
function impactFx(x, color, begin) {
  const dur = `${CYCLE}s`;
  const b = `${f(begin)}s`;

  const cracks = [-1, 1].map((dir) => {
    const len = f(rr(30, 70));
    const bend = f(rr(4, 15));
    return `
    <path d="M0 0 l ${f(dir * len * 0.45)} ${bend} l ${f(dir * len * 0.55)} ${f(-bend * 0.4)}"
      fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0"
      transform="translate(${x},${FLOOR})">
      <animate attributeName="opacity" values="0;0;0.5;0;0" keyTimes="0;${IMPACT};${f(IMPACT + 0.02)};0.42;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
    </path>`;
  }).join('');

  let sparks = '';
  for (let i = 0; i < 7; i++) {
    const dx = f(rr(-120, 120));
    const dy = f(rr(-110, -20));
    const r = f(rr(1.4, 3));
    sparks += `
    <circle cx="${x}" cy="${FLOOR - 6}" r="${r}" fill="${color}" opacity="0">
      <animate attributeName="opacity" values="0;0;0.95;0;0" keyTimes="0;${IMPACT};${f(IMPACT + 0.01)};0.36;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate"
        values="0 0;0 0;${dx} ${dy};${dx} ${dy}" keyTimes="0;${IMPACT};0.4;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
    </circle>`;
  }

  return `
    <ellipse cx="${x}" cy="${FLOOR - 4}" rx="10" ry="4" fill="${color}" opacity="0">
      <animate attributeName="opacity" values="0;0;0.7;0;0" keyTimes="0;${IMPACT};${f(IMPACT + 0.02)};0.45;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <animate attributeName="rx" values="10;10;130;130" keyTimes="0;${IMPACT};0.45;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <animate attributeName="ry" values="4;4;24;24" keyTimes="0;${IMPACT};0.45;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
    </ellipse>
    <circle cx="${x}" cy="${FLOOR - 22}" r="6" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;0;0.85;0;0" keyTimes="0;${IMPACT};${f(IMPACT + 0.02)};0.3;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <animate attributeName="r" values="6;6;52;6" keyTimes="0;${IMPACT};0.3;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
    </circle>
    ${cracks}${sparks}`;
}

function mannequinFall() {
  const parts = mannequinParts();
  const assembled = parts.map((p) => p.svg).join('');

  let figures = '';
  let fx = '';
  let dbg = '';

  FIGURES.forEach((fig) => {
    const impactAt = fig.delay + IMPACT * CYCLE;

    figures += `
    <g transform="translate(${fig.x},${FLOOR})">
      <g class="figure" style="--tilt:${fig.tilt}deg; animation-delay:${fig.delay}s; filter: drop-shadow(0 0 16px ${fig.accent}55)">
        ${assembled}
      </g>
    </g>`;

    dbg += debris(parts, fig.x, FLOOR, fig.scale, fig.accent, impactAt);
    fx += impactFx(fig.x, fig.accent, impactAt);
  });

  // фоновая пыль
  let motes = '';
  for (let i = 0; i < 34; i++) {
    const cx = f(rr(20, 1580));
    const cy = f(rr(60, 470));
    const r = f(rr(0.8, 2.4));
    const d = f(rr(4, 11));
    const dl = f(rr(0, 9));
    const op = f(rr(0.15, 0.5));
    motes += `<circle class="mote" cx="${cx}" cy="${cy}" r="${r}" fill="#a78bfa" opacity="0" style="animation-duration:${d}s;animation-delay:${dl}s;--o:${op}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 620" width="1600" height="620" role="img" aria-labelledby="mTitle">
  <title id="mTitle">Mannequins fall and shatter</title>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#05060b"/>
      <stop offset="0.62" stop-color="#0a0a16"/>
      <stop offset="1" stop-color="#120a1e"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="halo2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#f472b6" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#f472b6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#f472b6" stop-opacity="0"/>
    </linearGradient>
    <pattern id="vlines" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
    </pattern>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <style>
      .figure {
        transform-box: fill-box;
        transform-origin: 50% 100%;
        animation: drop ${CYCLE}s cubic-bezier(.55,0,.9,.45) infinite both;
      }
      @keyframes drop {
        0%    { transform: translateY(-640px) rotate(var(--tilt)); opacity: 0; }
        3%    { opacity: 1; }
        13.8% { transform: translateY(0) rotate(0deg); opacity: 1; }
        15.1% { transform: translateY(10px) scale(1.07,.9); opacity: 1; }
        15.5% { transform: translateY(0) scale(1,1); opacity: 0; }
        99.9% { transform: translateY(-640px) rotate(var(--tilt)); opacity: 0; }
        100%  { transform: translateY(-640px) rotate(var(--tilt)); opacity: 0; }
      }
      .mote { animation-name: mote; animation-iteration-count: infinite; animation-timing-function: linear; }
      @keyframes mote {
        0%   { opacity: 0; transform: translateY(0); }
        15%  { opacity: var(--o); }
        100% { opacity: 0; transform: translateY(-190px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .figure { animation: none; opacity: 1; }
        .mote { animation: none; opacity: 0; }
      }
    </style>
  </defs>

  <rect width="1600" height="620" fill="url(#sky)"/>
  <rect width="1600" height="620" fill="url(#vlines)"/>
  <ellipse cx="420" cy="140" rx="560" ry="260" fill="url(#halo)"/>
  <ellipse cx="1220" cy="420" rx="620" ry="300" fill="url(#halo2)"/>

  <g>${motes}</g>
  <g>${figures}</g>
  <g>${dbg}</g>
  <g>${fx}</g>

  <rect x="0" y="${FLOOR}" width="1600" height="2" fill="url(#floor)"/>
  <rect x="0" y="${FLOOR - 14}" width="1600" height="28" fill="url(#floor)" opacity="0.18" filter="url(#soft)"/>

  <text x="40" y="${FLOOR + 62}" font-family="'Cascadia Code','Consolas',monospace" font-size="15" fill="#3f3f52">// gravity always wins</text>
  <text x="1560" y="${FLOOR + 62}" text-anchor="end" font-family="'Cascadia Code','Consolas',monospace" font-size="15" fill="#3f3f52">man1k3n v1.1</text>
</svg>
`;
}

/* ------------------------------------------------------------------ */
/*  footer.svg                                                         */
/* ------------------------------------------------------------------ */

function footer() {
  let d = 'M0 96';
  for (let x = 0; x < 2400; x += 400) {
    d += ` C ${x + 66.7} 56, ${x + 133.3} 56, ${x + 200} 96`;
    d += ` C ${x + 266.7} 136, ${x + 333.3} 136, ${x + 400} 96`;
  }
  const wave = (dy, cls) => `<path class="${cls}" transform="translate(0,${dy})" d="${d} V 160 H 0 Z"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 160" width="1600" height="160" role="img" aria-label="MAN1K3N footer">
  <title>MAN1K3N</title>
  <defs>
    <linearGradient id="fw1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="#a78bfa" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#f472b6" stop-opacity="0.55"/>
    </linearGradient>
    <linearGradient id="fw2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f472b6" stop-opacity="0.22"/>
      <stop offset="0.5" stop-color="#22d3ee" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#a78bfa" stop-opacity="0.22"/>
    </linearGradient>
    <linearGradient id="ftxt" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.5" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#f472b6"/>
    </linearGradient>
    <style>
      .w1 { fill: url(#fw1); animation: slide 9s linear infinite; }
      .w2 { fill: url(#fw2); animation: slide 14s linear infinite reverse; }
      @keyframes slide { from { transform: translateX(0); } to { transform: translateX(-800px); } }
      @media (prefers-reduced-motion: reduce) { .w1, .w2 { animation: none; } }
    </style>
  </defs>
  <rect width="1600" height="160" fill="#07070d"/>
  ${wave(30, 'w2')}
  ${wave(0, 'w1')}
  <text x="800" y="76" text-anchor="middle" font-family="'Segoe UI Black','Arial Black',Impact,sans-serif"
    font-weight="900" font-size="40" letter-spacing="8" fill="url(#ftxt)">MAN1K3N</text>
  <text x="800" y="108" text-anchor="middle" font-family="'Cascadia Code','Consolas',monospace"
    font-size="13" fill="#9ca3af">// build · break · repeat</text>
</svg>
`;
}

/* ------------------------------------------------------------------ */

const kb = (p) => (fs.statSync(p).size / 1024).toFixed(1) + ' KB';

fs.writeFileSync(path.join(OUT, 'header.svg'), header(), 'utf8');
fs.writeFileSync(path.join(OUT, 'mannequin-fall.svg'), mannequinFall(), 'utf8');
fs.writeFileSync(path.join(OUT, 'footer.svg'), footer(), 'utf8');

console.log('header.svg          ' + kb(path.join(OUT, 'header.svg')));
console.log('mannequin-fall.svg  ' + kb(path.join(OUT, 'mannequin-fall.svg')));
console.log('footer.svg          ' + kb(path.join(OUT, 'footer.svg')));
