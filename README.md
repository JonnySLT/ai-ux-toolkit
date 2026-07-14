# AI UX Toolkit

A Claude Code **plugin marketplace** — a curated set of skills and automations for UX designers, spanning the whole workflow: synthesising research, planning and grilling a brief, exploring divergent ideas, defining information architecture, designing and auditing in Figma, generating tokens, building frontends, checking accessibility and usability, prototyping fast, reviewing, keeping copy on-brand, researching competitors, and documenting design systems for handoff.

Everything here is **project-agnostic**. No skill is tied to a specific company, file, or industry — each one references the design system, tokens, voice, and conventions of **whatever project you run it in**. Add the marketplace once, then install only the plugins you need.

> **Original + vendored.** Most plugins are original to this toolkit. Five (`design-planning`, `information-architecture`, `design-tokens`, `frontend-design`, `design-review`) are vendored **verbatim** from Julian Oczkowski's excellent [designer-skills](https://github.com/julianoczkowski/designer-skills) under the Apache-2.0 licence, so the whole workflow installs from one place — see [Attribution](#attribution--third-party-skills).

> Formerly `design-system-toolkit`. The scope has broadened from design-system work to the full UX-design workflow, so the marketplace was renamed to `ai-ux-toolkit`. If you installed the old marketplace, re-add it under the new name (see Quick start) and reinstall — install references now use `@ai-ux-toolkit`.

---

## Quick start

```text
# 1. Add this marketplace (one time)
/plugin marketplace add <git-url-of-this-repo>

# 2. Install the plugins you want
/plugin install research-planning@ai-ux-toolkit
/plugin install ux-research@ai-ux-toolkit
/plugin install competitive-analysis@ai-ux-toolkit
/plugin install synthesis-artifacts@ai-ux-toolkit
/plugin install design-planning@ai-ux-toolkit
/plugin install ideation@ai-ux-toolkit
/plugin install prioritization@ai-ux-toolkit
/plugin install information-architecture@ai-ux-toolkit
/plugin install figma-design-system@ai-ux-toolkit
/plugin install design-tokens@ai-ux-toolkit
/plugin install frontend-design@ai-ux-toolkit
/plugin install content-design@ai-ux-toolkit
/plugin install accessibility-heuristics@ai-ux-toolkit
/plugin install design-review@ai-ux-toolkit
/plugin install usability-testing@ai-ux-toolkit
/plugin install rapid-prototyping@ai-ux-toolkit
/plugin install handoff-docs@ai-ux-toolkit
/plugin install brand-voice@ai-ux-toolkit
/plugin install changelog-automation@ai-ux-toolkit
/plugin install product-analytics@ai-ux-toolkit
```

Install any subset — the plugins are independent. After installing, you can also enable/disable individual skills within a plugin. Update later with `/plugin marketplace update`.

> **Tip:** Skills trigger automatically from natural language (e.g. "synthesise these interviews", "give me 10 concepts", "check this for accessibility", "prototype this flow"). You don't call them by name — just describe what you want.

---

## What's inside — organised by workflow phase

Twenty plugins, grouped by where they fall in a typical design process. Every skill is project-agnostic. Skills marked **†** are vendored from Julian Oczkowski's [designer-skills](https://github.com/julianoczkowski/designer-skills) (Apache-2.0) — see [Attribution](#attribution--third-party-skills).

### 🔬 Research — `research-planning`, `ux-research`, `competitive-analysis`

| Skill | Plugin | Use it to… |
|---|---|---|
| `research-planning` | research-planning | Plan and instrument research *before* you collect it — choose the method, then draft interview guides, usability-test scripts, survey questionnaires, and recruiting screeners (non-leading, with consent and realistic sample sizes). |
| `research-synthesis` | ux-research | Feed in interview transcripts, survey responses, or support tickets → themes, evidence-backed insights, frequency/severity, and prioritised opportunities. The coding pass that would take hours by hand. |
| `competitive-analysis` | competitive-analysis | Live teardown of 3–6 products — browses each in real time and delivers a comparison matrix, narrative, and opportunities/gaps. Can push findings into a Figma doc page. |

### 📝 Define & plan — `synthesis-artifacts`, `design-planning`

