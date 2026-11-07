#!/usr/bin/env node
/**
 * Генератор анимированных SVG для профиля MAN1K3N.
 * Запуск:  node tools/generate-assets.js
 * Результат: assets/header.svg, assets/mannequin-fall.svg
 */
'use strict';

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');
fs.mkdirSync(OUT, { recursive: true });

const CYCLE = 6.4;          // длительность цикла падения, сек
const STAGGER = 0.42;       // задержка между буквами, сек
const IMPACT = 0.17;        // доля цикла, когда буква бьётся о пол
const FLOOR = 520;          // линия пола
const BASE = 500;           // базовая линия текста
const LETTERS = ['M', 'A', 'N', '1', 'K', '3', 'N'];
const PALETTE = ['#22d3ee', '#a78bfa', '#f472b6', '#22d3ee', '#a78bfa', '#f472b6', '#22d3ee'];

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
    <filter id="blur12" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
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
  <text x="1216" y="52" text-anchor="end" font-family="'Cascadia Code','Consolas',monospace" font-size="15" fill="#4b5563">game dev / unity / c#</text>

  <g class="jit">
    <text x="640" y="196" text-anchor="middle" font-family="'Segoe UI Black','Arial Black',Impact,sans-serif"
          font-weight="900" font-size="126" letter-spacing="10" fill="#22d3ee" opacity="0.5" transform="translate(-3,-2)">MAN1K3N</text>
    <text x="640" y="196" text-anchor="middle" font-family="'Segoe UI Black','Arial Black',Impact,sans-serif"
          font-weight="900" font-size="126" letter-spacing="10" fill="#f472b6" opacity="0.5" transform="translate(3,2)">MAN1K3N</text>
    <text x="640" y="196" text-anchor="middle" font-family="'Segoe UI Black','Arial Black',Impact,sans-serif"
          font-weight="900" font-size="126" letter-spacing="10" fill="url(#name)">MAN1K3N</text>
  </g>

  <rect class="uline" x="380" y="228" width="520" height="2" fill="url(#line)"/>

  <text class="sub" x="640" y="268" text-anchor="middle" font-family="'Cascadia Code','Consolas',monospace" font-size="17" fill="#9ca3af">gameplay programmer · unity · c# · c++ · reverse engineering</text>

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

function shard(x, y, color, begin) {
  const pts = [];
  const n = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + rr(-0.4, 0.4);
    const r = rr(6, 16);
    pts.push(`${f(Math.cos(a) * r)},${f(Math.sin(a) * r)}`);
  }
  const dx = f(rr(-150, 150));
  const dy = f(rr(-110, 70));
  const rot = f(rr(-260, 260));
  const dur = `${CYCLE}s`;
  const b = `${f(begin)}s`;
  return `
    <g opacity="0" transform="translate(${f(x)},${f(y)})">
      <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.17;0.18;0.34;0.55;1" dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" additive="sum"
        values="0 0;0 0;${dx} ${dy};${dx} ${dy}" keyTimes="0;0.17;0.55;1"
        dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <polygon points="${pts.join(' ')}" fill="${color}">
        <animateTransform attributeName="transform" type="rotate"
          values="0;0;${rot};${rot}" keyTimes="0;0.17;0.55;1"
          dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      </polygon>
    </g>`;
}

function effects(x, color, i) {
  const begin = f(i * STAGGER);
  const dur = `${CYCLE}s`;
  const b = `${begin}s`;

  const dust = `
    <ellipse cx="${x}" cy="${FLOOR - 4}" rx="10" ry="4" fill="${color}" opacity="0">
      <animate attributeName="opacity" values="0;0;0.75;0;0" keyTimes="0;0.17;0.19;0.48;1" dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <animate attributeName="rx" values="10;10;110;110" keyTimes="0;0.17;0.48;1" dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <animate attributeName="ry" values="4;4;20;20" keyTimes="0;0.17;0.48;1" dur="${dur}" begin="${b}" repeatCount="indefinite"/>
    </ellipse>`;

  const flash = `
    <circle cx="${x}" cy="${FLOOR - 18}" r="6" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.17;0.19;0.3;1" dur="${dur}" begin="${b}" repeatCount="indefinite"/>
      <animate attributeName="r" values="6;6;46;6" keyTimes="0;0.17;0.3;1" dur="${dur}" begin="${b}" repeatCount="indefinite"/>
    </circle>`;

  const cracks = [-1, 1].map((dir) => {
    const len = f(rr(28, 62));
    const bend = f(rr(4, 14));
    return `
    <path d="M0 0 l ${f(dir * len * 0.45)} ${bend} l ${f(dir * len * 0.55)} ${f(-bend * 0.4)}"
      fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0"
      transform="translate(${x},${FLOOR})">
      <animate attributeName="opacity" values="0;0;0.55;0;0" keyTimes="0;0.17;0.19;0.42;1" dur="${dur}" begin="${b}" repeatCount="indefinite"/>
    </path>`;
  }).join('');

  let shards = '';
  const shardCount = 11;
  for (let k = 0; k < shardCount; k++) {
    shards += shard(
      x + rr(-52, 52),
      BASE - rr(6, 96),
      color,
      begin + IMPACT * CYCLE
    );
  }

  return `<g>${dust}${flash}${cracks}${shards}</g>`;
}

