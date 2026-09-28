// Tarix yo'nalishining 3D sahnalari: al-Xorazmiydan bugungi tillargacha.
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  orb, glowSprite, lineMat, points, pulse, clamp, lerp
} from '../../lib/gfx.js';
import { PAL, cardColumn, flowArrow, stageBox } from './common.js';

// ── Umumiy yordamchilar ─────────────────────────────────────────────────────

/** Gorizontal vaqt o'qi: belgilangan yillar bilan. */
function timeline(g, marks, { y = 0, x0 = -13, x1 = 13, color = '#475569' } = {}) {
  g.add(segments([new THREE.Vector3(x0, y, 0), new THREE.Vector3(x1, y, 0)], color, 0.6));
  return marks.map(([year, text, k, col]) => {
    const x = lerp(x0, x1, k);
    g.add(segments([new THREE.Vector3(x, y - 0.35, 0), new THREE.Vector3(x, y + 0.35, 0)], col, 0.8));
    const yr = label(year, { size: 21, color: col, weight: '600' });
    yr.position.set(x, y + 1, 0);
    g.add(yr);
    const tx = label(text, { size: 19, color: '#94a3b8' });
    tx.position.set(x, y - 1.05, 0);
    g.add(tx);
    const dot = orb(0.22, col, 1);
    dot.position.set(x, y, 0.2);
    g.add(dot);
    return dot;
  });
}

/** Tishli g'ildirak — mexanik davr uchun. */
function gear(g, x, y, r, color, teeth = 12) {
  const grp = new THREE.Group();
  const ring = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2).getPoints(48)
        .map((p) => new THREE.Vector3(p.x, p.y, 0))
    ),
    lineMat(color, 0.7)
  );
  grp.add(ring);
  const spokes = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    spokes.push(
      new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0),
      new THREE.Vector3(Math.cos(a) * (r + 0.28), Math.sin(a) * (r + 0.28), 0)
    );
  }
  grp.add(segments(spokes, color, 0.8));
  grp.position.set(x, y, 0);
  g.add(grp);
  return grp;
}

