// Verify the source manifests independently of packing or publishing. npm
// preserves dependency ranges from package.json, even when Bun's local pack
// output has resolved workspace dependencies for the same checkout.
const packages = ['core', 'math', 'png', 'pdf', 'mark', 'react', 'docs', 'cli']
const root = process.argv[2] ?? `${import.meta.dir}/..`
let version: string | undefined

for (const pkg of packages) {
  const manifest = await Bun.file(`${root}/gum-jsx-${pkg}/package.json`).json()
  if (manifest.name !== `@gum-jsx/${pkg}` || manifest.private || !manifest.version)
    throw new Error(`Invalid public release manifest: ${pkg}`)
  version ??= manifest.version
  if (manifest.version !== version)
    throw new Error(`${manifest.name} has version ${manifest.version}, expected ${version}`)

  for (const group of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    for (const [name, range] of Object.entries(manifest[group] ?? {})) {
      if (typeof range !== 'string' || /^(workspace:|link:|file:)/.test(range))
        throw new Error(`${manifest.name} ${group} contains a local dependency: ${name}@${range}`)
      if (name.startsWith('@gum-jsx/') && range !== version)
        throw new Error(`${manifest.name} ${group} must pin ${name} to ${version}, got ${range}`)
    }
  }
}

console.log(`Release manifests valid: ${packages.length} packages at ${version}`)
