# loadPNG

`loadPNG(path)` synchronously reads a PNG file and returns a base64 data URL for
[PngImage](../elements/external.md#PngImage). It checks the PNG header and retains
the original bytes; pixel decoding happens in the renderer when needed.

The example loads `landscape.png` once, then displays it at its original
proportions and centered inside a square. Setting one image dimension preserves
its aspect ratio. Setting both dimensions fits the image inside that box without
stretching its pixels.

## Sample input

The fixture is a 240 × 150 PNG, drawn with Gum. Both the image and its
`landscape.jsx` source live in the
[sample data directory](https://github.com/CompendiumLabs/gum-jsx-docs/tree/master/docs/guides/data).
To regenerate it from that directory:

```sh
gum landscape.jsx -o landscape.png
```

SVG output embeds the PNG data, so the rendered SVG can be shared without the
original image file. Loading and scaling do not change the PNG's pixel resolution.

## Paths and hosts

The CLI resolves relative paths from the JSX file's directory, or from the
working directory for stdin. Absolute paths also work. Missing files and invalid
PNG headers throw an error containing the resolved filename.

The docs preview supplies a shim for the bundled sample PNG, so this example
also renders in the browser. For CLI use, place the PNG beside your JSX script.
The docs shim does not provide filesystem or remote URL access.
`PngImage` itself continues to accept embedded image data.

See [loadJSON](load_json.md) for structured data and [loadCSV](load_csv.md)
for tables.

## Example

```jsx
// Load one PNG once, then reuse its embedded data at two different sizes.
const image = loadPNG('landscape.png')

return (
  <Box font-size={px(18)} padding={em(1)} fit>
    <VStack gap={em(1)}>
      <Text font-size={em(1.3)} font-weight={bold}>One PNG, two sizes</Text>
      <HStack gap={em(1)} align="center">
        <VStack gap={em(0.5)}>
          <PngImage data={image} width={em(14)} />
          <Text>Original proportions</Text>
        </VStack>
        <VStack gap={em(0.5)}>
          <Box width={em(9)} height={em(9)} border-color={gray} border-width={px(1)}>
            <PngImage data={image} width="fill" height="fill" />
          </Box>
          <Text>Centered in a square</Text>
        </VStack>
      </HStack>
    </VStack>
  </Box>
)
```
