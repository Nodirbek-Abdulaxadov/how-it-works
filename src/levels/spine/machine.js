// Umurtqaning yuqori uchi: mashina kodi va chaqiruvlar steki.
// Bu ikkisi tilga bog'liq emas — faqat bir nechta yorliq `meta.lang` dan keladi.
import * as THREE from 'three';
import {
  textPlane, label, segments, curveLine, wireBox, panel,
  points, orb, glowSprite, lineMat, retext, pulse, clamp, lerp
} from '../../lib/gfx.js';

// ── 05. Mashina kodi ────────────────────────────────────────────────────────
export function buildMachine(meta) {
  const g = new THREE.Group();

  const asm = textPlane(
    [[{ text: 'mov ', color: '#fbbf24', weight: '600' }, { text: 'rcx, rax', color: '#e2e8f0' }]],
    { size: 44, height: 1.6, align: 'center' }
  );
  asm.position.set(0, 7.6, 0);
  g.add(asm);

  const arrow = label('↓  xotirada esa atigi 3 bayt', { size: 24, color: '#94a3b8' });
  arrow.position.set(0, 6.2, 0);
  g.add(arrow);

  // Uch bayt: REX / opcode / ModRM — rangli qismlarga ajratilgan
  const parts = [
    ['48', 'REX.W', 'prefiks — 64-bit rejim', '#f472b6'],
    ['89', 'opcode', 'MOV r/m64, r64', '#fbbf24'],
    ['C8', 'ModR/M', 'manba: rcx, maqsad: rax', '#34d399']
  ];
  const byteGroups = parts.map(([byte, name, desc, col], i) => {
    const grp = new THREE.Group();
    const box = panel(4.6, 3, 1.2, col, { fill: 0.12, edgeOpacity: 0.75 });
    grp.add(box);
    const bt = label(byte, { size: 52, color: col, font: '"JetBrains Mono", monospace', weight: '700' });
    bt.position.set(0, 0.35, 0.8);
    grp.add(bt);
    const bin = label(parseInt(byte, 16).toString(2).padStart(8, '0'), { size: 22, color: '#64748b', font: '"JetBrains Mono", monospace' });
    bin.position.set(0, -0.9, 0.8);
    grp.add(bin);
    const nm = label(name, { size: 24, color: col });
    nm.position.set(0, -2.3, 0.8);
    grp.add(nm);
    const ds = label(desc, { size: 21, color: '#64748b' });
    ds.position.set(0, -3.2, 0.8);
    grp.add(ds);
    grp.position.set(-6.6 + i * 6.6, 2.4, 0);
    g.add(grp);
    return { grp, box };
  });

  // Registr fayli
  const regs = ['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi', 'rbp', 'rsp'];
  const regMeshes = regs.map((r, i) => {
    const row = textPlane(
      [[{ text: r.padEnd(5), color: '#7dd3fc' }, { text: '0x' + (i * 0x1040 + 0x2a).toString(16).padStart(12, '0'), color: '#94a3b8' }]],
      { size: 24, height: 0.62, bg: 'rgba(10,16,32,0.8)', border: 'rgba(148,163,184,0.15)', padX: 14, padY: 8 }
    );
    row.position.set(-8.5, -4.6 - i * 0.85, 0);
    g.add(row);
    return row;
  });
  const regTag = label('registrlar — CPU ichidagi eng tez xotira', { size: 23, color: '#94a3b8' });
  regTag.position.set(-8.5, -3.6, 0);
  g.add(regTag);

  // Ikkilik "yomg'ir"
  const N = 220;
  const pos = new Float32Array(N * 3);
  const speeds = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = 4 + Math.random() * 13;
    pos[i * 3 + 1] = -3 - Math.random() * 9;
    pos[i * 3 + 2] = -2 + Math.random() * 3;
    speeds[i] = 1.2 + Math.random() * 2.6;
  }
  const rain = points(pos, meta.color2, 0.3, 0.75);
  g.add(rain);
  const rainTag = label('… va bularning hammasi 0 va 1', { size: 23, color: '#94a3b8' });
  rainTag.position.set(10.5, -3.6, 0);
  g.add(rainTag);

  return {
    group: g,
    update(t, dt) {
      byteGroups.forEach(({ grp, box }, i) => {
        const p = pulse(t, 2, i * 1.1);
        box.userData.fillMesh.material.opacity = 0.09 + p * 0.12;
        grp.position.y = 2.4 + Math.sin(t * 1.4 + i) * 0.12;
      });
      regMeshes.forEach((r, i) => {
        r.material.opacity = i === 0 || i === 2 ? 0.55 + 0.45 * pulse(t, 2.2, i) : 0.45;
      });
      const arr = rain.geometry.attributes.position.array;
      for (let i = 0; i < N; i++) {
        arr[i * 3 + 1] -= speeds[i] * dt;
        if (arr[i * 3 + 1] < -12) arr[i * 3 + 1] = -3 + Math.random() * 1.5;
      }
      rain.geometry.attributes.position.needsUpdate = true;
    }
  };
}

