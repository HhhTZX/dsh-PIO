// Engine regression: pulls the pure generator out of client.js and exercises it.
// Run with `npm test` (or `node test/engine.test.mjs`).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', 'client.js'), 'utf8');
const engine = src.split('// ===== ENGINE START =====')[1].split('// ===== ENGINE END =====')[0];
const make = new Function(engine + '\nreturn { generate: generate, compact: compact, probe: probe };');
const { generate, probe } = make();

let failures = 0;
function ok(cond, label) {
  if (!cond) { failures++; console.log('FAIL  ' + label); }
  else console.log('ok    ' + label);
}

const cases = [
  { chip: 'ESP32-DevKitC', os: 'windows', flash: 'ch340' },
  { chip: 'STM32F103C8T6', os: 'windows', flash: 'stlink' },
  { chip: 'CH32F103C8T6', os: 'windows', flash: 'ch340' },
  { chip: 'Arduino Uno', os: 'mac', flash: 'ch340' },
  { chip: 'GD32F103C8T6', os: 'linux', flash: 'jlink' },
  { chip: 'CH32V003', os: 'linux', flash: 'other' },
  { chip: 'STC89C52RC', os: 'windows', flash: 'ch340' },
  { chip: 'ESP32-S3', os: 'mac', flash: 'dfu' },
  { chip: 'RP2040', os: 'linux', flash: 'stlink' },
  { chip: 'Arduino Nano', os: 'windows', flash: 'ch340' },
  { chip: 'STM32F407VET6', os: 'windows', flash: 'jlink' },
  { chip: 'nRF52840', os: 'windows', flash: 'jlink' },
  { chip: 'ABC123', os: 'windows', flash: 'ch340' },
  { chip: 'ESP', os: 'linux', flash: 'ch340' },
  { chip: '', os: 'windows', flash: 'ch340' }
];

const outDir = path.join(here, 'out');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const statuses = {};
for (const c of cases) {
  const r = generate(c);
  statuses[r.status] = (statuses[r.status] || 0) + 1;
  const label = (c.chip || '<empty>') + ' / ' + c.os + ' / ' + c.flash;
  if (r.status === 'insufficient') {
    ok(r.reason === 'empty' || r.reason === 'unknown', label + ' → insufficient(' + r.reason + ')');
    continue;
  }
  const dir = path.join(outDir, (c.chip || 'empty').replace(/[^A-Za-z0-9]+/g, '_'));
  fs.mkdirSync(dir, { recursive: true });
  for (const f of r.files) {
    const p = path.join(dir, f.path);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, f.content, 'utf8');
  }
  ok(r.files.length === 3, label + ' → 3 files (' + r.status + ')');
  const ini = r.files[0].content;
  ok(/\[env:[a-z0-9_]+\]/.test(ini), label + ' → env name valid');
  ok(ini.indexOf('platform = ') > 0 && ini.indexOf('board = ') > 0, label + ' → platform+board present');
  ok(r.files[1].path === 'src/main.cpp' || r.files[1].path === 'src/main.c', label + ' → main path ' + r.files[1].path);
  ok(/create_and_open\.(bat|sh)$/.test(r.files[2].path), label + ' → script ' + r.files[2].path);
  const platformMarked = /^platform = .*\u3010\u6838\u5bf9\u4fee\u6539\u3011/m.test(ini);
  ok(platformMarked === (r.status === 'generic'), label + ' → platform line marked only on generic');
}

ok(statuses.matched >= 8, 'matched count ' + JSON.stringify(statuses));
ok(statuses.generic >= 4, 'generic count ' + JSON.stringify(statuses));
ok(statuses.insufficient === 3, 'insufficient count ' + JSON.stringify(statuses));

// The "信息不足" branch must not be a dead end: supplying core / vendor / flash
// has to turn into a template instead of the same error again.
const dead = generate({ chip: 'HC32F460', os: 'windows', flash: 'stlink' });
ok(dead.status === 'insufficient' && dead.reason === 'unknown', 'HC32 without details → insufficient');
const revived = generate({ chip: 'HC32F460', os: 'windows', flash: 'stlink', extra: 'Cortex-M4 小华半导体 Flash 512KB' });
ok(revived.status === 'generic', 'HC32 with details → generic template (' + revived.status + ')');
ok(revived.spec && revived.spec.family === 'cortexm', 'supplemented part uses the cortexm fallback');
ok(revived.files && /\u3010\u6838\u5bf9\u4fee\u6539\u3011/.test(revived.files[0].content), 'fallback ini is marked for review');
ok(revived.notes.some((n) => n.zh.indexOf('Cortex-M') >= 0), 'fallback explains what to replace');

