// 6–9 qatlamlar: yadro va syscall → virtual xotira → CPU konveyeri → raqamli mantiq.
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  orb, glowSprite, lineMat, retext, pulse, clamp, lerp
} from '../../lib/gfx.js';

// ── 06. Yadro: syscall va imtiyoz chegarasi ─────────────────────────────────
export function buildKernel(meta) {
  const g = new THREE.Group();

  const BOUND = 0.9;          // ring 3 / ring 0 chegarasi
  const CX = -5;              // chaqiruvlar zanjirining markazi

  // ---- Chegara: uzuq-uzuq chiziq va yorug'lik bandi ----
  const dashes = [];
  for (let x = -14; x < 14; x += 1.12) {
    dashes.push(new THREE.Vector3(x, BOUND, 0), new THREE.Vector3(x + 0.62, BOUND, 0));
  }
  g.add(segments(dashes, meta.color, 0.8));

  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 1.3),
    new THREE.MeshBasicMaterial({
      color: meta.color, transparent: true, opacity: 0.07,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  band.position.set(0, BOUND, -0.6);
  g.add(band);

  const modeTag = (rows, y) => {
    const m = textPlane(rows, { size: 24, height: 1.5, align: 'center' });
    m.position.set(-11.4, y, 0);
    g.add(m);
    return m;
  };
  modeTag([
    [{ text: 'foydalanuvchi rejimi', color: '#e2e8f0', weight: '600' }],
    [{ text: 'ring 3 — imtiyozsiz', color: '#7c8aa5' }]
  ], 3.2);
  modeTag([
    [{ text: 'yadro rejimi', color: '#fecdd3', weight: '600' }],
    [{ text: 'ring 0 — to\'liq imtiyoz', color: '#7c8aa5' }]
  ], -1.4);

  // ---- Chaqiruvlar zanjiri: C# dan tty drayverigacha ----
  const stepRows = (lang) => [
    [lang.call, 'sizning kodingiz', 8.7, '#a5f3fc'],
    [lang.runtime, lang.runtimeName, 6.8, '#7dd3fc']
  ];
  const steps = [
    ...stepRows(meta.lang),
    ['write(1, buf, 6)', 'syscall o\'ramasi', 4.9, '#93c5fd'],
    ['mov eax, 1 ; syscall', 'protsessor komandasi', 3.0, '#fbbf24'],
    ['MSR_LSTAR → entry_SYSCALL_64', 'yadro kirish nuqtasi', -1.3, '#fda4af'],
    ['sys_write(fd = 1, …)', 'yadro funksiyasi', -3.2, '#fda4af'],
    ['VFS → tty drayveri', 'qurilma darajasi', -5.1, '#fda4af']
  ];

  const cards = steps.map(([code, desc, y, col]) => {
    const card = textPlane(
      [
        [{ text: code, color: col, weight: '600' }],
        [{ text: desc, color: '#64748b' }]
      ],
      { size: 25, height: 1.45, bg: 'rgba(9,14,28,0.9)', border: 'rgba(148,163,184,0.18)', padX: 20, padY: 12 }
    );
    card.position.set(CX, y, 0.2);
    g.add(card);
    return card;
  });

  // Kartalar orasidagi ulanishlar
  const links = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const a = steps[i][2] - 0.75;
    const b = steps[i + 1][2] + 0.75;
    links.push(new THREE.Vector3(CX, a, 0), new THREE.Vector3(CX, b, 0));
  }
  g.add(segments(links, '#475569', 0.5));

  // ---- Chegarani kesib o'tish: "trap" chaqnashi ----
  const flash = glowSprite(meta.color, 7);
  flash.position.set(CX, BOUND, 0.6);
  flash.material.opacity = 0;
  g.add(flash);

  const trapTag = label('trap — protsessor imtiyoz darajasini almashtiradi', { size: 21, color: '#fda4af' });
  trapTag.position.set(CX + 0.6, BOUND + 0.85, 0.7);
  g.add(trapTag);

  // Zanjir bo'ylab yuguruvchi so'rov
  const packet = glowSprite('#ffffff', 0.85);
  g.add(packet);

  // ---- Qaytish yo'li: sysret ----
  const back = curveLine([
    new THREE.Vector3(CX + 5.2, -1.3, 0),
    new THREE.Vector3(CX + 6.6, BOUND, 0.4),
    new THREE.Vector3(CX + 5.2, 3.0, 0)
  ], '#86efac', 0.4);
  g.add(back);
  const backDot = glowSprite('#bbf7d0', 0.6);
  g.add(backDot);
  const backTag = label('sysret', { size: 21, color: '#86efac' });
  backTag.position.set(CX + 7.4, BOUND + 0.75, 0.5);
  g.add(backTag);

  // ---- Natija: terminal ----
  const term = panel(8.6, 2.9, 0.6, '#86efac', { fill: 0.05, edgeOpacity: 0.32 });
  term.position.set(CX, -8, 0);
  g.add(term);
  const termLeft = CX - 4.3 + 0.75;

  const leftText = (rows, opts, y) => {
    const m = textPlane(rows, opts);
    m.position.set(termLeft + m.userData.size[0] / 2, y, 0.4);
    g.add(m);
    return m;
  };
  leftText([[{ text: '$ dotnet run', color: '#64748b' }]], { size: 25, height: 0.72 }, -7.2);
  const outLine = leftText([[{ text: 'Salom', color: '#86efac', weight: '600' }]], { size: 27, height: 0.86 }, -8.6);
  const caret = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 0.86),
    new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.8, depthWrite: false })
  );
  caret.position.set(termLeft + 0.25, -8.6, 0.4);
  g.add(caret);

  // ---- Yadroga uchta eshik ----
  const doorsTag = label('yadroga faqat uchta eshik bor', { size: 24, color: '#cbd5e1' });
  doorsTag.position.set(8.6, 5.6, 0);
  g.add(doorsTag);

  const doors = [
    ['syscall', 'dastur o\'zi so\'raydi', '#fbbf24'],
    ['interrupt', 'apparat chaqiradi', '#38bdf8'],
    ['exception', 'xato yuz beradi', '#f87171']
  ];
  const doorObjs = doors.map(([name, desc, col], i) => {
    const x = 4.9 + i * 3.7;
    const gate = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 3.4),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.12, depthWrite: false })
    );
    gate.position.set(x, BOUND, -0.2);
    g.add(gate);
    const edge = wireBox(2.3, 3.4, 0.001, col, 0.6);
    edge.position.copy(gate.position);
    g.add(edge);

    const nm = label(name, { size: 22, color: col, weight: '600' });
    nm.position.set(x, BOUND + 2.4, 0.3);
    g.add(nm);
    const ds = label(desc, { size: 18, color: '#64748b' });
    ds.position.set(x, BOUND - 2.4, 0.3);
    g.add(ds);

    const spark = glowSprite(col, 0.7);
    g.add(spark);
    return { gate, spark, x };
  });

  const note = textPlane(
    [[{ text: 'Yadro alohida dastur emas — bu o\'sha protsessorda, yuqori imtiyoz bilan bajariladigan kod.', color: '#94a3b8' }]],
    { size: 25, height: 0.8, align: 'center' }
  );
  note.position.set(0, -10.7, 0);
  g.add(note);

  // Zanjir bo'ylab harakat uchun tugun koordinatalari
  const chainY = steps.map((s) => s[2]);

  return {
    group: g,
    setLang(lang) {
      stepRows(lang).forEach(([code, desc, , col], i) => {
        retext(cards[i], [
          [{ text: code, color: col, weight: '600' }],
          [{ text: desc, color: '#64748b' }]
        ], { size: 25, height: 1.45, bg: 'rgba(9,14,28,0.9)', border: 'rgba(148,163,184,0.18)', padX: 20, padY: 12 });
      });
    },
    update(t) {
      const cycle = (t * 0.22) % 1;              // to'liq syscall aylanishi
      const down = clamp(cycle / 0.55, 0, 1);     // pastga — so'rov
      const up = clamp((cycle - 0.7) / 0.25, 0, 1); // yuqoriga — qaytish

      // So'rov zanjir bo'ylab tushadi
      const seg = down * (chainY.length - 1);
      const si = Math.min(Math.floor(seg), chainY.length - 2);
      const sf = seg - si;
      packet.position.set(CX, lerp(chainY[si], chainY[si + 1], sf), 0.8);
      packet.material.opacity = cycle < 0.6 ? 0.95 : 0;

      cards.forEach((c, i) => {
        const active = i === Math.round(seg) && cycle < 0.6;
        c.material.opacity = active ? 1 : 0.5;
        c.position.z = active ? 0.5 : 0.2;
      });

      // Chegarani kesib o'tgan payt chaqnaydi
      const atBoundary = packet.position.y < BOUND + 1.4 && packet.position.y > BOUND - 1.4 && cycle < 0.6;
      flash.material.opacity = atBoundary ? 0.55 + 0.35 * pulse(t, 14) : Math.max(0, flash.material.opacity - 0.04);
      trapTag.material.opacity = atBoundary ? 1 : 0.25;

      // Natija terminalda paydo bo'ladi
      const printed = cycle > 0.62;
      outLine.material.opacity = printed ? 1 : 0.06;
      caret.material.opacity = printed ? 0 : 0.35 + 0.45 * pulse(t, 6);

      // sysret bilan qaytish
      backDot.visible = up > 0 && up < 1;
      if (backDot.visible) {
        back.userData.curve.getPoint(up, backDot.position);
        backDot.material.opacity = Math.sin(up * Math.PI) * 0.95;
      }
      back.material.opacity = up > 0 && up < 1 ? 0.75 : 0.25;

      // Eshiklar navbat bilan "ochiladi"
      doorObjs.forEach(({ gate, spark, x }, i) => {
        const k = (t * 0.35 + i * 0.33) % 1;
        gate.material.opacity = 0.08 + 0.16 * Math.sin(k * Math.PI);
        spark.position.set(x, BOUND + 1.7 - k * 3.4, 0.4);
        spark.material.opacity = Math.sin(k * Math.PI) * 0.85;
      });
    }
  };
}

