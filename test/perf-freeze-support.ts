// Experiment only: these helpers are injected into Gum source by perf-freeze.ts.
// Track reference boxes separately so make_measure keeps its original copy decisions.
const references = new WeakSet<object>()
const would_freeze = new WeakSet<object>()

export function identity<T>(value: T): T { return value }

export function reference<T extends object>(value: T): T {
  references.add(value)
  return value
}

export function is_frozen(value: object): boolean {
  return references.has(value) || Object.isFrozen(value)
}

// Untimed audit: track every removed freeze and check the reference-only tracking
// produces the same answer wherever the source uses Object.isFrozen.
export function audit_identity<T>(value: T): T {
  if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
    would_freeze.add(value)
  }
  return value
}

export function audit_reference<T extends object>(value: T): T {
  would_freeze.add(value)
  return reference(value)
}

export function audit_is_frozen(value: object): boolean {
  const expected = would_freeze.has(value) || Object.isFrozen(value)
  const actual = is_frozen(value)
  if (actual !== expected) throw new Error('Freeze experiment missed a reference-box producer')
  return actual
}
