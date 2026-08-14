// Tillar reyestri: har bir til o'z "boshi"ni beradi, undan pastda umumiy
// umurtqa (SPINE) keladi. Qatlam raqamlari hisoblab chiqariladi, chunki
// boshlarning uzunligi har xil (C# da 4 ta, qolganlarida 3 ta).

import { SPINE } from './content/spine.js';

import { CSHARP } from './content/heads/csharp.js';
import { PYTHON } from './content/heads/python.js';
import { RUST } from './content/heads/rust.js';
import { GO } from './content/heads/go.js';
import { JAVASCRIPT } from './content/heads/javascript.js';

// Nomlangan importlar: bitta faylga jamlanganda ular to'g'ridan-to'g'ri
// yuqori darajadagi nomlarga aylanadi (namespace import bunday ishlamaydi).
import { buildSource, buildAst, buildIl, buildJit } from './levels/heads/csharp.js';
import { buildPySource, buildPyBytecode, buildPyEval } from './levels/heads/python.js';
import { buildRsSource, buildRsBorrow, buildRsCodegen } from './levels/heads/rust.js';
import { buildGoSource, buildGoCompile, buildGoRuntime } from './levels/heads/go.js';
import { buildJsSource, buildJsIgnition, buildJsTurbofan } from './levels/heads/javascript.js';

import { buildMachine, buildStack } from './levels/spine/machine.js';
import { buildKernel, buildOs, buildCpu, buildLogic } from './levels/spine/system.js';
import { buildGates, buildTransistor, buildMemory, buildSilicon, buildQuantum } from './levels/spine/hardware.js';
import { buildScreen } from './levels/spine/output.js';

export const LANGUAGES = [CSHARP, PYTHON, RUST, GO, JAVASCRIPT];

// Qatlam `id` si bo'yicha quruvchi funksiya. Umurtqa hamma til uchun bir xil.
const BUILDERS = {
  // umumiy
  machine: buildMachine, stack: buildStack,
  kernel: buildKernel, os: buildOs, cpu: buildCpu, logic: buildLogic,
  gates: buildGates, transistor: buildTransistor, memory: buildMemory,
  silicon: buildSilicon, quantum: buildQuantum, screen: buildScreen,

  // C#
  source: buildSource, ast: buildAst, il: buildIl, jit: buildJit,

  // Python
  'py-source': buildPySource, 'py-bytecode': buildPyBytecode, 'py-eval': buildPyEval,

  // Rust
  'rs-source': buildRsSource, 'rs-borrow': buildRsBorrow, 'rs-codegen': buildRsCodegen,

  // Go
  'go-source': buildGoSource, 'go-compile': buildGoCompile, 'go-runtime': buildGoRuntime,

  // JavaScript
  'js-source': buildJsSource, 'js-ignition': buildJsIgnition, 'js-turbofan': buildJsTurbofan
};

export const byId = (id) => LANGUAGES.find((l) => l.id === id) || LANGUAGES[0];

/** Tanlangan til uchun to'liq qatlamlar ro'yxati: bosh + umurtqa. */
export function levelsFor(lang) {
  return [...lang.levels, ...SPINE].map((level, i) => ({
    ...level,
    lang: lang.lang,                                   // tilga xos yorliqlar
    index: i,
    number: String(i + 1).padStart(2, '0'),
    build: BUILDERS[level.id]
  }));
}

/** Bosh qatlamlar soni — umurtqa shu qadar pastdan boshlanadi. */
export const headLength = (lang) => lang.levels.length;
