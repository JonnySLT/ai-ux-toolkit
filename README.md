# AI UX Toolkit

A Claude Code **plugin marketplace** — a curated set of skills and automations that cover the full UX design *and* research workflow: from planning and synthesizing research, through ideation, information architecture, design, content, accessibility, and prototyping, to validation (expert reviews, usability testing, experimentation), developer handoff, and post-launch measurement. 22 plugins, 39 skills, organized by workflow phase.

**Built for designers working on a team.** The workflow assumes you're not designing in a vacuum — it has first-class support for the collaborative reality of product work: stakeholder and kickoff interviews, facilitated workshops and design sprints, a shared research repository the whole team can reuse, developer handoff specs and user stories, and cross-functional review. Solo designers can use it too, but the toolkit is shaped around designers, researchers, PMs, and engineers working in concert.

Everything here is **project-agnostic**. No skill is tied to a specific company, file, or industry — each one references the design system, tokens, voice, and conventions of **whatever project you run it in**. Add the marketplace once, then install only the plugins you need.

> **Original + vendored.** Most plugins are original to this toolkit. Five (`design-planning`, `information-architecture`, `design-tokens`, `frontend-design`, `design-review`) are vendored **verbatim** from Julian Oczkowski's excellent [designer-skills](https://github.com/julianoczkowski/designer-skills) under the Apache-2.0 license, so the whole workflow installs from one place — see [Attribution](#attribution--third-party-skills).

---

