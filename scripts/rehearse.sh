#!/usr/bin/env bash
# Publish to a throwaway Verdaccio registry, then exercise fresh installations.
# Run from anywhere: scripts/rehearse.sh
# KEEP=1 preserves logs/artifacts; PORT=4874 selects a different local port.
# Requires Bun, Node (for Verdaccio/npm), npm, curl, tar, and setsid.
# Registry configuration, credentials, caches, and global installs stay in /tmp.
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
PORT=${PORT:-4873}
[[ "$PORT" =~ ^[0-9]+$ ]] && (( PORT > 0 && PORT < 65536 )) || { echo 'Invalid PORT' >&2; exit 1; }
REG="http://127.0.0.1:$PORT/"
ORDER=(core math png pdf mark react docs cli)
for tool in bun node npm curl tar setsid; do
    command -v "$tool" >/dev/null || { echo "Required command: $tool" >&2; exit 1; }
done

WORK=$(mktemp -d "${TMPDIR:-/tmp}/gum-rehearse.XXXXXX")
VPID=
say() { printf '\n== %s\n' "$*"; }
fail() { printf 'FAIL: %s\n' "$*" >&2; exit 1; }
cleanup() {
    if [ -n "$VPID" ]; then kill -- -"$VPID" 2>/dev/null || kill "$VPID" 2>/dev/null || true; fi
    if [ "${KEEP:-0}" = 1 ]; then echo "Scratch directory: $WORK"; else rm -rf "$WORK"; fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
runlog() {
    local logfile=$1
    shift
    if ! "$@" > "$WORK/$logfile" 2>&1; then
        cat "$WORK/$logfile" >&2
        fail "$* (log: $WORK/$logfile; use KEEP=1 to retain it)"
    fi
}

# Fresh caches prevent same-version packages from a previous rehearsal or npm
# satisfying an install. Do not change the caller's npmrc or global Bun paths.
export BUN_INSTALL_CACHE_DIR="$WORK/bun-cache" npm_config_cache="$WORK/npm-cache"
export npm_config_userconfig="$WORK/.npmrc" npm_config_globalconfig="$WORK/global.npmrc"
export BUN_INSTALL_GLOBAL_DIR="$WORK/global" BUN_INSTALL_BIN="$WORK/global/bin"
touch "$npm_config_userconfig" "$npm_config_globalconfig"

say 'prepare publication workspace'
PUBLISH="$WORK/publish"
mkdir -p "$PUBLISH"
cp "$ROOT/package.json" "$PUBLISH/package.json"
# Bun reads the workspace lockfile when replacing workspace:* during publish.
cp "$ROOT/bun.lock" "$PUBLISH/bun.lock"
for pkg in "${ORDER[@]}"; do
    mkdir -p "$PUBLISH/gum-jsx-$pkg"
    tar -C "$ROOT/gum-jsx-$pkg" --exclude=.git --exclude=node_modules \
        --exclude=dist --exclude=out --exclude=skills --exclude=.npmrc \
        --exclude=.env --exclude='.env.*' -cf - . | tar -C "$PUBLISH/gum-jsx-$pkg" -xf -
done
# Publishing from copies lets us force the local registry even when a package
# gains a publishConfig.registry, without modifying any source manifests.
VERSION=$(bun -e '
const [directory, registry, ...packages] = process.argv.slice(1);
let version;
for (const pkg of packages) {
  const file = Bun.file(`${directory}/gum-jsx-${pkg}/package.json`);
  const manifest = await file.json();
  version ??= manifest.version;
  if (manifest.private || !version || manifest.version !== version || manifest.name !== `@gum-jsx/${pkg}`)
    throw Error(`Invalid public release manifest: ${pkg}`);
  manifest.publishConfig = { ...manifest.publishConfig, registry, access: "public", tag: "rehearsal" };
  await Bun.write(file, JSON.stringify(manifest, null, 2));
}
const root = Bun.file(`${directory}/package.json`);
const manifest = await root.json();
manifest.workspaces = packages.map(pkg => `gum-jsx-${pkg}`);
await Bun.write(root, JSON.stringify(manifest, null, 2));
console.log(version);
' "$PUBLISH" "$REG" "${ORDER[@]}")

say "start local registry at $REG"
# Refuse an occupied port instead of accidentally reusing an unrelated registry.
bun -e 'const s = Bun.serve({ hostname: "127.0.0.1", port: Number(process.argv[1]), fetch: () => new Response() }); s.stop(true)' "$PORT"
cat > "$WORK/config.yaml" <<YAML
storage: $WORK/storage
auth:
  htpasswd:
    file: $WORK/htpasswd
    max_users: 1
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@gum-jsx/*':
    access: \$all
    publish: \$authenticated
  '**':
    access: \$all
    proxy: npmjs
log: { type: file, path: $WORK/verdaccio.log, level: warn }
YAML
# Gum packages have no upstream fallback; missing local publications must fail.
setsid bunx verdaccio@6 --config "$WORK/config.yaml" --listen "127.0.0.1:$PORT" > "$WORK/verdaccio.out" 2>&1 &
VPID=$!
for ((attempt=0; attempt<90; attempt++)); do
    kill -0 "$VPID" 2>/dev/null || { cat "$WORK/verdaccio.out" >&2; fail 'registry exited'; }
    if curl -sf --max-time 1 "$REG-/ping" >/dev/null; then break; fi
    sleep 1
done
curl -sf --max-time 2 "$REG-/ping" >/dev/null || fail 'registry did not start'

TOKEN=$(curl -sf --max-time 10 -X PUT "$REG-/user/org.couchdb.user:rehearse" \
    -H 'content-type: application/json' -d '{"name":"rehearse","password":"rehearse"}' \
    | bun -e 'const data = JSON.parse(await Bun.stdin.text()); if (!data.token) throw Error("No registry token"); process.stdout.write(data.token)')
printf 'registry=%s\n//127.0.0.1:%s/:_authToken=%s\n' "$REG" "$PORT" "$TOKEN" > "$WORK/.npmrc"
cp "$WORK/.npmrc" "$PUBLISH/.npmrc"

for pkg in "${ORDER[@]}"; do
    say "publish @gum-jsx/$pkg@$VERSION locally"
    (cd "$PUBLISH/gum-jsx-$pkg" && runlog "publish-$pkg.log" bun publish --access public --tag rehearsal --registry "$REG")
    runlog "metadata-$pkg.log" npm view "@gum-jsx/$pkg@$VERSION" version --registry "$REG"
done

say 'install CLI into a fresh Bun project'
APP="$WORK/app"
mkdir -p "$APP"
cd "$APP"
printf '{"name":"gum-rehearsal","private":true,"type":"module","trustedDependencies":["canvas"]}\n' > package.json
cp "$WORK/.npmrc" .npmrc
runlog bun-install.log bun install "@gum-jsx/cli@$VERSION" --registry "$REG"
for pkg in core math png pdf mark cli; do
    [ -f "node_modules/@gum-jsx/$pkg/package.json" ] || fail "CLI did not bring in $pkg"
done
for bin in gum gum-tex gum-mark; do
    [ -x "node_modules/.bin/$bin" ] || fail "missing executable $bin"
done

say 'exercise installed CLI commands'
cat > figure.jsx <<'JSX'
<Frame padding={em(1)}>
  <HStack gap={em(1)}>
    <Circle width={px(32)} fill={blue} />
    <Text>Hello, Gum</Text>
    <Latex>{String.raw`\frac{x}{y}`}</Latex>
  </HStack>
</Frame>
JSX
for format in svg png pdf; do
    runlog "gum-$format.log" bun run --silent gum figure.jsx -o "figure.$format"
done
runlog gum-tex.log bun run --silent gum-tex '\sqrt{2}' -o formula.svg
printf 'Hello $x^2$\n' > notes.md
runlog gum-mark.log bun run --silent gum-mark notes.md

say 'install React and docs separately'
# Read the supported peer ranges instead of pulling an unrelated latest React.
REACT=$(bun -e 'console.log((await Bun.file(process.argv[1]).json()).peerDependencies.react)' "$PUBLISH/gum-jsx-react/package.json")
REACT_DOM=$(bun -e 'console.log((await Bun.file(process.argv[1]).json()).peerDependencies["react-dom"])' "$PUBLISH/gum-jsx-react/package.json")
EXTRA=("@gum-jsx/react@$VERSION" "@gum-jsx/docs@$VERSION" "react@$REACT" "react-dom@$REACT_DOM")
runlog bun-extra.log bun add "${EXTRA[@]}" --registry "$REG"
cp "$ROOT/gum-jsx-pdf/test/png-fixtures.ts" png-fixtures.ts
cat > use.ts <<'TS'
import assert from 'node:assert/strict'
import { realpathSync } from 'node:fs'
import { Fonts, Text, PngImage, render_element } from '@gum-jsx/core'
import { mathToSvg } from '@gum-jsx/math'
import { rasterize_svg, rasterize_pixels } from '@gum-jsx/png'
import { select_svg } from '@gum-jsx/png/selection'
import { render_pdf } from '@gum-jsx/pdf'
import { displayMarkdown } from '@gum-jsx/mark'
import { getElements, getGuides, buildSkillFiles } from '@gum-jsx/docs'
import { elementsCodeDir } from '@gum-jsx/docs/dirs'
import { createGumRoot } from '@gum-jsx/react'
import { rgbaPixel, keyedRgb, unsupportedKeyedPngs } from './png-fixtures'

const version = process.argv[2];
for (const pkg of ['core', 'math', 'png', 'pdf', 'mark', 'react', 'docs', 'cli']) {
  const path = realpathSync(`node_modules/@gum-jsx/${pkg}`);
  assert.ok(path.startsWith(import.meta.dir + '/'), `${pkg} escaped the fresh consumer`);
  const manifest = await Bun.file(`${path}/package.json`).json();
  assert.equal(manifest.version, version);
  for (const range of Object.values(manifest.dependencies ?? {}))
    assert.ok(!String(range).startsWith('workspace:'));
  assert.ok(await Bun.file(`${path}/LICENSE`).exists());
}
assert.ok((await Bun.file('figure.svg').text()).includes('<svg'));
assert.equal(Buffer.from(await Bun.file('figure.png').arrayBuffer()).toString('hex', 0, 8), '89504e470d0a1a0a');
assert.ok((await Bun.file('figure.pdf').text()).startsWith('%PDF-'));
assert.ok((await Bun.file('formula.svg').text()).includes('<path'));
assert.ok((await Bun.file('../gum-mark.log').text()).includes('\x1b_G'));
const fonts = new Fonts();
await fonts.load();
const result = render_element(new Text({ children: 'Packaged fonts' }), { fonts });
assert.equal(result.kind, 'svg');
if (result.kind !== 'svg') throw Error('Expected SVG');
assert.ok(result.svg.includes('<path'));
assert.ok(mathToSvg(String.raw`\frac{a}{b}`).includes('<path'));
assert.ok(rasterize_svg(result.svg).length > 0);
assert.ok(rasterize_pixels(result.svg).data.length > 0);
assert.ok(select_svg(result.svg, { x: 0, y: 0, width: 5, height: 5 }, result.size).includes('<svg'));
assert.ok(displayMarkdown('# Hello').includes('Hello'));
assert.ok(getElements().tags.includes('Plot'));
assert.ok(getGuides().tags.includes('Gum'));
assert.ok(buildSkillFiles().size > 0);
assert.ok((await Bun.file(`${elementsCodeDir}/Frame.jsx`).text()).includes('<Frame'));
const root = createGumRoot();
await root.loadFonts();
root.unmount();
function imagePdf(encoded: string) {
  const result = render_element(new PngImage({ data: `data:image/png;base64,${encoded}` }));
  if (result.kind !== 'svg') throw Error('Expected image fragment');
  return render_pdf(result.fragment);
}
for (const image of [rgbaPixel, keyedRgb])
  assert.ok(new TextDecoder().decode(imagePdf(image)).includes('/SMask'));
for (const image of unsupportedKeyedPngs)
  assert.throws(() => imagePdf(image.encoded), /tRNS chunk contains more alpha values/);
console.log('Installed APIs, assets, and PDF image checks passed');
TS
runlog libraries.log bun use.ts "$VERSION"

cat > comp.tsx <<'TSX'
import { GUM } from '@gum-jsx/react'
import { em, px } from '@gum-jsx/core'
export default function Scene() {
  return (
    <GUM.Frame padding={em(1)}>
      <GUM.HStack gap={em(1)}>
        <GUM.Circle width={px(32)} fill="blue" />
        <GUM.Latex>x^2</GUM.Latex>
      </GUM.HStack>
    </GUM.Frame>
  )
}
TSX
runlog gum-react.log bun run --silent gum-react comp.tsx --size 300
grep -q '<svg' "$WORK/gum-react.log" || fail 'gum-react output'

say 'bundle browser entry points from installed packages'
cat > browser.ts <<'TS'
export { Fonts, render_element } from '@gum-jsx/core'
export { mathToSvgAsync } from '@gum-jsx/math'
export { render_pdf } from '@gum-jsx/pdf'
export { Gum } from '@gum-jsx/react'
export { select_svg } from '@gum-jsx/png/selection'
TS
runlog browser.log bun build browser.ts --target browser --outdir browser

say 'npm installation and executable linking (without lifecycle scripts)'
mkdir -p "$WORK/app-npm"
cd "$WORK/app-npm"
printf '{"name":"gum-rehearsal-npm","private":true}\n' > package.json
cp "$WORK/.npmrc" .npmrc
runlog npm-install.log npm install "@gum-jsx/cli@$VERSION" "${EXTRA[@]}" --ignore-scripts --registry "$REG" --no-audit --no-fund
for bin in gum gum-tex gum-mark gum-react; do
    [ -x "node_modules/.bin/$bin" ] || fail "npm did not link $bin"
done
[ -f node_modules/@gum-jsx/pdf/src/index.ts ] || fail 'npm did not install PDF source'

say 'isolated global Bun installation'
cd "$WORK"
runlog global-install.log bun install -g "@gum-jsx/cli@$VERSION" "@gum-jsx/react@$VERSION" "react@$REACT" "react-dom@$REACT_DOM" --registry "$REG"
runlog global-svg.log "$WORK/global/bin/gum" "$APP/figure.jsx" -o "$WORK/global.svg"
runlog global-pdf.log "$WORK/global/bin/gum" "$APP/figure.jsx" -o "$WORK/global.pdf"
runlog global-react.log "$WORK/global/bin/gum-react" "$APP/comp.tsx" --size 100
grep -q '<svg' "$WORK/global.svg" || fail 'global gum SVG'
grep -q '<svg' "$WORK/global-react.log" || fail 'global gum-react SVG'
[[ $(head -c 5 "$WORK/global.pdf") = '%PDF-' ]] || fail 'global gum PDF'

say 'all rehearsal checks passed'