// ── 07. Jarayon va virtual xotira ───────────────────────────────────────────
export function buildOs(meta) {
  const g = new THREE.Group();

  const COLS = 4, ROWS = 6, CELL = 1.35;
  const makeGrid = (cx, color, titleText, sub) => {
    const grp = new THREE.Group();
    const cells = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(CELL * 0.86, CELL * 0.86),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, depthWrite: false })
        );
        m.position.set((c - (COLS - 1) / 2) * CELL, -(r - (ROWS - 1) / 2) * CELL, 0);
        grp.add(m);
        const edge = wireBox(CELL * 0.86, CELL * 0.86, 0.001, color, 0.25);
        edge.position.copy(m.position);
        grp.add(edge);
        cells.push(m);
      }
    }
    const tt = label(titleText, { size: 27, color });
    tt.position.set(0, ROWS * CELL / 2 + 0.7, 0);
    grp.add(tt);
    const st = label(sub, { size: 21, color: '#64748b' });
    st.position.set(0, ROWS * CELL / 2 + 1.6, 0);
    grp.add(st);
    grp.position.set(cx, 2.2, 0);
    g.add(grp);
    return { grp, cells };
  };

  const virt = makeGrid(-10, '#34d399', 'virtual sahifalar', 'dastur ko\'radigan xotira');
  const phys = makeGrid(9.6, '#60a5fa', 'fizik kadrlar (RAM)', 'haqiqiy xotira');

  // O'rtada: sahifa jadvali + TLB
  const pt = panel(6.4, 6.4, 1.2, meta.color, { fill: 0.07, edgeOpacity: 0.5 });
  pt.position.set(0, 2.2, 0);
  g.add(pt);
  const ptTxt = textPlane(
    [
      [{ text: 'MMU', color: '#a7f3d0', weight: '700' }],
      [{ text: 'sahifa jadvali', color: '#94a3b8' }],
      [{ text: ' ', color: '#000' }],
      [{ text: 'TLB kesh', color: '#5eead4' }],
      [{ text: '~99% mos keladi', color: '#64748b' }]
    ],
    { size: 25, height: 3.4, align: 'center' }
  );
  ptTxt.position.set(0, 2.2, 0.8);
  g.add(ptTxt);

  // Tarjima yo'llari: virtual sahifa → jadval → tasodifiy fizik kadr
  const mapIdx = [[2, 17], [6, 3], [9, 21], [13, 8], [18, 12]];
  const paths = mapIdx.flatMap(([vi, pi]) => {
    const v = virt.cells[vi].position.clone().add(virt.grp.position);
    const p = phys.cells[pi].position.clone().add(phys.grp.position);
    return [
      curveLine([v, new THREE.Vector3(-4.4, (v.y + 2.2) / 2, 1.6), new THREE.Vector3(-3.3, 2.2, 0.7)], '#34d399', 0.28),
      curveLine([new THREE.Vector3(3.3, 2.2, 0.7), new THREE.Vector3(4.4, (p.y + 2.2) / 2, 1.6), p], '#60a5fa', 0.28)
    ];
  });
  paths.forEach((p) => g.add(p));
  const dots = paths.map(() => {
    const s = glowSprite('#d1fae5', 0.55);
    g.add(s);
    return s;
  });

  // Pastda: rejalashtiruvchi (scheduler) — 4 yadro yo'lagi
  const procColors = ['#f472b6', '#fbbf24', '#38bdf8', '#a78bfa'];
  const lanes = [];
  for (let i = 0; i < 4; i++) {
    const y = -7 - i * 1.25;
    const track = wireBox(24, 0.9, 0.001, '#334155', 0.4);
    track.position.set(0, y, 0);
    g.add(track);
    const tag = label('yadro ' + i, { size: 20, color: '#64748b' });
    tag.position.set(-14.3, y, 0);
    g.add(tag);
    const blocks = [];
    for (let b = 0; b < 3; b++) {
      const col = procColors[(i + b) % 4];
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 0.7),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, depthWrite: false })
      );
      m.position.set(0, y, 0.05);
      g.add(m);
      blocks.push({ m, offset: b * 8 + i * 2.5 });
    }
    lanes.push(blocks);
  }
  const schedTag = label('scheduler — yadrolarni jarayonlar orasida bo\'ladi', { size: 23, color: '#94a3b8' });
  schedTag.position.set(0, -5.9, 0);
  g.add(schedTag);

  const faultTag = label('page fault → yadro sahifani diskdan yuklaydi', { size: 22, color: '#f87171' });
  faultTag.position.set(0, -12.4, 0);
  g.add(faultTag);

  return {
    group: g,
    update(t) {
      virt.cells.forEach((c, i) => { c.material.opacity = 0.06 + 0.16 * pulse(t, 1.1, i * 0.4); });
      phys.cells.forEach((c, i) => { c.material.opacity = 0.06 + 0.16 * pulse(t, 0.9, i * 0.6); });
      dots.forEach((s, i) => {
        const k = (t * 0.5 + Math.floor(i / 2) * 0.2 + (i % 2) * 0.5) % 1;
        paths[i].userData.curve.getPoint(k, s.position);
        s.material.opacity = Math.sin(k * Math.PI) * 0.9;
      });
      lanes.forEach((blocks) => {
        blocks.forEach(({ m, offset }) => {
          m.position.x = ((t * 3 + offset) % 26) - 12.7;
        });
      });
      faultTag.material.opacity = 0.35 + 0.5 * pulse(t, 0.7);
    }
  };
}

