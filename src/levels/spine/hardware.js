// 11–15 qatlamlar: gate ichi → CMOS tranzistor → xotira yacheykasi →
// kremniy kristalli va PN o'tish → kvant fizikasi.
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  points, orb, glowSprite, lineMat, pulse, clamp, lerp
} from '../../lib/gfx.js';

// ── 11. Gate ichida: XOR → NAND → tranzistorlar ─────────────────────────────
export function buildGates(meta) {
  const g = new THREE.Group();

  // Uchburchak korpus; `bubble` bo'lsa chiqishga inkor doirachasi qo'shiladi (NAND)
  const gateShape = (name, x, y, col, bubble = false, s = 1) => {
    const grp = new THREE.Group();
    const pts = [
      new THREE.Vector3(-1.15 * s, 1.25 * s, 0),
      new THREE.Vector3(-1.15 * s, -1.25 * s, 0),
      new THREE.Vector3(1.15 * s, 0, 0)
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setIndex([0, 1, 2]);
    const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: col, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false
    }));
    grp.add(fill, new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), lineMat(col, 0.85)));

    if (bubble) {
      const r = 0.26 * s;
      const circle = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(1.15 * s + r, 0, r, r, 0, Math.PI * 2).getPoints(24)
            .map((p) => new THREE.Vector3(p.x, p.y, 0))
        ),
        lineMat(col, 0.85)
      );
      grp.add(circle);
    }

    const nm = label(name, { size: 20, color: '#f1f5f9', weight: '600', height: 0.44 * s });
    nm.position.set(-0.3 * s, 0, 0.2);
    grp.add(nm);

    grp.position.set(x, y, 0);
    g.add(grp);
    return { grp, fill };
  };

  const stageTag = (txt, x, y, col) => {
    const l = label(txt, { size: 23, color: col });
    l.position.set(x, y, 0);
    g.add(l);
    return l;
  };

  // ---- 1-bosqich: belgi ----
  stageTag('belgi', -11.6, 7.4, '#cbd5e1');
  const xor = gateShape('XOR', -11.6, 4, '#a78bfa');
  g.add(segments([
    new THREE.Vector3(-14.2, 4.6, 0), new THREE.Vector3(-12.75, 4.6, 0),
    new THREE.Vector3(-14.2, 3.4, 0), new THREE.Vector3(-12.75, 3.4, 0),
    new THREE.Vector3(-10.45, 4, 0), new THREE.Vector3(-9.2, 4, 0)
  ], '#64748b', 0.55));
  stageTag('A', -14.7, 4.6, '#94a3b8');
  stageTag('B', -14.7, 3.4, '#94a3b8');
  stageTag('S', -8.7, 4, '#94a3b8');

  // ---- 2-bosqich: 4 ta NAND ----
  stageTag('4 ta NAND', -1.4, 7.4, '#cbd5e1');
  const n1 = gateShape('NAND', -4.6, 4, '#f0abfc', true, 0.82);
  const n2 = gateShape('NAND', -0.4, 6.2, '#f0abfc', true, 0.82);
  const n3 = gateShape('NAND', -0.4, 1.8, '#f0abfc', true, 0.82);
  const n4 = gateShape('NAND', 3.4, 4, '#f0abfc', true, 0.82);

  const wires = [
    // A, B -> N1
    [new THREE.Vector3(-7.4, 4.6, 0), new THREE.Vector3(-5.7, 4.5, 0)],
    [new THREE.Vector3(-7.4, 3.4, 0), new THREE.Vector3(-5.7, 3.5, 0)],
    // N1 -> N2, N3
    [new THREE.Vector3(-3.2, 4, 0), new THREE.Vector3(-2.6, 4, 0), new THREE.Vector3(-2.6, 6.4, 0), new THREE.Vector3(-1.5, 6.4, 0)],
    [new THREE.Vector3(-3.2, 4, 0), new THREE.Vector3(-2.6, 4, 0), new THREE.Vector3(-2.6, 1.6, 0), new THREE.Vector3(-1.5, 1.6, 0)],
    // A -> N2, B -> N3
    [new THREE.Vector3(-7.4, 4.6, 0), new THREE.Vector3(-6.6, 4.6, 0), new THREE.Vector3(-6.6, 6.0, 0), new THREE.Vector3(-1.5, 6.0, 0)],
    [new THREE.Vector3(-7.4, 3.4, 0), new THREE.Vector3(-6.9, 3.4, 0), new THREE.Vector3(-6.9, 2.0, 0), new THREE.Vector3(-1.5, 2.0, 0)],
    // N2, N3 -> N4
    [new THREE.Vector3(1.0, 6.2, 0), new THREE.Vector3(1.7, 6.2, 0), new THREE.Vector3(1.7, 4.5, 0), new THREE.Vector3(2.3, 4.5, 0)],
    [new THREE.Vector3(1.0, 1.8, 0), new THREE.Vector3(1.7, 1.8, 0), new THREE.Vector3(1.7, 3.5, 0), new THREE.Vector3(2.3, 3.5, 0)],
    // N4 -> S
    [new THREE.Vector3(4.8, 4, 0), new THREE.Vector3(6.1, 4, 0)]
  ].map((pts) => {
    const l = pts.length === 2 ? segments(pts, '#64748b', 0.55) : curveLine(pts, '#64748b', 0.5, 30);
    g.add(l);
    return l;
  });

  // ---- 3-bosqich: bitta NAND ichidagi 4 tranzistor ----
  stageTag('bitta NAND ichi', 10.6, 7.4, '#cbd5e1');

  const railY = [6.2, -3.4];
  g.add(segments([
    new THREE.Vector3(7.4, railY[0], 0), new THREE.Vector3(13.8, railY[0], 0),
    new THREE.Vector3(7.4, railY[1], 0), new THREE.Vector3(13.8, railY[1], 0)
  ], '#64748b', 0.6));
  stageTag('VDD', 6.5, railY[0], '#fbbf24');
  stageTag('GND', 6.5, railY[1], '#94a3b8');

  const fet = (x, y, col, tag) => {
    const p = panel(2.3, 1.5, 0.6, col, { fill: 0.14, edgeOpacity: 0.7 });
    p.position.set(x, y, 0);
    g.add(p);
    const l = label(tag, { size: 17, color: col });
    l.position.set(x, y, 0.5);
    g.add(l);
    return p;
  };
  // 2 ta PMOS parallel (yuqorida), 2 ta NMOS ketma-ket (pastda)
  const p1 = fet(9.2, 4.6, '#f472b6', 'PMOS');
  const p2 = fet(12.2, 4.6, '#f472b6', 'PMOS');
  const n5 = fet(10.7, 0.4, '#34d399', 'NMOS');
  const n6 = fet(10.7, -1.9, '#34d399', 'NMOS');

  g.add(segments([
    new THREE.Vector3(9.2, railY[0], 0), new THREE.Vector3(9.2, 5.35, 0),
    new THREE.Vector3(12.2, railY[0], 0), new THREE.Vector3(12.2, 5.35, 0),
    new THREE.Vector3(9.2, 3.85, 0), new THREE.Vector3(9.2, 2.4, 0),
    new THREE.Vector3(12.2, 3.85, 0), new THREE.Vector3(12.2, 2.4, 0),
    new THREE.Vector3(9.2, 2.4, 0), new THREE.Vector3(12.2, 2.4, 0),
    new THREE.Vector3(10.7, 2.4, 0), new THREE.Vector3(10.7, 1.15, 0),
    new THREE.Vector3(10.7, -0.35, 0), new THREE.Vector3(10.7, -1.15, 0),
    new THREE.Vector3(10.7, -2.65, 0), new THREE.Vector3(10.7, railY[1], 0),
    new THREE.Vector3(10.7, 2.4, 0), new THREE.Vector3(13.8, 2.4, 0)
  ], '#64748b', 0.55));
  stageTag('chiqish', 14.6, 2.4, '#94a3b8');

  // Kirishlar gate'larga
  g.add(segments([
    new THREE.Vector3(7.6, 4.6, 0), new THREE.Vector3(8.05, 4.6, 0),
    new THREE.Vector3(7.6, 0.4, 0), new THREE.Vector3(9.55, 0.4, 0),
    new THREE.Vector3(7.6, -1.9, 0), new THREE.Vector3(9.55, -1.9, 0),
    new THREE.Vector3(11.05, 4.6, 0), new THREE.Vector3(11.05, 4.6, 0)
  ], '#475569', 0.5));

  // ---- Bosqichlar orasidagi "ochamiz" o'qlari ----
  [[-8.2, 4], [6.6, 4]].forEach(([x, y]) => {
    const l = label('ochamiz →', { size: 20, color: '#64748b' });
    l.position.set(x, y + 1.1, 0);
    g.add(l);
  });

  // ---- Pastda: hisob ----
  const counts = [
    ['1 NAND', '4 tranzistor', '#f0abfc'],
    ['1 XOR', '4 NAND = 16 tranzistor', '#a78bfa'],
    ['1 bitli summator', '~28 tranzistor', '#7dd3fc'],
    ['64-bitli summator', '~1800 tranzistor', '#fbbf24']
  ];
  const countObjs = counts.map(([k, v, col], i) => {
    const m = textPlane(
      [
        [{ text: k, color: '#64748b' }],
        [{ text: v, color: col, weight: '600' }]
      ],
      { size: 24, height: 1.5, align: 'center' }
    );
    m.position.set(-10.5 + i * 7, -7, 0);
    g.add(m);
    return m;
  });

  const note = textPlane(
    [[{ text: 'Mana shu yerda "mantiq" tugaydi va "fizika" boshlanadi.', color: '#94a3b8' }]],
    { size: 25, height: 0.8, align: 'center' }
  );
  note.position.set(0, -9.4, 0);
  g.add(note);

  const stages = [[xor], [n1, n2, n3, n4], [p1, p2, n5, n6]];

  return {
    group: g,
    update(t) {
      const active = Math.floor(t * 0.5) % 3;
      stages.forEach((objs, i) => {
        const on = i === active;
        objs.forEach((o) => {
          const mat = o.fill ? o.fill.material : o.userData.fillMesh.material;
          mat.opacity = on ? 0.14 + 0.16 * pulse(t, 3) : 0.06;
        });
      });
      wires.forEach((w, i) => {
        w.material.opacity = active === 1 ? 0.35 + 0.3 * pulse(t, 2, i * 0.4) : 0.22;
      });
      countObjs.forEach((m, i) => {
        m.material.opacity = 0.5 + 0.5 * pulse(t, 1.1, i * 0.8);
      });
    }
  };
}

