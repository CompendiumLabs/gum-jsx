# Math helpers

Math helpers are available directly in JSX and as named imports from
`gum-jsx-core`. Use `sin(x)` in an expression, or pass `sin` directly as a
[symbolic curve](../elements/plotting.md#SymLine)'s `fy` prop. `Math` itself is also available.

```jsx
<Plot xlim={[0, tau]} ylim={[-1.2, 1.2]}>
  <SymLine fy={sin} xlim={[0, tau]} stroke={blue} />
  <SymLine fy={x => exp(-x / 4) * cos(x)} xlim={[0, tau]} stroke={red} />
</Plot>
```

## Scalars and constants

These aliases have JavaScript's numeric behavior, including NaN and Infinity
outside a function's domain. [SymLine](../elements/plotting.md#SymLine) turns nonfinite results into
gaps. Trigonometric functions take radians.

| **Group** | Names |
| --- | --- |
| Trigonometry | sin, cos, tan, cot, asin, acos, atan, atan2 |
| Hyperbolic | sinh, cosh, tanh, asinh, acosh, atanh |
| Exponents and logarithms | exp, expm1, log (natural), log2, log10, log1p, pow, sqrt, cbrt |
| Magnitudes and rounding | abs, sign, hypot, floor, ceil, round, trunc, fround |
| Integer operations | imul, clz32 |
| Tests | isFinite, isNan, isInf (only positive/negative Infinity) |
| Constants | e, pi, tau (2 pi), phi, r2d, d2r |

## Reductions

`sum`, `prod`, `mean`, `min`, and `max` take an array and skip null/undefined.
NaN and Infinity remain numeric data. `minimum` and `maximum` take separate
arguments: `maximum(1, 4, 2)` is `4`; `max([1, 4, 2])` is also `4`.

| Call | Result |
| --- | --- |
| `sum([])`, `prod([])` | 0, 1 |
| `min([])`, `max([])`, `mean([])` | undefined, undefined, NaN |
| `cumsum([2, -1, 4])` | [0, 2, 1, 5]; pass false as the second argument to omit the initial zero |
| `norm([-3, 4], degree=2)` | 5; degree 1 sums magnitudes, Infinity takes the largest magnitude |
| `normalize([2, 3, 5], degree=1)` | [0.2, 0.3, 0.5]; use degree 2 for Euclidean unit vectors |
| `all([])`, `any([])` | true, false |

Norm degrees must be positive. Empty and zero vectors have norm zero and
normalize to an empty or zero vector. Norms use absolute component values and
scale before taking powers to handle large finite magnitudes.

## Mapping and formatting

| Call | Meaning |
| --- | --- |
| `clamp(x, [lo,hi]=[0,1])` | Limit x to the interval; either endpoint order is accepted |
| `rescale(x, [a,b]=[0,1])` | Map a to 0 and b to 1, without clamping; endpoints must differ |
| `lerp(a,b,t)` | Interpolate from a to b; t outside [0,1] extrapolates |
| `sigmoid(x)`, `logit(p)` | Logistic function and its inverse |
| `smoothstep(x, [a,b]=[0,1])` | Clamped cubic transition from 0 to 1; reversed limits reverse it |
| `heaviside(x)`, `heavisign(x)` | 0/1 or -1/1 step, taking the positive branch at zero |
| `abs_min(a,b)`, `abs_max(a,b)` | Argument with smaller/larger magnitude; ties choose b |
| `identity(x)`, `invert(x)` | Return x or 1/x; `invert(undefined)` stays undefined |
| `rounder(x, precision=2)` | Compact decimal string, trimming trailing zeroes and negative zero |

`rounder` also accepts literal text and strings ending in px. Precision is an
integer from 0 to 100. Mapping limits must be finite.

See [Arrays](arrays.md) for `range`, `linspace`, and grids;
[Vectors](vectors.md) for point and complex arithmetic; [Random](random.md) for
repeatable sampling; and [Colors](colors.md) for color interpolation.

## Example

```jsx
// Bare math functions, periodic samples, and reductions in a complete plot.
const waves = [
  { label: 'sin(x)', fy: sin, color: blue },
  { label: 'cos(x)', fy: cos, color: red },
  { label: 'exp(-x/4) sin(x)', fy: x => exp(-x / 4) * sin(x), color: green },
]
const xs = linspace(0, tau, 16, false)
const ys = xs.map(sin)
const xticks = zip(
  range(5).map(i => i * pi / 2),
  ['0', 'π/2', 'π', '3π/2', '2π']
)
const entries = [
  { label: "Prediction", color: blue, kind: "point" },
  { label: "Sample", color: red, kind: "line" },
  { label: "Total", color: green, kind: "line" },
]
return <TextBox
  width="fill"
  font-size={px(20)}
  padding={em(1.5)}
  background={lightgray}
  color={slate}
>
  <TextCol gap={em(1)}>
    <Text font-size={em(1.75)} font-weight={bold}>Math, directly in JSX</Text>
    <Plot font-size={em(0.75)} aspect={2} xlim={[0, tau]}
      ylim={[-1.3, 1.3]} xlabel="x (radians)" xticks={xticks}>
      {waves.map(({ fy, color }) => <SymLine fy={fy} xlim={[0, tau]}
        stroke={color} stroke-width={px(2.5)} />)}
      <Points points={zip(xs, ys)}
        point-size={px(9)} fill={blue} stroke={white} stroke-width={px(1)} />
      <Legend x={3.9} y={1.2} anchor={["center", "start"]} font-size={em(0.9)}>
        {entries.map(({ label, color, ...options }) =>
          <LegendItem {...options} badge-color={color}>
            {label}
          </LegendItem>
        )}
      </Legend>
    </Plot>
    <Text font-family={mono} font-size={em(0.8)}>
      {xs.length} periodic samples. Mean: {rounder(mean(ys), 3)}. RMS: {rounder(norm(ys) / sqrt(ys.length), 3)}.
    </Text>
  </TextCol>
</TextBox>
```
