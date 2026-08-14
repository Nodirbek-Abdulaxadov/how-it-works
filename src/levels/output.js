// 16-qatlam: natija yuqoriga qaytadi — baytdan fotongacha.
import * as THREE from 'three';
import {
  textPlane, label, segments, wireBox, panel,
  orb, glowSprite, lineMat, pulse, clamp, lerp
} from '../lib/gfx.js';

// "S" harfining 7×8 piksel to'ri — rasterizator natijasini ko'rsatish uchun
const GLYPH = [
  '0111110',
  '1100011',
  '1100000',
  '0111100',
  '0000110',
  '0000011',
  '1100011',
  '0111110'
];

export function buildScreen(meta) {
  const g = new THREE.Group();

  const caption = (txt, x, y, col = '#64748b', size = 21) => {
    const l = label(txt, { size, color: col });
    l.position.set(x, y, 0.3);
    g.add(l);
    return l;
  };
  const arrow = (x, y) => {
    const l = label('→', { size: 30, color: '#475569' });
    l.position.set(x, y, 0);
    g.add(l);
    return l;
  };

  // ── 1. tty buferi: hali ham baytlar ────────────────────────────────────────
  const bytes = textPlane(
    [[{ text: '53 61 6C 6F 6D', color: '#7dd3fc' }]],
    { size: 28, height: 0.85, bg: 'rgba(9,14,28,0.9)', border: 'rgba(125,211,252,0.3)', padX: 20, padY: 12 }
  );
  bytes.position.set(-11.4, 6.4, 0);
  g.add(bytes);
  const word = textPlane([[{ text: 'Salom', color: '#e2e8f0', weight: '600' }]], { size: 40, height: 1.3 });
  word.position.set(-11.4, 4.6, 0);
  g.add(word);
  caption('tty buferi — hali ham baytlar', -11.4, 3.2);

  arrow(-6.8, 5.2);

  // ── 2. Rasterizator: kontur → piksellar ───────────────────────────────────
  const CELL = 0.46;
  const gx = -2.6, gy = 5.4;
  const lit = (r, c) => GLYPH[r] && GLYPH[r][c] === '1';
  const cells = [];
  for (let r = 0; r < GLYPH.length; r++) {
    for (let c = 0; c < GLYPH[0].length; c++) {
      const on = lit(r, c);
      // Chetlarni silliqlash: yoqilgan yacheyka yonidagilar yarim yonadi
      const near = !on && (lit(r - 1, c) || lit(r + 1, c) || lit(r, c - 1) || lit(r, c + 1));
      if (!on && !near) continue;
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(CELL * 0.88, CELL * 0.88),
        new THREE.MeshBasicMaterial({
          color: 0xe2e8f0, transparent: true,
          opacity: on ? 0.9 : 0.22, depthWrite: false
        })
      );
      m.position.set(
        gx + (c - (GLYPH[0].length - 1) / 2) * CELL,
        gy - r * CELL,
        0
      );
      g.add(m);
      cells.push({ m, base: on ? 0.9 : 0.22, r, c });
    }
  }
  // To'r chiziqlari
  const grid = [];
  for (let c = 0; c <= GLYPH[0].length; c++) {
    const x = gx + (c - GLYPH[0].length / 2) * CELL;
    grid.push(new THREE.Vector3(x, gy + CELL / 2, -0.1), new THREE.Vector3(x, gy - (GLYPH.length - 0.5) * CELL, -0.1));
  }
  for (let r = 0; r <= GLYPH.length; r++) {
    const y = gy + CELL / 2 - r * CELL;
    grid.push(new THREE.Vector3(gx - GLYPH[0].length / 2 * CELL, y, -0.1), new THREE.Vector3(gx + GLYPH[0].length / 2 * CELL, y, -0.1));
  }
  g.add(segments(grid, '#334155', 0.4));
  caption('rasterizator — shrift konturi piksellarga bo\'yaladi', -2.6, 1.6);

  arrow(2.2, 5.2);

  // ── 3. Framebuffer ────────────────────────────────────────────────────────
  const FB_C = 9, FB_R = 6, FC = 0.62;
  const fx = 8.6, fy = 6.4;
  const fbCells = [];
  for (let r = 0; r < FB_R; r++) {
    for (let c = 0; c < FB_C; c++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(FC * 0.86, FC * 0.86),
        new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.12, depthWrite: false })
      );
      m.position.set(fx + (c - (FB_C - 1) / 2) * FC, fy - r * FC, 0);
      g.add(m);
      fbCells.push(m);
    }
  }
  g.add(wireBox(FB_C * FC, FB_R * FC, 0.001, '#475569', 0.45));
  const fbFrame = g.children[g.children.length - 1];
  fbFrame.position.set(fx, fy - (FB_R - 1) * FC / 2, -0.1);
  caption('framebuffer — har piksel uchun R G B', 8.6, 1.6);
  const rgbTag = textPlane(
    [[{ text: 'R', color: '#f87171' }, { text: ' 255   ', color: '#64748b' },
      { text: 'G', color: '#4ade80' }, { text: ' 255   ', color: '#64748b' },
      { text: 'B', color: '#60a5fa' }, { text: ' 255', color: '#64748b' }]],
    { size: 24, height: 0.7 }
  );
  rgbTag.position.set(8.6, 2.5, 0);
  g.add(rgbTag);

  // ── 4. Bitta piksel = 3 subpiksel ─────────────────────────────────────────
  caption('bitta piksel ichida', -11.4, -1.2, '#cbd5e1', 24);
  const subCols = [0xf87171, 0x4ade80, 0x60a5fa];
  const subs = subCols.map((col, i) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 3),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.75, depthWrite: false })
    );
    m.position.set(-12.5 + i * 1.1, -3.2, 0);
    g.add(m);
    const e = wireBox(0.8, 3, 0.001, col, 0.6);
    e.position.copy(m.position);
    g.add(e);
    return m;
  });
  caption('R    G    B', -11.4, -5.1);
  caption('subpiksellar', -11.4, -5.9);

  arrow(-7.4, -3.2);

  // ── 5. OLED: rekombinatsiya → foton ───────────────────────────────────────
  caption('OLED subpikseli', -1.6, -1.2, '#cbd5e1', 24);
  const bandTop = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 1),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.2, depthWrite: false })
  );
  bandTop.position.set(-1.6, -2.2, 0);
  const bandBot = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 1),
    new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.2, depthWrite: false })
  );
  bandBot.position.set(-1.6, -5.4, 0);
  g.add(bandTop, bandBot);
  [[bandTop, '#7dd3fc'], [bandBot, '#6ee7b7']].forEach(([m, col]) => {
    const e = wireBox(6.4, 1, 0.001, col, 0.5);
    e.position.copy(m.position);
    g.add(e);
  });
  caption('elektron (yuqori sath)', -1.6, -1.9, '#7dd3fc', 18);
  caption('kovak (past sath)', -1.6, -5.1, '#6ee7b7', 18);

  const electron = orb(0.24, '#e0f2fe', 1);
  g.add(electron);
  const eGlow = glowSprite('#7dd3fc', 1.6);
  g.add(eGlow);
  caption('rekombinatsiya', -1.6, -6.5, '#c084fc', 21);

  // ── 6. Foton → ko'z ───────────────────────────────────────────────────────
  const WN = 160;
  const wpos = new Float32Array(WN * 3);
  const wgeo = new THREE.BufferGeometry();
  wgeo.setAttribute('position', new THREE.BufferAttribute(wpos, 3));
  const wave = new THREE.Line(wgeo, lineMat('#fde68a', 0.9));
  g.add(wave);
  caption('foton', 5.4, -2.2, '#fde68a', 22);

  // Ko'z
  const eye = new THREE.Group();
  eye.position.set(12.4, -3.4, 0);
  g.add(eye);
  const lens = new THREE.EllipseCurve(0, 0, 1.9, 1.05, 0, Math.PI * 2).getPoints(48)
    .map((p) => new THREE.Vector3(p.x, p.y, 0));
  eye.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(lens), lineMat('#cbd5e1', 0.7)));
  const iris = orb(0.62, '#93c5fd', 0.5);
  eye.add(iris);
  const pupil = orb(0.28, '#0f172a', 1);
  pupil.position.z = 0.1;
  eye.add(pupil);
  caption('ko\'z', 12.4, -5.1, '#cbd5e1', 22);

  const finale = textPlane(
    [[{ text: 'Console.WriteLine("Salom")', color: '#fde68a', weight: '600' },
      { text: '  dan boshlangan yo\'l elektronning energiya sathidan sakrashi bilan tugadi.', color: '#cbd5e1' }]],
    { size: 25, height: 0.85, align: 'center' }
  );
  finale.position.set(0, -8.8, 0);
  g.add(finale);

  return {
    group: g,
    update(t) {
      // Rasterizatsiya to'lqini harflar bo'ylab yuguradi
      cells.forEach(({ m, base, r }) => {
        const k = (t * 0.55 - r * 0.06) % 1;
        m.material.opacity = base * (0.55 + 0.45 * Math.sin(k * Math.PI * 2) * 0.5 + 0.225);
      });

      // Framebuffer yangilanadi
      fbCells.forEach((m, i) => {
        m.material.opacity = 0.08 + 0.18 * pulse(t, 2.2, i * 0.35);
      });

      subs.forEach((m, i) => {
        m.material.opacity = 0.5 + 0.4 * pulse(t, 2.4, i * 0.8);
      });

      // Elektron yuqori sathdan pastga tushadi va foton chiqaradi
      const cyc = (t * 0.4) % 1;
      const drop = clamp((cyc - 0.15) / 0.35, 0, 1);
      const ey = lerp(-2.2, -5.4, drop);
      electron.position.set(-1.6 + Math.sin(t * 2) * 1.6 * (1 - drop), ey, 0.4);
      eGlow.position.copy(electron.position);
      eGlow.material.opacity = 0.4 + 0.3 * pulse(t, 5);
      bandTop.material.opacity = 0.12 + 0.14 * (1 - drop);
      bandBot.material.opacity = 0.12 + 0.14 * drop;

      // Foton to'lqini elektron tushgandan keyin ko'zga yo'l oladi
      const emitted = cyc > 0.5;
      const travel = clamp((cyc - 0.5) / 0.4, 0, 1);
      const arr = wave.geometry.attributes.position.array;
      const x0 = 1.9, x1 = 10.3;
      for (let i = 0; i < WN; i++) {
        const u = i / (WN - 1);
        const x = lerp(x0, x1, u);
        // to'lqin paketi oldinga siljiydi
        const env = Math.exp(-Math.pow((u - travel) * 4.5, 2));
        arr[i * 3] = x;
        arr[i * 3 + 1] = -3.4 + Math.sin(u * 34 - t * 9) * 0.5 * env;
        arr[i * 3 + 2] = 0.2;
      }
      wave.geometry.attributes.position.needsUpdate = true;
      wave.material.opacity = emitted ? 0.9 : 0.12;

      // Ko'zga yetganda qorachiq yorishadi
      const hit = travel > 0.85;
      iris.material.opacity = hit ? 0.75 : 0.35;
      iris.scale.setScalar(hit ? 1.12 : 1);

      finale.material.opacity = 0.65 + 0.35 * pulse(t, 0.8);
    }
  };
}
