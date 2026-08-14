// Sahna, kamera sayohati, til almashtirish va UI boshqaruvi.
//
// Tuzilish: umumiy "umurtqa" (mashina kodidan fotongacha) bir marta quriladi va
// hamma tillar uchun qayta ishlatiladi; har bir tilning "boshi" esa birinchi
// tanlanganda quriladi va keshda qoladi.

import * as THREE from 'three';
import { SPINE } from './content/spine.js';
import { LANGUAGES, byId, levelsFor } from './languages.js';
import { points, segments, clamp, lerp, damp, smooth } from './lib/gfx.js';

const GAP = 72;
const RAIL_PX = 56;

// ── Sahna ───────────────────────────────────────────────────────────────────
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x05070f, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x05070f, 44, 96);

const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 600);
scene.add(camera);

const MAX_LEVELS = Math.max(...LANGUAGES.map((l) => l.levels.length)) + SPINE.length;

// ── Fon: yulduzlar va vertikal "shaxta" chiziqlari ──────────────────────────
{
  const SN = 1600;
  const pos = new Float32Array(SN * 3);
  const bottom = -(MAX_LEVELS - 1) * GAP - 60;
  for (let i = 0; i < SN; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 260;
    pos[i * 3 + 1] = lerp(60, bottom, Math.random());
    pos[i * 3 + 2] = -30 - Math.random() * 150;
  }
  const stars = points(pos, 0x8fb4ff, 0.55, 0.55);
  stars.material.fog = false;
  scene.add(stars);

  const spineLines = [];
  for (let i = 0; i < MAX_LEVELS; i++) {
    const y = -i * GAP;
    [-26, 26].forEach((x) => {
      spineLines.push(new THREE.Vector3(x, y + 22, -14), new THREE.Vector3(x, y - 22, -14));
    });
    spineLines.push(new THREE.Vector3(-3, y - 34, -14), new THREE.Vector3(3, y - 34, -14));
  }
  scene.add(segments(spineLines, 0x1e2b45, 0.55));
}

// ── Qatlamlarni qurish ──────────────────────────────────────────────────────
const toMeta = (level) => ({
  ...level,
  color: new THREE.Color(level.color),
  color2: new THREE.Color(level.color2)
});

function buildAll(levels) {
  return levels.map((level) => {
    const built = level.build(toMeta(level));
    built.group.visible = false;
    scene.add(built.group);
    return built;
  });
}

// Umurtqa bir marta quriladi. Tilga bog'liq bir nechta yorliq keyin
// setLang() orqali almashtiriladi.
const first = LANGUAGES[0];
const spineLevels = levelsFor(first).slice(first.levels.length);
const spineBuilt = buildAll(spineLevels);

// Bosh qismlar — talab bo'yicha
const headCache = new Map();
function headFor(lang) {
  if (!headCache.has(lang.id)) {
    headCache.set(lang.id, buildAll(levelsFor(lang).slice(0, lang.levels.length)));
  }
  return headCache.get(lang.id);
}

let current = null;   // joriy til
let LEVELS = [];      // joriy qatlamlar ro'yxati (matn + view)
let built = [];       // mos quruvchilar natijasi
let N = 0;

function applyLanguage(lang) {
  // Eski boshni yashiramiz
  if (current) headFor(current).forEach((b) => (b.group.visible = false));

  current = lang;
  const all = levelsFor(lang);
  LEVELS = all;
  N = all.length;

  const head = headFor(lang);
  built = [...head, ...spineBuilt];
  built.forEach((b, i) => { b.group.position.y = -i * GAP; });
  spineBuilt.forEach((b) => b.setLang?.(lang.lang));

  fitScale.length = xShiftOf.length = 0;
  for (let i = 0; i < N; i++) { fitScale.push(1); xShiftOf.push(0); }

  buildRail();
  resize();
  uiIndex = -1;
  target = clamp(target, 0, N - 1);
  pos = clamp(pos, 0, N - 1);
  document.documentElement.style.setProperty('--accent', '#' + lang.levels[0].color.toString(16).padStart(6, '0'));
}

// ── Aylanish (scroll) boshqaruvi ────────────────────────────────────────────
let target = 0;
let pos = 0;
let uiIndex = -1;
let locked = 0;

const go = (d) => { target = clamp(target + d, 0, N - 1); hideHero(); };
const jump = (i) => { target = clamp(i, 0, N - 1); hideHero(); };

