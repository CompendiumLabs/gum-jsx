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

- [ ] **Shorten the listing description.** The current `shortDescription` is
  48 characters; final directory submission allows 30. Suggested replacement:
  `Diagrams, plots, and slides`.
- [ ] **Increase the branding image dimensions.** The current SVG declares
  32×32 dimensions and a 34×34 viewBox. Directory branding must be square and
  at least 48×48. Produce a qualifying SVG while preserving its appearance;
  SVG is an accepted format. Both `logo` and `composerIcon` reference this asset.
- [ ] **Make first-use requirements clear.** State in the public listing and
  skill setup instructions that rendering requires Bun and the Gum CLI in the
  execution environment. Test the setup from a clean directory outside this
  workspace. Preserve a useful authoring workflow when local rendering is
  unavailable, and never claim an output was rendered without running it.
- [ ] **Use a reproducible CLI version.** The current skill recommends
  `@gum-jsx/cli@beta`. For the submitted plugin, use the exact release tested
  with its bundled references, currently `2.0.0-beta.2`, and revisit that pin
  when publishing plugin updates.
- [ ] **Finish the public listing.** Review the name, descriptions, category,
  publisher name, icon, and three starter prompts. Add a useful support link,
  such as the project's issue tracker. Explain the supported execution
  environments and setup without promising rendering on untested hosts.

The [validation reference](https://developers.openai.com/plugins/deploy/submission-errors)
documents the description and image limits. It makes website, support, privacy,
and terms URLs optional for skills-only ZIP submissions, although they are
required for remote MCP submissions. Providing useful public support and
appropriate policy information remains worthwhile.

## Verify the installed experience

The release audit exercised the Gum packages and renderers. Plugin verification
also needs to exercise skill selection, setup, reference access, and completion
of user requests through the installed plugin.

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
