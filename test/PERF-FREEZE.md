# Freeze removal experiment

Use the existing performance cases in separate processes:

```sh
bun run perf:freeze --mode freeze --json > /tmp/gum-freeze.json
bun run perf:freeze --mode no-freeze --json > /tmp/gum-no-freeze.json
bun run perf:freeze --mode no-freeze --audit --smoke
bun run perf:freeze --mode no-freeze --filter '^demos/render/'
bun run perf:freeze --mode freeze --snapshot /tmp/gum-freeze-outputs.json
bun run perf:freeze --mode no-freeze --snapshot /tmp/gum-no-freeze-outputs.json
diff /tmp/gum-freeze-outputs.json /tmp/gum-no-freeze-outputs.json
```

The baseline loads normal source. The experiment uses a Bun source-loading hook
to replace `Object.freeze` calls in core, math, and maps with identity functions.
It leaves production files, dependencies, the global `Object.freeze`, input
copying, numeric validation, and existing ownership caches unchanged. The hook
also handles uses of `Object.freeze` as an array callback. Demos are evaluated
unchanged through those packages. This is a benchmark tool, not a supported
production setting or an equivalent immutability guarantee.

`make_measure` uses `Object.isFrozen` to decide whether a reference box needs
copying. Simply removing freezes would make it allocate extra copies. Seven
reference-box creation sites instead register their result in a WeakSet, and
the experiment's `is_frozen` checks that set or the native predicate. This keeps
the copy decisions while removing the freezes, including freezes on those boxes.
The seven source substitutions require exact matches and fail on source drift.

`--audit --smoke` additionally tracks every removed freeze and asserts that the
reference-only tracking gives the same answers at each `Object.isFrozen` check.
That extra bookkeeping is never used in timed runs. Startup checks confirm that
the core actually loaded the modified source and all seven sites were patched.

Run the modes sequentially, alternate their order across repeats, and use the
same Bun version and inputs. Both modes use Mitata's normal warmup and sampling.
Compare returned values separately: matching SVG/layout output verifies these
workloads, but cannot restore mutation protection in the experiment. Source
snapshots should remain independent of subsequent caller edits in either mode.
`--snapshot` runs each case once without timing and hashes its complete JSON
value with sorted record keys, including full SVG strings and layout records.
It preserves signed zero and nonfinite numeric values with explicit tags;
functions and private cache state are outside the snapshot.

Timing includes the small identity/helper calls, reference WeakSet bookkeeping,
and any changes in runtime object representation or optimization. It estimates
the effect of removing runtime freezing with preserved copying; it is not a
measurement of time spent exclusively inside the native freeze function.
