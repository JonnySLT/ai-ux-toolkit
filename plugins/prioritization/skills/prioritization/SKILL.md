---
name: prioritization
description: Turn a list of ideas, features, or fixes into a defensible ranked order using a fitting framework — RICE, impact/effort, MoSCoW, value-vs-complexity, or Kano. Picks the method for the decision, scores each item transparently against evidence (flagging guesses), and surfaces quick wins, the ranked list, and the assumptions it rests on. Trigger when the user wants to "prioritise", "what should we build first?", "RICE score", "impact vs effort", "MoSCoW", rank a backlog, or decide what makes the cut.
---

Help decide what to do first, with reasoning that survives scrutiny. Prioritisation is only useful if it's **transparent and honest about uncertainty** — a ranked list whose scores are invented is just opinion with a number on it. Pick a fitting framework, score against evidence, show the work.

## Example prompts

- "Prioritise these 12 feature ideas"
- "RICE-score our backlog"
- "Impact vs effort on these fixes"
- "Which of these make the MVP?"

---

## Step 0 — Frame the decision (required first)

Establish:
1. **What's being prioritised, and against what goal?** Items only rank relative to an objective (a metric, a release, a strategy). Name it.
2. **The candidate list** — the ideas/features/fixes. If they come from `divergent-exploration`, `research-synthesis` opportunities, or a journey map, read them.
3. **What evidence exists** for impact and effort — research, data, estimates — vs. what will be a guess. This determines how much to trust the output.

---

## Pick the framework (fit to the decision)

- **RICE** — comparing many items where you can estimate reach: **(Reach × Impact × Confidence) ÷ Effort**. Good default for backlogs.
- **Impact / Effort (2×2)** — fast triage; surfaces quick wins (high impact / low effort) vs. big bets vs. time-sinks. Good for workshops and small lists.
- **Value vs. Complexity** — similar, framed for delivery risk.
- **MoSCoW** — scoping a release: Must / Should / Could / Won't-this-time. Good for MVP definition, not fine-grained ranking.
- **Kano** — when the question is *type* of value: basic expectations vs. performance vs. delighters; needs some user input.
- **Weighted scoring** — when multiple criteria matter (e.g. goal-fit, effort, risk, strategic alignment) with different weights.

Recommend one (or a two-step: 2×2 to triage, RICE to rank the top). Explain why it fits.

---

## Score transparently

- Define each factor's scale explicitly (e.g. Impact 0.25/0.5/1/2/3; Effort in person-weeks; Confidence as a %).
- Score every item, **showing the number and a one-line rationale**, and mark whether each score is **evidence-based or an estimate**.
- Keep **Confidence** doing real work — it's how uncertainty enters the ranking; low-confidence high-scores should get discounted, not hidden.
- Don't false-precision: round, use bands, and treat close scores as ties rather than implying item #3 beats #4 by a hair.

---

## Output format

1. **Framework + why** — the method chosen and how factors are scored.
2. **Scoring table** — item · factors (with rationale) · score · evidence vs. estimate.
3. **Ranked list / matrix** — the order, or the 2×2 with items placed; call out **quick wins** explicitly.
4. **Assumptions & sensitivities** — the guesses the ranking depends on, and which items would move most if an assumption is wrong (what to validate first).
5. **Recommendation** — a clear "do these next," acknowledging it's a decision input, not a verdict.

Offer to save as markdown. Note that top items can flow to `design-planning` (brief) and `brief-to-tasks`.

---

## Guardrails

- **Show the work.** Every score has a visible rationale; no black-box rankings.
- **Be honest about guesses.** Mark estimates vs. evidence; don't let invented numbers masquerade as data.
- **Use confidence, don't bury it.** Uncertainty must visibly affect the ranking.
- **Avoid false precision.** Bands and ties over decimal-point rankings; the framework informs judgement, it doesn't replace it.
- **Prioritisation is a decision aid.** Present it as input for the team's call, not an authoritative answer.
