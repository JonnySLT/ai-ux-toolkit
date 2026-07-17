# changelog-automation

- **design-system-changelog-sweep** — diff a design-system Figma file against a stored fingerprint baseline and auto-log any drift to the file's Changelog page.

Bundled: `scripts/figma-fingerprint.js` — the canonical fingerprint algorithm (deep-hashes pages, components, variables, text/effect styles). Drop a copy into a project's design-system repo if it doesn't have one.

**Requires the Figma MCP server (`use_figma`).** Built to run on a schedule — after installing, schedule it weekly with `/schedule`.

**Project-agnostic:** the routine hardcodes nothing. At run time it resolves the Figma file key, the fingerprint-script path, and the changelog conventions from the **current project's own config** (its `CLAUDE.md` / `AGENTS.md`), and discovers all node/variable IDs dynamically — so the same routine works across every project.

Install: `/plugin install changelog-automation@ai-ux-toolkit`
