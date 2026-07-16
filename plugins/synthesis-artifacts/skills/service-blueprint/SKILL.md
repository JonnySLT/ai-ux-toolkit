---
name: service-blueprint
description: Build a service blueprint — extend a customer journey with the behind-the-scenes layers that deliver it: frontstage actions, backstage actions, support processes, and systems, all tied to line-of-interaction and line-of-visibility. Reveals where breakdowns, handoffs, and ownership gaps cause a poor experience. For service, enterprise, and multi-channel/omnichannel flows. Trigger when the user wants a "service blueprint", to map "frontstage/backstage", "behind the scenes", operational/support processes behind an experience, or handoffs across teams and systems.
---

Map not just what the customer experiences, but everything the organization does to deliver it. A service blueprint extends a journey map **downward** through the layers of delivery — so you can see where a good front-end experience is being undermined by a broken backstage process, a bad handoff, or an unowned step. Essential for service, enterprise, and omnichannel work where the experience spans teams and systems.

## Example prompts

- "Create a service blueprint for the returns process"
- "Map frontstage and backstage for account setup"
- "Where are the operational handoffs breaking our onboarding?"

---

## Step 0 — Scope (required first)

1. **Which service scenario, for which customer?** One scenario per blueprint (use a `journey-map` or `personas` as the anchor if available).
2. **Start and end.** The full arc, including pre-service and post-service.
3. **Evidence.** Ground the backstage layers in reality — talk to ops/support/engineering, or mark inferred steps as assumptions. A blueprint invented without operational input is fiction.

---

## The layers (rows), across the scenario's stages (columns)

- **Physical evidence / channel** — what the customer encounters at each step (screen, email, call, physical item).
- **Customer actions** — what the customer does.
- **— line of interaction —**
- **Frontstage** — employee/system actions the customer *sees* (support reps, the UI, notifications).
- **— line of visibility —**
- **Backstage** — employee/system actions the customer *doesn't* see (fulfilment, moderation, internal review).
- **— line of internal interaction —**
- **Support processes & systems** — the internal systems, third parties, and processes each step depends on (CRM, payment processor, database, another team).

Optionally add **time/SLA** and **owner** per step.

## What to surface (the payoff)

- **Fail points** — steps where things commonly break, and which layer causes it.
- **Handoffs** — where work passes between people/teams/systems (the riskiest moments).
- **Ownership gaps** — steps no one clearly owns.
- **Front/back mismatches** — a smooth frontstage propped up by a fragile or manual backstage.
- **Opportunities** — where fixing a backstage process would most improve the experience.

---

## Output format

1. **Header** — scenario, customer, scope.
2. **The blueprint** — a stages × layers table with the three lines (interaction / visibility / internal interaction) marked, plus owner/SLA columns if useful.
3. **Fail points, handoffs & ownership gaps** — the prioritized list of where the service breaks down.
4. **Opportunities** — highest-impact fixes, often backstage.

Offer to save as markdown or render as a Figma doc page. Feeds `prioritization` (which fixes first) and the `design-planning` brief.

---

## Guardrails

- **Backstage must be real.** Ground operational layers in input from the teams who run them; mark guesses as assumptions to validate — don't fabricate internal processes.
- **One scenario per blueprint.** Multiple services in one grid becomes unreadable.
- **Lead with the breakdowns.** The value is fail points, handoffs, and ownership gaps — not the completeness of the grid.
- **Blueprint complements the journey map** — use the journey for the customer's emotional experience, the blueprint for how delivery does or doesn't support it.
