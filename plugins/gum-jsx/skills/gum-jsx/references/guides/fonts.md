# Fonts

Core measures text and converts glyph outlines into paths during layout. SVG
serialization needs no font access, and PNG rasterization needs no font
registration: the SVG already contains the geometry. The layout host still
needs font data to produce those paths.

## Bundled faces

IBM Plex Sans and IBM Plex Mono are bundled at weights 300, 400, and 700. The
default is IBM Plex Sans, 400, normal, 16px. Family names must match registered
names. The provider chooses the nearest available weight, preferring the lower
weight on a tie. If no italic face is available, an italic request uses an
oblique transform of the normal outline.

There is no system-font discovery or automatic fallback-family chain. An
unknown family or missing glyph is an error, rather than a silently substituted
font. In particular, do not assume arbitrary emoji or scripts are covered by
the bundled faces. Emoji are the exception, as described below, and a host can
opt in to further fallback faces.

## Host setup

A default LayoutPass supplies Fonts. In Bun, bundled
files load lazily on first use. Browser hosts should preload the needed family
before layout and arrange for the bundled font assets to be served:

```ts
import { Fonts, LayoutPass, sans, regular } from '@gum-jsx/core'

const fonts = new Fonts()
await fonts.load(sans) // Omit the family to load all bundled faces.
const pass = new LayoutPass({ fonts: { value: fonts, version: fonts.version } })
```

For your own font, register the bytes of an individual face, not a font
collection. This Bun example uses an application-provided file:

```ts
const bytes = await Bun.file('./assets/MyFont-Regular.ttf').arrayBuffer()
fonts.register('My Font', bytes, { weight: regular, style: 'normal' })
pass.set_resource('fonts', fonts, fonts.version)
```

register accepts ArrayBuffer or Uint8Array and owns a copy. Registration bumps
fonts.version; notifying a reused pass invalidates cached geometry. A fresh
pass can simply receive the latest value/version. A custom FontProvider may be
injected through the same resource slot if the host supplies its own shaping
and outline implementation.

## Fallback faces and emoji

Emoji work in ordinary text with no setup. Color fonts are not outlined, because
a bitmap or layered glyph is not one filled path. Core instead bundles a small
metrics face for Noto Color Emoji, which only measures, and the SVG carries each
emoji as live text such as `<text font-family="'Noto Color Emoji'">`. The page
that displays the SVG should provide that family, for example through an
`@font-face` rule; otherwise the viewer's own emoji font paints each emoji,
centered in its measured advance. PNG output depends on the rasterizer's own font
support, and PDF output reports live text as an error.

Register a face with `fallback: true` to receive other text that the requested
family cannot shape. Fallback families apply in registration order, after the
bundled emoji face, and whole grapheme clusters move together:

```ts
const bytes = await Bun.file('./assets/NotoSansJP-Regular.ttf').arrayBuffer()
fonts.register('Noto Sans JP', bytes, { fallback: true })
```

Fonts is a host API, not a default [JSX evaluator](jsx.md) binding. The runnable
example uses only the bundled families and needs no setup beyond the CLI.

## Example

```jsx
// The two bundled families provide light, regular, and bold faces without host setup.
const Family = ({ name, color }) => (
  <VStack gap={em(0.625)} font-family={name} color={color}>
    <Text font-size={em(0.9)}>{name}</Text>
    {[light, regular, bold].map((weight) => (
      <Text font-size={em(1.375)} font-weight={weight}>{weight} — Aa Bb 0123</Text>
    ))}
    <Text font-size={em(1.375)} font-style="italic">Italic request</Text>
  </VStack>
)
return (
  <Box fit padding={em(1.5)} background={lightgray}>
    <HStack gap={em(1)}>
      <Family name={sans} color={blue} />
      <Family name={mono} color={red} />
    </HStack>
  </Box>
)
```
