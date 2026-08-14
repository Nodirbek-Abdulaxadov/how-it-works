// C# boshi: manba kod → sintaksis daraxti → IL → CLR va JIT.
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  points, orb, glowSprite, lineMat, pulse, clamp, lerp
} from '../../lib/gfx.js';

const C = {
  key: '#c084fc',    // kalit so'zlar
  type: '#5eead4',   // turlar
  str: '#fca5a5',    // qatorlar
  num: '#fbbf24',    // sonlar
  id: '#e2e8f0',     // identifikatorlar
  dim: '#64748b'     // qavslar, punktuatsiya
};

// ── 01. Manba kod ───────────────────────────────────────────────────────────
export function buildSource(meta) {
  const g = new THREE.Group();

  const code = [
    [{ text: 'using ', color: C.key }, { text: 'System', color: C.type }, { text: ';', color: C.dim }],
    [],
    [{ text: 'class ', color: C.key }, { text: 'Program', color: C.type }, { text: ' {', color: C.dim }],
    [{ text: '    static void ', color: C.key }, { text: 'Main', color: C.id }, { text: '() {', color: C.dim }],
    [{ text: '        int ', color: C.key }, { text: 'x', color: C.id }, { text: ' = ', color: C.dim },
     { text: '40', color: C.num }, { text: ' + ', color: C.dim }, { text: '2', color: C.num }, { text: ';', color: C.dim }],
    [{ text: '        Console', color: C.type }, { text: '.', color: C.dim }, { text: 'WriteLine', color: C.id },
     { text: '(', color: C.dim }, { text: '$"Javob: {x}"', color: C.str }, { text: ');', color: C.dim }],
    [{ text: '    }', color: C.dim }],
    [{ text: '}', color: C.dim }]
  ];

  const plane = textPlane(code, { size: 34, height: 9, bg: 'rgba(9,14,28,0.92)', border: 'rgba(110,231,255,0.28)', padX: 40, padY: 30 });
  plane.position.set(0, 3.2, 0);
  g.add(plane);

  const [pw, ph] = plane.userData.size;
  const fileTab = label('Program.cs', { size: 26, color: '#7dd3fc', font: '"JetBrains Mono", monospace' });
  fileTab.position.set(-pw / 2 + 2.4, 3.2 + ph / 2 + 0.85, 0.1);
  g.add(fileTab);

  // Kod ustidan yuguruvchi "o'qish" chizig'i
  const scan = new THREE.Mesh(
    new THREE.PlaneGeometry(pw, 0.72),
    new THREE.MeshBasicMaterial({ color: meta.color, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  g.add(scan);

  // Panel ostidagi bayt oqimi: matn → UTF-8 baytlar
  const byteRows = [];
  const src = 'using System; class Program { static void Main() { int x = 40 + 2; } }';
  for (let r = 0; r < 3; r++) {
    const bytes = [];
    for (let i = 0; i < 26; i++) {
      const ch = src.charCodeAt((r * 26 + i) % src.length);
      bytes.push(ch.toString(16).toUpperCase().padStart(2, '0'));
    }
    const row = textPlane([bytes.join(' ')], { size: 30, height: 0.72, color: '#64748b' });
    row.position.set(0, -4.6 - r * 1.25, -1.5);
    row.material.opacity = 0.55 - r * 0.13;
    g.add(row);
    byteRows.push(row);
  }

  const arrow = label('↓  diskda shunday yotadi', { size: 24, color: '#475569' });
  arrow.position.set(0, -3.5, -1.4);
  g.add(arrow);

  return {
    group: g,
    update(t) {
      const cycle = (t * 0.32) % 1.6;
      scan.position.set(0, 3.2 + ph / 2 - cycle / 1.6 * ph, 0.2);
      scan.material.opacity = cycle < 1 ? 0.18 : 0.18 * (1 - (cycle - 1) / 0.6);
      byteRows.forEach((row, i) => {
        row.position.x = ((t * (0.9 + i * 0.25)) % 8) - 4;
      });
    }
  };
}

// ── 02. Sintaksis daraxti ───────────────────────────────────────────────────
export function buildAst(meta) {
  const g = new THREE.Group();

  // Yuqoridan oqib keluvchi tokenlar
  const tokens = ['int', 'x', '=', '40', '+', '2', ';'];
  const tokenMeshes = tokens.map((tk, i) => {
    const m = textPlane([tk], {
      size: 30, height: 0.78, bg: 'rgba(20,25,48,0.9)',
      border: 'rgba(139,124,255,0.5)', color: '#c7d2fe', padX: 16, padY: 10
    });
    m.position.set(-7.2 + i * 2.4, 9.5, 0);
    g.add(m);
    return m;
  });
  const lexLabel = label('lexer  →  tokenlar', { size: 24, color: '#94a3b8' });
  lexLabel.position.set(0, 11.2, 0);
  g.add(lexLabel);

  // AST tuzilishi: [nom, x, y, ota-indeks]
  const nodes = [
    ['LocalDeclaration', 0, 6.2, -1],
    ['VariableDeclarator', -3.6, 3.4, 0],
    ['x', -6.6, 0.8, 1],
    ['BinaryExpression  +', 1.2, 0.8, 1],
    ['Literal 40', -1.6, -2.2, 3],
    ['Literal 2', 4.4, -2.2, 3],
    ['PredefinedType  int', 5.2, 3.4, 0]
  ];

  const nodeObjs = nodes.map(([name, x, y], i) => {
    const grp = new THREE.Group();
    const isLeaf = !nodes.some((n) => n[3] === i);
    const dot = orb(isLeaf ? 0.3 : 0.42, isLeaf ? meta.color2 : meta.color, 0.95);
    grp.add(dot);
    const glow = glowSprite(isLeaf ? meta.color2 : meta.color, 2.4);
    glow.material.opacity = 0.5;
    grp.add(glow);
    const tag = label(name, { size: 26, color: isLeaf ? '#a5f3fc' : '#ddd6fe' });
    tag.position.set(0, 0.95, 0);
    grp.add(tag);
    grp.position.set(x, y, 0);
    g.add(grp);
    return { grp, glow, x, y };
  });

  const edgePairs = [];
  const edgeList = [];
  nodes.forEach(([, x, y, parent]) => {
    if (parent < 0) return;
    const p = nodes[parent];
    edgePairs.push(new THREE.Vector3(p[1], p[2] - 0.5, 0), new THREE.Vector3(x, y + 0.5, 0));
    edgeList.push([new THREE.Vector3(p[1], p[2] - 0.5, 0), new THREE.Vector3(x, y + 0.5, 0)]);
  });
  g.add(segments(edgePairs, meta.color, 0.4));

  // Qirralar bo'ylab yuguruvchi semantik "bog'lash" impulslari
  const pulses = edgeList.map(() => {
    const s = glowSprite('#ffffff', 0.55);
    g.add(s);
    return s;
  });

  const bindLabel = label('parser + semantik tahlil  →  har bir nom o\'z simvoliga bog\'lanadi', { size: 24, color: '#94a3b8' });
  bindLabel.position.set(0, -4.6, 0);
  g.add(bindLabel);

  return {
    group: g,
    update(t) {
      tokenMeshes.forEach((m, i) => {
        const k = (t * 0.5 - i * 0.09) % 1;
        m.position.y = 9.5 - k * 2.6;
        m.material.opacity = Math.sin(k * Math.PI) * 0.95 + 0.05;
      });
      nodeObjs.forEach((n, i) => {
        const p = pulse(t, 2.2, i * 0.7);
        n.glow.scale.setScalar(2.2 + p * 0.9);
        n.glow.material.opacity = 0.3 + p * 0.35;
      });
      pulses.forEach((s, i) => {
        const [a, b] = edgeList[i];
        const k = (t * 0.55 + i * 0.14) % 1;
        s.position.lerpVectors(b, a, k); // barglardan ildizga
        s.material.opacity = Math.sin(k * Math.PI) * 0.9;
      });
    }
  };
}

// ── 03. IL va metadata ──────────────────────────────────────────────────────
export function buildIl(meta) {
  const g = new THREE.Group();

  const container = panel(26, 17, 5, meta.color, { fill: 0.035, edgeOpacity: 0.35 });
  container.position.set(0, 1, 0);
  g.add(container);

  const asmTag = label('Program.dll  ·  PE / ECMA-335', { size: 26, color: '#7dd3fc' });
  asmTag.position.set(-6.4, 10.2, 2.6);
  g.add(asmTag);

  const il = [
    ['ldc.i4.s', '40'],
    ['ldc.i4.2', ''],
    ['add', ''],
    ['stloc.0', ''],
    ['ldstr', '"Javob: {0}"'],
    ['ldloc.0', ''],
    ['box', '[System]Int32'],
    ['call', 'WriteLine(string, object)'],
    ['ret', '']
  ];

  const cards = il.map(([op, arg], i) => {
    const rows = [[
      { text: op.padEnd(10), color: '#7dd3fc', weight: '600' },
      { text: arg, color: '#94a3b8' }
    ]];
    const card = textPlane(rows, {
      size: 28, height: 0.82, bg: 'rgba(12,22,40,0.88)',
      border: 'rgba(125,211,252,0.28)', padX: 18, padY: 11
    });
    card.position.set(-6.2, 7.4 - i * 1.35, 1.2);
    g.add(card);
    return card;
  });

  const ilTag = label('IL — stack mashinasi komandalari', { size: 24, color: '#94a3b8' });
  ilTag.position.set(-6.2, -6.2, 1.2);
  g.add(ilTag);

  // O'ng tomon: hisob steki
  const stackTag = label('hisob steki', { size: 24, color: '#94a3b8' });
  stackTag.position.set(7.4, 7.6, 1.2);
  g.add(stackTag);

  const slots = [];
  for (let i = 0; i < 4; i++) {
    const box = wireBox(4.4, 1.1, 1.1, meta.color2, 0.3);
    box.position.set(7.4, 1.2 + i * 1.35, 1.2);
    g.add(box);
    slots.push(box);
  }

  const stackItems = [];
  for (let i = 0; i < 3; i++) {
    const grp = new THREE.Group();
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1, 1),
      new THREE.MeshBasicMaterial({ color: meta.color2, transparent: true, opacity: 0.24, depthWrite: false })
    );
    grp.add(cube, wireBox(4.2, 1, 1, meta.color2, 0.75));
    const val = label(['40', '2', '42'][i], { size: 26, color: '#e0f2fe', font: '"JetBrains Mono", monospace' });
    val.position.set(0, 0, 0.7);
    grp.add(val);
    grp.position.set(7.4, 1.2, 1.2);
    g.add(grp);
    stackItems.push(grp);
  }

  const metaBox = panel(9.6, 3.6, 1.2, '#a78bfa', { fill: 0.07, edgeOpacity: 0.4 });
  metaBox.position.set(7.4, -4.4, 1.2);
  g.add(metaBox);
  const metaTxt = textPlane(
    [
      [{ text: 'metadata', color: '#c4b5fd', weight: '600' }],
      [{ text: 'turlar · metodlar · imzolar', color: '#8b95b5' }]
    ],
    { size: 26, height: 1.5, align: 'center' }
  );
  metaTxt.position.set(7.4, -4.4, 1.9);
  g.add(metaTxt);

  return {
    group: g,
    update(t) {
      const step = Math.floor(t * 1.1) % il.length;
      cards.forEach((c, i) => {
        const on = i === step;
        c.material.opacity = on ? 1 : 0.42;
        c.position.z = on ? 1.9 : 1.2;
        c.scale.setScalar(on ? 1.06 : 1);
      });
      slots.forEach((s, i) => { s.material.opacity = 0.16 + 0.1 * pulse(t, 1.4, i); });

      // 40 va 2 stekka tushadi, keyin ular 42 ga qo'shiladi
      const phase = (t * 1.1) % il.length;
      const show = (grp, visible, y, o) => {
        grp.visible = visible;
        grp.position.y = y;
        grp.children.forEach((ch) => { if (ch.material) ch.material.opacity = ch.type === 'Mesh' ? o * 0.28 : o; });
      };
      // ldc 40 → stekka; ldc 2 → ustiga; add → ikkovi yechilib, 42 qo'yiladi; stloc → bo'shaydi
      show(stackItems[0], phase >= 0.4 && phase < 2.4, 1.2 + (phase >= 1.4 ? 1.35 : 0), 1);
      show(stackItems[1], phase >= 1.4 && phase < 2.4, 1.2, 1);
      show(stackItems[2], phase >= 2.4 && phase < 3.5, 1.2, 1);
    }
  };
}

// ── 04. CLR va JIT ──────────────────────────────────────────────────────────
export function buildJit(meta) {
  const g = new THREE.Group();

  // Chapda IL, o'ngda mashina kodi, o'rtada JIT yadrosi
  const ilCards = ['ldc.i4.s 40', 'ldc.i4.2', 'add', 'stloc.0'].map((tx, i) => {
    const c = textPlane([tx], {
      size: 26, height: 0.78, bg: 'rgba(12,22,40,0.85)',
      border: 'rgba(125,211,252,0.3)', color: '#7dd3fc', padX: 16, padY: 10
    });
    c.position.set(-11.5, 3.4 - i * 1.3, 0);
    g.add(c);
    return c;
  });

  const core = new THREE.Group();
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.5, 1),
    new THREE.MeshBasicMaterial({ color: meta.color, transparent: true, opacity: 0.14, depthWrite: false })
  );
  const icoWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.5, 1)),
    lineMat(meta.color, 0.7)
  );
  core.add(ico, icoWire);
  const coreGlow = glowSprite(meta.color, 9);
  coreGlow.material.opacity = 0.22;
  core.add(coreGlow);
  core.position.set(0, 1.4, 0);
  g.add(core);

  const jitTag = label('RyuJIT', { size: 34, color: '#ffd7a8', weight: '700' });
  jitTag.position.set(0, -2, 0);
  g.add(jitTag);
  const jitSub = label('IL  →  shu protsessor uchun mashina kodi', { size: 23, color: '#94a3b8' });
  jitSub.position.set(0, -3, 0);
  g.add(jitSub);

  const asmCards = ['mov  ecx, 40', 'add  ecx, 2', 'mov  [rbp-4], ecx', 'call qword [rax+18h]'].map((tx, i) => {
    const c = textPlane([tx], {
      size: 26, height: 0.78, bg: 'rgba(38,22,8,0.85)',
      border: 'rgba(251,191,36,0.35)', color: '#fbbf24', padX: 16, padY: 10
    });
    c.position.set(11.5, 3.4 - i * 1.3, 0);
    g.add(c);
    return c;
  });

  // Oqim: IL yadroga kiradi, mashina kodi chiqadi
  const flowIn = ilCards.map((c, i) =>
    curveLine([
      new THREE.Vector3(-9.2, c.position.y, 0),
      new THREE.Vector3(-5, 1.4 + (c.position.y - 1.4) * 0.4, 1),
      new THREE.Vector3(-2.4, 1.4, 0)
    ], meta.color2, 0.22)
  );
  const flowOut = asmCards.map((c) =>
    curveLine([
      new THREE.Vector3(2.4, 1.4, 0),
      new THREE.Vector3(5, 1.4 + (c.position.y - 1.4) * 0.4, 1),
      new THREE.Vector3(9.2, c.position.y, 0)
    ], meta.color, 0.22)
  );
  [...flowIn, ...flowOut].forEach((l) => g.add(l));

  const travellers = [...flowIn, ...flowOut].map(() => {
    const s = glowSprite('#fff3d6', 0.6);
    g.add(s);
    return s;
  });
  const allFlows = [...flowIn, ...flowOut];

  // Tier ko'rsatkichi
  const tierBar = panel(9, 1.5, 0.6, meta.color2, { fill: 0.08, edgeOpacity: 0.4 });
  tierBar.position.set(0, -5, 0);
  g.add(tierBar);
  const tier0 = label('Tier 0 — tez ishga tushish', { size: 24, color: '#fdba74' });
  const tier1 = label('Tier 1 — to\'liq optimallashtirilgan', { size: 24, color: '#86efac' });
  tier0.position.set(0, -5, 0.5);
  tier1.position.set(0, -5, 0.5);
  g.add(tier0, tier1);

  // GC uyumi (heap) — pastda generatsiyalar
  const gens = [['Gen 0', 6, '#f87171'], ['Gen 1', 4, '#fbbf24'], ['Gen 2', 3, '#4ade80']];
  const gcCells = [];
  let gx = -10;
  gens.forEach(([name, n, col]) => {
    const tag = label(name, { size: 22, color: col });
    tag.position.set(gx + n * 0.55 - 0.55, -8.4, 0);
    g.add(tag);
    for (let i = 0; i < n; i++) {
      const cell = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.9, 0.4),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3, depthWrite: false })
      );
      cell.position.set(gx + i * 1.1, -9.6, 0);
      g.add(cell);
      gcCells.push({ cell, col });
      if (i === n - 1) gx += n * 1.1 + 2.4;
    }
  });
  const gcTag = label('GC — generatsion uyum: omon qolgan obyektlar keyingi avlodga ko\'chadi', { size: 22, color: '#94a3b8' });
  gcTag.position.set(0, -10.9, 0);
  g.add(gcTag);

  return {
    group: g,
    update(t) {
      core.rotation.y = t * 0.5;
      core.rotation.x = Math.sin(t * 0.3) * 0.25;
      coreGlow.material.opacity = 0.16 + 0.12 * pulse(t, 2.4);

      travellers.forEach((s, i) => {
        const curve = allFlows[i].userData.curve;
        const k = (t * 0.6 + i * 0.11) % 1;
        curve.getPoint(k, s.position);
        s.material.opacity = Math.sin(k * Math.PI) * 0.95;
      });

      const hot = (t * 0.25) % 2 > 1; // metod "qiziydi"
      tier0.material.opacity = hot ? 0.2 : 1;
      tier1.material.opacity = hot ? 1 : 0.2;
      tierBar.userData.fillMesh.material.color.set(hot ? 0x86efac : 0xfdba74);
      asmCards.forEach((c, i) => { c.material.opacity = hot ? 1 : 0.55 - i * 0.04; });
      ilCards.forEach((c, i) => { c.material.opacity = 0.55 + 0.4 * pulse(t, 1.6, i * 0.5); });

      gcCells.forEach(({ cell }, i) => {
        const alive = pulse(t, 0.9, i * 1.3) > 0.45;
        cell.material.opacity = alive ? 0.42 : 0.08;
      });
    }
  };
}
