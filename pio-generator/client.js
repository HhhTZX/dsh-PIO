/**
 * PIO 工程生成器 — Client half.
 *
 * Everything here is pure browser code: it renders one page in
 * Settings → Plugins and turns three answers into copy-ready project text.
 * It never scans serial ports, never reads hardware, never runs a command.
 */
window.__ModuleLoader__.load({
  id: 'pio-generator',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // ===== ENGINE START =====
    // Pure, framework-free generator. No React, no DOM, no network.

    var OS_OPTIONS = [
      { id: 'windows', zh: 'Windows', en: 'Windows', port: 'COM3' },
      { id: 'mac', zh: 'Mac', en: 'macOS', port: '/dev/tty.usbserial-0001' },
      { id: 'linux', zh: 'Linux', en: 'Linux', port: '/dev/ttyUSB0' }
    ];

    var FLASH_OPTIONS = [
      { id: 'ch340', zh: 'CH340 串口', en: 'CH340 serial' },
      { id: 'stlink', zh: 'ST-Link', en: 'ST-Link' },
      { id: 'jlink', zh: 'J-Link', en: 'J-Link' },
      { id: 'dfu', zh: 'USB DFU', en: 'USB DFU' },
      { id: 'other', zh: '其他', en: 'Other' }
    ];

    var FRAMEWORK_OPTIONS = [
      { id: 'auto', zh: '自动（跟随芯片）', en: 'Auto (by chip)' },
      { id: 'arduino', zh: 'Arduino', en: 'Arduino' },
      { id: 'hal', zh: 'HAL（厂商 HAL）', en: 'Vendor HAL' },
      { id: 'sdk', zh: '裸机 SDK', en: 'Bare-metal SDK' }
    ];

    // Which frameworks each family can actually build. Anything else is refused
    // with an explicit fallback instead of a silently broken platformio.ini.
    var FRAMEWORK_SUPPORT = {
      esp32: ['arduino', 'sdk'],
      esp8266: ['arduino'],
      avr: ['arduino'],
      stm32: ['arduino', 'hal', 'sdk'],
      stm32clone: ['arduino', 'hal', 'sdk'],
      cortexm: ['arduino', 'hal', 'sdk'],
      rp2040: ['arduino'],
      nrf: ['arduino'],
      teensy: ['arduino'],
      sam: ['arduino'],
      ch32v: ['arduino'],
      mcs51: ['sdk']
    };

    // PlatformIO board ids verified against the boards catalog.
    var BOARDS = [
      // ---- ESP32 ----
      { id: 'esp32dev', name: 'ESP32-DevKitC (ESP32-WROOM-32)', platform: 'espressif32', framework: 'arduino', family: 'esp32', mcu: 'ESP32',
        aliases: ['esp32dev', 'esp32', 'esp32devkit', 'esp32devkitc', 'esp32wroom', 'wroom32', 'esp32board'],
        led: 'ESP32 DevKit 板载 LED 一般在 GPIO2' },
      { id: 'esp32-s3-devkitc-1', name: 'ESP32-S3-DevKitC-1', platform: 'espressif32', framework: 'arduino', family: 'esp32', mcu: 'ESP32-S3',
        aliases: ['esp32s3devkitc1', 'esp32s3', 'esp32s3devkit', 's3devkitc'], led: 'ESP32-S3-DevKitC-1 板载 RGB 灯在 GPIO38/48，普通 LED 用 GPIO2' },
      { id: 'esp32-c3-devkitm-1', name: 'ESP32-C3-DevKitM-1', platform: 'espressif32', framework: 'arduino', family: 'esp32', mcu: 'ESP32-C3',
        aliases: ['esp32c3devkitm1', 'esp32c3', 'esp32c3devkit'], led: 'ESP32-C3 板载 LED 一般在 GPIO8（低电平点亮）' },
      { id: 'esp32-s2-saola-1', name: 'ESP32-S2-Saola-1', platform: 'espressif32', framework: 'arduino', family: 'esp32', mcu: 'ESP32-S2',
        aliases: ['esp32s2saola1', 'esp32s2', 'saola1'], led: 'ESP32-S2-Saola-1 板载 LED 在 GPIO18' },
      { id: 'nodemcu-32s', name: 'NodeMCU-32S', platform: 'espressif32', framework: 'arduino', family: 'esp32', mcu: 'ESP32',
        aliases: ['nodemcu32s', 'nodemcu32', 'esp32nodemcu'], led: 'NodeMCU-32S 板载 LED 在 GPIO2' },
      { id: 'wemos_d1_mini32', name: 'WEMOS D1 mini32', platform: 'espressif32', framework: 'arduino', family: 'esp32', mcu: 'ESP32',
        aliases: ['wemosd1mini32', 'd1mini32', 'd1miniesp32'], led: 'D1 mini32 板载 LED 在 GPIO2' },
      { id: 'lolin_d32', name: 'LOLIN D32', platform: 'espressif32', framework: 'arduino', family: 'esp32', mcu: 'ESP32',
        aliases: ['lolind32', 'd32'], led: 'LOLIN D32 板载 LED 在 GPIO5' },

      // ---- ESP8266 ----
      { id: 'nodemcuv2', name: 'NodeMCU v2 (ESP8266)', platform: 'espressif8266', framework: 'arduino', family: 'esp8266', mcu: 'ESP8266',
        aliases: ['nodemcuv2', 'nodemcu', 'esp8266nodemcu', 'esp8266'], led: 'NodeMCU 板载 LED 在 GPIO2（丝印 D4，低电平点亮）' },
      { id: 'd1_mini', name: 'WEMOS D1 mini (ESP8266)', platform: 'espressif8266', framework: 'arduino', family: 'esp8266', mcu: 'ESP8266',
        aliases: ['d1mini', 'wemosd1mini', 'esp8266d1mini'], led: 'D1 mini 板载 LED 在 GPIO2（D4，低电平点亮）' },
      { id: 'esp12e', name: 'ESP-12E / ESP-12F', platform: 'espressif8266', framework: 'arduino', family: 'esp8266', mcu: 'ESP8266',
        aliases: ['esp12e', 'esp12f', 'esp12', 'esp8266esp12'], led: 'ESP-12E/F 模组没有板载 LED，接在 GPIO2 或 GPIO5 上' },
      { id: 'esp01_1m', name: 'ESP-01 (1M)', platform: 'espressif8266', framework: 'arduino', family: 'esp8266', mcu: 'ESP8266',
        aliases: ['esp01', 'esp011m', 'esp826601'], led: 'ESP-01 板载 LED 在 GPIO2，注意它接在 TX 附近，串口输出会影响它' },

      // ---- AVR ----
      { id: 'uno', name: 'Arduino Uno R3', platform: 'atmelavr', framework: 'arduino', family: 'avr', mcu: 'ATmega328P',
        aliases: ['uno', 'arduinouno', 'unor3', 'arduinounor3'], led: 'Uno 板载 LED 在 D13（LED_BUILTIN）' },
      { id: 'nanoatmega328', name: 'Arduino Nano (ATmega328P)', platform: 'atmelavr', framework: 'arduino', family: 'avr', mcu: 'ATmega328P',
        aliases: ['nanoatmega328', 'nano', 'arduinonano', 'nanov3'], led: 'Nano 板载 LED 在 D13（LED_BUILTIN）' },
      { id: 'megaatmega2560', name: 'Arduino Mega 2560', platform: 'atmelavr', framework: 'arduino', family: 'avr', mcu: 'ATmega2560',
        aliases: ['megaatmega2560', 'mega2560', 'arduinomega', 'arduinomega2560'], led: 'Mega 2560 板载 LED 在 D13（LED_BUILTIN）' },
      { id: 'leonardo', name: 'Arduino Leonardo', platform: 'atmelavr', framework: 'arduino', family: 'avr', mcu: 'ATmega32U4',
        aliases: ['leonardo', 'arduinoleonardo'], led: 'Leonardo 板载 LED 在 D13（LED_BUILTIN）' },
      { id: 'pro16MHzatmega328', name: 'Arduino Pro Mini 16MHz', platform: 'atmelavr', framework: 'arduino', family: 'avr', mcu: 'ATmega328P',
        aliases: ['pro16mhzatmega328', 'promini', 'arduinopromini', 'pro16mhz'], led: 'Pro Mini 板载 LED 在 D13（LED_BUILTIN）' },
      { id: 'attiny85', name: 'ATtiny85', platform: 'atmelavr', framework: 'arduino', family: 'avr', mcu: 'ATtiny85',
        aliases: ['attiny85', 'tiny85'], led: 'ATtiny85 没有板载 LED，接在 PB0~PB4 其中一个脚上' },
      { id: 'ATmega328P', name: 'ATmega328P 裸片', platform: 'atmelavr', framework: 'arduino', family: 'avr', mcu: 'ATmega328P',
        aliases: ['atmega328p', 'atmega328'], led: '裸片需要自己接 LED 到某个 IO，例如 PB5（D13）' },

      // ---- STM32 (stm32duino) ----
      { id: 'bluepill_f103c8', name: 'STM32F103C8T6 (Blue Pill)', platform: 'ststm32', framework: 'arduino', family: 'stm32', mcu: 'STM32F103C8',
        aliases: ['bluepillf103c8', 'bluepill', 'stm32f103c8t6', 'stm32f103c8', 'f103c8t6', 'f103c8', 'stm32bluepill'],
        led: 'Blue Pill 的 LED 接在 PC13，而且低电平点亮 —— 看到亮灭相反是正常的' },
      { id: 'blackpill_f411ce', name: 'STM32F411CEU6 (Black Pill)', platform: 'ststm32', framework: 'arduino', family: 'stm32', mcu: 'STM32F411CE',
        aliases: ['blackpillf411ce', 'stm32f411ceu6', 'stm32f411ce', 'f411ceu6', 'f411ce'], led: 'Black Pill F411 板载 LED 接在 PC13（低电平点亮）' },
      { id: 'blackpill_f401cc', name: 'STM32F401CCU6 (Black Pill)', platform: 'ststm32', framework: 'arduino', family: 'stm32', mcu: 'STM32F401CC',
        aliases: ['blackpillf401cc', 'stm32f401ccu6', 'stm32f401cc', 'f401ccu6', 'f401cc'], led: 'Black Pill F401 板载 LED 接在 PC13（低电平点亮）' },
      { id: 'black_f407ve', name: 'STM32F407VET6 (Black Board)', platform: 'ststm32', framework: 'arduino', family: 'stm32', mcu: 'STM32F407VE',
        aliases: ['blackf407ve', 'stm32f407vet6', 'stm32f407ve', 'f407vet6', 'f407ve'], led: 'F407 黑板的 LED 引脚不统一，先看原理图再改 LED_PIN' },
      { id: 'disco_f407vg', name: 'STM32F4DISCOVERY', platform: 'ststm32', framework: 'arduino', family: 'stm32', mcu: 'STM32F407VG',
        aliases: ['discof407vg', 'stm32f4discovery', 'discoveryf4'], led: 'Discovery 板有 4 个 LED（PD12~PD15），改成对应引脚' },
      { id: 'nucleo_f103rb', name: 'STM32 Nucleo-F103RB', platform: 'ststm32', framework: 'arduino', family: 'stm32', mcu: 'STM32F103RB',
        aliases: ['nucleof103rb', 'stm32nucleof103rb'], led: 'Nucleo 板载 LED 在 PA5（LED_BUILTIN）' },
      { id: 'genericSTM32F103C8', name: 'STM32F103C8 通用板', platform: 'ststm32', framework: 'arduino', family: 'stm32', mcu: 'STM32F103C8',
        aliases: ['genericstm32f103c8', 'stm32f103generic'], led: '通用板的 LED 引脚按原理图改' },

      // ---- RP2040 ----
      { id: 'pico', name: 'Raspberry Pi Pico (RP2040)', platform: 'raspberrypi', framework: 'arduino', family: 'rp2040', mcu: 'RP2040',
        aliases: ['pico', 'raspberrypipico', 'rppico', 'rp2040', 'rp2040zero'], led: 'Pico 板载 LED 在 GPIO25（LED_BUILTIN）' },

      // ---- Nordic ----
      { id: 'nrf52840_dk', name: 'nRF52840 DK', platform: 'nordicnrf52', framework: 'arduino', family: 'nrf', mcu: 'nRF52840',
        aliases: ['nrf52840dk', 'nrf52840'], led: 'DK 板有 4 个 LED（LED1~LED4，低电平点亮）' },
      { id: 'nrf52_dk', name: 'nRF52 DK (nRF52832)', platform: 'nordicnrf52', framework: 'arduino', family: 'nrf', mcu: 'nRF52832',
        aliases: ['nrf52dk', 'nrf52832'], led: 'DK 板有 4 个 LED（LED1~LED4，低电平点亮）' },
      { id: 'adafruit_feather_nrf52840', name: 'Adafruit Feather nRF52840', platform: 'nordicnrf52', framework: 'arduino', family: 'nrf', mcu: 'nRF52840',
        aliases: ['adafruitfeathernrf52840', 'feathernrf52840'], led: 'Feather 板载 LED 是 LED_BUILTIN（红）' },
      { id: 'nice_nano', name: 'nice!nano v2', platform: 'nordicnrf52', framework: 'arduino', family: 'nrf', mcu: 'nRF52840',
        aliases: ['nicenano', 'nicenanov2'], led: 'nice!nano 板载 LED 在 P0.15 附近，按原理图改' },

      // ---- Others ----
      { id: 'teensy40', name: 'Teensy 4.0', platform: 'teensy', framework: 'arduino', family: 'teensy', mcu: 'IMXRT1062',
        aliases: ['teensy40', 'teensy4'], led: 'Teensy 4.0 板载 LED 在 13（LED_BUILTIN）' },
      { id: 'due', name: 'Arduino Due', platform: 'atmelsam', framework: 'arduino', family: 'sam', mcu: 'ATSAM3X8E',
        aliases: ['due', 'arduinodue'], led: 'Due 板载 LED 在 13（LED_BUILTIN）' }
    ];

    var FAMILIES = [
      { key: 'esp32', family: 'esp32',
        test: function (k) { return /esp32|wroom/.test(k); },
        name: { zh: 'ESP32 系列', en: 'ESP32 family' },
        platform: 'espressif32', framework: 'arduino',
        board: function (k) {
          if (/s3/.test(k)) return 'esp32-s3-devkitc-1';
          if (/c6/.test(k)) return 'esp32-c6-devkitc-1';
          if (/c3/.test(k)) return 'esp32-c3-devkitm-1';
          if (/s2/.test(k)) return 'esp32-s2-saola-1';
          return 'esp32dev';
        },
        led: 'ESP32 各型号板载 LED 引脚不同，先看原理图' },

      { key: 'esp8266', family: 'esp8266',
        test: function (k) { return /esp8266|esp8285|esp12|esp01|nodemcu/.test(k); },
        name: { zh: 'ESP8266 系列', en: 'ESP8266 family' },
        platform: 'espressif8266', framework: 'arduino',
        board: function (k) { return /esp01/.test(k) ? 'esp01_1m' : (/esp12/.test(k) ? 'esp12e' : 'nodemcuv2'); },
        led: 'ESP8266 板载 LED 多在 GPIO2（D4）' },

      { key: 'rp2040', family: 'rp2040',
        test: function (k) { return /rp2040|rp2350|^pico|raspberry/.test(k); },
        name: { zh: 'RP2040 系列', en: 'RP2040 family' },
        platform: 'raspberrypi', framework: 'arduino',
        board: function () { return 'pico'; },
        led: 'RP2040 板载 LED 一般在 GPIO25' },

      { key: 'nrf', family: 'nrf',
        test: function (k) { return /nrf5|nrf51|nrf52/.test(k); },
        name: { zh: 'nRF52 系列', en: 'nRF52 family' },
        platform: 'nordicnrf52', framework: 'arduino',
        board: function () { return 'nrf52840_dk'; },
        led: 'nRF52 开发板的 LED 引脚按板卡原理图改' },

      { key: 'teensy', family: 'teensy',
        test: function (k) { return /teensy/.test(k); },
        name: { zh: 'Teensy 系列', en: 'Teensy family' },
        platform: 'teensy', framework: 'arduino',
        board: function () { return 'teensy40'; },
        led: 'Teensy 板载 LED 在 13' },

      { key: 'stm32clone', family: 'stm32clone',
        test: function (k) { return /^(ch32f|gd32|apm32|at32|mm32|cs32|n32|bat32)/.test(k); },
        name: { zh: 'STM32 兼容国产芯片', en: 'STM32-compatible domestic part' },
        platform: 'ststm32', framework: 'arduino',
        board: function () { return 'genericSTM32F103C8'; },
        led: '国产 F103 兼容芯片的 LED 引脚与复位电路各自不同，先看原理图' },

      { key: 'ch32v', family: 'ch32v',
        test: function (k) { return /ch32v|^v003|^v103|riscv/.test(k); },
        name: { zh: 'CH32V (RISC-V) 系列', en: 'CH32V (RISC-V) family' },
        platform: 'https://github.com/Community-PIO-CH32V/platform-ch32v.git', framework: 'arduino',
        board: function (k) { return /v103/.test(k) ? 'ch32v103c8t6' : 'ch32v003f4p6'; },
        led: 'CH32V 的 GPIO 端口命名与 STM32 不同，按 WCH 手册改' },

      { key: 'stm32', family: 'stm32',
        test: function (k) { return /stm32|f103|f030|f401|f407|f411|g431|h743|l476/.test(k); },
        name: { zh: 'STM32 系列', en: 'STM32 family' },
        platform: 'ststm32', framework: 'arduino',
        board: function () { return 'genericSTM32F103C8'; },
        led: '通用 STM32 板的 LED 引脚按原理图改' },

      { key: 'avr', family: 'avr',
        test: function (k) { return /atmega|attiny|arduino|mega2560|^uno|328p|2560/.test(k); },
        name: { zh: 'AVR / Arduino 系列', en: 'AVR / Arduino family' },
        platform: 'atmelavr', framework: 'arduino',
        board: function (k) { return /attiny/.test(k) ? 'attiny85' : (/mega|2560/.test(k) ? 'megaatmega2560' : 'uno'); },
        led: 'AVR 板载 LED 一般在 D13' },

      { key: 'mcs51', family: 'mcs51',
        test: function (k) { return /^(stc|at89|n76|wch)|8051|stc8|stc15|stc32|stc89/.test(k); },
        name: { zh: '8051 系列', en: '8051 family' },
        platform: 'intel_mcs51', framework: 'sdcc',
        board: function () { return 'generic_8051'; },
        led: '8051 开发板的 LED 多见于 P1 口，按原理图改' },

      { key: 'sam', family: 'sam',
        test: function (k) { return /atsam|samd2|samd5|^due/.test(k); },
        name: { zh: 'Atmel SAM 系列', en: 'Atmel SAM family' },
        platform: 'atmelsam', framework: 'arduino',
        board: function () { return 'due'; },
        led: 'SAM 板载 LED 一般在 D13' }
    ];

    // Only reachable after the user supplied extra details (core / vendor / flash):
    // a known-nothing part still gets a project, but every inferred line is marked.
    var UNKNOWN_FAMILY = {
      key: 'cortexm',
      family: 'cortexm',
      name: { zh: '通用 Cortex-M（平台待确认）', en: 'Generic Cortex-M (platform TBD)' },
      platform: 'ststm32',
      framework: 'arduino',
      board: function () { return 'genericSTM32F103C8'; },
      led: '这款芯片的 LED 引脚无从推断，按原理图把 LED_PIN 改成实际引脚'
    };

    var FILLERS = ['开发板', '核心板', '最小系统板', '最小系统', '单片机', '芯片', '模块', '官方', '板卡'];

    function N(tone, zh, en) { return { tone: tone || 'info', zh: zh, en: en }; }

    function compact(raw) {
      var s = String(raw == null ? '' : raw).toLowerCase();
      for (var i = 0; i < FILLERS.length; i++) s = s.split(FILLERS[i]).join('');
      return s
        .replace(/[\s\-_/\\.,:;()（）【】\[\]{}'"`*+|]+/g, '')
        .replace(/开发|板$/g, '');
    }

    function oneOf(list, id, fallback) {
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      for (var j = 0; j < list.length; j++) if (list[j].id === fallback) return list[j];
      return list[0];
    }

    function labelOf(list, id) {
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return { zh: id, en: id };
    }

    function safeEnv(id) {
      return String(id || 'env').toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || 'env';
    }

    function sanitizeName(raw) {
      var out = String(raw || 'PROJECT')
        .replace(/[^0-9A-Za-z._-]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^[_.-]+|[_.-]+$/g, '');
      if (!out) out = 'PROJECT';
      return out.slice(0, 40);
    }

    function ljust(s, width) {
      s = String(s);
      while (s.length < width) s += ' ';
      return s;
    }

    /* ---------- matching ---------- */

    function matchBoard(key) {
      if (!key) return null;
      var cloneVendor = /^(ch32f|gd32|apm32|at32|mm32|cs32|n32|bat32|hc32)/.test(key);
      var best = null;
      var bestScore = 0;
      var bestExact = false;
      for (var i = 0; i < BOARDS.length; i++) {
        var b = BOARDS[i];
        if (cloneVendor && b.family === 'stm32') continue;
        for (var j = 0; j < b.aliases.length; j++) {
          var a = b.aliases[j];
          var score = 0;
          var exact = false;
          if (key === a) {
            // Exact alias: the only case that earns a confident "matched" banner.
            score = 1000 + a.length;
            exact = true;
          } else if (a.length >= 8 && key.indexOf(a) >= 0) {
            // A long, specific alias inside a longer key, e.g. "stm32f103c8" inside
            // "stm32f103c8t6最小系统板". Short generic aliases ("esp32", "pico")
            // never match this way, so "esp32c6" cannot masquerade as esp32dev.
            score = 500 + a.length;
            exact = true;
          } else if (key.length >= 9 && a.indexOf(key) >= 0) {
            score = 100 + key.length;
            exact = false;
          }
          if (score > bestScore) { bestScore = score; best = b; bestExact = exact; }
        }
      }
      if (!best) return null;
      return { board: best, exact: bestExact };
    }

    function matchFamily(key) {
      if (!key) return null;
      for (var i = 0; i < FAMILIES.length; i++) {
        var f = FAMILIES[i];
        if (f.test(key)) return f;
      }
      return null;
    }

    /* ---------- upload matrix ---------- */

    function uploadPlan(spec, flashId, osId) {
      var fam = spec.family;
      var out = { lines: [], notes: [], port: false };
      function note(tone, zh, en) { out.notes.push(N(tone, zh, en)); }

      if (flashId === 'ch340') {
        out.port = true;
        if (fam === 'esp32') {
          out.lines.push('upload_speed = 921600');
          note('info', 'ESP32 走板载 CH340 + esptool，插上 USB 就能烧；串口号见下面的注释。',
            'ESP32 uploads through the onboard CH340 with esptool. Set the port as shown below.');
        } else if (fam === 'esp8266') {
          out.lines.push('upload_speed = 460800');
          note('info', 'ESP8266 走板载 CH340 + esptool，串口号见下面的注释。',
            'ESP8266 uploads through the onboard CH340 with esptool. Set the port below.');
        } else if (fam === 'avr') {
          out.lines.push('upload_speed = 115200');
          note('info', 'AVR 能用 CH340 串口烧，前提是板子自带 Arduino bootloader（Uno/Nano/Pro Mini 都自带）。',
            'AVR uploads over CH340 only when the board ships an Arduino bootloader (Uno, Nano, Pro Mini do).');
          note('warn', '如果你用的是「裸片 + CH340」，裸片没有 bootloader，串口烧不进去，需要先用 ISP/USBasp 灌 bootloader。',
            'A bare ATmega + CH340 has no bootloader, so serial upload fails until you burn one with an ISP programmer.');
        } else if (fam === 'cortexm') {
          out.lines.push('; upload_protocol = stlink   ; 【核对修改】通用 Cortex-M 一般走 SWD');
          note('warn', '通用 Cortex-M 芯片通常用 SWD 烧录（ST-Link / J-Link / DAPLink），CH340 只能当串口看日志；具体支持哪个上传器，取决于你最终选的平台包。',
            'Generic Cortex-M parts flash over SWD (ST-Link, J-Link, DAPLink); CH340 only gives a console. The usable uploader depends on the platform package you end up with.');
        } else if (fam === 'stm32' || fam === 'stm32clone') {
          out.lines.push('; upload_protocol = stlink   ; 【核对修改】CH340 不能烧 STM32');
          note('err', 'STM32 没有可用的 UART-ISP 上传器，PlatformIO 不能用 CH340 烧 Flash。CH340 只能当串口看日志；烧录请改 ST-Link / J-Link，或把 BOOT0 拉高走 USB DFU。',
            'PlatformIO has no UART-ISP uploader for STM32, so CH340 cannot flash it. Use ST-Link, J-Link, or DFU with BOOT0 high; CH340 only gives you a serial console.');
        } else if (fam === 'rp2040') {
          note('err', 'RP2040 / Pico 不支持 CH340 烧录：按住 BOOTSEL 插 USB，把它当 U 盘拖 UF2，PlatformIO 会自动走这条路。',
            'RP2040 does not flash over CH340: hold BOOTSEL while plugging in and copy the UF2, which PlatformIO does for you.');
        } else if (fam === 'nrf') {
          note('err', 'nRF52 需要 J-Link / ST-Link，或板子自带 UF2 bootloader（nice!nano 就是 UF2）。CH340 只能看串口。',
            'nRF52 needs J-Link/ST-Link or a UF2 bootloader (nice!nano has one). CH340 only gives a console.');
        } else if (fam === 'ch32v') {
          note('err', 'CH32V003 一般用 WCH-LinkE 烧录（SWD），不支持 CH340 串口烧录。',
            'CH32V003 is normally flashed with WCH-LinkE over SWD; CH340 serial upload is not supported.');
        } else if (fam === 'mcs51') {
          note('err', '8051 / STC 单片机靠 STC-ISP 的串口下载（冷启动握手），PlatformIO 没有这个上传器。串口可以用来下载，但要改用 STC-ISP 工具。',
            'STC 8051 parts flash through STC-ISP serial download with a cold-boot handshake; PlatformIO has no uploader for it.');
        } else {
          note('warn', '这个平台没有内置串口上传器，`upload_port` 仅供串口监视使用。',
            'This platform has no built-in serial uploader; `upload_port` only serves the serial monitor.');
        }
      } else if (flashId === 'stlink') {
        if (fam === 'stm32' || fam === 'stm32clone' || fam === 'cortexm') {
          out.lines.push('upload_protocol = stlink');
          note('info', 'ST-Link 接 SWD（SWDIO / SWCLK / GND / 3V3），PlatformIO 直接 `pio run -t upload`。',
            'Wire ST-Link to SWD (SWDIO, SWCLK, GND, 3V3) and run `pio run -t upload`.');
        } else if (fam === 'nrf') {
          out.lines.push('upload_protocol = stlink   ; 【核对修改】');
          note('warn', 'nRF52 官方工具链以 J-Link 为主；用 ST-Link 需要 OpenOCD 支持，可能要装驱动。',
            'nRF52 tooling assumes J-Link; ST-Link works through OpenOCD but may need extra drivers.');
        } else if (fam === 'rp2040') {
          out.lines.push('upload_protocol = cmsis-dap   ; 【核对修改】');
          note('warn', 'RP2040 用 ST-Link 属于 SWD 调试路径，PlatformIO 走 OpenOCD，需要先确认上传器名字（cmsis-dap / picoprobe）。',
            'ST-Link on RP2040 goes through OpenOCD; confirm the uploader name (cmsis-dap / picoprobe).');
        } else if (fam === 'esp32' || fam === 'esp8266') {
          note('err', 'ESP 系列不能用 ST-Link 烧 Flash，只能做 JTAG 调试。烧录请用板载串口，或 ESP-Prog。',
            'ESP parts cannot be flashed with ST-Link; it is JTAG-debug only. Use the serial port or ESP-Prog.');
        } else if (fam === 'avr') {
          note('err', 'AVR 不支持 ST-Link。请用 USBasp / AVRISP 等 ISP 烧录器，或者板载串口 bootloader。',
            'AVR does not support ST-Link. Use a USBasp/AVRISP programmer or the serial bootloader.');
        } else if (fam === 'mcs51') {
          note('err', '8051 不支持 ST-Link，STC 系列用 STC-ISP 串口下载。',
            '8051 does not support ST-Link; STC parts use STC-ISP serial download.');
        } else {
          out.lines.push('upload_protocol = stlink   ; 【核对修改】');
          note('warn', '不确定这个平台是否支持 ST-Link，先跑一次 upload 看报错，再按提示改上传器。',
            'ST-Link support is unverified for this platform; run upload once and follow the error.');
        }
      } else if (flashId === 'jlink') {
        if (fam === 'stm32' || fam === 'stm32clone' || fam === 'cortexm') {
          out.lines.push('upload_protocol = jlink');
          note('info', 'J-Link 接 SWD 四根线，PlatformIO 直接 `pio run -t upload`。',
            'Wire J-Link over SWD and run `pio run -t upload`.');
        } else if (fam === 'nrf') {
          out.lines.push('upload_protocol = jlink');
          note('info', 'nRF52 + J-Link 是最标准的组合，直接 `pio run -t upload`。',
            'nRF52 with J-Link is the standard pairing; run `pio run -t upload`.');
        } else if (fam === 'esp32' || fam === 'esp8266') {
          note('err', 'ESP 系列不能用 J-Link 烧 Flash，只能做 JTAG 调试。烧录请用板载串口。',
            'ESP parts cannot be flashed with J-Link; it is JTAG-debug only. Use the serial port.');
        } else if (fam === 'rp2040') {
          out.lines.push('upload_protocol = cmsis-dap   ; 【核对修改】');
          note('warn', 'RP2040 走 J-Link 需要 OpenOCD 配置，上传器名字按实际情况改。',
            'RP2040 with J-Link needs an OpenOCD config; adjust the uploader name to match.');
        } else {
          note('warn', '这个平台对 J-Link 的支持未验证，先跑一次 upload 看报错。',
            'J-Link support is unverified for this platform; run upload once and follow the error.');
        }
      } else if (flashId === 'dfu') {
        if (fam === 'stm32' || fam === 'stm32clone' || fam === 'cortexm') {
          out.lines.push('upload_protocol = dfu');
          note('info', 'USB DFU：把 BOOT0 拉高（或按住 BOOT0 复位），用 USB 线接板子；Windows 需要装 STM32 DFU 驱动（Zadig / STM32CubeProgrammer 自带）。',
            'USB DFU: pull BOOT0 high (or hold BOOT0 while resetting) and connect USB. Windows needs the STM32 DFU driver (Zadig or STM32CubeProgrammer).');
        } else if (fam === 'esp32') {
          out.lines.push('upload_protocol = dfu   ; 【核对修改】');
          note('warn', '只有 ESP32-S2 / S3 / C3 这类带原生 USB 的型号支持 DFU，经典 ESP32 必须走串口。',
            'Only native-USB parts (ESP32-S2/S3/C3) support DFU; classic ESP32 must use serial.');
        } else {
          note('err', '这个平台不支持 USB DFU：RP2040 用 BOOTSEL 拖 UF2，AVR 用 ISP，nRF 用 J-Link。',
            'USB DFU is not supported here: RP2040 uses BOOTSEL/UF2, AVR uses ISP, nRF uses J-Link.');
        }
      } else {
        // other programmer
        if (fam === 'avr') {
          out.lines.push('upload_protocol = usbasp   ; 【核对修改】换成你手里的 ISP 烧录器');
          note('info', 'AVR 常用 USBasp / AVRISP mkII 做 ISP 烧录，接线是 MOSI/MISO/SCK/RESET/VCC/GND。',
            'AVR usually uses a USBasp/AVRISP over ISP: MOSI, MISO, SCK, RESET, VCC, GND.');
        } else if (fam === 'stm32' || fam === 'stm32clone' || fam === 'cortexm') {
          out.lines.push('upload_protocol = cmsis-dap   ; 【核对修改】换成你手里的调试器');
          note('info', '常见替代调试器是 CMSIS-DAP（DAPLink），接 SWD 四根线。',
            'Common alternative: CMSIS-DAP (DAPLink) wired to SWD.');
        } else if (fam === 'esp32' || fam === 'esp8266') {
          out.lines.push('upload_protocol = esp-prog   ; 【核对修改】');
          note('info', 'ESP 系列的外部烧录器一般是 ESP-Prog（JTAG）。',
            'The usual external programmer for ESP is ESP-Prog over JTAG.');
        } else {
          note('warn', '「其他」烧录方式需要你手动补 upload_protocol / upload_command，先跑一次 upload 看 PlatformIO 支持哪些上传器。',
            'For "other" you must fill in upload_protocol / upload_command; run upload once to see the supported uploaders.');
        }
      }
      return out;
    }

    /* ---------- project spec ---------- */

    function specFromBoard(hit) {
      var b = hit.board;
      return {
        matched: true,
        exact: hit.exact,
        family: b.family,
        platform: b.platform,
        board: b.id,
        framework: b.framework,
        boardName: b.name,
        mcu: b.mcu || '',
        env: safeEnv(b.id),
        extraIni: [],
        led: b.led,
        review: !hit.exact
      };
    }

    function specFromFamily(fam, key, chipRaw) {
      var boardId = fam.board(key);
      return {
        matched: false,
        exact: false,
        family: fam.family,
        platform: fam.platform,
        board: boardId,
        framework: fam.framework,
        boardName: fam.name.zh,
        mcu: '',
        env: safeEnv(chipRaw || boardId),
        extraIni: [],
        led: fam.led,
        review: true
      };
    }

    /* ---------- generated text ---------- */

    function mirrorBlock() {
      return [
        '',
        '; ---------------------------------------------------------------------',
        '; 国内加速（重要：PlatformIO 没有官方中国镜像站）',
        '; 网上流传的 gitee / 阿里云「平台镜像」地址大多已经失效，所以这里不写死',
        '; 任何镜像 URL。按有效性从上到下三档，第一档一定有效：',
        ';',
        '; ① pip 源 —— 只影响「安装 / 升级 PlatformIO 本体」，国内有效',
        ';    pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple',
        ';    pip install -U platformio',
        ';',
        '; ② 单个包镜像 —— 把某个框架/工具链换成你能连上的直链或 git 仓库',
        ';    platform_packages =',
        ';        framework-arduinoespressif32@https://你的镜像地址/xxx.zip   ; 【核对修改】',
        ';',
        '; ③ 第三方库 —— lib_deps 直接写 git 地址，绕过 registry 解析',
        ';    lib_deps =',
        ';        https://gitee.com/你的镜像库/xxx.git   ; 【核对修改】'
      ];
    }

    function iniSource(o) {
      var spec = o.spec;
      var up = o.up;
      var osOpt = oneOf(OS_OPTIONS, o.osId, 'windows');
      var flashOpt = oneOf(FLASH_OPTIONS, o.flashId, 'ch340');
      var L = [];

      L.push('; =====================================================================');
      L.push('; platformio.ini');
      L.push('; 由「PIO 工程生成器」生成');
      L.push('; 开发板 / 芯片：' + o.chipRaw);
      L.push('; 匹配结果：' + spec.boardName + '（board = ' + spec.board + '）' + (spec.matched && !spec.review ? '  ← 命中 PlatformIO 内置 board' : '  ← 通用模板，带【核对修改】的行请对照手册调整'));
      L.push('; 操作系统：' + osOpt.zh + '    烧录方式：' + flashOpt.zh);
      L.push('; =====================================================================');
      L.push('');
      L.push('[platformio]');
      L.push('default_envs = ' + spec.env);
      L.push('');
      L.push('[env:' + spec.env + ']');
      L.push('platform = ' + spec.platform + (spec.review ? '   ; 【核对修改】按芯片手册确认平台包' : ''));
      L.push('board = ' + spec.board + (spec.review ? '   ; 【核对修改】换成 catalog 里对应的 board id' : ''));
      L.push('framework = ' + spec.framework);
      if (spec.framework === 'cmsis') {
        if (spec.mainKind === 'cmsis-hal') {
          L.push('; 【核对修改】framework = cmsis 只带 CMSIS 启动文件与链接脚本，PlatformIO 不自带 STM32Cube HAL');
          L.push('; 要用真 HAL：把 Cube 的 Drivers/' + halDriverName(spec) + ' 拷进 lib/，再打开下面这行');
          L.push('; build_flags = -I lib/' + halDriverName(spec) + '/Inc -D USE_HAL_DRIVER -D <芯片型号宏，照抄 Cube 工程>');
        } else {
          L.push('; framework = cmsis：只有启动文件 + CMSIS 头，没有 HAL / Arduino 层，main() 直接是入口');
        }
      } else if (spec.framework === 'espidf') {
        L.push('; framework = espidf 走 ESP-IDF 原生工程，入口是 app_main()；首次编译要拉整套工具链');
      }
      L.push('monitor_speed = 115200');

      for (var i = 0; i < spec.extraIni.length; i++) L.push(spec.extraIni[i]);

      if (spec.family === 'stm32clone') {
        L.push('; board_build.mcu = stm32f103c8   ; 【核对修改】国产兼容芯片按实际型号填');
      }
      if (spec.family === 'mcs51') {
        L.push('; 【核对修改】8051 在 PlatformIO 上支持有限：平台名、board、framework 三行都要换成你实际装的社区包');
        L.push('; 更省事的路线：直接用 Keil C51 编译，用 STC-ISP 串口下载');
      }

      L.push('');
      L.push('; ---------- 烧录方式：' + flashOpt.zh + ' ----------');
      if (up.lines.length) {
        for (var k = 0; k < up.lines.length; k++) L.push(up.lines[k]);
      } else {
        L.push('; （这个组合不需要额外 upload_* 配置，按上面的注释操作即可）');
      }

      if (up.port) {
        L.push('');
        L.push('; ---------- 串口号：CH340 串口烧录必须手动确认 ----------');
        L.push('; 取消下面其中一行的注释，改成你电脑上真实的串口');
        L.push('; upload_port = COM3                     ; 【核对修改】Windows：设备管理器 → 端口(COM 和 LPT)');
        L.push('; upload_port = /dev/ttyUSB0             ; 【核对修改】Linux：ls /dev/ttyUSB*  或  /dev/ttyACM*');
        L.push('; upload_port = /dev/tty.usbserial-0001  ; 【核对修改】macOS：ls /dev/tty.*  或  ls /dev/cu.*');
        L.push('; 也可以不写 upload_port，让 PlatformIO 自动探测（只接一块板时通常能猜对）');
      }

      var mb = mirrorBlock();
      for (var m = 0; m < mb.length; m++) L.push(mb[m]);

      L.push('');
      return L.join('\n');
    }

    function arduinoSource(spec, chipRaw) {
      var L = [];
      L.push('/*');
      L.push(' * 点灯测试 —— ' + (spec.boardName || chipRaw));
      L.push(' * 由「PIO 工程生成器」生成');
      L.push(' *');
      L.push(' * 编译：pio run               （VS Code 里 Ctrl+Alt+B）');
      L.push(' * 烧录：pio run -t upload     （VS Code 里 Ctrl+Alt+U）');
      L.push(' * 串口：pio device monitor');
      L.push(' */');
      L.push('#include <Arduino.h>');
      L.push('');
      L.push('/* 【核对修改】板载 LED 引脚各不相同：');
      if (spec.led) L.push(' * ' + spec.led);
      L.push(' * 常见值：ESP32=2、ESP8266=2(D4)、Uno/Nano=13、Blue Pill=PC13、Pico=25');
      L.push(' * 若编译报 LED_BUILTIN 未定义，把下面这行改成具体引脚号');
      L.push(' */');
      L.push('#ifndef LED_PIN');
      L.push('#define LED_PIN LED_BUILTIN');
      L.push('#endif');
      L.push('');
      L.push('void setup() {');
      L.push('  Serial.begin(115200);');
      L.push('  pinMode(LED_PIN, OUTPUT);');
      L.push('  Serial.println("[PIO] blink start");');
      L.push('}');
      L.push('');
      L.push('void loop() {');
      L.push('  digitalWrite(LED_PIN, HIGH);');
      L.push('  delay(500);');
      L.push('  digitalWrite(LED_PIN, LOW);');
      L.push('  delay(500);');
      L.push('}');
      L.push('');
      return L.join('\n');
    }

    /* ---------- framework routing ---------- */

    function frameworkAllowed(family) {
      var list = FRAMEWORK_SUPPORT[family];
      return list && list.length ? list : ['arduino'];
    }

    function frameworkPlan(spec, requested) {
      var allowed = frameworkAllowed(spec.family);
      var want = requested || 'auto';
      var known = false;
      for (var i = 0; i < FRAMEWORK_OPTIONS.length; i++) if (FRAMEWORK_OPTIONS[i].id === want) known = true;
      if (!known) want = 'auto';

      var chosen = want;
      var fallback = null;
      if (want === 'auto') {
        chosen = allowed[0];
      } else if (allowed.indexOf(want) < 0) {
        chosen = allowed[0];
        fallback = want;
      }

      var plan = { requested: want, chosen: chosen, fallback: fallback, ini: 'arduino', path: 'src/main.cpp', kind: 'arduino' };

      if (chosen === 'hal') {
        plan.ini = 'cmsis';
        plan.path = 'src/main.c';
        plan.kind = 'cmsis-hal';
      } else if (chosen === 'sdk') {
        if (spec.family === 'esp32') {
          plan.ini = 'espidf';
          plan.path = 'src/main.c';
          plan.kind = 'espidf';
        } else if (spec.family === 'mcs51') {
          plan.ini = 'sdcc';
          plan.path = 'src/main.c';
          plan.kind = 'c51';
        } else if (spec.family === 'stm32' || spec.family === 'stm32clone' || spec.family === 'cortexm') {
          plan.ini = 'cmsis';
          plan.path = 'src/main.c';
          plan.kind = 'cmsis-bare';
        } else {
          // Family lists 'sdk' without a concrete mapping: stay on Arduino.
          plan.chosen = 'arduino';
          plan.ini = 'arduino';
          plan.path = 'src/main.cpp';
          plan.kind = 'arduino';
        }
      }
      return plan;
    }

    function stm32Header(spec) {
      var mcu = String(spec.mcu || '').toUpperCase();
      if (/F0/.test(mcu)) return { series: 'moder', header: 'stm32f0xx.h' };
      if (/F4/.test(mcu)) return { series: 'moder', header: 'stm32f4xx.h' };
      if (/G0/.test(mcu)) return { series: 'moder', header: 'stm32g0xx.h' };
      if (/G4/.test(mcu)) return { series: 'moder', header: 'stm32g4xx.h' };
      if (/H7/.test(mcu)) return { series: 'moder', header: 'stm32h7xx.h' };
      if (/L4/.test(mcu)) return { series: 'moder', header: 'stm32l4xx.h' };
      return { series: 'crl', header: 'stm32f1xx.h' };
    }

    function halDriverName(spec) {
      var header = stm32Header(spec).header.replace('.h', '');   // stm32f1xx
      var suffix = header.slice(5);                               // f1xx
      return 'STM32' + suffix.charAt(0).toUpperCase() + suffix.slice(1) + '_HAL_Driver';
    }

    function cmsisSource(spec, chipRaw, kind) {
      var h = stm32Header(spec);
      var L = [];
      L.push('/*');
      L.push(' * ' + (kind === 'cmsis-hal' ? 'HAL 路线点灯' : '裸机点灯') + '（CMSIS 寄存器级）—— ' + (spec.boardName || chipRaw));
      L.push(' * 由「PIO 工程生成器」生成；framework = cmsis');
      L.push(' *');
      L.push(' * 编译：pio run            烧录：pio run -t upload');
      if (kind === 'cmsis-hal') {
        L.push(' *');
        L.push(' * 你选的是 HAL 路线。PlatformIO 的 ststm32 平台不带 STM32Cube HAL，');
        L.push(' * 所以这份代码先用 CMSIS 寄存器把灯点起来，保证开箱能编译。');
        L.push(' * 换成真正的 HAL 三步：');
        L.push(' *   1) 把 Cube 的 Drivers/' + halDriverName(spec) + ' 拷进本工程 lib/');
        L.push(' *   2) 在 platformio.ini 打开 build_flags（文件里已经写好注释）');
        L.push(' *   3) 把 led_init() / led_write() 换成：');
        L.push(' *        __HAL_RCC_GPIOC_CLK_ENABLE();');
        L.push(' *        HAL_GPIO_Init(GPIOC, &cfg);');
        L.push(' *        HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);');
      } else {
        L.push(' *');
        L.push(' * framework = cmsis 只提供 CMSIS 启动文件与链接脚本，没有 HAL、没有 Arduino 层。');
      }
      L.push(' * 【核对修改】下面按 ' + (h.series === 'crl' ? 'STM32F1' : 'STM32F4/G0/G4/H7/L4') + ' 系列的寄存器组织写；');
      L.push(' * 换系列要同时改设备头文件和 GPIO 配置寄存器。');
      L.push(' */');
      L.push('#include <' + h.header + '>   /* 【核对修改】CMSIS 设备头文件，按系列换成对应型号 */');
      L.push('');
      L.push('#define LED_PORT GPIOC');
      L.push('#define LED_PIN  13u        /* 【核对修改】接在哪个引脚就改成几（PC13 = 13） */');
      L.push('');
      L.push('static void led_init(void) {');
      if (h.series === 'crl') {
        L.push('  RCC->APB2ENR |= RCC_APB2ENR_IOPCEN;                    /* 【核对修改】换端口要同步改时钟位 */');
        L.push('  LED_PORT->CRH &= ~(0xFu << ((LED_PIN - 8u) * 4u));');
        L.push('  LED_PORT->CRH |=  (0x2u << ((LED_PIN - 8u) * 4u));     /* 推挽输出，2MHz */');
        L.push('  /* 引脚小于 8 时改 CRL：LED_PORT->CRL &= ~(0xFu << (LED_PIN * 4u)); */');
      } else {
        L.push('  RCC->AHB1ENR |= RCC_AHB1ENR_GPIOCEN;                   /* 【核对修改】F1 是 APB2，别照抄 */');
        L.push('  LED_PORT->MODER &= ~(0x3u << (LED_PIN * 2u));');
        L.push('  LED_PORT->MODER |=  (0x1u << (LED_PIN * 2u));          /* 通用推挽输出 */');
      }
      L.push('}');
      L.push('');
      L.push('static void led_write(int on) {');
      if (h.series === 'crl') {
        L.push('  /* Blue Pill / Black Pill 的 PC13 是低电平点亮，所以 on 时写 BRR */');
        L.push('  if (on) LED_PORT->BRR  = (1u << LED_PIN);');
        L.push('  else    LED_PORT->BSRR = (1u << LED_PIN);');
      } else {
        L.push('  /* BSRR 高 16 位是复位位，低 16 位是置位位 */');
        L.push('  LED_PORT->BSRR = on ? (1u << LED_PIN) : (1u << (LED_PIN + 16u));');
      }
      L.push('}');
      L.push('');
      L.push('static void delay_loops(uint32_t loops) {   /* 【核对修改】按主频调这两个数，凑到约 500ms */');
      L.push('  for (volatile uint32_t i = 0; i < loops; i++) { __NOP(); }');
      L.push('}');
      L.push('');
      L.push('int main(void) {');
      L.push('  led_init();');
      L.push('  while (1) {');
      L.push('    led_write(1);');
      L.push('    delay_loops(400000u);');
      L.push('    led_write(0);');
      L.push('    delay_loops(400000u);');
      L.push('  }');
      L.push('}');
      L.push('');
      return L.join('\n');
    }

    function idfSource(spec, chipRaw) {
      var L = [];
      L.push('/*');
      L.push(' * ESP-IDF 点灯 —— ' + (spec.boardName || chipRaw));
      L.push(' * 由「PIO 工程生成器」生成；framework = espidf');
      L.push(' *');
      L.push(' * 编译：pio run            烧录：pio run -t upload');
      L.push(' * 注意：ESP-IDF 工具链第一次下载体积很大，国内建议先配好加速。');
      L.push(' */');
      L.push('#include <stdio.h>');
      L.push('#include "freertos/FreeRTOS.h"');
      L.push('#include "freertos/task.h"');
      L.push('#include "driver/gpio.h"');
      L.push('');
      L.push('#define LED_GPIO 2   /* 【核对修改】ESP32 DevKit 板载 LED 一般在 GPIO2；ESP32-C3/S3 各不同 */');
      L.push('');
      L.push('void app_main(void) {');
      L.push('  gpio_reset_pin(LED_GPIO);');
      L.push('  gpio_set_direction(LED_GPIO, GPIO_MODE_OUTPUT);');
      L.push('  printf("[PIO] blink start\\n");');
      L.push('  while (1) {');
      L.push('    gpio_set_level(LED_GPIO, 1);');
      L.push('    vTaskDelay(pdMS_TO_TICKS(500));');
      L.push('    gpio_set_level(LED_GPIO, 0);');
      L.push('    vTaskDelay(pdMS_TO_TICKS(500));');
      L.push('  }');
      L.push('}');
      L.push('');
      return L.join('\n');
    }

    function c51Source(spec, chipRaw) {
      var L = [];
      L.push('/*');
      L.push(' * 点灯示例 —— ' + (spec.boardName || chipRaw) + '（8051 / Keil C51）');
      L.push(' * 由「PIO 工程生成器」生成');
      L.push(' *');
      L.push(' * PlatformIO 对 8051 支持有限，实际开发建议：');
      L.push(' *   Keil C51 编译 → STC-ISP 串口下载');
      L.push(' * 本文件按 Keil C51 语法写，寄存器名对照芯片手册。');
      L.push(' */');
      L.push('#include <reg52.h>');
      L.push('');
      L.push('sbit LED = P1 ^ 0;   /* 【核对修改】LED 接在哪个 IO，例如 P1^0 / P2^3 */');
      L.push('');
      L.push('static void delay_ms(unsigned int ms) {');
      L.push('  unsigned int i, j;');
      L.push('  for (i = 0; i < ms; i++)');
      L.push('    for (j = 0; j < 110; j++) { }   /* 【核对修改】按晶振频率(11.0592M/12M)微调 */');
      L.push('}');
      L.push('');
      L.push('void main(void) {');
      L.push('  LED = 1;');
      L.push('  while (1) {');
      L.push('    LED = 0;');
      L.push('    delay_ms(500);');
      L.push('    LED = 1;');
      L.push('    delay_ms(500);');
      L.push('  }');
      L.push('}');
      L.push('');
      return L.join('\n');
    }

    /* ---------- one-click scripts ---------- */

    function batEscape(line) {
      return String(line)
        .replace(/\^/g, '^^')
        .replace(/([&|<>])/g, '^$1')
        .replace(/%/g, '%%');
    }

    function batLine(line) {
      return line === '' ? 'echo.' : 'echo ' + batEscape(line);
    }

    function batSource(projectDir, files) {
      var L = [];
      L.push('@echo off');
      L.push('chcp 65001 >nul');
      L.push('setlocal');
      L.push('rem ====================================================================');
      L.push('rem 一键生成 PlatformIO 工程并用 VS Code 打开');
      L.push('rem 由「PIO 工程生成器」生成。本脚本只在你自己的电脑上建目录、写文件，不联网。');
      L.push('rem 保存编码建议 UTF-8（无 BOM）；双击运行即可。');
      L.push('rem 注意：脚本不会替你装 PlatformIO，也不会替你烧录。');
      L.push('rem ====================================================================');
      L.push('');
      L.push('set "ROOT=%~dp0' + projectDir + '"');
      L.push('echo [1/3] 创建目录：%ROOT%');
      L.push('if not exist "%ROOT%" mkdir "%ROOT%"');
      L.push('if not exist "%ROOT%\\src" mkdir "%ROOT%\\src"');
      L.push('');
      L.push('echo [2/3] 写入工程文件');
      for (var f = 0; f < files.length; f++) {
        var file = files[f];
        var target = '"%ROOT%\\' + file.path.replace(/\//g, '\\') + '"';
        L.push('if exist ' + target + ' del /q ' + target);
        var lines = String(file.content).split('\n');
        for (var i = 0; i < lines.length; i++) {
          if (i === lines.length - 1 && lines[i] === '') continue;
          L.push('>> ' + target + ' ' + batLine(lines[i]));
        }
      }
      L.push('');
      L.push('echo [3/3] 用 VS Code 打开工程');
      L.push('cd /d "%ROOT%"');
      L.push('where code >nul 2>nul');
      L.push('if errorlevel 1 goto NOCODE');
      L.push('code .');
      L.push('echo 完成：%ROOT%');
      L.push('echo 下一步：装好 PlatformIO 扩展后 Ctrl+Alt+B 编译、Ctrl+Alt+U 烧录');
      L.push('goto END');
      L.push('');
      L.push(':NOCODE');
      L.push('echo [提示] 没找到 code 命令，说明 VS Code 还没加到系统 PATH。');
      L.push('echo [提示] 打开 VS Code，Ctrl+Shift+P，执行：Shell Command: Install code command in PATH');
      L.push('echo [提示] 或者手动：文件 ^> 打开文件夹 ^> 选 %ROOT%');
      L.push('');
      L.push(':END');
      L.push('pause');
      L.push('endlocal');
      L.push('');
      return L.join('\r\n');
    }

    function shSource(projectDir, files) {
      var L = [];
      L.push('#!/usr/bin/env bash');
      L.push('# =====================================================================');
      L.push('# 一键生成 PlatformIO 工程并用 VS Code 打开');
      L.push('# 由「PIO 工程生成器」生成。只在本机建目录、写文件，不联网。');
      L.push('# 用法：chmod +x create_and_open.sh && ./create_and_open.sh');
      L.push('# =====================================================================');
      L.push('set -u');
      L.push('');
      L.push('HERE="$(cd "$(dirname "$0")" && pwd)"');
      L.push('DIR="$HERE/' + projectDir + '"');
      L.push('echo "[1/3] 创建目录：$DIR"');
      L.push('mkdir -p "$DIR/src"');
      L.push('');
      L.push('echo "[2/3] 写入工程文件"');
      for (var f = 0; f < files.length; f++) {
        var file = files[f];
        var delim = '__PIO_FILE_' + f + '__';
        L.push('cat > "$DIR/' + file.path + '" <<\'' + delim + '\'');
        var lines = String(file.content).split('\n');
        for (var i = 0; i < lines.length; i++) {
          if (i === lines.length - 1 && lines[i] === '') continue;
          L.push(lines[i]);
        }
        L.push(delim);
      }
      L.push('');
      L.push('echo "[3/3] 用 VS Code 打开工程"');
      L.push('cd "$DIR" || exit 1');
      L.push('if ! command -v code >/dev/null 2>&1; then');
      L.push('  echo "[提示] 没找到 code 命令，说明 VS Code 还没装命令行工具。" >&2');
      L.push('  echo "[提示] 打开 VS Code，Ctrl+Shift+P，执行：Shell Command: Install \'code\' command in PATH" >&2');
      L.push('  echo "[提示] 或者手动：File > Open Folder > 选 $DIR" >&2');
      L.push('  exit 1');
      L.push('fi');
      L.push('code .');
      L.push('echo "完成：$DIR"');
      L.push('echo "下一步：装好 PlatformIO 扩展后 Ctrl+Alt+B 编译、Ctrl+Alt+U 烧录"');
      L.push('');
      return L.join('\n');
    }

    /* ---------- assembly ---------- */

    function structureText(projectDir, mainPath, scriptName, scriptLabel) {
      var lines = [];
      lines.push(projectDir + '/');
      lines.push('├─ platformio.ini          # 平台 / 板子 / 框架 / 烧录方式 / 加速说明');
      lines.push('├─ src/');
      lines.push('│  └─ ' + ljust(mainPath.replace('src/', ''), 19) + ' # 点灯测试代码');
      lines.push('└─ ' + ljust(scriptName, 21) + ' # ' + scriptLabel);
      return lines.join('\n');
    }

    function generate(input) {
      input = input || {};
      var chipRaw = String(input.chip == null ? '' : input.chip).trim();
      var extra = String(input.extra == null ? '' : input.extra).trim();
      var osOpt = oneOf(OS_OPTIONS, input.os, 'windows');
      var flashOpt = oneOf(FLASH_OPTIONS, input.flash, 'ch340');
      var fwOpt = oneOf(FRAMEWORK_OPTIONS, input.framework, 'auto');
      var base = {
        status: 'insufficient',
        chipRaw: chipRaw,
        extra: extra,
        osId: osOpt.id,
        flashId: flashOpt.id,
        frameworkId: fwOpt.id,
        osLabel: osOpt.zh,
        flashLabel: flashOpt.zh
      };

      if (!chipRaw) {
        base.reason = 'empty';
        return base;
      }

      var key = compact(chipRaw + ' ' + extra);
      var hit = matchBoard(key);
      var fam = hit ? null : matchFamily(key);
      // A part we cannot place still deserves a template once the user told us the
      // core / vendor / flash size — that keeps "信息不足" from being a dead end.
      if (!hit && !fam && extra) fam = UNKNOWN_FAMILY;

      if (!hit && !fam) {
        base.reason = 'unknown';
        return base;
      }

      var spec = hit ? specFromBoard(hit) : specFromFamily(fam, key, chipRaw);
      var plan = frameworkPlan(spec, fwOpt.id);
      spec.framework = plan.ini;
      spec.frameworkChosen = plan.chosen;
      spec.frameworkRequested = plan.requested;
      spec.mainKind = plan.kind;

      var up = uploadPlan(spec, flashOpt.id, osOpt.id);

      var projectDir = 'PIO_' + sanitizeName(chipRaw || spec.board);
      var mainPath = plan.path;
      var mainContent =
        plan.kind === 'cmsis-hal' || plan.kind === 'cmsis-bare' ? cmsisSource(spec, chipRaw, plan.kind) :
        plan.kind === 'espidf' ? idfSource(spec, chipRaw) :
        plan.kind === 'c51' ? c51Source(spec, chipRaw) :
        arduinoSource(spec, chipRaw);

      var files = [
        { path: 'platformio.ini', content: iniSource({ chipRaw: chipRaw, osId: osOpt.id, flashId: flashOpt.id, spec: spec, up: up }) },
        { path: mainPath, content: mainContent }
      ];

      var scriptName = osOpt.id === 'windows' ? 'create_and_open.bat' : 'create_and_open.sh';
      var scriptLabel = '一键脚本：建目录 + 写文件 + code .';
      var scriptContent = osOpt.id === 'windows' ? batSource(projectDir, files) : shSource(projectDir, files);
      files.push({
        path: scriptName,
        content: scriptContent,
        hint: osOpt.id === 'windows'
          ? '用 VS Code / 记事本“另存为” UTF-8（无 BOM），文件名保持不变'
          : '保存后先 chmod +x，再 ./create_and_open.sh 运行'
      });

      var notes = [];
      if (hit && spec.exact) {
        notes.push(N('ok',
          '已命中 PlatformIO 内置 board：' + spec.board + '，直接 pio run 就能编译。',
          'Matched the built-in PlatformIO board ' + spec.board + '; pio run works as-is.'));
      } else if (hit) {
        notes.push(N('warn',
          '输入只精确到系列，已按最接近的内置 board（' + spec.board + '）生成，board / platform 两行标了【核对修改】。',
          'Your input matched a board family; the closest built-in board (' + spec.board + ') is used and needs review.'));
      } else {
        notes.push(N('warn',
          '该芯片无 PIO 官方 board 配置，使用通用芯片参数搭建，带【核对修改】注释的参数需要对照芯片手册自行调整。',
          'No official PlatformIO board for this part; a generic template is used and every uncertain line is marked for review.'));
      }
      if (spec.family === 'cortexm') {
        notes.push(N('warn',
          '已按通用 Cortex-M 模板生成：platform / board / framework 三行都要换成厂商 SDK 或社区维护的 PlatformIO 平台；如果厂商只提供裸机 SDK，建议直接用厂商 IDE 建工程，把 src/main.cpp 的代码搬过去。',
          'A generic Cortex-M template was used: replace platform, board and framework with the vendor SDK or a community PlatformIO platform. If the vendor only ships a bare-metal SDK, build in the vendor IDE and copy src/main.cpp.'));
      }
      if (spec.family === 'stm32clone') {
        notes.push(N('warn',
          'GD32 / APM32 / CH32F 这类 F103 兼容芯片，社区常用「ststm32 + genericSTM32F103C8」这条路；寄存器与 Flash 时序不完全一致，量产前请实测。',
          'F103-compatible parts (GD32, APM32, CH32F) usually run on ststm32 + genericSTM32F103C8, but registers and flash timing differ; verify before shipping.'));
      }
      if (spec.family === 'ch32v') {
        notes.push(N('warn',
          'CH32V 是 RISC-V 内核，不兼容 ststm32，必须用社区平台（地址已写进 ini，需要联网拉取）。',
          'CH32V is RISC-V, not STM32-compatible: it needs the community platform referenced in the ini.'));
      }
      if (spec.family === 'mcs51') {
        notes.push(N('err',
          'PlatformIO 没有官方 8051 平台，这份 ini 是占位模板；8051 更现实的路线是 Keil C51 + STC-ISP。',
          'PlatformIO has no official 8051 platform; this ini is a placeholder. Keil C51 + STC-ISP is the realistic route.'));
      }
      if (plan.fallback) {
        notes.push(N('warn',
          '这款芯片不支持「' + labelOf(FRAMEWORK_OPTIONS, plan.fallback).zh + '」，已改用「' + labelOf(FRAMEWORK_OPTIONS, plan.chosen).zh + '」生成：' + spec.platform + ' 平台没有这个框架。',
          'This part has no "' + labelOf(FRAMEWORK_OPTIONS, plan.fallback).en + '" framework; "' + labelOf(FRAMEWORK_OPTIONS, plan.chosen).en + '" was used instead because ' + spec.platform + ' does not provide it.'));
      }
      if (plan.chosen === 'hal') {
        notes.push(N('warn',
          'HAL 路线：PlatformIO 不自带 STM32Cube HAL，源码先用 CMSIS 寄存器点灯保证能编译；文件头写了换成真 HAL 的三步。',
          'HAL route: PlatformIO does not bundle STM32Cube HAL, so the source starts as CMSIS register code that compiles; the header lists the three steps to switch to real HAL.'));
      }
      if (plan.kind === 'cmsis-bare') {
        notes.push(N('info',
          '裸机路线：framework = cmsis，只有启动文件 + CMSIS 头，没有 HAL / Arduino 层，main() 直接是入口。',
          'Bare-metal route: framework = cmsis ships only startup files and CMSIS headers, with no HAL or Arduino layer; main() is the entry point.'));
      }
      if (plan.kind === 'espidf') {
        notes.push(N('info',
          'ESP-IDF 路线：入口是 app_main()，不用 Arduino 层；第一次编译会下载整套 IDF 工具链，比较大。',
          'ESP-IDF route: the entry point is app_main() and there is no Arduino layer; the first build downloads the whole IDF toolchain.'));
      }

      return {
        status: spec.matched && spec.exact ? 'matched' : 'generic',
        chipRaw: chipRaw,
        extra: extra,
        osId: osOpt.id,
        flashId: flashOpt.id,
        frameworkId: plan.requested,
        osLabel: osOpt.zh,
        flashLabel: flashOpt.zh,
        frameworkLabel: labelOf(FRAMEWORK_OPTIONS, plan.chosen).zh,
        spec: spec,
        projectDir: projectDir,
        mainPath: mainPath,
        scriptName: scriptName,
        files: files,
        notes: notes,
        flashNotes: up.notes,
        portHint: up.port ? {
          os: osOpt.id,
          sample: osOpt.port,
          zh: 'CH340 串口烧录要先确认串口号：Windows 在「设备管理器 → 端口(COM 和 LPT)」，Linux 用 ls /dev/ttyUSB*，macOS 用 ls /dev/cu.*。把 ini 里注释掉的 upload_port 改成实际串口再上传；只接一块板时不写通常也能自动探测。',
          en: 'Confirm the serial port first: Device Manager → Ports on Windows, ls /dev/ttyUSB* on Linux, ls /dev/cu.* on macOS. Uncomment upload_port in the ini and set the real one; a single attached board is usually auto-detected.'
        } : null,
        structure: structureText(projectDir, mainPath, scriptName, scriptLabel)
      };
    }

    // Light detection for the form: which frameworks can this chip use right now?
    function probe(input) {
      input = input || {};
      var chipRaw = String(input.chip == null ? '' : input.chip).trim();
      var extra = String(input.extra == null ? '' : input.extra).trim();
      if (!chipRaw) return { status: 'empty', frameworks: [], family: null };
      var key = compact(chipRaw + ' ' + extra);
      var hit = matchBoard(key);
      var fam = hit ? null : matchFamily(key);
      var family = hit ? hit.board.family : (fam ? fam.family : (extra ? 'cortexm' : null));
      if (!family) return { status: 'unknown', frameworks: [], family: null };
      return {
        status: hit && hit.exact ? 'matched' : 'generic',
        family: family,
        frameworks: frameworkAllowed(family)
      };
    }

    // ===== ENGINE END =====

    const NS = 'pio-generator';

    const DICT_ZH = {
      'tab.label': 'PIO 工程生成器',
      'page.title': 'PIO 工程生成器',
      'page.sub': '填三项信息，生成可直接复制的 PlatformIO 工程。不扫描串口、不读硬件、不运行任何命令。',
      'form.title': '请依次填写 / 选择',
      'step1': '① 开发板 / 芯片名称',
      'step1.ph': '任意单片机都行，例如 CH32F103C8T6、ESP32-DevKitC、Arduino Uno',
      'step2': '② 操作系统',
      'step3': '③ 烧录方式',
      'step4': '④ 开发框架（可选）',
      'fw.allowed': '可用框架：',
      'fw.blocked': '这款芯片用不了这个框架，生成时会自动改用：',
      'form.note': '填完之后提交，生成对应 PlatformIO 工程 + 一键脚本',
      'chips': '常用：',
      'btn.generate': '生成 PlatformIO 工程',
      'btn.reset': '重新填写',
      'btn.cancel': '取消',
      'btn.reopen': '重新打开',
      'collapsed.note': '已收起，随时可以重新打开',
      'collapsed.withResult': '已收起，上一次生成的工程还在',
      'btn.supplement': '用补充信息重新生成',
      'err.chip': '请先填写开发板 / 芯片名称，例如 CH32F103C8T6、ESP32-DevKitC、Arduino Uno。',
      'hint.path': '提示：脚本只输出文本，要你自己保存后运行；`code .` 需要 VS Code 已加入 PATH。',
      'copy': '复制',
      'copied': '已复制',
      'stale': '表单已改，下面是上一次生成的结果 —— 点「生成 PlatformIO 工程」重新生成。',
      'sec.files': '工程文件',
      'sec.structure': '文件夹结构',
      'sec.flash': '烧录配置说明',
      'sec.port': '串口号修改提示',
      'sec.prereq': '前置提醒',
      'prereq.1': 'VS Code 必须先装好并加入系统 PATH：命令面板执行 Shell Command: Install \'code\' command in PATH，然后在终端确认 `code -v` 有输出。',
      'prereq.2': '脚本只是文本，插件不会替你执行：把下面两个文件分别存到同一个目录（保持文件名），再双击 .bat / 运行 .sh。',
      'prereq.3': '脚本做的事：新建 PIO_xxx 文件夹 → 写入 platformio.ini 和 src/main.cpp → `code .` 打开工作区。',
      'prereq.4': 'PlatformIO 扩展本身要你自己装（VS Code 扩展商店搜 PlatformIO IDE），插件不会联网安装任何东西。',
      'status.matched': '已命中 PlatformIO 官方 board',
      'status.generic': '通用模板（含【核对修改】）',
      'status.insufficient': '信息不足',
      'insufficient.msg': '信息不足，请补充芯片内核、厂商、Flash 大小。',
      'insufficient.alt': '（也可以直接改上面的芯片名）',
      'insufficient.label': '补充说明：内核 / 厂商 / Flash 大小',
      'insufficient.ph': '例如：Cortex-M4 / 小华半导体 HC32F460 / Flash 512KB',
      'result.for': '本工程针对'
    };

    const DICT_EN = {
      'tab.label': 'PIO project generator',
      'page.title': 'PIO project generator',
      'page.sub': 'Three answers produce a copy-ready PlatformIO project. No serial scan, no hardware access, no commands run.',
      'form.title': 'Fill in the three items',
      'step1': '① Board / chip name',
      'step1.ph': 'Any MCU, e.g. CH32F103C8T6, ESP32-DevKitC, Arduino Uno',
      'step2': '② Operating system',
      'step3': '③ Flashing method',
      'step4': '④ Framework (optional)',
      'fw.allowed': 'Available: ',
      'fw.blocked': 'Not available for this part; it falls back to: ',
      'form.note': 'Submit to generate the PlatformIO project and one-click script',
      'chips': 'Common:',
      'btn.generate': 'Generate project',
      'btn.reset': 'Start over',
      'btn.cancel': 'Cancel',
      'btn.reopen': 'Reopen',
      'collapsed.note': 'Collapsed — reopen any time',
      'collapsed.withResult': 'Collapsed — the last generated project is kept',
      'btn.supplement': 'Regenerate with details',
      'err.chip': 'Enter a board or chip name first, e.g. CH32F103C8T6, ESP32-DevKitC, Arduino Uno.',
      'hint.path': 'Heads-up: the script is text you save and run yourself; `code .` needs VS Code on PATH.',
      'copy': 'Copy',
      'copied': 'Copied',
      'stale': 'The form changed — this is the previous result. Click Generate project to refresh.',
      'sec.files': 'Project files',
      'sec.structure': 'Folder layout',
      'sec.flash': 'Flashing notes',
      'sec.port': 'Serial port',
      'sec.prereq': 'Before you run it',
      'prereq.1': 'VS Code must be installed and on PATH: run Shell Command: Install \'code\' command in PATH, then check `code -v`.',
      'prereq.2': 'The script is text only — this plugin never runs it. Save both files in one folder, keep the names, then run them.',
      'prereq.3': 'What it does: create PIO_xxx → write platformio.ini and src/main.cpp → open the folder with `code .`.',
      'prereq.4': 'Install the PlatformIO IDE extension yourself; the plugin downloads nothing.',
      'status.matched': 'Matched a built-in PlatformIO board',
      'status.generic': 'Generic template (lines marked for review)',
      'status.insufficient': 'Not enough information',
      'insufficient.msg': 'Not enough information. Add the core, the vendor, and the flash size.',
      'insufficient.alt': '(or edit the chip name above)',
      'insufficient.label': 'Details: core / vendor / flash size',
      'insufficient.ph': 'e.g. Cortex-M4 / HDSC HC32F460 / 512KB flash',
      'result.for': 'Generated for'
    };

    function readLang(locale) {
      try {
        const snap = locale.getLocale();
        const active = snap && snap.active ? String(snap.active).toLowerCase() : 'zh';
        return active.indexOf('zh') === 0 ? 'zh' : 'en';
      } catch (e) {
        return 'zh';
      }
    }

    function msg(m, lang) {
      if (!m) return '';
      return lang === 'zh' ? m.zh : m.en;
    }

    const CSS = [
      '.pio{display:flex;flex-direction:column;gap:14px;max-width:780px;margin:0 auto;padding:4px 2px 32px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.6;-webkit-font-smoothing:antialiased}',
      '.pio.pio-embedded{max-width:none;margin:0;padding:2px 0 8px;gap:12px}',
      '.pio-title{margin:0;font-size:15px;font-weight:600;letter-spacing:.1px}',
      '.pio-sub{margin:3px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.pio-card{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;padding:14px}',
      '.pio-row{display:flex;flex-direction:column;gap:6px}',
      '.pio-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
      '.pio-grid.three{grid-template-columns:1fr 1fr 1fr;gap:10px}',
      '@media (max-width:620px){.pio-grid,.pio-grid.three{grid-template-columns:1fr}}',
      '.pio-label{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary)}',
      '.pio-no{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;border:1px solid var(--dsw-alias-border-l2);font-size:10px;font-weight:600;color:var(--dsw-alias-label-secondary);flex:none}',
      '.pio-no.on{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);color:#fff}',
      '.pio-input,.pio-select{width:100%;box-sizing:border-box;height:34px;padding:0 10px;border-radius:7px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;font-family:inherit;outline:none}',
      '.pio-input:focus,.pio-select:focus{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-brand-primary)}',
      '.pio-input::placeholder{color:var(--dsw-alias-label-secondary);opacity:.75}',
      '.pio-area{width:100%;box-sizing:border-box;min-height:66px;padding:8px 10px;border-radius:7px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;font-family:inherit;line-height:1.55;resize:vertical;outline:none}',
      '.pio-area:focus{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-brand-primary)}',
      '.pio-chips{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.pio-chip{height:24px;padding:0 9px;border-radius:12px;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);font-size:11.5px;font-family:inherit;cursor:pointer}',
      '.pio-chip:hover{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2)}',
      '.pio-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:2px}',
      '.pio-btn{display:inline-flex;align-items:center;justify-content:center;height:32px;padding:0 14px;border-radius:7px;border:1px solid transparent;background:var(--dsw-alias-brand-primary);color:#fff;font-size:13px;font-family:inherit;cursor:pointer;white-space:nowrap}',
      '.pio-btn:hover{filter:brightness(1.07)}',
      '.pio-btn:disabled{opacity:.55;cursor:not-allowed;filter:none}',
      '.pio-btn.ghost{background:transparent;color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l1)}',
      '.pio-btn.ghost:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.pio-btn.sm{height:26px;padding:0 10px;font-size:12px}',
      '.pio-err{margin:0;font-size:12px;color:var(--dsw-alias-state-error-primary)}',
      '.pio-banner{display:flex;gap:9px;padding:10px 12px;border-radius:9px;border:1px solid var(--dsw-alias-border-l1);border-left-width:3px;background:var(--dsw-alias-bg-layer-1);font-size:12.5px}',
      '.pio-banner .dot{width:7px;height:7px;border-radius:50%;margin-top:7px;flex:none;background:var(--dsw-alias-state-idle-primary)}',
      '.pio-banner.ok{border-left-color:var(--dsw-alias-state-success-primary)}',
      '.pio-banner.ok .dot{background:var(--dsw-alias-state-success-primary)}',
      '.pio-banner.warn{border-left-color:var(--dsw-alias-state-warn-primary)}',
      '.pio-banner.warn .dot{background:var(--dsw-alias-state-warn-primary)}',
      '.pio-banner.err{border-left-color:var(--dsw-alias-state-error-primary)}',
      '.pio-banner.err .dot{background:var(--dsw-alias-state-error-primary)}',
      '.pio-banner.info{border-left-color:var(--dsw-alias-brand-primary)}',
      '.pio-banner.info .dot{background:var(--dsw-alias-brand-primary)}',
      '.pio-banner p{margin:0}',
      '.pio-banner p+p{margin-top:4px}',
      '.pio-sec{display:flex;flex-direction:column;gap:8px;margin-top:18px}',
      '.pio-sec-title{margin:0;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);letter-spacing:.3px;text-transform:none}',
      '.pio-file{display:flex;flex-direction:column;gap:6px}',
      '.pio-file-head{display:flex;align-items:center;justify-content:space-between;gap:8px}',
      '.pio-file-name{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.pio-code{margin:0;padding:12px 13px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);overflow:auto;max-height:330px;white-space:pre;tab-size:2;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.55}',
      '.pio-code:focus{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.pio-tree{margin:0;padding:12px 13px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);overflow:auto;white-space:pre;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.7}',
      '.pio-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}',
      '.pio-hint{margin:0;font-size:11.5px;color:var(--dsw-alias-label-secondary)}',
      '.pio-warn{font-size:11.5px;color:var(--dsw-alias-state-warn-primary);margin-top:2px}',
      '.pio-buf{position:absolute;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none}',
      '.pio-meta{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:11.5px;color:var(--dsw-alias-label-secondary)}',
      '.pio-meta b{font-weight:600;color:var(--dsw-alias-label-primary)}',
      '.pio-meta-end{margin-left:auto}',
      '.pio-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}',
      '.pio-collapse-bar{display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px dashed var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-1)}',
      '.pio-collapse-name{font-size:12.5px;font-weight:600;flex:none}',
      '.pio-collapse-note{font-size:11.5px;color:var(--dsw-alias-label-secondary);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    ].join('\n');

    function useLang(locale) {
      const [lang, setLang] = React.useState(function () { return readLang(locale); });
      React.useEffect(function () {
        setLang(readLang(locale));
        return locale.subscribe(function () { setLang(readLang(locale)); });
      }, [locale]);
      return lang;
    }

    // One entry per command row / settings page, so a remount does not throw away
    // what the user already typed or generated.
    const FORM_CACHE = new Map();

    function detectHostOs() {
      try {
        const hint = String((navigator.platform || '') + ' ' + (navigator.userAgent || ''));
        if (/mac/i.test(hint)) return 'mac';
        if (/linux/i.test(hint) && !/android/i.test(hint)) return 'linux';
      } catch (e) { /* keep the Windows default */ }
      return 'windows';
    }

    function rowKey(props) {
      const node = props && props.node;
      if (!node) return 'row';
      const id = node.id || node.commandId || (node.command && node.command.id);
      return id ? String(id) : 'row';
    }

    function PioPanel(props) {
      const t = props.t;
      const locale = props.locale;
      const lang = useLang(locale);
      const cacheKey = props.cacheKey || 'page';
      const initial = FORM_CACHE.get(cacheKey) || {};
      const embedded = props.variant === 'command';

      const [chip, setChip] = React.useState(function () { return initial.chip || ''; });
      const [os, setOs] = React.useState(function () { return initial.os || detectHostOs(); });
      const [flash, setFlash] = React.useState(function () { return initial.flash || 'ch340'; });
      const [framework, setFramework] = React.useState(function () { return initial.framework || 'auto'; });
      const [extra, setExtra] = React.useState(function () { return initial.extra || ''; });
      const [error, setError] = React.useState('');
      const [result, setResult] = React.useState(function () { return initial.result || null; });
      const [copied, setCopied] = React.useState('');
      const [collapsed, setCollapsed] = React.useState(function () { return !!initial.collapsed; });

      React.useEffect(function () {
        FORM_CACHE.set(cacheKey, {
          chip: chip, os: os, flash: flash, framework: framework,
          extra: extra, result: result, collapsed: collapsed
        });
      }, [cacheKey, chip, os, flash, framework, extra, result, collapsed]);

      const inputRef = React.useRef(null);
      const bufRef = React.useRef(null);
      const timerRef = React.useRef(null);
      const resultRef = React.useRef(null);

      React.useEffect(function () {
        return function () {
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }, []);

      React.useEffect(function () {
        const el = resultRef.current;
        if (result && el && el.scrollIntoView) {
          try { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { /* older engines */ }
        }
      }, [result]);

      // Cancelled: shrink to one bar. The row itself is a logged command, so it
      // cannot be deleted — but nothing of the form stays in the way.
      if (collapsed) {
        return h('div', { className: 'pio' + (embedded ? ' pio-embedded' : '') },
          h('style', null, CSS),
          h('div', { className: 'pio-collapse-bar' },
            h('span', { className: 'pio-collapse-name' }, t('page.title')),
            h('span', { className: 'pio-collapse-note' },
              result ? t('collapsed.withResult') : t('collapsed.note')),
            h('button', {
              type: 'button',
              className: 'pio-btn ghost sm',
              onClick: function () { setCollapsed(false); }
            }, t('btn.reopen'))
          )
        );
      }

      function run(withExtra) {
        const value = String(chip || '').trim();
        if (!value) {
          setError(t('err.chip'));
          const el = inputRef.current;
          if (el && el.focus) el.focus();
          return;
        }
        setError('');
        setResult(generate({ chip: value, os: os, flash: flash, framework: framework, extra: extra }));
      }

      function reset() {
        setChip('');
        setExtra('');
        setError('');
        setResult(null);
        setCopied('');
        const el = inputRef.current;
        if (el && el.focus) el.focus();
      }

      function copy(text, id) {
        function done() {
          setCopied(id);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(function () { setCopied(''); }, 1400);
        }
        function fallback() {
          const buf = bufRef.current;
          if (!buf) return;
          buf.value = text;
          buf.select();
          let ok = false;
          try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
          buf.value = '';
          if (ok) done();
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else {
          fallback();
        }
      }

      const step1Done = String(chip || '').trim().length > 0;
      const probeResult = probe({ chip: chip, extra: extra });
      const fwAllowed = probeResult.frameworks.length ? probeResult.frameworks : ['arduino'];
      const fwBlocked = framework !== 'auto' && fwAllowed.indexOf(framework) < 0;
      const fwEffective = framework === 'auto' || fwBlocked ? fwAllowed[0] : framework;
      const fwHint = probeResult.family
        ? h('div', { className: 'pio-hint', style: { marginTop: '2px' } },
            h('span', null, t('fw.allowed')),
            h('span', null, fwAllowed.map(function (id) { return labelOf(FRAMEWORK_OPTIONS, id)[lang === 'zh' ? 'zh' : 'en']; }).join(' / ')),
            fwBlocked ? h('div', { className: 'pio-warn' }, t('fw.blocked'), labelOf(FRAMEWORK_OPTIONS, fwEffective)[lang === 'zh' ? 'zh' : 'en']) : null
          )
        : null;
      const stale = !!(result && result.status !== 'insufficient' &&
        (result.chipRaw !== String(chip || '').trim() || result.osId !== os ||
          result.flashId !== flash || result.frameworkId !== framework));

      const insufficient = h('div', { className: 'pio-sec' },
        banner('warn', t('insufficient.msg') + ' ' + t('insufficient.alt')),
        h('div', { className: 'pio-card' },
          h('div', { className: 'pio-row' },
            h('label', { className: 'pio-label', htmlFor: 'pio-extra' }, t('insufficient.label')),
            h('textarea', {
              id: 'pio-extra',
              className: 'pio-area',
              value: extra,
              placeholder: t('insufficient.ph'),
              onChange: function (e) { setExtra(e.target.value); }
            })
          ),
          h('div', { className: 'pio-actions', style: { marginTop: '10px' } },
            h('button', { type: 'button', className: 'pio-btn', onClick: function () { run(true); } }, t('btn.supplement'))
          )
        )
      );

      const form = h('div', { className: 'pio-card' },
        h('div', { className: 'pio-card-head' },
          h('div', { className: 'pio-label', style: { fontSize: '12.5px' } }, t('form.title')),
          h('button', {
            type: 'button',
            className: 'pio-btn ghost sm',
            title: t('btn.cancel'),
            onClick: function () { setCollapsed(true); }
          }, t('btn.cancel'))
        ),
        h('div', { className: 'pio-row' },
          h('label', { className: 'pio-label', htmlFor: 'pio-chip' },
            h('span', { className: 'pio-no' + (step1Done ? ' on' : '') }, '1'),
            h('span', null, t('step1'))
          ),
          h('input', {
            id: 'pio-chip',
            ref: inputRef,
            className: 'pio-input',
            type: 'text',
            value: chip,
            autoComplete: 'off',
            spellCheck: false,
            placeholder: t('step1.ph'),
            onChange: function (e) { setChip(e.target.value); if (error) setError(''); },
            onKeyDown: function (e) { if (e.key === 'Enter') { e.preventDefault(); run(false); } }
          }),
          h('div', { className: 'pio-chips' },
            h('span', null, t('chips')),
            ['ESP32-DevKitC', 'STM32F103C8T6', 'Arduino Uno', 'CH32F103C8T6'].map(function (name) {
              return h('button', {
                key: name,
                type: 'button',
                className: 'pio-chip',
                onClick: function () { setChip(name); if (error) setError(''); }
              }, name);
            })
          )
        ),
        h('div', { className: 'pio-grid three', style: { marginTop: '12px' } },
          h('div', { className: 'pio-row' },
            h('label', { className: 'pio-label', htmlFor: 'pio-os' },
              h('span', { className: 'pio-no on' }, '2'),
              h('span', null, t('step2'))
            ),
            h('select', {
              id: 'pio-os',
              className: 'pio-select',
              value: os,
              onChange: function (e) { setOs(e.target.value); }
            }, OS_OPTIONS.map(function (o) {
              return h('option', { key: o.id, value: o.id }, lang === 'zh' ? o.zh : o.en);
            }))
          ),
          h('div', { className: 'pio-row' },
            h('label', { className: 'pio-label', htmlFor: 'pio-flash' },
              h('span', { className: 'pio-no on' }, '3'),
              h('span', null, t('step3'))
            ),
            h('select', {
              id: 'pio-flash',
              className: 'pio-select',
              value: flash,
              onChange: function (e) { setFlash(e.target.value); }
            }, FLASH_OPTIONS.map(function (o) {
              return h('option', { key: o.id, value: o.id }, lang === 'zh' ? o.zh : o.en);
            }))
          ),
          h('div', { className: 'pio-row' },
            h('label', { className: 'pio-label', htmlFor: 'pio-framework' },
              h('span', { className: 'pio-no on' }, '4'),
              h('span', null, t('step4'))
            ),
            h('select', {
              id: 'pio-framework',
              className: 'pio-select',
              value: framework,
              onChange: function (e) { setFramework(e.target.value); }
            }, FRAMEWORK_OPTIONS.map(function (o) {
              return h('option', { key: o.id, value: o.id }, lang === 'zh' ? o.zh : o.en);
            })),
            fwHint
          )
        ),
        h('div', { className: 'pio-actions' },
          h('button', { type: 'button', className: 'pio-btn', onClick: function () { run(false); } }, t('btn.generate')),
          result ? h('button', { type: 'button', className: 'pio-btn ghost', onClick: reset }, t('btn.reset')) : null,
          h('span', { className: 'pio-hint' }, t('form.note'))
        ),
        error ? h('p', { className: 'pio-err', style: { marginTop: '6px' }, role: 'alert' }, error) : null,
        h('p', { className: 'pio-hint', style: { marginTop: '8px' } }, t('hint.path'))
      );

      return h('div', { className: 'pio' + (embedded ? ' pio-embedded' : '') },
        h('style', null, CSS),
        h('div', null,
          h('h2', { className: 'pio-title' }, t('page.title')),
          embedded ? null : h('p', { className: 'pio-sub' }, t('page.sub'))
        ),
        form,
        h('div', { ref: resultRef },
          result && result.status === 'insufficient' ? insufficient : null,
          result && result.status !== 'insufficient' ? renderResult(result, lang, t, copied, copy, stale, function () { setCollapsed(true); }) : null
        ),
        h('textarea', { ref: bufRef, className: 'pio-buf', readOnly: true, tabIndex: -1, 'aria-hidden': 'true' })
      );
    }

    function banner(tone, text) {
      return h('div', { className: 'pio-banner ' + tone, role: tone === 'err' ? 'alert' : 'status' },
        h('span', { className: 'dot', 'aria-hidden': 'true' }),
        h('div', null, h('p', null, text))
      );
    }

    function section(title, children) {
      return h('div', { className: 'pio-sec' },
        h('h3', { className: 'pio-sec-title' }, title),
        children
      );
    }

    function fileBlock(file, idx, t, copied, copy) {
      const id = 'f:' + idx;
      return h('div', { className: 'pio-file', key: id },
        h('div', { className: 'pio-file-head' },
          h('span', { className: 'pio-file-name' }, file.path),
          h('button', {
            type: 'button',
            className: 'pio-btn ghost sm',
            onClick: function () { copy(file.content, id); }
          }, copied === id ? t('copied') : t('copy'))
        ),
        file.hint ? h('p', { className: 'pio-hint' }, file.hint) : null,
        h('pre', {
          className: 'pio-code',
          tabIndex: 0,
          'aria-label': file.path,
          role: 'region'
        }, h('code', null, file.content))
      );
    }

    function renderResult(result, lang, t, copied, copy, stale, onCancel) {
      const tone = result.status === 'matched' ? 'ok' : 'warn';
      const statusText = result.status === 'matched' ? t('status.matched') : t('status.generic');

      const head = h('div', { className: 'pio-sec' },
        stale ? banner('warn', t('stale')) : null,
        banner(tone, statusText),
        h('div', { className: 'pio-meta' },
          h('span', null, t('result.for'), lang === 'zh' ? '：' : ': ', h('b', null, result.chipRaw)),
          h('span', null, result.osLabel, ' · ', result.flashLabel, ' · ', result.frameworkLabel),
          h('span', null, h('b', null, result.projectDir + '/')),
          result.spec ? h('span', null, 'platform = ', result.spec.platform, ' · board = ', result.spec.board, ' · framework = ', result.spec.framework) : null,
          onCancel ? h('span', { className: 'pio-meta-end' },
            h('button', {
              type: 'button',
              className: 'pio-btn ghost sm',
              title: t('btn.cancel'),
              onClick: onCancel
            }, t('btn.cancel'))
          ) : null
        )
      );

      const notes = h('div', { className: 'pio-sec' },
        h('ul', { className: 'pio-list' },
          (result.notes || []).map(function (n, i) { return h('li', { key: 'n' + i }, banner(n.tone, msg(n, lang))); })
        )
      );

      const prereq = section(t('sec.prereq'),
        h('ul', { className: 'pio-list' },
          ['prereq.1', 'prereq.2', 'prereq.3', 'prereq.4'].map(function (k) {
            return h('li', { key: k }, banner('info', t(k)));
          })
        )
      );

      const files = section(t('sec.files'),
        h('div', { className: 'pio-list' },
          result.files.map(function (f, i) { return fileBlock(f, i, t, copied, copy); })
        )
      );

      const structure = section(t('sec.structure'),
        h('pre', { className: 'pio-tree', tabIndex: 0, 'aria-label': t('sec.structure'), role: 'region' }, result.structure + '\n')
      );

      const flashNotes = section(t('sec.flash'),
        h('ul', { className: 'pio-list' },
          (result.flashNotes || []).map(function (n, i) { return h('li', { key: 'fl' + i }, banner(n.tone, msg(n, lang))); })
        )
      );

      const port = result.portHint ? section(t('sec.port'),
        banner('warn', msg(result.portHint, lang))
      ) : null;

      // Prerequisite first: the user has to save the script and have `code` before any copy matters.
      return h('div', null, head, notes, prereq, files, structure, flashNotes, port);
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const locale = ctx.locale;

        try { locale.register(NS, 'en', DICT_EN); } catch (e) { /* already registered */ }
        try { locale.register(NS, 'zh', DICT_ZH); } catch (e) { /* already registered */ }

        let t;
        try {
          t = locale.bind(NS);
        } catch (e) {
          t = function (key) {
            const dict = readLang(locale) === 'zh' ? DICT_ZH : DICT_EN;
            return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
          };
        }

        // Primary entry: `/pio` in the composer renders this form inside the command row.
        ctx.slots.inject('conversation.chat.commandview', () => ctx.slots.register({
          name: 'conversation.chat.commandview',
          key: 'pio'
        }, (props) => h(PioPanel, Object.assign({}, props, {
          t: t,
          locale: locale,
          variant: 'command',
          cacheKey: 'pio:' + rowKey(props)
        }))));

        // Fallback entry: the Plugins settings tab, for when the command is unreachable.
        ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
          name: 'settings.plugins.tab',
          id: 'pio-generator',
          order: 40,
          label: () => t('tab.label')
        }, (props) => h(PioPanel, Object.assign({}, props, { t: t, locale: locale, cacheKey: 'page' }))));
      }
    };
  }
});
