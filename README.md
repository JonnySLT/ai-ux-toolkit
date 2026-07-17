# AI UX Toolkit

A Claude Code **plugin marketplace** — a curated set of skills and automations that cover the full UX design *and* research workflow: from planning and synthesizing research, through ideation, information architecture, design, content, accessibility, and prototyping, to validation (expert reviews, usability testing, experimentation), developer handoff, and post-launch measurement. 21 plugins, 38 skills, organized by workflow phase.

Everything here is **project-agnostic**. No skill is tied to a specific company, file, or industry — each one references the design system, tokens, voice, and conventions of **whatever project you run it in**. Add the marketplace once, then install only the plugins you need.

> **Original + vendored.** Most plugins are original to this toolkit. Five (`design-planning`, `information-architecture`, `design-tokens`, `frontend-design`, `design-review`) are vendored **verbatim** from Julian Oczkowski's excellent [designer-skills](https://github.com/julianoczkowski/designer-skills) under the Apache-2.0 license, so the whole workflow installs from one place — see [Attribution](#attribution--third-party-skills).

> Formerly `design-system-toolkit`. The scope has broadened from design-system work to the full UX-design workflow, so the marketplace was renamed to `ai-ux-toolkit`. If you installed the old marketplace, re-add it under the new name (see Quick start) and reinstall — install references now use `@ai-ux-toolkit`.

---