// ── 01. Al-Xorazmiy ─────────────────────────────────────────────────────────
export function buildKhwarizmi(meta) {
  const g = new THREE.Group();

  // Kitob
  const book = textPlane(
    [
      [{ text: 'الكتاب المختصر في حساب الجبر والمقابلة', color: '#fde68a' }],
      [{ text: 'Al-kitob al-muxtasar fi hisob al-jabr va-l-muqobala', color: '#94a3b8' }],
      [{ text: '~820 · Bag\'dod, Bayt ul-hikma', color: '#64748b' }]
    ],
    { size: 26, height: 2.9, bg: 'rgba(28,20,6,0.9)', border: 'rgba(251,191,36,0.35)', padX: 30, padY: 18, align: 'center' }
  );
  book.position.set(0, 6.4, 0);
  g.add(book);

  // So'z zanjirlari
  const chain = (rows, x, y) => {
    const objs = rows.map(([txt, col], i) => {
      const m = textPlane([[{ text: txt, color: col, weight: i === rows.length - 1 ? '700' : '400' }]], {
        size: 27, height: 0.82, bg: 'rgba(9,14,28,0.86)', border: `${col}33`, padX: 18, padY: 11
      });
      m.position.set(x, y - i * 1.5, 0);
      g.add(m);
      return m;
    });
    for (let i = 0; i < rows.length - 1; i++) {
      g.add(segments([
        new THREE.Vector3(x, y - i * 1.5 - 0.45, 0),
        new THREE.Vector3(x, y - (i + 1) * 1.5 + 0.45, 0)
      ], '#475569', 0.5));
    }
    return objs;
  };

  const c1 = chain([
    ['al-jabr', '#fcd34d'],
    ['algebra (lot.)', '#fdba74'],
    ['ALGEBRA', '#ffffff']
  ], -6.4, 2.4);

  const c2 = chain([
    ['al-Xorazmiy', '#fcd34d'],
    ['Algoritmi (lot.)', '#fdba74'],
    ['ALGORITM', '#ffffff']
  ], 6.4, 2.4);

  const chainTag = label('ikkita so\'z shu kitobdan chiqqan', { size: 22, color: '#cbd5e1' });
  chainTag.position.set(0, 3.8, 0);
  g.add(chainTag);

  // Xorazm → Bag'dod
  const route = curveLine([
    new THREE.Vector3(-8.6, -3.6, 0),
    new THREE.Vector3(-4, -2.8, 0.6),
    new THREE.Vector3(0.6, -3.6, 0)
  ], '#fbbf24', 0.35, 40);
  g.add(route);
  [['Xorazm', -8.6], ['Bag\'dod', 0.6]].forEach(([name, x]) => {
    const o = orb(0.24, '#fbbf24', 1);
    o.position.set(x, -3.6, 0);
    g.add(o);
    const l = label(name, { size: 20, color: '#fcd34d' });
    l.position.set(x, -4.3, 0);
    g.add(l);
  });
  const routeDot = glowSprite('#fef3c7', 0.6);
  g.add(routeDot);

  // Hind raqamlari
  const nums = label('0  1  2  3  4  5  6  7  8  9', { size: 30, color: '#fde68a', font: '"JetBrains Mono", monospace' });
  nums.position.set(7.4, -3.4, 0);
  g.add(nums);
  const numTag = textPlane(
    [[{ text: 'u yana hind raqamlari va pozitsion sanoq', color: '#64748b' }],
     [{ text: 'haqida yozgan — o\'nlik sanoq Yevropaga shu orqali kirgan', color: '#94a3b8' }]],
    { size: 20, height: 1.4, align: 'center' }
  );
  numTag.position.set(7.4, -4.8, 0);
  g.add(numTag);

  const note = textPlane(
    [[{ text: 'Algoritmni u ixtiro qilmagan — Yevklidda ham usullar bor edi. U bergani: usulni umumlashtirish va yozib qoldirish uslubi.', color: '#94a3b8' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  note.position.set(0, -7.2, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      const k = (t * 0.28) % 1;
      route.userData.curve.getPoint(k, routeDot.position);
      routeDot.material.opacity = Math.sin(k * Math.PI) * 0.95;
      [c1, c2].forEach((ch, j) => {
        const step = Math.floor(t * 0.9 + j * 0.4) % 3;
        ch.forEach((m, i) => { m.material.opacity = i <= step ? 1 : 0.28; });
      });
      book.material.opacity = 0.75 + 0.25 * pulse(t, 0.8);
    }
  };
}

// ── 02. Jakkar dastgohi ─────────────────────────────────────────────────────
export function buildJacquard(meta) {
  const g = new THREE.Group();

  // Perfokartalar
  const CARD_C = 8, CARD_R = 10, CS = 0.52;
  const holes = [];
  const pattern = (r, c) => ((r * 3 + c * 5) % 7 < 3);
  for (let r = 0; r < CARD_R; r++) {
    for (let c = 0; c < CARD_C; c++) {
      const punched = pattern(r, c);
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(CS * 0.3, 10),
        new THREE.MeshBasicMaterial({
          color: punched ? 0x05070f : 0xfb923c,
          transparent: true, opacity: punched ? 0.95 : 0.3, depthWrite: false
        })
      );
      m.position.set(-9.4 + (c - (CARD_C - 1) / 2) * CS, 4.4 - r * CS, 0.1);
      g.add(m);
      holes.push({ m, punched, r });
    }
  }
  const cardFrame = wireBox(CARD_C * CS + 0.6, CARD_R * CS + 0.6, 0.001, '#fb923c', 0.6);
  cardFrame.position.set(-9.4, 4.4 - (CARD_R - 1) * CS / 2, 0);
  g.add(cardFrame);
  const cardTag = label('perfokarta', { size: 22, color: '#fdba74' });
  cardTag.position.set(-9.4, 5.6, 0);
  g.add(cardTag);
  const holeTag = label('teshik = ip ko\'tariladi', { size: 19, color: '#64748b' });
  holeTag.position.set(-9.4, -1.6, 0);
  g.add(holeTag);

  flowArrow(g, -6.4, -4, 2, 'dastgoh o\'qiydi');

  // To'qilgan naqsh
  const TH = 16, TV = 12, TS = 0.5;
  const threads = [];
  for (let r = 0; r < TV; r++) {
    for (let c = 0; c < TH; c++) {
      const up = ((r * 3 + c * 5) % 7 < 3);
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(TS * 0.82, TS * 0.82),
        new THREE.MeshBasicMaterial({
          color: up ? 0xfbbf24 : 0x1e3a5f, transparent: true,
          opacity: up ? 0.75 : 0.35, depthWrite: false
        })
      );
      m.position.set(-1 + (c - (TH - 1) / 2) * TS, 4.4 - r * TS, 0);
      g.add(m);
      threads.push({ m, up, r });
    }
  }
  const woven = label('naqsh', { size: 22, color: '#fcd34d' });
  woven.position.set(-1, 5.6, 0);
  g.add(woven);

  // Asosiy fikr
  const idea = stageBox(g, { x: 9.6, y: 3.4, w: 11.4, h: 5, color: '#fbbf24', fill: 0.07 });
  const ideaTxt = textPlane(
    [
      [{ text: 'yangi naqsh kerakmi?', color: '#fcd34d', weight: '600' }],
      [{ text: 'dastgohni qayta qurmaysiz —', color: '#94a3b8' }],
      [{ text: 'kartalarni almashtirasiz', color: '#ffffff', weight: '600' }],
      [{ text: 'apparat va dastur ajraldi', color: '#64748b' }]
    ],
    { size: 22, height: 3, align: 'center' }
  );
  ideaTxt.position.set(9.6, 3.4, 0.5);
  g.add(ideaTxt);

  // Perfokartaning umri
  timeline(g, [
    ['1804', 'Jakkar', 0, '#fb923c'],
    ['1890', 'Xollerit · aholi ro\'yxati', 0.35, '#fbbf24'],
    ['1950-60', 'IBM · dasturlar', 0.7, '#fcd34d'],
    ['~1975', 'oxirgi yillari', 1, '#64748b']
  ], { y: -4.4, x0: -11, x1: 11 });

  const note = textPlane(
    [[{ text: 'Bugungi .pyc fayl ham, o\'sha karta ham bitta narsa: mashinadan ajralgan ko\'rsatmalar to\'plami.', color: '#cbd5e1' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  note.position.set(0, -7.4, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      const row = Math.floor(t * 2.2) % CARD_R;
      holes.forEach(({ m, punched, r }) => {
        const on = r === row;
        m.material.opacity = punched ? (on ? 1 : 0.9) : (on ? 0.75 : 0.28);
      });
      threads.forEach(({ m, up, r }) => {
        const on = r === row % TV;
        m.material.opacity = up ? (on ? 1 : 0.6) : (on ? 0.5 : 0.28);
      });
      idea.userData.fillMesh.material.opacity = 0.05 + 0.08 * pulse(t, 1.1);
    }
  };
}

// ── 03. Ada Lavleys ─────────────────────────────────────────────────────────
export function buildLovelace(meta) {
  const g = new THREE.Group();

  // Analitik mashina — g'ildiraklar
  const gears = [
    gear(g, -9.4, 4.4, 2.2, '#fb7185', 16),
    gear(g, -5.6, 3, 1.5, '#fbbf24', 12),
    gear(g, -9.4, 0.6, 1.2, '#fb7185', 10)
  ];
  const engineTag = textPlane(
    [[{ text: 'Analitik mashina', color: '#fda4af', weight: '600' }],
     [{ text: 'hech qachon qurilmagan', color: '#64748b' }]],
    { size: 22, height: 1.5, align: 'center' }
  );
  engineTag.position.set(-8, 7.2, 0);
  g.add(engineTag);

  const parts = [['store — xotira', -9.4, -1.8], ['mill — hisoblash bloki', -9.4, -2.8]];
  parts.forEach(([txt, x, y]) => {
    const l = label(txt, { size: 19, color: '#94a3b8' });
    l.position.set(x, y, 0);
    g.add(l);
  });

  // Note G
  const noteG = cardColumn(g, [
    ['v1 = v2 + v3', 'operatsiya 1'],
    ['v4 = v1 × v5', 'operatsiya 2'],
    ['if v6 > 0 → 3', 'shartli o\'tish'],
    ['v7 = v7 − 1', 'sikl hisoblagichi'],
    ['→ qayta boshla', 'takrorlash']
  ], { x: 2.6, yTop: 5, gap: 1.25, width: 20, accent: '#fda4af' });

  const ngTag = textPlane(
    [[{ text: 'Note G — Bernulli sonlari', color: '#fda4af', weight: '600' }],
     [{ text: 'mashina uchun nashr etilgan birinchi algoritm · 1843', color: '#64748b' }]],
    { size: 21, height: 1.5, align: 'center' }
  );
  ngTag.position.set(2.6, 6.6, 0);
  g.add(ngTag);

  const hasLoop = label('o\'zgaruvchi · sikl · shart — hammasi bor', { size: 20, color: '#94a3b8' });
  hasLoop.position.set(2.6, -2, 0);
  g.add(hasLoop);

  // Asl hissa
  const insight = stageBox(g, { x: 11.4, y: 2.6, w: 10.6, h: 6, color: '#c084fc', fill: 0.08 });
  const insightTxt = textPlane(
    [
      [{ text: 'Lavleysning asl hissasi', color: '#d8b4fe', weight: '600' }],
      [{ text: '', color: '#000' }],
      [{ text: 'mashina faqat son emas,', color: '#94a3b8' }],
      [{ text: 'har qanday simvol bilan', color: '#ffffff', weight: '600' }],
      [{ text: 'ishlay oladi — hatto', color: '#94a3b8' }],
      [{ text: 'musiqa yoza oladi', color: '#ffffff', weight: '600' }]
    ],
    { size: 21, height: 4, align: 'center' }
  );
  insightTxt.position.set(11.4, 2.6, 0.5);
  g.add(insightTxt);

  const fair = textPlane(
    [[{ text: 'Halollik uchun: Bebbij ham undan oldin dastur eskizlarini yozgan va "birinchi dasturchi kim" degan bahs hali ham bor.', color: '#94a3b8' }]],
    { size: 22, height: 0.78, align: 'center' }
  );
  fair.position.set(0, -5.4, 0);
  g.add(fair);

  const seed = textPlane(
    [[{ text: 'Shu fikr bugungi hamma narsaning urug\'i: kompyuter son emas, ma\'no biriktirilgan belgi bilan ishlaydi.', color: '#e9d5ff', weight: '600' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  seed.position.set(0, -7, 0);
  g.add(seed);

  return {
    group: g,
    update(t) {
      gears[0].rotation.z = t * 0.5;
      gears[1].rotation.z = -t * 0.73;
      gears[2].rotation.z = t * 0.91;
      const step = Math.floor(t * 1.1) % noteG.length;
      noteG.forEach((c, i) => { c.material.opacity = i === step ? 1 : 0.45; });
      insight.userData.fillMesh.material.opacity = 0.06 + 0.09 * pulse(t, 0.9);
      seed.material.opacity = 0.65 + 0.35 * pulse(t, 0.8);
    }
  };
}

// ── 04. Turing va Cherch ────────────────────────────────────────────────────
export function buildTuring(meta) {
  const g = new THREE.Group();

  // Turing mashinasi: lenta
  const CELLS = 11, CW = 1.3;
  const tape = [];
  const symbols = ['1', '0', '1', '1', '0', '1', '0', '0', '1', '0', '1'];
  for (let i = 0; i < CELLS; i++) {
    const x = -10.4 + (i - (CELLS - 1) / 2) * CW;
    const box = wireBox(CW * 0.9, 1.3, 0.001, '#a78bfa', 0.5);
    box.position.set(x, 4.4, 0);
    g.add(box);
    const s = label(symbols[i], { size: 26, color: '#ddd6fe', font: '"JetBrains Mono", monospace' });
    s.position.set(x, 4.4, 0.2);
    g.add(s);
    tape.push({ box, s, x });
  }
  const head = new THREE.Group();
  const hm = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 1.5),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.2, depthWrite: false })
  );
  head.add(hm, wireBox(1.1, 1.5, 0.001, '#fbbf24', 0.9));
  head.position.set(-10.4, 4.4, 0.3);
  g.add(head);
  const headTag = label('o\'qish-yozish boshi', { size: 19, color: '#fcd34d' });
  headTag.position.set(-10.4, 2.9, 0);
  g.add(headTag);

  const tmTag = textPlane(
    [[{ text: 'Turing mashinasi', color: '#c4b5fd', weight: '600' }],
     [{ text: 'cheksiz lenta + qoidalar jadvali', color: '#64748b' }]],
    { size: 22, height: 1.5, align: 'center' }
  );
  tmTag.position.set(-10.4, 6.6, 0);
  g.add(tmTag);

  // Lambda hisobi
  const lam = textPlane(
    [
      [{ text: 'λf.λx. f (f x)', color: '#7dd3fc', weight: '600' }],
      [{ text: '', color: '#000' }],
      [{ text: 'faqat funksiyalar —', color: '#94a3b8' }],
      [{ text: 'lenta ham, holat ham yo\'q', color: '#94a3b8' }]
    ],
    { size: 24, height: 3, bg: 'rgba(6,18,30,0.88)', border: 'rgba(125,211,252,0.35)', padX: 24, padY: 16, align: 'center' }
  );
  lam.position.set(10, 4.4, 0);
  g.add(lam);
  const lamTag = textPlane(
    [[{ text: 'Lambda hisobi', color: '#7dd3fc', weight: '600' }],
     [{ text: 'Alonzo Cherch · 1936', color: '#64748b' }]],
    { size: 22, height: 1.5, align: 'center' }
  );
  lamTag.position.set(10, 6.8, 0);
  g.add(lamTag);

  // Tenglik
  const eq = label('aynan bir xil kuchga ega', { size: 24, color: '#ffffff', weight: '600' });
  eq.position.set(0, 4.4, 0);
  g.add(eq);
  g.add(segments([
    new THREE.Vector3(-4.6, 4.75, 0), new THREE.Vector3(4.6, 4.75, 0),
    new THREE.Vector3(-4.6, 4.05, 0), new THREE.Vector3(4.6, 4.05, 0)
  ], '#64748b', 0.4));

  // Ikki oila
  const families = [
    ['imperativ tillar', 'o\'zgaruvchi · holat · ketma-ketlik', 'C · Java · C# · Go', -7, '#c4b5fd'],
    ['funksional tillar', 'funksiya · o\'zgarmas qiymat', 'Lisp · ML · Haskell', 7, '#7dd3fc']
  ].map(([name, desc, langs, x, col]) => {
    const box = stageBox(g, { x, y: -1.4, w: 12.4, h: 4.2, color: col, fill: 0.07 });
    const txt = textPlane(
      [
        [{ text: name, color: col, weight: '600' }],
        [{ text: desc, color: '#64748b' }],
        [{ text: langs, color: '#94a3b8' }]
      ],
      { size: 21, height: 2.4, align: 'center' }
    );
    txt.position.set(x, -1.4, 0.5);
    g.add(txt);
    return box;
  });
  g.add(segments([
    new THREE.Vector3(-10.4, 2.4, 0), new THREE.Vector3(-7, 0.8, 0),
    new THREE.Vector3(10, 2.4, 0), new THREE.Vector3(7, 0.8, 0)
  ], '#475569', 0.5));

  const halting = textPlane(
    [[{ text: 'Va yana bir natija: hamma masala ham hisoblanmaydi. To\'xtash muammosining umumiy yechimi yo\'q —', color: '#94a3b8' }],
     [{ text: 'bu chegara texnologiyaga emas, matematikaga tegishli.', color: '#fca5a5' }]],
    { size: 22, height: 1.6, align: 'center' }
  );
  halting.position.set(0, -5.8, 0);
  g.add(halting);

  return {
    group: g,
    update(t) {
      const i = Math.floor(t * 1.6) % CELLS;
      head.position.x = lerp(head.position.x, tape[i].x, 0.18);
      hm.material.opacity = 0.15 + 0.15 * pulse(t, 5);
      tape.forEach(({ box, s }, k) => {
        box.material.opacity = k === i ? 0.9 : 0.35;
        s.material.opacity = k === i ? 1 : 0.5;
      });
      families.forEach((b, k) => {
        b.userData.fillMesh.material.opacity = 0.05 + 0.08 * pulse(t, 1, k * Math.PI);
      });
      lam.material.opacity = 0.7 + 0.3 * pulse(t, 1.2);
    }
  };
}

// ── 05. ENIAC va saqlangan dastur ───────────────────────────────────────────
export function buildEniac(meta) {
  const g = new THREE.Group();

  // Ulash paneli
  const SOCK = 7;
  const socks = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < SOCK; c++) {
      const o = orb(0.16, '#64748b', 0.8);
      o.position.set(-10.4 + (c - (SOCK - 1) / 2) * 1.1, 5.4 - r * 1.1, 0);
      g.add(o);
      socks.push(o);
    }
  }
  const panelFrame = wireBox(SOCK * 1.1 + 0.8, 5 * 1.1 + 0.8, 0.001, '#38bdf8', 0.45);
  panelFrame.position.set(-10.4, 5.4 - 2 * 1.1, 0);
  g.add(panelFrame);

  const cables = [[0, 12], [3, 22], [8, 17], [15, 30], [6, 27]].map(([a, b]) => {
    const pa = socks[a].position, pb = socks[b].position;
    const l = curveLine([
      pa.clone(),
      new THREE.Vector3((pa.x + pb.x) / 2 + 1.2, (pa.y + pb.y) / 2, 1.4),
      pb.clone()
    ], '#fbbf24', 0.5, 30);
    g.add(l);
    return l;
  });

  const eniacTag = textPlane(
    [[{ text: 'ENIAC · 1945', color: '#7dd3fc', weight: '600' }],
     [{ text: 'dasturlash = kabellarni ulash va kalitlarni burash', color: '#64748b' }]],
    { size: 21, height: 1.5, align: 'center' }
  );
  eniacTag.position.set(-10.4, 7.4, 0);
  g.add(eniacTag);
  const slow = label('bitta masaladan boshqasiga — kunlar, ba\'zan haftalar', { size: 19, color: '#fca5a5' });
  slow.position.set(-10.4, -1.4, 0);
  g.add(slow);

  // Oltita dasturchi
  const names = ['Key MakNalti', 'Betti Jennings', 'Betti Snayder', 'Marlin Meltser', 'Fran Bilas', 'Rut Lixterman'];
  const nameTxt = textPlane(
    names.map((n) => [{ text: n, color: '#a5f3fc' }]),
    { size: 20, height: 3.6, align: 'center' }
  );
  nameTxt.position.set(-10.4, -4.4, 0);
  g.add(nameTxt);
  const nameTag = label('ENIAC ning oltita dasturchisi', { size: 20, color: '#94a3b8' });
  nameTag.position.set(-10.4, -2.4, 0);
  g.add(nameTag);

  flowArrow(g, -5.4, -2.8, 3.4, '1945 — EDVAC hisoboti');

  // Saqlangan dastur
  const memTag = textPlane(
    [[{ text: 'saqlangan dastur', color: '#6ee7b7', weight: '600' }],
     [{ text: 'dastur ham, ma\'lumot ham bitta xotirada', color: '#64748b' }]],
    { size: 21, height: 1.5, align: 'center' }
  );
  memTag.position.set(7.4, 7.4, 0);
  g.add(memTag);

  const cells = [];
  for (let i = 0; i < 24; i++) {
    const isCode = i < 14;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 0.86),
      new THREE.MeshBasicMaterial({
        color: isCode ? 0x34d399 : 0x60a5fa, transparent: true, opacity: 0.2, depthWrite: false
      })
    );
    m.position.set(2.6 + (i % 8) * 1.3, 5.4 - Math.floor(i / 8) * 1.1, 0);
    g.add(m);
    const e = wireBox(1.15, 0.86, 0.001, isCode ? '#34d399' : '#60a5fa', 0.35);
    e.position.copy(m.position);
    g.add(e);
    cells.push({ m, isCode });
  }
  [['dastur', '#6ee7b7', 3.4], ['ma\'lumot', '#93c5fd', 2.2]].forEach(([txt, col, y]) => {
    const l = label(txt, { size: 19, color: col });
    l.position.set(13.4, y, 0);
    g.add(l);
  });

  const baby = textPlane(
    [
      [{ text: '1948-yil 21-iyun · Manchester "Baby"', color: '#a5f3fc', weight: '600' }],
      [{ text: 'xotirada saqlangan dastur birinchi marta bajarildi', color: '#94a3b8' }],
      [{ text: 'shu kundan dastur — matn: yozish, nusxalash, o\'zgartirish mumkin', color: '#64748b' }]
    ],
    { size: 21, height: 2.4, align: 'center' }
  );
  baby.position.set(7.4, -1.6, 0);
  g.add(baby);

  const link = textPlane(
    [[{ text: 'Sayohatimizdagi "mashina kodi RAM da yotadi" qatlami to\'g\'ridan-to\'g\'ri shu hisobotdan kelib chiqqan.', color: '#cbd5e1' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  link.position.set(0, -7.6, 0);
  g.add(link);

  return {
    group: g,
    update(t) {
      socks.forEach((o, i) => { o.material.opacity = 0.35 + 0.4 * pulse(t, 1.4, i * 0.3); });
      cables.forEach((c, i) => { c.material.opacity = 0.25 + 0.4 * pulse(t, 1.1, i * 0.8); });
      cells.forEach(({ m }, i) => { m.material.opacity = 0.1 + 0.22 * pulse(t, 1.8, i * 0.25); });
      link.material.opacity = 0.65 + 0.35 * pulse(t, 0.85);
    }
  };
}

// ── 06. Birinchi til qaysi? ─────────────────────────────────────────────────
export function buildFirstLang(meta) {
  const g = new THREE.Group();

  const cands = [
    ['Plankalkül', '1942–1945', 'Konrad Suze', 'birinchi LOYIHALANGAN', 'kompilyatori yo\'q edi', '#a78bfa'],
    ['Short Code', '1949', 'Mokli · Shmitt', 'birinchi ISHLAGAN', 'interpretator, sekin', '#38bdf8'],
    ['Autocode', '1952', 'Alik Glenni', 'birinchi KOMPILYATOR', 'Manchester Mark 1', '#34d399'],
    ['FORTRAN', '1957', 'Jon Bekus · IBM', 'birinchi KENG TARQALGAN', 'assembler bilan teng', '#fbbf24']
  ];

  const objs = cands.map(([name, year, who, claim, note, col], i) => {
    const x = -11.1 + i * 7.4;
    const box = stageBox(g, { x, y: 2.6, w: 7.4, h: 7.4, color: col, fill: 0.06 });
    const txt = textPlane(
      [
        [{ text: year, color: col, weight: '700' }],
        [{ text: name, color: '#ffffff', weight: '600' }],
        [{ text: who, color: '#64748b' }],
        [{ text: '', color: '#000' }],
        [{ text: claim, color: col }],
        [{ text: note, color: '#64748b' }]
      ],
      { size: 19, height: 4.6, align: 'center' }
    );
    txt.position.set(x, 2.6, 0.5);
    g.add(txt);
    return { box, txt };
  });

  // Greys Xopper — A-0
  const hopper = textPlane(
    [
      [{ text: '1952 · Greys Xopper — A-0', color: '#f9a8d4', weight: '600' }],
      [{ text: 'tayyor bo\'laklarni yig\'ib bitta dastur qiladigan vosita', color: '#94a3b8' }],
      [{ text: '"kompilyator" so\'zi ham shundan', color: '#64748b' }]
    ],
    { size: 21, height: 2.4, align: 'center' }
  );
  hopper.position.set(0, -3.4, 0);
  g.add(hopper);

  const belief = textPlane(
    [[{ text: 'FORTRAN gacha ko\'pchilik ishonardi: "kompilyator hech qachon odamdek yozolmaydi".', color: '#cbd5e1' }],
     [{ text: 'Bekus guruhi buni 1957-yilda rad etdi — va butun soha yo\'nalishini o\'zgartirdi.', color: '#fde68a', weight: '600' }]],
    { size: 23, height: 1.7, align: 'center' }
  );
  belief.position.set(0, -6.4, 0);
  g.add(belief);

  return {
    group: g,
    update(t) {
      const active = Math.floor(t * 0.5) % 4;
      objs.forEach(({ box, txt }, i) => {
        box.userData.fillMesh.material.opacity = i === active ? 0.2 : 0.03;
        txt.material.opacity = i === active ? 1 : 0.45;
      });
      belief.material.opacity = 0.7 + 0.3 * pulse(t, 0.8);
    }
  };
}

// ── 07. Portlash: 1957–1964 ─────────────────────────────────────────────────
export function buildBoom(meta) {
  const g = new THREE.Group();

  const root = orb(0.4, '#ffffff', 1);
  root.position.set(0, 7, 0);
  g.add(root);
  const rootTag = label('1957–1964 · olti yil', { size: 23, color: '#cbd5e1' });
  rootTag.position.set(0, 8, 0);
  g.add(rootTag);

  const langs = [
    ['FORTRAN', '1957', 'formula tarjimoni', 'hisob-kitob · hali ham tirik', -11.4, '#fbbf24'],
    ['LISP', '1958', 'lambda hisobidan', 'GC · rekursiya · kod = ma\'lumot', -3.8, '#a78bfa'],
    ['COBOL', '1959', 'inglizchaga yaqin', 'banklarda milliardlab qator', 3.8, '#34d399'],
    ['ALGOL 60', '1960', 'sintaksis ajdodi', 'blok · BNF · rekursiya', 11.4, '#38bdf8']
  ];

  const objs = langs.map(([name, year, what, impact, x, col]) => {
    const box = stageBox(g, { x, y: 1.6, w: 6.8, h: 6.2, color: col, fill: 0.07 });
    const txt = textPlane(
      [
        [{ text: year, color: col, weight: '700' }],
        [{ text: name, color: '#ffffff', weight: '600' }],
        [{ text: '', color: '#000' }],
        [{ text: what, color: '#94a3b8' }],
        [{ text: impact, color: '#64748b' }]
      ],
      { size: 20, height: 3.8, align: 'center' }
    );
    txt.position.set(x, 1.6, 0.5);
    g.add(txt);
    return { box, txt, x };
  });

  const branches = objs.map(({ x }) =>
    curveLine([
      new THREE.Vector3(0, 6.6, 0),
      new THREE.Vector3(x * 0.6, 6, 0.6),
      new THREE.Vector3(x, 4.8, 0)
    ], '#475569', 0.4, 30)
  );
  branches.forEach((b) => g.add(b));
  const sparks = branches.map(() => {
    const s = glowSprite('#ffffff', 0.55);
    g.add(s);
    return s;
  });

  const basic = textPlane(
    [[{ text: '1964 · BASIC — dasturlashni mutaxassis bo\'lmaganlarga ochish uchun.', color: '#94a3b8' }],
     [{ text: 'Keyinchalik shaxsiy kompyuterlar avlodini aynan u tarbiyalagan.', color: '#64748b' }]],
    { size: 22, height: 1.6, align: 'center' }
  );
  basic.position.set(0, -3.4, 0);
  g.add(basic);

  const note = textPlane(
    [[{ text: 'Olti yil ichida bugungi tillarning deyarli barcha asosiy g\'oyalari paydo bo\'ldi.', color: '#e9d5ff', weight: '600' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  note.position.set(0, -5.6, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      root.scale.setScalar(1 + 0.2 * pulse(t, 2));
      sparks.forEach((s, i) => {
        const k = (t * 0.5 + i * 0.25) % 1;
        branches[i].userData.curve.getPoint(k, s.position);
        s.material.opacity = Math.sin(k * Math.PI) * 0.9;
      });
      const active = Math.floor(t * 0.45) % 4;
      objs.forEach(({ box }, i) => {
        box.userData.fillMesh.material.opacity = i === active ? 0.18 : 0.04;
      });
      note.material.opacity = 0.7 + 0.3 * pulse(t, 0.85);
    }
  };
}

// ── 08. C va Unix ───────────────────────────────────────────────────────────
export function buildC(meta) {
  const g = new THREE.Group();

  const cBox = stageBox(g, { x: -7.4, y: 4.6, w: 9.6, h: 4.4, color: '#60a5fa', fill: 0.12 });
  const cTxt = textPlane(
    [
      [{ text: 'C · 1972', color: '#ffffff', weight: '700' }],
      [{ text: 'Dennis Ritchi · Bell Labs', color: '#94a3b8' }],
      [{ text: '1973: Unix C ga qayta yozildi', color: '#64748b' }]
    ],
    { size: 22, height: 2.6, align: 'center' }
  );
  cTxt.position.set(-7.4, 4.6, 0.5);
  g.add(cTxt);

  // Bugungi avlodlar
  const heirs = [
    ['Linux yadrosi', 4.4],
    ['CPython interpretatori', 2.9],
    ['V8 dvigateli', 1.4],
    ['Go ning ish vaqti', -0.1]
  ].map(([name, y]) => {
    const m = textPlane([[{ text: name, color: '#93c5fd' }]], {
      size: 22, height: 0.74, bg: 'rgba(9,18,32,0.86)', border: 'rgba(96,165,250,0.28)', padX: 16, padY: 10
    });
    m.position.set(8.4, y, 0);
    g.add(m);
    return m;
  });
  const heirLines = heirs.map((m) =>
    curveLine([
      new THREE.Vector3(-2.4, 4.6, 0),
      new THREE.Vector3(2.6, (4.6 + m.position.y) / 2, 0.6),
      new THREE.Vector3(5.2, m.position.y, 0)
    ], '#3b82f6', 0.25, 30)
  );
  heirLines.forEach((l) => g.add(l));
  const heirDots = heirLines.map(() => {
    const s = glowSprite('#bfdbfe', 0.5);
    g.add(s);
    return s;
  });
  const heirTag = label('bugun ham C da yozilgan', { size: 21, color: '#cbd5e1' });
  heirTag.position.set(8.4, 5.6, 0);
  g.add(heirTag);

  const under = textPlane(
    [[{ text: 'Ya\'ni Python yozganingizda ham, pastda C ishlayapti.', color: '#e9d5ff', weight: '600' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  under.position.set(0, -2.4, 0);
  g.add(under);

  // Boshqa 70-yillar
  const others = [
    ['Smalltalk · 1972', 'Alan Key · Xerox PARC', 'obyektlar bir-biriga xabar yuboradi', -8.6, '#f472b6'],
    ['Pascal · 1970', 'Niklaus Virt', 'o\'qitish uchun tartibli til', 0, '#fbbf24'],
    ['Prolog · 1972', 'Kolmerauer', 'faktlarni yozasiz, javobni tizim topadi', 8.6, '#34d399']
  ].map(([name, who, what, x, col]) => {
    const txt = textPlane(
      [
        [{ text: name, color: col, weight: '600' }],
        [{ text: who, color: '#94a3b8' }],
        [{ text: what, color: '#64748b' }]
      ],
      { size: 20, height: 2.3, align: 'center' }
    );
    txt.position.set(x, -5, 0);
    g.add(txt);
    return txt;
  });

  const hello = textPlane(
    [[{ text: '1978 · K&R kitobi:  ', color: '#94a3b8' }, { text: 'hello, world', color: '#fde68a', weight: '600' },
      { text: '  — dasturlashdagi eng mashhur jumla.', color: '#94a3b8' }]],
    { size: 22, height: 0.78, align: 'center' }
  );
  hello.position.set(0, -7.4, 0);
  g.add(hello);

  return {
    group: g,
    update(t) {
      cBox.userData.fillMesh.material.opacity = 0.08 + 0.1 * pulse(t, 1.1);
      heirDots.forEach((s, i) => {
        const k = (t * 0.5 + i * 0.24) % 1;
        heirLines[i].userData.curve.getPoint(k, s.position);
        s.material.opacity = Math.sin(k * Math.PI) * 0.9;
      });
      heirs.forEach((m, i) => { m.material.opacity = 0.55 + 0.45 * pulse(t, 1.5, i * 0.7); });
      others.forEach((m, i) => { m.material.opacity = 0.5 + 0.45 * pulse(t, 0.9, i * 1.2); });
      under.material.opacity = 0.7 + 0.3 * pulse(t, 0.9);
    }
  };
}

// ── 09. Veb davri ───────────────────────────────────────────────────────────
export function buildWeb(meta) {
  const g = new THREE.Group();

  timeline(g, [
    ['1983', 'C++', 0, '#60a5fa'],
    ['1991', 'Python', 0.28, '#4ade80'],
    ['1995', 'Java · JS · PHP · Ruby', 0.62, '#facc15'],
    ['1999', 'veb hamma joyda', 1, '#f472b6']
  ], { y: 6, x0: -12, x1: 12 });

  const items = [
    ['C++ · 1983', 'Byarne Stroustrup', '"ishlatmasangiz — to\'lamaysiz"', -11, '#60a5fa'],
    ['Python · 1991', 'Gvido van Rossum', 'qavs o\'rniga bo\'shliq bilan blok', -3.7, '#4ade80'],
    ['Java · 1995', 'Sun Microsystems', 'bayt-kod + virtual mashina', 3.7, '#fb923c'],
    ['JavaScript · 1995', 'Brendan Ayx', 'o\'n kunda yozilgan', 11, '#facc15']
  ].map(([name, who, what, x, col]) => {
    const box = stageBox(g, { x, y: 1.8, w: 6.8, h: 4.6, color: col, fill: 0.07 });
    const txt = textPlane(
      [
        [{ text: name, color: col, weight: '600' }],
        [{ text: who, color: '#94a3b8' }],
        [{ text: what, color: '#64748b' }]
      ],
      { size: 20, height: 2.5, align: 'center' }
    );
    txt.position.set(x, 1.8, 0.5);
    g.add(txt);
    return box;
  });

  // Java g'oyasi: bayt-kod + VM
  const vmTag = label('Java ning g\'oyasi — bizning IL qatlamimizning ajdodi', { size: 22, color: '#cbd5e1' });
  vmTag.position.set(0, -2, 0);
  g.add(vmTag);

  const vmChain = [['manba kod', '#7dd3fc'], ['bayt-kod', '#fb923c'], ['VM (har platformada)', '#a78bfa'], ['mashina kodi', '#fbbf24']];
  const vmObjs = vmChain.map(([txt, col], i) => {
    const m = textPlane([[{ text: txt, color: col }]], {
      size: 21, height: 0.74, bg: 'rgba(9,14,28,0.86)', border: `${col}33`, padX: 16, padY: 10
    });
    m.position.set(-9 + i * 6, -3.6, 0);
    g.add(m);
    if (i > 0) flowArrow(g, -9 + (i - 1) * 6 + 2.4, -9 + i * 6 - 2.4, -3.6, '');
    return m;
  });

  const why = textPlane(
    [[{ text: 'Sabab bitta: veb. Endi dastur bitta mashinada emas, millionlab noma\'lum brauzerda ishlashi kerak edi.', color: '#e9d5ff', weight: '600' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  why.position.set(0, -6.4, 0);
  g.add(why);

  return {
    group: g,
    update(t) {
      const active = Math.floor(t * 0.45) % 4;
      items.forEach((b, i) => {
        b.userData.fillMesh.material.opacity = i === active ? 0.18 : 0.04;
      });
      const step = Math.floor(t * 1.1) % vmObjs.length;
      vmObjs.forEach((m, i) => { m.material.opacity = i === step ? 1 : 0.45; });
      why.material.opacity = 0.7 + 0.3 * pulse(t, 0.85);
    }
  };
}

// ── 10. Xavfsizlik va parallellik ───────────────────────────────────────────
export function buildSafety(meta) {
  const g = new THREE.Group();

  // Ikki muammo
  const probs = [
    ['yadrolar ko\'paydi', '2005 dan protsessorlar tezlashishdan to\'xtadi —', 'endi tezlik parallellikni talab qiladi', -7.4, '#38bdf8'],
    ['xotira xatolari', 'Microsoft va Google mustaqil hisoblagan:', 'C/C++ dagi jiddiy nuqsonlarning ~70% i', 7.4, '#f87171']
  ].map(([name, l1, l2, x, col]) => {
    const box = stageBox(g, { x, y: 5.4, w: 13.4, h: 4, color: col, fill: 0.08 });
    const txt = textPlane(
      [
        [{ text: name, color: col, weight: '600' }],
        [{ text: l1, color: '#94a3b8' }],
        [{ text: l2, color: '#64748b' }]
      ],
      { size: 21, height: 2.4, align: 'center' }
    );
    txt.position.set(x, 5.4, 0.5);
    g.add(txt);
    return box;
  });

  const answer = label('javob: tillarning yangi avlodi', { size: 23, color: '#cbd5e1' });
  answer.position.set(0, 2.4, 0);
  g.add(answer);

  const langs = [
    ['C# · 2000', 'Anders Hejlsberg', 'boshqariladigan xotira · async/await', -11, '#a78bfa'],
    ['Go · 2009', 'Griesemer · Payk · Tompson', 'goroutine va kanallar', -3.7, '#22d3ee'],
    ['Rust · 2010 (1.0 — 2015)', 'Greydon Xoar', 'GC siz xotira xavfsizligi', 3.7, '#fb923c'],
    ['TypeScript · 2012', 'Microsoft', 'JS ga turlar qaytdi', 11, '#60a5fa']
  ].map(([name, who, what, x, col]) => {
    const box = stageBox(g, { x, y: -1.4, w: 6.8, h: 4.8, color: col, fill: 0.07 });
    const txt = textPlane(
      [
        [{ text: name, color: col, weight: '600' }],
        [{ text: who, color: '#94a3b8' }],
        [{ text: what, color: '#64748b' }]
      ],
      { size: 19, height: 2.6, align: 'center' }
    );
    txt.position.set(x, -1.4, 0.5);
    g.add(txt);
    return box;
  });

  const thompson = textPlane(
    [[{ text: 'Ken Tompson — o\'sha, 1972-yilgi Unix va C davridan. Ellik yildan keyin yana yangi til yaratdi.', color: '#94a3b8' }]],
    { size: 22, height: 0.78, align: 'center' }
  );
  thompson.position.set(0, -5, 0);
  g.add(thompson);

  const kernel = textPlane(
    [[{ text: '2022 dan Rust Linux yadrosiga kira boshladi — C ning ellik yillik monopoliyasidagi birinchi yoriq.', color: '#fde68a', weight: '600' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  kernel.position.set(0, -6.6, 0);
  g.add(kernel);

  const circle = textPlane(
    [[{ text: 'Qiziq aylana: 1950-larda tillar turlarni qo\'shgan, 1990-larda veb ularni tashlagan, 2010-larda qaytarib olib kelingan.', color: '#cbd5e1' }]],
    { size: 22, height: 0.78, align: 'center' }
  );
  circle.position.set(0, -8.4, 0);
  g.add(circle);

  return {
    group: g,
    update(t) {
      probs.forEach((b, i) => {
        b.userData.fillMesh.material.opacity = 0.05 + 0.1 * pulse(t, 1, i * Math.PI);
      });
      const active = Math.floor(t * 0.45) % 4;
      langs.forEach((b, i) => {
        b.userData.fillMesh.material.opacity = i === active ? 0.18 : 0.04;
      });
      kernel.material.opacity = 0.65 + 0.35 * pulse(t, 0.8);
    }
  };
}

// ── 11. Teskari yo'l ────────────────────────────────────────────────────────
export function buildMirror(meta) {
  const g = new THREE.Group();

  const headL = label('TARIX — abstraksiyalar qurilgan', { size: 22, color: '#fbbf24' });
  headL.position.set(-8, 8, 0);
  g.add(headL);
  const headR = label('SAYOHAT — abstraksiyalar yechilgan', { size: 22, color: '#6ee7ff' });
  headR.position.set(8, 8, 0);
  g.add(headR);

  const pairs = [
    ['1945 · EDVAC hisoboti', 'mashina kodi RAM da', '#22d3ee'],
    ['1952 · birinchi kompilyator', 'kompilyator qatlami', '#34d399'],
    ['1957 · FORTRAN g\'alabasi', 'yuqori darajali til', '#fbbf24'],
    ['1960-lar · ko\'p foydalanuvchi', 'imtiyoz chegarasi', '#fb7185'],
    ['1958 · LISP va GC', 'boshqariladigan xotira', '#a78bfa'],
    ['1995 · Java bayt-kodi', 'IL / bayt-kod qatlami', '#f472b6'],
    ['2010 · Rust borrow checker', 'kompilyator tekshiruvi', '#fb923c']
  ];

  const rows = pairs.map(([hist, layer, col], i) => {
    const y = 5.8 - i * 1.65;
    const l = textPlane([[{ text: hist, color: col }]], {
      size: 21, height: 0.74, bg: 'rgba(20,14,4,0.8)', border: `${col}2b`, padX: 14, padY: 9
    });
    l.position.set(-8, y, 0);
    g.add(l);

    const r = textPlane([[{ text: layer, color: '#cbd5e1' }]], {
      size: 21, height: 0.74, bg: 'rgba(6,16,26,0.8)', border: 'rgba(110,231,255,0.2)', padX: 14, padY: 9
    });
    r.position.set(8, y, 0);
    g.add(r);

    g.add(segments([
      new THREE.Vector3(-3.4, y, 0), new THREE.Vector3(3.4, y, 0),
      new THREE.Vector3(3.4, y, 0), new THREE.Vector3(2.9, y + 0.26, 0),
      new THREE.Vector3(3.4, y, 0), new THREE.Vector3(2.9, y - 0.26, 0)
    ], '#475569', 0.45));
    return { l, r, y };
  });

  // Odamning qo'lidan olingan ishlar
  const ladder = ['kabel ulash', 'mashina kodi', 'assembler', 'yuqori darajali til', 'boshqariladigan xotira', 'borrow checker'];
  const ladderTxt = textPlane(
    [[{ text: ladder.join('   →   '), color: '#94a3b8' }]],
    { size: 21, height: 0.76, align: 'center' }
  );
  ladderTxt.position.set(0, -6.4, 0);
  g.add(ladderTxt);
  const ladderTag = label('har bir qadam odamning qo\'lidan bitta ishni olib qo\'ygan', { size: 21, color: '#64748b' });
  ladderTag.position.set(0, -5.4, 0);
  g.add(ladderTag);

  const cost = textPlane(
    [[{ text: 'Abstraksiyalar tekin emas — faqat narxi allaqachon to\'langan.', color: '#cbd5e1' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  cost.position.set(0, -8, 0);
  g.add(cost);

  const finale = textPlane(
    [
      [{ text: 'Al-Xorazmiy yozgan narsa ham, bugungi kod ham mohiyatan bitta:', color: '#e9d5ff' }],
      [{ text: 'bosqichma-bosqich, aniq, takrorlanadigan tartib.', color: '#ffffff', weight: '700' }],
      [{ text: 'Faqat uni bajaruvchi endi odam emas, kremniy.', color: '#e9d5ff' }]
    ],
    { size: 25, height: 2.7, align: 'center' }
  );
  finale.position.set(0, -10.6, 0);
  g.add(finale);

  return {
    group: g,
    update(t) {
      const active = Math.floor(t * 0.7) % rows.length;
      rows.forEach(({ l, r }, i) => {
        const on = i === active;
        l.material.opacity = on ? 1 : 0.4;
        r.material.opacity = on ? 1 : 0.4;
        l.position.z = on ? 0.5 : 0;
        r.position.z = on ? 0.5 : 0;
      });
      finale.material.opacity = 0.7 + 0.3 * pulse(t, 0.75);
      cost.material.opacity = 0.6 + 0.4 * pulse(t, 0.9);
    }
  };
}
