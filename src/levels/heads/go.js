// Go boshi: manba kod → SSA va statik binar → ish vaqti (scheduler + GC).
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  orb, glowSprite, lineMat, pulse, clamp, lerp
} from '../../lib/gfx.js';
import { PAL, codePanel, cardColumn, flowArrow, stageBox } from './common.js';

// ── Manba kod ───────────────────────────────────────────────────────────────
export function buildGoSource(meta) {
  const g = new THREE.Group();

  codePanel(g, [
    [{ text: 'func ', color: PAL.key }, { text: 'main', color: PAL.fn }, { text: '() {', color: PAL.dim }],
    [{ text: '    ch := ', color: PAL.id }, { text: 'make', color: PAL.fn }, { text: '(', color: PAL.dim },
     { text: 'chan string', color: PAL.type }, { text: ')', color: PAL.dim }],
    [{ text: '    go func', color: PAL.key }, { text: '() { ch <- ', color: PAL.dim },
     { text: '"Salom"', color: PAL.str }, { text: ' }()', color: PAL.dim }],
    [{ text: '    fmt', color: PAL.type }, { text: '.', color: PAL.dim }, { text: 'Println', color: PAL.fn },
     { text: '(<-ch)', color: PAL.dim }],
    [{ text: '}', color: PAL.dim }]
  ], { y: 4.6, height: 5.4, file: 'main.go', accent: '#22d3ee' });

  // 25 ta kalit so'z
  const kw = stageBox(g, { x: -8.2, y: -3, w: 11.6, h: 3.2, title: 'til ataylab kichik', color: '#7dd3fc', fill: 0.07 });
  const kwTxt = textPlane(
    [
      [{ text: '25', color: '#ffffff', weight: '700' }, { text: '  ta kalit so\'z', color: '#94a3b8' }],
      [{ text: 'makros yo\'q · operator qayta yuklash yo\'q', color: '#64748b' }]
    ],
    { size: 22, height: 1.6, align: 'center' }
  );
  kwTxt.position.set(-8.2, -3, 0.5);
  g.add(kwTxt);

  // goroutine — yengil oqim
  const grTag = label('goroutine — OS oqimi emas', { size: 23, color: '#a7f3d0' });
  grTag.position.set(7, -1.2, 0);
  g.add(grTag);

  const gr = [];
  for (let i = 0; i < 14; i++) {
    const o = orb(0.26, '#34d399', 0.9);
    o.position.set(2.6 + (i % 7) * 1.5, -2.8 - Math.floor(i / 7) * 1.4, 0);
    g.add(o);
    gr.push(o);
  }
  const grSize = label('bittasi ~2 KB dan boshlanadi — yuz minglab yaratsa bo\'ladi', { size: 20, color: '#64748b' });
  grSize.position.set(7, -5.6, 0);
  g.add(grSize);

  const note = textPlane(
    [[{ text: 'Goroutine\'lar xotira orqali emas, kanallar orqali gaplashadi.', color: '#94a3b8' }]],
    { size: 24, height: 0.8, align: 'center' }
  );
  note.position.set(0, -7.6, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      gr.forEach((o, i) => {
        const p = pulse(t, 2.2, i * 0.5);
        o.scale.setScalar(0.85 + p * 0.4);
        o.material.opacity = 0.5 + p * 0.45;
      });
      kw.userData.fillMesh.material.opacity = 0.05 + 0.08 * pulse(t, 1.1);
    }
  };
}

