// Copied into an isolated npm consumer by png-package.ts.
import assert from 'node:assert/strict'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { registerRenderTool } from './node_modules/@gum-jsx/mcp/src/render-tool.ts'

function cli(name: string, args: string[], input = '') {
  return Bun.spawnSync([process.execPath, '--no-addons', `node_modules/.bin/${name}`, ...args], {
    stdin: Buffer.from(input), stdout: 'pipe', stderr: 'pipe',
  })
}
function success(result: ReturnType<typeof cli>): Buffer {
  assert.equal(result.exitCode, 0, result.stderr.toString())
  return result.stdout
}
function size(png: Buffer): number[] {
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  return [png.readUInt32BE(16), png.readUInt32BE(20)]
}
function kitty(output: Buffer): Buffer {
  return Buffer.from([...output.toString().matchAll(/\x1b_G[^;]*;([^\x1b]*)\x1b\\/g)]
    .map(match => match[1]).join(''), 'base64')
}
const code = `<Svg width="120px" height="60px">
  <HStack>
    <Circle width="20px" fill="red" />
    <Text>Gum</Text>
    <Latex>x^2</Latex>
  </HStack>
</Svg>`
for (const encoding of ['fast', 'standard']) {
  const args = ['--theme', 'light', '--background', 'white', '--png-encoding', encoding,
    '--select', '10,5,12,8', '--ratio', '3']
  const png = success(cli('gum', [...args, '-f', 'png'], code))
  assert.deepEqual(size(png), [36, 24])
  assert.deepEqual(kitty(success(cli('gum', args, code))), png)
  const tex = success(cli('gum-tex', ['x^2', ...args, '-f', 'png']))
  assert.deepEqual(size(tex), [36, 24])
  assert.deepEqual(kitty(success(cli('gum-tex', ['x^2', ...args]))), tex)
}
success(cli('gum', ['-o', 'figure.png'], code))
assert.deepEqual(size(Buffer.from(await Bun.file('figure.png').arrayBuffer())), [120, 60])
assert.ok(success(cli('gum', ['-f', 'svg'], code)).toString().includes('<svg'))
const markdown = success(cli('gum-mark', [], 'Inline $x^2$\n\n```gum\n' + code + '\n```')).toString()
assert.equal([...markdown.matchAll(/\x1b_Gf=100/g)].length, 2, 'Markdown must render both math and Gum images')
const live = success(cli('gum', ['-f', 'png', '--text-mode', 'live'], '<Text>Live</Text>'))
assert.deepEqual(live, success(cli('gum', ['-f', 'png'], '<Text>Live</Text>')))
console.log('ok - installed gum, gum-tex, gum-mark, PNG files, and kitty output')

const server = new McpServer({ name: 'gum-package-test', version: '0' })
registerRenderTool(server, 'ui://gum/test.html')
const client = new Client({ name: 'package-check', version: '0' })
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
await server.connect(serverTransport)
try {
  await client.connect(clientTransport)
  const raster = await client.callTool({ name: 'rasterize', arguments: { code } })
  assert.notEqual(raster.isError, true, JSON.stringify(raster.content))
  const image = (raster.content as { type: string; data: string }[]).find(item => item.type === 'image')!
  assert.deepEqual(size(Buffer.from(image.data, 'base64')), [240, 120])
  const display = await client.callTool({ name: 'render', arguments: { code } })
  assert.notEqual(display.isError, true)
  for (const [source, message] of [
    ['<Frame><Text>😀</Text></Frame>', 'cannot draw live text'],
    ['return 42', 'value instead of an element'],
  ]) {
    const result = await client.callTool({ name: 'rasterize', arguments: { code: source } })
    assert.equal(result.isError, true)
    assert.ok(JSON.stringify(result.content).includes(message))
    assert.ok(!(result.content as { type: string }[]).some(item => item.type === 'image'))
  }
} finally {
  await client.close()
  await server.close()
}
console.log('ok - installed MCP rasterize, render validation, and actionable errors')
