// Python boshi: manba kod → bayt-kod → interpretator halqasi.
import * as THREE from 'three';
import {
  textPlane, label, segments, wireBox, panel,
  orb, glowSprite, lineMat, points, pulse, clamp, lerp
} from '../../lib/gfx.js';
import { PAL, codePanel, cardColumn, flowArrow, stageBox } from './common.js';

// ── Manba kod ───────────────────────────────────────────────────────────────
export function buildPySource(meta) {
  const g = new THREE.Group();

  codePanel(g, [
    [{ text: 'def ', color: PAL.key }, { text: 'main', color: PAL.fn }, { text: '():', color: PAL.dim }],
    [{ text: '    x = ', color: PAL.id }, { text: '40', color: PAL.num }, { text: ' + ', color: PAL.dim }, { text: '2', color: PAL.num }],
    [{ text: '    print', color: PAL.fn }, { text: '(', color: PAL.dim }, { text: 'f"Javob: {x}"', color: PAL.str }, { text: ')', color: PAL.dim }],
    [],
    [{ text: 'main', color: PAL.fn }, { text: '()', color: PAL.dim }]
  ], { y: 4.4, height: 5.6, file: 'program.py', accent: '#4ade80' });

  // Ishga tushirish: build bosqichi ko'rinmaydi
  const cmd = textPlane([[{ text: '$ python program.py', color: '#86efac' }]], {
    size: 27, height: 0.8, bg: 'rgba(4,12,8,0.9)', border: 'rgba(134,239,172,0.3)', padX: 20, padY: 12
  });
  cmd.position.set(-6.6, -1.2, 0);
  g.add(cmd);
  const noBuild = label('build bosqichi yo\'q — dastur darrov ishlaydi', { size: 21, color: '#64748b' });
  noBuild.position.set(-6.6, -2.4, 0);
  g.add(noBuild);

  // ...lekin kesh baribir paydo bo'ladi
  const cache = stageBox(g, { x: 6.8, y: -1.6, w: 11, h: 3.4, title: 'lekin kesh paydo bo\'ladi', color: '#facc15', fill: 0.07 });
  const cacheTxt = textPlane(
    [
      [{ text: '__pycache__/', color: '#fcd34d' }],
      [{ text: 'program.cpython-313.pyc', color: '#94a3b8' }]
    ],
    { size: 24, height: 1.5, align: 'center' }
  );
  cacheTxt.position.set(6.8, -1.6, 0.5);
  g.add(cacheTxt);

  flowArrow(g, -0.4, 1.1, -1.6);

  const note = textPlane(
    [[{ text: 'CPython faylni baribir kompilyatsiya qiladi — faqat mashina kodiga emas, bayt-kodga.', color: '#94a3b8' }]],
    { size: 24, height: 0.8, align: 'center' }
  );
  note.position.set(0, -5, 0);
  g.add(note);

  const typeNote = textPlane(
    [[{ text: 'Turlar tekshirilmaydi: ', color: '#64748b' }, { text: '"salom" + 1', color: '#fca5a5' },
      { text: '  faqat o\'sha qator bajarilganda xato beradi.', color: '#64748b' }]],
    { size: 23, height: 0.75, align: 'center' }
  );
  typeNote.position.set(0, -6.4, 0);
  g.add(typeNote);

  return {
    group: g,
    update(t) {
      cache.userData.fillMesh.material.opacity = 0.05 + 0.09 * pulse(t, 1.2);
      cmd.material.opacity = 0.7 + 0.3 * pulse(t, 1.6);
    }
  };
}