let wheelAcc = 0;
addEventListener('wheel', (e) => {
  if (performance.now() < locked) return;
  wheelAcc += e.deltaY;
  if (Math.abs(wheelAcc) > 55) {
    go(Math.sign(wheelAcc));
    wheelAcc = 0;
    locked = performance.now() + 420;
  }
}, { passive: true });

let touchY = null;
addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
addEventListener('touchmove', (e) => {
  if (touchY === null || performance.now() < locked) return;
  const dy = touchY - e.touches[0].clientY;
  if (Math.abs(dy) > 46) {
    go(Math.sign(dy));
    touchY = e.touches[0].clientY;
    locked = performance.now() + 420;
  }
}, { passive: true });
addEventListener('touchend', () => { touchY = null; }, { passive: true });

addEventListener('keydown', (e) => {
  const k = e.key;
  if (k === 'ArrowDown' || k === 'PageDown' || k === ' ') { go(1); e.preventDefault(); }
  else if (k === 'ArrowUp' || k === 'PageUp') { go(-1); e.preventDefault(); }
  else if (k === 'Home') { jump(0); e.preventDefault(); }
  else if (k === 'End') { jump(N - 1); e.preventDefault(); }
});

// ── UI ──────────────────────────────────────────────────────────────────────
const el = {
  hero: document.getElementById('hero'),
  start: document.getElementById('start'),
  info: document.getElementById('info'),
  kicker: document.getElementById('kicker'),
  title: document.getElementById('title'),
  lead: document.getElementById('lead'),
  body: document.getElementById('body'),
  facts: document.getElementById('facts'),
  more: document.getElementById('more'),
  rail: document.getElementById('rail'),
  langs: document.getElementById('langs'),
  scale: document.getElementById('scale'),
  bar: document.getElementById('progress-bar'),
  hint: document.getElementById('nav-hint')
};

let heroGone = false;
function hideHero() {
  if (heroGone) return;
  heroGone = true;
  el.hero.classList.add('hidden');
}
el.start.addEventListener('click', () => { hideHero(); jump(1); });
el.hero.addEventListener('click', (e) => { if (!e.target.closest('#hero-langs')) hideHero(); });

// Til tanlagich (yuqorida va kirish ekranida)
function buildLangPickers() {
  [el.langs, document.getElementById('hero-langs')].forEach((host) => {
    if (!host) return;
    host.innerHTML = '';
    LANGUAGES.forEach((lang) => {
      const b = document.createElement('button');
      b.className = 'lang-btn';
      b.textContent = lang.name;
      b.dataset.lang = lang.id;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        selectLanguage(lang.id);
        if (host.id === 'hero-langs') { hideHero(); jump(1); }
      });
      host.appendChild(b);
    });
  });
}

function markLangButtons() {
  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.classList.toggle('on', b.dataset.lang === current.id);
  });
}

function selectLanguage(id) {
  const lang = byId(id);
  if (current && lang.id === current.id) return;
  applyLanguage(lang);
  markLangButtons();
  history.replaceState(null, '', '#' + lang.id);
}

let railItems = [];
function buildRail() {
  el.rail.innerHTML = '';
  railItems = LEVELS.map((level, i) => {
    const b = document.createElement('button');
    b.className = 'rail-item';
    b.innerHTML = `<span class="rl">${level.title}</span><span class="rd"></span>`;
    b.title = `${level.number} — ${level.title}`;
    b.addEventListener('click', () => jump(i));
    el.rail.appendChild(b);
    return b;
  });
}

el.more.addEventListener('click', () => {
  const open = el.info.classList.toggle('open');
  el.more.setAttribute('aria-expanded', String(open));
  el.more.textContent = open ? 'Yig\'ish ⌃' : 'Batafsil ⌄';
});

let swapTimer = null;
let flashTimer = null;
function setUi(i) {
  const level = LEVELS[i];
  el.info.classList.add('swap');
  clearTimeout(swapTimer);
  swapTimer = setTimeout(() => {
    el.kicker.textContent = `${level.number} — ${level.kicker}`;
    el.title.textContent = level.title;
    el.lead.textContent = level.lead;
    el.body.innerHTML = level.body.map((p) => `<p>${p}</p>`).join('');
    el.facts.innerHTML = level.facts
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join('');
    el.scale.textContent = level.scale;
    el.info.classList.remove('swap');
  }, 220);

  railItems.forEach((b, k) => b.classList.toggle('on', k === i));
  el.rail.classList.add('flash');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => el.rail.classList.remove('flash'), 2200);
  el.bar.style.width = `${(i / (N - 1)) * 100}%`;
  el.hint.style.opacity = i === N - 1 ? 0 : '';
}

