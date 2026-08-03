---
name: harvest-components
description: >
  Audit finished Figma designs (hi-fi pages, screens, flows) and harvest
  components. Inventories every element, then nominates which bespoke frames
  should map to EXISTING design-system components, which recurring ones deserve
  a BRAND-NEW component, and which should stay one-off — filtering out
  look-alikes (number badges, inputs) that only resemble components. Presents a
  prioritized recommendation for approval, then executes the swaps: maps design
  content to component props, chooses variants/themes by context, and preserves
  layout. This is the editorial "what should be a component?" layer that sits
  above the mechanical `reattach` skill and hands execution to it. Trigger when
  the user says "harvest components", "what should be a component", "audit this
  page/design for components", "which elements belong in the design system",
  "turn these into components", "componentize this screen", or "find reusable
  elements" — typically after hi-fi screens are built.
---

# Harvest Components

Turn a finished design into a component-driven one. Where `reattach` mechanically reconnects raw values on a frame, **harvest-components adds the judgment layer**: it reviews a completed hi-fi design and decides *what should be a component in the first place* — mapping to existing library components, nominating new ones, and leaving genuine one-offs alone — then wires it up and verifies.

**Fully file-agnostic.** Discover every component, variable, style, and naming convention at runtime. Never hardcode IDs, keys, or names — they differ per file.

Always load the **`figma-use`** skill before any `use_figma` call.

## When to use vs. neighbouring skills

- **harvest-components (this):** "Look at these finished screens and tell me what should be a component, then do it." Editorial audit → recommendation → execution. Handles both directions (map to existing *and* nominate new).
- **`reattach`:** "This frame is raw/detached — reconnect its variables, styles, and component instances." Mechanical, assumes everything should be reconnected. harvest-components delegates its swap step to this logic.
- **`figma-generate-library`:** the builder for the NEW components this skill nominates.
- **`figma-designer`:** core design knowledge; load it when judging whether something *deserves* to be a component.

---

## Process

### Step 0 — Load `figma-use`
Required before every `use_figma` call.

### Step 1 — Scope the target
Confirm which page(s)/frame(s) to audit (a selection, a named page, or whole file). Note the companion design-system file/library if the components live elsewhere.

### Step 2 — Inventory: instances vs. bespoke
Walk the target and split every node into **already an instance** (leave alone) vs. **bespoke frame** (a candidate). Record for each candidate: id, label/text, size, fills/strokes, corner radius, `layoutSizingHorizontal` (FILL vs HUG), parent + child index, and any `componentPropertyReferences` (a `visible`/boolean ref means a parent toggle depends on it).

```js
function insideInstance(n){let p=n.parent;while(p){if(p.type==='INSTANCE')return true;p=p.parent;}return false;}
// bespoke candidate = a FRAME not already inside an instance
```

### Step 3 — Discover the design system (dynamic)
Enumerate the library's components/variant sets, their `componentPropertyDefinitions` (TEXT/BOOLEAN/INSTANCE_SWAP/VARIANT), and variable collections. Build a map of "what components exist and what props they expose" so matching is by real structure, not guesswork. If the DS is a separate published library, read component `key`s for import.

### Step 4 — Classify every bespoke element
Put each candidate in exactly one bucket:

- **A — Maps to an existing component.** Its structure/role matches a library component (a number+label pair → a stat block; an eyebrow+headline+subtext+buttons band → a CTA band; a photo placeholder with a glyph → a media frame; a filled/outlined pill with one text child → a button).
- **B — Nominate a NEW component.** No existing match, but it **recurs** or is clearly a reusable pattern (appears 2+ times, or is an obvious system primitive). Flag it to build via `figma-generate-library`.
- **C — Correctly bespoke.** A genuine one-off with no reuse and no matching component (e.g. a unique split-hero, oversized "two-door" panels). Leave it; say why.
- **D — False positive.** *Looks* like a component but isn't. Filter these out explicitly:
  - **Number/index badges** — small, pure-numeric label ("01", "1"), often pill radius. Not a button.
  - **Input fields** — a placeholder containing `@` or resembling a form field. Not a button.
  - **Decorative frames** — dividers, spacers, background shapes.

Confidence comes from **structure**, not the layer name. Verify with the exposed-prop shape and child composition.

### Step 5 — Report & get approval
Present a prioritized table before changing anything:

