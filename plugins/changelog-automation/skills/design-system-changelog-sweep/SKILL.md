---
name: design-system-changelog-sweep
description: Run a design-system changelog sweep on a Figma file — fingerprint the current state, diff it against a stored baseline to detect drift (added, removed, or changed components, variables, and styles), and auto-log any changes to the file's Changelog page. Resolves the target file key, fingerprint script, and changelog rules from the project's own config, so it works across projects and on a schedule. Trigger when the user wants to run the changelog sweep, check for design-system drift or changes, update the changelog, or schedule a weekly design-system check.
---

Run the weekly changelog sweep for a design system Figma file: diff the current Figma state against a stored fingerprint baseline and auto-log any drift to the file's Changelog page.

## Resolve the project's design system (no hardcoding)

This routine is **generic** — it hardcodes nothing about any one project. It runs against **whatever design system the project it's scheduled for declares**. At the start of every run, resolve these from the **current project's own config** (its `CLAUDE.md`, or `AGENTS.md` / a `design-system` config file):

- **`FIGMA_FILE_KEY`** — the design system Figma file key. Projects document this (e.g. a header line like `Figma — <DS name> (<fileKey>)`, or a `figmaFileKey:` field). Extract it.
- **`FINGERPRINT_SCRIPT`** — the path to the canonical fingerprint algorithm (typically `scripts/figma-fingerprint.js` in the design-system repo, or referenced in the project config). Embed it verbatim.
- **`CHANGELOG_RULES`** — the project's changelog conventions (its Changelog-rules section).

If any of these can't be resolved from the project config, report what's missing and stop — don't guess a file key. Everything else (the Changelog page, its entries frame, badge styles, variable IDs) is **discovered dynamically from the file at runtime** — never hardcode node or variable IDs, they differ per file.

> Because the values come from the project's own config, the **same routine works across every project** without edits — it always references that project's design system.

## Context
The design system stores a fingerprint baseline in Figma shared plugin data (namespace `changelog`, key `baseline`). Each week, diff the current Figma state against that baseline to detect changes made directly in Figma (by a human, or by Claude in a prior session that didn't refresh the baseline), and auto-log them to the Changelog page.

## Steps

### 1. Read the fingerprint script
Read `{FINGERPRINT_SCRIPT}`. You will embed it verbatim in your use_figma call (never hand-rewrite the algorithm — the hashes must line up with the baseline).

### 2. Compute the diff
In a single use_figma call on `{FIGMA_FILE_KEY}`:
- Embed the full contents of the fingerprint script verbatim at the top
- `const fp = await computeFingerprint()`
- `const raw = figma.root.getSharedPluginData('changelog', 'baseline')`
- `const { fp: base } = JSON.parse(raw)`
- `const diff = computeFingerprint.diff(base, fp)`
- Return `{ diff, fp }`

### 3. Decide whether to log
If every bucket in the diff has zero added/removed/changed entries, do nothing and stop — the file is in sync.

### 4. Write the changelog entry
If there are changes, write a changelog entry following the rules in `{CHANGELOG_RULES}`. Resolve everything **dynamically from the file** — do not hardcode node or variable IDs:
- **Find the Changelog page** by name, then its **entries auto-layout container** (the frame that holds the existing entries). Insert the new entry at the top with `entriesFrame.insertChild(0, entry)`.
- **Clone the most recent existing entry** (the entries container's first child) for all fills, fonts, padding, and badge pills — never hardcode colours or variable IDs. Cloning keeps the entry styled correctly and portable across files. (If the project's rules specify how to build pills from scratch, follow those; otherwise cloning is sufficient.)
- **Version**: increment the patch from the most recent entry's name/title.
- **Date / tag / author badge**: follow `{CHANGELOG_RULES}`. For a sweep, entries are authored `MANUAL` (the sweep detects human/unattributed edits and cannot distinguish them), with **no** repo-push badge. Use the date format the rules prescribe for that author type.
- **Tag** by what changed (e.g. variables → TOKENS, components → COMPONENTS, pages/styles → DOCUMENTATION); add multiple sections if changes span categories, and include per-section label pills only when there are 2+ sections.
- For each changed entity, inspect its current properties in the file to write a specific bullet (the diff flags *which* entity changed, not the new value).

### 5. Refresh the baseline
After writing, store the current fingerprint back so the next sweep starts clean:
```js
figma.root.setSharedPluginData('changelog', 'baseline', JSON.stringify({ fp, meta: { capturedAt: Date.now(), capturedAtISO: new Date().toISOString() } }))
figma.root.setSharedPluginData('changelog', 'baselineMeta', JSON.stringify({ capturedAt: Date.now(), capturedAtISO: new Date().toISOString() }))
```

## Output
Report: how many changes were found per bucket, what was logged (or "no changes — nothing logged"), and confirm the baseline was refreshed.
