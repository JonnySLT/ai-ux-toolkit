---
name: measurement-plan
description: The post-launch half of measurement — plan the instrumentation to capture your metrics (events, properties, funnels, cohorts) and then interpret the results to judge whether a shipped design worked and what to investigate next. Tool-agnostic (Amplitude, Mixpanel, GA4, PostHog, SQL). Closes the loop back to research. Trigger when the user asks "what events should we track?", "plan analytics/instrumentation", "define a tracking plan", "did the redesign work?", "interpret these metrics/funnel", or how to measure a live feature.
---

Turn chosen metrics into data you can actually capture, then read that data honestly. This is the **post-launch** half of measurement: instrument → observe → interpret → feed the next question. It picks up from `success-metrics` (which chose *what* to measure and set targets) and, when results surprise, hands off to `research-planning`/`research-synthesis` to learn *why*.

## Example prompts

- "What events should we track for the new onboarding?"
- "Write a tracking plan for this feature"
- "Did the checkout redesign improve completion? Here's the data"
- "Interpret this funnel drop-off"

---

## Mode 0 — Plan or interpret?

Detect intent: **instrument** (design the tracking plan) or **interpret** (read results). A full loop does both.

---

## Plan the instrumentation

Start from the metrics (ideally from `success-metrics`). For each metric, define what must be captured:

1. **Events** — the user actions to log. Name them consistently (`object_action`, e.g. `checkout_completed`), verb in past tense, one clear meaning each. Avoid over-tracking — every event is maintenance.
2. **Properties** — the context each event needs to answer the question (e.g. `plan_type`, `step`, `error_reason`, `entry_point`). This is what lets you segment later.
3. **Funnels** — for flows, the ordered steps to measure drop-off between; define the start, the steps, and the conversion window.
4. **Cohorts / segments** — the cuts you'll analyze (new vs. returning, plan, persona).
5. **Identity & hygiene** — how users are identified, and guardrails against double-counting, bot traffic, and PII in properties (never put personal data in event properties).

Deliver a **tracking-plan table**: event · trigger · properties · which metric it powers. Flag the minimum set needed vs. nice-to-have.

## Interpret the results

When reading data, be rigorous and sceptical:

1. **Compare to the target/baseline** set in `success-metrics` — did it move, and by how much, in the right direction?
2. **Check the guardrail/counter-metrics** — did a primary metric improve at the expense of something else (refunds, unsubscribes, support tickets)?
3. **Segment before concluding** — an aggregate can hide opposite effects across cohorts (Simpson's paradox); slice by the segments that matter.
4. **Distinguish signal from noise** — sample size, time window, seasonality, novelty effect, and whether a difference is meaningful (practical significance), not just present. For experiments, respect significance and don't peek/stop early.
5. **Separate correlation from cause** — a metric moving alongside a release isn't proof the release caused it; note confounds (other launches, marketing, seasonality).
6. **Say what you can't tell from the numbers** — quant shows *what* happened, rarely *why*. Route open "why" questions to `research-planning` (to go ask users) — closing the loop back to Discover.

---

## Output format

- **Plan** — a tracking-plan table (event · trigger · properties · metric), funnel definitions, segments, and hygiene notes.
- **Interpretation** — metric vs. target, guardrail check, key segment findings, an honest read of confidence, and a prioritized list of next actions (ship/iterate/roll back) plus the open questions to take into qualitative research.

Offer to save as markdown. Keep it tool-agnostic; describe events/funnels so they map onto whatever analytics stack the team uses.

---

## Guardrails

- **Instrument for questions, not for its own sake.** Every event should power a metric or answer a question; over-tracking rots.
- **No PII in event properties.** Names, emails, and identifiers don't belong in analytics payloads.
- **Segment before you conclude.** Aggregates lie; always check whether cohorts disagree.
- **Correlation ≠ causation.** Note confounds; don't credit a release for a change you can't isolate.
- **Numbers show what, not why.** Pair surprising results with qualitative follow-up rather than guessing a narrative.
- **This is analysis, not licensed advice.** Report what the data supports; flag uncertainty honestly.
