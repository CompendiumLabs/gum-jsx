# Video elements

<a id="Video"></a>

## Video

**Video** describes an animation whose frames are ordinary Gum elements. Return
it at the top level of a JSX source. It is provided by `@gum-jsx/mp4` and is
available in the `gum` CLI without imports.

| Property | Default | Meaning |
|---|---|---|
| `size` | Required | `[width, height]` in pixels for every frame |
| `fps` | Required | Positive frame rate in frames per second |
| `children` | — | Nonempty sequence of elements, one per frame |
| `frame` | — | Synchronous `({ time, frame, fps }) => element` generator |
| `duration` | Required with `frame` | Positive animation duration in seconds |
| `background` | `white` | Canvas background behind each frame |

Choose either children, or a `frame` generator with `duration`. Combining the
two forms is an error. **Video** is a timeline component, so keep layout and
style props on its frame elements; it cannot be nested inside a **Box** or stack.

<a id="Video-frame-children"></a>

### Frame children

Children play in source order. Their count determines the duration:
`frame_count / fps`. Arrays and fragments flatten into the sequence; null and
boolean children are ignored. At least one element must remain.

The example below plays four explicitly written frames at `2` fps, lasting two
seconds. For an existing array, place `{frames}`
between the **Video** tags. The component snapshots the children at construction.
Omit `duration` when supplying children.

<a id="Video-frame-generator"></a>

### Frame generator

Use `frame` for animations computed from time. It receives:

- `frame`: the zero-based integer frame index.
- `time`: `frame / fps`, in seconds.
- `fps`: the video's frame rate.

Return a Gum element synchronously:

```jsx
<Video
  size={[640, 360]}
  fps={30}
  duration={2}
  frame={({ time }) => (
    <Text font-size={px(36)}>{time.toFixed(2)} seconds</Text>
  )}
/>
```

The source is evaluated once; the generator runs only
when a frame is requested. There are `ceil(duration * fps)` frames, with no
sample at the exact end time. The encoded duration is the frame count divided
by `fps`.

Frames can be requested out of order. Base them on their inputs and precomputed
data; avoid advancing mutable counters or drawing random numbers inside `frame`.
For a simulation such as Game of Life, precompute its states and index them by
`frame`. Use `setSeed` before generating any initial random data.

The CLI also provides `lerp(a, b, progress)`, `progress(time, start, duration)`,
and `ease_in_out(progress)` for interpolation and timing.

<a id="Video-export-and-preview"></a>

### Export and preview

Gum Studio plays videos in its preview pane. Use the play/pause button or frame
slider to inspect individual frames.

Save the source as `video.jsx`, then run:

```sh
gum video.jsx -o video.mp4
gum video.jsx -f mp4 > video.mp4
gum video.jsx --time 1.5 -o frame.png
gum video.jsx --time 1.5 -o frame.svg
```

Without an output format or filename, the CLI shows a Kitty frame preview.
`--time` defaults to `0`, selects `floor(time * fps)`, and must be less than the
duration. Omit it for MP4 export. Other frame-preview formats include PDF, PPTX,
tree, and JSON.

`-W` and `-H` override the frame dimensions, while `--theme` and `--background`
override its appearance. The video size overrides dimensions declared by a
frame's **Svg**. MP4 requires even integer dimensions from `2` to `4096` and
an `fps` in `[0.001, 1000]`. `--qp` sets an integer quantizer from `10` to `51`;
lower values increase quality and file size, with a default of `18`.

MP4 export uses the bundled encoder and needs no FFmpeg. Output is H.264 in
fragmented MP4, without audio. `--ratio`, `--select`, and `--stats` apply to
frame previews rather than MP4 export.

In a host script, import `Video`, `render_mp4`, and `create_renderer` from
`@gum-jsx/mp4`. Construct a video with `new Video({ size, fps, children })` or
`new Video({ size, fps, duration, frame })`. Export it with
`await render_mp4(video, 'video.mp4')`, or render a PNG frame with
`create_renderer(video).png(index)`.

<a id="Video-example"></a>

### Example

```jsx
// Four explicit frames at two frames per second: a two-second video.
<Video size={[640, 360]} fps={2} background={white}>
  {linspace(0.2, 0.8, 4).map((x, i) =>
    <Group font-size={px(24)}>
      <Line from={[0.2, 0.5]} to={[0.8, 0.5]} />
      <Circle pos={[x, 0.5]} width={em(2)} fill={blue} stroke={none} />
      <Text pos={[0.5, 0.8]}>Frame {i+1}</Text>
    </Group>
  )}
</Video>
```
