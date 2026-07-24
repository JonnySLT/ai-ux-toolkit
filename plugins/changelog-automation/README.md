# changelog-automation

Add and maintain a **Changelog** on any Figma file — a **design system**, a **design file** (screens/flows), or **both**.

- **changelog-setup** — bootstrap a changelog on a file that doesn't have one: creates the `Changelog` page, an `Entries` container, a styled seed entry, captures the initial fingerprint baseline, **and schedules the recurring sweep** (default **weekly, Mondays 9 AM** — day/time configurable).
- **changelog-sweep** — diff the file against its stored baseline and auto-log any drift (added / removed / changed components, variables, styles **and/or** screens/frames) to the Changelog page. Built to run on a schedule.

Bundled:
- `scripts/figma-fingerprint.js` — the canonical fingerprint algorithm. Deep-hashes pages, components, variables, text/effect styles, and — in `design-file`/`all` scope — top-level **frames/screens**. Scoped via `computeFingerprint({ scope })`: `design-system` (default, backward compatible), `design-file`, or `all`.
- `references/changelog-conventions.md` — a portable **default entry structure** (page/container, entry layout, tags, dates, badges) used when a project doesn't define its own `CHANGELOG_RULES`.
- `references/scheduled-sweep.md` — the recurring-sweep **task-prompt template + cron cheat-sheet** `changelog-setup` uses to schedule (and let the user re-time) automatic sweeps.

**Requires the Figma MCP server (`use_figma`).** After installing, just run `changelog-setup` once on a file — it builds the changelog **and** schedules the recurring `changelog-sweep` for you (weekly Mondays 9 AM by default; confirm or pick another day/time when prompted, and change it any time via `/schedule` or the scheduler).

**Project-agnostic:** the routines hardcode nothing. At run time they resolve the Figma file key, the **scope**, the fingerprint-script path, and the changelog conventions from the **current project's own config** (`CLAUDE.md` / `AGENTS.md`) — with sensible fallbacks (bundled conventions, inferred scope) — and discover all node/variable IDs dynamically. So the same routines work across every project **and every file type**.

Install: `/plugin install changelog-automation@ai-ux-toolkit`
