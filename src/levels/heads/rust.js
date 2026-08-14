// Rust boshi: manba kod va makroslar → MIR va borrow checker → LLVM va AOT.
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  orb, glowSprite, lineMat, pulse, clamp, lerp
} from '../../lib/gfx.js';
import { PAL, codePanel, cardColumn, flowArrow, stageBox } from './common.js';

// ── Manba kod va makroslar ──────────────────────────────────────────────────
export function buildRsSource(meta) {
  const g = new THREE.Group();

  codePanel(g, [
    [{ text: 'fn ', color: PAL.key }, { text: 'main', color: PAL.fn }, { text: '() {', color: PAL.dim }],
    [{ text: '    let ', color: PAL.key }, { text: 's', color: PAL.id }, { text: ' = ', color: PAL.dim },
     { text: 'String::from', color: PAL.type }, { text: '(', color: PAL.dim }, { text: '"Salom"', color: PAL.str }, { text: ');', color: PAL.dim }],
    [{ text: '    let ', color: PAL.key }, { text: 't', color: PAL.id }, { text: ' = s;', color: PAL.dim },
     { text: '            // egalik ko\'chdi', color: PAL.cm }],
    [{ text: '    println!', color: PAL.fn }, { text: '(', color: PAL.dim }, { text: '"{t}"', color: PAL.str }, { text: ');', color: PAL.dim }],
    [{ text: '}', color: PAL.dim }]
  ], { x: -6.4, y: 4.6, height: 5.4, file: 'main.rs', accent: '#fb923c' });

  // Makros yoyilishi
  const expanded = textPlane(
    [
      [{ text: 'println!("{t}")', color: '#fdba74', weight: '600' }],
      [{ text: '↓  kompilyatordan oldin yoyiladi', color: '#64748b' }],
      [{ text: 'Stdout::lock().write_fmt(', color: '#93c5fd' }],
      [{ text: '  format_args!("{}", t))', color: '#93c5fd' }]
    ],
    { size: 23, height: 3.2, bg: 'rgba(28,16,6,0.85)', border: 'rgba(251,146,60,0.3)', padX: 20, padY: 14, align: 'center' }
  );
  expanded.position.set(9, 4.2, 0);
  g.add(expanded);

  // Egalik: bitta qiymat, bitta ega
  const ownTag = label('har bir qiymatning bitta egasi bor', { size: 24, color: '#cbd5e1' });
  ownTag.position.set(0, -2.2, 0);
  g.add(ownTag);

  const value = panel(4.4, 2, 0.8, '#fbbf24', { fill: 0.14, edgeOpacity: 0.7 });
  value.position.set(0, -4.4, 0);
  g.add(value);
  const valTxt = label('String "Salom"', { size: 21, color: '#fde68a' });
  valTxt.position.set(0, -4.4, 0.5);
  g.add(valTxt);

  const ownerA = panel(2.4, 1.4, 0.6, '#34d399', { fill: 0.1, edgeOpacity: 0.6 });
  ownerA.position.set(-6.4, -4.4, 0);
  g.add(ownerA);
  const aTxt = label('s', { size: 26, color: '#6ee7b7', font: '"JetBrains Mono", monospace' });
  aTxt.position.set(-6.4, -4.4, 0.4);
  g.add(aTxt);

  const ownerB = panel(2.4, 1.4, 0.6, '#34d399', { fill: 0.1, edgeOpacity: 0.6 });
  ownerB.position.set(6.4, -4.4, 0);
  g.add(ownerB);
  const bTxt = label('t', { size: 26, color: '#6ee7b7', font: '"JetBrains Mono", monospace' });
  bTxt.position.set(6.4, -4.4, 0.4);
  g.add(bTxt);

  const linkA = segments([new THREE.Vector3(-5.2, -4.4, 0), new THREE.Vector3(-2.2, -4.4, 0)], '#34d399', 0.7);
  const linkB = segments([new THREE.Vector3(2.2, -4.4, 0), new THREE.Vector3(5.2, -4.4, 0)], '#34d399', 0.7);
  g.add(linkA, linkB);

  const dead = label('endi ishlatib bo\'lmaydi', { size: 19, color: '#f87171' });
  dead.position.set(-6.4, -5.8, 0);
  g.add(dead);

  const note = textPlane(
    [[{ text: 'Bu yerda hali GC ham, ish vaqti ham yo\'q — va oxirigacha paydo bo\'lmaydi.', color: '#94a3b8' }]],
    { size: 24, height: 0.8, align: 'center' }
  );
  note.position.set(0, -8, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      const moved = (t * 0.4) % 1 > 0.45;
      linkA.material.opacity = moved ? 0.12 : 0.8;
      linkB.material.opacity = moved ? 0.8 : 0.12;
      ownerA.userData.fillMesh.material.opacity = moved ? 0.03 : 0.16;
      ownerB.userData.fillMesh.material.opacity = moved ? 0.16 : 0.03;
      aTxt.material.opacity = moved ? 0.3 : 1;
      bTxt.material.opacity = moved ? 1 : 0.3;
      dead.material.opacity = moved ? 0.85 : 0;
      expanded.material.opacity = 0.6 + 0.4 * pulse(t, 1.1);
    }
  };
}

