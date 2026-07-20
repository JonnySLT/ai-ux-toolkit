# prompt-builder

- **prompt-builder** — brief Claude properly before it starts. Turns a rough ask into a complete, self-contained prompt: scans the project first so it never asks for what Claude can discover itself, interviews you briefly for the genuine gaps (goal, definition of done, constraints, references, output format), then delivers a polished copyable prompt and offers to run it on the spot. Paste in a draft prompt instead and it audits and upgrades it.

**Meta, not phase-bound.** This plugin doesn't belong to any workflow phase — it sits *in front of* all of them. Use it to write a better brief for any other skill in this toolkit (or any Claude task at all). It also spots standing rules in your answers — "we always use tokens", "output goes in /docs" — and offers to promote them into `CLAUDE.md`, memory, or a new skill, so every future prompt gets shorter.

**Ships ask-first routing for the whole toolkit.** Because it's the meta plugin, `prompt-builder` also carries a `SessionStart` hook that installs the toolkit's **ask-first routing** behavior automatically — no editing your `CLAUDE.md`. When a request could map to several skills (e.g. "review this screen" → `accessibility-check` / `heuristic-review` / `design-review` / `usability-testing`), Claude names the overlap and asks which you want instead of silently picking one. Unambiguous requests still route straight through. On by default once installed; to turn it off, uninstall `prompt-builder` (or remove `hooks/hooks.json`).

**Project-agnostic.** No external services required. Triggers from natural language ("help me write a prompt", "improve this prompt", "what context do you need?", "am I giving you enough context?").

Install: `/plugin install prompt-builder@ai-ux-toolkit`
