# Gum JSX plugin publication

Publication plan, checked against OpenAI documentation on 2026-09-26.

Submit Gum JSX as a **skills-only plugin** to the public Plugins Directory
shared by ChatGPT and Codex. This route supports our existing package of authoring
instructions and references without an MCP server. Public publication goes through
OpenAI review and a separate publisher-controlled release step.
See the [submission guide](https://developers.openai.com/plugins/deploy/submission).

## Current package

The plugin lives in [plugins/gum-jsx](../plugins/gum-jsx/README.md) in the
top-level `gum-jsx` repository. Build scripts stay in `gum-jsx-docs/scripts/`.
Its version is currently `0.2.0`, independent of the Gum npm package versions.

- The root [plugin.json](../plugins/gum-jsx/plugin.json) uses the
  portable Agent Plugins format. OpenAI presentation metadata lives under
  `extensions["com.openai"].interface`.
- Skills are discovered from `skills/`. The former compatibility manifest has
  been removed.
- The build generates the authoring skill and references directly inside the
  plugin. Maintain and commit the source prompts and docs in `gum-jsx-docs`,
  rebuild, and commit the generated plugin files and updated submodule pointer
  in the top-level repository for GitHub marketplace distribution.
- The ZIP contains the manifest, skill, references, icon, and README. Installing
  it does not install Bun or the Gum CLI.

From the top-level `gum-jsx` repository:

```sh
bun run plugin:pack
```

This rebuilds the skill and writes `dist/gum-jsx-plugin.zip`.
Use that final ZIP for submission after completing the work below.

## Distribute builds to testers

The top-level [.agents/plugins/marketplace.json](../.agents/plugins/marketplace.json)
catalog is named `gum-jsx-beta` and points at the committed `plugins/gum-jsx`
directory. After pushing the plugin and catalog, testers can run:

```sh
codex plugin marketplace add CompendiumLabs/gum-jsx
codex plugin add gum-jsx@gum-jsx-beta
```

They should start a new task after installation. Rendering also requires Bun and
the Gum CLI. GitHub marketplace installation reads the repository's committed
files; release ZIP attachments remain useful snapshots for separate distribution.

## Resolve before submission

- [x] **Shorten the listing description.** The `shortDescription` is now
  `Diagrams, plots, and slides`, within the 30-character submission limit.
- [x] **Increase the branding image dimensions.** The SVG now declares
  512×512 dimensions and a matching viewBox, preserving the original appearance.
  Its editable [Gum JSX source](../plugins/gum-jsx/assets/logo_icon_dark.jsx)
  is retained beside the SVG. Both `logo` and `composerIcon` reference this asset.
- [x] **Make first-use requirements clear.** The listing, README, and skill
  explain that rendering requires Bun and a separate Gum CLI installation.
  The skill checks PATH and the project for an existing CLI; if neither is
  available, it asks for a global or local install choice before proceeding.
  Users who decline installation or cannot run commands can still receive JSX
  source, with rendering clearly reported as not performed. Both install commands
  passed clean-directory checks outside this workspace on Linux x64.
- [x] **Use a reproducible CLI version.** New-install commands use the tested
  `@gum-jsx/cli@2.0.0-beta.3`; local installs save it as an exact development
  dependency. This candidate pin must be published to npm before distributing
  the updated plugin. Revisit this pin when publishing plugin updates.
- [x] **Finish the public listing.** The manifest lists **Gum JSX** by
  **Compendium Labs** in **Developer Tools**, with the 512×512 icon and three
  concrete starter prompts for a system diagram, data plot, and mathematical
  slide deck. The descriptions cover editable JSX, export formats, CLI setup,
  tested native platforms, and the source-only workflow when rendering is
  unavailable. Support points to the public
  [Gum JSX issue tracker](https://github.com/CompendiumLabs/gum-jsx/issues).
  Listing text lengths, prompt uniqueness, brand-color contrast, and icon
  dimensions have been checked against the final submission limits.

The [validation reference](https://developers.openai.com/plugins/deploy/submission-errors)
documents the description and image limits. It makes website, support, privacy,
and terms URLs optional for skills-only ZIP submissions, although they are
required for remote MCP submissions. Providing useful public support and
appropriate policy information remains worthwhile.

## Verify the installed experience

The release audit exercised the Gum packages and renderers. Plugin verification
also needs to exercise skill selection, setup, reference access, and completion
of user requests through the installed plugin.

On 2026-09-26, both documented CLI install commands passed smoke checks using
published npm packages in temporary directories outside this workspace. The
global check used isolated global package and binary directories. Checks covered
missing-CLI detection, installed-command discovery, CLI help, and SVG, PNG, and
PDF output. The local manifest recorded the exact version; the global install
created no project manifest. Conversation tests through the installed plugin
remain below.

- [ ] Build and install the final plugin from a local marketplace.
- [ ] Start a new task and test outside the source workspace, without relying
  on workspace dependencies or development-only paths.
- [ ] Record each prompt, environment, expected behavior, actual result, and
  any output artifacts. Check the rendered figures visually.
- [ ] Repeat affected cases after fixing the skill or changing its dependencies.

Prepare five positive cases and three boundary or negative cases as review
materials. These are proposed Gum-specific cases, not tests already completed:

| Case | Expected behavior |
| --- | --- |
| Create a labeled process diagram | Use the skill, produce readable JSX, render a valid SVG, and inspect the result. |
| Plot supplied data | Preserve the supplied values, label axes, and render the requested output format. |
| Create a mathematical figure | Use supported math components and produce legible formulas and geometry. |
| Create a geographic map | Use `GeoMap` and the supported atlas/projection APIs, preserving supplied data. |
| Create and revise a slide deck | Produce a valid PDF deck and handle a follow-up revision consistently. |
| Request rendering with the CLI missing | Identify the missing dependency and follow the documented setup when permitted; otherwise explain what is needed. |
| Request rendering on a host without execution support | Provide useful source and instructions, clearly stating that rendering was not performed. |
| Request ordinary React or HTML work | Avoid activating the Gum figure-authoring workflow merely because JSX is mentioned. |

OpenAI's [testing guidance](https://developers.openai.com/plugins/deploy/connect-chatgpt)
covers direct and indirect requests, follow-ups, unsupported requests, bundled
references, and useful results. Its
[submission guide](https://developers.openai.com/plugins/deploy/submission)
asks developers to prepare five positive and three negative cases; the exact
portal fields depend on the submission type.

## Publisher setup

- [ ] Select the OpenAI Platform organization that will own the plugin.
- [ ] Complete developer or business identity verification. Publishing under
  **Compendium Labs** should use a matching verified publisher identity.
- [ ] Confirm that the submitter has **Apps Management → Write** permission.
  Organization owners already have submission access.
- [ ] Prepare the initial release notes and choose supported countries or regions.

Account verification and permissions have not been checked as part of this
repository work. Follow the
[publisher setup instructions](https://developers.openai.com/plugins/deploy/submission).

## Submit and publish

1. Open the [plugin submission portal](https://platform.openai.com/plugins).
2. Choose **Create plugin → Skills only**.
3. Upload the final `gum-jsx-plugin.zip` and review the imported listing and skill.
4. Complete the applicable listing, publisher, prompts, testing, availability,
   release-note, and policy-attestation fields. Explain the CLI setup reviewers
   need to reproduce the workflows.
5. Resolve package validation errors and skill safety/security scan findings.
   A ZIP that passes upload validation can still need changes before final
   directory submission.
6. Submit for review and address any feedback. Review timing varies; do not
   assume a fixed publication date.
7. After approval, choose when to publish from the portal. Publication makes
   the plugin available in the shared public directory.

See the [public publishing flow](https://developers.openai.com/plugins/deploy/submission)
and [submission error reference](https://developers.openai.com/plugins/deploy/submission-errors).

## Maintain published versions

For subsequent releases, update the plugin version, rebuild its references,
verify the tested CLI version and affected workflows, and submit the new package
with release notes. Keep the plugin name `gum-jsx` stable across updates.

Published skill or listing changes require a new version, review, and publication.
Publishing Gum npm packages or reinstalling a local development copy does not
update the skill bundle in the public directory. Track the plugin release and
its tested Gum package version together so users receive compatible instructions.
See the [update process](https://developers.openai.com/plugins/deploy/submission).
