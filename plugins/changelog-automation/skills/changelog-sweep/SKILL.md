---
name: changelog-sweep
description: Run a changelog sweep on ANY Figma file — a design system, a design file (screens/flows), or both. Fingerprint the current state, diff it against a stored baseline to detect drift (added, removed, or changed components/variables/styles AND/OR screens/frames), and auto-log any changes to the file's Changelog page. Resolves the target file key, scope, fingerprint script, and changelog rules from the project's own config, so it works across projects and on a schedule. Trigger when the user wants to run a changelog sweep, check for design or design-system drift/changes, update the changelog, or schedule a periodic check. If the file has no Changelog page yet, run `changelog-setup` first.
---

Diff a Figma file's current state against a stored fingerprint baseline and auto-log any drift to the file's Changelog page. Works for a **design system** (components, variables, styles), a **design file** (screens/frames), or **both** — the `scope` decides what's tracked.

## Resolve the target (no hardcoding)

This routine is **generic** — it hardcodes nothing about any one project. At the start of every run, resolve these from the **current project's own config** (its `CLAUDE.md`, `AGENTS.md`, or a `changelog` / `design-system` config section):

- **`FIGMA_FILE_KEY`** — the Figma file to sweep. Projects document this (e.g. a header line like `Figma — <name> (<fileKey>)`, or a `figmaFileKey:` field). Extract it.
- **`CHANGELOG_SCOPE`** — what to track: `design-system` (components/variables/styles — the default), `design-file` (top-level frames/screens), or `all` (both). Resolve from config; if absent, infer from the file's nature (a component library → `design-system`; a screens/flows file → `design-file`) and say which you chose. **Use the same scope the baseline was captured with** (it's stored in the baseline meta).
- **`FINGERPRINT_SCRIPT`** — the canonical fingerprint algorithm (this plugin bundles `scripts/figma-fingerprint.js`; a project may override with its own copy). Embed it verbatim — never hand-rewrite it, the hashes must line up with the baseline.
- **`CHANGELOG_RULES`** — the project's changelog conventions. Resolve from the project config if it has a Changelog-rules section; **otherwise fall back to this plugin's `references/changelog-conventions.md`** (the portable default).

If `FIGMA_FILE_KEY` can't be resolved, report that and stop — don't guess a file key. Everything else (the Changelog page, its entries frame, badge styles, variable IDs) is **discovered dynamically from the file at runtime** — never hardcode node or variable IDs, they differ per file.

> Because the values come from the project's own config (with sensible fallbacks), the **same routine works across every project and every file type** without edits.

## Context
The file stores a fingerprint baseline in Figma shared plugin data (namespace `changelog`, key `baseline`), captured with a scope. Each sweep diffs the current state against that baseline to detect changes made directly in Figma (by a human, or by Claude in a prior session that didn't refresh the baseline), and auto-logs them to the Changelog page. **If there's no baseline or no Changelog page yet, run the `changelog-setup` skill first** — this sweep maintains an existing changelog; it does not create one.

## Steps

### 1. Read the fingerprint script
Read `{FINGERPRINT_SCRIPT}`. You will embed it verbatim in your use_figma call.

### 2. Compute the diff
In a single use_figma call on `{FIGMA_FILE_KEY}`:
- Embed the full contents of the fingerprint script verbatim at the top
- `const raw = figma.root.getSharedPluginData('changelog', 'baseline')` — if empty, stop and tell the user to run `changelog-setup` first
- `const { fp: base, meta } = JSON.parse(raw)` — use `meta.scope` if present (the baseline's scope wins)
- `const fp = await computeFingerprint({ scope })`
- `const diff = computeFingerprint.diff(base, fp)`
- Return `{ diff, fp, scope }`

### 3. Decide whether to log
If every bucket in the diff has zero added/removed/changed entries, do nothing and stop — the file is in sync.

### 4. Write the changelog entry
If there are changes, write a changelog entry following `{CHANGELOG_RULES}`. Resolve everything **dynamically from the file** — do not hardcode node or variable IDs:
- **Find the Changelog page** by name, then its **entries auto-layout container** (the frame that holds the existing entries). Insert the new entry at the top with `entriesFrame.insertChild(0, entry)`.
- **Clone the most recent existing entry** (the entries container's first child) for all fills, fonts, padding, and badge pills — never hardcode colours or variable IDs. Cloning keeps the entry styled correctly and portable across files. (If the rules specify how to build pills from scratch, follow those; otherwise cloning is sufficient.)
- **Version**: increment the patch from the most recent entry's name/title.
- **Date / tag / author badge**: follow `{CHANGELOG_RULES}`. For a sweep, entries are authored `MANUAL` (the sweep detects human/unattributed edits and cannot distinguish them), with **no** repo-push badge. Use the date format the rules prescribe for that author type.
- **Tag by what changed.** Design-system buckets: variables → `TOKENS`, components → `COMPONENTS`, pages/styles → `DOCUMENTATION`. Design-file buckets: frames/screens → `SCREENS` (or `FLOWS` when whole flows change). Add multiple sections when changes span categories, and include per-section label pills only when there are 2+ sections.
- For each changed entity, inspect its current properties in the file to write a specific bullet (the diff flags *which* entity changed — the frame/component/token name — not the new value). For a changed screen, name the screen and, where discernible, what changed on it.

### 5. Refresh the baseline
After writing, store the current fingerprint back (with its scope) so the next sweep starts clean:
```js
const meta = { scope, capturedAt: Date.now(), capturedAtISO: new Date().toISOString() };
figma.root.setSharedPluginData('changelog', 'baseline', JSON.stringify({ fp, meta }));
figma.root.setSharedPluginData('changelog', 'baselineMeta', JSON.stringify(meta));
```

### 6. Sync a live-site changelog mirror (if the project has one)
Some projects render their changelog on a public docs site from a generated data file (e.g. a JSON mirror of the Figma `Entries` frame), with a "keeping the live-site changelog in sync" section in the project's own config. Check for that section. If present and step 4 wrote a new entry, follow the project's own extraction/regeneration instructions (usually prepend the new entry in the same shape as the existing ones — match the file's JSON formatting exactly to avoid noisy diffs), run whatever local verification the project defines, and commit it in that project's repo.

## Output
Report: the scope used, how many changes were found per bucket, what was logged (or "no changes — nothing logged"), and confirm the baseline was refreshed.
