---
name: divergent-exploration
description: Generate a wide, deliberately-varied spread of options to break fixation early in a project. Produces distinct product concepts, copy variants (CTAs, headlines, error messages, onboarding lines), or IA/layout structures — each genuinely different in strategy, spanning safe to bold, with a one-line rationale and trade-off — so the designer edits and selects rather than starting from a blank page. Trigger when the user wants to brainstorm, "give me options/variants/concepts", explore directions, "different ways to…", break out of a rut, or mentions "divergent", "ideation", or "explore".
---

Produce a broad, deliberately-spread set of options so the user has something to react to. The goal is **variety, not polish** — cover distinct strategies across a safe→bold range so nothing obvious gets skipped and fixation breaks early. The user narrows down; you widen out.

## Example prompts

- "Give me 10 concepts for a habit-tracking feature"
- "Some variants of this CTA: 'Get started'"
- "Different ways to structure the settings navigation"
- "I'm stuck on the empty state — show me directions"

---

## Step 0 — Frame the exploration (brief, required)

Confirm three things (infer from the prompt where you can; ask only what's genuinely missing):

1. **Mode** — what are we diverging on?
   - `concepts` — feature/product/interaction ideas
   - `copy` — variants of a specific string (CTA, headline, error, empty state, onboarding, notification)
   - `ia` — ways to structure/group/name content or navigation
   - `layout` — arrangements of a given screen's content
2. **The problem + who it's for** — restate it in one line so the options aim at the same target.
3. **Constraints** — brand voice, design system, platform, length limits, must-haves/must-avoids. Load the project's brand voice profile or design tokens if the mode needs them and they exist; otherwise proceed with neutral defaults.
4. **How many** — default to **8** distinct options unless the user says otherwise (enough to force real range, few enough to scan).

---

## Process

### Diverge across strategies, not surface wording

The failure mode is eight reworded twins. Force real spread by varying the **underlying strategy**, then order the set roughly **safe → bold**:

- **Safe** — the conventional, expected solution. Include it; it's the baseline to beat.
- **Middle** — solid variations that shift emphasis, framing, mental model, or mechanism.
- **Bold** — options that challenge an assumption in the brief, invert the flow, or borrow a pattern from an adjacent domain.

Useful axes to rotate through so options stay distinct:
- **Concepts** — different core mechanic, different moment of value, different user effort level, different metaphor, different degree of automation.
- **Copy** — different tone (plain/warm/playful/direct), different framing (benefit vs. action vs. outcome), different length, different point of view ("you" vs. "let's" vs. imperative), with/without specificity or numbers.
- **IA** — group by task vs. object vs. frequency vs. user mental model; flat vs. nested; progressive disclosure vs. everything-visible.
- **Layout** — different focal point, different reading order, different density, different primary/secondary hierarchy.

### Annotate each option

For every option give:
- A short **label** (so the user can refer to it).
- The **option itself** (the concept sentence, the copy string, the structure).
- **Why / when it wins** — one line: the strategy and the trade-off it makes.

### Nudge at the end

Close with a short "if you're stuck, try…" pointer — name the 1–2 boldest options worth prototyping, or an axis you didn't fully explore that the user could push on. Offer to expand any single option into a fuller treatment.

---

## Output format

A numbered list. For `copy` mode, a compact table reads best:

| # | Variant | Strategy / when it wins |
|---|---|---|
| 1 | "Get started" | Neutral baseline — safe, low-commitment, says nothing about value |
| 2 | "Start free — no card needed" | Removes the #1 hesitation; longer, best when cost is the objection |
| 3 | "Build your first board" | Concrete first action; sets expectation, best when the product is visual |

For `concepts`, `ia`, and `layout`, use a numbered list with the label bolded and the rationale beneath.

End with the **"if you're stuck" nudge** and an offer to expand or combine options.

---

## Guardrails

- **Enforce genuine variety.** If two options share a strategy, replace one. Reworded duplicates defeat the purpose.
- **Include the boring baseline.** The conventional option is the control the bold ones are measured against — don't skip it to look clever.
- **Don't self-edit to one answer.** This is divergent work; resist collapsing to a single recommendation. Convergence is the user's job (or a later step).
- **Respect hard constraints.** Character limits, brand voice, platform rules are non-negotiable; be bold within them, not by breaking them.
- **Label bold as bold.** Flag options that break an assumption so the user weighs them with eyes open.
