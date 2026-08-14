// Butun loyihani bitta o'zi yetarli HTML faylga jamlaydi (tashqi so'rovlarsiz).
// Ishlatish:  node tools/build-artifact.mjs [chiqish-fayli.html]
//
// three.js ES-modul sifatida keladi va oxirida bitta `export{...}` bloki bor.
// Uni olib tashlab, o'rniga `const THREE = {...}` yasaymiz — shunda bizning
// kodimiz bir xil `THREE.*` interfeysi bilan bitta modul ichida ishlayveradi.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.argv[2] || join(ROOT, 'dist', 'how-it-works.html');

const read = (p) => readFile(join(ROOT, p), 'utf8');

/** three.module.min.js dan `export{a as B, ...}` ni `const THREE = {B: a, ...}` ga aylantiradi. */
function inlineThree(src) {
  const i = src.lastIndexOf('export{');
  if (i < 0) throw new Error('three.js ichida export bloki topilmadi');
  const end = src.indexOf('}', i);
  const body = src.slice(i + 'export{'.length, end);

  const entries = body.split(',').map((part) => {
    const m = part.trim().match(/^(\S+)\s+as\s+(\S+)$/);
    return m ? `${m[2]}:${m[1]}` : `${part.trim()}`;
  });

  return src.slice(0, i) + `\nconst THREE = {${entries.join(',')}};\n`;
}

/** Nisbiy `import` larni olib tashlab, modullarni bog'liqlik tartibida ulaydi. */
function stripModuleSyntax(src) {
  return src
    .replace(/^\s*import[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s+(const|function|let|class)\s/gm, '$1 ')
    .replace(/^\s*export\s*\{[^}]*\};?\s*$/gm, '');
}

const [three, css, gfx, content, software, system, hardware, main, html] = await Promise.all([
  read('vendor/three.module.min.js'),
  read('styles.css'),
  read('src/lib/gfx.js'),
  read('src/content.js'),
  read('src/levels/software.js'),
  read('src/levels/system.js'),
  read('src/levels/hardware.js'),
  read('src/main.js'),
  read('index.html')
]);

// Bizning kodimiz alohida blokda turadi: minifikatsiya qilingan three.js da bir harfli
// global nomlar ko'p (C, g, y …), blok ularni soya qiladi va to'qnashuv bo'lmaydi.
const bundle = [
  inlineThree(three),
  '{',
  ...[gfx, content, software, system, hardware, main].map(stripModuleSyntax),
  '}'
].join('\n');

// index.html dan faqat <body> ichini olamiz — Artifact o'z qobig'ini qo'shadi.
const bodyInner = html
  .slice(html.indexOf('<body>') + '<body>'.length, html.lastIndexOf('</body>'))
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .trim();

const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, 'how it works'])[1];

const out = `<title>${title}</title>
<style>
${css}
</style>

${bodyInner}

<script type="module">
${bundle}
</script>
`;

await writeFile(OUT, out, 'utf8');
console.log(`${OUT} — ${(out.length / 1024 / 1024).toFixed(2)} MB`);
