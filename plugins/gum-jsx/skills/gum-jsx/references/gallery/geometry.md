# Geometry gallery

<a id="arrow_caps"></a>

## Arrow caps and tips

The top row compares butt, round, and square caps on thick shafts. Blue arrows
have one head, green arrows have two, and dashed guides mark their original
endpoints. Heads keep those positions while shaft ends retreat far enough to
hide their caps behind the triangular tips. The unheaded ends retain their
selected cap style.

The lower row applies the same behavior to curved and rounded routes. Endpoints
use fractional positions within each canvas; head dimensions, strokes, and dashes
use `em()`. Flex bases establish the comparison columns, and aspect ratios size
their canvases. The root's `fit` scales the completed comparison uniformly.
Shaft and head colors differ to make the connection visible.

See [Arrow](../elements/geometry.md#Arrow) for options and short-route behavior.
The same geometry is used by [Field](../elements/plotting.md#Field).

<a id="arrow_caps-example"></a>

### Example

```jsx
// Thick shafts stay behind arrow tips for every cap style and route shape.
const CapColumn = ({ cap, ...attr }) =>
  <VStack gap={em(1.5)} align="center" {...attr}>
    <Text justify="center" font-family={mono}>{cap}</Text>
    <VStack gap={em(2.5)}>
      <Arrow from={[0, 0.5]} to={[1, 0.5]}
        stroke={slate} stroke-width={em(0.5)} stroke-linecap={cap}
        head-size={em(1.75)} head-width={1} head-fill={blue} />
      <Arrow from={[0, .5]} to={[1, .5]} start-head
        stroke={slate} stroke-width={em(0.5)} stroke-linecap={cap}
        head-size={em(1.75)} head-width={1} head-fill={green} />
    </VStack>
  </VStack>

const SplineArrow = ({ ...attr }) =>
  <VStack gap={em(0.5)} {...attr}>
    <Text width="fill" justify="center" font-family={mono}>curved / square caps</Text>
    <Box padding={em(1)}>
      <Arrow aspect={2} points={[[0, 1], [0.3, 0.1], [0.7, 0.9], [1, 0]]}
        curve start-head stroke={slate} stroke-width={em(0.5)} stroke-linecap="square"
        head-size={em(1.75)} head-width={0.8} head-style={{fill: blue}} />
    </Box>
  </VStack>

const RoundedArrow = ({ ...attr }) =>
  <VStack gap={em(0.5)} {...attr}>
    <Text width="fill" justify="center" font-family={mono}>rounded / round caps</Text>
    <Box padding={em(1)}>
      <Arrow aspect={2} points={[[0, 1], [0, 0], [0.5, 0], [0.5, 1], [1, 1]]}
        radius={em(1)} start-head stroke={slate} stroke-width={em(0.5)} stroke-linecap="round"
        head-size={em(1.75)} head-width={0.8} head-style={{fill: green}} />
    </Box>
  </VStack>

return <Box fit padding={em(1.5)} color={slate}>
  <VStack gap={em(2)}>
    <VStack gap={em(0.5)}>
      <Text font-size={em(1.75)} font-weight={bold}>Arrow tips, clean at every cap</Text>
      <Text font-size={em(0.9)}>The dashed guides mark the requested endpoints.</Text>
    </VStack>
    <VStack gap={em(3)} align="center">
      <HStack gap={em(2)}>{['butt', 'round', 'square'].map(cap =>
        <CapColumn cap={cap} shrink={1} basis={em(12)} />
      )}</HStack>
      <HStack gap={em(2)}>
        <SplineArrow  grow={1} basis={em(14)} />
        <RoundedArrow grow={1} basis={em(14)} />
      </HStack>
    </VStack>
  </VStack>
</Box>
```

---

<a id="cell_diagram"></a>

## Anatomy of a Cell

A labeled animal-cell schematic combines a lumpy membrane, nucleus, mitochondria, endoplasmic reticulum, and other organelles.

Reusable organelles draw in local coordinates inside explicitly sized regions; the outer Graph places them in the shared diagram coordinate system. Rotate positions mitochondria, while CoordLine draws data-space leader lines. Labels are manually placed, and colors are blended from the shared palette. This is a schematic, not a scale model.

See [Graph](../elements/plotting.md#Graph).

<a id="cell_diagram-example"></a>

### Example

```jsx
// A labeled animal-cell schematic composed from local organelle drawings.
const polarPair = (...args) => {
  const point = polar(...args)
  return [point.x, point.y]
}
// color scheme: muted, tonal palette — each organelle is a dusty mid-tone fill
// with a deeper stroke of the same hue, on warm paper with a cool mist cytoplasm
const col = {
  frame: { fill: interp(white, yellow, 0.063), border: interp(black, white, 0.733) },
  label: { line: interp(black, white, 0.573), text: interp(darkgray, black, 0.593) },
  membrane: { outer: interp(yellow, darkgray, 0.406), inner: interp(white, yellow, 0.372) },
  cytoplasm: { fill: interp(white, slate, 0.057) },
  mito: {
    fill: interp(purple, yellow, 0.479),
    stroke: interp(red, slate, 0.543),
    cristae: interp(white, red, 0.18),
  },
  lyso: {
    fill: interp(white, green, 0.604),
    stroke: interp(blue, green, 0.659),
    dots: interp(green, slate, 0.569),
  },
  golgi: { stroke: interp(blue, yellow, 0.477) },
  centrioles: { fill: interp(purple, darkgray, 0.637), stroke: interp(purple, slate, 0.45) },
  er: { stroke: interp(blue, darkgray, 0.52) },
  nucleus: {
    fill: interp(white, slate, 0.386),
    stroke: interp(green, purple, 0.601),
    inner: interp(white, purple, 0.263),
  },
  nucleolus: { fill: interp(yellow, purple, 0.669), stroke: interp(red, slate, 0.576) },
  vacuole: { fill: interp(white, blue, 0.327), stroke: interp(blue, yellow, 0.269) },
  ribosomes: { fill: interp(slate, white, 0.293) },
}

// canvas coordinates (wider than the cell to leave room for labels and title)
const C = [-0.2, 0, 1.7, 1]
const asp = 1.6

// helpers: lumpy blob from a list of radii
const blob = (radii, phase = 0) =>
  radii.map((r, i) => polarPair(phase + (2 * pi * i) / radii.length, r))
const Blob = ({ radii, phase = 0, ...attr }) => (
  <Spline
    closed
    space="local"
    points={blob(radii, phase).map(([x, y]) => [(x + 1) / 2, (y + 1) / 2])}
    {...attr}
  />
)

// wavy arc around a center (for the endoplasmic reticulum)
const wavyArc = (c, r, a0, a1, amp, n) =>
  linspace(a0 * d2r, a1 * d2r, n, true).map((t, i) =>
    polarPair(t, r + (i % 2 == 0 ? amp : -amp)).map((v, k) => v + c[k]),
  )

// organelle components
const mitoOuter = [
  [0.04, 0.5],
  [0.2, 0.15],
  [0.55, 0.08],
  [0.9, 0.28],
  [0.96, 0.6],
  [0.78, 0.92],
  [0.42, 0.92],
  [0.12, 0.78],
]
const cristae = [
  [0.18, 0.5],
  [0.28, 0.28],
  [0.38, 0.72],
  [0.5, 0.28],
  [0.62, 0.72],
  [0.74, 0.3],
  [0.84, 0.5],
]
const Mito = (attr) => (
  <Group aspect={2.2} {...attr}>
    <Spline
      space="local"
      closed
      points={mitoOuter}
      fill={col.mito.fill}
      stroke={col.mito.stroke}
      stroke-width={px(1)}
    />
    <Spline
      space="local"
      points={cristae}
      stroke={col.mito.cristae}
      stroke-width={px(1.5)}
      stroke-linecap="round"
    />
  </Group>
)

const Lyso = (attr) => (
  <Group aspect={1} {...attr}>
    <Circle fill={col.lyso.fill} stroke={col.lyso.stroke} stroke-width={px(1)} />
    <Points
      space="local"
      points={[
        [0.35, 0.4],
        [0.62, 0.35],
        [0.5, 0.68],
        [0.3, 0.66],
        [0.72, 0.62],
      ]}
      point-size={0.14}
      fill={col.lyso.dots}
    />
  </Group>
)

const Golgi = (attr) => (
  <Group aspect={1.4} {...attr}>
    {range(4).map((i) => {
      const y = 0.15 + 0.22 * i
      const x0 = 0.05 + 0.07 * i,
        x1 = 0.95 - 0.07 * i
      return (
        <Spline
          space="local"
          points={[
            [x0, y],
            [0.5, y - 0.14],
            [x1, y],
          ]}
          stroke={col.golgi.stroke}
          stroke-width={px(3)}
          stroke-linecap="round"
        />
      )
    })}
    <Points
      space="local"
      points={[
        [0.12, 0.95],
        [0.5, 1.0],
        [0.02, 0.45],
      ]}
      point-size={0.09}
      fill={col.golgi.stroke}
    />
  </Group>
)

const Centrioles = (attr) => (
  <Group aspect={1} {...attr}>
    <Rect
      x={0.35}
      y={0.5}
      anchor="center"
      width={0.22}
      height={0.8}
      fill={col.centrioles.fill}
      stroke={col.centrioles.stroke}
    />
    <Rect
      x={0.7}
      y={0.72}
      anchor="center"
      width={0.6}
      height={0.22}
      fill={col.centrioles.fill}
      stroke={col.centrioles.stroke}
    />
  </Group>
)

// shapes
const membrane = [1.0, 0.86, 0.96, 0.8, 0.9, 1.0, 0.82, 0.92, 0.72, 0.96, 0.86, 1.0]
const nucleusR = [1.0, 0.92, 1.0, 0.88, 0.96, 0.9, 1.0, 0.94]
const nucleolusR = [1.0, 0.85, 1.0, 0.9, 1.0]
const vacuoleR = [1.0, 0.8, 0.95, 0.75, 1.0, 0.85, 0.9]

const nc = [0.85, 0.5]
const ribosomes = [
  [0.34, 0.46],
  [0.38, 0.66],
  [0.6, 0.3],
  [0.66, 0.7],
  [0.72, 0.2],
  [0.92, 0.24],
  [1.06, 0.5],
  [1.14, 0.5],
  [0.78, 0.82],
  [0.9, 0.73],
  [1.06, 0.6],
  [0.33, 0.62],
  [0.75, 0.76],
  [0.4, 0.68],
  [0.62, 0.62],
  [0.58, 0.44],
  [1.02, 0.34],
]

// mitochondria placements: [pos, size, rotate]
const mitos = [
  [[0.45, 0.39], 0.17, 15],
  [[1.06, 0.28], 0.16, 15],
  [[0.52, 0.72], 0.2, -10],
]
// left tip of a mitochondrion (spline tip sits at 4% in from the box edge)
const mitoTip = ([[cx, cy], w, th]) => {
  const t = th * d2r,
    r = 0.46 * w
  return [cx - r * cos(t), cy - r * sin(t)]
}

// labels: [text, side, y, target]
const xL = 0.17,
  xR = 1.33,
  th = 0.04
const labels = [
  ["Cell membrane", "l", 0.1, [0.32, 0.3]],
  ["Mitochondrion", "l", 0.3, mitoTip(mitos[0])],
  ["Vacuole", "l", 0.52, [0.365, 0.55]],
  ["Rough ER", "l", 0.7, [0.58, 0.6]],
  ["Ribosomes", "l", 0.88, [0.4, 0.68]],
  ["Nucleus", "r", 0.28, [0.97, 0.42]],
  ["Nucleolus", "r", 0.4, [0.88, 0.47]],
  ["Lysosome", "r", 0.52, [1.25, 0.5]],
  ["Centrioles", "r", 0.64, [1.14, 0.6]],
  ["Golgi apparatus", "r", 0.78, [1.07, 0.72]],
  ["Cytoplasm", "r", 0.92, [0.85, 0.77]],
]

return (
  <Box min-width={em(20)} padding={em(1.5)}>
    <TitleFrame
      title="Anatomy of a Cell"
      title-font-size={em(1.25)}
      padding={em(1.3)}
      border-radius={em(0.8)}
      background={col.frame.fill}
      border-color={col.frame.border}
      title-background={white}
    >
      <Graph aspect={1.73} xlim={[-0.2, 1.7]} ylim={[0, 1]} flip-y={false}>
        <Blob
          radii={membrane}
          x={0.75}
          y={0.5}
          anchor="center"
          width={0.568}
          height={0.86}
          fill={col.cytoplasm.fill}
          stroke={col.membrane.outer}
          stroke-width={px(3)}
        />
        <Blob
          radii={membrane}
          x={0.75}
          y={0.5}
          anchor="center"
          width={0.537}
          height={0.8}
          fill={none}
          stroke={col.membrane.inner}
          stroke-width={px(1)}
        />
        {[0.2, 0.245, 0.29].map((r) => (
          <Spline
            points={wavyArc(nc, r, 105, 255, 0.012, 15)}
            stroke={col.er.stroke}
            stroke-width={px(1.5)}
            stroke-linecap="round"
          />
        ))}
        <Blob
          radii={nucleusR}
          phase={0.4}
          x={nc[0]}
          y={nc[1]}
          anchor="center"
          width={0.168}
          height={0.32}
          fill={col.nucleus.fill}
          stroke={col.nucleus.stroke}
          stroke-width={px(2)}
        />
        <Blob
          radii={nucleusR}
          phase={0.4}
          x={nc[0]}
          y={nc[1]}
          anchor="center"
          width={0.147}
          height={0.28}
          fill={none}
          stroke={col.nucleus.inner}
          stroke-width={px(0.75)}
          stroke-dasharray={[px(2), px(2)]}
        />
        <Blob
          radii={nucleolusR}
          phase={1}
          x={0.88}
          y={0.47}
          anchor="center"
          width={0.058}
          height={0.11}
          fill={col.nucleolus.fill}
          stroke={col.nucleolus.stroke}
          stroke-width={px(1)}
        />
        {mitos.map(([p, size, angle]) => (
          <Rotate x={p[0]} y={p[1]} anchor="center" angle={angle}>
            <Mito width={size / 1.9} />
          </Rotate>
        ))}
        <Golgi
          x={1.01}
          y={0.72}
          anchor="center"
          width={0.095}
        />
        <Centrioles
          x={1.11}
          y={0.57}
          anchor="center"
          width={0.042}
        />
        <Lyso x={1.22} y={0.5} anchor="center" width={0.034} />
        <Lyso x={0.68} y={0.79} anchor="center" width={0.029} />
        <Blob
          radii={vacuoleR}
          phase={0.7}
          x={0.42}
          y={0.55}
          anchor="center"
          width={0.074}
          height={0.14}
          fill={col.vacuole.fill}
          stroke={col.vacuole.stroke}
          stroke-width={px(1.5)}
        />
        <Points points={ribosomes} point-size={px(3.5)} fill={col.ribosomes.fill} />
        {labels.map(([label, side, y, target]) => (
          <CoordLine
            points={[[side === "l" ? xL + 0.01 : xR - 0.01, y], target]}
            stroke={col.label.line}
            stroke-width={px(1)}
          />
        ))}
        {labels.map(([label, side, y]) => (
          <Text
            x={side === "l" ? xL : xR}
            y={y}
            anchor={[side === "l" ? 1 : 0, 0.5]}
            font-size={em(0.7)}
            color={col.label.text}
          >
            {label}
          </Text>
        ))}
      </Graph>
    </TitleFrame>
  </Box>
)
```

---

<a id="metal_grid"></a>

## Metal Grid

A luminous 9-by-16 tile matrix sits under a bright layered spline, inside nested dark frames.

The grid consists of positioned cells in a Group. Gaps, tile radii, and layered stroke widths are explicit; the two spline passes approximate a glow without filters.

See [Group](../elements/layout.md#Group).

<a id="metal_grid-example"></a>

### Example

```jsx
// A 9-by-16 luminous tile grid with a layered spline across its surface.
const rows = 9
const cols = 16
const paint = palette(blue, purple, [0, cols - 1])
const points = [
  [0.12, 0.55],
  [0.25, 0.2],
  [0.42, 0.78],
  [0.6, 0.3],
  [0.78, 0.72],
  [0.88, 0.45],
]
return (
  <Box padding={em(1.5)}>
    <Frame padding={em(0.75)} background={darkgray} border-radius={em(1.25)} border-width={px(2)}>
      <Box padding={em(0.75)} background={black} border-radius={em(0.75)}>
        <Group aspect={cols/rows}>
          {range(rows * cols).map((i) => (
            <RoundedRect
              x={(i % cols) / cols}
              y={floor(i / cols) / rows}
              width={1 / cols - 0.007}
              height={1 / rows - 0.012}
              border-radius={em(0.3)}
              fill={paint(i % cols)}
              stroke={none}
              opacity={0.7}
            />
          ))}
          <Spline
            points={points}
            tension={1.2}
            stroke={white}
            stroke-width={px(15)}
            opacity={0.25}
            stroke-linecap="round"
          />
          <Spline
            points={points}
            tension={1.2}
            stroke={white}
            stroke-width={px(5)}
            stroke-linecap="round"
          />
        </Group>
      </Box>
    </Frame>
  </Box>
)
```

---

<a id="neon_rose"></a>

## Neon Rose

Layered spline strokes create a luminous rose with a spiral bud, curled petals, leaves, and small cross-shaped sparkles.

The glow is made from progressively wider, fainter strokes rather than SVG filters. Splines use the graph's data coordinates, while marker dimensions and stroke widths stay in pixels. Colors are blended from the shared palette.

See [Spline](../elements/geometry.md#Spline).

<a id="neon_rose-example"></a>

### Example

```jsx
// neon palette
const bg = interp(black, slate, 0.855)
const pink = interp(red, white, 0.209)
const pinkCore = interp(white, red, 0.151)
const lime = interp(green, yellow, 0.045)
const limeCore = interp(white, green, 0.179)

// layered strokes to fake a neon glow
const Neon = ({ color, core, ...attr }) => [
  <Spline stroke={color} stroke-width={px(34)} opacity={0.05} stroke-linecap="round" {...attr} />,
  <Spline stroke={color} stroke-width={px(20)} opacity={0.1} stroke-linecap="round" {...attr} />,
  <Spline stroke={color} stroke-width={px(10)} opacity={0.25} stroke-linecap="round" {...attr} />,
  <Spline stroke={color} stroke-width={px(3.5)} stroke-linecap="round" {...attr} />,
  <Spline stroke={core} stroke-width={px(1.3)} stroke-linecap="round" {...attr} />,
]

// bud: a tight elliptical spiral
const bud = linspace(0, 3.5 * pi, 40, true).map((t) => [
  0.02 * t * cos(t),
  0.62 + 0.016 * t * sin(t),
])

// petals
const petals = [
  // inner petals hugging the bud
  [
    [-0.05, 0.86],
    [-0.24, 0.8],
    [-0.3, 0.6],
    [-0.2, 0.42],
    [0.0, 0.38],
  ],
  [
    [0.12, 0.86],
    [0.3, 0.72],
    [0.28, 0.5],
    [0.12, 0.4],
  ],
  // tulip-shaped middle petals meeting at the base
  [
    [0, 0.28],
    [-0.4, 0.42],
    [-0.5, 0.78],
    [-0.3, 1.02],
    [-0.12, 0.92],
  ],
  [
    [0, 0.28],
    [0.4, 0.42],
    [0.5, 0.78],
    [0.3, 1.02],
    [0.12, 0.92],
  ],
  // outer petals flaring out and curling under
  [
    [-0.45, 0.58],
    [-0.68, 0.46],
    [-0.8, 0.22],
    [-0.66, 0.02],
    [-0.46, 0.06],
  ],
  [
    [0.45, 0.58],
    [0.68, 0.46],
    [0.8, 0.22],
    [0.66, 0.02],
    [0.46, 0.06],
  ],
  [
    [-0.38, 0.36],
    [-0.3, 0.1],
    [-0.06, 0.0],
    [0.2, 0.05],
    [0.38, 0.32],
  ],
]

// little four-point sparkles
const Sparkle = ({ color, ...attr }) => (
  <Group aspect={1} {...attr}>
    <VLine stroke={color} stroke-width={px(6)} opacity={0.2} stroke-linecap="round" />
    <HLine stroke={color} stroke-width={px(6)} opacity={0.2} stroke-linecap="round" />
    <VLine stroke={color} stroke-width={px(1.5)} stroke-linecap="round" />
    <HLine stroke={color} stroke-width={px(1.5)} stroke-linecap="round" />
  </Group>
)
const sparkles = [
  [[-0.78, 0.95], 0.1],
  [[0.82, 0.8], 0.07],
  [[0.7, -0.05], 0.05],
  [[-0.7, -0.35], 0.06],
  [[0.55, -0.75], 0.08],
  [[-0.4, -1.05], 0.05],
]

// stem
const stem = [
  [0, 0.02],
  [0.05, -0.4],
  [-0.03, -0.8],
  [0.0, -1.2],
]

// leaf outline + vein from base to tip
const leaf = (base, tip, w) => {
  const [x0, y0] = base
  const [x1, y1] = tip
  const [dx, dy] = [x1 - x0, y1 - y0]
  const len = sqrt(dx * dx + dy * dy)
  const [nx, ny] = [-dy / len, dx / len]
  const [mx, my] = [(x0 + x1) / 2, (y0 + y1) / 2]
  return [
    [base, [mx + w * nx, my + w * ny], tip],
    [base, [mx - w * nx, my - w * ny], tip],
    [base, [mx + 0.15 * w * nx, my + 0.15 * w * ny], [x0 + 0.85 * dx, y0 + 0.85 * dy]],
  ]
}
const leaves = [
  ...leaf([0.045, -0.5], [0.55, -0.33], 0.13),
  ...leaf([-0.015, -0.78], [-0.52, -0.62], 0.13),
]

return (
  <Box padding={em(1.25)} background={bg}>
    <Frame background={bg} border-radius={em(1)} clip border-color={bg}>
      <Graph aspect={1 / 1.3} xlim={[-1, 1]} ylim={[-1.3, 1.3]}>
        <Circle
          x={0}
          y={0.5}
          anchor="center"
          width={0.75}
          fill={pink}
          opacity={0.04}
          stroke={none}
        />
        <Circle
          x={0}
          y={0.5}
          anchor="center"
          width={0.5}
          fill={pink}
          opacity={0.05}
          stroke={none}
        />
        {sparkles.map(([p, size]) => (
          <Sparkle
            x={p[0]}
            y={p[1]}
            anchor="center"
            width={size / 2}
            color={pinkCore}
          />
        ))}
        <Neon color={lime} core={limeCore} points={stem} />
        {leaves.map((points) => (
          <Neon color={lime} core={limeCore} points={points} />
        ))}
        {petals.map((points) => (
          <Neon color={pink} core={pinkCore} points={points} />
        ))}
        <Neon color={pink} core={pinkCore} points={bud} />
      </Graph>
    </Frame>
  </Box>
)
```

---

<a id="pendulum_physics"></a>

## Pendulum Physics

A pendulum diagram with a clipped support, angle arc,
equilibrium line, bob, force arrows, and equation of motion. Change `angle` or
`length` to move the rod, bob, and force annotations together.

The drawing uses a downward-facing [Graph](../elements/plotting.md#Graph) so its
data coordinates match the diagram's pixel proportions. `alongRod` derives
positions from the pivot and angle. [CoordLine](../elements/geometry.md#CoordLine)
draws the rod and equilibrium line in that coordinate system; [Arc](../elements/geometry.md#Arc)
uses the same center and screen-space angles.

The layout uses explicit pixel dimensions and font sizes. The bob and its label
are separate siblings inside the graph; frames accept a single content element.
The enclosing rounded [Frame](../elements/layout.md#Frame) clips the support
while keeping its border inside the frame. Arrowheads use `head-size` and inherit
their shaft's color.

The faint grid uses `opacity`; separate `stroke-opacity` and `fill-opacity`
props are not currently supported by the shared paint style.

[View the source](geometry.md#pendulum_physics-example).

<a id="pendulum_physics-example"></a>

### Example

```jsx
// A parameter-driven pendulum with force arrows, an angle arc, and a math caption.
const ink = slate
const support = interp(white, yellow, 0.28)
const paper = interp(white, yellow, 0.07)
const gravity = interp(slate, red, 0.65)
const tension = interp(slate, green, 0.6)

const pivot = [280, 42]
const angle = 25
const length = 285
const bobRadius = 27
const alongRod = distance => [
  pivot[0] + distance * sin(angle * pi / 180),
  pivot[1] + distance * cos(angle * pi / 180),
]
const bob = alongRod(length)
const mid = alongRod(length * 0.5)
const tip = alongRod(length * 0.72)
const Label = ({ x, y, color = ink, children }) => (
  <Latex x={x} y={y} anchor="center" font-size={em(1.4)} color={color}>
    {children}
  </Latex>
)

return (
  <Box color={ink} padding={em(1.55)} background={white}>
    <VStack gap={em(1.2)} align="center">
      <Text font-size={em(1.55)} font-weight={bold}>Simple Pendulum</Text>
      <Frame
        background={paper}
        border-color={ink}
        border-width={px(2)}
        border-radius={em(0.9)}
        clip
      >
        <Graph aspect={580 / 416} xlim={[0, 580]} ylim={[0, 416]} flip-y={false}>
          <Mesh2D
            xlim={[0, 580]} ylim={[0, 416]}
            xticks={range(0, 581, 25)}
            yticks={range(0, 417, 25)}
            stroke={ink}
            opacity={0.09}
            stroke-width={px(1)}
          />
          <RoundedRect
            x={pivot[0]} y={0} anchor="center"
            width={0.45} height={0.2}
            border-radius={px(10)} fill={support} stroke={ink} stroke-width={px(1.5)}
          />
          <Arc
            center={pivot} radius={95} start={90 - angle} end={90}
            stroke={gravity} stroke-width={px(2)}
          />
          <Label x={pivot[0] + 23} y={pivot[1] + 118} color={gravity}>
            {String.raw`\theta`}
          </Label>
          <CoordLine
            points={[pivot, [pivot[0], pivot[1] + length]]}
            stroke={darkgray} stroke-width={px(2)} stroke-dasharray={[px(5), px(5)]}
          />
          <Circle
            x={pivot[0]} y={pivot[1] + length} anchor="center"
            width={0.016} fill={darkgray} stroke={none}
          />
          <CoordLine points={[pivot, bob]} stroke={ink} stroke-width={px(3)} />
          <Label x={mid[0] - 22} y={mid[1] + 12}>
            {String.raw`\ell`}
          </Label>
          <Circle
            x={pivot[0]} y={pivot[1]} anchor="center"
            width={0.02} fill={ink} stroke={none}
          />
          <Arrow
            from={alongRod(length - bobRadius)} to={tip}
            stroke={tension} stroke-width={px(3)} head-size={px(12)}
          />
          <Label x={tip[0] + 28} y={tip[1]} color={tension}>T</Label>
          <Arrow
            from={[bob[0], bob[1] + bobRadius]} to={[bob[0], bob[1] + 95]}
            stroke={gravity} stroke-width={px(3)} head-size={px(12)}
          />
          <Label x={bob[0] + 38} y={bob[1] + 72} color={gravity}>mg</Label>
          <Circle
            x={bob[0]} y={bob[1]} anchor="center"
            width={(2 * bobRadius) / 580} fill={tension} stroke={ink} stroke-width={px(2)}
          />
          <Label x={bob[0]} y={bob[1]} color={white}>m</Label>
        </Graph>
      </Frame>
      <Latex font-size={em(1.5)}>
        {String.raw`\ddot{\theta}=-\frac{g}{\ell}\sin\theta`}
      </Latex>
    </VStack>
  </Box>
)
```

---

<a id="polygon_slide"></a>

## Regular Polygons

Triangles through octagons are shown in two groups of three labeled cards.

Each group stays in one row, and the two rows determine the figure's natural size.
The root's `fit` prop scales the complete grid to smaller hosts without changing its columns.
Each card contains a data graph with the same limits; a closed sampled polygon
uses evenly spaced polar points, excluding the duplicate final angle.

See [SymPoly](../elements/plotting.md#SymPoly).

<a id="polygon_slide-example"></a>

### Example

```jsx
// Six regular polygons stay in two content-sized rows of three.
const shapes = [
  [3, "Triangle"],
  [4, "Square"],
  [5, "Pentagon"],
  [6, "Hexagon"],
  [7, "Heptagon"],
  [8, "Octagon"],
]
const paint = palette(blue, purple, [3, 8])
const Cell = ({ n, label }) => (
  <Frame
    grow={1} shrink={1} basis={em(10)}
    padding={em(1)}
    border-radius={em(0.5)}
    background={lightgray}
    border-color={gray}
  >
    <VStack align="center" gap={em(0.5)}>
      <Graph aspect={1} xlim={[-1, 1]} ylim={[-1, 1]}>
        <SymPoly
          tvals={linspace(0, tau, n, false)}
          f={(t) => polar(t + ((pi / 2) * (n - 2)) / n, -1)}
          fill={paint(n)}
        />
      </Graph>
      <Text>{`${label} (${n})`}</Text>
    </VStack>
  </Frame>
)
return <Box fit font-size={px(20)} padding={em(1)}>
  <VStack gap={em(1)}>
    <Text font-size={em(1.35)} font-weight={bold}>Simple Regular Polygons</Text>
    <Text>Equal side lengths and equal interior angles, from three sides to eight.</Text>
    {[0, 3].map((offset) => (
      <HStack gap={em(1)}>
        {shapes.slice(offset, offset + 3).map(([n, label]) => (
          <Cell n={n} label={label} />
        ))}
      </HStack>
    ))}
  </VStack>
</Box>
```

---

<a id="set_theory"></a>

## Set Theory

Two smaller elliptical regions lie inside the larger set A, with independently positioned labels.

Sibling Ellipse and Text elements in a Group draw each region and its label. Explicit sizes and anchors make the nesting easy to adjust.

See [Ellipse](../elements/geometry.md#Ellipse).

<a id="set_theory-example"></a>

### Example

```jsx
// Nested elliptical regions with independently positioned labels.
<TitleFrame font-size={px(25)} title="Set Theory" padding={em(3)} border-radius={em(0.55)}>
  <Group aspect={1}>
    <Circle
      width={1}
      height={1}
      fill={interp(white, purple, 0.17)}
      stroke={purple}
      stroke-width={px(2)}
    />
    <Circle
      x={0.6}
      y={0.22}
      anchor="center"
      width={0.22}
      height={0.22}
      fill={interp(white, blue, 0.35)}
      stroke={blue}
      stroke-width={px(2)}
    />
    <Circle
      x={0.55}
      y={0.73}
      anchor="center"
      width={0.34}
      height={0.34}
      fill={interp(white, purple, 0.35)}
      stroke={purple}
      stroke-width={px(2)}
    />
    <Text x={0.2} y={0.7} anchor="center">
      A
    </Text>
    <Text x={0.6} y={0.22} anchor="center">
      B
    </Text>
    <Text x={0.55} y={0.73} anchor="center">
      C
    </Text>
  </Group>
</TitleFrame>
```

---

<a id="shape_cards"></a>

## Shape cards

Three cards are generated from data with a small functional JSX component. Each
card returns a **TextFrame** carrying its own outer flex props; its internal **TextCol** is
responsible only for arranging its symbol, title, and description.

The wrapping row receives its width from the host. Cards start with an 11em
basis and use `grow={1} shrink={1}` to share each row. Its stretch alignment
makes the cards on that row equally tall after their paragraphs have been
measured at the allocated widths. No fixed card height is necessary.

Each symbol lives in a padded **Box** with a fixed height and `align-self="center"`.
The box keeps its measured width and is centered in the column. The surrounding
**TextBox**, **TextFrame**, and **TextCol** components carry document width through
their content without repeating width declarations. Passing the symbol as an
**Element** value is normal immutable source composition.

Try adding another entry to the cards array or rendering with `gum -W 320`.
`HStack wrap` starts another row when the next card's basis would not fit.
Each row distributes its remaining width independently.

<a id="shape_cards-example"></a>

### Example

```jsx
// Data-driven cards use equal outer flex allocation and fixed-size centered symbols.
const Card = ({ title, note, color, symbol }) => (
  <TextFrame
    grow={1} shrink={1} basis={em(11)}
    padding={em(1)}
    border-radius={em(0.75)}
    border-color={gray}
    background={white}
  >
    <TextCol gap={em(0.5)}>
      <Box height={em(10)} padding={em(1)} align-self="center">{symbol}</Box>
      <Text font-size={em(1.5)} font-weight={bold} color={color}>{title}</Text>
      <Text line-height={em(1.4)}>{note}</Text>
    </TextCol>
  </TextFrame>
)
const penta = [ [0.5, 0], [1, 0.35], [0.8, 1], [0.2, 1], [0, 0.35]]
const cards = [
  {
    title: "Circle",
    color: blue,
    note: "A circular outline inside its allocated rectangle.",
    symbol: <Circle fill={blue} stroke={none} />,
  },
  {
    title: "Square",
    color: red,
    note: "A square silhouette with gently rounded corners.",
    symbol: <Square border-radius={em(0.75)} fill={red} stroke={none} />,
  },
  {
    title: "Polygon",
    color: green,
    note: "Explicit points joined into a closed, filled path.",
    symbol: <Polygon aspect={1} points={penta} fill={green} stroke={none} />,
  },
]
return <TextBox width="fill" padding={em(2)} background={lightgray} color={slate}>
  <TextCol gap={em(1)}>
    <Text font-family={mono} font-size={em(1)} color={blue}>COMPOSITION / 02</Text>
    <Text font-size={em(2)} font-weight={bold}>One component, three shapes</Text>
    <HStack wrap gap={em(1)} align="stretch">
      {cards.map((card) => (
        <Card {...card} />
      ))}
    </HStack>
  </TextCol>
</TextBox>
```

---

<a id="space_rose"></a>

## Space Rose

A glowing, weathered light-box sign floats in a seeded starfield, with a rose printed on its front face.

Traced sign geometry, a layered halo, petal curves, dust, scuffs, and glints create the light-box effect. Small circles use local positions and pixel dimensions. The rose is an explicitly sized rotated group, with shades blended from the shared palette. The texture is deterministic.

See [Rotate](../elements/layout.md#Rotate).

<a id="space_rose-example"></a>

### Example

```jsx
// Local point helpers retain tuple geometry for the traced sign.
const polarPair = (...args) => {
  const p = polar(...args)
  return [p.x, p.y]
}
const Disc = ({ pos, rad, ...props }) => (
  <Circle x={pos[0]} y={pos[1]} anchor="center" width={(2 * rad) / aspect} {...props} />
)
// vertices traced from the photo in its 1.18-aspect frame (sign bbox center ~[0.4415, 0.40]),
// remapped into a frame of aspect `aspect`: shape preserved, centered, scaled by `scale`
const aspect = 1.4
const scale = 1.2
const trace = ([x, y]) => [0.5 + scale * (1.18 / aspect) * (x - 0.4415), 0.5 + scale * (y - 0.4)]
const A = trace([0.168, 0.176]) // left face, top-left
const B = trace([0.276, 0.12]) // front face, top-left
const C = trace([0.715, 0.28]) // front face, top-right
const D = trace([0.715, 0.68]) // front face, bottom-right
const E = trace([0.276, 0.54]) // front face, bottom-left
const F = trace([0.168, 0.575]) // left face, bottom-left
const H = trace([0.623, 0.71]) // bottom face, back-right (D receded along E→F)
const hull = [A, B, C, D, H, F]

// bottom light band
const D1 = trace([0.715, 0.655])
const E1 = trace([0.276, 0.515])

// warm palette
const night = interp(black, slate, 0.342)
const cream = interp(white, yellow, 0.189) // front face
const cream2 = interp(white, yellow, 0.372) // end face
const cream3 = interp(white, yellow, 0.523) // bottom face
const glow = interp(white, yellow, 0.286) // pale warm white for the halo around the sign
const gold = interp(yellow, white, 0.379) // warmer accent for sparkle halos
const band = interp(white, yellow, 0.059)
const edge = interp(yellow, darkgray, 0.57)
// matte print inks: desaturated, pulled toward the cream of the face
const reds = [interp(green, red, 0.572), interp(red, green, 0.409), interp(purple, yellow, 0.423)] // petal layers, outer → inner
const outline = interp(red, slate, 0.745)
const stem = interp(green, purple, 0.225)
const leaf = interp(blue, yellow, 0.435)
const leafDark = interp(green, slate, 0.498)
const inkOpacity = 0.92 // let a touch of the face show through the print

const Face = (attr) => <Polygon stroke-linejoin="round" stroke-width={px(6)} {...attr} />

// seed the random stream so the texture is stable across renders
setSeed(2024)
const mix = (P, Q, t) => [P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]
const iso = (r) => [r / aspect, r] // radius vector that renders round inside the aspect-`aspect` group

// bilinear point on a quad with top edge P→Q and bottom edge S→R; (u, v) in [0, 1]²
const onQuad = (P, Q, R, S) => (u, v) => mix(mix(P, Q, u), mix(S, R, u), v)
const front = onQuad(B, C, D, E)
const side = onQuad(A, B, E, F)

// starfield: mostly faint pinpricks, a handful of brighter ones that get a cross flare
const stars = range(0, 170).map(() => {
  return {
    pos: [random(), random()],
    r: 0.0012 + 0.0032 * pow(random(), 3),
    o: uniform(0.3, 1),
    warm: random() < 0.3,
  }
})
const bright = stars.filter((s) => s.r > 0.004)

// sign imperfections: uneven backlight blotches, dust specks, faint scuffs
const blotches = range(0, 10).map(() => {
  return {
    pos: front(uniform(0.18, 0.82), uniform(0.22, 0.78)),
    r: uniform(0.04, 0.1),
    dark: random() < 0.6,
    o: uniform(0.12, 0.22),
  }
})
// soft-edged blotch: concentric low-opacity discs that add up toward the center
const Blotch = ({ pos, r, dark, o }) => (
  <Group>
    {[1, 0.75, 0.5, 0.25].map((k) => (
      <Disc
        pos={pos}
        rad={k * r}
        fill={dark ? interp(yellow, white, 0.589) : interp(white, yellow, 0.066)}
        opacity={o / 4}
        stroke={none}
      />
    ))}
  </Group>
)
const specks = range(0, 34).map(() => {
  return {
    pos: front(uniform(0.03, 0.97), uniform(0.03, 0.97)),
    r: uniform(0.0012, 0.003),
    o: uniform(0.25, 0.55),
  }
})
const sideSpecks = range(0, 8).map(() => {
  return {
    pos: side(uniform(0.1, 0.9), uniform(0.05, 0.95)),
    r: uniform(0.0012, 0.0025),
    o: uniform(0.3, 0.5),
  }
})
const scuffs = range(0, 7).map(() => {
  const p = front(uniform(0.1, 0.9), uniform(0.1, 0.9)),
    a = uniform(0, pi),
    L = uniform(0.015, 0.045)
  return [p, [p[0] + (L * cos(a)) / aspect, p[1] + L * sin(a)]]
})

// sparkles: glints along the lit edges and a few on the face
const sparkles = [
  { pos: mix(B, C, 0.42), r: 0.02 },
  { pos: C, r: 0.013 },
  { pos: mix(A, B, 0.55), r: 0.009 },
  { pos: mix(E1, D1, 0.72), r: 0.012 },
  { pos: front(0.8, 0.24), r: 0.009 },
  { pos: front(0.17, 0.74), r: 0.007 },
]
const Sparkle = ({ pos, r }) => (
  <Group>
    <Disc pos={pos} rad={1.6 * r} fill={gold} opacity={0.18} stroke={none} />
    <Disc pos={pos} rad={0.9 * r} fill={gold} opacity={0.25} stroke={none} />
    <Polygon
      points={lobes(pos, iso(r), iso(0.14 * r), 4, -90)}
      fill={white}
      stroke={interp(yellow, darkgray, 0.47)}
      stroke-width={px(0.6)}
      stroke-linejoin="round"
    />
    <Polygon
      points={lobes(pos, iso(0.5 * r), iso(0.14 * r), 4, -45)}
      fill={white}
      stroke={interp(yellow, darkgray, 0.47)}
      stroke-width={px(0.5)}
      stroke-linejoin="round"
      opacity={0.85}
    />
  </Group>
)

// flat illustrated rose: a small bud of nested lobed petal layers on a long stem
// lobed petal ring: alternate outer/inner radii around a center
const lobes = (c, ro, ri, n, phase) =>
  range(0, 2 * n).map((i) => polarPair(d2r * (phase + (180 * i) / n), i % 2 == 0 ? ro : ri, c))
// scale a point about a center c by factor k
const scaleAbout =
  (c, k) =>
  ([x, y]) => [c[0] + k * (x - c[0]), c[1] + k * (y - c[1])]

// content spans y in [0.13, 0.87] so the rose is centered in its own group
const bud = [0.5, 0.27]
const bloom = scaleAbout(bud, 1.1) // bud 10% bigger, about its center
const petals = [
  lobes(bud, 0.14, 0.115, 5, -90),
  lobes([0.505, 0.265], 0.1, 0.082, 4, -60),
  lobes([0.51, 0.26], 0.062, 0.052, 3, -30),
].map((p) => p.map(bloom))
const swirl = linspace(0, 1, 30)
  .map((t) => polarPair(2 * pi * 1.5 * t, 0.004 + 0.036 * t, [0.512, 0.258]))
  .map(bloom)
// leaf tips sit exactly on stem control points so they're guaranteed to touch the stem
const stemPts = [
  [0.5, 0.4],
  [0.52, 0.53],
  [0.5, 0.62],
  [0.48, 0.73],
  [0.5, 0.87],
]
// leaves 10% smaller, scaled about their tip so they stay attached to the stem
const shrink = (l) => {
  const s = scaleAbout(l.pts[0], 0.9)
  return { pts: l.pts.map(s), vein: l.vein.map(s) }
}
const leaves = [
  {
    pts: [
      [0.5, 0.62],
      [0.41, 0.55],
      [0.28, 0.59],
      [0.37, 0.69],
    ],
    vein: [
      [0.5, 0.62],
      [0.28, 0.59],
    ],
  },
  {
    pts: [
      [0.48, 0.73],
      [0.57, 0.66],
      [0.7, 0.7],
      [0.61, 0.8],
    ],
    vein: [
      [0.48, 0.73],
      [0.7, 0.7],
    ],
  },
].map(shrink)
const thorns = [
  [
    [0.512, 0.47],
    [0.552, 0.44],
    [0.517, 0.5],
  ],
  [
    [0.49, 0.8],
    [0.45, 0.78],
    [0.488, 0.83],
  ],
]
const Rose = (attr) => (
  <Group aspect={1} {...attr}>
    <Spline
      points={stemPts}
      fill={none}
      stroke={stem}
      stroke-width={px(5)}
      stroke-linecap="round"
    />
    {thorns.map((t) => (
      <Polygon points={t} fill={stem} stroke={none} />
    ))}
    {leaves.map((l) => (
      <Group>
        <Spline points={l.pts} closed fill={leaf} stroke={leafDark} stroke-width={px(1.5)} />
        <Polyline points={l.vein} stroke={leafDark} stroke-width={px(1)} />
      </Group>
    ))}
    {petals.map((p, i) => (
      <Spline
        points={p}
        closed
        fill={reds[i]}
        stroke={outline}
        stroke-width={px(1.5)}
        stroke-linejoin="round"
      />
    ))}
    <Spline
      points={swirl}
      fill={none}
      stroke={outline}
      stroke-width={px(1.5)}
      stroke-linecap="round"
    />
  </Group>
)

return (
  <Box padding={em(1.25)}>
    <Frame border-radius={em(0.75)} clip border-color={interp(black, white, 0.133)}>
      <Group aspect={aspect}>
        {/* night */}
        <Rect fill={night} />

        {/* starfield (drawn under the glow so stars near the sign get washed out) */}
        {stars.map((s) => (
          <Disc
            pos={s.pos}
            rad={s.r}
            fill={s.warm ? interp(white, yellow, 0.236) : interp(white, blue, 0.113)}
            opacity={s.o}
            stroke={none}
          />
        ))}
        {bright.map((s) => (
          <Group>
            <Polyline
              points={[
                [s.pos[0] - (3.5 * s.r) / aspect, s.pos[1]],
                [s.pos[0] + (3.5 * s.r) / aspect, s.pos[1]],
              ]}
              stroke={white}
              stroke-width={px(0.7)}
              opacity={0.5 * s.o}
            />
            <Polyline
              points={[
                [s.pos[0], s.pos[1] - 3.5 * s.r],
                [s.pos[0], s.pos[1] + 3.5 * s.r],
              ]}
              stroke={white}
              stroke-width={px(0.7)}
              opacity={0.5 * s.o}
            />
          </Group>
        ))}

        {/* glow: many soft strokes around the box silhouette; widths grow quadratically so rings
      are dense near the edge and sparse far out, and outer rings are fainter → long gentle tail */}
        {linspace(0, 1, 36, true).map((t) => (
          <Polygon
            points={hull}
            fill={none}
            stroke={glow}
            stroke-width={px(10 + 420 * t * t)}
            stroke-linejoin="round"
            opacity={0.016 * (1 - 0.6 * t)}
          />
        ))}

        {/* light box: bottom, left end, then front */}
        <Face points={[E, D, H, F]} fill={cream3} stroke={cream3} />
        <Face points={[A, B, E, F]} fill={cream2} stroke={cream2} />
        <Face points={[B, C, D, E]} fill={cream} stroke={cream} />
        <Polygon points={[E, D, D1, E1]} fill={band} opacity={0.55} stroke={none} />
        <Polyline
          points={[A, B, C]}
          stroke={band}
          stroke-width={px(3)}
          opacity={0.85}
          stroke-linejoin="round"
        />
        <Polyline points={[B, E]} stroke={edge} stroke-width={px(2)} opacity={0.6} />
        <Polyline
          points={[F, E, D]}
          stroke={edge}
          stroke-width={px(2)}
          opacity={0.6}
          stroke-linejoin="round"
        />

        {/* rose: printed on the face, so every imperfection below sits on top of it */}
        <Rotate x={trace([0.5, 0.41])[0]} y={trace([0.5, 0.41])[1]} anchor="center" angle={-15}>
          <Rose
            width={(scale * 0.44) / aspect}
            aspect={1}
            opacity={inkOpacity}
          />
        </Rotate>

        {/* texture over the print: uneven backlight, dust, scuffs, glints */}
        {blotches.map((b) => (
          <Blotch pos={b.pos} r={b.r} dark={b.dark} o={b.o} />
        ))}
        {specks.map((s) => (
          <Disc
            pos={s.pos}
            rad={s.r}
            fill={interp(green, red, 0.412)}
            opacity={s.o}
            stroke={none}
          />
        ))}
        {sideSpecks.map((s) => (
          <Disc
            pos={s.pos}
            rad={s.r}
            fill={interp(green, red, 0.412)}
            opacity={s.o}
            stroke={none}
          />
        ))}
        {scuffs.map((p) => (
          <Polyline
            points={p}
            stroke={interp(white, yellow, 0.551)}
            stroke-width={px(1)}
            opacity={0.6}
            stroke-linecap="round"
          />
        ))}
        {sparkles.map((s) => (
          <Sparkle pos={s.pos} r={s.r} />
        ))}
      </Group>
    </Frame>
  </Box>
)
```

---

<a id="spline_star"></a>

## Spline Star

Alternating inner and outer vertices form a rounded five-point star.

The coordinate system belongs to Graph rather than the spline. The `tension` prop controls Catmull–Rom tangents. Polar helpers return point objects, which Spline accepts directly.

See [Spline](../elements/geometry.md#Spline).

<a id="spline_star-example"></a>

### Example

```jsx
// Alternating inner and outer vertices form a rounded five-point star.
const n = 5
const innerRadius = 0.7
const points = range(2 * n).map((i) => polar(-pi / 2 + (i * pi) / n, i % 2 ? innerRadius : 1))
return <Box padding={em(1.5)}>
  <Frame padding={em(3)} border-radius={em(1)} background={gray} border-color={lightgray}>
    <Graph aspect={1} xlim={[-1, 1]} ylim={[-1, 1]} flip-y={false}>
      <Spline
        points={points}
        closed
        tension={0.6}
        fill={blue}
        stroke={slate}
        stroke-width={px(2)}
      />
    </Graph>
  </Frame>
</Box>
```
