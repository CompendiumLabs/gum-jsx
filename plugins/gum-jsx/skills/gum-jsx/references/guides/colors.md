# Colors

`interp(start,end,t)` interpolates between two colors. `palette(start,end,lim)`
returns a function that maps numeric data to those colors. Both are available
in JSX and as named imports.

```js
const paint = palette(blue, red, [-1, 1])
const midpoint = interp(white, blue, 0.5)
```

Colors must use #rgb, #rgba, #rrggbb, or #rrggbbaa notation. Gum's named color
constants are hex strings and work directly. Literal CSS color names and the
`none` paint value are not interpolation inputs.

Interpolation is linear in the RGB and alpha channels and returns an `rgba(...)`
string. Fractions are clamped to [0,1]. Palette limits default to [0,1], may be
reversed, and must have distinct finite endpoints. Values outside the limits
use the endpoint color. The palette owns its limits and parses its colors once.

Use a palette in construction-time style callbacks for bars or custom markers:

```jsx
<Bars values={[-1, -0.5, 0, 0.5, 1]} styles={value => ({fill: paint(value)})} />
```

## Example

```jsx
// A data-domain palette and a white-to-blue interpolation ramp.
const paint = palette(blue, red, [0, 8])
return <Box padding={em(1.5)} background={lightgray}>
  <VStack width="fill" gap={em(1)}>
    <Text font-size={em(1.625)} font-weight={bold}>Numbers into colors</Text>
    <Text>palette(blue, red, [0, 8])</Text>
    <HStack gap={em(0.375)}>
      {range(9).map(value => <Box grow={1} height={px(48)} background={paint(value)} align="center">
        <Text color={white}>{value}</Text>
      </Box>)}
    </HStack>
    <Text>interp(white, blue, fraction)</Text>
    <HStack gap={em(0.9)}>
      {linspace(0, 1, 5).map(t => <VStack grow={1} gap={em(0.375)} align="center">
        <Square fill={interp(white, blue, t)} stroke={darkgray} />
        <Text font-family={mono} font-size={em(0.9)}>{rounder(t)}</Text>
      </VStack>)}
    </HStack>
  </VStack>
</Box>
```