// ── 06. Chaqiruvlar steki ───────────────────────────────────────────────────
export function buildStack(meta) {
  const g = new THREE.Group();

  const COL = -7.4;          // stek ustuni markazi
  const FW = 8.6, FH = 2.3, FGAP = 0.34;
  const topY = 6.4;
  const yOf = (i) => topY - i * (FH + FGAP);

  const hi = label('yuqori manzil   0x7fff_ffff_e000', { size: 19, color: '#64748b' });
  hi.position.set(COL, 8.9, 0);
  g.add(hi);
  const grow = label('stek pastga o\'sadi', { size: 21, color: meta.color });
  grow.position.set(COL, 8.1, 0);
  g.add(grow);

  // Chap tomonda pastga qaragan o'q
  const axisX = COL - FW / 2 - 1.5;
  g.add(segments([
    new THREE.Vector3(axisX, 7.4, 0), new THREE.Vector3(axisX, -5.4, 0),
    new THREE.Vector3(axisX, -5.4, 0), new THREE.Vector3(axisX - 0.42, -4.6, 0),
    new THREE.Vector3(axisX, -5.4, 0), new THREE.Vector3(axisX + 0.42, -4.6, 0)
  ], '#475569', 0.7));

  // 2- va 3-kadr tilga qarab almashadi (setLang), qolgani umumiy
  const frameRows = (lang) => [
    ['main()', 'birinchi kadr', '#a5f3fc'],
    [lang.call, 'argument: "Salom"', '#93c5fd'],
    [lang.runtime, lang.runtimeName, '#93c5fd'],
    ['write(1, buf, 6)', 'eng yangi kadr', '#7dd3fc']
  ];
  const FRAMES = frameRows(meta.lang);

  const frameObjs = FRAMES.map(([name, sub, col], i) => {
    const box = panel(FW, FH, 0.9, col, { fill: 0.07, edgeOpacity: 0.55 });
    box.position.set(COL, yOf(i), 0);
    g.add(box);
    const txt = textPlane(
      [
        [{ text: name, color: col, weight: '600' }],
        [{ text: sub, color: '#64748b' }]
      ],
      { size: 24, height: 1.35, align: 'center' }
    );
    txt.position.set(COL, yOf(i), 0.7);
    g.add(txt);
    return { box, txt, i };
  });

  // rbp / rsp ko'rsatkichlari
  const ptr = (txt, col) => {
    const grp = new THREE.Group();
    const line = segments([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.5, 0, 0)], col, 0.9);
    grp.add(line);
    const tag = label(txt, { size: 22, color: col, weight: '600' });
    tag.position.set(2.5, 0, 0);
    grp.add(tag);
    g.add(grp);
    return grp;
  };
  const rbp = ptr('rbp — kadr asosi', '#fbbf24');
  const rsp = ptr('rsp — stek cho\'qqisi', '#4ade80');

  // ---- O'ngda: bitta kadr ichi ----
  const slotTitle = label('bitta kadr ichida nima bor', { size: 24, color: '#cbd5e1' });
  slotTitle.position.set(7.4, 7.4, 0);
  g.add(slotTitle);

  const SLOTS = [
    ['[rbp+16]', 'argument: "Salom"', '#a5f3fc'],
    ['[rbp+8]', 'qaytish manzili → 0x7f3a1c40', '#fbbf24'],
    ['[rbp]', 'saqlangan rbp', '#94a3b8'],
    ['[rbp-8]', 'lokal: n = 6', '#86efac'],
    ['[rbp-16]', 'lokal: buf', '#86efac']
  ];
  const slotObjs = SLOTS.map(([addr, what, col], i) => {
    const row = textPlane(
      [[{ text: addr.padEnd(10), color: '#64748b' }, { text: what, color: col }]],
      { size: 24, height: 0.78, bg: 'rgba(9,14,28,0.86)', border: 'rgba(148,163,184,0.16)', padX: 16, padY: 10 }
    );
    row.position.set(7.4, 5.9 - i * 1.15, 0);
    g.add(row);
    return row;
  });

  const callRet = textPlane(
    [
      [{ text: 'call', color: '#fbbf24', weight: '600' }, { text: '  →  qaytish manzilini stekka qo\'yadi', color: '#94a3b8' }],
      [{ text: 'ret ', color: '#fbbf24', weight: '600' }, { text: '  →  uni yechib, o\'sha manzilga qaytadi', color: '#94a3b8' }]
    ],
    { size: 23, height: 1.5, align: 'left' }
  );
  callRet.position.set(7.4, -1.2, 0);
  g.add(callRet);

  // ---- Pastda: stek to'lib ketishi ----
  const ovTitle = label('cheksiz rekursiya', { size: 22, color: '#fca5a5' });
  ovTitle.position.set(7.4, -3.6, 0);
  g.add(ovTitle);

  const OV_N = 15;
  const ovBars = [];
  for (let i = 0; i < OV_N; i++) {
    const bar = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 0.24),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0, depthWrite: false })
    );
    bar.position.set(7.4, -4.4 - i * 0.36, 0);
    g.add(bar);
    ovBars.push(bar);
  }
  const guard = segments([
    new THREE.Vector3(7.4 - 3.6, -10.2, 0), new THREE.Vector3(7.4 + 3.6, -10.2, 0)
  ], '#f87171', 0.8);
  g.add(guard);
  const guardTag = label('himoya sahifasi (guard page)', { size: 19, color: '#f87171' });
  guardTag.position.set(7.4, -10.9, 0);
  g.add(guardTag);
  const boom = label('StackOverflowException', { size: 26, color: '#fecaca', weight: '700' });
  boom.position.set(7.4, -8.6, 0.6);
  boom.material.opacity = 0;
  g.add(boom);

  const note = textPlane(
    [[{ text: '"push" aslida shunchaki rsp ni kamaytirish — stek oddiy xotira sohasi xolos.', color: '#94a3b8' }]],
    { size: 24, height: 0.78, align: 'center' }
  );
  note.position.set(0, -12.6, 0);
  g.add(note);

  return {
    group: g,
    // Til almashganda faqat ikkita kadr yorlig'i yangilanadi
    setLang(lang) {
      frameRows(lang).forEach(([name, sub, col], i) => {
        if (i !== 1 && i !== 2) return;
        retext(frameObjs[i].txt, [
          [{ text: name, color: col, weight: '600' }],
          [{ text: sub, color: '#64748b' }]
        ], { size: 24, height: 1.35, align: 'center' });
      });
    },
    update(t) {
      // Ikki chuqur kadr navbat bilan push/pop bo'ladi
      const phase = (t * 0.34) % 1;
      const depth = phase < 0.42 ? 2 + Math.floor(phase / 0.21) : phase < 0.62 ? 4 : 4 - Math.ceil((phase - 0.62) / 0.19);
      const shown = clamp(depth, 2, 4);

      frameObjs.forEach(({ box, txt, i }) => {
        const on = i < shown;
        box.visible = on;
        txt.visible = on;
        const fresh = i === shown - 1;
        box.userData.fillMesh.material.opacity = fresh ? 0.2 : 0.06;
        txt.material.opacity = fresh ? 1 : 0.62;
      });

      const deepest = shown - 1;
      rbp.position.set(COL + FW / 2 + 0.3, yOf(deepest) + FH / 2 - 0.25, 0.4);
      rsp.position.set(COL + FW / 2 + 0.3, yOf(deepest) - FH / 2 + 0.25, 0.4);

      slotObjs.forEach((r, i) => {
        r.material.opacity = 0.55 + 0.45 * pulse(t, 1.6, i * 0.6);
      });

      // Rekursiya stekni to'ldiradi, keyin himoya sahifasiga uriladi
      const fill = (t * 0.19) % 1;
      const filled = Math.floor(fill * (OV_N + 5));
      ovBars.forEach((b, i) => {
        b.material.opacity = i < filled ? 0.75 : 0;
        b.material.color.set(i > OV_N - 5 ? 0xf87171 : 0x60a5fa);
      });
      const overflowed = filled >= OV_N;
      boom.material.opacity = overflowed ? 0.6 + 0.4 * pulse(t, 9) : 0;
      guard.material.opacity = overflowed ? 0.4 + 0.5 * pulse(t, 9) : 0.35;
    }
  };
}