// ── MIR va borrow checker ───────────────────────────────────────────────────
export function buildRsBorrow(meta) {
  const g = new THREE.Group();

  // Chapda: MIR boshqaruv oqimi grafi
  const mirTag = label('MIR — boshqaruv oqimi grafi', { size: 23, color: '#cbd5e1' });
  mirTag.position.set(-9.4, 7.6, 0);
  g.add(mirTag);

  const blocks = [
    ['bb0', 's = String::from(…)', -9.4, 5.4],
    ['bb1', '_2 = move s', -12.4, 2.2],
    ['bb2', 'drop(_2)', -6.4, 2.2],
    ['bb3', 'return', -9.4, -1]
  ];
  const blockObjs = blocks.map(([name, code, x, y]) => {
    const b = textPlane(
      [
        [{ text: name, color: '#f9a8d4', weight: '600' }],
        [{ text: code, color: '#94a3b8' }]
      ],
      { size: 21, height: 1.25, bg: 'rgba(20,10,20,0.88)', border: 'rgba(244,114,182,0.3)', padX: 14, padY: 9 }
    );
    b.position.set(x, y, 0);
    g.add(b);
    return b;
  });
  g.add(segments([
    new THREE.Vector3(-9.4, 4.7, 0), new THREE.Vector3(-12.4, 2.9, 0),
    new THREE.Vector3(-9.4, 4.7, 0), new THREE.Vector3(-6.4, 2.9, 0),
    new THREE.Vector3(-12.4, 1.5, 0), new THREE.Vector3(-9.4, -0.3, 0),
    new THREE.Vector3(-6.4, 1.5, 0), new THREE.Vector3(-9.4, -0.3, 0)
  ], '#f472b6', 0.4));

  // O'ngda: qoidalar
  const ruleTag = label('borrow checker qoidasi', { size: 24, color: '#cbd5e1' });
  ruleTag.position.set(6, 7.6, 0);
  g.add(ruleTag);

  const okBox = stageBox(g, { x: 6, y: 4.4, w: 14, h: 3.4, color: '#34d399', fill: 0.08 });
  const okTxt = textPlane(
    [
      [{ text: '&x   &x   &x', color: '#6ee7b7', weight: '600' }, { text: '        ko\'p o\'qish — mumkin', color: '#64748b' }],
      [{ text: '&mut x', color: '#6ee7b7', weight: '600' }, { text: '              bitta yozish — mumkin', color: '#64748b' }]
    ],
    { size: 22, height: 1.5, align: 'left' }
  );
  okTxt.position.set(6, 4.4, 0.5);
  g.add(okTxt);

  const badBox = stageBox(g, { x: 6, y: 0.4, w: 14, h: 2.4, color: '#f87171', fill: 0.08 });
  const badTxt = textPlane(
    [[{ text: '&x  +  &mut x', color: '#fca5a5', weight: '600' }, { text: '     ikkovi birga — mumkin emas', color: '#64748b' }]],
    { size: 22, height: 0.75, align: 'left' }
  );
  badTxt.position.set(6, 0.4, 0.5);
  g.add(badTxt);

  const errTxt = textPlane(
    [[{ text: 'error[E0502]: cannot borrow `x` as mutable', color: '#fca5a5' }]],
    { size: 21, height: 0.7, bg: 'rgba(30,8,8,0.9)', border: 'rgba(248,113,113,0.35)', padX: 14, padY: 9 }
  );
  errTxt.position.set(6, -2.4, 0.4);
  g.add(errTxt);

  // Pastda: bu qatlam mashina kodi chiqarmaydi
  const zero = panel(15, 3.2, 1, '#a78bfa', { fill: 0.09, edgeOpacity: 0.55 });
  zero.position.set(-1, -6.6, 0);
  g.add(zero);
  const zeroTxt = textPlane(
    [
      [{ text: 'bu qatlamning natijadagi hajmi:  ', color: '#c4b5fd' }, { text: '0 bayt', color: '#ffffff', weight: '700' }],
      [{ text: 'lifetime\'lar tekshiruvdan keyin butunlay o\'chiriladi', color: '#64748b' }]
    ],
    { size: 23, height: 1.6, align: 'center' }
  );
  zeroTxt.position.set(-1, -6.6, 0.6);
  g.add(zeroTxt);

  const note = textPlane(
    [[{ text: 'U pastdagi qatlamlarga hech narsa qo\'shmaydi — faqat noto\'g\'ri dasturlarni pastga tushirmaydi.', color: '#e9d5ff', weight: '600' }]],
    { size: 24, height: 0.82, align: 'center' }
  );
  note.position.set(0, -9.6, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      const step = Math.floor(t * 0.8) % blockObjs.length;
      blockObjs.forEach((b, i) => {
        b.material.opacity = i === step ? 1 : 0.45;
        b.position.z = i === step ? 0.6 : 0;
      });
      const bad = (t * 0.35) % 1 > 0.55;
      badBox.userData.fillMesh.material.opacity = bad ? 0.2 : 0.04;
      errTxt.material.opacity = bad ? 1 : 0.15;
      okBox.userData.fillMesh.material.opacity = bad ? 0.04 : 0.16;
      zero.userData.fillMesh.material.opacity = 0.06 + 0.1 * pulse(t, 1.1);
      note.material.opacity = 0.7 + 0.3 * pulse(t, 0.9);
    }
  };
}

