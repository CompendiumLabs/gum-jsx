# Random

Every `evaluate(source, {seed?})` call starts its own random stream, with seed 42
by default. Re-evaluating the same document gives the same samples. The host's
random stream, other evaluations, layout, and SVG IDs do not change those draws.

```jsx
setSeed(7)
const points = range(100).map(() => [normal(), normal()])
return <Plot><Points points={points} fill={blue} /></Plot>
```

| Call | Meaning |
| --- | --- |
| `setSeed(seed)` | Reset the current stream, including any cached normal sample |
| `random()` | Uniform fraction in [0,1) |
| `uniform(lo=0,hi=1)` | Uniform value between finite bounds, with hi greater than lo |
| `normal(mean=0,stddev=1)` | Normal sample; stddev must be nonnegative, and zero returns mean |
| `integer(stop)` | Integer from 0 up to, excluding, stop |
| `integer(start,stop)` | Integer from start up to, excluding, stop |

Seeds must be safe integers and are reduced to 32 bits. Integer bounds and their
difference must be safe integers, with stop greater than start. The stream uses
Mulberry32; normal sampling uses the Marsaglia polar method.

Direct imports of setSeed/random/uniform/normal/integer share one host stream.
Use `new RNG(seed)` for an independent stream with the same methods. Methods are
bound, so `range(10).map(rng.random)` works. Resetting the seed starts the same
sequence again. `setSeed` inside JSX affects only that evaluation's stream.

Sampling happens while constructing elements. Resizing a figure reuses those
samples. To create different data, change the seed and evaluate again. A host
can also override individual helpers through `evaluate(source, {scope})`.

## Example

```jsx
// Seeded normal samples stay identical across rerenders and viewport changes.
setSeed(7)
const points = range(120).map(() => [normal(), normal()])
const center = [mean(points.map(p => p[0])), mean(points.map(p => p[1]))]
return <TextBox width="fill" padding={em(1.5)} background={lightgray}>
  <TextCol gap={em(1)}>
    <Text font-size={em(1.625)} font-weight={bold}>Random data, repeatable figures</Text>
    <Plot xlim={[-3.5, 3.5]} ylim={[-3.5, 3.5]}
      xlabel="x" ylabel="y">
      <Points points={points} point-size={px(6)} fill={blue} opacity={0.65} />
      <Points points={[center]} point-size={px(12)} fill={red} stroke={white} stroke-width={px(2)} />
    </Plot>
    <Text font-family={mono} font-size={em(0.9)}>
      Seed 7. n = {points.length}. Mean = ({rounder(center[0], 3)}, {rounder(center[1], 3)}).
    </Text>
  </TextCol>
</TextBox>
```
