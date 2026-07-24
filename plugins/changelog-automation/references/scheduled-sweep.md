# Scheduling a recurring changelog sweep

`changelog-setup` finishes by wiring up a **recurring `changelog-sweep`** so drift gets
logged automatically instead of only when someone remembers to run it. This file is the
portable building block for that step: the default cadence, how the user changes the day
and time, and the self-contained task prompt to register.

## Default cadence

**Weekly — Mondays at 9:00 AM local time** (`cron: 0 9 * * 1`). A start-of-week sweep
catches anything that changed the previous week and posts it before standups. It's a
sensible default, **not** a mandate — always offer to change the day/time before creating
the task, and tell the user how to change it later.

## Changing the day and time

The schedule is a standard 5-field cron expression evaluated in the user's **local**
timezone: `minute hour dayOfMonth month dayOfWeek` (`dayOfWeek`: 0/7 = Sunday … 1 = Monday
… 6 = Saturday).

| Want | cron |
|---|---|
| Mondays 9:00 AM (default) | `0 9 * * 1` |
| Fridays 5:00 PM | `0 17 * * 5` |
| Every weekday 8:30 AM | `30 8 * * 1-5` |
| Daily 7:00 AM | `0 7 * * *` |
| 1st of each month, 9:00 AM | `0 9 1 * *` |

Ask the user for a day + time in plain language and translate it to cron. If they decline a
schedule entirely, skip creation — they can run `changelog-sweep` by hand any time, or
schedule it later.

## How to register it

Use whatever scheduler the environment provides, in this order:
1. A **scheduled-task MCP tool** if one is connected (e.g. a `create_scheduled_task` tool) —
   pass the `cronExpression`, a one-line `description`, and the **full prompt below** with
   the placeholders filled in.
2. Otherwise the **`/schedule`** command, handing it the same cron + prompt.

Each scheduled run starts fresh with no memory of the setup conversation, so the prompt
must be **fully self-contained** — that's why the resolved file key, scope, and absolute
script/rules paths are baked into it rather than "resolved from project config."

## Task prompt template

Fill every `{{PLACEHOLDER}}` with the value resolved during setup, then register it. Give
the task a stable id like `{{FILE_SLUG}}-changelog-sweep`.

```
Run the recurring changelog sweep for **{{FILE_LABEL}}** (a Figma {{FILE_KIND}}). Diff the
file's current state against its stored fingerprint baseline and auto-log any drift to its
Changelog page. Each run is fresh with no memory, so everything you need is below.

## Fixed parameters for this file
- FIGMA_FILE_KEY: `{{FIGMA_FILE_KEY}}`
- CHANGELOG_SCOPE: `{{SCOPE}}`   (design-system | design-file | all — the scope the baseline was captured with)
- FINGERPRINT_SCRIPT: `{{ABSOLUTE_PATH_TO_figma-fingerprint.js}}`
- CHANGELOG_RULES: `{{ABSOLUTE_PATH_TO_changelog-conventions.md_OR_project_rules}}`

## Steps
1. Read FINGERPRINT_SCRIPT. Embed it verbatim in the use_figma call — never hand-rewrite it,
   the hashes must line up with the baseline.
2. Load the `figma:figma-use` skill FIRST (mandatory before any use_figma call; pass
   skillNames: "figma-use"). In a SINGLE use_figma call on FIGMA_FILE_KEY:
   - Embed the fingerprint script verbatim at the top.
   - `const raw = figma.root.getSharedPluginData('changelog','baseline')` — if empty, STOP
     and report the file has no baseline (changelog-setup must run first).
   - `const { fp: base, meta } = JSON.parse(raw)`
   - `const scope = (meta && meta.scope) || '{{SCOPE}}'`
   - `const fp = await computeFingerprint({ scope })`
   - `const diff = computeFingerprint.diff(base, fp)`
   - `return { diff, fp, scope }`
3. If every bucket in the diff has zero added/removed/changed, report "No changes — nothing
   logged." and stop.
4. Otherwise read CHANGELOG_RULES and write ONE new entry at the top of the Changelog page.
   Resolve everything dynamically from the file — never hardcode node/variable IDs:
   - Find the `Changelog` page, then its `Entries` auto-layout container; insert with
     `entriesFrame.insertChild(0, entry)`.
   - CLONE the most recent existing entry (Entries' first child) for all styling, then edit
     its text nodes. Load each text node's CURRENT font before writing. Cloning keeps the
     entry bound to the file's own tokens without hardcoding anything.
   - Version: increment the patch from the most recent entry's name/title.
   - Date: the format CHANGELOG_RULES prescribes (default `MMM D, YYYY`). Author badge:
     `MANUAL` (a sweep can't attribute edits). Tag by what changed — design-system buckets:
     variables → `TOKENS`, components → `COMPONENTS`, pages/styles → `DOCUMENTATION`;
     design-file bucket: frames/screens → `SCREENS` (or `FLOWS`). Multiple sections only
     when 2+ categories changed.
   - One specific bullet per changed entity, naming it and what changed.
5. Refresh the baseline so the next run starts clean:
   `const m = { scope, capturedAt: Date.now(), capturedAtISO: new Date().toISOString() };`
   `figma.root.setSharedPluginData('changelog','baseline', JSON.stringify({ fp, meta: m }));`
   `figma.root.setSharedPluginData('changelog','baselineMeta', JSON.stringify(m));`

## Output
Report the scope, changes per bucket, what was logged (or "no changes"), and that the
baseline was refreshed.

## Notes
- The Figma MCP (use_figma) must be connected — if not, report and stop without changing anything.
- The `Changelog` page is auto-excluded from the fingerprint's `frames` bucket, so the sweep
  never flags its own writes as drift.
```

## Changing or removing it later

- **Change the day/time:** update the task's `cronExpression` (translate the new day/time
  using the table above) via the scheduler's update tool or `/schedule`.
- **Pause/stop:** disable or delete the task in the scheduler. The baseline stays in the
  file, so re-enabling later resumes cleanly.
