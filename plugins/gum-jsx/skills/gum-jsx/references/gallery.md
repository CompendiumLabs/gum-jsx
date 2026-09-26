# Gallery

Each entry includes its runnable JSX example.

## Layout

- [Rounded box clipping](gallery/layout.md#box_clip) — Tree output retains the child's full allocation and overflow even though that ink is hidden.
- [Flex grow](gallery/layout.md#flex_grow) — A bordered card holds a heading, a line of text, and a row of three shapes that takes up whatever room is left.
- [Anchors in nested canvases](gallery/layout.md#group_anchors) — Compare how anchors position children in three side-by-side panels.
- [Clipped and unclipped canvases](gallery/layout.md#group_clip) — The root's fit prop hugs both panels and keeps them side by side at smaller sizes, including the padding that protects the intentionally unclipped artwork.
- [Layout choices](gallery/layout.md#layout_choices) — Three identical-width rows show three explicit allocation policies.
- [Positioned diagram](gallery/layout.md#positioned_diagram) — An HStack arranges three labeled Frame nodes and two connectors inside a Slide.
- [Baselines, packing, and stretch](gallery/layout.md#stack_alignment) — TextBox and TextCol carry the available width through the surrounding document.
- [Growth bases](gallery/layout.md#stack_basis) — Compare stack growth when children have different flex bases.
- [Flex limits and shrinkage](gallery/layout.md#stack_flex) — The outer TextBox and nested TextCol components supply a shared width without repeating width declarations.
- [Two Columns](gallery/layout.md#two_column) — A damped-oscillation plot sits beside a paragraph and a short list containing inline math.
- [Two columns](gallery/layout.md#two_columns) — A small figure and its explanation share a definite row width.
- [UI Mockup](gallery/layout.md#ui_mockup) — Overlapping desktop-style windows combine a live plot, a fine background grid, and wrapped message text.

## Geometry

- [Arrow caps and tips](gallery/geometry.md#arrow_caps) — The top row compares butt, round, and square caps on thick shafts.
- [Anatomy of a Cell](gallery/geometry.md#cell_diagram) — A labeled animal-cell schematic combines a lumpy membrane, nucleus, mitochondria, endoplasmic reticulum, and other organelles.
- [Metal Grid](gallery/geometry.md#metal_grid) — A luminous 9-by-16 tile matrix sits under a bright layered spline, inside nested dark frames.
- [Neon Rose](gallery/geometry.md#neon_rose) — Layered spline strokes create a luminous rose with a spiral bud, curled petals, leaves, and small cross-shaped sparkles.
- [Pendulum Physics](gallery/geometry.md#pendulum_physics) — A pendulum diagram with a clipped support, angle arc, equilibrium line, bob, force arrows, and equation of motion.
- [Regular Polygons](gallery/geometry.md#polygon_slide) — Triangles through octagons are shown in two groups of three labeled cards.
- [Set Theory](gallery/geometry.md#set_theory) — Two smaller elliptical regions lie inside the larger set A, with independently positioned labels.
- [Shape cards](gallery/geometry.md#shape_cards) — Three cards are generated from data with a small functional JSX component.
- [Space Rose](gallery/geometry.md#space_rose) — A glowing, weathered light-box sign floats in a seeded starfield, with a rose printed on its front face.
- [Spline Star](gallery/geometry.md#spline_star) — Alternating inner and outer vertices form a rounded five-point star.

## Plotting

- [Atomic Orbitals](gallery/plotting.md#atomic_orbitals) — Six stylized angular profiles show s, p, and d lobes with separate positive and negative phases.
- [Axes with Arrows](gallery/plotting.md#axis_arrows) — A logarithmic curve with arrowheads on both directed axes.
- [Complex Roots](gallery/plotting.md#complex_plot) — The real and imaginary components of the roots of x² + 2cx + 1 are plotted horizontally against the parameter c.
- [Flux Capacitance](gallery/plotting.md#flux_capacitance) — A translucent band fills the space between sine and cosine over a full period.
- [A reversed data axis](gallery/plotting.md#graph_scatter) — Directed limits reverse x while annotations and custom markers remain upright.
- [Where U.S. GDP Was Produced](gallery/plotting.md#industry_sankey) — A Sankey-style chart divides 2024 U.S. GDP into goods, services, government, and their industry groups.
- [Particle in a Box](gallery/plotting.md#particle_box) — Illustrate wavefunctions and energy states in an infinite square well.
- [Regional changes](gallery/plotting.md#plot_bars) — Categorical ticks, positive and negative bars, and functional bar colors.
- [Manual Plot](gallery/plotting.md#plot_manual) — A sine plot assembled from a Graph, Mesh2D, HAxis, and VAxis, rather than the higher-level Plot component.
- [A slide with a plot](gallery/plotting.md#plot_slide) — A slide composes a measured title, figure, and caption at a stable type scale.
- [Slick Bars](gallery/plotting.md#slick_bars) — Rounded bars, angled category labels, and percentage annotations form a styled bar chart.
- [The Nexus](gallery/plotting.md#the_nexus) — Ten phase-shifted cosine wave packets share a Gaussian envelope and form a colored interference pattern over a fine grid.

## Maps

- [Filtering and bounds](gallery/maps.md#filtered_region) — Filter country IDs while keeping a fixed longitude/latitude view.
- [GeoJSON edge cases](gallery/maps.md#geojson_edges) — Show polygon holes, RFC 7946 winding, and two shapes meeting at the antimeridian.
- [Projected city markers](gallery/maps.md#globe_markers) — Place city markers on an orthographic globe and omit points on the far side.
- [Natural map sizes](gallery/maps.md#map_aspect) — Let framed maps derive their widths from a shared height.
- [Map routes](gallery/maps.md#map_routes) — Nest a sampled Arrow, Points, and city labels directly inside GeoMap.
- [Projection gallery](gallery/maps.md#projection_gallery) — Compare Equal Earth, Natural Earth, equirectangular, and Mercator projections.
- [Selected-region fit](gallery/maps.md#selected_region) — Fit five country IDs and reuse the projection for a Berlin–Prague–Vienna route.
- [US states](gallery/maps.md#us_states) — Render US states with Albers USA insets, FIPS-keyed fills, and shared borders.
- [World countries](gallery/maps.md#world_choropleth) — Color world countries by stable feature IDs on an Equal Earth map.

## Networks

- [Macroeconomic Flows](gallery/networks.md#macro_economy) — Producers, consumers, government, and foreign trade form a four-sector flow schematic.
- [Connections through layout](gallery/networks.md#network_connections) — Show how network edges meet the completed frames of varied nodes.
- [Any element as a node](gallery/networks.md#network_shapes) — Connect shapes, stacks, and nested elements as network nodes.
- [Transformer Architecture](gallery/networks.md#transformer) — Diagram the layers and repeated blocks of a decoder-only transformer.
- [Unit Distance](gallery/networks.md#unit_distance) — A finite set of coefficient vectors in Q(i, ζ₃) produces a dense unit-distance graph.

## Text

- [One paragraph, two widths](gallery/text.md#paragraph) — The custom parent draws outlines around the measured paragraph boxes.
- [Punk Rock](gallery/text.md#punk_rock) — Three colored text frames form a tilted badge with rounded outer corners.
- [Type, ink, and line boxes](gallery/text.md#typography) — The tight-leading sample puts 28px glyphs in a 12px line box.
- [Typography card](gallery/text.md#typography_card) — A text-focused card combines IBM Plex Sans and Mono, mixed weights, inline styles, baseline alignment, and a short preformatted block.

## Math

- [Aligned equations](gallery/math.md#aligned_math) — Use aligned to line up relations across several equations.
- [Math inside prose](gallery/math.md#inline_math) — Text accepts formulas and other Gum elements alongside prose.
- [Matrices and arrays](gallery/math.md#math_arrays) — Math tables measure their cells at natural size, align columns, and share a baseline across each row.
- [Math boxes and invisible layout](gallery/math.md#math_boxes) — Math keeps logical dimensions separate from drawing bounds.
- [Gum and math composition](gallery/math.md#math_composition) — Math operands are ordinary Gum children.
- [Math decorations](gallery/math.md#math_decorations) — Accents, horizontal rules, braces, and extensible arrows work in TeX and JSX.
- [Ordinary mathematical expressions](gallery/math.md#math_expressions) — Parsed TeX and explicit JSX use the same math elements.
- [Math on plots and axes](gallery/math.md#math_plot_labels) — Axis tick labels can be Gum elements.
- [Math in slides](gallery/math.md#math_slides) — Slide uses the same elements as ordinary diagrams.
- [The Scenic Route](gallery/math.md#scenic_route) — A direct arrow, a hooked arrow, and a custom figure-eight arrow provide three routes from A to B.
- [Shape Algebra](gallery/math.md#shape_algebra) — A subdivided square is the value of a series, a colored circle appears under a radical, and a matrix transpose swaps colored swatches.
- [Stokes’ Theorem](gallery/math.md#stokes_theorem) — An obliquely projected surface shows its oriented boundary, tangent arrows, and surface normals beside the theorem and explanatory prose.

## Api

- [Clipping and transforms](gallery/api.md#clipping) — This example uses the low-level fragment API from Custom elements.
- [Reusing fragments](gallery/api.md#repeated) — Use tree output with --stats to inspect allocations and layout queries.
