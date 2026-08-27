# ai-ux-toolkit

A Claude Code plugin marketplace of UX design and research skills — 24 plugins / 39 skills,
organized by workflow phase.

**Conventions live in [README.md](README.md), not here.** Its *Conventions* section is the single
source of truth for adding a plugin, version bumping, and the vendored-skill rules. Two that bite
most often:

- **Never edit the five vendored † plugins' skill files** — they're kept byte-identical to upstream.
- **Bump the plugin's `version` in both `plugins/<name>/.claude-plugin/plugin.json` and its
  `.claude-plugin/marketplace.json` entry on any change.** `claude plugin update` compares versions,
  not content, so shipping changed skills under an unchanged version silently leaves every existing
  install on the old files. `scripts/validate.mjs` fails if the two disagree.

Run `node scripts/validate.mjs` before pushing; CI runs it on every push and PR.

## Agent skills

### Issue tracker

Issues and PRDs live as GitHub issues on `JonnySLT/ai-ux-toolkit`, managed with the `gh` CLI.
See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles map 1:1 to label strings of the same name, matching
`design-system-demo`. Only `wontfix` exists on the repo today; the other four are created on
first use. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. Neither exists yet — they're
created lazily by `/grill-with-docs`, so treat their absence as normal.
See `docs/agents/domain.md`.