// ── 12. CMOS tranzistor ─────────────────────────────────────────────────────
export function buildTransistor(meta) {
  const g = new THREE.Group();

  // ---- Chapda: bitta MOSFET ning fizik tuzilishi (3D) ----
  const fet = new THREE.Group();
  fet.position.set(-7, 3.4, 0);
  g.add(fet);

  const slab = (w, h, d, col, op) =>
    new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({
      color: col, transparent: true, opacity: op, depthWrite: false
    }));

  // Substrat (p-tur kremniy)
  const sub = slab(11, 2.4, 6, 0x1e3a5f, 0.5);
  sub.position.set(0, -1.6, 0);
  fet.add(sub, (() => { const e = wireBox(11, 2.4, 6, 0x60a5fa, 0.4); e.position.copy(sub.position); return e; })());
  const subTag = label('p-tur substrat', { size: 20, color: '#93c5fd' });
  subTag.position.set(0, -3.4, 3.4);
  fet.add(subTag);

  // Source va Drain (n+ sohalar)
  const src = slab(2.6, 1.6, 5, 0x34d399, 0.55);
  src.position.set(-3.6, -0.6, 0);
  const drn = slab(2.6, 1.6, 5, 0x34d399, 0.55);
  drn.position.set(3.6, -0.6, 0);
  fet.add(src, drn);
  [['Source', -3.6], ['Drain', 3.6]].forEach(([nm, x]) => {
    const l = label(nm, { size: 21, color: '#6ee7b7' });
    l.position.set(x, 0.9, 3);
    fet.add(l);
  });

  // Gate oksidi (juda yupqa) va gate elektrodi
  const ox = slab(5.2, 0.22, 5, 0xfbbf24, 0.5);
  ox.position.set(0, 0.05, 0);
  fet.add(ox);
  const gateEl = slab(5.2, 1.1, 5, 0xf472b6, 0.5);
  gateEl.position.set(0, 0.75, 0);
  fet.add(gateEl, (() => { const e = wireBox(5.2, 1.1, 5, 0xf472b6, 0.8); e.position.copy(gateEl.position); return e; })());
  const gateTag = label('Gate', { size: 22, color: '#f9a8d4' });
  gateTag.position.set(0, 2, 3);
  fet.add(gateTag);
  const oxTag = label('gate oksidi ~1–2 nm', { size: 18, color: '#fcd34d' });
  oxTag.position.set(6.4, 0.05, 3);
  fet.add(oxTag);

  // Kanal — gate yonganda paydo bo'ladi
  const channel = slab(5.2, 0.3, 4.6, 0x7dd3fc, 0);
  channel.position.set(0, -0.45, 0);
  fet.add(channel);

  // Kanal bo'ylab oquvchi elektronlar
  const EN = 26;
  const epos = new Float32Array(EN * 3);
  for (let i = 0; i < EN; i++) {
    epos[i * 3] = -3.6 + Math.random() * 7.2;
    epos[i * 3 + 1] = -0.45 + (Math.random() - 0.5) * 0.25;
    epos[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  const electrons = points(epos, 0x7dd3fc, 0.42, 0);
  fet.add(electrons);

  // ---- O'ngda: CMOS invertor sxemasi ----
  const inv = new THREE.Group();
  inv.position.set(9, 3.4, 0);
  g.add(inv);

  const rail = (y, txt, col) => {
    const l = segments([new THREE.Vector3(-4, y, 0), new THREE.Vector3(4, y, 0)], col, 0.6);
    inv.add(l);
    const t = label(txt, { size: 22, color: col });
    t.position.set(-5.2, y, 0);
    inv.add(t);
  };
  rail(5.2, 'VDD (1)', '#fbbf24');
  rail(-5.2, 'GND (0)', '#94a3b8');

  const pmos = panel(3.4, 2.4, 0.8, '#f472b6', { fill: 0.12, edgeOpacity: 0.7 });
  pmos.position.set(0, 2.6, 0);
  inv.add(pmos);
  const pTag = label('PMOS', { size: 22, color: '#f9a8d4' });
  pTag.position.set(0, 2.6, 0.6);
  inv.add(pTag);

  const nmos = panel(3.4, 2.4, 0.8, '#34d399', { fill: 0.12, edgeOpacity: 0.7 });
  nmos.position.set(0, -2.6, 0);
  inv.add(nmos);
  const nTag = label('NMOS', { size: 22, color: '#6ee7b7' });
  nTag.position.set(0, -2.6, 0.6);
  inv.add(nTag);

  inv.add(segments([
    new THREE.Vector3(0, 5.2, 0), new THREE.Vector3(0, 3.8, 0),
    new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(0, -1.4, 0),
    new THREE.Vector3(0, -3.8, 0), new THREE.Vector3(0, -5.2, 0),
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(4.6, 0, 0),
    new THREE.Vector3(-4.6, 2.6, 0), new THREE.Vector3(-1.7, 2.6, 0),
    new THREE.Vector3(-4.6, -2.6, 0), new THREE.Vector3(-1.7, -2.6, 0),
    new THREE.Vector3(-4.6, 2.6, 0), new THREE.Vector3(-4.6, -2.6, 0)
  ], '#64748b', 0.55));

  const inLabel = label('kirish', { size: 20, color: '#94a3b8' });
  inLabel.position.set(-5.6, 0, 0);
  inv.add(inLabel);
  const inBit = label('0', { size: 40, color: '#94a3b8', font: '"JetBrains Mono", monospace', weight: '700' });
  const inBit1 = label('1', { size: 40, color: '#4ade80', font: '"JetBrains Mono", monospace', weight: '700' });
  inBit.position.set(-6.9, 0, 0);
  inBit1.position.set(-6.9, 0, 0);
  inv.add(inBit, inBit1);

  const outLabel = label('chiqish', { size: 20, color: '#94a3b8' });
  outLabel.position.set(5.9, 0, 0);
  inv.add(outLabel);
  const outBit = label('0', { size: 40, color: '#94a3b8', font: '"JetBrains Mono", monospace', weight: '700' });
  const outBit1 = label('1', { size: 40, color: '#4ade80', font: '"JetBrains Mono", monospace', weight: '700' });
  outBit.position.set(7.2, 0, 0);
  outBit1.position.set(7.2, 0, 0);
  inv.add(outBit, outBit1);

  const invTag = label('CMOS invertor  =  NOT  =  2 tranzistor', { size: 23, color: '#94a3b8' });
  invTag.position.set(0, -6.8, 0);
  inv.add(invTag);

  // ---- Pastda: masshtab ----
  const scaleTag = label('bitta chipda 100 000 000 000+ shunday tranzistor bor', { size: 24, color: '#cbd5e1' });
  scaleTag.position.set(0, -6.6, 0);
  g.add(scaleTag);

  const GN = 2600;
  const gpos = new Float32Array(GN * 3);
  for (let i = 0; i < GN; i++) {
    gpos[i * 3] = (Math.random() - 0.5) * 30;
    gpos[i * 3 + 1] = -9.6 + (Math.random() - 0.5) * 4.4;
    gpos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3;
  }
  const die = points(gpos, meta.color, 0.16, 0.6);
  g.add(die);

  return {
    group: g,
    update(t, dt) {
      const on = (t * 0.7) % 2 > 1; // gate ga kuchlanish berilgan/berilmagan
      const k = on ? 1 : 0;
      channel.material.opacity = lerp(channel.material.opacity, k * 0.75, 1 - Math.exp(-8 * dt));
      electrons.material.opacity = channel.material.opacity;
      gateEl.material.opacity = 0.35 + k * 0.35;

      const arr = electrons.geometry.attributes.position.array;
      if (on) {
        for (let i = 0; i < EN; i++) {
          arr[i * 3] += (3 + (i % 5) * 0.4) * dt;
          if (arr[i * 3] > 3.6) arr[i * 3] = -3.6;
        }
        electrons.geometry.attributes.position.needsUpdate = true;
      }

      // Invertor: kirish 0 → chiqish 1, kirish 1 → chiqish 0
      inBit.visible = !on; inBit1.visible = on;
      outBit.visible = on; outBit1.visible = !on;
      pmos.userData.fillMesh.material.opacity = on ? 0.05 : 0.26;   // kirish 0 da PMOS ochiq
      nmos.userData.fillMesh.material.opacity = on ? 0.26 : 0.05;   // kirish 1 da NMOS ochiq

      die.material.opacity = 0.35 + 0.25 * pulse(t, 1.2);
      die.rotation.z = Math.sin(t * 0.12) * 0.02;
    }
  };
}

// ── 13. Xotira yacheykasi: SRAM · DRAM · flash ──────────────────────────────
export function buildMemory(meta) {
  const g = new THREE.Group();

  const cellTitle = (name, sub, x, col) => {
    const m = textPlane(
      [
        [{ text: name, color: col, weight: '700' }],
        [{ text: sub, color: '#64748b' }]
      ],
      { size: 26, height: 1.6, align: 'center' }
    );
    m.position.set(x, 7.4, 0);
    g.add(m);
  };

  const fetBox = (x, y, col, tag, w = 1.9, h = 1.3) => {
    const p = panel(w, h, 0.5, col, { fill: 0.13, edgeOpacity: 0.65 });
    p.position.set(x, y, 0);
    g.add(p);
    if (tag) {
      const l = label(tag, { size: 16, color: col });
      l.position.set(x, y, 0.45);
      g.add(l);
    }
    return p;
  };

  // ---- SRAM: ikki invertor halqasi + 2 kirish tranzistori ----
  cellTitle('SRAM', 'kesh · 6 tranzistor · ~1 ns', -10.5, '#a5f3fc');
  const inv1 = fetBox(-12.2, 3.4, '#7dd3fc', 'invertor', 2.6, 1.5);
  const inv2 = fetBox(-8.8, 3.4, '#7dd3fc', 'invertor', 2.6, 1.5);
  g.add(segments([
    new THREE.Vector3(-12.2, 4.15, 0), new THREE.Vector3(-12.2, 5, 0),
    new THREE.Vector3(-12.2, 5, 0), new THREE.Vector3(-8.8, 5, 0),
    new THREE.Vector3(-8.8, 5, 0), new THREE.Vector3(-8.8, 4.15, 0),
    new THREE.Vector3(-12.2, 2.65, 0), new THREE.Vector3(-12.2, 1.8, 0),
    new THREE.Vector3(-12.2, 1.8, 0), new THREE.Vector3(-8.8, 1.8, 0),
    new THREE.Vector3(-8.8, 1.8, 0), new THREE.Vector3(-8.8, 2.65, 0),
    new THREE.Vector3(-13.5, 3.4, 0), new THREE.Vector3(-13.5, 0.2, 0),
    new THREE.Vector3(-7.5, 3.4, 0), new THREE.Vector3(-7.5, 0.2, 0)
  ], '#64748b', 0.5));
  const sramAcc = [fetBox(-13.5, -0.6, '#34d399', null, 1.5, 1.1), fetBox(-7.5, -0.6, '#34d399', null, 1.5, 1.1)];
  const sramBit = label('1', { size: 34, color: '#a5f3fc', font: '"JetBrains Mono", monospace', weight: '700' });
  sramBit.position.set(-10.5, 3.4, 0.6);
  g.add(sramBit);
  const sramNote = textPlane(
    [[{ text: 'ikki invertor bir-birini ushlab turadi —', color: '#64748b' }],
     [{ text: 'tok bor ekan, bit turaveradi', color: '#94a3b8' }]],
    { size: 22, height: 1.4, align: 'center' }
  );
  sramNote.position.set(-10.5, -3.2, 0);
  g.add(sramNote);

  // ---- DRAM: 1 tranzistor + 1 kondensator ----
  cellTitle('DRAM', 'RAM · 1T + 1C · ~50 ns', 0, '#fbbf24');
  const dramT = fetBox(-1.6, 3.4, '#34d399', 'T', 1.7, 1.2);
  g.add(segments([
    new THREE.Vector3(-1.6, 4.6, 0), new THREE.Vector3(-1.6, 5.6, 0),
    new THREE.Vector3(-0.75, 3.4, 0), new THREE.Vector3(1.2, 3.4, 0),
    new THREE.Vector3(1.2, 1.2, 0), new THREE.Vector3(1.2, 0.4, 0),
    new THREE.Vector3(-3.4, 3.4, 0), new THREE.Vector3(-2.45, 3.4, 0)
  ], '#64748b', 0.5));
  const wl = label('word line', { size: 17, color: '#64748b' });
  wl.position.set(-1.6, 6.1, 0);
  g.add(wl);
  const bl = label('bit line', { size: 17, color: '#64748b' });
  bl.position.set(-4.3, 3.4, 0);
  g.add(bl);

  // Kondensator plastinkalari
  g.add(segments([
    new THREE.Vector3(0.2, 1.2, 0), new THREE.Vector3(2.2, 1.2, 0),
    new THREE.Vector3(0.2, 0.4, 0), new THREE.Vector3(2.2, 0.4, 0),
    new THREE.Vector3(1.2, 3.4, 0), new THREE.Vector3(1.2, 1.2, 0),
    new THREE.Vector3(1.2, 0.4, 0), new THREE.Vector3(1.2, -0.6, 0),
    new THREE.Vector3(0.5, -0.6, 0), new THREE.Vector3(1.9, -0.6, 0)
  ], '#64748b', 0.6));
  const charge = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 0.62),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.6, depthWrite: false })
  );
  charge.position.set(1.2, 0.8, -0.1);
  g.add(charge);
  const capTag = label('kondensator', { size: 17, color: '#fbbf24' });
  capTag.position.set(3.6, 0.8, 0);
  g.add(capTag);

  // Oqib ketayotgan elektronlar
  const leak = [];
  for (let i = 0; i < 6; i++) {
    const s = glowSprite('#fbbf24', 0.42);
    g.add(s);
    leak.push({ s, off: i / 6 });
  }
  const refreshTag = label('refresh — har ~64 ms', { size: 21, color: '#fbbf24' });
  refreshTag.position.set(0, -2.6, 0);
  g.add(refreshTag);
  const dramNote = textPlane(
    [[{ text: 'kondensator oqib ketadi, shuning uchun', color: '#64748b' }],
     [{ text: 'xotira doimiy yangilanib turadi', color: '#94a3b8' }]],
    { size: 22, height: 1.4, align: 'center' }
  );
  dramNote.position.set(0, -4.2, 0);
  g.add(dramNote);

  // ---- Flash: suzuvchi gate ----
  cellTitle('NAND flash', 'SSD · suzuvchi gate · doimiy', 10.5, '#c4b5fd');
  const slab = (w, h, col, op, x, y) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false })
    );
    m.position.set(x, y, 0);
    g.add(m);
    const e = wireBox(w, h, 0.001, col, 0.5);
    e.position.set(x, y, 0);
    g.add(e);
    return m;
  };
  slab(8.4, 1.8, 0x1e3a5f, 0.5, 10.5, 0.3);                    // substrat
  slab(2, 1.4, 0x34d399, 0.5, 7.6, 1);                          // source
  slab(2, 1.4, 0x34d399, 0.5, 13.4, 1);                         // drain
  const oxide1 = slab(4.4, 0.5, 0xfbbf24, 0.35, 10.5, 1.7);      // tunnel oksidi
  const floatG = slab(4.4, 0.9, 0xc4b5fd, 0.45, 10.5, 2.5);      // suzuvchi gate
  slab(4.4, 0.4, 0xfbbf24, 0.35, 10.5, 3.2);                     // blokirovka oksidi
  const ctrlG = slab(4.4, 1, 0xf472b6, 0.5, 10.5, 3.9);          // boshqaruv gate'i

  [['boshqaruv gate', 3.9, '#f9a8d4'], ['suzuvchi gate', 2.5, '#ddd6fe'],
   ['tunnel oksidi', 1.7, '#fcd34d'], ['substrat', 0.3, '#93c5fd']].forEach(([txt, y, col]) => {
    const l = label(txt, { size: 17, color: col });
    l.position.set(15.4, y, 0.3);
    g.add(l);
  });

  // Tunnellashuvchi elektronlar
  const tun = [];
  for (let i = 0; i < 5; i++) {
    const s = glowSprite('#e9d5ff', 0.5);
    g.add(s);
    tun.push({ s, x: 8.9 + i * 0.8, off: i * 0.19 });
  }
  const flashNote = textPlane(
    [[{ text: 'elektron oksiddan tunnellashib o\'tadi va', color: '#64748b' }],
     [{ text: 'suzuvchi gate ichida qamalib qoladi', color: '#94a3b8' }]],
    { size: 22, height: 1.4, align: 'center' }
  );
  flashNote.position.set(10.5, -3.2, 0);
  g.add(flashNote);

  const finale = textPlane(
    [[{ text: 'Oxirgi qatlamlarda tunnellashuvni nuqson sifatida ko\'rasiz — bu yerda esa butun sanoat unga tayanadi.', color: '#cbd5e1' }]],
    { size: 24, height: 0.8, align: 'center' }
  );
  finale.position.set(1, -6.6, 0);
  g.add(finale);

  return {
    group: g,
    update(t) {
      const beat = Math.floor(t * 1.5) % 2;
      sramBit.material.opacity = 0.55 + 0.45 * (beat ? 1 : 0.55);
      [inv1, inv2].forEach((p, i) => {
        p.userData.fillMesh.material.opacity = 0.08 + 0.14 * pulse(t, 3, i * Math.PI);
      });
      sramAcc.forEach((p, i) => {
        p.userData.fillMesh.material.opacity = 0.07 + 0.1 * pulse(t, 1.4, i);
      });

      // DRAM: zaryad asta kamayadi, keyin refresh uni tiklaydi
      const cyc = (t * 0.32) % 1;
      const level = cyc < 0.82 ? 1 - cyc / 0.82 * 0.75 : 1;
      charge.scale.y = level;
      charge.position.y = 0.4 + 0.31 * level;
      charge.material.opacity = 0.25 + 0.45 * level;
      dramT.userData.fillMesh.material.opacity = cyc > 0.82 ? 0.3 : 0.08;
      refreshTag.material.opacity = cyc > 0.82 ? 1 : 0.3;
      leak.forEach(({ s, off }) => {
        const k = (t * 0.5 + off) % 1;
        s.position.set(1.2 + (k - 0.5) * 2.6, 0.8 - k * 1.4, 0.4);
        s.material.opacity = cyc < 0.82 ? Math.sin(k * Math.PI) * 0.55 : 0;
      });

      // Flash: elektronlar oksiddan suzuvchi gate ichiga o'tadi
      floatG.material.opacity = 0.3 + 0.25 * pulse(t, 0.8);
      ctrlG.material.opacity = 0.35 + 0.25 * pulse(t, 0.8);
      oxide1.material.opacity = 0.25 + 0.2 * pulse(t, 2);
      tun.forEach(({ s, x, off }) => {
        const k = (t * 0.34 + off) % 1;
        s.position.set(x, 0.9 + k * 1.7, 0.4);
        // to'siq ichida so'nadi, narigi tomonda tiklanadi
        s.material.opacity = k < 0.35 ? 0.85 : k < 0.6 ? 0.15 : 0.7;
      });
    }
  };
}