// ── SSA va statik binar ─────────────────────────────────────────────────────
export function buildGoCompile(meta) {
  const g = new THREE.Group();

  // Chapda: SSA bloklari
  const ssaTag = label('SSA — har o\'zgaruvchiga bir marta qiymat', { size: 23, color: '#cbd5e1' });
  ssaTag.position.set(-9.6, 7.4, 0);
  g.add(ssaTag);

  const ssa = [
    'v1 = ConstString "Salom"',
    'v2 = MakeChan',
    'v3 = ChanSend v2 v1',
    'v4 = ChanRecv v2',
    'v5 = Call fmt.Println v4'
  ];
  const ssaCards = cardColumn(g, ssa.map((s) => [s, '']), {
    x: -9.6, yTop: 5.6, gap: 1.2, width: 26, accent: '#60a5fa'
  });

  flowArrow(g, -3, -0.6, 3.4, 'escape analysis');

  // O'rtada: stek yoki uyum
  const escTag = label('qochadimi?', { size: 23, color: '#cbd5e1' });
  escTag.position.set(3.4, 7.4, 0);
  g.add(escTag);

  const stackBox = stageBox(g, { x: 3.4, y: 5, w: 7.6, h: 2.4, title: 'qochmasa → stek', color: '#34d399', fill: 0.1 });
  const heapBox = stageBox(g, { x: 3.4, y: 1.4, w: 7.6, h: 2.4, title: 'qochsa → uyum (GC)', color: '#fbbf24', fill: 0.1 });

  // O'ngda: statik binar
  const binTag = label('bitta statik binar', { size: 24, color: '#cbd5e1' });
  binTag.position.set(11.4, 7.4, 0);
  g.add(binTag);

  const layers = [
    ['sizning kodingiz', '#7dd3fc', 1.4],
    ['standart kutubxona', '#a78bfa', 1.4],
    ['ish vaqti: scheduler', '#34d399', 1.4],
    ['ish vaqti: GC va allocator', '#fbbf24', 1.4]
  ];
  let by = 5.4;
  const binLayers = layers.map(([name, col, h]) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(9, h * 0.86),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.14, depthWrite: false })
    );
    m.position.set(11.4, by, 0);
    g.add(m);
    const e = wireBox(9, h * 0.86, 0.001, col, 0.5);
    e.position.copy(m.position);
    g.add(e);
    const l = label(name, { size: 20, color: col });
    l.position.set(11.4, by, 0.4);
    g.add(l);
    by -= h;
    return m;
  });
  const binSize = label('"Salom" chiqaradigan dastur ham ~2 MB', { size: 19, color: '#64748b' });
  binSize.position.set(11.4, -0.6, 0);
  g.add(binSize);
  const binNote = label('bog\'liqliksiz ko\'chirsa bo\'ladi', { size: 19, color: '#64748b' });
  binNote.position.set(11.4, -1.5, 0);
  g.add(binNote);

  const note = textPlane(
    [[{ text: 'LLVM ishlatilmaydi — Go o\'z backend\'ini yozgan. Sifat biroz pastroq, kompilyatsiya esa ancha tez.', color: '#94a3b8' }]],
    { size: 23, height: 0.78, align: 'center' }
  );
  note.position.set(0, -4.4, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      const step = Math.floor(t * 1.1) % ssaCards.length;
      ssaCards.forEach((c, i) => {
        c.material.opacity = i === step ? 1 : 0.45;
      });
      const escapes = (t * 0.4) % 1 > 0.5;
      stackBox.userData.fillMesh.material.opacity = escapes ? 0.04 : 0.2;
      heapBox.userData.fillMesh.material.opacity = escapes ? 0.2 : 0.04;
      binLayers.forEach((m, i) => {
        m.material.opacity = 0.09 + 0.12 * pulse(t, 1.3, i * 0.8);
      });
    }
  };
}

