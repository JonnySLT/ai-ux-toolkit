---
name: changelog-setup
description: Set up a Changelog in ANY Figma file — a design system, a design file (screens/flows), or both — so the changelog-sweep can maintain it afterward. Creates a Changelog page, an entries auto-layout container, a first seed entry styled per the changelog conventions, and captures the initial fingerprint baseline. Trigger when the user wants to add/start a changelog on a file, initialize changelog tracking, or when a sweep reports there's no Changelog page or baseline yet.
---

Bootstrap a changelog in a Figma file that doesn't have one yet. After this runs once, the `changelog-sweep` skill can maintain it. This is the **create** step; `changelog-sweep` is the **maintain** step.

## Resolve (no hardcoding)
Resolve from the current project's config (`CLAUDE.md` / `AGENTS.md`), same as `changelog-sweep`:
- **`FIGMA_FILE_KEY`** — the file to add a changelog to. Required; if it can't be resolved, ask the user for it.
- **`CHANGELOG_SCOPE`** — `design-system` | `design-file` | `all`. Infer from the file's nature if not declared (component library → `design-system`; screens/flows file → `design-file`) and confirm the choice with the user, since it fixes what future sweeps track.
- **`CHANGELOG_RULES`** — the project's changelog conventions if it has a section for them; **otherwise use this plugin's `references/changelog-conventions.md`** (the portable default: entry structure, tags, date format, badges). Read whichever applies and build to it.
- **`FINGERPRINT_SCRIPT`** — this plugin's `scripts/figma-fingerprint.js` (or the project's own copy). Read it; you embed it verbatim to capture the baseline.

## Steps

### 1. Guard against clobbering
Load `figma:figma-use`. In one `use_figma` call on `{FIGMA_FILE_KEY}`, check whether a page named `Changelog` (case-insensitive) already exists, and whether a baseline is stored (`figma.root.getSharedPluginData('changelog', 'baseline')`).
- If **both** exist → nothing to set up; tell the user to run `changelog-sweep` instead. Stop.
- If a Changelog page exists but **no baseline** → skip to step 4 (just capture the baseline).
- Otherwise → proceed to build it.

### 2. Build the Changelog page
Read `{CHANGELOG_RULES}` and build to it. In `use_figma`:
- Create a page named `Changelog`.
- Add a header (title, and a short "how this works" note is optional).
- Create the **entries auto-layout container** — a `VERTICAL` auto-layout frame named per the rules (commonly `Entries`) with the spacing the rules prescribe. This is the frame the sweep locates and prepends into.
- Prefer the project's own **design-system tokens/styles** for fills, text, and radii when the file has them (local or linked) so entries look native; otherwise use neutral defaults from the conventions doc. Bind to variables/styles rather than hardcoding where possible.

### 3. Add the first (seed) entry
Add one entry at the top of the entries container following the conventions:
- **Version** `v1.0.0` (or `v0.1.0`), **date** in the rules' format, **tag** `DOCUMENTATION`, author badge per the rules (a setup entry is `MANUAL`).
- One bullet, e.g. `Changelog started — tracking <scope> from this baseline.`
- This seed entry is also the **style template** the sweep clones for every future entry, so make it correct.

### 4. Capture the initial baseline
Embed `{FINGERPRINT_SCRIPT}` verbatim, then:
```js
const scope = /* resolved scope */;
const fp = await computeFingerprint({ scope });
const meta = { scope, capturedAt: Date.now(), capturedAtISO: new Date().toISOString() };
figma.root.setSharedPluginData('changelog', 'baseline', JSON.stringify({ fp, meta }));
figma.root.setSharedPluginData('changelog', 'baselineMeta', JSON.stringify(meta));
return { buckets: Object.fromEntries(Object.entries(fp).map(([k,v]) => [k, Object.keys(v).length])), scope };
```
Capturing the baseline **after** the page exists is fine — the `Changelog` page is excluded from the `frames` bucket by the fingerprint, so it won't show up as drift on the first sweep.

### 5. Wire up the schedule (optional)
Offer to schedule `changelog-sweep` to run periodically (e.g. weekly) via `/schedule`, pointed at this file's project config.

## Output
Report: the Changelog page + entries frame created (or that they already existed), the seed entry added, the scope, and the baseline captured (bucket counts). Note that `changelog-sweep` now maintains it.