// ── 14. Kremniy kristalli, doping, PN o'tish ────────────────────────────────
export function buildSilicon(meta) {
  const g = new THREE.Group();

  const COLS = 15, ROWS = 8, SP = 1.9;
  const x0 = -(COLS - 1) / 2 * SP;
  const y0 = 3.4;

  const atomPos = [];
  const bonds = [];
  const dopants = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const jitter = ((r + c) % 2) * 0.28;
      const p = new THREE.Vector3(x0 + c * SP, y0 - r * SP, jitter - 0.14);
      atomPos.push({ p, c, r });
      if (c > 0) bonds.push(atomPos[atomPos.length - 2].p, p);
      if (r > 0) bonds.push(atomPos[(r - 1) * COLS + c].p, p);
    }
  }
  g.add(segments(bonds, '#3b5578', 0.42));

  // p-tur chapda, n-tur o'ngda, o'rtada bo'shash sohasi
  const MID = 7;
  atomPos.forEach(({ p, c, r }, i) => {
    const isDopant = (c * 7 + r * 3) % 11 === 0;
    let col = 0x64748b, rad = 0.24;
    if (isDopant) {
      col = c < MID ? 0xfb923c : 0x4ade80; // bor : fosfor
      rad = 0.4;
      dopants.push({ p, n: c >= MID });
    }
    const a = orb(rad, col, isDopant ? 1 : 0.8);
    a.position.copy(p);
    g.add(a);
    if (isDopant) {
      const gl = glowSprite(col, 1.6);
      gl.position.copy(p);
      gl.material.opacity = 0.5;
      g.add(gl);
    }
  });

  // Bo'shash sohasi
  const depl = new THREE.Mesh(
    new THREE.PlaneGeometry(SP * 2.2, ROWS * SP + 1.2),
    new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.13, depthWrite: false })
  );
  depl.position.set(x0 + (MID - 0.5) * SP, y0 - (ROWS - 1) * SP / 2, -0.6);
  g.add(depl);
  const deplTag = label('bo\'shash sohasi', { size: 21, color: '#d8b4fe' });
  deplTag.position.set(depl.position.x, y0 + 1.5, 0.4);
  g.add(deplTag);

  const pTag = label('p-tur  ·  bor qo\'shilgan  ·  kovaklar', { size: 24, color: '#fdba74' });
  pTag.position.set(x0 + 2.5 * SP, y0 + 2.6, 0);
  g.add(pTag);
  const nTag = label('n-tur  ·  fosfor qo\'shilgan  ·  erkin elektronlar', { size: 24, color: '#86efac' });
  nTag.position.set(x0 + 11 * SP, y0 + 2.6, 0);
  g.add(nTag);

  // Harakatlanuvchi zaryad tashuvchilar
  const CN = 90;
  const cpos = new Float32Array(CN * 3);
  const cdir = new Float32Array(CN);
  for (let i = 0; i < CN; i++) {
    const nSide = i % 2 === 0;
    cpos[i * 3] = nSide ? x0 + (MID + Math.random() * 7) * SP : x0 + Math.random() * MID * SP;
    cpos[i * 3 + 1] = y0 - Math.random() * (ROWS - 1) * SP;
    cpos[i * 3 + 2] = 0.6;
    cdir[i] = nSide ? -1 : 1;
  }
  const carriers = points(cpos, 0x7dd3fc, 0.34, 0.85);
  g.add(carriers);

  const note = textPlane(
    [
      [{ text: 'Sof kremniy tokni deyarli o\'tkazmaydi.', color: '#94a3b8' }],
      [{ text: 'Panjaraga boshqa atom qo\'shsak — o\'tkazuvchanlikni ', color: '#94a3b8' }, { text: 'boshqarish', color: '#e2e8f0', weight: '600' }, { text: ' mumkin bo\'ladi.', color: '#94a3b8' }],
      [{ text: 'Tranzistordagi gate aynan shu bo\'shash sohasini kengaytiradi yoki toraytiradi.', color: '#64748b' }]
    ],
    { size: 26, height: 2.6, align: 'center' }
  );
  note.position.set(0, -12.8, 0);
  g.add(note);

  return {
    group: g,
    update(t, dt) {
      const arr = carriers.geometry.attributes.position.array;
      const midX = x0 + (MID - 0.5) * SP;
      for (let i = 0; i < CN; i++) {
        arr[i * 3] += cdir[i] * (0.9 + (i % 4) * 0.25) * dt;
        // Bo'shash sohasida to'planib, keyin qaytadi
        if (cdir[i] < 0 && arr[i * 3] < midX + 0.7) arr[i * 3] = x0 + (COLS - 1) * SP;
        if (cdir[i] > 0 && arr[i * 3] > midX - 0.7) arr[i * 3] = x0;
      }
      carriers.geometry.attributes.position.needsUpdate = true;
      depl.material.opacity = 0.09 + 0.09 * pulse(t, 1.1);
      depl.scale.x = 1 + 0.14 * pulse(t, 0.6);
    }
  };
}