| Element | Bucket | Target component + variant | Why / rationale |

For **A**, name the exact variant/theme (see *Variant selection*). For **B**, describe the proposed new component and where else it appears. For **C/D**, one line each so the user sees you considered them. **Wait for approval** — componentization changes shared structure; don't swap silently.

### Step 6 — Execute A: swap bespoke → existing instance
Delegate the mechanics to `reattach`-style logic. Per element:

1. Capture the element's content (label(s), caption, media) and layout facts (parent, index, `layoutSizingHorizontal`, alignment).
2. Import the component (`importComponentByKeyAsync` / `importComponentSetByKeyAsync`) and create an instance from the right variant.
3. **Map content → props** using the component's own property keys — `setProperties({'Label#…':text, Theme:…, …})`. Prefer real props over editing nested text.
4. `parent.insertChild(idx, inst)` at the original index; then re-apply `layoutSizingHorizontal='FILL'` **after** insertion if the original filled.
5. **Preserve boolean toggles:** if the old frame carried a `visible` ref to a parent BOOLEAN prop, set `inst.componentPropertyReferences = {visible:'<Show…#id>'}`.
6. Remove the old frame. If a now-orphaned parent TEXT prop only fed that frame, `deleteComponentProperty` it (and note that consumer overrides for it will reset — capture them first, see Gotchas).

### Step 6b — Execute B: harvest a NEW component
Hand the nomination to `figma-generate-library`: build the component from the best exemplar (tokenized, variants as needed), publish, then swap the instances back in using Step 6. Record any elements that stay bespoke (bucket C) in the summary.

### Step 7 — Verify
- **Screenshot** each changed region and eyeball against the original — same content, position, spacing.
- **Instance health:** re-scan for `INSTANCE`s with a null `getMainComponentAsync()` (missing/detached) and confirm all are library-linked (`main.remote`).
- **No regressions:** confirm counts (e.g. buttons absorbed into a band are expected to drop the standalone count).

---

## Variant & theme selection (by context)
Pick the variant from where the element *lives*, not just its own fills:
- **Background drives theme.** On a brand/dark band, a stat's white numbers → an "on-brand"/inverse theme; on light, the default theme. An outline button on a colored band → the "light"/inverse button style.
- **Fill drives style.** Solid accent → the accent/primary button style; white + border → secondary; transparent + border → ghost/light.
- **Height drives size, and controls that touch must match.** A button beside an input must share the input's height (see control-height in Gotchas). Map 36/44/48 → Small/Medium/Large or the file's equivalents.

## Preserve-layout rules
- `resize()` re-locks an auto-layout frame to FIXED — set sizing modes (`primaryAxisSizingMode`, `layoutSizing*`) **after** any resize.
- `layoutSizingHorizontal='FILL'` is only settable **after** `appendChild`/`insertChild` into an auto-layout parent.
- Re-hug non-auto-layout containers (a `COMPONENT_SET` is `layoutMode: NONE`) by manually resizing to fit their children as the **last** step.

## Gotchas (learned in practice)
- **Nested-instance props don't auto-expose.** Putting a Button instance inside a component does **not** surface its `Label` on the parent, and the plugin API can't expose it (UI-only). If you swap a bespoke button that backed a parent TEXT prop, that prop must be **deleted** — labels then live on the nested instance. Warn the user; this is the main trade-off of "components all the way down."
- **Deleting a parent prop resets consumer overrides.** Before deleting a label/visibility prop, capture every consuming instance's override value so you can restore it (via nested-instance overrides) after republish.
- **Cloning a variant drops `componentPropertyReferences`.** When adding a size/variant by cloning, re-set the clone's label ref (`{characters:'Label#…'}`) and icon-slot refs (`{visible:…, mainComponent:…}`), or instances render raw defaults.
- **Control-height coherence.** A button and input in the same form must be equal height; achieve it on-grid via matched line-height + token padding rather than ad-hoc pixel padding.
- **Variant-set default border.** A `COMPONENT_SET` shows Figma's native dashed border when it has no fill and no stroke; don't paint a manual dashed stroke to fake it.
- **Republish + remap.** Editing shared components requires a library republish; consuming files update afterward. Restore any captured overrides then.

## Output
A short written summary: what was swapped (with target components), what was nominated as new, what stayed bespoke and why, verification result, and any follow-ups (republish, override restoration).