// ── AST va bayt-kod ─────────────────────────────────────────────────────────
export function buildPyBytecode(meta) {
  const g = new THREE.Group();

  const container = stageBox(g, { x: 0, y: 1, w: 27, h: 15, title: 'code object', color: '#facc15', fill: 0.03 });
  container.userData.fillMesh.material.opacity = 0.025;

  const ops = [
    ['LOAD_CONST', '42'],
    ['STORE_FAST', 'x'],
    ['LOAD_NAME', 'print'],
    ['PUSH_NULL', ''],
    ['LOAD_FAST', 'x'],
    ['FORMAT_VALUE', ''],
    ['CALL', '1'],
    ['POP_TOP', ''],
    ['RETURN_CONST', 'None']
  ];
  const cards = cardColumn(g, ops, { x: -7, yTop: 6.6, gap: 1.3, width: 22, accent: '#facc15' });

  const disTag = label('dis.dis(main)  —  bayt-kod', { size: 23, color: '#94a3b8' });
  disTag.position.set(-7, -5.4, 0);
  g.add(disTag);

  // O'ng tomon: hisob steki
  const stackTag = label('hisob steki', { size: 23, color: '#94a3b8' });
  stackTag.position.set(7.4, 7, 0.5);
  g.add(stackTag);

  const slots = [];
  for (let i = 0; i < 3; i++) {
    const box = wireBox(4.6, 1.1, 1.1, '#facc15', 0.28);
    box.position.set(7.4, 1.6 + i * 1.35, 0.5);
    g.add(box);
    slots.push(box);
  }
  const items = ['42', "'Javob: 42'", 'print'].map((txt, i) => {
    const grp = new THREE.Group();
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.22, depthWrite: false })
    );
    grp.add(cube, wireBox(4.4, 1, 1, '#facc15', 0.75));
    const val = label(txt, { size: 24, color: '#fef3c7', font: '"JetBrains Mono", monospace' });
    val.position.set(0, 0, 0.7);
    grp.add(val);
    grp.position.set(7.4, 1.6, 0.5);
    g.add(grp);
    return grp;
  });

  // Har bir komanda 2 bayt
  const bytes = textPlane(
    [
      [{ text: 'har bir komanda — 2 bayt', color: '#94a3b8' }],
      [{ text: '64 2A   7D 00   65 00   …', color: '#fcd34d' }]
    ],
    { size: 24, height: 1.5, align: 'center' }
  );
  bytes.position.set(7.4, -3.4, 0.5);
  g.add(bytes);

  const note = textPlane(
    [[{ text: 'Bu yergacha hikoya C# ga o\'xshaydi. Farq keyingi qatlamda: bu bayt-kodni hech kim mashina kodiga o\'girmaydi.', color: '#cbd5e1' }]],
    { size: 24, height: 0.8, align: 'center' }
  );
  note.position.set(0, -8, 0);
  g.add(note);

  return {
    group: g,
    update(t) {
      const step = Math.floor(t * 1.2) % ops.length;
      cards.forEach((c, i) => {
        const on = i === step;
        c.material.opacity = on ? 1 : 0.42;
        c.position.z = on ? 0.9 : 0.2;
      });
      slots.forEach((s, i) => { s.material.opacity = 0.14 + 0.1 * pulse(t, 1.4, i); });
      const depth = step < 2 ? 1 : step < 6 ? 2 : step < 8 ? 3 : 0;
      items.forEach((it, i) => {
        it.visible = i < depth;
        it.position.y = 1.6 + i * 1.35;
      });
      note.material.opacity = 0.65 + 0.35 * pulse(t, 0.9);
    }
  };
}

