// JavaScript boshi: manba kod → Ignition bayt-kodi → TurboFan va deopt.
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  orb, glowSprite, lineMat, pulse, clamp, lerp
} from '../../lib/gfx.js';
import { PAL, codePanel, cardColumn, flowArrow, stageBox } from './common.js';

// ── Manba kod ───────────────────────────────────────────────────────────────
export function buildJsSource(meta) {
  const g = new THREE.Group();

  codePanel(g, [
    [{ text: 'function ', color: PAL.key }, { text: 'add', color: PAL.fn }, { text: '(a, b) {', color: PAL.dim }],
    [{ text: '    return ', color: PAL.key }, { text: 'a + b;', color: PAL.dim },
     { text: '        // son? satr?', color: PAL.cm }],
    [{ text: '}', color: PAL.dim }],
    [],
    [{ text: 'console', color: PAL.type }, { text: '.', color: PAL.dim }, { text: 'log', color: PAL.fn },
     { text: '(', color: PAL.dim }, { text: 'add', color: PAL.fn }, { text: '(40, 2));', color: PAL.dim }]
  ], { x: -6, y: 4.6, height: 5.4, file: 'program.js', accent: '#facc15' });

  // Bitta o'zgaruvchi — uch xil tur
  const varTag = label('bitta o\'zgaruvchi, uch xil tur', { size: 23, color: '#cbd5e1' });
  varTag.position.set(8.4, 6.4, 0);
  g.add(varTag);

  const forms = [
    ['x = 42', 'number', '#fbbf24'],
    ['x = "salom"', 'string', '#fca5a5'],
    ['x = { a: 1 }', 'object', '#7dd3fc']
  ];
  const formObjs = forms.map(([code, type, col], i) => {
    const m = textPlane(
      [
        [{ text: code, color: col, weight: '600' }],
        [{ text: type, color: '#64748b' }]
      ],
      { size: 23, height: 1.5, bg: 'rgba(9,14,28,0.88)', border: `${col}44`, padX: 18, padY: 11 }
    );
    m.position.set(8.4, 4.4 - i * 2, 0);
    g.add(m);
    return m;
  });

  const problem = textPlane(
    [
      [{ text: 'Kompilyator ', color: '#94a3b8' }, { text: 'a + b', color: '#fbbf24' },
       { text: ' ni ko\'rib turib qo\'shish bo\'ladimi yoki', color: '#94a3b8' }],
      [{ text: 'satrlarni ulash bo\'ladimi — bilolmaydi. Ikkalasiga tayyor turishi kerak.', color: '#94a3b8' }]
    ],
    { size: 23, height: 1.6, align: 'center' }
  );
  problem.position.set(0, -3.4, 0);
  g.add(problem);

  // Ikkinchi muammo: kod tarmoqdan keladi
  const netBox = stageBox(g, { x: 0, y: -6.6, w: 22, h: 2.6, color: '#38bdf8', fill: 0.07 });
  const netTxt = textPlane(
    [[{ text: 'Va kod tarmoq orqali keladi: kompilyatsiyaga sarflangan har ms — sahifa kechikishi.', color: '#7dd3fc' }]],
    { size: 23, height: 0.78, align: 'center' }
  );
  netTxt.position.set(0, -6.6, 0.5);
  g.add(netTxt);

  return {
    group: g,
    update(t) {
      const active = Math.floor(t * 0.8) % 3;
      formObjs.forEach((m, i) => {
        m.material.opacity = i === active ? 1 : 0.4;
        m.scale.setScalar(i === active ? 1.06 : 1);
      });
      netBox.userData.fillMesh.material.opacity = 0.04 + 0.08 * pulse(t, 1.2);
    }
  };
}

