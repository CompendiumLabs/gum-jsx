// Example test runner (node only)
//
// Renders every example in each group's directory of *.jsx files in strict
// mode (@gum-jsx/core/lib/strict), which turns the permissive rendering
// fallbacks into thrown errors so silent breakage shows up as a failure. With
// `report`, also writes every render in both themes to
// <outDir>/<group>/<theme>/<name>.svg plus a manifest.json listing every
// example with its source and status, which test/report browses.

import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs'

import { docsCodeDir, galaCodeDir, dataDir as docsDataDir } from '@gum-jsx/docs'
import { resolveEnv, type Env } from '@gum-jsx/core/env'
import type { Svg } from '@gum-jsx/core'

import '../src/eval' // the math plugin on the default Env

// the root directory of an installed package (through its ./package.json export)
function packageDir(name: string): string {
    return dirname(fileURLToPath(import.meta.resolve(`${name}/package.json`)))
}

// a group is a name plus the directory of its examples; a bare name means <name>/code
type Group = string | { name: string, dir: string }

// the standard suite: the docs and gallery examples out of @gum-jsx/docs, plus
// the feature tests in test/code here
const defaultGroups: Group[] = [
    { name: 'docs', dir: docsCodeDir },
    { name: 'gala', dir: galaCodeDir },
    'test',
]

function groupEntry(group: Group): { name: string, dir: string } {
    return typeof group == 'string' ? { name: group, dir: join(group, 'code') } : group
}

type Theme = 'light' | 'dark'
const themes: Theme[] = ['light', 'dark']

type Render = {
    svg?: string
    error?: string
}

type Result = {
    group: string
    file: string
    path: string
    code: string
    renders: Record<Theme, Render>
}

type Entry = {
    id: string
    name: string
    group: string
    path: string
    code: string
    status: 'pass' | 'fail'
    renders: Record<Theme, { svg: string | null, error: string | null }>
}

type Manifest = {
    generated: string
    themes: Theme[]
    groups: string[]
    passed: number
    failed: number
    examples: Entry[]
}

interface TestArgs {
    groups?: Group[]    // example groups (a name, or a name and directory)
    env?: Env           // the Env to evaluate against (default: the default Env, with the math plugin)
    dataDir?: string    // where examples' loadFile reads from (default: @gum-jsx/docs' docs/data)
    outDir?: string     // where --report writes renders and the manifest
    report?: boolean    // write the report data
    size?: number       // render size
}

interface TestResult {
    passed: number
    failed: number
    results: Result[]
}

// examples that deliberately exercise a permissive fallback opt out with a
// `@nostrict` comment
function allowsStrict(code: string): boolean {
    return !/@nostrict\b/.test(code)
}

// every element reachable from a root (children, plus elements stored under
// other names), with its parent
function walkTree(elem: any, out: any[] = [], parent: any = null, seen = new Set()): any[] {
    if (seen.has(elem)) return out
    seen.add(elem)
    elem.__parent = parent
    out.push(elem)
    for (const [ key, v ] of Object.entries(elem)) {
        if (key == '__parent' || key == 'args') continue
        const items = Array.isArray(v) ? v : [ v ]
        for (const c of items) if (c != null && typeof c == 'object' && 'env' in c && 'spec' in c) walkTree(c, out, elem, seen)
    }
    return out
}

// every element of a tree must carry the Env it was evaluated against: one
// built against another (the default) Env means a construction site somewhere
// dropped `env`, which would render with the wrong theme, strict mode or fonts
function checkEnv(root: Svg): void {
    const strays = walkTree(root).filter(e => e.env !== root.env)
    if (strays.length > 0) {
        const where = strays.slice(0, 3).map(e => `${e.constructor.name} in ${e.__parent?.constructor.name}`).join(', ')
        throw new Error(`Env stray: ${strays.length} element(s) built against another Env (${where})`)
    }
}

function runUnitTests(args: TestArgs = {}): TestResult {
    const { groups = defaultGroups, env: env0, dataDir = docsDataDir, outDir = 'test/data', report = false, size = 1000 } = args
    const env = resolveEnv(env0)

    function loadFile(path: string, encoding: string = 'utf8') {
        const file = join(dataDir, basename(path))
        return encoding == 'bytes'
            ? readFileSync(file)
            : readFileSync(file, encoding as BufferEncoding)
    }

    // the strict render decides pass/fail: it turns the fallbacks that would
    // otherwise draw something wrong (unparseable tex, unhandled katex nodes,
    // unknown commands, missing glyphs) into thrown errors. On a strict failure we
    // still do the permissive render, so the report shows what the document draws
    // alongside the reason it failed
    function render(code: string, theme: Theme): Render {
        const strict = allowsStrict(code)
        try {
            const elem = env.evaluate(code, { size, theme, strict, loadFile })
            if (strict) checkEnv(elem)
            return { svg: elem.svg() }
        } catch (e: any) {
            const { message = 'Unknown error' } = e
            if (!strict) return { error: message }
            try {
                const elem = env.evaluate(code, { size, theme, loadFile })
                return { svg: elem.svg(), error: message }
            } catch {
                return { error: message }
            }
        }
    }

    const results: Result[] = []
    for (const { name: group, dir } of groups.map(groupEntry)) {
        const files = readdirSync(dir).filter(f => f.endsWith('.jsx')).sort()
        for (const file of files) {
            const path = join(dir, file)
            const code = readFileSync(path, 'utf-8')
            const renders = { light: render(code, 'light'), dark: render(code, 'dark') }
            const errors = themes.filter(t => renders[t].error != null)
            if (errors.length == 0) {
                console.log(`PASS ${path}`)
            } else {
                const detail = errors.map(t => `${t}: ${renders[t].error}`).join('; ')
                console.error(`FAIL ${path}: ${detail}`)
            }
            results.push({ group, file, path, code, renders })
        }
    }

    const isPass = (r: Result) => themes.every(t => r.renders[t].error == null)
    const passed = results.filter(isPass).length
    const failed = results.length - passed

    // one svg file per example per theme (docs/light/Box.svg, ...) and a manifest
    // listing what got written, with the source and any strict error alongside
    function writeData() {
        rmSync(outDir, { recursive: true, force: true })
        for (const { name: group } of groups.map(groupEntry)) {
            for (const theme of themes) mkdirSync(join(outDir, group, theme), { recursive: true })
        }

        const examples = results.map(result => {
            const { group, file, path, code, renders } = result
            const name = file.replace(/\.jsx$/, '')
            const entry: Entry = {
                id: `${group}/${name}`, name, group, path, code,
                status: isPass(result) ? 'pass' : 'fail',
                renders: { light: { svg: null, error: null }, dark: { svg: null, error: null } },
            }
            for (const theme of themes) {
                const { svg, error } = renders[theme]
                if (svg != null) {
                    const rel = join(group, theme, `${name}.svg`)
                    writeFileSync(join(outDir, rel), svg)
                    entry.renders[theme].svg = rel
                }
                entry.renders[theme].error = error ?? null
            }
            return entry
        })

        const manifest: Manifest = {
            generated: new Date().toISOString(), themes, groups: groups.map(g => groupEntry(g).name), passed, failed, examples,
        }
        writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
        console.error(`wrote ${examples.length} examples to ${outDir}`)
    }

    if (report) writeData()

    console.log()
    console.error(`${passed} passed`)
    console.error(`${failed} failed`)

    return { passed, failed, results }
}

export { runUnitTests, packageDir }
export type { Group, TestArgs, TestResult, Theme, Render, Result, Entry, Manifest }