// ── Interpretator halqasi ───────────────────────────────────────────────────
export function buildPyEval(meta) {
  const g = new THREE.Group();

  // Chapda: bayt-kod oqimi
  const feed = ['LOAD_FAST', 'LOAD_CONST', 'BINARY_OP', 'STORE_FAST'].map((op, i) => {
    const c = textPlane([[{ text: op, color: '#fcd34d' }]], {
      size: 24, height: 0.72, bg: 'rgba(10,16,32,0.85)', border: 'rgba(250,204,21,0.3)', padX: 14, padY: 9
    });
    c.position.set(-12.4, 5.4 - i * 1.15, 0);
    g.add(c);
    return c;
  });
  const feedTag = label('bayt-kod', { size: 21, color: '#94a3b8' });
  feedTag.position.set(-12.4, 6.6, 0);
  g.add(feedTag);

  // Markazda: ceval halqasi
  const ring = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, 4.2, 3.2, 0, Math.PI * 2).getPoints(72)
        .map((p) => new THREE.Vector3(p.x, p.y, 0))
    ),
    lineMat(meta.color, 0.75)
  );
  ring.position.set(-3.4, 2.6, 0);
  g.add(ring);
  const ringGlow = glowSprite(meta.color, 9);
  ringGlow.material.opacity = 0.16;
  ringGlow.position.set(-3.4, 2.6, -0.5);
  g.add(ringGlow);

  const cevalTxt = textPlane(
    [
      [{ text: 'ceval.c', color: '#e0f2fe', weight: '700' }],
      [{ text: 'while (1) switch (opcode)', color: '#7dd3fc' }],
      [{ text: 'interpretator halqasi', color: '#64748b' }]
    ],
    { size: 24, height: 2.3, align: 'center' }
  );
  cevalTxt.position.set(-3.4, 2.6, 0.5);
  g.add(cevalTxt);

  const orbiter = glowSprite('#ffffff', 0.7);
  g.add(orbiter);

  // O'ngda: bitta opcode nechta mashina komandasiga aylanadi
  const burstTag = textPlane(
    [
      [{ text: 'bitta opcode', color: '#94a3b8' }],
      [{ text: 'o\'nlab mashina komandasi', color: '#fca5a5', weight: '600' }]
    ],
    { size: 23, height: 1.5, align: 'center' }
  );
  burstTag.position.set(8.6, 6.4, 0);
  g.add(burstTag);

  const BN = 90;
  const bpos = new Float32Array(BN * 3);
  for (let i = 0; i < BN; i++) {
    bpos[i * 3] = 5 + Math.random() * 7.2;
    bpos[i * 3 + 1] = 1 + Math.random() * 4.4;
    bpos[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  const burst = points(bpos, '#fca5a5', 0.3, 0.8);
  g.add(burst);

  const steps = ['opcode o\'qish', 'turlarni tekshirish', 'PyObject ochish', 'natijani o\'rash', 'refcount yangilash'];
  const stepObjs = steps.map((s, i) => {
    const l = label('· ' + s, { size: 20, color: '#94a3b8' });
    l.position.set(8.6, 0.2 - i * 0.9, 0.4);
    g.add(l);
    return l;
  });

  // Pastda: PyObject qutilari
  const objTag = label('Python da hamma narsa obyekt', { size: 23, color: '#cbd5e1' });
  objTag.position.set(-7.6, -5.2, 0);
  g.add(objTag);

  const objs = [['int 42', 3], ['str "Salom"', 1], ['list [...]', 2]].map(([name, rc], i) => {
    const x = -12.4 + i * 4.8;
    const p = panel(4.2, 2.4, 0.8, '#38bdf8', { fill: 0.09, edgeOpacity: 0.5 });
    p.position.set(x, -7.4, 0);
    g.add(p);
    const txt = textPlane(
      [
        [{ text: name, color: '#7dd3fc', weight: '600' }],
        [{ text: 'refcount: ' + rc, color: '#64748b' }]
      ],
      { size: 22, height: 1.35, align: 'center' }
    );
    txt.position.set(x, -7.4, 0.5);
    g.add(txt);
    return p;
  });

  // O'ngda pastda: GIL
  const gilTag = label('GIL — global qulf', { size: 23, color: '#f9a8d4' });
  gilTag.position.set(8, -5.2, 0);
  g.add(gilTag);

  const threads = [0, 1, 2].map((i) => {
    const y = -6.6 - i * 1.5;
    const p = panel(6.4, 1.1, 0.5, '#f472b6', { fill: 0.07, edgeOpacity: 0.4 });
    p.position.set(8, y, 0);
    g.add(p);
    const l = label('oqim ' + (i + 1), { size: 19, color: '#94a3b8' });
    l.position.set(8, y, 0.4);
    g.add(l);
    return { p, y };
  });
  const key = glowSprite('#fbcfe8', 1.4);
  g.add(key);
  const gilNote = label('faqat bittasi bayt-kod bajaradi', { size: 19, color: '#64748b' });
  gilNote.position.set(8, -11.4, 0);
  g.add(gilNote);

  const note = textPlane(
    [[{ text: 'Pastdagi qatlamlarda ko\'radigan mashina kodi sizniki emas — u CPython niki.', color: '#e9d5ff', weight: '600' }]],
    { size: 25, height: 0.85, align: 'center' }
  );
  note.position.set(0, -13.4, 0);
  g.add(note);

  return {
    group: g,
    update(t, dt) {
      const k = (t * 0.5) % 1;
      const ang = k * Math.PI * 2;
      orbiter.position.set(-3.4 + Math.cos(ang) * 4.2, 2.6 + Math.sin(ang) * 3.2, 0.4);
      ringGlow.material.opacity = 0.12 + 0.1 * pulse(t, 2.5);

      feed.forEach((c, i) => {
        const on = Math.floor(t * 1.4) % feed.length === i;
        c.material.opacity = on ? 1 : 0.45;
      });

      const arr = burst.geometry.attributes.position.array;
      for (let i = 0; i < BN; i++) {
        arr[i * 3] += (2 + (i % 4)) * dt;
        if (arr[i * 3] > 12.2) arr[i * 3] = 5;
      }
      burst.geometry.attributes.position.needsUpdate = true;
      stepObjs.forEach((l, i) => {
        l.material.opacity = 0.35 + 0.6 * pulse(t, 2, i * 0.9);
      });

      objs.forEach((p, i) => {
        p.userData.fillMesh.material.opacity = 0.06 + 0.1 * pulse(t, 1.3, i * 1.1);
      });

      // Qulf oqimlar orasida aylanib yuradi
      const owner = Math.floor(t * 0.6) % 3;
      key.position.set(4.2, threads[owner].y, 0.6);
      key.material.opacity = 0.7 + 0.3 * pulse(t, 4);
      threads.forEach(({ p }, i) => {
        p.userData.fillMesh.material.opacity = i === owner ? 0.22 : 0.04;
      });

      note.material.opacity = 0.7 + 0.3 * pulse(t, 0.8);
    }
  };
}
