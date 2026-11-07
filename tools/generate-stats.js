#!/usr/bin/env node
/**
 * Считает статистику через GitHub API и генерирует:
 *   assets/languages.svg  — donut-диаграмма языков
 *   assets/stats.svg      — карточка метрик
 *
 * Запуск:  GITHUB_TOKEN=... node tools/generate-stats.js [username]
 * В Actions: GITHUB_TOKEN подставляется автоматически.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const USER = process.argv[2] || process.env.GITHUB_REPOSITORY_OWNER || 'windacont-oss';
const API = 'https://api.github.com';

const LANG_COLORS = {
  'C#': '#178600', 'C++': '#f34b7d', 'C': '#555555', 'Python': '#3572A5',
  'ShaderLab': '#222c37', 'HLSL': '#aace60', 'GLSL': '#5686a5',
  'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'HTML': '#e34c26',
  'CSS': '#563d7c', 'CMake': '#da3434', 'Batchfile': '#C1F12E',
  'Java': '#b07219', 'Lua': '#000080', 'Shell': '#89e051', 'Go': '#00ADD8',
  'Rust': '#dea584', 'PHP': '#4F5D95', 'Ruby': '#701516', 'Kotlin': '#A97BFF',
  'GDScript': '#355570', 'Game Maker Language': '#71b417'
};
const FALLBACK = ['#22d3ee', '#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#c084fc'];

function brighten(hex, amount = 0.35) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return '#' + [mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, '0')).join('');
}
function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}
function colorFor(lang, i) {
  const base = LANG_COLORS[lang] || FALLBACK[i % FALLBACK.length];
  return luminance(base) < 0.22 ? brighten(base, 0.45) : base;
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const kb = (n) => n >= 1024 ? (n / 1024).toFixed(1) + ' MB' : n.toFixed(1) + ' KB';

async function api(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'man1k3n-profile-stats'
    }
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

/* ------------------------------ languages ------------------------------ */

