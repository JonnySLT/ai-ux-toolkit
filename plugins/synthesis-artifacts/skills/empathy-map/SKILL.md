---
name: empathy-map
description: Build an empathy map from research — a shared picture of what a user says, thinks, does, and feels, plus their pains and gains. Grounds each quadrant in evidence, surfaces contradictions (e.g. says vs. does), and turns the result into design implications. Quick, alignment-focused define-phase artifact that pairs with personas and journey maps. Trigger when the user wants to "create an empathy map", "map what users think and feel", "says/thinks/does/feels", or synthesise research into an empathy map.
---

Build an empathy map: a fast, shared snapshot of a user's world that aligns a team before deeper artifacts. It captures **Says / Thinks / Does / Feels** (plus Pains & Gains) for one user or segment, grounded in real research. Its special value is exposing **gaps between quadrants** — what people *say* vs. what they *do* is often the insight.

## Example prompts

- "Make an empathy map from these interviews"
- "Empathy map for the first-time buyer"
- "What do our users think and feel about onboarding?"

---

## Step 0 — Scope & ground (required first)

1. **Who?** One persona or segment per map (use `personas` if available). Mixing users blurs it.
2. **Evidence base.** Ground quadrants in research (`research-synthesis` output, interviews, support data). Mark anything inferred as an assumption to validate — don't fill quadrants from imagination.
3. **Focus.** A specific situation ("using the app for the first time") makes it sharper than "in general."

---

## Process — the quadrants

For the chosen user and situation, populate:

- **Says** — verbatim or near-verbatim quotes; what they express out loud.
- **Thinks** — beliefs, questions, and concerns they may *not* say aloud (infer carefully, mark as inference).
- **Does** — observable actions and behaviours; what they actually do.
- **Feels** — emotions and their intensity, and what triggers them.
- **Pains** — frustrations, fears, obstacles, risks.
- **Gains** — wants, needs, hopes, measures of success.

Then the analysis that makes it worth doing:
- **Contradictions** — call out where quadrants disagree (Says "I'd pay for this" but Does = never upgraded; Thinks "it's fine" but Feels = anxious). These tensions are where the real insight lives.
- **Design implications** — 2–4 "so what?" takeaways the map points to (feeds `divergent-exploration` and the `design-planning` brief).

---

## Output format

1. **Header** — user/segment, situation, evidence base.
2. **The map** — the six sections (Says / Thinks / Does / Feels / Pains / Gains), each with a few evidence-tied bullets and source IDs where possible.
3. **Contradictions & tensions** — the gaps between quadrants.
4. **Design implications** — the actionable "so what."

Keep it to a page — the empathy map is a fast alignment tool, not a report. Offer to save as markdown or render as a Figma doc page.

---

## Guardrails

- **Ground it, don't guess it.** Quadrants come from evidence; label inferences (especially Thinks/Feels) as assumptions to validate.
- **One user per map.** Combining segments defeats the purpose.
- **Mine the contradictions.** The "says vs. does" gap is usually the most valuable output — surface it, don't smooth it over.
- **Keep it a tool, not decoration.** If it won't inform a design decision, say so.
