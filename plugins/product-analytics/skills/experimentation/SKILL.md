---
name: experimentation
description: Design and interpret A/B tests and experiments to prove whether a design change actually works. Covers a testable hypothesis, the primary metric + guardrails, sample-size / minimum-detectable-effect and run-time estimation, randomisation, and a disciplined read-out (significance, confidence intervals, peeking, novelty effects, segment checks). Distinct from planning targets (success-metrics) and general instrumentation (measurement-plan). Trigger when the user wants to "design an A/B test", "plan an experiment", "how big a sample?", "did the test win?", "interpret experiment results", "is this significant?", or mentions A/B, multivariate, or holdout tests.
---

Prove impact instead of assuming it. This skill designs experiments that can actually answer "did this change help?" and reads the results honestly — the part where good intentions meet statistics. It sits next to `measurement-plan` (which instruments events) and `success-metrics` (which chose the metric); this one is specifically about controlled comparison.

## Example prompts

- "Design an A/B test for the new checkout button"
- "How many users do we need to detect a 2% lift?"
- "Here are the results — did variant B win?"
- "Is this difference significant or noise?"

---

## Mode 0 — Design or interpret?

Detect intent: **design** an experiment or **interpret** results. A full cycle does both.

---

## Design an experiment

1. **Hypothesis** — a specific, falsifiable statement: *"Changing X will improve [primary metric] for [audience] because [reason]."* If it can't be stated this way, it's not ready to test.
2. **Primary metric** — one metric that decides the test (from `success-metrics`). Resist multiple primaries.
3. **Guardrail metrics** — what must *not* get worse (revenue, latency, complaints, unsubscribes). A "win" that breaks a guardrail isn't a win.
4. **Unit & randomisation** — randomise by user (or session/account) consistently; avoid contamination between variants.
5. **Sample size & run-time** — estimate from baseline rate, the **minimum detectable effect** worth caring about, significance (α, typically 0.05) and power (typically 80%). State the required n per variant and the calendar time at current traffic. Flag if the test would take impractically long (underpowered → don't run it as an A/B).
6. **Duration rules** — run at least one to two full business cycles (capture weekday/weekend); pre-commit the stop date to avoid peeking.
7. **Segments to check later** — pre-declare the cuts you'll analyse (new vs. returning, plan) to avoid fishing.

## Interpret results

1. **Did the primary metric move**, by how much, with a **confidence interval** — report the effect size and its uncertainty, not just a p-value.
2. **Significance & power** — was it significant at the pre-set α? Was the test actually powered, or is a "null" just inconclusive?
3. **Guardrails** — check every one; a primary lift with a guardrail regression is a fail.
4. **Peeking / early stopping** — if someone called it early, treat the significance as inflated; note it.
5. **Novelty / primacy** — short-term change may fade; recommend a follow-up or holdback if plausible.
6. **Segments** — check pre-declared cuts; watch for effects that reverse across groups.
7. **Decision** — ship / iterate / roll back, with the confidence it warrants. Route open "why" questions to `research-planning` (qual follow-up).

---

## Output format

- **Design** — hypothesis · primary metric · guardrails · unit/randomisation · required sample size + run-time (with the assumptions) · duration & stop rule · segments to analyse.
- **Interpretation** — effect size + CI, significance/power read, guardrail check, peeking/novelty caveats, segment findings, and a clear decision with its confidence.

Offer to save as markdown. Keep it tool-agnostic (works with any experimentation platform or manual analysis).

---

## Guardrails

- **One primary metric, always with guardrails.** No decision on a lift that quietly breaks something else.
- **Power the test or don't run it.** An underpowered A/B produces false confidence; say so and suggest alternatives (longer run, bigger effect, qualitative).
- **Don't peek.** Pre-commit the sample size and stop date; flag early-stopping as inflating significance.
- **Report uncertainty.** Effect size + confidence interval over a bare "significant/not."
- **Correlation isn't causation — except in a clean RCT.** And even then, watch novelty, contamination, and segment reversals before declaring victory.
- **This is analysis, not licensed statistical advice.** State assumptions and uncertainty honestly.