// Framework routing: the 4th (optional) field must change ini + source, and refuse
// politely when a family has no such framework.
const fwCases = [
  ['STM32F103C8T6', 'hal', 'cmsis', 'src/main.c', 'cmsis-hal'],
  ['STM32F103C8T6', 'sdk', 'cmsis', 'src/main.c', 'cmsis-bare'],
  ['STM32F103C8T6', 'arduino', 'arduino', 'src/main.cpp', 'arduino'],
  ['ESP32-DevKitC', 'sdk', 'espidf', 'src/main.c', 'espidf'],
  ['ESP32-DevKitC', 'auto', 'arduino', 'src/main.cpp', 'arduino'],
  ['STC89C52RC', 'auto', 'sdcc', 'src/main.c', 'c51'],
  ['Arduino Uno', 'auto', 'arduino', 'src/main.cpp', 'arduino']
];
for (const [chip, fw, iniFw, mainPath, kind] of fwCases) {
  const r = generate({ chip, os: 'windows', flash: 'stlink', framework: fw });
  const label = chip + ' + ' + fw;
  ok(r.spec.framework === iniFw, label + ' → framework = ' + r.spec.framework + ' (want ' + iniFw + ')');
  ok(r.files[1].path === mainPath, label + ' → ' + r.files[1].path);
  ok(r.spec.mainKind === kind, label + ' → kind ' + r.spec.mainKind);
}

const unsupported = generate({ chip: 'ESP32-DevKitC', os: 'windows', flash: 'ch340', framework: 'hal' });
ok(unsupported.spec.framework === 'arduino', 'ESP32 + HAL falls back to arduino');
ok(unsupported.notes.some((n) => n.zh.indexOf('不支持') >= 0), 'ESP32 + HAL explains the fallback');

const halSource = generate({ chip: 'STM32F103C8T6', os: 'windows', flash: 'stlink', framework: 'hal' });
ok(halSource.files[1].content.indexOf('STM32Cube HAL') >= 0, 'HAL source explains Cube HAL is not bundled');
ok(halSource.files[1].content.indexOf('stm32f1xx.h') > 0, 'HAL source includes the CMSIS device header');
const f4Source = generate({ chip: 'STM32F407VET6', os: 'windows', flash: 'jlink', framework: 'sdk' });
ok(f4Source.files[1].content.indexOf('stm32f4xx.h') > 0, 'F4 uses the F4 CMSIS header');
ok(f4Source.files[1].content.indexOf('MODER') > 0, 'F4 uses MODER, not CRH');

// The probe drives the live hint under the framework select.
ok(probe({ chip: 'STM32F103C8T6' }).frameworks.join(',') === 'arduino,hal,sdk', 'probe lists STM32 frameworks');
ok(probe({ chip: 'Arduino Uno' }).frameworks.join(',') === 'arduino', 'probe limits AVR to arduino');
ok(probe({ chip: '' }).status === 'empty', 'probe reports an empty chip');

// No unresolved template holes, and unix scripts must not carry CRLF.
for (const d of fs.readdirSync(outDir)) {
  const dir = path.join(outDir, d);
  for (const f of fs.readdirSync(dir, { recursive: true })) {
    const p = path.join(dir, f);
    if (!fs.statSync(p).isFile()) continue;
    const text = fs.readFileSync(p, 'utf8');
    ok(text.indexOf('undefined') < 0, 'no "undefined" in ' + d + '/' + f);
    ok(!(f.endsWith('.sh') && text.indexOf('\r') >= 0), 'unix script has no CR: ' + d + '/' + f);
  }
}

console.log('\nstatuses: ' + JSON.stringify(statuses));
console.log(failures === 0 ? 'ALL PASS' : failures + ' FAILURES');
process.exit(failures === 0 ? 0 : 1);
