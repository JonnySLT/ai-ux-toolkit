# Design System Toolkit

A Claude Code **plugin marketplace** — a curated set of skills and automations for design-system work: designing and auditing in Figma, running the product-design process, keeping UI copy on-brand, and automating design-system changelogs.

Everything here is **project-agnostic**. No skill is tied to a specific company, file, or industry — each one references the design system, tokens, and conventions of **whatever project you run it in**. Add the marketplace once, then install only the plugins you need.

---

## Quick start

```text
# 1. Add this marketplace (one time)
/plugin marketplace add <git-url-of-this-repo>

# 2. Install the plugins you want
/plugin install figma-design-system@design-system-toolkit
/plugin install design-process@design-system-toolkit
/plugin install brand-voice@design-system-toolkit
/plugin install changelog-automation@design-system-toolkit
```

Install any subset — the four plugins are independent. After installing, you can also enable/disable individual skills within a plugin if you only want some of them. Update later with `/plugin marketplace update`.

> **Tip:** Skills trigger automatically from natural language (e.g. "annotate this frame", "write a design brief", "is this copy on-brand?"). You don't call them by name — just describe what you want.

---

## What's inside — the four plugins

### 🎨 `figma-design-system`
The Figma + design-system workflow. **Requires the Figma MCP server** (`use_figma`).

| Skill | Use it to… |
|---|---|
| `figma-designer` | Senior-designer knowledge for building accessible, consistent, polished UI in Figma. |
| `design-tokens` | Generate a design-tokens file (CSS variables or Tailwind) with light/dark palettes, spacing, type, and component tokens. |
| `reattach` | Audit a raw/detached Figma frame and reconnect it to the design system — variables, text styles, and component instances (all discovered at runtime). |
| `annotate` | Place annotation cards beside a screen, each pointing at a component with specs, tokens, icons, and dev-handoff notes. |

> `annotate` uses the **`Annotation` component that lives in the file you're annotating** — it never pulls from another file. If the file has none, it offers to build one bound to that project's own tokens. Annotation cards always sit **32px** from the frame.

### 🧭 `design-process`
The end-to-end product-design workflow. `design-flow` orchestrates the others, so they ship together.

| Skill | Use it to… |
|---|---|
| `design-flow` | Run the full design-to-build sequence, orchestrating the skills below. |
| `design-brief` | Create a design brief via an interactive interview + codebase exploration. |
| `information-architecture` | Define navigation, content hierarchy, page structure, and user flows. |
| `competitive-analysis` | Live competitive teardown of 3–6 products with a comparison matrix. |
| `frontend-design` | Build distinctive, production-grade frontend UI guided by aesthetic philosophies. |
| `design-review` | Structured critique against the brief — hierarchy, consistency, a11y, fidelity. |
| `brief-to-tasks` | Break a brief into an ordered, independently-buildable task checklist. |

### ✍️ `brand-voice`
| Skill | Use it to… |
|---|---|
| `brand-voice-tone` | Review and rewrite UI copy to match a project's brand voice. Loads the **voice profile from the project** (a brand file, or a quick interview) and applies it — so it works for any brand or industry. |

### 🔁 `changelog-automation`
| Skill | Use it to… |
|---|---|
| `design-system-changelog-sweep` | Diff a design-system Figma file against a stored fingerprint baseline and auto-log any drift to the file's Changelog page. |

Includes `scripts/figma-fingerprint.js` — the canonical fingerprint algorithm. This skill is built to **run on a schedule**: after installing, schedule it weekly with `/schedule` (or your scheduled-tasks runner). It resolves the target file key, fingerprint script, and changelog rules from the **project's own config** (its `CLAUDE.md`/`AGENTS.md`), so the same routine works across every project.

---

## Requirements

- **Claude Code** with plugin support.
- **Figma MCP server** (`use_figma`) for `figma-design-system` and `changelog-automation`. The design-process and brand-voice plugins don't need it.
- For `changelog-automation`: the target project should declare its design-system Figma file key in its `CLAUDE.md`/`AGENTS.md`, and keep a `figma-fingerprint.js` in its repo (a reference copy is bundled here).

## How it's designed to stay reusable

- **No hardcoded files or companies.** Figma skills resolve the component/tokens from the current file; the voice skill loads a per-project profile; the changelog routine reads the project's own config. Drop any plugin into a new project and it adapts.
- **Pick à la carte.** Four independent plugins; install only what you need, disable individual skills if you want even less.

## Repository layout

```text
design-system-toolkit/
├── .claude-plugin/marketplace.json     # marketplace catalog (lists the 4 plugins)
├── README.md                           # this file
└── plugins/
    ├── figma-design-system/
    │   ├── .claude-plugin/plugin.json
    │   └── skills/{figma-designer,design-tokens,reattach,annotate}/SKILL.md
    ├── design-process/
    │   ├── .claude-plugin/plugin.json
    │   └── skills/{design-flow,design-brief,information-architecture,competitive-analysis,frontend-design,design-review,brief-to-tasks}/SKILL.md
    ├── brand-voice/
    │   ├── .claude-plugin/plugin.json
    │   └── skills/brand-voice-tone/SKILL.md
    └── changelog-automation/
        ├── .claude-plugin/plugin.json
        ├── skills/design-system-changelog-sweep/SKILL.md
        └── scripts/figma-fingerprint.js
```

## License

Add a license of your choice (e.g. MIT) before sharing publicly.