// ── Sichqoncha parallaksi ───────────────────────────────────────────────────
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', (e) => {
  if (calm.matches) return;
  mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
  mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
});

// ── O'lcham: kontent panel va navigatsiya orasidagi joyga joylashadi ────────
let portrait = false;
const fitScale = [];
const xShiftOf = [];

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  portrait = w <= 820;
  camera.fov = clamp(46 + (1.5 - camera.aspect) * 15, 46, 66);
  camera.updateProjectionMatrix();

  const panelPx = portrait ? 0 : Math.min(440, w * 0.42);
  const usablePx = portrait ? w : Math.max(240, w - panelPx - RAIL_PX);
  const tanHalf = Math.tan((camera.fov / 2) * Math.PI / 180);

  for (let i = 0; i < N; i++) {
    const view = LEVELS[i].view;
    const worldPerPx = (2 * tanHalf * view.z * camera.aspect) / w;
    xShiftOf[i] = portrait ? 0 : (panelPx / 2 - RAIL_PX / 2) * worldPerPx;
    fitScale[i] = clamp((usablePx / 2) * worldPerPx / view.w, 0.38, 1);
    built[i].group.scale.setScalar(fitScale[i]);
  }
}
addEventListener('resize', resize);

// ── Animatsiya sikli ────────────────────────────────────────────────────────
const bg = new THREE.Color();
const cA = new THREE.Color(), cB = new THREE.Color();
const INK = new THREE.Color(0x05070f);
const clock = new THREE.Clock();
const lookAt = new THREE.Vector3();

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsedTime();

  pos = damp(pos, target, calm.matches ? 12 : 3.0, dt);
  if (Math.abs(pos - target) < 0.0005) pos = target;

  const i0 = Math.floor(clamp(pos, 0, N - 1.0001));
  const i1 = Math.min(i0 + 1, N - 1);
  const f = smooth(clamp(pos - i0, 0, 1));

  const camZ = lerp(LEVELS[i0].view.z, LEVELS[i1].view.z, f)
    + (calm.matches ? 0 : Math.sin(f * Math.PI) * 15);
  const camY = -pos * GAP + lerp(LEVELS[i0].view.y * fitScale[i0], LEVELS[i1].view.y * fitScale[i1], f);
  const yBias = portrait ? -Math.tan((camera.fov / 2) * Math.PI / 180) * camZ * 0.34 : 0;
  const shift = lerp(xShiftOf[i0], xShiftOf[i1], f);

  mouse.x = damp(mouse.x, mouse.tx, 4, dt);
  mouse.y = damp(mouse.y, mouse.ty, 4, dt);

  camera.position.set(-shift + mouse.x * 2.6, camY + yBias - mouse.y * 1.6, camZ);
  lookAt.set(-shift + mouse.x * 0.9, camY + yBias + mouse.y * 0.5, 0);
  camera.lookAt(lookAt);

  cA.setHex(LEVELS[i0].color);
  cB.setHex(LEVELS[i1].color);
  bg.copy(cA).lerp(cB, f).multiplyScalar(0.14).lerp(INK, 0.82);
  renderer.setClearColor(bg, 1);
  scene.fog.color.copy(bg);

  for (let i = 0; i < N; i++) {
    const near = Math.abs(i - pos) < 1.35;
    built[i].group.visible = near;
    if (near) built[i].update(t, dt);
  }

  const idx = Math.round(pos);
  if (idx !== uiIndex) { uiIndex = idx; setUi(idx); }

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

// ── Ishga tushirish ─────────────────────────────────────────────────────────
buildLangPickers();
applyLanguage(byId(location.hash.slice(1)));
markLangButtons();
setUi(0);
uiIndex = 0;
frame();

console.log('%chow-it-works',
  'color:#6ee7ff;font:600 14px monospace',
  `— ${LANGUAGES.map((l) => l.name).join(' · ')}, koddan kvant fizikasigacha.`);

// Sozlash uchun: joriy kamera holati va qatlam masshtabi
globalThis.__debug = (probe = []) => ({
  lang: current.id, pos, target, fov: camera.fov, levels: N,
  cam: camera.position.toArray().map((v) => +v.toFixed(2)),
  fit: fitScale.map((s) => +s.toFixed(3)),
  screen: probe.map(([x, y, i]) => {
    const v = new THREE.Vector3(x, y, 0);
    built[i].group.localToWorld(v);
    v.project(camera);
    return [Math.round((v.x * 0.5 + 0.5) * innerWidth), Math.round((-v.y * 0.5 + 0.5) * innerHeight)];
  })
});
