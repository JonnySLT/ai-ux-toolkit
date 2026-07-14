---
name: design-system-docs
description: Generate design-system documentation from a project's existing patterns. Inventories the components and tokens already in the codebase or Figma file, drafts per-component usage guidelines, builds a token reference, and flags inconsistencies to reconcile — turning an undocumented but real system into browsable docs. Reads the project's own system as the source of truth; assumes nothing. Trigger when the user asks to "document our design system", "generate design system docs", "write usage guidelines", "create a component library README", or wants existing patterns written up.
---

Document a design system that already exists in practice but not on paper. The source of truth is **the project's own components and tokens** — you inventory what's there, describe how it's actually used, and surface where it's inconsistent. You don't invent new components, rename tokens, or impose an external system.

## Example prompts

- "Document our design system"
- "Generate usage docs for our component library"
- "Write up our tokens and components for new engineers"
- "Create design-system documentation from this Figma file / repo"

---

## Step 0 — Locate the system (required first)

Find the real source and confirm scope with the user:

- **Codebase** — the component directory, the tokens/theme file (CSS variables, Tailwind config, a tokens JSON), Storybook if present. Read them.
- **Figma** — load the `/figma:figma-use` skill (or Figma MCP) to read the library: published components, variable collections/modes, text styles.
- **Both** — reconcile them; note where code and Figma diverge (a common, valuable finding).

Confirm: which components/areas are in scope, who the docs are for (designers, engineers, both), and where the output should live (markdown in the repo, a Figma doc page, or both).

---

## Process

### 1. Inventory
List every component and every token in scope. For components, capture name, purpose, and variant/prop surface. For tokens, capture the collections/scales (colour, spacing, radius, type, elevation, motion) and their real names and values.

### 2. Extract usage from reality
For each component, derive how it's *actually* used from the source: real variants, real prop defaults, where it appears. Don't prescribe aspirational usage the code doesn't support — document the system as it is, and separately note gaps.

### 3. Draft the docs
Assemble into a browsable structure:

- **Overview** — what the system is, its principles if discoverable, how to consume it (import paths / Figma library).
- **Foundations / token reference** — each scale as a table: token name · value · usage. Group by type. Include modes/themes (light/dark) if present.
- **Components** — one entry each: purpose, anatomy, variants, states, props, tokens used, accessibility notes, and do/don't. (For a deep single-component spec, hand off to the `component-spec` skill.)
- **Patterns** — recurring compositions (forms, empty states, page shells) if they exist in the source.

### 4. Flag inconsistencies
The highest-value output. As you inventory, record:
- Hardcoded/raw values that bypass tokens.
- Duplicate or near-duplicate components.
- Naming inconsistencies (mixed conventions across tokens/components).
- Components in code but not Figma (or vice versa).
- Missing states/variants relative to sibling components.

Present these as a prioritised "reconcile" list — separate from the docs themselves.

---

## Output format

1. **System overview** — what it is and how to use it.
2. **Token reference** — tables per scale, with modes.
3. **Component catalogue** — one consistent entry per component.
4. **Patterns** (if any).
5. **Inconsistencies to reconcile** — prioritised, actionable.

Deliver as markdown files in the repo's docs by default; offer a Figma `_Doc` page version (mirroring the foundation-page format, using the file's own styles) if the user wants it on-canvas.

---

## Guardrails

- **Document what exists, not what should exist.** The current system is the source of truth; keep aspirations and fixes in the "reconcile" list, clearly separated.
- **Use the project's real names and values.** No invented tokens, no renamed components, no imported external convention.
- **Don't fabricate coverage.** If a component's states or props aren't determinable from the source, say so rather than inventing them.
- **Inconsistencies are findings, not silent fixes.** Surface them for a human to decide; don't quietly "correct" the docs to hide them.
- **Keep it maintainable.** Note that generated docs drift — recommend regenerating on a cadence (this pairs naturally with the `changelog-automation` plugin).
