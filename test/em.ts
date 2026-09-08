// The em metrics of the text elements (core's lib/em.ts) under the layout
// protocol (core's lib/layout.ts): the boxes a paragraph, a list, a scaled
// heading, a stack, a padded box and a formula report, checked as numbers
// rather than through a render. The math side is covered by the example
// suite; these pin the text side and the stack rules.

import { strict as assert } from 'node:assert'

import { gum } from '@gum-jsx/core'
import { vtext, maxis } from '@gum-jsx/core/lib/const'
import type { EmSpec } from '@gum-jsx/core/lib/em'

import '../src/eval' // the math plugin on the default Env

const TEXT_ANCHOR = 1 + vtext - maxis

function close(actual: number, expected: number, what: string): void {
    assert.ok(Math.abs(actual - expected) < 1e-9, `${what}: expected ${expected}, got ${actual}`)
}

// the root element of some code and its metrics (the Svg lays its child out
// for the canvas, so this is the element as laid)
function root(code: string): { elem: any, em: EmSpec } {
    const elem = gum.evaluate(code).children[0] as any
    assert.ok(elem.em != null, `${code}: no em record`)
    return { elem, em: elem.em }
}

// an element placed by rect in a group gets no offer: what it comes to on
// its own
function bare(code: string): { elem: any, em: EmSpec } {
    const elem = (gum.evaluate(`<Group>${code}</Group>`).children[0] as any).children[0]
    assert.ok(elem.em != null, `${code}: no em record`)
    return { elem, em: elem.em }
}

// a block's box must agree with its aspect
function consistent({ elem, em }: { elem: any, em: EmSpec }, what: string): void {
    close(em.width / em.height, elem.spec.aspect, `${what}: width/height vs aspect`)
}

