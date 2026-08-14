// Butun loyihani bitta o'zi yetarli HTML faylga jamlaydi (tashqi so'rovlarsiz).
//
// Ishlatish:
//   node tools/build-artifact.mjs [chiqish-fayli.html]
//   node tools/build-artifact.mjs --full [chiqish-fayli.html]
//
// Odatda fragment chiqadi (doctype/html/body'siz) — Artifact o'z qobig'ini qo'shadi.
// `--full` bilan to'liq HTML hujjat chiqadi: uni shunchaki brauzerda ochsa bo'ladi,
// server ham, internet ham kerak emas (file:// da ham ishlaydi).
//
// three.js ES-modul sifatida keladi va oxirida bitta `export{...}` bloki bor.
// Uni olib tashlab, o'rniga `const THREE = {...}` yasaymiz — shunda bizning
// kodimiz bir xil `THREE.*` interfeysi bilan bitta modul ichida ishlayveradi.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const FULL = argv.includes('--full');
const OUT = argv.find((a) => !a.startsWith('--'))
  || join(ROOT, 'dist', FULL ? 'how-it-works.standalone.html' : 'how-it-works.html');

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

// Bog'liqlik tartibi muhim: bir faylga jamlanganda hammasi bitta blokka tushadi.
const MODULES = [
  'src/lib/gfx.js',
  'src/levels/heads/common.js',
  'src/content/spine.js',
  'src/content/heads/csharp.js',
  'src/content/heads/python.js',
  'src/content/heads/rust.js',
  'src/content/heads/go.js',
  'src/content/heads/javascript.js',
  'src/levels/heads/csharp.js',
  'src/levels/heads/python.js',
  'src/levels/heads/rust.js',
  'src/levels/heads/go.js',
  'src/levels/heads/javascript.js',
  'src/levels/spine/machine.js',
  'src/levels/spine/system.js',
  'src/levels/spine/hardware.js',
  'src/levels/spine/output.js',
  'src/languages.js',
  'src/main.js'
];

const [three, css, html, ...modules] = await Promise.all([
  read('vendor/three.module.min.js'),
  read('styles.css'),
  read('index.html'),
  ...MODULES.map(read)
]);

// Bizning kodimiz alohida blokda turadi: minifikatsiya qilingan three.js da bir harfli
// global nomlar ko'p (C, g, y …), blok ularni soya qiladi va to'qnashuv bo'lmaydi.
const bundle = [
  inlineThree(three),
  '{',
  ...modules.map(stripModuleSyntax),
  '}'
].join('\n');

// index.html dan faqat <body> ichini olamiz — Artifact o'z qobig'ini qo'shadi.
const bodyInner = html
  .slice(html.indexOf('<body>') + '<body>'.length, html.lastIndexOf('</body>'))
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .trim();

const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, 'how it works'])[1];

const page = `<title>${title}</title>
<style>
${css}
</style>

${bodyInner}

<script type="module">
${bundle}
</script>
`;

// Artifact sahifani o'zi <html>/<head>/<body> ichiga o'raydi; `--full` da esa
// hujjatni o'zimiz yopamiz, shunda fayl brauzerda to'g'ridan-to'g'ri ochiladi.
const out = FULL
  ? `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${page}</body>
</html>
`.replace('</style>\n', '</style>\n</head>\n<body>\n')
  : page;

await writeFile(OUT, out, 'utf8');
console.log(`${OUT} — ${(out.length / 1024 / 1024).toFixed(2)} MB`);
