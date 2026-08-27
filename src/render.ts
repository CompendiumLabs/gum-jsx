// gum-jsx/render: rasterizing and terminal output (node only)

import { rasterizeSvg, formatImage, type FormatImageArgs } from '@gum-jsx/node'
import { mathToElement, type MathArgs } from '@gum-jsx/math'

interface MathPngArgs extends MathArgs {
  scale?: number         // raster scale factor (pixels per svg pixel)
}

interface MathKittyArgs extends MathPngArgs, FormatImageArgs {}

function mathToPng(tex: string, args: MathPngArgs = {}): Buffer {
  const { scale = 1, ...margs } = args
  const elem = mathToElement(tex, margs)
  const [ w, h ] = elem.size
  const svg = elem.svg()
  return rasterizeSvg(svg, { size: [ Math.round(scale * w), Math.round(scale * h) ] })
}

function mathToKitty(tex: string, args: MathKittyArgs = {}): string {
  const { imageId, placementId, chunkSize, columns, rows, cursorMovement, ...pargs } = args
  const png = mathToPng(tex, pargs)
  return formatImage(png, { imageId, placementId, chunkSize, columns, rows, cursorMovement })
}

export * from '@gum-jsx/node'
export { mathToPng, mathToKitty }
export type { MathPngArgs, MathKittyArgs }
