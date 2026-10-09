# Plotting gallery

<a id="atomic_orbitals"></a>

## Atomic Orbitals

Six stylized angular profiles show s, p, and d lobes with separate positive and
negative phases.

Each [SymPoly](../elements/plotting.md#SymPoly) samples `{theta, r}` from its
angular radius function. The graphs share one `polar_projection()` to convert
those records to Cartesian drawing coordinates. Phase intervals split the lobes
for blue/red styling. The origin marker also uses polar coordinates, while
[HLine](../elements/geometry.md#HLine) and [VLine](../elements/geometry.md#VLine)
draw crosshairs in the local frame. See [Projections](../guides/projections.md).

These are schematic 2D angular profiles, not probability-density plots or full
3D orbital surfaces. The pz profile is shown diagonally, and the py phase
intervals meet at its angular zero crossings. The 1 / 3 / 2 groups use wrapping
rows, preserving that arrangement when space permits and adding rows on narrower
hosts.

<a id="atomic_orbitals-example"></a>

### Example

```jsx
// Stylized angular orbital profiles, with positive and negative phases colored separately.
const projection = polar_projection()
const zero = atan(sqrt(2))
const Lobe = ({ radius, start, end, positive }) => (
  <SymPoly
    f={theta => ({theta, r: radius(theta)})}
    tlim={[start, end]}
    samples={121}
    stroke={positive ? blue : red}
    fill={interp(white, positive ? blue : red, 0.28)}
    stroke-width={px(2)}
  />
)
const profiles = [
  { label: "1s", radius: () => 0.375, pieces: [[0, tau, true]] },
  {
    label: "2p_x",
    radius: (t) => 0.5 * abs(cos(t)),
    pieces: [
      [-pi / 2, pi / 2, true],
      [pi / 2, (3 * pi) / 2, false],
    ],
  },
  {
    label: "2p_y",
    radius: (t) => 0.5 * abs(sin(t)),
    pieces: [
      [0, pi, true],
      [pi, tau, false],
    ],
  },
  {
    label: "2p_z",
    radius: (t) => 0.5 * abs(cos(t - pi / 4)),
    pieces: [
      [-pi / 4, (3 * pi) / 4, true],
      [(3 * pi) / 4, (7 * pi) / 4, false],
    ],
  },
  {
    label: "3d_{xy}",
    radius: (t) => 0.48 * abs(sin(2 * t)),
    pieces: range(4).map((i) => [(i * pi) / 2, ((i + 1) * pi) / 2, i % 2 === 0]),
  },
  {
    label: "3d_{z^2}",
    radius: (t) => 0.28 * abs(3 * cos(t) ** 2 - 1),
    pieces: [
      [-zero, zero, true],
      [pi - zero, pi + zero, true],
      [zero, pi - zero, false],
      [pi + zero, tau - zero, false],
    ],
  },
]
const Cell = ({ profile }) => (
  <VStack gap={em(0.5)} align="center">
    <Frame border-radius={em(1)} background={lightgray} border-color={darkgray}>
      <Graph
        width={em(7)} aspect={1}
        xlim={[-0.8, 0.8]} ylim={[-0.8, 0.8]}
        projection={projection}
      >
        <HLine space="local"
          stroke={darkgray}
          stroke-dasharray={[px(4), px(4)]}
        />
        <VLine space="local"
          stroke={darkgray}
          stroke-dasharray={[px(4), px(4)]}
        />
        {profile.pieces.map(([start, end, positive]) => (
          <Lobe radius={profile.radius} start={start} end={end} positive={positive} />
        ))}
        <Points points={[{theta: 0, r: 0}]} point-size={em(0.5)} fill={slate} />
      </Graph>
    </Frame>
    <Tex font-size={em(1.2)}>{profile.label}</Tex>
  </VStack>
)
return <Box font-size={px(20)} padding={em(1)}>
  <TitleFrame title="Atomic Orbitals" title-font-size={em(1.25)} padding={em(2)} border-radius={em(1)}>
    <VStack gap={em(2)} align="center">
      {[[0], [1, 2, 3], [4, 5]].map((row) => (
        <HStack wrap width="fill" gap={em(2)} justify="center">
          {row.map((index) => (
            <Cell profile={profiles[index]} />
          ))}
        </HStack>
      ))}
    </VStack>
  </TitleFrame>
</Box>
```

---

<a id="axis_arrows"></a>

## Axes with Arrows

A logarithmic curve with arrowheads on both directed axes. Plot measures the ticks,
labels, baselines, and curved heads together.

`axis-arrow` enables both heads. `axis-arrow-size` and `axis-arrow-curve` are
forwarded to each generated axis; use the corresponding `xaxis-` or `yaxis-`
scope to customize one axis.

See [Axis](../elements/plotting.md#Axis).

<a id="axis_arrows-example"></a>

### Example

```jsx
// Directed plot axes with curved arrowheads and a logarithmic curve.
<Plot
  font-size={px(14)}
  title="Axes with arrows"
  xlim={[1, 5]}
  ylim={[0, 2]}
  xticks={[1, 2, 3, 4]}
  yticks={[0, 0.5, 1, 1.5]}
  grid
  axis-arrow
  axis-arrow-open
  axis-arrow-curve={0.4}
  margin={em(2)}
>
  <SymLine fy={log} xlim={[1, 5]} stroke={blue} stroke-width={px(2)} />
</Plot>
```

---

<a id="complex_plot"></a>

## Complex Roots

The real and imaginary components of the roots of x² + 2cx + 1 are plotted horizontally against the parameter c.

The real branches are sampled separately outside |c| = 1, and the imaginary components inside it, keeping each curve within its domain. Upright math and text annotations use data positions and pixel font sizes.

See [SymLine](../elements/plotting.md#SymLine).

<a id="complex_plot-example"></a>

### Example

```jsx
// Real and imaginary components of the roots of x² + 2cx + 1.
const Curve = ({ fx, ylim, color }) => (
  <SymLine fx={fx} ylim={ylim} samples={301} stroke={color} stroke-width={px(2.5)} />
)
return <Plot
  aspect={1.7}
  xlim={[-4, 4]}
  ylim={[-2, 2]}
  grid
  font-size={em(0.9)}
  margin={em(1.4)}
  xlabel={<Tex font-size={em(1.25)}>x=a+bi</Tex>}
  ylabel={<Tex font-size={em(1.25)}>c</Tex>}
  xticks={range(-4, 5)}
  yticks={linspace(-2, 2, 9)}
>
  <Polyline
    points={[
      [-4, 0],
      [4, 0],
    ]}
    stroke={darkgray}
  />
  <Polyline
    points={[
      [0, -2],
      [0, 2],
    ]}
    stroke={darkgray}
  />
  {[
    [-2, -1],
    [1, 2],
  ].map((lim) => (
    <>
      <Curve fx={(c) => -c + sqrt(maximum(0, c * c - 1))} ylim={lim} color={blue} />
      <Curve fx={(c) => -c - sqrt(maximum(0, c * c - 1))} ylim={lim} color={blue} />
    </>
  ))}
  <Curve fx={(c) => sqrt(maximum(0, 1 - c * c))} ylim={[-1, 1]} color={red} />
  <Curve fx={(c) => -sqrt(maximum(0, 1 - c * c))} ylim={[-1, 1]} color={red} />
  <Points
    points={[
      [-1, 1],
      [1, -1],
    ]}
    point-size={px(8)}
    fill={blue}
  />
  <Points
    points={[
      [0, -1],
      [0, 1],
    ]}
    point-size={px(8)}
    fill={red}
  />
  <Points points={[[0, 0]]} point-size={px(7)} fill={slate} />
  <Text pos={[-2.6, 1.1]} anchor="center" color={blue} font-size={em(1.3)}>
    real
  </Text>
  <Text pos={[1.6, -0.4]} anchor="center" color={red} font-size={em(1.3)}>
    imag
  </Text>
  <Tex pos={[2.1, 1.6]} anchor="center" font-size={em(1.4)}>
    f(x)=x^2+2cx+1
  </Tex>
</Plot>
```

---

<a id="flux_capacitance"></a>

## Flux Capacitance

A translucent band fills the space between sine and cosine over a full period. The title is playful; the curves are a plotting demonstration.

SymFill uses `upper` and `lower` to define the band's boundaries. All three sampled marks declare the same domain explicitly.

See [SymFill](../elements/plotting.md#SymFill).

<a id="flux_capacitance-example"></a>

### Example

```jsx
// A translucent band between sine and cosine over one complete period.
<Plot
  title="Flux Capacitance"
  xlabel="Phase (radians)"
  ylabel="Interference"
  xlim={[0, tau]}
  ylim={[-1.5, 1.5]}
  margin={em(1.25)}
>
  <SymFill upper={sin} lower={cos} xlim={[0, tau]} fill={blue} stroke={none} opacity={0.22} />
  <SymLine fy={sin} xlim={[0, tau]} stroke={blue} stroke-width={px(2.5)} />
  <SymLine fy={cos} xlim={[0, tau]} stroke={purple} stroke-width={px(2.5)} />
</Plot>
```

---

<a id="graph_scatter"></a>

## A reversed data axis

Directed limits reverse x while annotations and custom markers remain upright.

See [Graph](../elements/plotting.md#Graph) for options.

<a id="graph_scatter-example"></a>

### Example

```jsx
// Directed limits reverse x while annotations and custom markers remain upright.
const samples = [
  [1, 2],
  [3, 4],
  [6, 3],
  [8, 7],
]
return (
  <Box padding={em(3)}>
    <Graph xlim={[10, 0]} ylim={[0, 8]}>
      <Mesh2D xlim={[0, 10]} ylim={[0, 8]} />
      <Spline points={samples} stroke={blue} stroke-width={px(2)} />
      <Points
        points={samples}
        point-size={(p, i) => px(8 + i * 2)}
        shape={<Square fill={blue} stroke={white} stroke-width={px(1)} />}
      />
      <Text pos={[8, 7.25]} anchor={['center', 'end']} font-size={em(0.9)} color={blue}>Peak</Text>
      <HAxis lim={[10, 0]} />
      <VAxis lim={[0, 8]} />
    </Graph>
  </Box>
)
```

---

<a id="industry_sankey"></a>

## Where U.S. GDP Was Produced

A Sankey-style chart divides 2024 U.S. GDP into private goods-producing
industries, private services-producing industries, and government, then into
their industry groups. Ribbon thickness represents each group's share of
current-dollar GDP. The ribbons show a breakdown of the total, rather than
transactions between industries.

The shares come from [Table 9 of the U.S. Bureau of Economic Analysis's April
2025 *Survey of Current Business*](https://apps.bea.gov/scb/issues/2025/04-april/pdf/0425-gdp-economy.pdf).
Figures are rounded to one decimal place. “Other private services” combines
the service categories that are not labeled separately.

The JSX checks that child shares add up to each major group and that the three
groups total 100%. It derives node heights and vertical positions from those
shares, then draws the ribbons with curved [Path](../elements/geometry.md#Path)
commands inside a positioned [Group](../elements/layout.md#Group). Rectangles
mark each column; text labels and percentages sit beside the industry nodes.
The page has a fixed width, while its height follows the chart content.

[View the source](plotting.md#industry_sankey-example).

<a id="industry_sankey-example"></a>

### Example

```jsx
// U.S. GDP by industry, annual 2024. Shares of current-dollar GDP (%).
// Source: BEA, Survey of Current Business, April 2025, Table 9.
// https://apps.bea.gov/scb/issues/2025/04-april/pdf/0425-gdp-economy.pdf

// The page width is an output choice. The figure's height comes from its content.
const pageWidth = 1600;
const pageInset = 82;
const chartWidth = pageWidth - 2 * pageInset;
const scale = 6.35;
const nodeW = 20;
const groupGap = 36;
const leafGap = 16;
const labelGutter = 92;
const rightLabelArea = 344;
const ribbonRun = (chartWidth - labelGutter - rightLabelArea - 3 * nodeW) / 2;
const rootX = labelGutter;
const groupX = rootX + nodeW + ribbonRun;
const leafX = groupX + nodeW + ribbonRun;
const chartHeadroom = 46;

const palette = {
  paper: '#F8FAF9',
  navy: '#172638',
  muted: '#617080',
  rule: '#D9E1E3',
  goods: '#C97C3B',
  services: '#238B9B',
  government: '#866BB7',
};

const groups = [
  {
    name: 'Private goods', share: 16.7, color: palette.goods,
    children: [
      { name: 'Manufacturing', share: 10.0 },
      { name: 'Construction', share: 4.5 },
      { name: 'Agriculture + mining', share: 2.2 },
    ],
  },
  {
    name: 'Private services', share: 72.0, color: palette.services,
    children: [
      { name: 'Finance, insurance, real estate + rental', lines: ['Finance, insurance,', 'real estate + rental'], share: 21.2 },
      { name: 'Professional + business services', lines: ['Professional + business', 'services'], share: 13.2 },
      { name: 'Other private services*', share: 11.4 },
      { name: 'Education + health care', share: 8.7 },
      { name: 'Retail trade', share: 6.3 },
      { name: 'Wholesale trade', share: 5.8 },
      { name: 'Information', share: 5.4 },
    ],
  },
  {
    name: 'Government', share: 11.3, color: palette.government,
    children: [
      { name: 'State + local', share: 7.7 },
      { name: 'Federal', share: 3.6 },
    ],
  },
];

const sum = xs => xs.reduce((a, b) => a + b, 0);
const totalShare = sum(groups.map(g => g.share));
if (Math.abs(totalShare - 100) > 1e-9 ||
    groups.some(g => Math.abs(sum(g.children.map(c => c.share)) - g.share) > 1e-9)) {
  throw new Error('Shares must balance to 100%.');
}

// Vertical positions follow ribbon thicknesses and the gaps between siblings.
// Each column is centered against the widest (industry) column.
const totalLeaves = sum(groups.map(g => g.children.length));
const rootSpan = totalShare * scale;
const groupSpan = rootSpan + (groups.length - 1) * groupGap;
const leafSpan = rootSpan + (totalLeaves - groups.length) * leafGap + (groups.length - 1) * groupGap;
const chartHeight = chartHeadroom + leafSpan + 16;
const leafTop = chartHeadroom;
const groupTop = leafTop + (leafSpan - groupSpan) / 2;
const rootTop = leafTop + (leafSpan - rootSpan) / 2;

let rootCursor = rootTop;
let groupCursor = groupTop;
let leafCursor = leafTop;
const groupFlows = [];
const leafFlows = [];
const groupNodes = [];
const leafNodes = [];

groups.forEach((group, gi) => {
  const gh = group.share * scale;
  groupFlows.push({
    sourceTop: rootCursor, targetTop: groupCursor,
    height: gh, color: group.color,
  });
  groupNodes.push({ ...group, top: groupCursor, height: gh });

  let groupOutputCursor = groupCursor;
  group.children.forEach((child, ci) => {
    const h = child.share * scale;
    leafFlows.push({
      sourceTop: groupOutputCursor, targetTop: leafCursor,
      height: h, color: group.color,
    });
    leafNodes.push({ ...child, top: leafCursor, height: h, color: group.color });
    groupOutputCursor += h;
    leafCursor += h + (ci === group.children.length - 1 ? 0 : leafGap);
  });

  rootCursor += gh;
  groupCursor += gh + (gi === groups.length - 1 ? 0 : groupGap);
  leafCursor += gi === groups.length - 1 ? 0 : groupGap;
});

function Ribbon({ x0, x1, sourceTop, targetTop, height, color }) {
  const top = Math.min(sourceTop, targetTop);
  const bottom = Math.max(sourceTop, targetTop) + height;
  const hh = bottom - top;
  const sy = (sourceTop - top) / hh;
  const ty = (targetTop - top) / hh;
  const sh = height / hh;
  return (
    <Path
      pos={[px(x0), px(top)]} anchor="start" width={px(x1 - x0)} height={px(hh)}
      commands={[
        move_to(0, sy),
        curve_to(0.42, sy, 0.58, ty, 1, ty),
        line_to(1, ty + sh),
        curve_to(0.58, ty + sh, 0.42, sy + sh, 0, sy + sh),
        close_path(),
      ]}
      fill={color} opacity={0.34} stroke={none}
    />
  );
}

function PlotLabel({ x, y, text, size = 20, weight = 400, color = palette.navy, anchor = 'start', width }) {
  return (
    <Text
      pos={[px(x), px(y)]} anchor={[anchor, 'center']}
      width={width === undefined ? undefined : px(width)}
      font-size={px(size)} font-weight={weight} color={color}
    >{text}</Text>
  );
}

return (
  <Page width={px(pageWidth)} background={palette.paper} font-family={sans} font-size={px(20)}>
    <Box width={1} padding={[em(2), em(1.9), px(pageInset), px(pageInset)]}>
      <VStack width="fill" gap={em(1.2)} align="stretch">
      <VStack gap={em(0.4)}>
        <Text font-size={em(0.9)} font-weight={700} color={palette.services}>U.S. ECONOMY  /  2024</Text>
        <Text font-size={em(2.45)} font-weight={700} color={palette.navy}>Where U.S. GDP was produced</Text>
        <Text font-size={em(1.15)} color={palette.muted}>Industry value added as a share of current-dollar GDP</Text>
      </VStack>

      <Rect width="fill" height={px(2)} fill={palette.rule} stroke={none} />

      <Group width={px(chartWidth)} height={px(chartHeight)}>
        <PlotLabel x={rootX} y={16} text="TOTAL GDP" size={17} weight={700} color={palette.muted} />
        <PlotLabel x={groupX} y={16} text="MAJOR GROUP" size={17} weight={700} color={palette.muted} />
        <PlotLabel x={leafX} y={16} text="INDUSTRIES" size={17} weight={700} color={palette.muted} />

        {groupFlows.map((f, i) => <Ribbon key={`g${i}`} x0={rootX + nodeW} x1={groupX} {...f} />)}
        {leafFlows.map((f, i) => <Ribbon key={`l${i}`} x0={groupX + nodeW} x1={leafX} {...f} />)}

        <Rect pos={[px(rootX), px(rootTop)]} anchor="start" width={px(nodeW)} height={px(rootSpan)} fill={palette.navy} stroke={none} border-radius={px(3)} />
        {groupNodes.map((g, i) => (
          <Rect key={`gn${i}`} pos={[px(groupX), px(g.top)]} anchor="start" width={px(nodeW)} height={px(g.height)} fill={g.color} stroke={none} border-radius={px(3)} />
        ))}
        {leafNodes.map((d, i) => (
          <Rect key={`ln${i}`} pos={[px(leafX), px(d.top)]} anchor="start" width={px(nodeW)} height={px(d.height)} fill={d.color} stroke={none} border-radius={px(3)} />
        ))}

        <PlotLabel x={rootX - 21} y={rootTop + rootSpan / 2} text="100%" size={30} weight={700} anchor="end" />
        {groupNodes.map((g, i) => (
          <VStack
            key={`glabel${i}`}
            pos={[px(groupX + nodeW + 25), px(g.top + g.height / 2)]}
            anchor={['start', 'center']} gap={em(0.2)}
          >
            <Text font-size={px(22)} font-weight={700} color={palette.navy}>{g.name}</Text>
            <Text font-size={px(19)} font-weight={600} color={g.color}>{g.share.toFixed(1)}%</Text>
          </VStack>
        ))}
        {leafNodes.flatMap((d, i) => [
          <VStack
            key={`lname${i}`}
            pos={[px(leafX + nodeW + 22), px(d.top + d.height / 2)]}
            anchor={['start', 'center']} gap={0}
          >
            {(d.lines || [d.name]).map((line, j) => (
              <Text key={`line${j}`} font-size={px(19)} color={palette.navy}>{line}</Text>
            ))}
          </VStack>,
          <PlotLabel key={`lshare${i}`} x={chartWidth - 7} y={d.top + d.height / 2} text={`${d.share.toFixed(1)}%`} size={19} weight={700} color={d.color} anchor="end" />,
        ])}
      </Group>

      <Rect width="fill" height={px(2)} fill={palette.rule} stroke={none} />
      <VStack gap={em(0.55)}>
        <Text font-size={em(0.8)} color={palette.muted}>* Other private services is a residual that includes transportation, utilities, arts, hospitality, and other services.</Text>
        <Text font-size={em(0.8)} color={palette.muted}>Source: U.S. Bureau of Economic Analysis, Survey of Current Business (April 2025), Table 9. Figures rounded to 0.1 percentage point.</Text>
      </VStack>
      </VStack>
    </Box>
  </Page>
);
```

---

<a id="log_projection"></a>

## Logarithmic projection

`log_projection()` maps both data coordinates with base-10 logarithms. The
[Graph](../elements/plotting.md#Graph) limits `[0, 3]` therefore cover values
from `1` to `1000`. Use `log_projection({axes: 'x'})` or
`log_projection({axes: 'y'})` for a semilog view, and `base` to choose another base.

[SymLine](../elements/plotting.md#SymLine) supplies the original data values.
Sampling `10 ** t` spreads points evenly across decades. The curves `y = x`
and `y = sqrt(x)` become straight lines with slopes `1` and `0.5`; the markers
show the decade values.

Axes and meshes use projected coordinates directly. The example explicitly
pairs `log10(value)` positions with the original values as labels. Minor grid
lines mark values `2` through `9` in each decade. The projection does not
generate ticks or format labels.

Zero or negative values on a logged axis project to `null`, omitting markers
and breaking curves. Stroke widths, marker sizes, and text stay in layout units.
See [Projections](../guides/projections.md) for the full helper options
and coordinate contract.

<a id="log_projection-example"></a>

### Example

```jsx
// Logarithmic data shares a graph with axes and grids in projected coordinates.
const decades = [1, 10, 100, 1000]
const ticks = decades.map(value => [log10(value), String(value)])
const minor = [0, 1, 2].flatMap(power => range(2, 10).map(value => power + log10(value)))

return (
  <TextBox width={em(30)} font-size={px(20)} padding={em(2)} background={white}>
    <TextCol gap={em(0.8)}>
      <Text font-size={em(1.5)} font-weight={bold}>Equal ratios, equal spacing</Text>
      <Text font-size={em(0.8)} color={slate}>
        Each decade has the same width and height in a log–log view.
      </Text>
      <Box padding={[em(0.7), em(1.6), em(2.4), em(1.4)]}>
        <Graph
          aspect={1}
          xlim={[0, 3]} ylim={[0, 3]}
          projection={log_projection()}
        >
          <HMesh lim={[0, 3]} ticks={minor} stroke={lightgray} />
          <VMesh lim={[0, 3]} ticks={minor} stroke={lightgray} />
          <HMesh lim={[0, 3]} ticks={ticks} stroke={gray} />
          <VMesh lim={[0, 3]} ticks={ticks} stroke={gray} />
          <SymLine
            f={t => ({x: 10 ** t, y: 10 ** t})}
            tlim={[0, 3]} samples={61}
            stroke={blue} stroke-width={em(0.14)}
          />
          <SymLine
            f={t => ({x: 10 ** t, y: 10 ** (t / 2)})}
            tlim={[0, 3]} samples={61}
            stroke={purple} stroke-width={em(0.14)}
          />
          <Points
            points={decades.map(x => ({x, y: x}))}
            point-size={em(0.35)} fill={blue}
          />
          <Points
            points={decades.map(x => ({x, y: sqrt(x)}))}
            point-size={em(0.35)} fill={purple}
          />
          <HAxis lim={[0, 3]} ticks={ticks} label-font-size={em(0.75)} />
          <VAxis lim={[0, 3]} ticks={ticks} label-font-size={em(0.75)} />
        </Graph>
      </Box>
      <HStack gap={em(3)} align-self="center">
        <Latex color={blue}>y = x</Latex>
        <Latex color={purple}>{String.raw`y = \sqrt{x}`}</Latex>
      </HStack>
      <Text font-size={em(0.75)} color={slate}>
        Data stays in its original units. Axis positions use logarithms; labels are supplied explicitly.
      </Text>
    </TextCol>
  </TextBox>
)
```

---

<a id="particle_box"></a>

## Particle in a Box

A monochrome infinite-square-well illustration.
Four sinusoidal wavefunctions sit between hatched walls, with matching state
and energy labels. The vertical offsets are for comparison, not an energy scale.

`baseline(index)` supplies the same offset to the curve, guide, and labels.
[SymLine](../elements/plotting.md#SymLine) samples each sine curve over the well;
241 samples provide smooth traces without interpolating a separate spline.
[Polyline](../elements/geometry.md#Polyline) draws the diagonal hatching in data
coordinates, as well as the well walls and baselines. **Line**, **HLine**, and
**VLine** also use ambient data coordinates; `space="local"` opts out.

[Plot](../elements/plotting.md#Plot) measures the math tick labels and reserves
their space. Explicit x limits include room for the side annotations, while the
y axis and grid are disabled. The title, plot, and final formula use a centered
stack with an explicit plot height; text keeps its specified font size.

[View the source](plotting.md#particle_box-example).

<a id="particle_box-example"></a>

### Example

```jsx
// Four wavefunctions in an infinite square well, vertically offset for comparison.
const levels = [1, 2, 3, 4]
const amplitude = 0.75
const spacing = 2.5
const ymin = -0.5
const ymax = levels.length * spacing + 0.5
const baseline = index => (index + 0.5) * spacing
const ticks = [
  [0, <Tex>0</Tex>],
  [0.5, <Tex>L/2</Tex>],
  [1, <Tex>L</Tex>],
]

return (
  <Box color={black} padding={em(1.45)} background={white}>
    <VStack gap={em(0.95)} align="center">
      <Text font-size={em(1.5)} font-weight={bold}>Particle in a Box</Text>
      <Plot
        aspect={1.55}
        xlim={[-0.45, 1.45]} ylim={[ymin, ymax]}
        xticks={ticks} yaxis={false} grid={false}
        margin={em(0.65)} xaxis-font-size={em(1.2)}
        xaxis-stroke={black} xaxis-stroke-width={px(2.5)}
        xaxis-tick-side="outer" xaxis-label-color={black}
      >
        {linspace(ymin, ymax - 0.5, 24).map(y => (
          <Polyline
            points={[[-0.065, y], [0, y + 0.5]]}
            stroke={black} stroke-width={px(0.7)}
          />
        ))}
        {linspace(ymin, ymax - 0.5, 24).map(y => (
          <Polyline
            points={[[1, y], [1.065, y + 0.5]]}
            stroke={black} stroke-width={px(0.7)}
          />
        ))}
        <Polyline points={[[0, ymin], [0, ymax]]} stroke={black} stroke-width={px(2.5)} />
        <Polyline points={[[1, ymin], [1, ymax]]} stroke={black} stroke-width={px(2.5)} />
        {levels.map((n, index) => (
          <>
            <Polyline
              points={[[0, baseline(index)], [1, baseline(index)]]}
              stroke={black} opacity={0.25} stroke-width={px(1)}
            />
            <SymLine
              fy={x => baseline(index) + amplitude * sin(n * pi * x)}
              xlim={[0, 1]} samples={241}
              stroke={black} stroke-width={px(2.5)}
            />
            <Tex pos={[-0.25, baseline(index)]} anchor="center" font-size={em(1.3)} color={black}>
              {`n=${n}`}
            </Tex>
            <Tex pos={[1.23, baseline(index)]} anchor="center" font-size={em(1.3)} color={black}>
              {`E_{${n}}`}
            </Tex>
          </>
        ))}
      </Plot>
      <Latex font-size={em(1.4)}>
        {String.raw`\psi_n(x)=\sqrt{\frac{2}{L}}\sin\!\left(\frac{n\pi x}{L}\right)`}
      </Latex>
    </VStack>
  </Box>
)
```

---

<a id="plot_bars"></a>

## Regional changes

Categorical ticks, positive and negative bars, and functional bar colors.

See [BarPlot](../elements/plotting.md#BarPlot) for options.

<a id="plot_bars-example"></a>

### Example

```jsx
// Categorical ticks, positive and negative bars, and functional bar colors.
<BarPlot
  font-size={em(1)}
  values={[28, 43, -17, 56, 34]}
  title="Change by region"
  xlabel="Region"
  ylabel="Change (%)"
  ylim={[-20, 60]}
  padding={0.025}
  bar-width={0.7}
  xticks={enumerate(["North", "East", "Central", "South", "West"])}
  xaxis-label-font-size={em(0.8)}
  styles={(value) => ({
    fill: value < 0 ? red : blue,
    border_radius: value < 0 ? {'b': em(0.25)} : {'t': em(0.25)},
  })}
>
  <Polyline points={[[-0.5, 0], [4.5, 0]]} stroke={darkgray} />
</BarPlot>
```

---

<a id="plot_manual"></a>

## Manual Plot

A sine plot assembled from a Graph, Mesh2D, HAxis, and VAxis, rather than the higher-level Plot component.

The graph supplies data mapping. Each axis and mesh declares its tick domain; outside padding reserves space for their labels. Axis placement uses `side`.

See [Graph](../elements/plotting.md#Graph).

<a id="plot_manual-example"></a>

### Example

```jsx
// A sine plot assembled directly from Graph, a mesh, and two axes.
const xlim = [0, tau]; const ylim = [-1, 1]
const xticks = 5; const yticks = 5
return <Box font-size={px(18)} padding={em(3)}>
  <Graph xlim={xlim} ylim={ylim}>
    <Mesh2D xlim={xlim} ylim={ylim} xticks={xticks} yticks={yticks} />
    <HAxis lim={xlim} ticks={xticks} side="bottom" />
    <VAxis lim={ylim} ticks={yticks} side="left" />
    <SymLine fy={sin} xlim={xlim} stroke={blue} stroke-width={px(3)} />
  </Graph>
</Box>
```

---

<a id="plot_slide"></a>

## A slide with a plot

A slide composes a measured title, figure, and caption at a stable type scale.

See [Slide](../elements/text.md#Slide) for options.

<a id="plot_slide-example"></a>

### Example

```jsx
// A slide composes a measured title, figure, and caption at a stable type scale.
<Slide fit font-size={px(15)} aspect={1.5} title="From samples to a figure">
  <Plot
    grow={1}
    width={0.9}
    align-self="center"
    title="Sine wave"
    xlabel="Phase (rad)"
    ylabel="Value"
    xlim={[0, tau]}
    ylim={[-1.2, 1.2]}
    font-size={em(0.75)}
  >
    <SymLine fy={sin} xlim={[0, tau]} stroke={blue} stroke-width={em(0.18)} />
  </Plot>
  <Text color={darkgray} font-size={em(0.9)}>A common sampler supports scalar functions and parametric curves.</Text>
</Slide>
```

---

<a id="projection_3d"></a>

## Three-dimensional projection

Each point in this figure carries `{x, y, z}`. The core
`isometric_projection()` helper on [Graph](../elements/plotting.md#Graph) maps
these three dimensions to `{x, y}` on the page, with equal scale along all three
source axes. The graph's limits describe that output space.

[SymLine](../elements/plotting.md#SymLine) samples the helix in three dimensions.
The axes use the same source records in Arrow's `from` and `to`, while Text
annotations use `pos`. Points receives the full source record in its
`point-size` callback, so marker sizes can depend on `z` before projection.
Use named records for three-dimensional inputs; tuples always mean `[x, y]`.

Gum draws the projected paths in child order. This example does not compute
surface visibility or depth sorting. Line widths, marker shapes, and text
remain ordinary two-dimensional drawing geometry. See the
[projection guide](../guides/projections.md) for the coordinate contract
and geometry rules.

<a id="projection_3d-example"></a>

### Example

```jsx
// A shared projection maps three-dimensional source records onto the page.
const helix = t => ({x: cos(t), y: sin(t), z: 0.9 * t / tau})
const origin = {x: 0, y: 0, z: 0}
const axes = [
  {label: 'x', tip: {x: 1.6, y: 0, z: 0}, labelPos: {x: 1.8, y: 0, z: 0}},
  {label: 'y', tip: {x: 0, y: 1.6, z: 0}, labelPos: {x: 0, y: 1.8, z: 0}},
  {label: 'z', tip: {x: 0, y: 0, z: 2.5}, labelPos: {x: 0, y: 0, z: 2.7}},
]

return (
  <TextBox width={em(32)} font-size={px(20)} padding={em(1.3)} background={white} fit>
    <TextCol gap={em(0.8)}>
      <Text font-size={em(1.5)} font-weight={bold}>Three dimensions, one projection</Text>
      <Text font-size={em(0.8)} color={slate}>
        A helix, markers, axes, and labels share x, y, and z coordinates.
      </Text>
      <Graph
        aspect={1} projection={isometric_projection()}
        xlim={[-1.9, 1.9]} ylim={[-1, 2.8]}
      >
        <SymLine
          f={t => ({x: cos(t), y: sin(t), z: 0})}
          tlim={[0, tau]} samples={121}
          stroke={lightgray} stroke-width={em(0.06)}
        />
        {axes.map(({label, tip, labelPos}) => (
          <>
            <Arrow
              from={origin} to={tip}
              stroke={slate} stroke-width={em(0.06)} head-size={em(0.4)}
            />
            <Text pos={labelPos} anchor="center" color={slate}>{label}</Text>
          </>
        ))}
        <SymLine
          f={helix} tlim={[0, 2 * tau]} samples={241}
          stroke={blue} stroke-width={em(0.16)}
        />
        <Points
          points={linspace(0, 2 * tau, 9).map(helix)}
          point-size={({z}) => em(0.25 + 0.12 * z)} fill={blue}
        />
        <Text pos={{x: 1.15, y: 0, z: 0.2}} anchor={['start', 'center']} font-size={em(0.75)}>
          start
        </Text>
        <Text pos={{x: 1.15, y: 0, z: 1.8}} anchor={['start', 'center']} font-size={em(0.75)}>
          end
        </Text>
      </Graph>
      <Text font-size={em(0.75)} color={slate}>
        The projection sets position; source z controls marker size.
      </Text>
    </TextCol>
  </TextBox>
)
```

---

<a id="slick_bars"></a>

## Slick Bars

Rounded bars, angled category labels, and percentage annotations form a styled bar chart.

The model names and numbers are illustrative chart-demo data. No benchmark, methodology, or source was supplied; this is not a measured model comparison. BarPlot supplies rounded top corners, measured ticks, and an explicit domain with headroom for annotations.

The x-axis combines `xaxis-rotate={-40}` with
`xaxis-label-anchor={['end', 'start']}`. The anchor attaches each label's
top-right corner to its tick, so labels of different lengths hang down and to
the left instead of being centered by their rotated bounds. On a standalone
axis, the equivalent properties are `rotate` and `label-anchor`.

See [BarPlot](../elements/plotting.md#BarPlot) and
[Axis](../elements/plotting.md#Axis).

<a id="slick_bars-example"></a>

### Example

```jsx
// Historical sample values from the old gallery, preserved as chart-demo data.
const labels = [
  "GPT-4o",
  "OpenAI o1",
  "OpenAI o4-mini",
  "Gemini 3 Pro",
  "OpenAI o3",
  "Grok 4",
  "Claude Opus 4.5",
  "GPT-5.2",
]
const values = [1.3, 3.2, 8.3, 12.4, 14.1, 15.9, 17.5, 25.2]
return <BarPlot
  title="Rounded bars · gallery sample data"
  values={values}
  aspect={1.3}
  font-size={px(18)}
  height={px(550)}
  ylim={[0, 30]}
  xticks={enumerate(labels)}
  yticks={range(0, 31, 5)}
  xaxis-at={-1.1}
  yaxis-at={-0.7}
  yaxis-tick-side="inner"
  ygrid
  xaxis-lim={[0, 7]}
  xaxis-rotate={-40}
  xaxis-label-anchor={['end', 'start']}
  axis-tick-size={em(0.5)}
  margin={em(2)}
  bar-width={0.8}
  border-radius={{ t: em(0.3) }}
  fill={blue}
>
  {values.map((value, index) => (
    <Text pos={[index, value]} anchor={["center", "end"]}>
      {value + "%"}
    </Text>
  ))}
</BarPlot>
```

---

<a id="terrain_map"></a>

## Terrain in tiles

A 24-by-24 field of square tiles forms a terraced landscape, with teal lowlands,
green slopes, and pale summits. Gaussian hills and a small sinusoidal ripple
define the elevation, rounded to steps of `0.3` to create the terraces.

Each tile uses closed [Polyline](../elements/geometry.md#Polyline) paths for its
top and exposed sides. Their corners carry `{x, y, z}` coordinates; a custom
`projection` on [Graph](../elements/plotting.md#Graph) maps them into an isometric
view. The example sorts tiles by `i + j` to draw distant cells first and adds
side faces where a tile stands above its neighbor. Interpolated elevation
colors and darker side fills give the terrain depth.

Stacks arrange the heading and elevation legend around the graph, while an
[Overlay](../elements/layout.md#Overlay) positions the compass beside the
terrain. The legend samples the same color function as the tile tops.

See [three-dimensional projection](plotting.md#projection_3d) for another example of
shared 3D coordinates on a Graph.

<a id="terrain_map-example"></a>

### Example

```jsx
// A small square-tile height field. Graph projects its shared 3D coordinates;
// Group alone has local positions, but no data projection.

const W = 1200, H = 860
const N = 24
const terrainSize = { width: 955, height: 597 }
const origin = { x: 480, y: 28 }
const tileX = 17.7, tileY = 10.7, rise = 29
const ground = -1.05

const vertex = (x, y, z) => ({ x, y, z })
const terrainProjection = ({ x, y, z }) => ({
  x: tileX * (x - y),
  y: rise * z - tileY * (x + y),
})
// Output limits keep the original one-projected-unit-per-pixel framing.
const xlim = [-origin.x, terrainSize.width - origin.x]
const ylim = [origin.y - terrainSize.height, origin.y]

const gaussian = (x, y, cx, cy, spread) =>
  Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * spread ** 2))

const elevation = (x, y) => Math.max(0,
  2.85 - 0.020 * ((x - 12) ** 2 + (y - 12) ** 2)
  + 3.7 * gaussian(x, y, 8, 9, 2.8)
  + 2.9 * gaussian(x, y, 16, 13, 3.3)
  + 1.4 * gaussian(x, y, 13, 17, 2.3)
  - 1.25 * gaussian(x, y, 11, 13, 2.3)
  + 0.16 * Math.sin(0.9 * x + 0.37 * y) * Math.cos(0.53 * y)
)
const height = (i, j) => Math.round(elevation(i + 0.5, j + 0.5) / 0.3) * 0.3
const levels = Array.from({ length: N }, (_, i) =>
  Array.from({ length: N }, (_, j) => height(i, j)))
const at = (i, j) => levels[i][j]

// Facets now carry world-space corners; their Graph parent projects them together.
const Facet = ({ points, fill, stroke = none, line = 0, ...props }) => (
  <Polyline
    points={points} closed
    fill={fill} stroke={stroke} stroke-width={px(line)}
    stroke-linejoin="round" {...props}
  />
)
const blend = (a, b, t) => {
  const channel = k => Math.round(
    parseInt(a.slice(k, k + 2), 16) * (1 - t)
    + parseInt(b.slice(k, k + 2), 16) * t
  ).toString(16).padStart(2, '0')
  return '#' + [1, 3, 5].map(channel).join('')
}
const stops = [
  [0, '#75a4a4'], [0.25, '#a9c5ad'], [1.15, '#88ae8c'],
  [2.2, '#739a78'], [3.15, '#a4ad7d'], [4.1, '#c2b88b'],
  [5.15, '#ded2af'], [6.1, '#f0e8d1'],
]
const landColor = h => {
  if (h < 0.15) return '#76a7a5'
  for (let k = 1; k < stops.length; k++) {
    if (h <= stops[k][0]) {
      const a = stops[k - 1], b = stops[k]
      return blend(a[1], b[1], (h - a[0]) / (b[0] - a[0]))
    }
  }
  return stops[stops.length - 1][1]
}

const cells = []
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) cells.push({ i, j, depth: i + j })
}
cells.sort((a, b) => a.depth - b.depth || a.i - b.i)

const Tile = ({ i, j }) => {
  const z = at(i, j)
  const top = landColor(z)
  const sea = z < 0.15
  const sideI = i === N - 1 ? ground : at(i + 1, j)
  const sideJ = j === N - 1 ? ground : at(i, j + 1)
  return (
    <>
      {z > sideI + 0.001 &&
        <Facet
          points={[
            vertex(i + 1, j, z), vertex(i + 1, j + 1, z),
            vertex(i + 1, j + 1, sideI), vertex(i + 1, j, sideI),
          ]}
          fill={sea ? '#437f7f' : blend(top, '#244a40', 0.43)}
          stroke={sea ? '#437f7f' : '#436050'} line={0.43}
        />}
      {z > sideJ + 0.001 &&
        <Facet
          points={[
            vertex(i, j + 1, z), vertex(i + 1, j + 1, z),
            vertex(i + 1, j + 1, sideJ), vertex(i, j + 1, sideJ),
          ]}
          fill={sea ? '#4c8886' : blend(top, '#326757', 0.30)}
          stroke={sea ? '#4c8886' : '#52705b'} line={0.43}
        />}
      <Facet
        points={[
          vertex(i, j, z), vertex(i + 1, j, z),
          vertex(i + 1, j + 1, z), vertex(i, j + 1, z),
        ]}
        fill={top} stroke={sea ? '#93bab0' : '#e4e8d3'}
        line={sea ? 0.68 : 0.80}
      />
    </>
  )
}

const ink = '#233d36', muted = '#75867c', paper = '#f6f5ee'
const Rule = ({ height = em(1) }) => <HLine height={height} stroke="#cbd3c6" />

const Compass = props => (
  <VStack align="center" gap={em(0.4)} color={ink} {...props}>
    <Text font-family={mono} font-weight={bold} font-size={em(0.9)}>N</Text>
    <Arrow points={[[0.5, 1], [0.5, 0]]} height={em(4)} width={em(1)} />
  </VStack>
)

return <Page background={paper} font-size={px(20)}>
  <Box padding={em(2)}>
    <VStack align="stretch">
      <HStack>
        <VStack gap={em(0.35)}>
          <Text font-family={mono} font-size={em(0.83)} font-weight="bold"
            color="#53816b">FIELD STUDY  /  001</Text>
          <Text font-size={em(2.5)} font-weight="bold" color={ink}>
            Terrain in tiles
          </Text>
        </VStack>
        <Spacer />
        <VStack gap={em(0.65)}>
          <Text font-family={mono} font-size={em(0.83)} color={ink}>
            24 × 24 CELLS
          </Text>
          <Text font-family={mono} font-size={em(0.78)} color={muted}>
            ELEVATION / 3D
          </Text>
        </VStack>
      </HStack>
      <Rule />
      <Overlay>
        <Graph
          width={px(terrainSize.width)} height={px(terrainSize.height)}
          projection={terrainProjection} xlim={xlim} ylim={ylim}
        >
          <Facet
            points={[
              vertex(0, 0, ground - 19 / rise),
              vertex(N, 0, ground - 19 / rise),
              vertex(N, N, ground - 19 / rise),
              vertex(0, N, ground - 19 / rise),
            ]}
            fill="#5d776e" opacity={0.12}
          />
          <Facet
            points={[
              vertex(0, 0, ground), vertex(N, 0, ground),
              vertex(N, N, ground), vertex(0, N, ground),
            ]}
            fill="#47796e"
          />
          {cells.map(({ i, j }) => <Tile key={`${i}-${j}`} i={i} j={j} />)}
        </Graph>
        <Compass pos={[0.95, 0.15]} />
      </Overlay>
      <Rule height={em(2.5)} />
      <HStack gap={em(0.65)}>
        <Text font-family={mono} font-size={em(0.78)} font-weight="bold"
          color={ink}>ELEVATION</Text>
        <Spacer />
        <Text font-family={mono} font-size={em(0.72)} color={muted}>LOW</Text>
        <HStack gap={em(0.17)}>
          {Array.from({ length: 13 }, (_, k) => (
            <Rect key={k} width={em(1.61)} height={em(0.83)}
              fill={landColor(k * 0.5)} stroke={none} />
          ))}
        </HStack>
        <Text font-family={mono} font-size={em(0.72)} color={muted}>HIGH</Text>
        <Spacer />
        <Text font-family={mono} font-size={em(0.72)} color={muted}>
          ISOMETRIC
        </Text>
      </HStack>
    </VStack>
  </Box>
</Page>
```

---

<a id="the_nexus"></a>

## The Nexus

Ten phase-shifted cosine wave packets share a Gaussian envelope and form a colored interference pattern over a fine grid.

Every curve explicitly samples the displayed domain. Mesh2D controls grid density independently of the disabled axes, and finite sample counts keep rendering predictable.

See [Mesh2D](../elements/plotting.md#Mesh2D).

<a id="the_nexus-example"></a>

### Example

```jsx
// Ten phase-shifted wave packets on a dense Cartesian mesh.
<Box padding={em(1.5)}>
  <Frame border-radius={em(0.9)} border-color={slate} border-width={px(2)}>
    <Plot aspect={phi} axis={false} grid={false} margin={0} xlim={[-4 * pi, 4 * pi]} ylim={[-1.5, 1.5]}>
      <Mesh2D
        xlim={[-4 * pi, 4 * pi]}
        ylim={[-1.5, 1.5]}
        xticks={31}
        yticks={21}
      />
      {linspace(0, pi, 10).map((phase) => (
        <SymLine
          fy={(x) => cos(x - phase) * exp(-0.05 * x * x)}
          xlim={[-4 * pi, 4 * pi]}
          samples={501}
          stroke={interp(red, blue, phase / pi)}
          stroke-width={px(2)}
        />
      ))}
    </Plot>
  </Frame>
</Box>
```