**Jump to:** [Quick start](#quick-start) · [How to use it](#how-to-use-it) · [Install recipes](#install-recipes) · [What's inside](#whats-inside--organized-by-workflow-phase) · [Which skill for which task?](#which-skill-for-which-task) · [Ask-first routing](#make-routing-ask-first-optional) · [Requirements](#requirements) · [Connecting the Figma MCP](#connecting-the-figma-mcp) · [Repository layout](#repository-layout)

---

## Quick start

```text
# 1. Add the marketplace (once)
/plugin marketplace add JonnySLT/ai-ux-toolkit

# 2. Install any single plugin — same pattern for all 21
/plugin install research-planning@ai-ux-toolkit
```

**Want everything?** The easiest way — just ask Claude, right in your Claude Code session:

> *"Install all 21 plugins from the ai-ux-toolkit marketplace."*

Claude runs the installs for you. (Prefer a terminal? Copy the one-block [**Everything** recipe](#install-recipes) below.)

That's it for **any individual plugin**: `/plugin install <name>@ai-ux-toolkit`. Prefer to browse? Run **`/plugin`** for an interactive menu of the whole catalog. To grab a **whole workflow phase** or a **curated set** in one paste, see [Install recipes](#install-recipes) just below.

Plugins are independent — install any subset, uninstall with `/plugin uninstall <name>`, refresh the catalog with `/plugin marketplace update`. _(Every `/plugin …` command has a terminal CLI equivalent, e.g. `claude plugin install <name>@ai-ux-toolkit`.)_

> The Figma-dependent plugins (`figma-design-system`, `changelog-automation`) also need Figma's MCP server connected — a one-time step: see [Connecting the Figma MCP](#connecting-the-figma-mcp). Everything else runs on Claude Code alone.

> **Tip:** Skills trigger automatically from natural language (e.g. "synthesize these interviews", "give me 10 concepts", "check this for accessibility", "prototype this flow"). You don't call them by name — just describe what you want.

---

## How to use it

You **don't invoke skills by name.** Once a plugin is installed, its skills sit in the background; you just **describe your task in plain language** and Claude Code reads the installed skills' descriptions and routes to the right one(s). Simple tasks fire one skill; a broader request chains several, each feeding the next.

**Example — one request that fans out across skills:**

> **You:** *"I ran 10 onboarding interviews (transcripts attached). Help me figure out what's broken and what to build."*

Claude routes that through the workflow, picking skills by what each is *for*:

1. **`research-synthesis`** → themes, pains, and opportunities from the transcripts
2. **`personas`** / **`journey-map`** → who's affected and where the experience breaks
3. **`prioritization`** → rank the opportunities so you know what to tackle first

No skill was named — each was selected from its description, and each output fed the next (exactly the chain shown in the mini-demo we ran).

**More prompts → the skill they trigger:**

| You type… | Claude reaches for… |
|---|---|
| "Write an interview guide to understand churn" | `research-planning` |
| "Give me 8 concepts for this empty state" | `divergent-exploration` |
| "Is this button's contrast accessible?" | `accessibility-check` |
| "What should this error message say?" | `content-design` |
| "Turn this idea into a clickable prototype" | `rapid-prototype` |
| "Write user stories for this design" | `user-stories` |
| "Did the redesign actually work?" | `experimentation` / `measurement-plan` |

**Steering it:**
- **Want a specific skill?** Name it or use its trigger phrase (e.g. "run a *heuristic review*") and Claude uses that one.
- **Want the whole guided build?** `design-flow` orchestrates the sequence brief → structure → tokens → build → review.
- **Two skills feel similar?** See [Which skill for which task?](#which-skill-for-which-task) for the overlapping cases.

---

## Install recipes

Every line below is a **standalone install** — copy the one plugin you want, a whole phase, or a curated bundle. All install at **user scope**; uninstall any with `/plugin uninstall <name>`. _(In a terminal, the CLI equivalent of `/plugin install X` is `claude plugin install X`.)_

### By workflow phase

Grab an entire phase in one paste.

<details open>
<summary><b>🔬 Research</b> · <b>📝 Define &amp; plan</b> · <b>💡 Ideate</b> · <b>🗂️ Structure</b> · <b>🎨 Design</b></summary>

```text
# 🔬 Research
/plugin install research-planning@ai-ux-toolkit
/plugin install ux-research@ai-ux-toolkit
/plugin install competitive-analysis@ai-ux-toolkit

# 📝 Define & plan
/plugin install synthesis-artifacts@ai-ux-toolkit
/plugin install design-planning@ai-ux-toolkit

# 💡 Ideate
/plugin install ideation@ai-ux-toolkit
/plugin install prioritization@ai-ux-toolkit

# 🗂️ Structure
/plugin install information-architecture@ai-ux-toolkit

# 🎨 Design
/plugin install figma-design-system@ai-ux-toolkit
/plugin install design-tokens@ai-ux-toolkit
/plugin install frontend-design@ai-ux-toolkit
/plugin install data-viz@ai-ux-toolkit
```
</details>

<details open>
<summary><b>✍️ Content</b> · <b>✅ Check</b> · <b>🧪 Prototype</b> · <b>📦 Handoff &amp; docs</b> · <b>📈 Measure &amp; iterate</b></summary>

```text
# ✍️ Content
/plugin install content-design@ai-ux-toolkit

# ✅ Check
/plugin install accessibility-heuristics@ai-ux-toolkit
/plugin install design-review@ai-ux-toolkit
/plugin install usability-testing@ai-ux-toolkit

# 🧪 Prototype
/plugin install rapid-prototyping@ai-ux-toolkit

# 📦 Handoff & docs
/plugin install handoff-docs@ai-ux-toolkit
/plugin install brand-voice@ai-ux-toolkit
/plugin install changelog-automation@ai-ux-toolkit

# 📈 Measure & iterate
/plugin install product-analytics@ai-ux-toolkit
```
</details>

### By need (curated bundles)

**Everything** — all 21 plugins. Two ways, pick one:
- *In Claude Code:* just ask — **"Install all 21 plugins from the ai-ux-toolkit marketplace"** — and Claude runs the installs.
- *In a terminal:* paste this loop:
```bash
for p in research-planning ux-research competitive-analysis synthesis-artifacts \
         design-planning ideation prioritization information-architecture \
         figma-design-system design-tokens frontend-design data-viz content-design \
         accessibility-heuristics design-review usability-testing rapid-prototyping \
         handoff-docs brand-voice changelog-automation product-analytics; do
  claude plugin install "$p@ai-ux-toolkit"
done
```

**Research & synthesis** — the whole front end, planning through define-artifacts:
```text
/plugin install research-planning@ai-ux-toolkit
/plugin install ux-research@ai-ux-toolkit
/plugin install competitive-analysis@ai-ux-toolkit
/plugin install synthesis-artifacts@ai-ux-toolkit
```

**Content & copy** — the words and the states:
```text
/plugin install content-design@ai-ux-toolkit
/plugin install brand-voice@ai-ux-toolkit
```

**Quality & validation** — expert audits + real-user testing:
```text
/plugin install accessibility-heuristics@ai-ux-toolkit
/plugin install design-review@ai-ux-toolkit
/plugin install usability-testing@ai-ux-toolkit
```

**Solo designer starter kit** — a lean set spanning the whole workflow:
```text
/plugin install ux-research@ai-ux-toolkit
/plugin install ideation@ai-ux-toolkit
/plugin install information-architecture@ai-ux-toolkit
/plugin install frontend-design@ai-ux-toolkit
/plugin install content-design@ai-ux-toolkit
/plugin install accessibility-heuristics@ai-ux-toolkit
/plugin install handoff-docs@ai-ux-toolkit
```

**Without Figma** — everything except the two hard Figma-MCP dependencies (`figma-design-system`, `changelog-automation`). Run in a terminal:
```bash
for p in research-planning ux-research competitive-analysis synthesis-artifacts \
         design-planning ideation prioritization information-architecture \
         design-tokens frontend-design data-viz content-design accessibility-heuristics \
         design-review usability-testing rapid-prototyping handoff-docs \
         brand-voice product-analytics; do
  claude plugin install "$p@ai-ux-toolkit"
done
```
_(Or ask Claude: "Install every ai-ux-toolkit plugin except the Figma-dependent ones.")_

---

## What's inside — organized by workflow phase

Twenty-one plugins (38 skills), grouped by where they fall in a typical design process. Every skill is project-agnostic. Skills marked **†** are vendored from Julian Oczkowski's [designer-skills](https://github.com/julianoczkowski/designer-skills) (Apache-2.0) — see [Attribution](#attribution--third-party-skills).

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
The three Figma skills (`figma-designer`, `reattach`, `annotate`) **require the [Figma MCP server](#connecting-the-figma-mcp)** (`use_figma`); the rest don't.

| Skill | Plugin | Use it to… |
|---|---|---|
| `figma-designer` | figma-design-system | Senior-designer knowledge for building accessible, consistent, polished UI in Figma. |
| `reattach` | figma-design-system | Audit a raw/detached Figma frame and reconnect it to the design system — variables, text styles, and component instances (all discovered at runtime). |
| `annotate` | figma-design-system | Place annotation cards beside a screen, each pointing at a component with specs, tokens, icons, and dev-handoff notes. |
| `design-tokens` **†** | design-tokens | Generate a design tokens file (CSS variables or Tailwind config) — light/dark palettes, spacing scale, type ramp, component-level tokens. |
| `frontend-design` **†** | frontend-design | Build distinctive, production-grade frontend interfaces guided by named aesthetic philosophies. |
| `data-visualization` | data-viz | Design clear, accessible charts and dashboards — the right chart for the question, accessible color, honest scales, and glanceable layouts. Tool-agnostic. |

> `annotate` uses the **`Annotation` component that lives in the file you're annotating** — it never pulls from another file. If the file has none, it offers to build one bound to that project's own tokens. Annotation cards always sit **32px** from the frame.

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
| `user-stories` | handoff-docs | Turn a design or brief into agile user stories ("As a… I want… so that…") with testable acceptance criteria (checklist or Given/When/Then), scoped to shippable slices. |
| `brand-voice-tone` | brand-voice | Review and rewrite UI copy to match a project's brand voice. Loads the voice profile from the project (a brand file, or a quick interview) and applies it — works for any brand or industry. |
| `design-system-changelog-sweep` | changelog-automation | Diff a design-system Figma file against a stored fingerprint baseline and auto-log any drift to the file's Changelog page. Built to run on a schedule. |

`changelog-automation` includes `scripts/figma-fingerprint.js` — the canonical fingerprint algorithm — and resolves the target file key, script, and rules from the **project's own config** (`CLAUDE.md`/`AGENTS.md`), so the same routine works across every project. Schedule it weekly with `/schedule`. **Requires the Figma MCP server.**

### 📈 Measure & iterate — `product-analytics`

| Skill | Use it to… |
|---|---|
| `measurement-plan` | Plan instrumentation (events, funnels, cohorts) to capture your metrics, then interpret the results to judge whether a shipped design worked — and turn surprises into the next research question, closing the loop back to Research. |
| `experimentation` | Design and interpret A/B tests — hypothesis, primary metric + guardrails, sample size / MDE and run-time, and a disciplined read-out (significance, confidence intervals, peeking, novelty, segments). |

> Pairs with `success-metrics` (which *defines* the targets before build) and complements `changelog-automation` (which tracks *design-system* drift, not product outcomes).

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

## Make routing ask-first (optional)

The decision guide above helps *you* — but Claude only reads a **`CLAUDE.md`** at skill-selection time, **not** this README. To make Claude **flag the overlap and ask which skill you want** (instead of silently picking one), add a routing block to `CLAUDE.md`.

**One-time setup, applies to every project:** append the "Skill routing" section from [`templates/CLAUDE.md`](templates/CLAUDE.md) to your **global** user memory at **`~/.claude/CLAUDE.md`**. Claude Code loads that file in *every* session and project, so you set it up once and never have to remember it when you open a new project. *(Want it scoped to a single project instead? Put it in that project's `./CLAUDE.md`.)*

Then an ambiguous request behaves like this:

> **You:** *"Can you review this checkout screen?"*
>
> **Claude:** "That could map to a few skills — which would you like? `accessibility-check` (WCAG) · `heuristic-review` (Nielsen) · `design-review` (broad critique) · `usability-testing` (real users). These overlap on 'review' — tell me which, or say 'general feedback' and I'll run `design-review`."

Unambiguous requests ("check this contrast ratio") still route straight to the right skill — no needless question. This works because the block lives in `CLAUDE.md`, which is in Claude's context when it chooses; the README table isn't.

---

## Roadmap

Both coverage audits' gaps are now shipped — research planning & stakeholder interviews, insight repository, synthesis artifacts (personas / empathy maps / journeys / **service blueprints** / metrics), prioritization, facilitation, content design, edge-case enumeration, **inclusive design**, usability testing, **data visualization**, user stories, **experimentation (A/B)**, and post-launch measurement.

Possible future directions: **design-ops** automation, deeper **quant/survey statistics**, and **motion/interaction** specs. Nothing here is a coverage gap — the workflow is complete end to end.

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
- **License:** Apache-2.0. A copy of the license ships in each of the five plugin directories (`plugins/<name>/LICENSE`). The skill files are unmodified; only packaging (`plugin.json`, `README.md`) was added to make them installable through this marketplace.

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
- **Figma MCP server** (`use_figma`) for `figma-design-system` and `changelog-automation`, and for the optional Figma-output paths of `research-synthesis`, `competitive-analysis`, `synthesis-artifacts`, and `handoff-docs`. See [Connecting the Figma MCP](#connecting-the-figma-mcp).
- **A browser the skill can drive** for `competitive-analysis`, `rapid-prototyping`, `accessibility-check` (live URLs), and `design-review` (screenshot capture).
- **A codebase to build in** for `frontend-design` and `design-tokens` (they emit real code/tokens).
- Most plugins need nothing beyond Claude Code — including `research-planning`, `ux-research`, `synthesis-artifacts`, `ideation`, `prioritization`, `design-planning`, `information-architecture`, `content-design`, `data-viz`, `usability-testing`, `product-analytics`, `brand-voice`, `inclusive-design`, and `heuristic-review`.
- For `changelog-automation`: the target project should declare its design-system Figma file key in its `CLAUDE.md`/`AGENTS.md`, and keep a `figma-fingerprint.js` in its repo (a reference copy is bundled here).

## Connecting the Figma MCP

A few things here talk to Figma through Figma's **MCP server** — a remote connector you authorise once. It is **not part of this marketplace**: you connect it, you don't install it, and it brings both its own tools *and its own skills*.

**There are two different sets of "Figma skills" — don't confuse them:**

| Set | Where it lives | Skills |
|---|---|---|
| **This toolkit's Figma plugins** | Installed from **this** marketplace; they *call* the Figma MCP to do their work | `figma-design-system` → `figma-designer`, `reattach`, `annotate`; `changelog-automation` → `design-system-changelog-sweep` |
| **The Figma MCP's own skills** | **Part of the Figma MCP itself** — they arrive *with the connection*, **not** from this marketplace (you can't install them here) | `figma-use`, `figma-generate-design`, `figma-generate-library`, `figma-code-connect` |

So `figma-use` and friends are **Figma's**, provided by the MCP; this toolkit only ships the plugins in the first row. Figma maintains and versions its own skills against the live server, which is why this toolkit **references** the MCP rather than vendoring them (a copied version would drift out of sync).

Two more plugins use the MCP *optionally*: `research-synthesis`, `competitive-analysis`, `synthesis-artifacts`, and `handoff-docs` can *push results to a Figma doc page* if it's connected — but work fine without it.

Everything installs fine without the MCP; the Figma-dependent plugins just stay inert until it's connected.

### Connect it (once)

The Figma MCP is a **hosted remote server** (`https://mcp.figma.com/mcp`) — there's **nothing to download or install**. You just add the connection and sign in with your Figma account.

1. **Add the server** (from a terminal):
   ```bash
   claude mcp add --transport http figma https://mcp.figma.com/mcp
   ```
   Or add it through your client's connector settings / `/mcp`.
2. **Authorise** — sign in via the Figma OAuth prompt the first time a Figma tool is used.
3. **Done** — `figma-design-system`, `changelog-automation`, and the optional Figma-output paths now work.

Using a different client (VS Code, Cursor, etc.) or want deeper setup and best practices? Figma's own guide has per-client instructions: <https://github.com/figma/mcp-server-guide>.

## How it's designed to stay reusable

- **No hardcoded files or companies.** Figma skills resolve components/tokens from the current file; the research and ideation skills read whatever you point them at; the voice skill loads a per-project profile; the changelog routine reads the project's own config. Drop any plugin into a new project and it adapts.
- **Pick à la carte.** Twenty-one independent plugins; install only what you need, disable individual skills if you want even less. New here? Start with the **Solo designer starter kit** in [Install recipes](#install-recipes).
- **First filter, not final word.** The expert checks (`accessibility-check`, `heuristic-review`, `design-review`, `inclusive-design`) and the research/synthesis passes are framed as fast first passes for a human to validate — never replacements for real usability testing (`usability-testing`), assistive-tech testing, or design judgment.

## Repository layout

```text
ai-ux-toolkit/
├── .claude-plugin/marketplace.json     # marketplace catalog (lists all 21 plugins)
├── .github/workflows/                  # validate.yml (structure check on push/PR) + check-upstream-skills.yml (weekly drift check)
├── .vendor/designer-skills.lock.json   # provenance + baseline hashes for vendored skills
├── scripts/validate.mjs                # structural integrity check (runs in CI)
├── scripts/route-eval.mjs              # measures skill-routing accuracy (run after editing descriptions; uses claude -p)
├── scripts/check-upstream-skills.mjs   # cross-references vendored skills against upstream
├── templates/CLAUDE.md                 # add to ~/.claude/CLAUDE.md (global) for ask-first skill routing
├── README.md                           # this file
└── plugins/
    ├── research-planning/               # original — research-planning
    ├── ux-research/                     # original — research-synthesis, research-repository
    ├── competitive-analysis/            # original — competitive-analysis
    ├── synthesis-artifacts/             # original — personas, empathy-map, journey-map, service-blueprint, success-metrics
    ├── ideation/                        # original — divergent-exploration, facilitation
    ├── prioritization/                  # original — prioritization
    ├── figma-design-system/             # original — figma-designer, reattach, annotate
    ├── data-viz/                        # original — data-visualization
    ├── content-design/                  # original — content-design, states-and-edge-cases
    ├── accessibility-heuristics/        # original — inclusive-design, accessibility-check, heuristic-review
    ├── usability-testing/               # original — usability-testing
    ├── rapid-prototyping/               # original — rapid-prototype
    ├── handoff-docs/                    # original — component-spec, design-system-docs, user-stories
    ├── brand-voice/                     # original — brand-voice-tone
    ├── changelog-automation/            # original — design-system-changelog-sweep (+ scripts/figma-fingerprint.js)
    ├── product-analytics/               # original — measurement-plan, experimentation
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
