# PIO 工程生成器 · DeepSeek Harness 插件

<img src="icon.svg" width="64" alt="插件图标">

在 DSH 对话里输入 **`/pio`**，填四个选项，直接拿到一份能编译的 PlatformIO 工程：
`platformio.ini` + 点灯源码 + 一键打开脚本，全部可复制。

不是"让 AI 帮你写个工程"，是**确定性的代码生成**：同样的输入永远同样的输出，参数来自内置的 board 表，不确定的一律标 `【核对修改】`。

## 安装

插件是零依赖的，只需要 DSH 本体（`engines.dsh >= 0.2.2-rc.3`）。

**方式一：解压 + 加本地目录（推荐）**

1. 从 [Releases](../../releases) 下载 `pio-generator-x.y.z.zip`，解压得到 `pio-generator/` 文件夹；
2. DSH → **设置 → 插件 → 添加插件（Add plugin）**，选这个文件夹；
3. 重启 DSH（Host 侧代码只在启动时加载）；页面刷新后生效。

**方式二：tarball**

```bash
npm install ./pio-generator-1.0.1.tgz
```
然后把解出来的包目录同样通过「添加插件」指过去。

**方式三：发布到 npm 之后**

```bash
npm install -g pio-generator   # 或直接在「添加插件」里填 pio-generator
```

> 插件会在 `设置 → 插件` 里出现一行，同时注册 `/pio` 命令和「PIO 工程生成器」设置页签。

## 用法

1. 输入框打 `/pio` → 回车（打 `/` 时补全里能看到 `pio`）；
2. 对话里出现表单，依次填：

   | 项 | 说明 |
   | --- | --- |
   | ① 开发板 / 芯片名称 | 自由输入，不限品牌：`ESP32-DevKitC`、`STM32F103C8T6`、`Arduino Uno`、`CH32F103C8T6`、`STC89C52RC`… |
   | ② 操作系统 | Windows / Mac / Linux（决定生成 `.bat` 还是 `.sh`） |
   | ③ 烧录方式 | CH340 串口 / ST-Link / J-Link / USB DFU / 其他 |
   | ④ 开发框架（可选） | 自动 / Arduino / HAL / 裸机 SDK，默认「自动」 |

3. 点「**生成 PlatformIO 工程**」，结果依次展开：前置提醒 → 三个代码块 → 文件夹结构 → 烧录说明 → 串口号提示；
4. 每块右上角「复制」，复制到本地对应文件里；或者只复制一键脚本，双击它自动建目录、写文件、用 `code .` 打开 VS Code。

不想看了点「**取消**」：卡片收成一行，输入和结果都还在，点「重新打开」原样回来。

备用入口：**设置 → 插件 →「PIO 工程生成器」** 页签，命令没起来时可以走这里。

## 三种结果

| 输入情况 | 输出 |
| --- | --- |
| 命中内置 PlatformIO board（33 个） | 标准 `platformio.ini`，绿色提示，`pio run` 直接编译 |
| 小众芯片（CH32 / GD32 / APM32 / CH32V / STC…） | 通用参数搭建，需要你改的行整行标 `【核对修改】` |
| 信息不足以定位平台 | 提示补充「内核 / 厂商 / Flash 大小」；补完给通用 Cortex-M 模板，不会卡死 |

## 开发框架

| 选择 | `framework =` | 源码 | 说明 |
| --- | --- | --- | --- |
| 自动 | 按芯片族取第一个可用的 | 跟着变 | 默认 |
| Arduino | `arduino` | `src/main.cpp` | 有 Arduino 核心的芯片都给 |
| HAL | `cmsis` | `src/main.c` | PlatformIO **不自带** STM32Cube HAL，先给能直接编译的 CMSIS 寄存器版，文件头写清换真 HAL 的三步 |
| 裸机 SDK | STM32→`cmsis`、ESP32→`espidf`、8051→`sdcc` | `src/main.c` | 入口 `main()` / `app_main()` |

芯片用不了所选框架时，下拉框下面先给黄色提示，生成时自动换用可用框架并说明原因 —— 不硬塞一个编译不过的 ini。

## 边界（重要）

- **不扫描串口、不读取电脑硬件、不直接操控 VS Code**：插件跑在页面里，只做文本生成；
- 一键脚本是**纯文本输出**，插件不会替你执行，需要你保存到本地再双击 / `bash`；
- `code .` 要求 VS Code 已加入系统 PATH：命令面板执行 `Shell Command: Install 'code' command in PATH`；
- `.bat` 请**另存为 UTF-8（无 BOM）**，否则中文注释会乱码、`@echo off` 会被 BOM 破坏；
- CH340 串口烧录前要把 ini 里注释掉的 `upload_port` 改成实际 COM 口。

## 关于国内镜像

PlatformIO **没有官方中国镜像站**。网上流传的 gitee / 阿里云「平台镜像」地址大多已失效（本项目实测两个都是 404），所以 ini 里不写死任何镜像 URL，而是给三档按有效性排序的方案：pip 清华源（一定有效）→ 单包 `platform_packages` 直链 → `lib_deps` 走 git。

## 目录结构

```
pio-generator/
├─ package.json         # 包清单 + dsh.client 声明
├─ cordis.patch.yml     # bundle 补丁，插入一行插件
├─ index.js             # Host 侧：注册 /pio 命令
├─ client.js            # 客户端：表单 UI + 生成引擎（board 表、匹配、ini/源码/脚本生成）
├─ locale/              # 插件列表里的标题与描述（en / zh）
├─ icon.svg             # 插件图标
└─ test/                # 引擎回归测试（不随包发布）
```

## 开发

```bash
npm test        # 或 node test/engine.test.mjs
```

测试直接从未打包的 `client.js` 里抽出纯函数引擎跑断言：匹配矩阵、三种分支、框架路由、脚本转义。

改完后：客户端改动刷新页面即可；Host 侧（`index.js`）改动需要重启 DSH。

## License

MIT，见 [LICENSE](LICENSE)。

---

### English

A DeepSeek Harness plugin. Type `/pio` in the composer and get a ready-to-build PlatformIO project — `platformio.ini`, a blink example, and a one-click script that creates the folder and opens it in VS Code.

33 built-in boards produce a standard project; uncommon parts (CH32, GD32, …) fall back to a generic template where every uncertain line is marked for review; an unsupported framework is reported and replaced instead of silently producing a broken config.

The plugin only generates text: it does not scan serial ports, read hardware, or run local commands. Scripts are for you to save and run. MIT licensed.
