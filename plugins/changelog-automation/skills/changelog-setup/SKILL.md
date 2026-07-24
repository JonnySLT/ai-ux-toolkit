---
name: changelog-setup
description: Set up a Changelog in ANY Figma file — a design system, a design file (screens/flows), or both — so the changelog-sweep can maintain it afterward. Creates a Changelog page, an entries auto-layout container, a first seed entry styled per the changelog conventions, captures the initial fingerprint baseline, AND schedules a recurring sweep (default weekly Mondays 9am, day/time configurable). Trigger when the user wants to add/start a changelog on a file, initialize changelog tracking, schedule automatic changelog updates, or when a sweep reports there's no Changelog page or baseline yet.
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

### 5. Schedule the recurring sweep
Setting up a changelog is only useful if it stays current, so **wire up a recurring `changelog-sweep` as part of setup** — don't leave it as a vague "you could schedule this." Follow `references/scheduled-sweep.md`:
- **Propose the default cadence — weekly, Mondays at 9:00 AM local (`cron: 0 9 * * 1`)** — and ask the user to confirm or give a different **day and time**. Translate their plain-language answer to a cron expression (the reference has a cheat-sheet). Only skip creation if they decline a schedule outright.
- **Register the task** with the environment's scheduler — a `create_scheduled_task`-style MCP tool if one is connected, otherwise `/schedule`. Fill the reference's **task-prompt template** with the values you resolved (`FIGMA_FILE_KEY`, `CHANGELOG_SCOPE`, the absolute `FINGERPRINT_SCRIPT` and `CHANGELOG_RULES` paths). The prompt must be **fully self-contained** — each run is a fresh session with no memory of this setup — so bake those resolved values in rather than telling the run to "resolve from project config." Use a stable task id like `<file-slug>-changelog-sweep`.
- **Tell the user how to change it later** — update the task's cron for a new day/time, or disable/delete it to pause; the baseline stays in the file either way.

## Output
Report: the Changelog page + entries frame created (or that they already existed), the seed entry added, the scope, the baseline captured (bucket counts), and **the recurring sweep scheduled** (its cadence, e.g. "weekly, Mondays 9:00 AM") — or that the user declined a schedule. Note that `changelog-sweep` now maintains it, and remind them the day/time is easy to change.
