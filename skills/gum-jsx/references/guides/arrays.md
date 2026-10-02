# Arrays

Array helpers generate figure data and repeated components. They are available
in JSX and as named imports. Result arrays and newly created rows are frozen;
input arrays and objects remain untouched. `repeat` repeats references rather
than cloning its value.

```jsx
<HStack gap={em(0.5)}>
  {range(5).map(i => <Circle width={px(12 + i * 4)} fill={blue} />)}
</HStack>
```

## Sequences

| Call | Behavior |
| --- | --- |
| `range(stop)` | Integers from 0 up to, excluding, stop |
| `range(start,stop,step=1)` | A half-open sequence; fractional and negative steps work |
| `linspace(a,b,count=101,endpoint=true)` | Exactly count evenly spaced values, including b by default |
| `repeat(value,count)` | Repeat a value or object reference count times |
| `enumerate(values)` | [index,value] pairs, useful directly as categorical ticks |

`range(1,6,2)` returns `[1,3,5]`. A step pointing away from the stop gives an
empty array. Zero/nonfinite steps and a step too small to advance are errors.
`linspace` returns `[]` for count 0 and `[a]` for count 1. Set endpoint to false
for circles and other periodic data without a duplicate closing sample:

```js
const vertices = linspace(0, tau, 12, false).map(angle => polar(angle))
```

Bounds must be finite; counts are integers from 0 to 100000. Generated ranges
and Cartesian grids also have a total size limit of 100000.

## Pairing, grids, and reshaping

| Call | Behavior |
| --- | --- |
| `zip(xs,ys,...)` | Pair by index, stopping at the shortest input; no inputs gives [] |
| `meshgrid(xs,ys)` | Flat [x,y] Cartesian product, x outermost and y changing fastest |
| `lingrid(xlim,ylim,counts=11)` | Evenly spaced Cartesian grid of native {x,y} points |
| `reshape(values,[rows,columns])` | Row-major matrix; dimensions must match the input length exactly |
| `split(values,size)` | Chunks of size, keeping a shorter final chunk |
| `concat(arrays)` | Flatten one level of arrays |
| `slice(values,start?,stop?,step=1)` | Half-open slice with negative indices and negative steps |

`zip(xs, ys)` and `meshgrid(xs, ys)` return tuples that can go directly into
[point-taking elements](point_values.md): `<Points points={zip(xs, ys)} />`.

`lingrid` accepts a shared count, `[nx,ny]`, or `{x:nx,y:ny}`. Limits may be
reversed. Use `slice(values, undefined, undefined, -1)` to reverse an array;
an omitted stop with a negative step includes index zero.

[Math helpers](math_helpers.md) supplies reductions such as sum, mean, cumsum,
and norm. [SymLine](../elements/plotting.md#SymLine) describes generated graph geometry.

## Example

```jsx
// Sequences become categorical ticks, bars, and a reshaped text table.
const indices = range(1, 7)
const values = indices.map(n => pow(n, 2))
const rows = reshape(values, [2, 3])
return <TextBox width="fill" padding={em(1.5)} background={lightgray}>
  <TextCol gap={em(1)}>
    <Text font-size={em(1.625)} font-weight={bold}>From a range to a figure</Text>
    <BarPlot font-size={em(0.75)} aspect={2} values={values} xticks={enumerate(indices.map(String))}
      xlabel="n" ylabel="n squared" fill={blue} />
    <HStack gap={em(1.5)} align="center">
      <Frame padding={em(0.75)}>
        <Text whitespace="pre" font-family={mono}>
          {rows.map(row => row.map(n => String(n).padStart(2)).join('  ')).join('\n')}
        </Text>
      </Frame>
      <Text grow={1}>Sum: {sum(values)}. Mean: {rounder(mean(values))}.</Text>
    </HStack>
  </TextCol>
</TextBox>
```