// ── LLVM va AOT ─────────────────────────────────────────────────────────────
export function buildRsCodegen(meta) {
  const g = new THREE.Group();

  const stages = [
    ['MIR', ['_2 = move _1', 'drop(_2)'], -11, '#f472b6'],
    ['LLVM IR', ['%2 = call @from(i8* %1)', 'call void @drop(%2)'], -1.4, '#a78bfa'],
    ['x86-64', ['48 89 C8', 'E8 3C 00 00 00'], 8.6, '#fbbf24']
  ];
  const stageObjs = stages.map(([name, lines, x, col]) => {
    const tag = label(name, { size: 24, color: col, weight: '600' });
    tag.position.set(x, 6.6, 0);
    g.add(tag);
    const card = textPlane(
      lines.map((l) => [{ text: l, color: col }]),
      { size: 22, height: 1.5, bg: 'rgba(9,14,28,0.88)', border: `${col}44`, padX: 16, padY: 11 }
    );
    card.position.set(x, 5, 0);
    g.add(card);
    return card;
  });

  flowArrow(g, -7.4, -5.2, 5, 'optimizatsiya');
  flowArrow(g, 3.2, 5.4, 5, 'kodgeneratsiya');

  // Monomorfizatsiya
  const monoTag = label('monomorfizatsiya — generik har bir tur uchun nusxalanadi', { size: 23, color: '#cbd5e1' });
  monoTag.position.set(0, 2.4, 0);
  g.add(monoTag);

  const generic = textPlane(
    [[{ text: 'fn max<T: Ord>(a: T, b: T) -> T', color: '#7dd3fc', weight: '600' }]],
    { size: 23, height: 0.75, bg: 'rgba(9,20,32,0.88)', border: 'rgba(125,211,252,0.35)', padX: 16, padY: 10 }
  );
  generic.position.set(-8.6, 0.4, 0);
  g.add(generic);

  const copies = ['max_i32', 'max_f64', 'max_String'].map((name, i) => {
    const c = textPlane([[{ text: name, color: '#86efac' }]], {
      size: 22, height: 0.72, bg: 'rgba(6,22,14,0.88)', border: 'rgba(134,239,172,0.3)', padX: 14, padY: 9
    });
    c.position.set(6.4, 1.8 - i * 1.35, 0);
    g.add(c);
    return c;
  });
  const fans = copies.map((c, i) =>
    curveLine([
      new THREE.Vector3(-5.4, 0.4, 0),
      new THREE.Vector3(0, 0.4 + (c.position.y - 0.4) * 0.5, 0.6),
      new THREE.Vector3(3.4, c.position.y, 0)
    ], '#5eead4', 0.3)
  );
  fans.forEach((f) => g.add(f));
  const fanDots = fans.map(() => {
    const s = glowSprite('#a7f3d0', 0.5);
    g.add(s);
    return s;
  });

  // Pastda: JIT bilan solishtirish
  const cmp = [
    ['JIT (C#, JS)', 'ish vaqtida kompilyatsiya · qizish davri bor · protsessorni biladi', '#fdba74'],
    ['AOT (Rust, Go, C)', 'oldindan kompilyatsiya · qizish yo\'q · protsessorni bilmaydi', '#86efac']
  ].map(([name, desc, col], i) => {
    const m = textPlane(
      [
        [{ text: name, color: col, weight: '600' }],
        [{ text: desc, color: '#64748b' }]
      ],
      { size: 22, height: 1.5, align: 'center' }
    );
    m.position.set(-7 + i * 14, -4.4, 0);
    g.add(m);
    return m;
  });

  const note = textPlane(
    [[{ text: 'Shu yerdan pastda Rust bilan C# ning yo\'llari qo\'shiladi — ikkovi ham bir xil baytlarga aylandi.', color: '#cbd5e1' }]],
    { size: 24, height: 0.82, align: 'center' }
  );
  note.position.set(0, -7, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      const step = Math.floor(t * 0.7) % 3;
      stageObjs.forEach((c, i) => {
        c.material.opacity = i === step ? 1 : 0.5;
        c.scale.setScalar(i === step ? 1.05 : 1);
      });
      fanDots.forEach((s, i) => {
        const k = (t * 0.55 + i * 0.22) % 1;
        fans[i].userData.curve.getPoint(k, s.position);
        s.material.opacity = Math.sin(k * Math.PI) * 0.9;
      });
      copies.forEach((c, i) => {
        c.material.opacity = 0.5 + 0.5 * pulse(t, 1.6, i * 0.8);
      });
      cmp.forEach((m, i) => { m.material.opacity = 0.55 + 0.45 * pulse(t, 0.8, i * Math.PI); });
    }
  };
}