// ── Ignition: bayt-kod, shakllar, inline kesh ───────────────────────────────
export function buildJsIgnition(meta) {
  const g = new THREE.Group();

  // Chapda: registrli bayt-kod
  const bcTag = label('Ignition bayt-kodi — registrli', { size: 23, color: '#cbd5e1' });
  bcTag.position.set(-10.4, 7.2, 0);
  g.add(bcTag);

  const bc = [
    ['Ldar', 'a1'],
    ['Add', 'a0, [0]'],
    ['Star', 'r0'],
    ['Return', '']
  ];
  const bcCards = cardColumn(g, bc, { x: -10.4, yTop: 5.4, gap: 1.3, width: 16, accent: '#818cf8' });
  const bcNote = label('stek emas — r0, r1 virtual registrlari', { size: 19, color: '#64748b' });
  bcNote.position.set(-10.4, 0.2, 0);
  g.add(bcNote);

  // O'rtada: yashirin sinflar zanjiri
  const shapeTag = label('yashirin sinflar (shapes)', { size: 23, color: '#cbd5e1' });
  shapeTag.position.set(0.6, 7.2, 0);
  g.add(shapeTag);

  const shapes = [
    ['S0', '{}', '#64748b'],
    ['S1', '{x}', '#7dd3fc'],
    ['S2', '{x, y}', '#a78bfa'],
    ['S3', '{x, y, z}', '#f472b6']
  ];
  const shapeObjs = shapes.map(([id, fields, col], i) => {
    const m = textPlane(
      [
        [{ text: id, color: col, weight: '700' }],
        [{ text: fields, color: '#94a3b8' }]
      ],
      { size: 22, height: 1.5, bg: 'rgba(9,14,28,0.88)', border: `${col}44`, padX: 16, padY: 10 }
    );
    m.position.set(0.6, 5.4 - i * 1.9, 0);
    g.add(m);
    return m;
  });
  g.add(segments([
    new THREE.Vector3(0.6, 4.6, 0), new THREE.Vector3(0.6, 4.1, 0),
    new THREE.Vector3(0.6, 2.7, 0), new THREE.Vector3(0.6, 2.2, 0),
    new THREE.Vector3(0.6, 0.8, 0), new THREE.Vector3(0.6, 0.3, 0)
  ], '#475569', 0.6));
  const shapeNote = textPlane(
    [[{ text: 'shakl ma\'lum bo\'lsa, maydon', color: '#64748b' }],
     [{ text: 'siljish bo\'yicha o\'qiladi', color: '#94a3b8' }]],
    { size: 20, height: 1.3, align: 'center' }
  );
  shapeNote.position.set(0.6, -2.4, 0);
  g.add(shapeNote);

  // O'ngda: inline kesh holatlari
  const icTag = label('inline kesh', { size: 23, color: '#cbd5e1' });
  icTag.position.set(10.4, 7.2, 0);
  g.add(icTag);

  const ics = [
    ['monomorf', '1 shakl — eng tez', '#4ade80'],
    ['polimorf', '2–4 shakl — sekinroq', '#fbbf24'],
    ['megamorf', '4+ shakl — keshdan voz kechiladi', '#f87171']
  ];
  const icObjs = ics.map(([name, desc, col], i) => {
    const box = stageBox(g, { x: 10.4, y: 5 - i * 2.6, w: 11.4, h: 2.1, color: col, fill: 0.08 });
    const txt = textPlane(
      [
        [{ text: name, color: col, weight: '600' }],
        [{ text: desc, color: '#64748b' }]
      ],
      { size: 21, height: 1.4, align: 'center' }
    );
    txt.position.set(10.4, 5 - i * 2.6, 0.5);
    g.add(txt);
    return box;
  });

  const note = textPlane(
    [[{ text: 'Shuning uchun obyektlarni bir xil tartibda qurish JavaScript da haqiqiy optimizatsiya hisoblanadi.', color: '#cbd5e1' }]],
    { size: 24, height: 0.82, align: 'center' }
  );
  note.position.set(0, -6, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      const step = Math.floor(t * 1.2) % bcCards.length;
      bcCards.forEach((c, i) => { c.material.opacity = i === step ? 1 : 0.45; });

      const grow = Math.floor(t * 0.7) % shapeObjs.length;
      shapeObjs.forEach((m, i) => {
        m.material.opacity = i <= grow ? 1 : 0.25;
        m.scale.setScalar(i === grow ? 1.06 : 1);
      });

      const state = Math.floor(t * 0.45) % 3;
      icObjs.forEach((b, i) => {
        b.userData.fillMesh.material.opacity = i === state ? 0.22 : 0.03;
      });
    }
  };
}

