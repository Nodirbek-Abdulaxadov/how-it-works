// Til boshlarida takrorlanadigan qismlar: kod paneli, karta ustuni, oqim o'qi.
import * as THREE from 'three';
import { textPlane, label, segments, panel, glowSprite, curveLine } from '../../lib/gfx.js';

// Sintaksis ranglari — barcha tillar uchun bir xil rol taqsimoti
export const PAL = {
  key: '#c084fc',    // kalit so'zlar
  type: '#5eead4',   // turlar va modullar
  str: '#fca5a5',    // satrlar
  num: '#fbbf24',    // sonlar
  id: '#e2e8f0',     // identifikatorlar
  fn: '#93c5fd',     // funksiya nomlari
  cm: '#64748b',     // izohlar
  dim: '#64748b'     // punktuatsiya
};

/** Fayl yorlig'i bilan kod paneli. */
export function codePanel(g, code, { x = 0, y = 3, height = 8, file, accent = '#6ee7ff' } = {}) {
  const plane = textPlane(code, {
    size: 34, height, bg: 'rgba(9,14,28,0.92)',
    border: `${accent}44`, padX: 40, padY: 30
  });
  plane.position.set(x, y, 0);
  g.add(plane);

  if (file) {
    const [pw, ph] = plane.userData.size;
    const tab = label(file, { size: 26, color: accent, font: '"JetBrains Mono", monospace' });
    tab.position.set(x - pw / 2 + 2.2, y + ph / 2 + 0.85, 0.1);
    g.add(tab);
  }
  return plane;
}

/** Ustun bo'lib turadigan kartalar (bayt-kod, IR, komandalar uchun). */
export function cardColumn(g, items, { x = 0, yTop = 6, gap = 1.3, width = 26, accent = '#7dd3fc' } = {}) {
  return items.map(([main, side], i) => {
    const rows = [[
      { text: main.padEnd(width - String(side || '').length), color: accent, weight: '600' },
      { text: side || '', color: '#64748b' }
    ]];
    const card = textPlane(rows, {
      size: 25, height: 0.8, bg: 'rgba(10,16,32,0.88)',
      border: `${accent}33`, padX: 16, padY: 10
    });
    card.position.set(x, yTop - i * gap, 0.2);
    g.add(card);
    return card;
  });
}

/** Ikki nuqta orasidagi izohli o'q. */
export function flowArrow(g, x1, x2, y, text, color = '#475569') {
  g.add(segments([
    new THREE.Vector3(x1, y, 0), new THREE.Vector3(x2, y, 0),
    new THREE.Vector3(x2, y, 0), new THREE.Vector3(x2 - 0.5, y + 0.32, 0),
    new THREE.Vector3(x2, y, 0), new THREE.Vector3(x2 - 0.5, y - 0.32, 0)
  ], color, 0.7));
  if (text) {
    const l = label(text, { size: 20, color: '#64748b' });
    l.position.set((x1 + x2) / 2, y + 0.8, 0);
    g.add(l);
  }
}

/** Sarlavhali quti — bosqichlarni ajratish uchun. */
export function stageBox(g, { x, y, w, h, title, color, fill = 0.05 }) {
  const p = panel(w, h, 0.8, color, { fill, edgeOpacity: 0.45 });
  p.position.set(x, y, -0.3);
  g.add(p);
  if (title) {
    const t = label(title, { size: 22, color });
    t.position.set(x, y + h / 2 + 0.6, 0);
    g.add(t);
  }
  return p;
}

/** Egri yo'l bo'ylab yuguruvchi yorug'lik nuqtasi. */
export function traveller(g, points, color = '#ffffff', size = 0.6, opacity = 0.3) {
  const line = curveLine(points, color, opacity, 40);
  g.add(line);
  const dot = glowSprite(color, size);
  g.add(dot);
  return { line, dot, curve: line.userData.curve };
}