| Skill | Plugin | Use it to… |
|---|---|---|
| `personas` | synthesis-artifacts | Build evidence-based personas & JTBD statements from real research (flags thin data instead of inventing demographics). |
| `journey-map` | synthesis-artifacts | Map an end-to-end experience — stages, actions, thoughts, emotion curve, pain points, and opportunities. |
| `success-metrics` | synthesis-artifacts | Define what success looks like *before* building — HEART and goal → signal → metric, with guardrail metrics. |
| `design-brief` **†** | design-planning | Create a design brief through an interactive interview, codebase exploration, and experience-design decisions. |
| `grill-me` **†** | design-planning | Get interviewed relentlessly about a plan or design until you reach shared understanding. |
| `brief-to-tasks` **†** | design-planning | Break a brief into an ordered checklist of independently buildable tasks (vertical slices). |
| `design-flow` **†** | design-planning | The full design-to-build orchestrator — runs the whole sequence from grilling through review. Expects the other vendored plugins installed. |

### 💡 Ideate — `ideation`, `prioritization`

| Skill | Plugin | Use it to… |
|---|---|---|
| `divergent-exploration` | ideation | Generate a wide, deliberately-spread set of concepts, copy variants, or IA/layout options — spanning safe → bold — so you break fixation early and edit rather than start blank. |
| `prioritization` | prioritization | Turn a list of ideas, features, or fixes into a defensible ranked order (RICE, impact/effort, MoSCoW, Kano) — with quick wins and the assumptions surfaced. |

### 🗂️ Structure — `information-architecture`

| Skill | Use it to… |
|---|---|
| `information-architecture` **†** | Define the structural layer before visual design — navigation, content hierarchy, page structure, URL patterns, and user flows. |

### 🎨 Design — `figma-design-system`, `design-tokens`, `frontend-design`
The Figma + design-system workflow **requires the Figma MCP server** (`use_figma`).

| Skill | Plugin | Use it to… |
|---|---|---|
| `figma-designer` | figma-design-system | Senior-designer knowledge for building accessible, consistent, polished UI in Figma. |
| `reattach` | figma-design-system | Audit a raw/detached Figma frame and reconnect it to the design system — variables, text styles, and component instances (all discovered at runtime). |
| `annotate` | figma-design-system | Place annotation cards beside a screen, each pointing at a component with specs, tokens, icons, and dev-handoff notes. |
| `design-tokens` **†** | design-tokens | Generate a design tokens file (CSS variables or Tailwind config) — light/dark palettes, spacing scale, type ramp, component-level tokens. |
| `frontend-design` **†** | frontend-design | Build distinctive, production-grade frontend interfaces guided by named aesthetic philosophies. |

> `annotate` uses the **`Annotation` component that lives in the file you're annotating** — it never pulls from another file. If the file has none, it offers to build one bound to that project's own tokens. Annotation cards always sit **32px** from the frame.

### ✍️ Content — `content-design`

| Skill | Use it to… |
|---|---|
| `content-design` | Write functional UI microcopy systematically — errors, empty states, buttons, labels, confirmations, onboarding. Decides *what to say*; pair with `brand-voice` for tone. |
| `states-and-edge-cases` | Enumerate every state and edge case a screen must handle (empty, loading, error, offline, permission, overflow…) so they're designed on purpose, not found in production. |

### ✅ Check — `accessibility-heuristics`, `design-review`, `usability-testing`

| Skill | Plugin | Use it to… |
|---|---|---|
| `accessibility-check` | accessibility-heuristics | First-pass WCAG check on a screenshot, Figma frame, URL, or code — contrast, labels, focus, target size, structure. Cites the success criterion and a fix per finding. |
| `heuristic-review` | accessibility-heuristics | Evaluate a screen or flow against Nielsen's 10 usability heuristics, scored by severity with concrete fixes. |
| `design-review` **†** | design-review | Broad, holistic design critique against the brief — visual hierarchy, consistency, responsiveness, accessibility, and aesthetic fidelity. |
| `usability-testing` | usability-testing | Plan, moderate, and analyse a usability study with **real users** — tasks, success criteria, task-level metrics, and severity-rated findings. |

> `accessibility-check`, `heuristic-review`, and `design-review` are **expert** first-filters — fast, no users. `usability-testing` is the **empirical** counterpart that puts a real person in front of the design. Use both: experts predict problems, users prove them.

### 🧪 Prototype — `rapid-prototyping`

