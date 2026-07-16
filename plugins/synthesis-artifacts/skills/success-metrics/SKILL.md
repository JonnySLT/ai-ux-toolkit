---
name: success-metrics
description: Define what success looks like for a feature or product before it ships, using the HEART framework and the goal → signal → metric method. Turns a fuzzy goal into measurable signals and specific metrics, adds counter/guardrail metrics to catch gaming, and sets targets. Distinct from post-launch measurement — this is choosing the right targets up front. Trigger when the user asks "what metrics should we track?", "define success metrics", "set KPIs / a North Star", "HEART framework", or how to measure whether a design worked.
---

Decide what success means, and how you'll know, **before** building — so the team designs toward an outcome instead of retrofitting a metric later. The goal is a small set of the *right* measures, with guardrails, tied to the user and business goal. (Instrumenting and reading them post-launch is the `product-analytics` plugin's job; this is the up-front definition.)

## Example prompts

- "What metrics should we track for this new checkout flow?"
- "Define success metrics for our onboarding redesign"
- "Set a North Star and supporting metrics for the feature"
- "Apply HEART to this feature"

---

## Step 0 — Anchor to the goal (required first)

Establish:
1. **What are we measuring the success of?** A feature, a flow, or the whole product — scope matters.
2. **The user goal and the business goal.** Good metrics connect the two; name both.
3. **Level.** Feature-level (HEART fits well) vs. product-level (North Star + inputs). Say which.

---

## Process

### Goal → Signal → Metric (the core method)
For each goal, work down the chain:
- **Goal** — what success means in plain language ("users trust the new flow and complete it").
- **Signal** — an observable behavior or attitude that indicates progress toward the goal ("users complete checkout without abandoning", "users report confidence"). Prefer signals that get *worse* when the experience is bad.
- **Metric** — the specific, trackable number for that signal ("checkout completion rate", "post-purchase confidence score"). Define it precisely (numerator/denominator, window, segment).

### HEART (for feature/UX quality)
Pick the categories that fit — not all five are relevant to every feature:
- **Happiness** — satisfaction, perceived ease (survey, SUS, CSAT).
- **Engagement** — depth/frequency of interaction (for the right feature — not vanity).
- **Adoption** — new users/uptake of the feature.
- **Retention** — return/continued use over time.
- **Task success** — completion rate, time, error rate.
Run each chosen category through goal → signal → metric.

### North Star (for product level)
Name the single metric that best captures delivered value, plus 2–4 **input metrics** that teams can actually move. Keep it value-based, not a vanity count.

### Guardrail / counter metrics (do not skip)
For every primary metric, add a **counter-metric** that catches gaming or unintended harm — e.g. "completion rate" guarded by "refund/complaint rate", "engagement" guarded by "unsubscribe rate". This is what stops a metric from being optimized into a bad experience.

### Targets & instrumentation notes
Set a baseline (if known) and a target/direction for each metric. Note what needs instrumenting to capture it (hands off cleanly to `product-analytics`).

---

## Output format

1. **Goal statement** — user goal + business goal.
2. **Metrics table** — Goal · Signal · Metric (precise definition) · Target/direction · Guardrail metric.
3. **North Star** (if product-level) with its input metrics.
4. **What to instrument** — the events/data needed, for handoff to measurement.

Keep the set small — a few metrics that matter beat a dashboard of everything. Offer to save as markdown or feed into the `design-planning` brief.

---

## Guardrails

- **Measure outcomes, not vanity.** Prefer value/behavior metrics over raw counts (page views, total clicks) that look good but mean little.
- **Always pair a guardrail.** No primary metric ships without a counter-metric; otherwise you invite optimizing the number at the user's expense.
- **Keep it small.** A handful of right metrics; resist the urge to track everything.
- **Define precisely.** Ambiguous metrics ("engagement") are useless — specify the exact calculation, window, and segment.
- **This is definition, not measurement.** Setting targets ≠ collecting data; hand instrumentation and post-launch reading to `product-analytics`.
