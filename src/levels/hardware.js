// 10–12 qatlamlar: CMOS tranzistor → kremniy kristalli va PN o'tish → kvant fizikasi.
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  points, orb, glowSprite, lineMat, pulse, clamp, lerp
} from '../lib/gfx.js';

// ── 10. CMOS tranzistor ─────────────────────────────────────────────────────
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

// ── 11. Kremniy kristalli, doping, PN o'tish ────────────────────────────────
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
    [[{ text: 'Console.WriteLine("Salom")  ishlaydi, chunki elektronlar shunday qonunga bo\'ysunadi.', color: '#e9d5ff', weight: '600' }]],
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