// ── Ish vaqti: scheduler va GC ──────────────────────────────────────────────
export function buildGoRuntime(meta) {
  const g = new THREE.Group();

  const title = label('G · M · P  —  M:N rejalashtirish', { size: 25, color: '#cbd5e1' });
  title.position.set(0, 8, 0);
  g.add(title);

  // Chapda: goroutine navbati
  const qTag = label('navbatdagi goroutine\'lar (G)', { size: 21, color: '#6ee7b7' });
  qTag.position.set(-11, 6.2, 0);
  g.add(qTag);

  const queue = [];
  for (let i = 0; i < 18; i++) {
    const o = orb(0.28, '#34d399', 0.85);
    o.position.set(-14 + (i % 6) * 1.2, 4.8 - Math.floor(i / 6) * 1.2, 0);
    g.add(o);
    queue.push(o);
  }

  // O'rtada: P kontekstlari va M oqimlari
  const ps = [0, 1, 2, 3].map((i) => {
    const y = 5.2 - i * 2.6;
    const p = panel(6.4, 2, 0.7, '#38bdf8', { fill: 0.08, edgeOpacity: 0.5 });
    p.position.set(0, y, 0);
    g.add(p);
    const pl = label('P' + i, { size: 20, color: '#7dd3fc' });
    pl.position.set(-2.4, y, 0.5);
    g.add(pl);

    const m = panel(4.4, 1.5, 0.6, '#a78bfa', { fill: 0.08, edgeOpacity: 0.5 });
    m.position.set(7.2, y, 0);
    g.add(m);
    const ml = label('M' + i + ' — OS oqimi', { size: 18, color: '#c4b5fd' });
    ml.position.set(7.2, y, 0.5);
    g.add(ml);

    g.add(segments([new THREE.Vector3(3.2, y, 0), new THREE.Vector3(5, y, 0)], '#475569', 0.5));

    const running = orb(0.32, '#6ee7b7', 1);
    running.position.set(0.6, y, 0.5);
    g.add(running);
    return { p, m, running, y };
  });

  const cores = label('P soni = yadrolar soni', { size: 19, color: '#64748b' });
  cores.position.set(0, -5.4, 0);
  g.add(cores);

  // Kutib qolgan goroutine chetga suriladi
  const parkTag = textPlane(
    [[{ text: 'kanalda kutsa — chetga suriladi,', color: '#64748b' }],
     [{ text: 'OS oqimi hech qachon bo\'sh turmaydi', color: '#94a3b8' }]],
    { size: 20, height: 1.4, align: 'center' }
  );
  parkTag.position.set(11.8, -1.6, 0);
  g.add(parkTag);

  // Pastda: GC
  const gcTag = label('GC — dastur bilan bir vaqtda ishlaydi', { size: 23, color: '#fbbf24' });
  gcTag.position.set(-6, -7, 0);
  g.add(gcTag);

  const gcCells = [];
  for (let i = 0; i < 26; i++) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.72),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.2, depthWrite: false })
    );
    m.position.set(-14 + (i % 13) * 1.3, -8.6 - Math.floor(i / 13) * 1.3, 0);
    g.add(m);
    gcCells.push(m);
  }

  const pause = textPlane(
    [
      [{ text: 'stop-the-world pauzasi', color: '#94a3b8' }],
      [{ text: '< 1 ms', color: '#ffffff', weight: '700' }]
    ],
    { size: 24, height: 1.6, align: 'center' }
  );
  pause.position.set(9.6, -8.6, 0);
  g.add(pause);

  const note = textPlane(
    [[{ text: 'Bularning hammasi sizning binaringiz ichida. Pastdagi qatlamlar uchun bu shunchaki yana bir mashina kodi.', color: '#e9d5ff', weight: '600' }]],
    { size: 24, height: 0.82, align: 'center' }
  );
  note.position.set(0, -11.6, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      queue.forEach((o, i) => {
        const p = pulse(t, 1.6, i * 0.4);
        o.material.opacity = 0.35 + p * 0.5;
        o.position.x = -14 + (i % 6) * 1.2 + Math.sin(t * 0.8 + i) * 0.1;
      });
      ps.forEach(({ p, m, running, y }, i) => {
        // Goroutine vaqti-vaqti bilan almashadi
        const swap = (t * 0.7 + i * 0.37) % 1;
        const busy = swap < 0.75;
        running.visible = busy;
        running.position.x = 0.6 + Math.sin(swap * Math.PI * 2) * 0.3;
        running.material.opacity = busy ? 1 : 0;
        p.userData.fillMesh.material.opacity = busy ? 0.18 : 0.04;
        m.userData.fillMesh.material.opacity = 0.06 + 0.1 * pulse(t, 2, i);
      });
      // GC belgilash to'lqini
      const mark = (t * 0.3) % 1;
      gcCells.forEach((m, i) => {
        const k = i / gcCells.length;
        const on = k < mark;
        m.material.color.set(on ? 0x4ade80 : 0xfbbf24);
        m.material.opacity = on ? 0.45 : 0.14;
      });
      pause.material.opacity = 0.6 + 0.4 * pulse(t, 1.2);
    }
  };
}
