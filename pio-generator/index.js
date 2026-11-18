/**
 * Host half of the PIO generator bundle.
 *
 * Registers the `/pio` human command. The command itself carries no model turn:
 * typing `/pio` logs one command row, and the Client module renders the form
 * inside that row (client.js registers `pio` in conversation.chat.commandview).
 * Everything is generated in the browser — nothing is scanned, nothing runs.
 */
export const inject = ['commands'];

export function apply(ctx) {
  ctx.effect(() => ctx.commands.register({
    name: 'pio',
    description: '打开 PIO 工程生成器：选芯片 / 系统 / 烧录方式 / 框架，生成 platformio.ini + 点灯源码 + 一键脚本',
    handler() {
      return { kind: 'success', text: 'PIO 工程生成器已打开，在下面填好再点「生成 PlatformIO 工程」。' };
    }
  }));
}
