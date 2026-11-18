# dsh-PIO
 DeepSeek Harness（DSH）的一个插件。在对话输入框里打 /pio 回车，   填四个选项，直接生成一份能编译的 PlatformIO 工程：   platformio.ini + 点灯源码 + 一键打开脚本。
# PIO 工程生成器
DeepSeek Harness（DSH）的插件。
在对话输入框里打 `/pio` 回车，填写四个选项，直接生成一份可以编译的 PlatformIO 工程，包含 platformio.ini、点灯源码、一键打开脚本。

## 安装
### Windows 本地安装
1. 解压 `pio-generator-1.0.1.zip`，得到 `pio-generator` 文件夹
2. DSH → 设置 → 插件 → 添加插件，选择这个文件夹
3. 重启 DSH（插件仅启动时加载，不重启 `/pio` 命令不会生效）
4. 刷新页面

### DSH 命令从 GitHub 安装
```bash
dsh plugin add github:HhhTZX/dsh-PIO

###使用方法

 1. 输入框输入 `/pio` 回车，输入 `/` 时补全列表可以看到 pio
 2. 依次填写：①芯片名 ②系统 ③烧录方式 ④开发框架（可选，默认自动）
 3. 点击「生成 PlatformIO 工程」，复制代码块，或者直接运行一键脚本 
 > 备用入口：设置 → 插件 →「PIO 工程生成器」页签。