// ── TurboFan: taxmin va deoptimizatsiya ─────────────────────────────────────
export function buildJsTurbofan(meta) {
  const g = new THREE.Group();

  // Chapda: qizish hisoblagichi
  const hotTag = label('chaqiruvlar hisoblagichi', { size: 22, color: '#cbd5e1' });
  hotTag.position.set(-11.4, 6.6, 0);
  g.add(hotTag);

  const bars = [];
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.66, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.15, depthWrite: false })
    );
    m.position.set(-14.2 + i * 0.82, 5, 0);
    g.add(m);
    bars.push(m);
  }
  const hotLabel = label('qizidi → TurboFan ga beriladi', { size: 19, color: '#fbbf24' });
  hotLabel.position.set(-11.4, 3.9, 0);
  g.add(hotLabel);

  // Ignition bayt-kodi (pastki yo'l)
  const ign = stageBox(g, { x: -11.4, y: 0.6, w: 9.6, h: 2.6, title: 'Ignition — bayt-kod', color: '#818cf8', fill: 0.09 });
  const ignTxt = label('sekin, lekin doim to\'g\'ri', { size: 19, color: '#a5b4fc' });
  ignTxt.position.set(-11.4, 0.6, 0.5);
  g.add(ignTxt);

  // Markazda: TurboFan
  const core = new THREE.Group();
  core.position.set(-0.4, 3, 0);
  g.add(core);
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.4, 1),
    new THREE.MeshBasicMaterial({ color: meta.color, transparent: true, opacity: 0.14, depthWrite: false })
  );
  const icoWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.4, 1)),
    lineMat(meta.color, 0.7)
  );
  core.add(ico, icoWire);
  const coreGlow = glowSprite(meta.color, 8.4);
  coreGlow.material.opacity = 0.2;
  core.add(coreGlow);
  const tfTag = label('TurboFan', { size: 26, color: '#f9a8d4', weight: '700' });
  tfTag.position.set(-0.4, 0.2, 0);
  g.add(tfTag);

  // Taxmin
  const guess = textPlane(
    [
      [{ text: 'taxmin', color: '#fbbf24', weight: '600' }],
      [{ text: 'a va b doim son', color: '#94a3b8' }]
    ],
    { size: 22, height: 1.5, bg: 'rgba(28,20,4,0.9)', border: 'rgba(251,191,36,0.4)', padX: 18, padY: 11 }
  );
  guess.position.set(-0.4, -2.4, 0);
  g.add(guess);

  // O'ngda: optimallashtirilgan kod
  const opt = stageBox(g, { x: 10.6, y: 3, w: 10.6, h: 3.4, title: 'optimallashtirilgan kod', color: '#4ade80', fill: 0.1 });
  const optTxt = textPlane(
    [
      [{ text: 'tur tekshiruvlari yo\'q', color: '#86efac' }],
      [{ text: 'maydonlar siljish bo\'yicha', color: '#86efac' }],
      [{ text: 'funksiyalar inline', color: '#86efac' }]
    ],
    { size: 20, height: 2.1, align: 'center' }
  );
  optTxt.position.set(10.6, 3, 0.5);
  g.add(optTxt);

  // Deoptimizatsiya yo'li: optimallashtirilgandan bayt-kodga qaytish
  const deoptPath = curveLine([
    new THREE.Vector3(10.6, 1.1, 0),
    new THREE.Vector3(2, -4.6, 0.6),
    new THREE.Vector3(-11.4, -0.8, 0)
  ], '#f87171', 0.3, 50);
  g.add(deoptPath);
  const deoptDot = glowSprite('#fecaca', 0.75);
  g.add(deoptDot);
  const deoptTag = label('deoptimizatsiya', { size: 22, color: '#fca5a5' });
  deoptTag.position.set(2.6, -5.4, 0);
  g.add(deoptTag);
  const breakTag = label('kimdir satr uzatdi → taxmin buzildi', { size: 19, color: '#f87171' });
  breakTag.position.set(2.6, -6.3, 0);
  g.add(breakTag);

  const loopWarn = textPlane(
    [
      [{ text: 'deopt loop', color: '#fca5a5', weight: '600' }],
      [{ text: 'funksiya doim turini o\'zgartirsa: optimallashtiriladi → tashlanadi → yana…', color: '#64748b' }]
    ],
    { size: 21, height: 1.5, align: 'center' }
  );
  loopWarn.position.set(0, -8.4, 0);
  g.add(loopWarn);

  const note = textPlane(
    [[{ text: 'C# JIT ham qizigan kodni qayta kompilyatsiya qiladi — lekin turlar oldindan ma\'lum, shuning uchun tavakkal qilmaydi.', color: '#e9d5ff', weight: '600' }]],
    { size: 23, height: 0.8, align: 'center' }
  );
  note.position.set(0, -10.6, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      core.rotation.y = t * 0.55;
      core.rotation.x = Math.sin(t * 0.3) * 0.2;

      // Sikl: qiziydi → optimallashtiriladi → taxmin buziladi → deopt
      const cyc = (t * 0.22) % 1;
      const heat = clamp(cyc / 0.34, 0, 1);
      bars.forEach((m, i) => {
        m.material.opacity = i / bars.length < heat ? 0.75 : 0.12;
      });
      hotLabel.material.opacity = heat >= 1 ? 0.5 + 0.5 * pulse(t, 4) : 0.2;

      const optimized = cyc > 0.36 && cyc < 0.72;
      opt.userData.fillMesh.material.opacity = optimized ? 0.2 : 0.03;
      optTxt.material.opacity = optimized ? 1 : 0.25;
      guess.material.opacity = optimized ? 1 : 0.35;
      coreGlow.material.opacity = optimized ? 0.28 : 0.12;
      ign.userData.fillMesh.material.opacity = optimized ? 0.04 : 0.2;
      ignTxt.material.opacity = optimized ? 0.3 : 1;

      const deopting = cyc >= 0.72 && cyc < 0.94;
      deoptDot.visible = deopting;
      if (deopting) {
        const k = (cyc - 0.72) / 0.22;
        deoptPath.userData.curve.getPoint(k, deoptDot.position);
        deoptDot.material.opacity = Math.sin(k * Math.PI) * 0.95;
      }
      deoptPath.material.opacity = deopting ? 0.8 : 0.18;
      deoptTag.material.opacity = deopting ? 1 : 0.3;
      breakTag.material.opacity = deopting ? 0.9 : 0.2;
      loopWarn.material.opacity = 0.45 + 0.4 * pulse(t, 0.7);
    }
  };
}
