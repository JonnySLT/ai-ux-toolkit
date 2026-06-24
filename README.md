# Design System Toolkit

A Claude Code **plugin marketplace** — a curated set of custom skills and automations for design-system work: designing and auditing in Figma, keeping UI copy on-brand, running competitive research, and automating design-system changelogs.

Everything here is **project-agnostic**. No skill is tied to a specific company, file, or industry — each one references the design system, tokens, and conventions of **whatever project you run it in**. Add the marketplace once, then install only the plugins you need.

---

## Quick start

```text
# 1. Add this marketplace (one time)
/plugin marketplace add <git-url-of-this-repo>

# 2. Install the plugins you want
/plugin install figma-design-system@design-system-toolkit
/plugin install competitive-analysis@design-system-toolkit
/plugin install brand-voice@design-system-toolkit
/plugin install changelog-automation@design-system-toolkit
```

Install any subset — the four plugins are independent. After installing, you can also enable/disable individual skills within a plugin. Update later with `/plugin marketplace update`.

> **Tip:** Skills trigger automatically from natural language (e.g. "annotate this frame", "research these competitors", "is this copy on-brand?"). You don't call them by name — just describe what you want.

---

## What's inside — four plugins

### 🎨 `figma-design-system`
The Figma + design-system workflow. **Requires the Figma MCP server** (`use_figma`).

| Skill | Use it to… |
|---|---|
| `figma-designer` | Senior-designer knowledge for building accessible, consistent, polished UI in Figma. |
| `reattach` | Audit a raw/detached Figma frame and reconnect it to the design system — variables, text styles, and component instances (all discovered at runtime). |
| `annotate` | Place annotation cards beside a screen, each pointing at a component with specs, tokens, icons, and dev-handoff notes. |

> `annotate` uses the **`Annotation` component that lives in the file you're annotating** — it never pulls from another file. If the file has none, it offers to build one bound to that project's own tokens. Annotation cards always sit **32px** from the frame.

### 🔍 `competitive-analysis`
| Skill | Use it to… |
|---|---|
| `competitive-analysis` | Live teardown of 3–6 products — browses each in real time and delivers a comparison matrix, written narrative, and opportunities/gaps. Can push findings into a Figma doc page. |

### ✍️ `brand-voice`
| Skill | Use it to… |
|---|---|
| `brand-voice-tone` | Review and rewrite UI copy to match a project's brand voice. Loads the **voice profile from the project** (a brand file, or a quick interview) and applies it — so it works for any brand or industry. |

### 🔁 `changelog-automation`
| Skill | Use it to… |
|---|---|
| `design-system-changelog-sweep` | Diff a design-system Figma file against a stored fingerprint baseline and auto-log any drift to the file's Changelog page. |

Includes `scripts/figma-fingerprint.js` — the canonical fingerprint algorithm. Built to **run on a schedule**: after installing, schedule it weekly with `/schedule`. It resolves the target file key, fingerprint script, and changelog rules from the **project's own config** (its `CLAUDE.md`/`AGENTS.md`), so the same routine works across every project. **Requires the Figma MCP server.**

---

## Companion design skills (not bundled here)

You may use a broader set of design-process skills alongside this toolkit — `design-flow`, `grill-me`, `design-brief`, `information-architecture`, `design-tokens`, `brief-to-tasks`, `frontend-design`, and `design-review`. **These are not part of this marketplace and aren't mine to redistribute.** They're an excellent open-source set by **Julian Oczkowski**: [github.com/julianoczkowski/designer-skills](https://github.com/julianoczkowski/designer-skills).

Install them directly with the `skills` CLI — the interactive prompt lets you choose which skills, which agents, and project vs. global scope:

```text
npx skills add julianoczkowski/designer-skills
```

This marketplace bundles only my own custom skills; the plugins above are designed to work happily alongside Julian's set.

---

## Requirements

- **Claude Code** with plugin support.
- **Figma MCP server** (`use_figma`) for `figma-design-system` and `changelog-automation`. `brand-voice` needs nothing; `competitive-analysis` needs a browser the skill can drive (and the Figma MCP only if you push findings into Figma).
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
    │   └── skills/{figma-designer,reattach,annotate}/SKILL.md
    ├── competitive-analysis/
    │   ├── .claude-plugin/plugin.json
    │   └── skills/competitive-analysis/SKILL.md
    ├── brand-voice/
    │   ├── .claude-plugin/plugin.json
    │   └── skills/brand-voice-tone/SKILL.md
    └── changelog-automation/
        ├── .claude-plugin/plugin.json
        ├── skills/design-system-changelog-sweep/SKILL.md
        └── scripts/figma-fingerprint.js
```

## License

[MIT](LICENSE) © 2026 Jonny Bennett.
