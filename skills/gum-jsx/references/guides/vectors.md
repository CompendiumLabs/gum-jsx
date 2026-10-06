# Vectors

Point and vector helpers are available in JSX and as named imports. New arrays
and points are frozen. Arithmetic preserves NaN/Infinity so sampling can turn
invalid results into gaps.

## Points and polar coordinates

`add2`, `sub2`, `mul2`, and `div2` work component by component. Each operand can
be an `{x,y}` point, a `[x,y]` pair, or a scalar broadcast to both components.
Results are native `{x,y}` points, ready for **Polygon**, **Points**, or **Field**.
Those elements also accept `[x,y]` inputs directly; see [Point values](point_values.md).

```js
add2([1, 2], 3)                   // {x:4, y:5}
mul2([2, 3], [4, 5])            // {x:8, y:15}
polar(pi / 2, 2, [1, 1])         // approximately {x:1, y:3}
polard(90, [2, 3], [1, 1])       // approximately {x:1, y:4}
```

`polar(angle,radius=1,center=[0,0])` takes radians; `polard` takes degrees.
Radius may be a scalar or separate x/y radii for an ellipse. Center may be a
point or pair. Positive angles turn toward positive y; a graph's coordinate
mapping determines how that appears on the screen.

`addn`, `subn`, `muln`, and `divn` operate on numeric arrays of equal length.
A length mismatch is an error. [Math helpers](math_helpers.md) provides norm and
normalize; use `normalize(values,2)` for a Euclidean unit vector.

## Complex values

Complex numbers are `[real,imaginary]` pairs. `addc`, `subc`, `mulc`, and `divc`
accept either a complex pair or a real scalar and return a pair. `conjc`
conjugates, `normc` returns magnitude, and `argc` returns the angle in radians.

```js
mulc([1, 2], [3, 4])   // [-5, 10]
divc([3, 4], [1, 2])   // approximately [2.2, -0.4]
normc([3, 4])           // 5
```

Complex division scales its divisor to avoid squaring large components; a zero
divisor produces nonfinite results.

## Example

```jsx
// Native points from a Cartesian grid and evenly spaced polar vectors.
const tips = linspace(0, tau, 12, false).map(angle => polar(angle, 1.5))
const vectors = tips.map(tip => ({ point: [0, 0], vector: mul2(tip, 1.1) }))
return <Box padding={em(1.5)} background={lightgray}>
  <VStack gap={em(1)}>
    <Text font-size={em(1.625)} font-weight={bold}>Grids and polar vectors</Text>
    <Graph aspect={1} xlim={[-2, 2]} ylim={[-2, 2]}>
      <Points points={lingrid([-2, 2], [-2, 2], 9)} point-size={px(3)} fill={darkgray} />
      <SymLine f={angle => polar(angle, 1.5)} tlim={[0, tau]}
        stroke={blue} stroke-width={px(2)} />
      <Field vectors={vectors} stroke={blue} stroke-width={px(1.5)} head-size={px(7)} />
      <Points points={tips} point-size={px(7)} fill={red} />
    </Graph>
    <Text font-size={em(0.9)}>12 vectors, one circle, and a 9 by 9 Cartesian grid.</Text>
  </VStack>
</Box>
```
