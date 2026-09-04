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

    // a stack stretches every child to its width: a child with half the width
    // is twice the size, so its lines count double
    const stack = root('<TextStack width={20}><Text>a</Text><Text width={10}>b</Text></TextStack>')
    close(stack.em.width, 20, 'stack width')
    close(stack.em.height, 1 + 2, 'stack height')
    close(stack.em.anchor, TEXT_ANCHOR, 'stack anchor')
    consistent(stack, 'stack')

    // `scale` on a child is the same thing said the other way round
    const scaled = root('<TextStack width={20}><Text scale={2}>a</Text><Text>b</Text></TextStack>')
    close(scaled.em.height, 2 + 1, 'stack with a scaled child')
    close(scaled.em.anchor, 2 * TEXT_ANCHOR, 'stack anchored on its scaled first child')

    // a bare element in a stack spans its width, with its aspect
    const figure = root('<TextStack width={10}><Text>a</Text><Square /></TextStack>')
    close(figure.em.height, 1 + 10, 'stack with a square')

    // a formula in a stack or a list is placed at the text's em, not stretched
    const formula = root('<Latex>x</Latex>')
    close(formula.em.height, 1, 'formula height (strut)')
    close(formula.em.anchor, 0.5, 'formula anchor (strut, centered on the axis)')
    const mixed = root('<TextStack width={10}><Text>a</Text><Latex>x</Latex></TextStack>')
    close(mixed.em.height, 1 + formula.em.height, 'stack with a formula')
    const listed = root('<Bullets width={10} gap={0.5}><Text>a</Text><Latex>x</Latex></Bullets>')
    close(listed.em.height, 1 + 0.5 + formula.em.height, 'list with a formula')
    const wide = root('<TextStack width={2}><Text>a</Text><Latex>{"x + y + z"}</Latex></TextStack>')
    assert.ok(wide.em.height < 1 + formula.em.height, 'a formula wider than the stack is shrunk to fit it')

    // a padded box: Box makes the padding the same distance all round, a
    // fraction of the geometric mean of the text's width and height
    const box = root(`<TextBox width={10} padding={0.5}>${words}</TextBox>`)
    const h = para.em.height
    const pad = 0.5 * Math.sqrt(10 * h)
    close(box.em.height, h + 2 * pad, 'box height')
    close(box.em.width, 10 + 2 * pad, 'box width')
    close(box.em.anchor, pad + TEXT_ANCHOR, 'box anchor')
    consistent(box, 'box')

    // a boolean padding is the Box default, and a frame is a box
    const frame = root('<TextFrame padding>hi</TextFrame>')
    consistent(frame, 'frame')

    console.error('em checks passed')
}

export { runEmTests }
