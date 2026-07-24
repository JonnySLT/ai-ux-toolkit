# changelog-automation

Add and maintain a **Changelog** on any Figma file — a **design system**, a **design file** (screens/flows), or **both**.

- **changelog-setup** — bootstrap a changelog on a file that doesn't have one: creates the `Changelog` page, an `Entries` container, a styled seed entry, and captures the initial fingerprint baseline.
- **changelog-sweep** — diff the file against its stored baseline and auto-log any drift (added / removed / changed components, variables, styles **and/or** screens/frames) to the Changelog page. Built to run on a schedule.

Bundled:
- `scripts/figma-fingerprint.js` — the canonical fingerprint algorithm. Deep-hashes pages, components, variables, text/effect styles, and — in `design-file`/`all` scope — top-level **frames/screens**. Scoped via `computeFingerprint({ scope })`: `design-system` (default, backward compatible), `design-file`, or `all`.
- `references/changelog-conventions.md` — a portable **default entry structure** (page/container, entry layout, tags, dates, badges) used when a project doesn't define its own `CHANGELOG_RULES`.

**Requires the Figma MCP server (`use_figma`).** After installing, run `changelog-setup` once on a file, then schedule `changelog-sweep` (e.g. weekly) with `/schedule`.

**Project-agnostic:** the routines hardcode nothing. At run time they resolve the Figma file key, the **scope**, the fingerprint-script path, and the changelog conventions from the **current project's own config** (`CLAUDE.md` / `AGENTS.md`) — with sensible fallbacks (bundled conventions, inferred scope) — and discover all node/variable IDs dynamically. So the same routines work across every project **and every file type**.

Install: `/plugin install changelog-automation@ai-ux-toolkit`