| Skill | Use it to… |
|---|---|
| `rapid-prototype` | Turn a rough idea, brief, or sketch into a **throwaway, clickable** prototype — runnable front-end code verified live in the browser preview, so you can test real interaction instead of static comps. (For **production-grade** builds, use `frontend-design` above.) |

### 📦 Handoff & docs — `handoff-docs`, `brand-voice`, `changelog-automation`

| Skill | Plugin | Use it to… |
|---|---|---|
| `component-spec` | handoff-docs | Draft a dev-ready spec for one component — anatomy, variants, states, props, tokens, a11y, do/don't — from Figma, code, or a description. |
| `design-system-docs` | handoff-docs | Generate design-system documentation from a project's existing patterns: component inventory, usage guidelines, token reference, and inconsistencies to reconcile. |
| `brand-voice-tone` | brand-voice | Review and rewrite UI copy to match a project's brand voice. Loads the voice profile from the project (a brand file, or a quick interview) and applies it — works for any brand or industry. |
| `design-system-changelog-sweep` | changelog-automation | Diff a design-system Figma file against a stored fingerprint baseline and auto-log any drift to the file's Changelog page. Built to run on a schedule. |

`changelog-automation` includes `scripts/figma-fingerprint.js` — the canonical fingerprint algorithm — and resolves the target file key, script, and rules from the **project's own config** (`CLAUDE.md`/`AGENTS.md`), so the same routine works across every project. Schedule it weekly with `/schedule`. **Requires the Figma MCP server.**

### 📈 Measure & iterate — `product-analytics`

| Skill | Use it to… |
|---|---|
| `measurement-plan` | Plan instrumentation (events, funnels, cohorts) to capture your metrics, then interpret the results to judge whether a shipped design worked — and turn surprises into the next research question, closing the loop back to Research. |

> Pairs with `success-metrics` (which *defines* the targets before build) and complements `changelog-automation` (which tracks *design-system* drift, not product outcomes).

---

## Roadmap

The workflow-coverage audit's gaps have all been addressed — research planning, synthesis artifacts (personas / journeys / metrics), prioritisation, content design, edge-case enumeration, usability testing, and post-launch measurement are now shipped.

Possible future directions: **service blueprints** (backstage/ops lanes), **experimentation depth** (A/B test design and read-out), **design-ops** automation, and richer **card-sort / tree-test** analysis (today handled within `research-synthesis`).

---

## Attribution & third-party skills

Five plugins bundle skills that are **not original to this toolkit**. They are vendored **verbatim and unmodified** from **Julian Oczkowski's** [designer-skills](https://github.com/julianoczkowski/designer-skills), used and redistributed under the **Apache License 2.0**:

| Plugin | Vendored skill(s) |
|---|---|
| `design-planning` | `design-brief`, `grill-me`, `brief-to-tasks`, `design-flow` |
| `information-architecture` | `information-architecture` |
| `design-tokens` | `design-tokens` |
| `frontend-design` | `frontend-design` |
| `design-review` | `design-review` |

- **Author:** Julian Oczkowski — <https://github.com/julianoczkowski>
- **Source:** <https://github.com/julianoczkowski/designer-skills>
- **Licence:** Apache-2.0. A copy of the licence ships in each of the five plugin directories (`plugins/<name>/LICENSE`). The skill files are unmodified; only packaging (`plugin.json`, `README.md`) was added to make them installable through this marketplace.

His set is the convergent **build pipeline** (brief → structure → tokens → build → review); this toolkit's original plugins cover the bookends — research and ideation up front, dedicated auditing, prototyping, and handoff at the back. They're designed to interlock.

> Prefer to pull his skills straight from source (and get his updates automatically)? Install them directly instead: `npx skills add julianoczkowski/designer-skills`.

### Staying in sync with upstream

Because these skills are a **point-in-time copy**, they don't automatically get Julian's later updates. To catch that drift, the repo ships an automated cross-reference:

- **`.vendor/designer-skills.lock.json`** records exactly which upstream commit each skill was vendored from, plus a content hash per file.
- **`scripts/check-upstream-skills.mjs`** clones the live upstream repo and diffs it against the vendored copies. Run it any time:
  ```text
  node scripts/check-upstream-skills.mjs            # prints a drift report
  node scripts/check-upstream-skills.mjs --fail-on-drift   # non-zero exit if drift (for CI/hooks)
  ```
  It flags changed, removed, or locally-modified skills (with diffs) and **new upstream skills** you haven't vendored yet.