function mannequinFall() {
  let letters = '';
  let fx = '';

  LETTERS.forEach((ch, i) => {
    const x = 200 + i * 200;
    const color = PALETTE[i];
    const delay = f(i * STAGGER);
    const rot = i % 2 ? 13 : -11;
    letters += `
    <text class="ltr" x="${x}" y="${BASE}" text-anchor="middle" fill="${color}"
      font-family="'Segoe UI Black','Arial Black',Impact,sans-serif" font-weight="900" font-size="168"
      style="--rot:${rot}deg; animation-delay:${delay}s">${ch}</text>`;
    fx += effects(x, color, i);
  });

  // фоновые пылинки
  let motes = '';
  for (let i = 0; i < 34; i++) {
    const cx = f(rr(20, 1580));
    const cy = f(rr(60, 470));
    const r = f(rr(0.8, 2.4));
    const d = f(rr(4, 11));
    const dl = f(rr(0, 9));
    const op = f(rr(0.15, 0.5));
    motes += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#a78bfa" opacity="0" style="animation-duration:${d}s;animation-delay:${dl}s;--o:${op}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 620" width="1600" height="620" role="img" aria-labelledby="mTitle">
  <title id="mTitle">MAN1K3N — letters fall and shatter</title>
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
      .ltr {
        transform-box: fill-box;
        transform-origin: 50% 100%;
        animation: drop ${CYCLE}s cubic-bezier(.55,0,.9,.45) infinite;
        filter: drop-shadow(0 0 14px rgba(167,139,250,.35));
      }
      @keyframes drop {
        0%    { transform: translateY(-560px) rotate(var(--rot)); opacity: 0; }
        3%    { opacity: 1; }
        15%   { transform: translateY(0) rotate(0deg); opacity: 1; }
        17%   { transform: translateY(12px) scale(1.08,.86); opacity: 1; }
        19%   { transform: translateY(-28px) scale(.96,1.04); opacity: 1; }
        22%   { transform: translateY(0) scale(1,1); opacity: 1; }
        24%   { opacity: 0; }
        99.9% { transform: translateY(-560px) rotate(var(--rot)); opacity: 0; }
        100%  { transform: translateY(-560px) rotate(var(--rot)); opacity: 0; }
      }
      .mote { animation-name: mote; animation-iteration-count: infinite; animation-timing-function: linear; }
      @keyframes mote {
        0%   { opacity: 0; transform: translateY(0); }
        15%  { opacity: var(--o); }
        100% { opacity: 0; transform: translateY(-190px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .ltr { animation: none; opacity: 1; }
        .mote { animation: none; opacity: 0; }
      }
    </style>
  </defs>

  <rect width="1600" height="620" fill="url(#sky)"/>
  <rect width="1600" height="620" fill="url(#vlines)"/>
  <ellipse cx="420" cy="140" rx="560" ry="260" fill="url(#halo)"/>
  <ellipse cx="1220" cy="420" rx="620" ry="300" fill="url(#halo2)"/>

  <g>${motes}</g>

  <g>${letters}</g>
  <g>${fx}</g>

  <rect x="0" y="${FLOOR}" width="1600" height="2" fill="url(#floor)"/>
  <rect x="0" y="${FLOOR - 14}" width="1600" height="28" fill="url(#floor)" opacity="0.18" filter="url(#soft)"/>

  <text x="40" y="${FLOOR + 62}" font-family="'Cascadia Code','Consolas',monospace" font-size="15" fill="#3f3f52">// gravity always wins</text>
  <text x="1560" y="${FLOOR + 62}" text-anchor="end" font-family="'Cascadia Code','Consolas',monospace" font-size="15" fill="#3f3f52">man1k3n v1.0</text>
</svg>
`;
}

/* ------------------------------------------------------------------ */

fs.writeFileSync(path.join(OUT, 'header.svg'), header(), 'utf8');
fs.writeFileSync(path.join(OUT, 'mannequin-fall.svg'), mannequinFall(), 'utf8');

const kb = (p) => (fs.statSync(p).size / 1024).toFixed(1) + ' KB';
console.log('header.svg          ' + kb(path.join(OUT, 'header.svg')));
console.log('mannequin-fall.svg  ' + kb(path.join(OUT, 'mannequin-fall.svg')));
