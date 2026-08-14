// Sahna, kamera sayohati va UI boshqaruvi.
import * as THREE from 'three';
import { LEVELS } from './content.js';
import { buildSource, buildAst, buildIl, buildJit, buildMachine } from './levels/software.js';
import { buildOs, buildCpu, buildLogic } from './levels/system.js';
import { buildTransistor, buildSilicon, buildQuantum } from './levels/hardware.js';
import { points, segments, clamp, lerp, damp, smooth } from './lib/gfx.js';

const BUILDERS = [
  buildSource, buildAst, buildIl, buildJit, buildMachine,
  buildOs, buildCpu, buildLogic,
  buildTransistor, buildSilicon, buildQuantum
];

// Har bir qatlam uchun: kamera masofasi (z), vertikal markaz (y), kontent yarim kengligi (w).
// w tor ekranlarda qatlamni kadrga sig'dirish uchun ishlatiladi.
const VIEW = [
  { z: 27, y: 0.5, w: 11.5 }, { z: 31, y: 2.4, w: 10 }, { z: 32, y: 0.6, w: 13.5 },
  { z: 33, y: -1.4, w: 15 }, { z: 31, y: 0.4, w: 14.5 },
  { z: 37, y: -1.6, w: 15 }, { z: 35, y: -1.8, w: 16.5 }, { z: 33, y: -1.4, w: 14.5 },
  { z: 35, y: -1.8, w: 15.5 }, { z: 35, y: -3.2, w: 14.5 }, { z: 35, y: -5, w: 16 }
];

const GAP = 72;
const N = LEVELS.length;

// ── Sahna ───────────────────────────────────────────────────────────────────
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x05070f, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x05070f, 44, 96);

const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 600);
scene.add(camera);

// ── Fon: yulduzlar va vertikal "shaxta" chiziqlari ──────────────────────────
{
  const SN = 1600;
  const pos = new Float32Array(SN * 3);
  const bottom = -(N - 1) * GAP - 60;
  for (let i = 0; i < SN; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 260;
    pos[i * 3 + 1] = lerp(60, bottom, Math.random());
    pos[i * 3 + 2] = -30 - Math.random() * 150;
  }
  const stars = points(pos, 0x8fb4ff, 0.55, 0.55);
  stars.material.fog = false;
  scene.add(stars);

  const spine = [];
  for (let i = 0; i < N; i++) {
    const y = -i * GAP;
    [-26, 26].forEach((x) => {
      spine.push(new THREE.Vector3(x, y + 22, -14), new THREE.Vector3(x, y - 22, -14));
    });
    // qatlamlar orasidagi belgi
    spine.push(new THREE.Vector3(-3, y - 34, -14), new THREE.Vector3(3, y - 34, -14));
  }
  scene.add(segments(spine, 0x1e2b45, 0.55));
}

// ── Qatlamlarni qurish ──────────────────────────────────────────────────────
const levels = LEVELS.map((meta, i) => {
  const built = BUILDERS[i]({ ...meta, color: new THREE.Color(meta.color), color2: new THREE.Color(meta.color2) });
  built.group.position.y = -i * GAP;
  built.group.visible = false;
  scene.add(built.group);
  return built;
});

// ── Aylanish (scroll) boshqaruvi ────────────────────────────────────────────
let target = 0;   // qaysi qatlamga ketyapmiz
let pos = 0;      // hozirgi uzluksiz holat
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
el.hero.addEventListener('click', hideHero);

const railItems = LEVELS.map((meta, i) => {
  const b = document.createElement('button');
  b.className = 'rail-item';
  b.innerHTML = `<span class="rl">${meta.title}</span><span class="rd"></span>`;
  b.title = meta.title;
  b.addEventListener('click', () => jump(i));
  el.rail.appendChild(b);
  return b;
});

el.more.addEventListener('click', () => {
  const open = el.info.classList.toggle('open');
  el.more.setAttribute('aria-expanded', String(open));
  el.more.textContent = open ? 'Yig\'ish ⌃' : 'Batafsil ⌄';
});

let swapTimer = null;
function setUi(i) {
  const meta = LEVELS[i];
  el.info.classList.add('swap');
  clearTimeout(swapTimer);
  swapTimer = setTimeout(() => {
    el.kicker.textContent = meta.kicker;
    el.title.textContent = meta.title;
    el.lead.textContent = meta.lead;
    el.body.innerHTML = meta.body.map((p) => `<p>${p}</p>`).join('');
    el.facts.innerHTML = meta.facts
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join('');
    el.scale.textContent = meta.scale;
    el.info.classList.remove('swap');
  }, 220);

  railItems.forEach((b, k) => b.classList.toggle('on', k === i));
  el.bar.style.width = `${(i / (N - 1)) * 100}%`;
  el.hint.style.opacity = i === N - 1 ? 0 : '';
}