// ── 12. Kvant fizikasi ──────────────────────────────────────────────────────
export function buildQuantum(meta) {
  const g = new THREE.Group();

  // ---- Chapda: energiya zonalari ----
  const bands = new THREE.Group();
  bands.position.set(-8.6, 3.2, 0);
  g.add(bands);

  const band = (y, h, col, name, sub) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(9, h),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2, depthWrite: false })
    );
    m.position.set(0, y, 0);
    bands.add(m);
    const e = wireBox(9, h, 0.001, col, 0.5);
    e.position.copy(m.position);
    bands.add(e);
    const nm = label(name, { size: 23, color: col });
    nm.position.set(0, y + h / 2 - 0.5, 0.3);
    bands.add(nm);
    if (sub) {
      const s = label(sub, { size: 18, color: '#64748b' });
      s.position.set(0, y - h / 2 + 0.45, 0.3);
      bands.add(s);
    }
    return m;
  };

  const cond = band(4, 2.4, 0x38bdf8, 'o\'tkazuvchanlik zonasi', 'elektron erkin harakatlanadi');
  const val = band(-2.6, 2.4, 0x34d399, 'valent zona', 'elektron bog\'langan');

  // Taqiqlangan zona
  const gapMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 4.2),
    new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.05, depthWrite: false })
  );
  gapMesh.position.set(0, 0.7, -0.1);
  bands.add(gapMesh);
  const gapTag = textPlane(
    [
      [{ text: 'taqiqlangan zona', color: '#f9a8d4' }],
      [{ text: '1.12 eV', color: '#ffffff', weight: '700' }]
    ],
    { size: 27, height: 1.7, align: 'center' }
  );
  gapTag.position.set(0, 0.7, 0.3);
  bands.add(gapTag);

  // Zonalar orasida sakraydigan elektronlar
  const jumpers = [];
  for (let i = 0; i < 5; i++) {
    const s = glowSprite('#e0f2fe', 0.7);
    bands.add(s);
    jumpers.push({ s, x: -3.4 + i * 1.7, off: i * 0.37 });
  }

  const bandNote = label('atomlar kristallda yaqinlashganda sathlar zonalarga yoyiladi', { size: 21, color: '#64748b' });
  bandNote.position.set(0, -5.4, 0);
  bands.add(bandNote);

  // ---- O'ngda: kvant tunnellashuvi ----
  const tun = new THREE.Group();
  tun.position.set(9.5, 3.6, 0);
  g.add(tun);

  const barrier = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 6),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.18, depthWrite: false })
  );
  barrier.position.set(0, 0, -0.2);
  tun.add(barrier, (() => { const e = wireBox(2.4, 6, 0.001, 0xfbbf24, 0.6); e.position.copy(barrier.position); return e; })());
  const barTag = label('gate oksidi — to\'siq', { size: 20, color: '#fcd34d' });
  barTag.position.set(0, 3.6, 0.3);
  tun.add(barTag);

  // To'lqin funksiyasi: to'siqdan oldin — tebranish, ichida — eksponensial so'nish, keyin — kichik tebranish
  const WN = 300;
  const wpos = new Float32Array(WN * 3);
  const wgeo = new THREE.BufferGeometry();
  wgeo.setAttribute('position', new THREE.BufferAttribute(wpos, 3));
  const wave = new THREE.Line(wgeo, lineMat('#c084fc', 0.95));
  tun.add(wave);

  const psiTag = label('ψ — elektronning to\'lqin funksiyasi', { size: 21, color: '#d8b4fe' });
  psiTag.position.set(0, -4, 0);
  tun.add(psiTag);
  const leakTag = label('to\'siqdan o\'tib ketgan qism  →  sizib chiqish toki', { size: 20, color: '#fca5a5' });
  leakTag.position.set(1.5, -5.1, 0);
  tun.add(leakTag);

  // Ba'zan tunnel qilib o'tuvchi elektronlar
  const tunnellers = [];
  for (let i = 0; i < 3; i++) {
    const s = glowSprite('#f0abfc', 0.6);
    tun.add(s);
    tunnellers.push({ s, off: i * 0.33 });
  }

  // ---- Pastda: ehtimollik buluti ----
  const CN = 2400;
  const cpos = new Float32Array(CN * 3);
  const cbase = new Float32Array(CN * 3);
  for (let i = 0; i < CN; i++) {
    // |ψ|² ga o'xshash taqsimot: markazga zich, chetga siyrak
    const u = Math.random(), v = Math.random(), w = Math.random();
    const r = Math.pow(u, 0.45) * 4.2;
    const th = Math.acos(2 * v - 1);
    const ph = 2 * Math.PI * w;
    const x = r * Math.sin(th) * Math.cos(ph);
    const y = r * Math.sin(th) * Math.sin(ph);
    const z = r * Math.cos(th) * 0.6;
    cbase[i * 3] = x; cbase[i * 3 + 1] = y; cbase[i * 3 + 2] = z;
    cpos[i * 3] = x; cpos[i * 3 + 1] = y - 8; cpos[i * 3 + 2] = z;
  }
  const cloud = points(cpos, meta.color, 0.22, 0.7);
  g.add(cloud);
  const nucleus = orb(0.3, '#ffffff', 0.9);
  nucleus.position.set(0, -8, 0);
  g.add(nucleus);
  const cloudTag = label('elektron bu yerda emas — u faqat |ψ|² ehtimol bilan mavjud', { size: 23, color: '#cbd5e1' });
  cloudTag.position.set(0, -12.2, 0);
  g.add(cloudTag);

  const finale = textPlane(
    [[{ text: 'Eng pastki qavat shu. Endi bitta savol qoldi: siz buni qanday ko\'rasiz?', color: '#e9d5ff', weight: '600' }]],
    { size: 27, height: 0.95, align: 'center' }
  );
  finale.position.set(0, -13.6, 0);
  g.add(finale);

  return {
    group: g,
    update(t, dt) {
      cond.material.opacity = 0.14 + 0.1 * pulse(t, 1.3);
      val.material.opacity = 0.14 + 0.1 * pulse(t, 1.3, 1.6);

      jumpers.forEach(({ s, x, off }) => {
        const k = (t * 0.4 + off) % 1;
        // valent zonadan o'tkazuvchanlik zonasiga sakrash
        const y = k < 0.5 ? lerp(-2.6, 4, k * 2) : lerp(4, -2.6, (k - 0.5) * 2);
        s.position.set(x, y, 0.4);
        s.material.opacity = 0.35 + 0.6 * Math.sin(k * Math.PI);
      });

      // To'lqin funksiyasi
      const arr = wave.geometry.attributes.position.array;
      const B = 1.2; // to'siq yarim kengligi
      for (let i = 0; i < WN; i++) {
        const x = (i / (WN - 1)) * 12 - 8;
        let a;
        if (x < -B) a = 1.4 * Math.sin(x * 3 - t * 5);
        else if (x <= B) a = 1.4 * Math.exp(-(x + B) * 1.55) * Math.sin(-B * 3 - t * 5);
        else a = 1.4 * Math.exp(-2 * B * 1.55) * Math.sin(x * 3 - t * 5);
        arr[i * 3] = x;
        arr[i * 3 + 1] = a;
        arr[i * 3 + 2] = 0.2;
      }
      wave.geometry.attributes.position.needsUpdate = true;

      tunnellers.forEach(({ s, off }) => {
        const k = (t * 0.28 + off) % 1;
        s.position.set(-8 + k * 12, 0, 0.5);
        // to'siq ichida deyarli ko'rinmaydi, narigi tomonda zaif tiklanadi
        const inside = Math.abs(s.position.x) < B;
        s.material.opacity = inside ? 0.12 : s.position.x > B ? 0.3 : 0.9;
      });

      // Ehtimollik buluti "nafas oladi"
      const cArr = cloud.geometry.attributes.position.array;
      for (let i = 0; i < CN; i++) {
        const w = 1 + 0.08 * Math.sin(t * 1.6 + cbase[i * 3] * 0.8 + cbase[i * 3 + 1] * 0.5);
        cArr[i * 3] = cbase[i * 3] * w;
        cArr[i * 3 + 1] = cbase[i * 3 + 1] * w - 8;
        cArr[i * 3 + 2] = cbase[i * 3 + 2] * w;
      }
      cloud.geometry.attributes.position.needsUpdate = true;
      cloud.rotation.y = t * 0.12;
      cloud.material.opacity = 0.5 + 0.2 * pulse(t, 0.8);
      nucleus.scale.setScalar(1 + 0.25 * pulse(t, 3));
      finale.material.opacity = 0.6 + 0.4 * pulse(t, 0.9);
    }
  };
}