**Jump to:** [Quick start](#quick-start) · [How to use it](#how-to-use-it) · [What's inside](#whats-inside--organized-by-workflow-phase) · [Which skill for which task?](#which-skill-for-which-task) · [Requirements](#requirements) · [Connecting the Figma MCP](#connecting-the-figma-mcp) · [Maintaining](#maintaining-the-toolkit) · [Repository layout](#repository-layout)

---

## Quick start

```text
# 1. Add the marketplace (once)
/plugin marketplace add JonnySLT/ai-ux-toolkit

# 2. Install any single plugin — same pattern for all 22
/plugin install research-planning@ai-ux-toolkit
```

**Want everything?** Just ask Claude, right in your Claude Code session:

> *"Install all 22 plugins from the ai-ux-toolkit marketplace."*

You can ask for **any subset** the same way — *"install just the research plugins,"* or *"everything except the Figma-dependent ones."* Prefer to browse? Run **`/plugin`** for an interactive menu.

<details>
<summary>Prefer a copy-paste terminal one-liner to install all 22?</summary>

```bash
for p in research-planning ux-research competitive-analysis synthesis-artifacts \
         design-planning ideation prioritization information-architecture \
         figma-design-system design-tokens frontend-design data-viz content-design \
         accessibility-heuristics design-review usability-testing rapid-prototyping \
         handoff-docs brand-voice changelog-automation product-analytics \
         prompt-builder; do
  claude plugin install "$p@ai-ux-toolkit"
done
```
</details>

Plugins are independent — install any subset, uninstall with `/plugin uninstall <name>`, refresh the catalog with `/plugin marketplace update`. _(Every `/plugin …` command has a terminal CLI equivalent, e.g. `claude plugin install <name>@ai-ux-toolkit`.)_

> The Figma-dependent plugins (`figma-design-system`, `changelog-automation`) also need Figma's MCP server connected — a one-time step: see [Connecting the Figma MCP](#connecting-the-figma-mcp). Everything else runs on Claude Code alone.

> **Tip:** Skills trigger automatically from natural language (e.g. "synthesize these interviews", "give me 10 concepts", "check this for accessibility"). You don't call them by name — just describe what you want.

---

## How to use it

You **don't invoke skills by name.** Once a plugin is installed, its skills sit in the background; you just **describe your task in plain language** and Claude Code reads the installed skills' descriptions and routes to the right one(s). Simple tasks fire one skill; a broader request chains several, each feeding the next.

**Example — one request that fans out across skills:**

> **You:** *"I ran 10 onboarding interviews (transcripts attached). Help me figure out what's broken and what to build."*

Claude picks skills by what each is *for* — no skill named, each output feeding the next:

1. **`research-synthesis`** → themes, pains, and opportunities from the transcripts
2. **`personas`** / **`journey-map`** → who's affected and where the experience breaks
3. **`prioritization`** → rank the opportunities so you know what to tackle first

**Steering it:**
- **Want a specific skill?** Name it or use its trigger phrase (e.g. "run a *heuristic review*") and Claude uses that one.
- **Want the whole guided build?** `design-flow` orchestrates the sequence brief → structure → tokens → build → review.
- **Two skills feel similar?** See [Which skill for which task?](#which-skill-for-which-task) for the overlapping cases.

---

## What's inside — organized by workflow phase

Twenty-two plugins (39 skills), grouped by where they fall in a typical design process. Every skill is project-agnostic. Skills marked **†** are vendored from Julian Oczkowski's [designer-skills](https://github.com/julianoczkowski/designer-skills) (Apache-2.0) — see [Attribution](#attribution--third-party-skills). Rows marked **§** aren't shipped by this toolkit at all — they come with the [Figma MCP](#connecting-the-figma-mcp) itself and are listed here only so the full Figma workflow is visible in one place.

### 🧰 Meta — `prompt-builder`

Not tied to any phase — it sits *in front of* all of them. Install it first; it makes every other plugin easier to drive.

| Skill | Use it to… |
|---|---|
| `prompt-builder` | Brief Claude properly before it starts: turn a rough ask into a complete, self-contained prompt via a short interview (or upgrade a pasted draft), then run it on the spot. Scans the project first so it never asks for what Claude can discover itself, and promotes standing rules into `CLAUDE.md`/memory so future prompts stay short. |

> **It also ships the toolkit's ask-first routing.** A `SessionStart` hook auto-loads the overlap map (below) into context — so when a request could map to more than one skill, Claude names the options and asks which you want, instead of silently picking. Zero setup; on by default once installed. *(A manual, project-scoped alternative lives in [`templates/CLAUDE.md`](templates/CLAUDE.md).)*

### 🔬 Research — `research-planning`, `ux-research`, `competitive-analysis`

| Skill | Plugin | Use it to… |
|---|---|---|
| `research-planning` | research-planning | Plan and instrument research *before* you collect it — choose the method, then draft user interview guides, **stakeholder/kickoff interview guides**, usability-test scripts, survey questionnaires, and recruiting screeners (non-leading, with consent and realistic sample sizes). |
| `research-synthesis` | ux-research | Feed in interview transcripts, survey responses, or support tickets → themes, evidence-backed insights, frequency/severity, and prioritized opportunities. The coding pass that would take hours by hand. |
| `research-repository` | ux-research | Set up and maintain a repository of atomic, tagged, evidence-linked insights (with a taxonomy) so past research stays findable and reusable across studies. |
| `competitive-analysis` | competitive-analysis | Live teardown of 3–6 products — browses each in real time and delivers a comparison matrix, narrative, and opportunities/gaps. Can push findings into a Figma doc page. |

### 📝 Define & plan — `synthesis-artifacts`, `design-planning`

| Skill | Plugin | Use it to… |
|---|---|---|
| `personas` | synthesis-artifacts | Build evidence-based personas & JTBD statements from real research (flags thin data instead of inventing demographics). |
| `empathy-map` | synthesis-artifacts | A fast Says / Thinks / Does / Feels (+ Pains & Gains) snapshot that surfaces contradictions and design implications. |
| `journey-map` | synthesis-artifacts | Map an end-to-end experience — stages, actions, thoughts, emotion curve, pain points, and opportunities. |
| `service-blueprint` | synthesis-artifacts | Extend a journey with the behind-the-scenes layers (frontstage, backstage, support systems) to expose fail points, handoffs, and ownership gaps. |
| `success-metrics` | synthesis-artifacts | Define what success looks like *before* building — HEART and goal → signal → metric, with guardrail metrics. |
| `design-brief` **†** | design-planning | Create a design brief through an interactive interview, codebase exploration, and experience-design decisions. |
| `grill-me` **†** | design-planning | Get interviewed relentlessly about a plan or design until you reach shared understanding. |
| `brief-to-tasks` **†** | design-planning | Break a brief into an ordered checklist of independently buildable tasks (vertical slices). |
| `design-flow` **†** | design-planning | The full design-to-build orchestrator — runs the whole sequence from grilling through review. Expects the other vendored plugins installed. |

### 💡 Ideate — `ideation`, `prioritization`

| Skill | Plugin | Use it to… |
|---|---|---|
| `divergent-exploration` | ideation | Generate a wide, deliberately-spread set of concepts, copy variants, or IA/layout options — spanning safe → bold — so you break fixation early and edit rather than start blank. |
| `facilitation` | ideation | Plan and run collaborative sessions (kickoffs, design sprints, ideation workshops, retros) — a timed agenda, the right activities, facilitation scripts, and outcome capture. |
| `prioritization` | prioritization | Turn a list of ideas, features, or fixes into a defensible ranked order (RICE, impact/effort, MoSCoW, Kano) — with quick wins and the assumptions surfaced. |

### 🗂️ Structure — `information-architecture`

| Skill | Use it to… |
|---|---|
| `information-architecture` **†** | Define the structural layer before visual design — navigation, content hierarchy, page structure, URL patterns, and user flows. |

### 🎨 Design — `figma-design-system`, `design-tokens`, `frontend-design`, `data-viz`
`figma-designer`, `reattach`, and `annotate` **require the [Figma MCP server](#connecting-the-figma-mcp)** to run; the rows marked **§** *are* the Figma MCP's own skills — they arrive **with** that connection, not from this marketplace. `design-tokens`, `frontend-design`, and `data-visualization` need neither.

| Skill | Plugin | Use it to… |
|---|---|---|
| `figma-designer` | figma-design-system | Senior-designer knowledge for building accessible, consistent, polished UI in Figma. |
| `reattach` | figma-design-system | Audit a raw/detached Figma frame and reconnect it to the design system — variables, text styles, and component instances (all discovered at runtime). |
| `annotate` | figma-design-system | Place annotation cards beside a screen, each pointing at a component with specs, tokens, icons, and dev-handoff notes (from the file's own `Annotation` component, 32px from the frame). |
| `figma-use` **§** | Figma MCP | The low-level engine behind every Figma canvas write — create/edit/delete nodes, set up variables & tokens, build components/variants, and wire auto-layout, fills, and variable bindings. Most other Figma work calls it under the hood. |
| `figma-generate-design` **§** | Figma MCP | Turn an app page, view, or multi-section layout — from code or a description — into a Figma screen, reusing your design system's components, variables, and styles section by section. |
| `figma-generate-library` **§** | Figma MCP | Build or update a full design system *in* Figma from a codebase — variables/tokens, component libraries, light/dark theming, and documented foundations. |
| `figma-code-connect` **§** | Figma MCP | Create and maintain Code Connect files (`.figma.ts` / `.figma.js`) that map Figma components to their code snippets, for design-to-code translation. |
| `design-tokens` **†** | design-tokens | Generate a design tokens file (CSS variables or Tailwind config) — light/dark palettes, spacing scale, type ramp, component-level tokens. |
| `frontend-design` **†** | frontend-design | Build distinctive, production-grade frontend interfaces guided by named aesthetic philosophies. |
| `data-visualization` | data-viz | Design clear, accessible charts and dashboards — the right chart for the question, accessible color, honest scales, and glanceable layouts. Tool-agnostic. |

### ✍️ Content — `content-design`

| Skill | Use it to… |
|---|---|
| `content-design` | Write functional UI microcopy systematically — errors, empty states, buttons, labels, confirmations, onboarding. Decides *what to say*; pair with `brand-voice` for tone. |
| `states-and-edge-cases` | Enumerate every state and edge case a screen must handle (empty, loading, error, offline, permission, overflow…) so they're designed on purpose, not found in production. |

### ✅ Check — `accessibility-heuristics`, `design-review`, `usability-testing`

| Skill | Plugin | Use it to… |
|---|---|---|
| `inclusive-design` | accessibility-heuristics | Design accessibly **from the start** — for the range of human ability (vision, motor, hearing, cognitive, situational), baking WCAG into decisions before build. |
| `accessibility-check` | accessibility-heuristics | First-pass WCAG check on a screenshot, Figma frame, URL, or code — contrast, labels, focus, target size, structure. Cites the success criterion and a fix per finding. |
| `heuristic-review` | accessibility-heuristics | Evaluate a screen or flow against Nielsen's 10 usability heuristics, scored by severity with concrete fixes. |
| `design-review` **†** | design-review | Broad, holistic design critique against the brief — visual hierarchy, consistency, responsiveness, accessibility, and aesthetic fidelity. |
| `usability-testing` | usability-testing | Plan, moderate, and analyze a usability study with **real users** — tasks, success criteria, task-level metrics, and severity-rated findings. |

> The first four are **expert** first-filters — fast, no users. `usability-testing` is the **empirical** counterpart that puts a real person in front of the design. Use both.

### 🧪 Prototype — `rapid-prototyping`

| Skill | Use it to… |
|---|---|
| `rapid-prototype` | Turn a rough idea, brief, or sketch into a **throwaway, clickable** prototype — runnable front-end code verified live in the browser preview, so you can test real interaction instead of static comps. (For **production-grade** builds, use `frontend-design`.) |

### 📦 Handoff & docs — `handoff-docs`, `brand-voice`, `changelog-automation`

| Skill | Plugin | Use it to… |
|---|---|---|
| `component-spec` | handoff-docs | Draft a dev-ready spec for one component — anatomy, variants, states, props, tokens, a11y, do/don't — from Figma, code, or a description. |
| `design-system-docs` | handoff-docs | Generate design-system documentation from a project's existing patterns: component inventory, usage guidelines, token reference, and inconsistencies to reconcile. |
| `user-stories` | handoff-docs | Turn a design or brief into agile user stories ("As a… I want… so that…") with testable acceptance criteria (checklist or Given/When/Then), scoped to shippable slices. |
| `brand-voice-tone` | brand-voice | Review and rewrite UI copy to match a project's brand voice — loaded from a brand file or a quick interview, so it works for any brand. |
| `design-system-changelog-sweep` | changelog-automation | Diff a design-system Figma file against a stored fingerprint baseline and auto-log any drift to the file's Changelog page. Built to run weekly via `/schedule`. **Requires the Figma MCP.** |

### 📈 Measure & iterate — `product-analytics`

| Skill | Use it to… |
|---|---|
| `measurement-plan` | Plan instrumentation (events, funnels, cohorts) to capture your metrics, then interpret the results to judge whether a shipped design worked — and turn surprises into the next research question, closing the loop back to Research. |
| `experimentation` | Design and interpret A/B tests — hypothesis, primary metric + guardrails, sample size / MDE and run-time, and a disciplined read-out (significance, confidence intervals, peeking, novelty, segments). |

---

## Which skill for which task?

Most skills have an obvious lane — **just describe the outcome you want and Claude picks the right one.** This table is only for the handful of cases where two feel interchangeable.

**Reviewing / evaluating a built screen**
| Your goal | Use |
|---|---|
| Check WCAG accessibility (contrast, labels, focus, targets) | `accessibility-check` |
| Design accessibly *before* building | `inclusive-design` |
| Catch usability problems via Nielsen's heuristics | `heuristic-review` |
| Broad critique against the brief (hierarchy, consistency, aesthetics) | `design-review` |
| Find real problems by watching **real users** | `usability-testing` |

**Research**
| Your goal | Use |
|---|---|
| Plan a study / write an interview, survey, or usability *script* | `research-planning` |
| Run + moderate + analyze a full usability study | `usability-testing` |
| Turn collected data into themes & insights | `research-synthesis` |
| Store & reuse insights across studies | `research-repository` |

**Building UI**
| Your goal | Use |
|---|---|
| Throwaway, clickable prototype to test an interaction | `rapid-prototype` |
| Production-grade, ship-quality frontend | `frontend-design` |
| Design / audit components in Figma | `figma-design-system` |

**Copy & content**
| Your goal | Use |
|---|---|
| Decide what a UI string should say (errors, empty states, labels) | `content-design` |
| Make copy match your brand's voice/tone | `brand-voice-tone` |
| Generate many copy options to choose from | `divergent-exploration` |

**Metrics**
| Your goal | Use |
|---|---|
| Define what success means *before* build | `success-metrics` |
| Instrument events & read outcomes post-launch | `measurement-plan` |
| Design / read an A/B test | `experimentation` |

**Define artifacts (from research)**
| Your goal | Use |
|---|---|
| A behavioral archetype of a user | `personas` |
| What a user says / thinks / does / feels | `empathy-map` |
| The stage-by-stage experience + emotion curve | `journey-map` |
| Frontstage + backstage layers delivering a service | `service-blueprint` |

---

## Requirements

- **Claude Code** with plugin support.
- **Figma MCP server** for `figma-design-system` and `changelog-automation`, and for the optional Figma-output paths of `research-synthesis`, `competitive-analysis`, `synthesis-artifacts`, and `handoff-docs`. See [Connecting the Figma MCP](#connecting-the-figma-mcp).
- **A browser the skill can drive** for `competitive-analysis`, `rapid-prototyping`, `accessibility-check` (live URLs), and `design-review` (screenshot capture).
- **A codebase to build in** for `frontend-design` and `design-tokens` (they emit real code/tokens).
- **Everything else needs nothing beyond Claude Code** — the research, define, ideate, content, metrics, and `prompt-builder` plugins all run on their own.
- For `changelog-automation`: the target project should declare its design-system Figma file key in its `CLAUDE.md`/`AGENTS.md`, and keep a `figma-fingerprint.js` in its repo (a reference copy is bundled here).

## Connecting the Figma MCP

A few skills talk to Figma through Figma's **MCP server** — a remote connector you authorize once, **not** part of this marketplace: you connect it, you don't install it. It also brings its own skills (`figma-use`, `figma-generate-design`, `figma-generate-library`, `figma-code-connect`) — the **§** rows in [What's inside](#whats-inside--organized-by-workflow-phase). Figma maintains and versions those against the live server, which is why this toolkit **references** the MCP rather than vendoring them (a copied version would drift out of sync).

Everything installs fine without the MCP; the Figma-dependent plugins just stay inert until it's connected.

### Connect it (once)

The Figma MCP is a **hosted remote server** (`https://mcp.figma.com/mcp`) — **nothing to download**. You add the connection and sign in with your Figma account:

1. **Add the server** (from a terminal): `claude mcp add --transport http figma https://mcp.figma.com/mcp` — or through your client's connector settings / `/mcp`.
2. **Authorize** via the Figma OAuth prompt the first time a Figma tool is used.
3. **Done** — the Figma-dependent plugins now work.

Using a different client (VS Code, Cursor) or want deeper setup? Figma's own guide has per-client instructions: <https://github.com/figma/mcp-server-guide>.

## How it's designed to stay reusable

- **No hardcoded files or companies.** Every skill resolves the design system, tokens, voice, and config from the project it runs in. Drop any plugin into a new project and it adapts.
- **Pick à la carte.** Twenty-two independent plugins; install only what you need. New here? Install `prompt-builder` first, then ask Claude for whatever phase you're working in.
- **First filter, not final word.** The expert checks and the research/synthesis passes are framed as fast first passes for a human to validate — never replacements for real usability testing, assistive-tech testing, or design judgment.

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
- **License:** Apache-2.0. A copy ships in each of the five plugin directories (`plugins/<name>/LICENSE`). The skill files are unmodified; only packaging (`plugin.json`, `README.md`) was added to make them installable here.

His set is the convergent **build pipeline** (brief → structure → tokens → build → review); this toolkit's original plugins cover the bookends — research and ideation up front, dedicated auditing, prototyping, and handoff at the back. *(Prefer his skills straight from source, with automatic updates? `npx skills add julianoczkowski/designer-skills`.)*

**Staying in sync:** because these are a point-in-time copy, `scripts/check-upstream-skills.mjs` (run weekly by `.github/workflows/check-upstream-skills.yml`, and on demand) diffs the vendored copies against live upstream via the hashes in `.vendor/designer-skills.lock.json`, and opens a GitHub issue when anything drifts. Re-sync = re-copy the changed `SKILL.md` verbatim + update the lockfile.

## Maintaining the toolkit

For anyone on the team editing or extending this repo:

- **Before committing:** run `node scripts/validate.mjs` — the same structural check CI runs on every push/PR (manifests, name matches, frontmatter, licenses, install lines, hooks).
- **After adding a skill or editing any description:** run `node scripts/route-eval.mjs` to confirm skill routing still lands (~20 model calls; a single `NONE` miss is usually sampling noise — rerun that prompt before editing anything).
- **Never edit the five vendored † plugins' skill files** — they're kept byte-identical to upstream (pinned in `.vendor/designer-skills.lock.json`). The weekly workflow flags upstream changes; re-syncing = re-copy verbatim + update the lockfile.
- **Adding a plugin:** follow the existing shape (`.claude-plugin/plugin.json` + `README.md` ending in its install line + `skills/<name>/SKILL.md`), register it in `.claude-plugin/marketplace.json`, and add it to this README's install recipes and phase tables — `validate.mjs` enforces most of this.
- **Bump the marketplace `version`** in `.claude-plugin/marketplace.json` on any catalog change.
- **The Figma companion file stays in sync automatically.** The [AI UX Toolkit Figma file](https://www.figma.com/design/n4Hh5v0xiIdezIiiP0Hiu5/AI-UX-Toolkit) mirrors these READMEs — a weekly scheduled sync (`scripts/figma-toolkit-sync/`) regenerates its *What's inside* and *Plugin details* sections from the repo, so editing a plugin README (or the What's inside tables) updates Figma with no manual design work. If a plugin's requirement chips change, update the `REQUIREMENTS` map in `scripts/figma-toolkit-sync/extract.mjs`. See [`scripts/figma-toolkit-sync/README.md`](scripts/figma-toolkit-sync/README.md).

## Repository layout

```text
ai-ux-toolkit/
├── .claude-plugin/marketplace.json     # marketplace catalog (lists all 22 plugins)
├── .github/workflows/                  # validate.yml (structure check on push/PR) + check-upstream-skills.yml (weekly drift check)
├── .vendor/designer-skills.lock.json   # provenance + baseline hashes for vendored skills
├── scripts/validate.mjs                # structural integrity check (runs in CI)
├── scripts/route-eval.mjs              # measures skill-routing accuracy (run after editing descriptions)
├── scripts/check-upstream-skills.mjs   # cross-references vendored skills against upstream
├── templates/CLAUDE.md                 # manual/project-scoped alternative for ask-first routing (the prompt-builder hook does this automatically)
├── README.md                           # this file
└── plugins/
    ├── research-planning/              # original — research-planning
    ├── ux-research/                    # original — research-synthesis, research-repository
    ├── competitive-analysis/           # original — competitive-analysis
    ├── synthesis-artifacts/            # original — personas, empathy-map, journey-map, service-blueprint, success-metrics
    ├── ideation/                       # original — divergent-exploration, facilitation
    ├── prioritization/                 # original — prioritization
    ├── figma-design-system/            # original — figma-designer, reattach, annotate
    ├── data-viz/                       # original — data-visualization
    ├── content-design/                 # original — content-design, states-and-edge-cases
    ├── accessibility-heuristics/       # original — inclusive-design, accessibility-check, heuristic-review
    ├── usability-testing/              # original — usability-testing
    ├── rapid-prototyping/              # original — rapid-prototype
    ├── handoff-docs/                   # original — component-spec, design-system-docs, user-stories
    ├── brand-voice/                    # original — brand-voice-tone
    ├── changelog-automation/           # original — design-system-changelog-sweep (+ scripts/figma-fingerprint.js)
    ├── product-analytics/              # original — measurement-plan, experimentation
    ├── prompt-builder/                 # original — prompt-builder (meta: better briefs + ask-first routing hook)
    ├── design-planning/                # vendored † — design-brief, grill-me, brief-to-tasks, design-flow
    ├── information-architecture/       # vendored † — information-architecture
    ├── design-tokens/                  # vendored † — design-tokens
    ├── frontend-design/                # vendored † — frontend-design
    └── design-review/                  # vendored † — design-review
```

_(Each plugin has `.claude-plugin/plugin.json`, its own `README.md`, and a `skills/<name>/SKILL.md` per skill. The five **†** vendored plugins also carry a `LICENSE` (Apache-2.0).)_

## License

Original skills and packaging: [MIT](LICENSE) © 2026 Jonny Bennett.

Vendored plugins (`design-planning`, `information-architecture`, `design-tokens`, `frontend-design`, `design-review`): **Apache-2.0** © Julian Oczkowski — see each plugin's `LICENSE` and [Attribution](#attribution--third-party-skills).
