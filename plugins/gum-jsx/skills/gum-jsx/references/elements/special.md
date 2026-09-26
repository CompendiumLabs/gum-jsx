# Special elements

<a id="PngImage"></a>

## PngImage

Embeds a PNG from a base64 data URL. The image reads its
natural pixel dimensions from the PNG header. Set one dimension to resize with
the original aspect ratio; available space uses the same sizing policy as shapes.
When both dimensions are fixed, the image fits centered inside the box without
stretching. Common [sizing](../guides/sizing.md) props also apply.

| Property | Default | Meaning |
|---|---|---|
| `data` | Required | PNG data URL beginning with `data:image/png;base64,` |
| `width` / `height` | PNG dimensions when unconstrained | Allocated size |
| `aspect` | PNG width divided by height | Preferred layout aspect; pixels keep their original proportions |
| `opacity` | Inherited, initially `1` | Opacity multiplied with the PNG's per-pixel alpha |

The component takes no content children. Fill and stroke props do not recolor
the image. Use a **Box** for a border, background, or rounded clipping.

SVG output includes the PNG data, so it needs no separate image file or network
request. PNG and terminal exports render that embedded image normally.

PDF export embeds losslessly compressed image samples at their original pixel
resolution, plus a soft mask for transparency. Repeated copies share the embedded
image. Surrounding shapes and text remain vector. Enlarging the image does not
add detail; its print resolution depends on its pixel count and displayed size.

PDF export currently rejects RGB PNGs with only one or two pixels and a `tRNS`
transparency key because of a decoder limitation. Convert these images to RGBA;
ordinary RGBA PNGs, including transparent 1×1 images, are supported.

To read a local file in a Bun host script:

```ts
const bytes = await Bun.file('photo.png').arrayBuffer()
const data = `data:image/png;base64,${Buffer.from(bytes).toString('base64')}`
const image = new PngImage({ data, width: px(320) })
```

Load files before layout. The component itself accepts embedded data rather
than paths or remote URLs, and works in the editor without filesystem APIs.
Hosts can use `png_size(data)` from core to read `{ width, height }` from a PNG
data URL without decoding its pixels.

<a id="PngImage-example"></a>

### Example

```jsx
// A small embedded PNG resized proportionally and centered in a square frame.
const data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAGklEQVR4XmP4zwBEIMjwHwggbBBqYAACkBAAKooSbzGPaPkAAAAASUVORK5CYII='

return (
  <Box background={white} padding={em(1)}>
    <HStack gap={em(1.5)}>
      <PngImage data={data} grow={1} />
      <Box grow={1} border-color={gray} border-width={px(1)} background={lightgray}>
        <PngImage data={data} width="fill" aspect={1} opacity={0.7} />
      </Box>
    </HStack>
  </Box>
)
```
