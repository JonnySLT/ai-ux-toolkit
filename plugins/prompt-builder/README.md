# prompt-builder

- **prompt-builder** — brief Claude properly before it starts. Turns a rough ask into a complete, self-contained prompt: scans the project first so it never asks for what Claude can discover itself, interviews you briefly for the genuine gaps (goal, definition of done, constraints, references, output format), then delivers a polished copyable prompt and offers to run it on the spot. Paste in a draft prompt instead and it audits and upgrades it.

**Meta, not phase-bound.** This plugin doesn't belong to any workflow phase — it sits *in front of* all of them. Use it to write a better brief for any other skill in this toolkit (or any Claude task at all). It also spots standing rules in your answers — "we always use tokens", "output goes in /docs" — and offers to promote them into `CLAUDE.md`, memory, or a new skill, so every future prompt gets shorter.

**Ships two standing rules for the whole toolkit.** Because it's the meta plugin, `prompt-builder` carries a `SessionStart` hook that installs both automatically — no editing your `CLAUDE.md`:

- **Ask-first routing.** When a request could map to several skills (e.g. "review this screen" → `accessibility-check` / `heuristic-review` / `design-review` / `usability-testing`), Claude names the overlap and asks which you want instead of silently picking one. Unambiguous requests still route straight through.
- **House document voice (SLT).** Every *written deliverable* — research, plans, briefs, syntheses, personas/journeys, IA, specs, user stories, changelog entries, analyses, prompts — is written in the [SLT Voice & Tone](hooks/slt-voice-and-tone.md). This does **not** touch UI / screen copy: microcopy inside a designed screen or prototype (`content-design`, `states-and-edge-cases`, and text built with `figma-design-system` / `frontend-design` / `rapid-prototype`) follows the *project's brand voice* via the `brand-voice` plugin. Rule of thumb: words inside the product → brand voice; words in a document about the work → SLT voice.

On by default once installed; to turn either off, uninstall `prompt-builder` (or edit `hooks/hooks.json`). A manual, project-scoped mirror lives in [`templates/CLAUDE.md`](../../templates/CLAUDE.md).

**No external services required.** Triggers from natural language ("help me write a prompt", "improve this prompt", "what context do you need?", "am I giving you enough context?"). *(The SLT house voice is the one project-specific default this toolkit bakes in — everything else stays brand-agnostic.)*

Install: `/plugin install prompt-builder@ai-ux-toolkit`
