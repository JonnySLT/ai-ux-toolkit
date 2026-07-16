---
name: component-spec
description: Draft a developer-ready specification for a single UI component from a Figma component, code, or a description. Documents anatomy, variants, all interaction states, the props/API, token usage, accessibility requirements, and usage do/don't — so engineering can build it without guessing. Discovers variants and tokens at runtime rather than assuming them. Trigger when the user asks to "spec this component", "write a component spec", "document this component for devs", "component handoff", or provides a Figma component/code and wants it documented.
---

Produce a spec an engineer can build from without coming back with questions. The job is to make every decision explicit — states, tokens, behavior, edge cases — and to flag what's genuinely undecided rather than papering over it.

## Example prompts

- "Write a spec for this Button component" (+ Figma link / code)
- "Document this card for handoff"
- "Spec out the states and props for this input"

---

## Step 0 — Load the real component (required first)

Don't spec from imagination. Pull the actual source:

- **Figma component** — load the `/figma:figma-use` skill (or use the Figma MCP) to read the component set: every variant, the properties, the bound tokens on fills/text/spacing, and the states already drawn. Note which states exist vs. are missing.
- **Code** — read the component file(s): props/types, the variants/states implemented, the tokens/classes used, ARIA and semantics.
- **Description only** — spec what's described, and explicitly mark everything you're inferring as *proposed, needs confirmation*.

Discover the project's token names, variant names, and conventions from the source — never invent a naming scheme. If Figma and code disagree, note the discrepancy rather than silently picking one.

---

## The spec — what to capture

### 1. Overview
- Component name, one-line purpose, and where it's used.
- A reference image/frame or code location.

### 2. Anatomy
- The named parts (container, leading icon, label, trailing element, …) and which are required vs. optional.
- Layout rules: direction, spacing/gap, padding, alignment, min/max width, truncation/wrap behavior — in tokens where possible.

### 3. Variants
- Each variant dimension and its options (e.g. `variant`: primary / secondary / ghost; `size`: sm / md / lg).
- What actually changes per variant (color tokens, padding, type style) — as a table.

### 4. States
Document every interaction state that applies: **default, hover, focus(-visible), active/pressed, disabled, loading, error, selected**, and read-only where relevant. For each: what changes visually (tokens) and any behavior. Missing states are the most common handoff gap — call out any the source doesn't define.

### 5. Props / API
A table: prop name · type · default · required? · description. Include content slots, event handlers, and boolean flags. Match existing code prop names if the component exists.

### 6. Token usage
List the design tokens the component consumes — color, spacing, radius, type, elevation, motion — by their real names in the project. Flag any hardcoded/raw values that should be tokens.

### 7. Accessibility
- Semantic element / role, accessible name source, and required ARIA.
- Keyboard interaction (Tab, Enter/Space, arrows, Esc) expected behavior.
- Focus handling, target size, and contrast requirements for its states.
- Anything that needs testing with AT.

### 8. Behavior & edge cases
- Interaction/transition details (timing, easing) if defined.
- Content edge cases: long labels, empty, overflow, RTL, localisation length, loading→loaded.

### 9. Usage do / don't
A short, concrete list — when to use this vs. a sibling component, and the common misuses to avoid.

---

## Output format

A single markdown spec in the section order above. Use tables for variants, states, props, and tokens. Lead with the overview and a reference image/location. End with an **Open questions** list — every decision that's still ambiguous or where Figma/code/description disagree, so it's resolved before build rather than during.

Offer to place the spec on the Figma canvas via the `annotate` skill for in-context handoff, or to save it as a markdown file in the repo's docs.

---

## Guardrails

- **Spec the real thing.** Read the Figma component or the code; don't document an imagined version.
- **Use the project's names.** Token, variant, and prop names come from the source, not a generic convention.
- **Completeness on states is the whole point.** Explicitly list which states exist and which are undefined — don't quietly skip the missing ones.
- **Flag, don't guess.** Where something is undecided or sources conflict, put it in Open questions instead of inventing an answer.
