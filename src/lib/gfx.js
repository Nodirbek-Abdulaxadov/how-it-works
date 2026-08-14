// Umumiy 3D yordamchilari: matn teksturalari, simlar, zarrachalar, materiallar.
import * as THREE from 'three';

const MONO = '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';
const SANS = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';

const textureCache = new Map();

/**
 * Matn qatorlarini canvas teksturaga chizadi.
 * Bir xil kalitli chaqiruvlar keshdan qaytadi (bir sahnada yuzlab yorliq bo'ladi).
 */
export function textTexture(lines, opts = {}) {
  const {
    font = MONO,
    size = 34,
    color = '#dbeafe',
    bg = null,
    padX = 22,
    padY = 16,
    lineHeight = 1.45,
    align = 'left',
    weight = '400',
    border = null,
    radius = 12,
    glow = null
  } = opts;

  const rows = Array.isArray(lines) ? lines : [lines];
  const key = JSON.stringify([rows, font, size, color, bg, padX, padY, lineHeight, align, weight, border, radius, glow]);
  if (textureCache.has(key)) return textureCache.get(key);

  // Qator uch xil bo'lishi mumkin: 'matn' | {text,color} | [{text,color}, ...] (spanlar)
  const spansOf = (row) =>
    Array.isArray(row) ? row : [typeof row === 'string' ? { text: row } : row];

  const measure = document.createElement('canvas').getContext('2d');
  let maxW = 0;
  for (const r of rows) {
    let w = 0;
    for (const s of spansOf(r)) {
      measure.font = `${s.weight || weight} ${size}px ${font}`;
      w += measure.measureText(s.text).width;
    }
    maxW = Math.max(maxW, w);
  }

  const w = Math.ceil(maxW + padX * 2);
  const h = Math.ceil(rows.length * size * lineHeight + padY * 2);
  const dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  if (bg) {
    ctx.fillStyle = bg;
    roundRect(ctx, 0.5, 0.5, w - 1, h - 1, radius);
    ctx.fill();
  }
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    roundRect(ctx, 1, 1, w - 2, h - 2, radius);
    ctx.stroke();
  }

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  rows.forEach((row, i) => {
    const spans = spansOf(row);
    let rowW = 0;
    for (const s of spans) {
      ctx.font = `${s.weight || weight} ${size}px ${font}`;
      rowW += ctx.measureText(s.text).width;
    }
    let x = align === 'center' ? (w - rowW) / 2 : align === 'right' ? w - padX - rowW : padX;
    const y = padY + size * lineHeight * (i + 0.5);

    for (const s of spans) {
      ctx.font = `${s.weight || weight} ${size}px ${font}`;
      if (glow) {
        ctx.shadowColor = s.color || glow;
        ctx.shadowBlur = 16;
      }
      ctx.fillStyle = s.color || color;
      ctx.fillText(s.text, x, y);
      ctx.shadowBlur = 0;
      x += ctx.measureText(s.text).width;
    }
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.userData.aspect = w / h;
  tex.userData.pxWidth = w;
  tex.userData.pxHeight = h;
  textureCache.set(key, tex);
  return tex;
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Matn tekisligi (billboard emas — sahnaga mahkam turadi). */
export function textPlane(lines, opts = {}) {
  const tex = textTexture(lines, opts);
  const height = opts.height ?? 3;
  const width = height * tex.userData.aspect;
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    opacity: opts.opacity ?? 1,
    side: THREE.DoubleSide,
    toneMapped: false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  mesh.userData.size = [width, height];
  return mesh;
}

/**
 * Mavjud matn tekisligining matnini almashtiradi (til o'zgarganda kerak).
 * Matn uzunligi bilan birga kenglik ham qayta hisoblanadi.
 */
export function retext(mesh, lines, opts = {}) {
  const tex = textTexture(lines, opts);
  const height = opts.height ?? mesh.userData.size[1];
  const width = height * tex.userData.aspect;
  mesh.material.map = tex;
  mesh.material.needsUpdate = true;
  mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(width, height);
  mesh.userData.size = [width, height];
  return mesh;
}

/** Kameraga qaragan yorliq. */
export function label(text, opts = {}) {
  const tex = textTexture(text, { font: SANS, size: 30, ...opts });
  const height = opts.height ?? 1.1;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(height * tex.userData.aspect, height, 1);
  return sprite;
}

/** Yorqin, "neon" chiziqli material. */
export function lineMat(color, opacity = 0.6) {
  return new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
}

/** Nuqtalar ro'yxatidan LineSegments yasaydi (juftlab: a,b, a,b ...). */
export function segments(pairs, color, opacity = 0.5) {
  const pos = new Float32Array(pairs.length * 3);
  pairs.forEach((p, i) => {
    pos[i * 3] = p.x;
    pos[i * 3 + 1] = p.y;
    pos[i * 3 + 2] = p.z;
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.LineSegments(geo, lineMat(color, opacity));
}

/** Egri chiziq (Catmull-Rom orqali silliqlangan). */
export function curveLine(points, color, opacity = 0.6, divisions = 48) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(divisions));
  const line = new THREE.Line(geo, lineMat(color, opacity));
  line.userData.curve = curve;
  return line;
}

/** Sim ramka (qirralar bo'yicha). */
export function wireBox(w, h, d, color, opacity = 0.45) {
  const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
  return new THREE.LineSegments(geo, lineMat(color, opacity));
}

/** To'ldirilgan, yarim shaffof panel + qirralari. */
export function panel(w, h, d, color, opts = {}) {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: opts.fill ?? 0.08,
      depthWrite: false
    })
  );
  g.add(mesh, wireBox(w, h, d, opts.edge ?? color, opts.edgeOpacity ?? 0.5));
  g.userData.fillMesh = mesh;
  return g;
}

/** Yorug'lik nuqtalari (glow sprite teksturasi bilan). */
let dotTex = null;
export function dotTexture() {
  if (dotTex) return dotTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c);
  return dotTex;
}

export function points(positions, color, size = 0.35, opacity = 0.9) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size,
    map: dotTexture(),
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  return new THREE.Points(geo, mat);
}

/** Yorqin sfera (signal / elektron uchun). */
export function glowSprite(color, size = 1) {
  const mat = new THREE.SpriteMaterial({
    map: dotTexture(),
    color,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const s = new THREE.Sprite(mat);
  s.scale.set(size, size, 1);
  return s;
}

/** Kichik yorqin sfera (mesh — chuqurlik bilan). */
export function orb(radius, color, opacity = 1) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 20, 14),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, toneMapped: false })
  );
}

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
/** Kadr tezligidan mustaqil silliq yaqinlashish. */
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
export const hex = (n) => '#' + n.toString(16).padStart(6, '0');

/** 0..1 oralig'ida davriy pulsatsiya. */
export function pulse(t, speed = 1, phase = 0) {
  return 0.5 + 0.5 * Math.sin(t * speed + phase);
}