function languagesSVG(langs, totalBytes, user) {
  const W = 760, H = 420;
  const cx = 210, cy = 232, r = 112, sw = 34;
  const C = 2 * Math.PI * r;

  let offset = 0;
  let slices = '';
  let legend = '';
  const top = langs.slice(0, 7);
  const restBytes = langs.slice(7).reduce((a, l) => a + l.bytes, 0);
  if (restBytes > 0) top.push({ name: 'Other', bytes: restBytes, color: '#8b949e' });

  top.forEach((l, i) => {
    const pct = l.bytes / totalBytes;
    const len = Math.max(pct * C - 3, 0.5);
    slices += `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${l.color}" stroke-width="${sw}"
      stroke-linecap="butt" transform="rotate(-90 ${cx} ${cy})"
      stroke-dasharray="0 ${C.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}">
      <animate attributeName="stroke-dasharray" from="0 ${C.toFixed(2)}" to="${len.toFixed(2)} ${(C - len).toFixed(2)}"
        dur="1.1s" begin="${(0.15 + i * 0.09).toFixed(2)}s" fill="freeze" calcMode="spline"
        keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/>
    </circle>`;
    offset += pct * C;

    const y = 128 + i * 38;
    legend += `
    <g opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="${(0.5 + i * 0.07).toFixed(2)}s" fill="freeze"/>
      <circle cx="404" cy="${y - 5}" r="7" fill="${l.color}"/>
      <text x="424" y="${y}" font-family="'Cascadia Code','Consolas',monospace" font-size="17" fill="#c9d1d9">${esc(l.name)}</text>
      <text x="${W - 36}" y="${y}" text-anchor="end" font-family="'Cascadia Code','Consolas',monospace" font-size="17" fill="#6b7280">${(pct * 100).toFixed(1)}%</text>
    </g>`;
  });

  const topName = langs.length ? langs[0].name : '—';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Languages">
  <title>Languages of ${esc(user)}</title>
  <defs>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d0d1a"/>
      <stop offset="1" stop-color="#0a0a14"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.5" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#f472b6"/>
    </linearGradient>
    <style>
      .spin { transform-box: fill-box; transform-origin: center; animation: spinIn 1.6s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes spinIn { from { transform: rotate(-70deg) scale(.86); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }
      @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
    </style>
  </defs>

  <rect width="${W}" height="${H}" rx="18" fill="url(#card)" stroke="#1f2430"/>
  <rect x="0" y="0" width="${W}" height="3" rx="1.5" fill="url(#accent)"/>

  <text x="36" y="54" font-family="'Cascadia Code','Consolas',monospace" font-size="19" fill="#22d3ee">⟩ languages</text>
  <text x="${W - 36}" y="54" text-anchor="end" font-family="'Cascadia Code','Consolas',monospace" font-size="14" fill="#4b5563">${kb(totalBytes)} of code</text>

  <g class="spin">${slices}</g>

  <circle cx="${cx}" cy="${cy}" r="${r - sw / 2 - 10}" fill="#0b0a18" stroke="#1f2430" stroke-width="1"/>
  <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="'Segoe UI Black','Arial Black',sans-serif" font-size="26" font-weight="900" fill="#e5e7eb">${esc(topName)}</text>
  <text x="${cx}" y="${cy + 24}" text-anchor="middle" font-family="'Cascadia Code','Consolas',monospace" font-size="13" fill="#6b7280">top language</text>

  ${legend}
</svg>
`;
}

/* -------------------------------- stats -------------------------------- */

function statTile(x, value, label, color) {
  return `
  <g>
    <rect x="${x}" y="82" width="250" height="96" rx="14" fill="#101020" stroke="#1f2430"/>
    <text x="${x + 24}" y="130" font-family="'Segoe UI Black','Arial Black',sans-serif" font-weight="900"
      font-size="34" fill="${color}">${esc(value)}</text>
    <text x="${x + 24}" y="158" font-family="'Cascadia Code','Consolas',monospace" font-size="14" fill="#6b7280">${esc(label)}</text>
  </g>`;
}

function statsSVG({ user, repos, stars, followers, topLang, commits }) {
  const W = 1120, H = 210;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Stats">
  <title>Stats of ${esc(user)}</title>
  <defs>
    <linearGradient id="scard" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d0d1a"/>
      <stop offset="1" stop-color="#0a0a14"/>
    </linearGradient>
    <linearGradient id="saccent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.5" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#f472b6"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" rx="18" fill="url(#scard)" stroke="#1f2430"/>
  <rect x="0" y="0" width="${W}" height="3" rx="1.5" fill="url(#saccent)"/>
  <text x="36" y="52" font-family="'Cascadia Code','Consolas',monospace" font-size="19" fill="#22d3ee">⟩ stats</text>
  <text x="${W - 36}" y="52" text-anchor="end" font-family="'Cascadia Code','Consolas',monospace" font-size="14" fill="#4b5563">@${esc(user)}</text>
  ${statTile(30, repos, 'repositories', '#22d3ee')}
  ${statTile(293, stars, 'stars earned', '#a78bfa')}
  ${statTile(556, followers, 'followers', '#f472b6')}
  ${statTile(819, topLang, 'top language', '#34d399')}
</svg>
`;
}

/* ----------------------------------------------------------------------- */

/** Список репозиториев: публичный эндпоинт не всегда отдаёт приватные, поэтому объединяем с /user/repos. */
async function listRepos() {
  const seen = new Map();
  const urls = [
    `${API}/users/${USER}/repos?per_page=100&type=owner&sort=pushed`,
    `${API}/user/repos?per_page=100&affiliation=owner&sort=pushed`
  ];
  for (const url of urls) {
    try {
      const list = await api(url);
      if (!Array.isArray(list)) continue;
      for (const r of list) {
        if (r.owner && r.owner.login.toLowerCase() === USER.toLowerCase()) seen.set(r.full_name, r);
      }
    } catch (e) {
      console.warn('list failed ' + url + ': ' + e.message);
    }
  }
  return [...seen.values()];
}

(async () => {
  if (!TOKEN) throw new Error('GITHUB_TOKEN is not set');

  console.log('user: ' + USER);
  const user = await api(`${API}/users/${USER}`);
  const repos = await listRepos();

  const totals = new Map();
  let stars = 0;

  for (const repo of repos) {
    stars += repo.stargazers_count || 0;
    if (repo.fork) continue;
    // профильный репозиторий (<user>/<user>) — это витрина, а не код: не считаем его языки
    if (repo.name.toLowerCase() === USER.toLowerCase()) continue;
    try {
      const langs = await api(`${API}/repos/${repo.full_name}/languages`);
      for (const [name, bytes] of Object.entries(langs)) {
        totals.set(name, (totals.get(name) || 0) + bytes);
      }
    } catch (e) {
      console.warn('skip ' + repo.full_name + ': ' + e.message);
    }
  }

  const totalBytes = [...totals.values()].reduce((a, b) => a + b, 0);
  const langs = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, bytes], i) => ({ name, bytes, color: colorFor(name, i) }));

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'languages.svg'), languagesSVG(langs, totalBytes, USER), 'utf8');

  fs.writeFileSync(path.join(OUT, 'stats.svg'), statsSVG({
    user: USER,
    repos: repos.filter((r) => !r.fork && r.name.toLowerCase() !== USER.toLowerCase()).length,
    stars,
    followers: user.followers,
    topLang: langs.length ? langs[0].name : '—'
  }), 'utf8');

  console.log(`repos=${repos.length} stars=${stars} followers=${user.followers}`);
  console.log('languages: ' + langs.map((l) => `${l.name} ${(100 * l.bytes / totalBytes).toFixed(1)}%`).join(', '));
})().catch((e) => {
  console.error('ERROR: ' + e.message);
  process.exit(1);
});