- **`.github/workflows/check-upstream-skills.yml`** runs that check **weekly** (Mondays) and on demand, and opens/updates a GitHub issue when anything drifts — so you get a nudge to re-sync rather than silently falling behind.

**To re-sync** after a nudge: re-copy the changed upstream `SKILL.md` file(s) into their vendored paths (keep them verbatim), then update `synced.commit`, `synced.date`, and the affected `sha256` in the lockfile. Re-run the check to confirm it's green.

---

## Requirements

- **Claude Code** with plugin support.
- **Figma MCP server** (`use_figma`) for `figma-design-system` and `changelog-automation`, and for the Figma-output paths of `research-synthesis`, `competitive-analysis`, and `handoff-docs`.
- **A browser the skill can drive** for `competitive-analysis`, `rapid-prototyping`, `accessibility-check` (live URLs), and `design-review` (screenshot capture).
- **A codebase to build in** for `frontend-design` and `design-tokens` (they emit real code/tokens).
- Most plugins need nothing beyond Claude Code — including `research-planning`, `ux-research`, `synthesis-artifacts`, `ideation`, `prioritization`, `design-planning`, `information-architecture`, `content-design`, `usability-testing`, `product-analytics`, `brand-voice`, and `heuristic-review`.
- For `changelog-automation`: the target project should declare its design-system Figma file key in its `CLAUDE.md`/`AGENTS.md`, and keep a `figma-fingerprint.js` in its repo (a reference copy is bundled here).

## How it's designed to stay reusable

- **No hardcoded files or companies.** Figma skills resolve components/tokens from the current file; the research and ideation skills read whatever you point them at; the voice skill loads a per-project profile; the changelog routine reads the project's own config. Drop any plugin into a new project and it adapts.
- **Pick à la carte.** Twenty independent plugins; install only what you need, disable individual skills if you want even less.
- **First filter, not final word.** The check skills (`accessibility-check`, `heuristic-review`) and the research pass are explicitly framed as fast first passes for a human to validate — not replacements for review, testing, or judgement.

## Repository layout

```text
ai-ux-toolkit/
├── .claude-plugin/marketplace.json     # marketplace catalog (lists all 20 plugins)
├── .github/workflows/                  # check-upstream-skills.yml (weekly upstream drift check)
├── .vendor/designer-skills.lock.json   # provenance + baseline hashes for vendored skills
├── scripts/check-upstream-skills.mjs   # cross-references vendored skills against upstream
├── README.md                           # this file
└── plugins/
    ├── research-planning/               # original — research-planning
    ├── ux-research/                     # original — research-synthesis
    ├── competitive-analysis/            # original — competitive-analysis
    ├── synthesis-artifacts/             # original — personas, journey-map, success-metrics
    ├── ideation/                        # original — divergent-exploration
    ├── prioritization/                  # original — prioritization
    ├── figma-design-system/             # original — figma-designer, reattach, annotate
    ├── content-design/                  # original — content-design, states-and-edge-cases
    ├── accessibility-heuristics/        # original — accessibility-check, heuristic-review
    ├── usability-testing/               # original — usability-testing
    ├── rapid-prototyping/               # original — rapid-prototype
    ├── handoff-docs/                    # original — component-spec, design-system-docs
    ├── brand-voice/                     # original — brand-voice-tone
    ├── changelog-automation/            # original — design-system-changelog-sweep (+ scripts/figma-fingerprint.js)
    ├── product-analytics/               # original — measurement-plan
    ├── design-planning/                 # vendored † — design-brief, grill-me, brief-to-tasks, design-flow
    ├── information-architecture/        # vendored † — information-architecture
    ├── design-tokens/                   # vendored † — design-tokens
    ├── frontend-design/                 # vendored † — frontend-design
    └── design-review/                   # vendored † — design-review
```

_(Each plugin has `.claude-plugin/plugin.json`, its own `README.md`, and a `skills/<name>/SKILL.md` per skill. The five **†** vendored plugins also carry a `LICENSE` (Apache-2.0).)_

## License

Original skills and packaging: [MIT](LICENSE) © 2026 Jonny Bennett.

Vendored plugins (`design-planning`, `information-architecture`, `design-tokens`, `frontend-design`, `design-review`): **Apache-2.0** © Julian Oczkowski — see each plugin's `LICENSE` and [Attribution](#attribution--third-party-skills).