function runEmTests(): void {
    const words = 'the quick brown fox jumps over the lazy dog and keeps on running'

    // a paragraph: as wide as its width, a whole number of lines tall (no line
    // spacing), anchored on the first line's axis
    const para = root(`<Text width={10}>${words}</Text>`)
    close(para.em.width, 10, 'paragraph width')
    assert.ok(para.em.height >= 2, 'paragraph should wrap to several lines')
    close(para.em.height, Math.round(para.em.height), 'paragraph height in lines')
    close(para.em.anchor, TEXT_ANCHOR, 'paragraph anchor')
    close(para.em.scale, 1, 'paragraph scale')
    consistent(para, 'paragraph')

    // line spacing stretches the block: n lines are n / (1 - spacing) em tall
    const spaced = root(`<Text width={10} spacing={0.2}>${words}</Text>`)
    close(spaced.em.height, para.em.height / 0.8, 'spaced paragraph height')

    // a single unwrapped line: its own advance wide and one em tall
    const line = root('<Text>hello</Text>')
    close(line.em.height, 1, 'line height')
    close(line.em.width, line.elem.spec.aspect, 'line width')

    // a scaled heading: laid out at its width, reported at scale
    const heading = root(`<Text width={10} scale={2}>${words}</Text>`)
    close(heading.em.width, 20, 'heading width')
    close(heading.em.height, 2 * para.em.height, 'heading height')
    close(heading.em.anchor, 2 * TEXT_ANCHOR, 'heading anchor')
    close(heading.em.scale, 2, 'heading scale')

    // the box is width times scale wide in the parent's em
    close(root(`<Text width={12}>hi</Text>`).em.width, 12, 'width alone')
    close(root(`<Text width={4} scale={3}>${words}</Text>`).em.width, 12, 'width and scale')

    // the bounds of content: from its longest word to its one line
    const bounds = gum.evaluate(`<Text>${words}</Text>`).children[0].bounds()
    assert.ok(bounds.width[0] < bounds.width[1], 'text bounds run from the longest word to the line')
    close(bounds.height[0], 1, 'text is at least one line tall')
    assert.ok(bounds.aspect == null, 'text is not tied')
    const square = gum.evaluate('<Square />').children[0].bounds()
    close(square.aspect!, 1, 'a square is tied at one')

    // a list: as wide as its width, its items plus the gaps between them tall,
    // anchored on the first item's first line
    const list = root('<Bullets width={20} gap={0.5}><Text>one</Text><Text>two</Text><Text>three</Text></Bullets>')
    close(list.em.width, 20, 'list width')
    close(list.em.height, 3 + 2 * 0.5, 'list height')
    close(list.em.anchor, TEXT_ANCHOR, 'list anchor')
    consistent(list, 'list')

    // a column lays each child out for its width: a child with a width of its
    // own keeps it and its size, a scaled child is laid out narrower and
    // reported at scale, and the gaps are in em
    const col = root('<TextCol width={20} gap={0}><Text>a</Text><Text width={10}>b</Text></TextCol>')
    close(col.em.width, 20, 'column width')
    close(col.em.height, 1 + 1, 'column height')
    close(col.em.anchor, TEXT_ANCHOR, 'column anchor')
    consistent(col, 'column')
    close(root('<TextCol width={20} gap={0.5}><Text>a</Text><Text>b</Text><Text>c</Text></TextCol>').em.height, 3 + 2 * 0.5, 'column gaps')
    const scaled = root('<TextCol width={20} gap={0}><Text scale={2}>a</Text><Text>b</Text></TextCol>')
    close(scaled.em.height, 2 + 1, 'column with a scaled child')
    close(scaled.em.anchor, 2 * TEXT_ANCHOR, 'column anchored on its scaled first child')

    // a bare element in a column spans its width, with its aspect; a formula
    // is placed at the text's em, or shrunk to fit if wider
    close(root('<TextCol width={10} gap={0}><Text>a</Text><Square /></TextCol>').em.height, 1 + 10, 'column with a square')
    const formula = root('<Latex>x</Latex>')
    close(formula.em.height, 1, 'formula height (strut)')
    close(formula.em.anchor, 0.5, 'formula anchor (strut, centered on the axis)')
    close(root('<TextCol width={10} gap={0}><Text>a</Text><Latex>x</Latex></TextCol>').em.height, 1 + formula.em.height, 'column with a formula')
    const with_formula = root('<Bullets width={10} gap={0.5}><Text>a</Text><Latex>x</Latex></Bullets>')
    close(with_formula.em.height, with_formula.elem.children[0].em.height + 0.5 + with_formula.elem.children[1].em.height, 'list with a formula is its rows plus the gap')
    assert.ok(root('<TextCol width={2} gap={0}><Text>a</Text><Latex>{"x + y + z"}</Latex></TextCol>').em.height < 1 + formula.em.height, 'a formula wider than the column is shrunk to fit it')

    // a row: children with a size of their own keep it, the rest share the
    // slack and take their slot, and they align by their tops unless told
    // otherwise
    const row = root(`<TextRow width={20} gap={2}><Text width={6}>a</Text><Text>${words}</Text></TextRow>`)
    close(row.em.width, 20, 'row width')
    close(row.elem.children[1].em.width, 12, 'row slack shared')
    assert.ok(row.em.height >= 2, 'row as tall as its tallest child')
    consistent(row, 'row')
    const anchored = root('<TextRow width={20} gap={0} valign="anchor"><Text scale={2}>a</Text><Text>b</Text></TextRow>')
    close(anchored.em.height, 2, 'row aligned by anchors')
    close(anchored.em.anchor, 2 * TEXT_ANCHOR, 'row anchor')
    close(root('<TextRow gap={1}><Text width={4}>a</Text><Text width={5}>b</Text></TextRow>').em.width, 4 + 1 + 5, 'row without a width is as wide as its children')
    close(root('<TextRow width={20} gap={0}><Text>a</Text><Text share={0.75}>b</Text></TextRow>').elem.children[1].em.width, 15, 'a share of a row')
    close(root(`<TextRow width={20} gap={0}><Text>${words}</Text><Text share={0.75}>b</Text></TextRow>`).elem.children[0].em.width, 5, 'a paragraph takes what a share leaves')

    // a grid: equal columns, rows as tall as their tallest cell, gaps in em
    const grid = root('<TextGrid cols={2} width={21} gap={1}><Text>a</Text><Text>b</Text><Text>c</Text></TextGrid>')
    close(grid.em.width, 21, 'grid width')
    close(grid.em.height, 1 + 1 + 1, 'grid height')
    close(grid.elem.children[0].em.width, 10, 'grid cell width')

    // a figure: sized by its height, with a caption below; in a column it
    // keeps its size and sits in the middle
    const fig = root('<TextFigure height={4} caption="cap"><Square /></TextFigure>')
    close(fig.em.width, 4, 'figure width from height')
    close(fig.em.height, 4 + 0.3 + 1, 'figure height with caption')
    close(fig.em.anchor, 2, 'figure anchor')
    const infig = root('<TextCol width={10} gap={0}><TextFigure height={4}><Square /></TextFigure></TextCol>')
    close(infig.em.height, 4, 'figure in a column keeps its height')
    const [ ix0, , ix1 ] = infig.elem.children[0].spec.rect
    close(ix1 - ix0, 4, 'figure in a column keeps its width')
    close(0.5 * (ix0 + ix1), 5, 'and sits in the middle of the column')

    // a box: padding and margin in em all round, a boolean for the default,
    // an aspect that grows the box, and a one-line box hugging its line
    const box = root(`<TextBox width={11} padding={0.5}>${words}</TextBox>`)
    const h = para.em.height
    close(box.em.height, h + 1, 'box height')
    close(box.em.width, 11, 'box width is the outer width')
    close(box.em.anchor, 0.5 + TEXT_ANCHOR, 'box anchor')
    consistent(box, 'box')
    close(root('<TextFrame padding margin>hi</TextFrame>').em.height, 1 + 0.5 + 0.5, 'frame with default padding and margin')
    close(root('<TextBox padding={0} aspect={4}>hi</TextBox>').em.width, 20, 'a box with an aspect is a figure of it, sized by the offer')
    close(bare('<TextBox padding={0} aspect={4}>hi</TextBox>').em.width, 4, 'unoffered, a box grows around its content to its aspect')
    close(root('<TextBox padding={0}><Latex>x</Latex></TextBox>').em.height, formula.em.height, 'box around a formula')
    const hugged = root('<TextCol width={20} gap={0}><TextBox padding={0}>hi</TextBox></TextCol>')
    assert.ok(hugged.elem.children[0].em.width < 20, 'one-line box hugs its line')
    close(root(`<TextCol width={11} gap={0}><TextBox padding={0}>${words}</TextBox></TextCol>`).elem.children[0].em.width, 11, 'a wrapped box keeps the width')

    // a box lays its content out for the area it is offered, inside its em
    // padding, and hugs what comes back: a column in a box is the column, and
    // in a padded frame it is laid out for the area and the frame hugs it
    const column = '<VStack><Rect aspect={2} /><Text>a caption</Text></VStack>'
    const plain = root(column)
    close(plain.em.height, 20 / 2 + 1, 'a captioned rect at the root')
    const boxed = root(`<Box>${column}</Box>`)
    close(boxed.em.width, plain.em.width, 'a box around a column keeps its width')
    close(boxed.em.height, plain.em.height, 'a box around a column keeps its height')
    consistent(boxed, 'boxed column')
    const framed = root(`<Frame padding={0.1}>${column}</Frame>`)
    close(framed.em.width, 20, 'a framed column spans the canvas')
    close(framed.em.height, (20 - 0.2) / 2 + 1 + 0.2, 'a framed column is laid out for the area inside the padding, and the frame hugs it')
    close(root(`<Frame aspect={2}>${column}</Frame>`).em.height, 10, 'a frame with an aspect fits the canvas at it')

    // a slide: `em` sets the text size as a fraction of the slide height, and
    // overflow is the content height over the area's
    const slide = gum.evaluate('<Slide em={0.05} margin={0.05} padding={0.1}><Text>a</Text></Slide>').children[0] as any
    close(slide.overflow, 1 / 14, 'slide overflow with one line in fourteen')
    assert.throws(() => gum.evaluate(`<Slide em={0.2} overflow="error"><Text>${words}</Text><Text>${words}</Text></Slide>`), /overflows/, 'slide overflow error')

    // a stack (one engine for figures, text and math): a column offers its
    // width, a bare shape spans it, and a column with nothing offered (placed
    // by rect in a group) is as wide as its widest child laid at its own size
    close(root('<TextStack width={10} gap={0}><Text>a</Text><Square /></TextStack>').em.height, 1 + 10, 'column: a shape spans the width')
    const natural = bare('<TextStack gap={0}><Text width={4}>a</Text><Square /></TextStack>')
    close(natural.em.width, 4, 'column without a width is as wide as its widest child')
    close(natural.em.height, 1 + 4, 'a shape spans that width too')
    consistent(natural, 'column without a width')

    // a row without a width: a bare shape is one em tall at its aspect
    const line_a = root('<Text>a</Text>').em.width
    close(bare('<TextStack direc="h" gap={0}><Text>a</Text><Rect aspect={2} /></TextStack>').em.width, line_a + 2, 'row with nothing offered: a shape is one em tall')

    // a formula keeps its size in a row and sits on the text's anchor
    const with_math = root('<TextRow width={20} gap={0} valign="anchor"><Text>a</Text><Latex>x</Latex></TextRow>')
    close(with_math.elem.children[1].em.width, formula.em.width, 'formula keeps its width in a row')
    close(with_math.em.anchor, TEXT_ANCHOR, 'row anchored on the text')

    // a stack of figures in a text row spans its slot as a figure
    const figure_in_row = root('<TextRow width={20} gap={0}><VStack><Square /><Square /></VStack><Text width={10}>c</Text></TextRow>')
    const [ fx0, fy0, fx1, fy1 ] = figure_in_row.elem.children[0].spec.rect
    close(fx1 - fx0, 10, 'stack of figures takes the slot')
    close(fy1 - fy0, 20, 'at its aspect')

    // TextCol and TextRow are the two directions of TextStack, which is a Stack
    close(root('<TextStack width={20}><Text>a</Text><Text>b</Text></TextStack>').em.height, root('<TextCol width={20}><Text>a</Text><Text>b</Text></TextCol>').em.height, 'TextCol is a vertical TextStack')
    close(root('<TextStack direc="h" width={20} gap={1}><Text width={4}>a</Text><Text width={5}>b</Text></TextStack>').em.width, 20, 'TextRow is a horizontal TextStack')
    close(root('<VStack width={20} gap={0} justify="left"><Text>a</Text><Text>b</Text></VStack>').em.height, 2, 'a VStack lays text out in em too')

    // a math column is the same layout anchored on its middle, with overhang
    // kept (the examples cover the rendering)
    const mcol = root('<MathCol spacing={0}><Latex>x</Latex><Latex>y</Latex></MathCol>')
    close(mcol.em.anchor, 0.5 * mcol.em.height, 'math column anchored on its middle')

    // a size of a child's own: a height in a column, a width in a row, in em;
    // a stretch spans the column across
    const sized = root('<TextCol width={10} gap={0}><Text>a</Text><Rect height={3} /></TextCol>')
    close(sized.em.height, 1 + 3, 'sized child: three em tall')
    const [ rx0, ry0, rx1, ry1 ] = sized.elem.children[1].spec.rect
    close(rx1 - rx0, 10, 'spanning the column')
    close(ry1 - ry0, 3, 'at its size')
    const sized_row = root(`<TextRow width={20} gap={0}><Text>${words}</Text><Rect width={5} /></TextRow>`)
    const [ qx0, , qx1 ] = sized_row.elem.children[1].spec.rect
    close(qx1 - qx0, 5, 'sized child in a row: five em wide')
    close(sized_row.elem.children[0].em.width, 15, 'a paragraph takes what is left')
    close(root('<TextRow width={20} gap={0}><Text>a</Text><Rect width={5} /></TextRow>').elem.children[0].em.width, line_a, 'a one-word text keeps its line (it cannot use more)')

    // shares and spacing: fractions of the stack's length; a fitted text
    // scales to its share like a title in a figure
    const shares = root('<VStack width={10} spacing={0.1}><Rect aspect={2} /><Rect aspect={2} share={0.4} /></VStack>')
    const [ , sy0, , sy1 ] = shares.elem.children[1].spec.rect
    close(sy1 - sy0, 0.4 * shares.em.height, 'a share of a column')
    close(shares.em.height, 5 / (1 - 0.4 - 0.1), 'the rest scaled up by the shares and spacing')
    const fitted = root('<VStack width={10} gap={0}><Text fit share={0.2}>a title</Text><Rect aspect={1} /></VStack>')
    const title = fitted.elem.children[0]
    close(title.em.height, 0.2 * fitted.em.height, 'a fitted title is as tall as its share')

    // a stack hugs fixed children whatever it is offered; a column with a
    // height of its own is that tall, its content at the top inside
    close(root('<TextRow gap={0}><Latex>x</Latex><Latex>y</Latex></TextRow>').em.width, formula.em.width + root('<Latex>y</Latex>').em.width, 'a row of formulas hugs them')
    const tall = root('<TextCol width={10} height={8} gap={0}><Text>a</Text><Text>b</Text></TextCol>')
    close(tall.em.height, 8, 'a column with a height of its own is that tall')
    close(tall.elem.children[0].em.height, 2, 'and its content is what it is')

    console.error('em checks passed')
}

export { runEmTests }
