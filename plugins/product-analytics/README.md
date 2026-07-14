# product-analytics

- **measurement-plan** — the post-launch half of measurement: design the instrumentation (events, properties, funnels) needed to capture your metrics, then interpret the results to judge whether a shipped design actually worked — and turn surprises into the next research question.
- **experimentation** — design and interpret A/B tests: a testable hypothesis, primary metric + guardrails, sample-size / minimum-detectable-effect and run-time, and a disciplined read-out (significance, confidence intervals, peeking, novelty, segments).

This closes the loop back to Discover. It's distinct from `synthesis-artifacts` → `success-metrics` (which *defines* the targets before build) and from `changelog-automation` (which tracks *design-system* drift, not product outcomes). It picks up where `success-metrics` leaves off: metrics chosen → instrument them → read them.

**Project-agnostic** and tool-agnostic (works whether you use Amplitude, Mixpanel, GA4, PostHog, or SQL). No external services required — it produces plans and interpretations, not live queries. Triggers from natural language ("what events should we track?", "plan instrumentation", "did the redesign work?", "interpret these metrics").

Install: `/plugin install product-analytics@ai-ux-toolkit`
