// The em metrics of the text elements (core's lib/em.ts): the boxes a
// paragraph, a list, a scaled heading, a stack, a padded box and a formula
// report, checked as numbers rather than through a render. The math side is
// covered by the example suite; these pin the text side, which nothing draws
// from yet.

import { strict as assert } from 'node:assert'

import { gum } from '@gum-jsx/core'
import { vtext, maxis } from '@gum-jsx/core/lib/const'
import type { EmSpec } from '@gum-jsx/core/lib/em'

import '../src/eval' // the math plugin on the default Env

const TEXT_ANCHOR = 1 + vtext - maxis

function close(actual: number, expected: number, what: string): void {
    assert.ok(Math.abs(actual - expected) < 1e-9, `${what}: expected ${expected}, got ${actual}`)
}

// the root element of some code and its metrics
function root(code: string): { elem: any, em: EmSpec } {
    const elem = gum.evaluate(code).children[0] as any
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
    close(root('<Bullets width={10} gap={0.5}><Text>a</Text><Latex>x</Latex></Bullets>').em.height, 1 + 0.5 + formula.em.height, 'list with a formula')
    assert.ok(root('<TextCol width={2} gap={0}><Text>a</Text><Latex>{"x + y + z"}</Latex></TextCol>').em.height < 1 + formula.em.height, 'a formula wider than the column is shrunk to fit it')

    // a row: children with a size of their own keep it, the rest share the
    // slack, and they align by their tops unless told otherwise
    const row = root(`<TextRow width={20} gap={2}><Text width={6}>a</Text><Text>${words}</Text></TextRow>`)
    close(row.em.width, 20, 'row width')
    close(row.elem.children[1].em.width, 12, 'row slack shared')
    assert.ok(row.em.height >= 2, 'row as tall as its tallest child')
    consistent(row, 'row')
    const anchored = root('<TextRow width={20} gap={0} valign="anchor"><Text scale={2}>a</Text><Text>b</Text></TextRow>')
    close(anchored.em.height, 2, 'row aligned by anchors')
    close(anchored.em.anchor, 2 * TEXT_ANCHOR, 'row anchor')
    close(root('<TextRow gap={1}><Text width={4}>a</Text><Text width={5}>b</Text></TextRow>').em.width, 4 + 1 + 5, 'row without a width is as wide as its children')
    close(root('<TextRow width={20} gap={0} sizes={[1, 3]}><Text>a</Text><Text>b</Text></TextRow>').elem.children[1].em.width, 15, 'row split by sizes')

    // a grid: equal columns, rows as tall as their tallest cell, gaps in em
    const grid = root('<TextGrid cols={2} width={21} gap={1}><Text>a</Text><Text>b</Text><Text>c</Text></TextGrid>')
    close(grid.em.width, 21, 'grid width')
    close(grid.em.height, 1 + 1 + 1, 'grid height')
    close(grid.elem.children[0].em.width, 10, 'grid cell width')

    // a figure: sized by its height, with a caption below; in a column it
    // takes the width with the element fit inside
    const fig = root('<TextFigure height={4} caption="cap"><Square /></TextFigure>')
    close(fig.em.width, 4, 'figure width from height')
    close(fig.em.height, 4 + 0.3 + 1, 'figure height with caption')
    close(fig.em.anchor, 2, 'figure anchor')
    const infig = root('<TextCol width={10} gap={0}><TextFigure height={4}><Square /></TextFigure></TextCol>')
    close(infig.em.height, 4, 'figure in a column keeps its height')
    close(infig.elem.children[0].em.width, 10, 'figure in a column takes the width')

    // a box: padding and margin in em all round, a boolean for the default,
    // an aspect that grows the box, and a one-line box tightening to its line
    const box = root(`<TextBox width={11} padding={0.5}>${words}</TextBox>`)
    const h = para.em.height
    close(box.em.height, h + 1, 'box height')
    close(box.em.width, 11, 'box width is the outer width')
    close(box.em.anchor, 0.5 + TEXT_ANCHOR, 'box anchor')
    consistent(box, 'box')
    close(root('<TextFrame padding margin>hi</TextFrame>').em.height, 1 + 0.8 + 0.8, 'frame with default padding and margin')
    close(root('<TextBox padding={0} aspect={4}>hi</TextBox>').em.width, 4, 'box grown to an aspect')
    close(root('<TextBox padding={0}><Latex>x</Latex></TextBox>').em.height, formula.em.height, 'box around a formula')
    const hugged = root('<TextCol width={20} gap={0}><TextBox padding={0}>hi</TextBox></TextCol>')
    assert.ok(hugged.elem.children[0].em.width < 20, 'one-line box tightens to its line')
    close(root(`<TextCol width={11} gap={0}><TextBox padding={0}>${words}</TextBox></TextCol>`).elem.children[0].em.width, 11, 'a wrapped box keeps the width')

    // a slide: `em` sets the text size as a fraction of the slide height, and
    // overflow is the content height over the area's
    const slide = gum.evaluate('<Slide em={0.05} margin={0.05} padding={0.1}><Text>a</Text></Slide>').children[0] as any
    close(slide.overflow, 1 / 14, 'slide overflow with one line in fourteen')
    assert.throws(() => gum.evaluate(`<Slide em={0.2} overflow="error"><Text>${words}</Text><Text>${words}</Text></Slide>`), /overflows/, 'slide overflow error')

    // a text stack (layout_em_stack, shared with the math stacks): a column
    // offers its width, a bare shape spans it, and a column without a width
    // is as wide as its widest child laid at its own size
    close(root('<TextStack width={10} gap={0}><Text>a</Text><Square /></TextStack>').em.height, 1 + 10, 'column: a shape spans the width')
    const natural = root('<TextStack gap={0}><Text width={4}>a</Text><Square /></TextStack>')
    close(natural.em.width, 4, 'column without a width is as wide as its widest child')
    close(natural.em.height, 1 + 4, 'a shape spans that width too')
    consistent(natural, 'column without a width')

    // a row without a width: a bare shape is one em tall at its aspect
    const line_a = root('<Text>a</Text>').em.width
    close(root('<TextStack direc="h" gap={0}><Text>a</Text><Rect aspect={2} /></TextStack>').em.width, line_a + 2, 'row without a width: a shape is one em tall')

    // a formula keeps its size in a row and sits on the text's anchor
    const with_math = root('<TextRow width={20} gap={0} valign="anchor"><Text>a</Text><Latex>x</Latex></TextRow>')
    close(with_math.elem.children[1].em.width, formula.em.width, 'formula keeps its width in a row')
    close(with_math.em.anchor, TEXT_ANCHOR, 'row anchored on the text')

    // a share stack in a text row spans its slot as a figure
    const figure_in_row = root('<TextRow width={20} gap={0}><VStack><Square /><Square /></VStack><Text width={10}>c</Text></TextRow>')
    const [ fx0, fy0, fx1, fy1 ] = figure_in_row.elem.children[0].spec.rect
    close(fx1 - fx0, 10, 'share stack takes the slot')
    close(fy1 - fy0, 20, 'at its aspect')

    // TextCol and TextRow are the two directions of TextStack
    close(root('<TextStack width={20}><Text>a</Text><Text>b</Text></TextStack>').em.height, root('<TextCol width={20}><Text>a</Text><Text>b</Text></TextCol>').em.height, 'TextCol is a vertical TextStack')
    close(root('<TextStack direc="h" width={20} gap={1}><Text width={4}>a</Text><Text width={5}>b</Text></TextStack>').em.width, 20, 'TextRow is a horizontal TextStack')

    // a math column is the same layout anchored on its middle, with overhang
    // kept (the examples cover the rendering)
    const mcol = root('<MathCol spacing={0}><Latex>x</Latex><Latex>y</Latex></MathCol>')
    close(mcol.em.anchor, 0.5 * mcol.em.height, 'math column anchored on its middle')

    // stack-size: the child's length along the stack in em, spanning it across
    const sized = root('<TextCol width={10} gap={0}><Text>a</Text><Rect stack-size={3} /></TextCol>')
    close(sized.em.height, 1 + 3, 'sized child: three em tall')
    const [ rx0, ry0, rx1, ry1 ] = sized.elem.children[1].spec.rect
    close(rx1 - rx0, 10, 'spanning the column')
    close(ry1 - ry0, 3, 'at its size')
    const sized_row = root('<TextRow width={20} gap={0}><Text>a</Text><Rect stack-size={5} /></TextRow>')
    const [ qx0, , qx1 ] = sized_row.elem.children[1].spec.rect
    close(qx1 - qx0, 5, 'sized child in a row: five em wide')
    close(sized_row.elem.children[0].em.width, 15, 'the rest shares what is left')

    console.error('em checks passed')
}

export { runEmTests }
