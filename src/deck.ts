// a deck is a directory of slides. Its optional index.json gives the slide
// order, a title and a prelude: a file of declarations every slide is
// evaluated with (helpers, colors, data), so they are written once rather
// than at the top of every slide. Without an index the slides are the
// directory's .jsx files in numeric filename order (slide_2 before slide_10)
// and there is no prelude.
//
//   { "title": "Stacking scenarios",
//     "prelude": "prelude.jsx",
//     "slides": ["slide_1.jsx", "slide_2.jsx"] }
//
// Every key is optional; without `slides` the order is the numeric one, minus
// the prelude. A slide rendered on its own (the CLI, --dev) gets its deck's
// prelude too: the deck of a file is the index beside it.

import { existsSync, readdirSync, readFileSync } from 'fs'
import { dirname, join, resolve } from 'path'

const INDEX_FILE = 'index.json'

interface DeckIndex {
    title?: string
    prelude?: string
    slides?: string[]
}

interface Slide {
    file: string    // the filename
    path: string    // the full path
    code: string
}

interface Deck {
    dir: string
    title?: string
    prelude?: string        // the prelude's code
    preludeFile?: string    // its path
    slides: Slide[]
}

// slide_2 before slide_10
function naturalCompare(a: string, b: string): number {
    return a.localeCompare(b, undefined, { numeric: true })
}

// the index beside a deck's slides, checked, or null when there is none
function readIndex(dir: string): DeckIndex | null {
    const path = join(dir, INDEX_FILE)
    if (!existsSync(path)) return null
    const index = JSON.parse(readFileSync(path, 'utf8'))
    if (index == null || typeof index != 'object' || Array.isArray(index)) throw new Error(`${path}: expected an object`)
    const { title, prelude, slides } = index
    if (title != null && typeof title != 'string') throw new Error(`${path}: "title" must be a string`)
    if (prelude != null && typeof prelude != 'string') throw new Error(`${path}: "prelude" must be a filename`)
    if (slides != null && !(Array.isArray(slides) && slides.every(s => typeof s == 'string'))) throw new Error(`${path}: "slides" must be a list of filenames`)
    return { title, prelude, slides }
}

// whether a directory is a deck with an index (a directory of .jsx files is a
// deck too, just one with nothing to say)
function hasIndex(dir: string): boolean {
    return existsSync(join(dir, INDEX_FILE))
}

// the deck in a directory: its slides in order, with their code, and the
// prelude read
function loadDeck(dir0: string): Deck {
    const dir = resolve(dir0)
    const index = readIndex(dir) ?? {}
    const preludeFile = index.prelude != null ? resolve(dir, index.prelude) : undefined
    if (preludeFile != null && !existsSync(preludeFile)) throw new Error(`${dir}: prelude ${index.prelude} not found`)
    const prelude = preludeFile != null ? readFileSync(preludeFile, 'utf8') : undefined
    const files = index.slides ?? readdirSync(dir, { withFileTypes: true })
        .filter(e => e.isFile() && e.name.endsWith('.jsx') && resolve(dir, e.name) != preludeFile)
        .map(e => e.name)
        .sort(naturalCompare)
    const slides = files.map(file => {
        const path = resolve(dir, file)
        if (!existsSync(path)) throw new Error(`${dir}: slide ${file} not found`)
        return { file, path, code: readFileSync(path, 'utf8') }
    })
    return { dir, title: index.title, prelude, preludeFile, slides }
}

// the prelude a file renders with: its deck's, when the index beside it
// names one and the file is not the prelude itself
function preludeOf(file0: string): { code: string, path: string } | undefined {
    const file = resolve(file0)
    const dir = dirname(file)
    if (!hasIndex(dir)) return
    const { prelude, preludeFile } = loadDeck(dir)
    if (prelude == null || preludeFile == file) return
    return { code: prelude, path: preludeFile! }
}

export { loadDeck, preludeOf, hasIndex, INDEX_FILE }
export type { Deck, DeckIndex, Slide }