// ── 08. CPU konveyeri va kesh ───────────────────────────────────────────────
export function buildCpu(meta) {
  const g = new THREE.Group();

  const stages = [
    ['Fetch', 'komandani o\'qish'],
    ['Decode', 'ma\'nosini ochish'],
    ['Execute', 'ALU hisoblaydi'],
    ['Memory', 'xotiraga murojaat'],
    ['Write', 'registrga yozish']
  ];
  const SW = 4.6, GAP = 5.2;
  const stageObjs = stages.map(([name, desc], i) => {
    const x = (i - 2) * GAP;
    const p = panel(SW, 3.4, 1.6, meta.color, { fill: 0.06, edgeOpacity: 0.5 });
    p.position.set(x, 6.6, 0);
    g.add(p);
    const nm = label(name, { size: 30, color: '#a5f3fc', weight: '600' });
    nm.position.set(x, 7.2, 1);
    g.add(nm);
    const ds = label(desc, { size: 20, color: '#64748b' });
    ds.position.set(x, 6.3, 1);
    g.add(ds);
    return p;
  });

  // Konveyer bo'ylab oquvchi komandalar
  const instColors = [0xf472b6, 0xfbbf24, 0x34d399, 0x60a5fa, 0xa78bfa];
  const insts = instColors.map((col, i) => {
    const grp = new THREE.Group();
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35, depthWrite: false })
    );
    grp.add(cube, wireBox(1.5, 1.5, 1.5, col, 0.9));
    g.add(grp);
    return { grp, offset: i * 0.2 };
  });

  const pipeTag = label('konveyer — 5 komanda bir vaqtda, turli bosqichlarda', { size: 23, color: '#94a3b8' });
  pipeTag.position.set(0, 4.3, 0);
  g.add(pipeTag);

  // Kesh ierarxiyasi: konsentrik ramkalar
  const caches = [
    ['L1', 2.6, '~4 takt', '#34d399'],
    ['L2', 4.6, '~14 takt', '#fbbf24'],
    ['L3', 6.6, '~40 takt', '#fb923c'],
    ['RAM', 8.6, '~200+ takt', '#f87171']
  ];
  const cacheRings = caches.map(([name, r, lat, col]) => {
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, r, r * 0.72, 0, Math.PI * 2).getPoints(64).map((p) => new THREE.Vector3(p.x, p.y, 0))
      ),
      lineMat(col, 0.55)
    );
    ring.position.set(0, -4.6, 0);
    g.add(ring);
    const nm = label(name, { size: 24, color: col });
    nm.position.set(0, -4.6 + r * 0.72 - 0.45, 0.2);
    g.add(nm);
    const lt = label(lat, { size: 19, color: '#64748b' });
    lt.position.set(r * 0.62, -4.6 + r * 0.5, 0.2);
    g.add(lt);
    return ring;
  });

  const core = orb(0.9, meta.color2, 0.9);
  core.position.set(0, -4.6, 0);
  g.add(core);
  const coreGlow = glowSprite(meta.color2, 4);
  coreGlow.material.opacity = 0.35;
  coreGlow.position.set(0, -4.6, 0);
  g.add(coreGlow);
  const coreTag = label('yadro', { size: 20, color: '#0f172a' });
  coreTag.position.set(0, -4.6, 1);
  g.add(coreTag);

  // Kesh so'rovi: yadrodan tashqariga chiqib qaytadi (miss → keyingi daraja)
  const req = glowSprite('#ffffff', 0.7);
  g.add(req);

  const cacheTag = label('kesh ierarxiyasi — RAM protsessordan ~100 barobar sekin', { size: 23, color: '#94a3b8' });
  cacheTag.position.set(0, -11.4, 0);
  g.add(cacheTag);

  // Tarmoqlanish taxmini
  const bp = panel(8.4, 2.2, 0.8, '#a78bfa', { fill: 0.08, edgeOpacity: 0.45 });
  bp.position.set(-11.6, -4.6, 0);
  g.add(bp);
  const bpTitle = label('branch prediction', { size: 22, color: '#c4b5fd' });
  bpTitle.position.set(-11.6, -4.1, 0.6);
  g.add(bpTitle);
  const bpOk = label('taxmin to\'g\'ri — konveyer to\'lmaydi', { size: 19, color: '#4ade80' });
  const bpBad = label('xato taxmin — konveyer tozalanadi', { size: 19, color: '#f87171' });
  bpOk.position.set(-11.6, -5.1, 0.6);
  bpBad.position.set(-11.6, -5.1, 0.6);
  g.add(bpOk, bpBad);

  const ooo = panel(8.4, 2.2, 0.8, '#38bdf8', { fill: 0.08, edgeOpacity: 0.45 });
  ooo.position.set(11.6, -4.6, 0);
  g.add(ooo);
  const oooTitle = label('out-of-order', { size: 22, color: '#7dd3fc' });
  oooTitle.position.set(11.6, -4.1, 0.6);
  g.add(oooTitle);
  const oooSub = label('tartibsiz bajarish', { size: 21, color: '#64748b' });
  oooSub.position.set(11.6, -5.1, 0.6);
  g.add(oooSub);

  return {
    group: g,
    update(t) {
      insts.forEach(({ grp, offset }, i) => {
        const k = (t * 0.35 + offset) % 1.25;
        if (k > 1) { grp.visible = false; return; }
        grp.visible = true;
        grp.position.set(-2 * GAP + k * 4 * GAP, 6.6, 1.4);
        grp.rotation.set(t * 0.8 + i, t * 0.6 + i, 0);
      });
      stageObjs.forEach((p, i) => {
        const active = insts.some(({ grp }) => grp.visible && Math.abs(grp.position.x - (i - 2) * GAP) < SW / 2);
        p.userData.fillMesh.material.opacity = active ? 0.2 : 0.05;
      });

      cacheRings.forEach((r, i) => { r.material.opacity = 0.3 + 0.35 * pulse(t, 1.3, i * 0.9); });
      coreGlow.material.opacity = 0.25 + 0.2 * pulse(t, 3);

      // So'rov L1 dan boshlab tashqariga, keyin qaytadi
      const cyc = (t * 0.42) % 1;
      const depth = cyc < 0.5 ? cyc * 2 : (1 - cyc) * 2;
      const rr = 1 + depth * 7.6;
      const ang = t * 1.6;
      req.position.set(Math.cos(ang) * rr, -4.6 + Math.sin(ang) * rr * 0.72, 0.3);

      const good = (t * 0.3) % 1 > 0.28; // taxminlarning ~85% i to'g'ri chiqadi
      bpOk.visible = good;
      bpBad.visible = !good;
      bp.userData.fillMesh.material.color.set(good ? 0x4ade80 : 0xf87171);
      ooo.userData.fillMesh.material.opacity = 0.06 + 0.1 * pulse(t, 1.7);
    }
  };
}