// ── Sichqoncha parallaksi ───────────────────────────────────────────────────
// Harakatni kamaytirish so'ralgan bo'lsa, parallaks o'chadi va qatlamlar orasida
// sho'ng'ish o'rniga tez o'tiladi. Qatlamlarning o'z animatsiyasi qoladi —
// aynan u tushuntirmoqchi bo'lgan narsani ko'rsatadi.
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', (e) => {
  if (calm.matches) return;
  mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
  mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
});

// ── O'lcham ─────────────────────────────────────────────────────────────────
// Kontent chapdagi matn paneli va o'ngdagi navigatsiya orasidagi bo'sh joyga joylashadi.
// Har bir qatlam uchun surilish (world birligida) va masshtab alohida hisoblanadi.
const RAIL_PX = 56;
let portrait = false;
const fitScale = new Array(N).fill(1);
const xShiftOf = new Array(N).fill(0);

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  portrait = w <= 820;
  // Tor ekranlarda kameraning ko'rish burchagi kengayadi
  camera.fov = clamp(46 + (1.5 - camera.aspect) * 15, 46, 66);
  camera.updateProjectionMatrix();

  const panelPx = portrait ? 0 : Math.min(440, w * 0.42);
  const usablePx = portrait ? w : Math.max(240, w - panelPx - RAIL_PX);
  const tanHalf = Math.tan((camera.fov / 2) * Math.PI / 180);

  for (let i = 0; i < N; i++) {
    // Kameradan VIEW[i].z masofada bitta piksel necha world birligini qoplaydi
    const worldPerPx = (2 * tanHalf * VIEW[i].z * camera.aspect) / w;
    xShiftOf[i] = portrait ? 0 : (panelPx / 2 - RAIL_PX / 2) * worldPerPx;
    fitScale[i] = clamp((usablePx / 2) * worldPerPx / VIEW[i].w, 0.38, 1);
    levels[i].group.scale.setScalar(fitScale[i]);
  }
}
addEventListener('resize', resize);
resize();

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

  // Kamera: qatlamlar orasida "orqaga tortilib, keyin sho'ng'iydi"
  const camZ = lerp(VIEW[i0].z, VIEW[i1].z, f) + (calm.matches ? 0 : Math.sin(f * Math.PI) * 15);
  const camY = -pos * GAP + lerp(VIEW[i0].y * fitScale[i0], VIEW[i1].y * fitScale[i1], f);

  // Portret rejimda pastdagi matn paneli kontentni yopmasligi uchun kadrni yuqoriga suramiz
  const yBias = portrait ? -Math.tan((camera.fov / 2) * Math.PI / 180) * camZ * 0.19 : 0;
  const shift = lerp(xShiftOf[i0], xShiftOf[i1], f);

  mouse.x = damp(mouse.x, mouse.tx, 4, dt);
  mouse.y = damp(mouse.y, mouse.ty, 4, dt);

  camera.position.set(-shift + mouse.x * 2.6, camY + yBias - mouse.y * 1.6, camZ);
  lookAt.set(-shift + mouse.x * 0.9, camY + yBias + mouse.y * 0.5, 0);
  camera.lookAt(lookAt);

  // Fon rangi qatlamdan qatlamga o'zgaradi
  cA.setHex(LEVELS[i0].color);
  cB.setHex(LEVELS[i1].color);
  bg.copy(cA).lerp(cB, f).multiplyScalar(0.14).lerp(INK, 0.82);
  renderer.setClearColor(bg, 1);
  scene.fog.color.copy(bg);

  // Faqat yaqin qatlamlarni yangilaymiz
  for (let i = 0; i < N; i++) {
    const near = Math.abs(i - pos) < 1.35;
    levels[i].group.visible = near;
    if (near) levels[i].update(t, dt);
  }

  const idx = Math.round(pos);
  if (idx !== uiIndex) { uiIndex = idx; setUi(idx); }

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

setUi(0);
uiIndex = 0;
frame();

// Salomlashuv: konsolda ham bir og'iz
console.log('%chow-it-works', 'color:#6ee7ff;font:600 14px monospace', '— C# dan kvant fizikasigacha, 11 qatlam.');

// Sozlash/tekshirish uchun: joriy kamera holati va qatlam masshtabi
globalThis.__debug = (probe = []) => ({
  pos, target, fov: camera.fov,
  cam: camera.position.toArray().map((v) => +v.toFixed(2)),
  fit: fitScale.map((s) => +s.toFixed(3)),
  shift: xShiftOf.map((s) => +s.toFixed(2)),
  // [x, yLocal, levelIndex] nuqtalarini ekran pikseliga o'giradi
  screen: probe.map(([x, y, i]) => {
    const v = new THREE.Vector3(x, y, 0);
    levels[i].group.localToWorld(v);
    v.project(camera);
    return [Math.round((v.x * 0.5 + 0.5) * innerWidth), Math.round((-v.y * 0.5 + 0.5) * innerHeight)];
  })
});
