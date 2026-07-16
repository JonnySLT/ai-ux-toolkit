---
name: accessibility-check
description: Run a first-pass accessibility check against WCAG 2.1/2.2 AA before a human review. Works on a screenshot, a Figma frame/URL, a live URL, or code, and flags the obvious mechanical issues — insufficient color contrast, missing text alternatives and form labels, focus order and visible focus, touch/target size, heading and landmark structure, and meaning carried by color alone. Each finding cites the WCAG success criterion, a severity, and a concrete fix. Trigger when the user asks to "check accessibility", "audit a11y", "is this contrast okay?", "WCAG check", or wants a first accessibility pass on a design or page.
---

Catch the obvious, checkable accessibility problems fast — the ones worth fixing before spending a person's time on review. This is a **first filter, not a substitute** for manual keyboard testing, screen-reader testing, or testing with disabled users. Never certify a design as "accessible"; report what you can verify and name what still needs a human.

## Example prompts

- "Run an accessibility check on this screen" (+ screenshot / Figma link)
- "Is this button's contrast AA?"
- "Check localhost:3000 for a11y issues"
- "Audit this component's markup for accessibility"

---

## Step 0 — Identify the input & set the bar

Determine what you've been given, because it changes what you can check:

| Input | What you can check reliably | What you can't |
|---|---|---|
| **Live URL / running app** | Contrast (computed), labels, alt, heading/landmark structure, focus order, target size, ARIA — via the browser-preview tools | Real screen-reader output, actual AT behavior |
| **Code / markup** | Semantic elements, labels, alt, ARIA, contrast from token/CSS values, tab order from DOM | Rendered result, dynamic states |
| **Figma frame** (via Figma MCP) | Contrast from fill tokens, text size, target size, visible labels, order | Anything runtime — focus, keyboard, ARIA |
| **Screenshot only** | Visible contrast (estimated), visible labels, target size, color-only signals | Anything not visible — markup, focus, alt text |

Default target is **WCAG 2.1 AA**. Note the level you're testing against, and state up front which checks the given input does and doesn't support.

---

## The checks

### 1. Color contrast (WCAG 1.4.3 / 1.4.11)
- **Body text** ≥ 4.5:1; **large text** (≥ 24px, or ≥ 18.66px bold) ≥ 3:1.
- **UI components & graphical objects** (borders, icons, focus rings, chart marks) ≥ 3:1 against adjacent colors (1.4.11).
- Compute the ratio from actual values when you have them (CSS/token/Figma fills). From a screenshot, estimate and mark it as estimated. Report the pair, the ratio, and pass/fail per level.

### 2. Text alternatives (WCAG 1.1.1)
- Images, icons, and icon-only buttons have meaningful `alt` / accessible names; decorative images are marked so (empty `alt`/`aria-hidden`).
- No information conveyed by an image without a text equivalent.

### 3. Labels & names (WCAG 1.3.1 / 4.1.2 / 3.3.2)
- Every form control has a programmatic label (not placeholder-only).
- Buttons and links have discernible text or accessible names.
- Related fields are grouped (fieldset/legend or equivalent).

### 4. Focus order & visible focus (WCAG 2.4.3 / 2.4.7 / 2.4.11)
- Tab order follows reading/visual order; nothing interactive is skipped or trapped.
- Focus is clearly visible on every interactive element and not obscured.

### 5. Target size (WCAG 2.5.8 AA / 2.5.5 AAA)
- Interactive targets ≥ **24×24px** (AA minimum) — treat **44×44px** as the recommended comfortable size, especially on touch. Flag anything smaller without adequate spacing.

### 6. Structure (WCAG 1.3.1 / 2.4.6)
- Logical heading hierarchy (one h1, no skipped levels used for styling).
- Landmarks/regions present (header, nav, main, footer) where applicable.
- Reading order is meaningful.

### 7. Color & sensory reliance (WCAG 1.4.1 / 1.3.3)
- Meaning isn't carried by color alone (error states, required fields, status, chart series need a second cue: icon, text, pattern).
- Instructions don't rely solely on shape/position ("click the round button").

### 8. Motion & text sizing (quick flags)
- Note any auto-playing motion without a pause control (2.2.2) and any fixed-px layouts that would break at 200% zoom (1.4.4) — flag for follow-up rather than deep-testing.

---

## Process

1. **Inventory** the interactive and text elements in the input.
2. Run each applicable check above; for a live URL, use the browser-preview tools (read the page/DOM, compute styles) rather than eyeballing.
3. Record every finding as: **element · issue · WCAG SC · severity · fix**.
4. Sort by severity, then group by check type.

**Severity scale:**
- `blocker` — makes content unusable for a group (e.g. control with no accessible name, contrast far below AA on body text).
- `serious` — significant barrier with a workaround (low-but-close contrast, small targets).
- `moderate` — degrades experience (weak focus indicator, minor structure issues).
- `minor` — polish (slightly-off decorative contrast).

---

## Output format

**Summary line** — input type, WCAG level tested, counts by severity, and one sentence on overall state.

**Findings table:**

| # | Element | Issue | WCAG SC | Severity | Fix |
|---|---|---|---|---|---|
| 1 | "Continue" button | Text #8A8A8A on #FFFFFF = 3.5:1 | 1.4.3 | serious | Darken to ≥ #767676 for 4.5:1 at 16px |
| 2 | Search icon button | No accessible name | 4.1.2 | blocker | Add `aria-label="Search"` |

**Still needs a human** — the checks this input couldn't cover (keyboard walk-through, screen-reader pass, testing with disabled users, cognitive load). Always include this section; it's the point of "first filter, not replacement".

---

## Guardrails

- **Never claim a design is accessible or compliant.** You report checkable issues; conformance requires human and AT testing.
- **Be honest about estimates.** Contrast from a screenshot is approximate — say so, and prefer computed values whenever the input allows.
- **Cite the specific success criterion** for each finding so it's actionable and verifiable.
- **Fixes must be concrete** — a target color, an attribute, a size — not "improve contrast".