// ── 09. Raqamli mantiq ──────────────────────────────────────────────────────
export function buildLogic(meta) {
  const g = new THREE.Group();

  // Kirishlar
  const inputs = [
    { name: 'A', y: 6.4, val: 1 },
    { name: 'B', y: 3.6, val: 1 }
  ];
  const inObjs = inputs.map((inp) => {
    const o = orb(0.42, meta.color, 1);
    o.position.set(-12, inp.y, 0);
    g.add(o);
    const nm = label(inp.name, { size: 30, color: '#e9d5ff' });
    nm.position.set(-13.1, inp.y, 0);
    g.add(nm);
    const bit = label('1', { size: 26, color: '#4ade80', font: '"JetBrains Mono", monospace' });
    bit.position.set(-12, inp.y + 1, 0);
    g.add(bit);
    return { o, bit, inp };
  });

  // Gate quruvchi — klassik uchburchak korpus, uchi o'ngga qaragan
  const GATE_PTS = [
    new THREE.Vector3(-1.2, 1.3, 0),
    new THREE.Vector3(-1.2, -1.3, 0),
    new THREE.Vector3(1.2, 0, 0)
  ];
  const gate = (name, x, y, col) => {
    const grp = new THREE.Group();

    const geo = new THREE.BufferGeometry().setFromPoints(GATE_PTS);
    geo.setIndex([0, 1, 2]);
    geo.computeVertexNormals();
    const shape = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: col, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false
    }));
    grp.add(shape);

    const outline = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(GATE_PTS),
      lineMat(col, 0.85)
    );
    grp.add(outline);

    const nm = label(name, { size: 22, color: '#f1f5f9', weight: '700', height: 0.5 });
    nm.position.set(-0.32, 0, 0.2);
    grp.add(nm);

    grp.position.set(x, y, 0);
    g.add(grp);
    return { grp, shape };
  };

  const xor = gate('XOR', -4, 5, '#a78bfa');
  const and = gate('AND', -4, 1.4, '#f472b6');
  const sumNode = orb(0.42, '#4ade80', 1);
  sumNode.position.set(3.6, 5, 0);
  g.add(sumNode);
  const carryNode = orb(0.42, '#fbbf24', 1);
  carryNode.position.set(3.6, 1.4, 0);
  g.add(carryNode);

  const sumTag = label('S — yig\'indi biti  =  0', { size: 25, color: '#86efac' });
  sumTag.position.set(6.6, 5, 0);
  g.add(sumTag);
  const carryTag = label('C — o\'tkazish (carry)  =  1', { size: 25, color: '#fde68a' });
  carryTag.position.set(7, 1.4, 0);
  g.add(carryTag);
  const eq = label('1 + 1 = 10₂   →   yarim summator', { size: 24, color: '#94a3b8' });
  eq.position.set(0, -1.2, 0);
  g.add(eq);

  // Simlar
  const wires = [
    [new THREE.Vector3(-12, 6.4, 0), new THREE.Vector3(-8, 6.4, 0), new THREE.Vector3(-5.2, 5.4, 0)],
    [new THREE.Vector3(-12, 3.6, 0), new THREE.Vector3(-8, 3.6, 0), new THREE.Vector3(-5.2, 4.6, 0)],
    [new THREE.Vector3(-12, 6.4, 0), new THREE.Vector3(-9.5, 6.4, 0), new THREE.Vector3(-9.5, 1.8, 0), new THREE.Vector3(-5.2, 1.8, 0)],
    [new THREE.Vector3(-12, 3.6, 0), new THREE.Vector3(-10.5, 3.6, 0), new THREE.Vector3(-10.5, 1, 0), new THREE.Vector3(-5.2, 1, 0)],
    [new THREE.Vector3(-2.8, 5, 0), new THREE.Vector3(3.6, 5, 0)],
    [new THREE.Vector3(-2.8, 1.4, 0), new THREE.Vector3(3.6, 1.4, 0)]
  ].map((pts) => {
    const l = curveLine(pts, meta.color, 0.35, 40);
    g.add(l);
    return l;
  });
  const sparks = wires.map(() => {
    const s = glowSprite('#ffffff', 0.5);
    g.add(s);
    return s;
  });

  // Flip-flop — bitni saqlaydi
  const ff = panel(5.4, 3.2, 1.2, '#38bdf8', { fill: 0.08, edgeOpacity: 0.5 });
  ff.position.set(-9, -5.4, 0);
  g.add(ff);
  const ffTag = label('flip-flop', { size: 24, color: '#7dd3fc' });
  ffTag.position.set(-9, -4.5, 0.7);
  g.add(ffTag);
  const ffSub = label('1 bitni eslab qoladi', { size: 20, color: '#64748b' });
  ffSub.position.set(-9, -6.4, 0.7);
  g.add(ffSub);
  const ffBit = label('1', { size: 44, color: '#7dd3fc', font: '"JetBrains Mono", monospace', weight: '700' });
  ffBit.position.set(-9, -5.4, 0.7);
  g.add(ffBit);

  // Soat signali — kvadrat to'lqin
  const CLK_N = 240;
  const clkPos = new Float32Array(CLK_N * 3);
  const clkGeo = new THREE.BufferGeometry();
  clkGeo.setAttribute('position', new THREE.BufferAttribute(clkPos, 3));
  const clk = new THREE.Line(clkGeo, lineMat('#fbbf24', 0.85));
  clk.position.set(3.4, -5.4, 0);
  g.add(clk);
  const clkTag = label('soat signali — 4 GHz = sekundiga 4 000 000 000 qadam', { size: 22, color: '#94a3b8' });
  clkTag.position.set(3.4, -8, 0);
  g.add(clkTag);

  const aluTag = label('64-bitli qo\'shish uchun 64 ta shunday sxema zanjiri kerak — ALU', { size: 23, color: '#64748b' });
  aluTag.position.set(0, -10.2, 0);
  g.add(aluTag);

  return {
    group: g,
    update(t) {
      const beat = Math.floor(t * 2) % 2;
      inObjs.forEach(({ o }, i) => {
        o.material.color.set(0x4ade80);
        o.scale.setScalar(1 + 0.16 * pulse(t, 4, i));
      });
      xor.shape.material.opacity = 0.1 + 0.16 * pulse(t, 3, 0);
      and.shape.material.opacity = 0.1 + 0.16 * pulse(t, 3, 1.5);
      sumNode.material.color.set(0x334155);        // 1 XOR 1 = 0
      carryNode.material.color.set(0xfbbf24);      // 1 AND 1 = 1
      carryNode.scale.setScalar(1 + 0.2 * pulse(t, 4));

      sparks.forEach((s, i) => {
        const k = (t * 0.55 + i * 0.13) % 1;
        wires[i].userData.curve.getPoint(k, s.position);
        s.material.opacity = i === 4 ? 0.12 : Math.sin(k * Math.PI) * 0.9; // S = 0, ya'ni signal yo'q
      });

      ffBit.material.opacity = 0.55 + 0.45 * (beat ? 1 : 0.4);

      const arr = clk.geometry.attributes.position.array;
      for (let i = 0; i < CLK_N; i++) {
        const x = (i / (CLK_N - 1)) * 10 - 5;
        const phase = (x * 1.6 + t * 4) % 2;
        arr[i * 3] = x;
        arr[i * 3 + 1] = phase < 1 ? 0.9 : -0.9;
        arr[i * 3 + 2] = 0;
      }
      clk.geometry.attributes.position.needsUpdate = true;
    }
  };
}
