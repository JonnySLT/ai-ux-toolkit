---
name: journey-map
description: Build a journey map or experience map from research — the stages a user moves through and, at each, their actions, thoughts, emotions, touchpoints, pain points, and opportunities. Surfaces the moments that matter (drop-offs, friction, delight) across an end-to-end experience so the team knows where to focus. Trigger when the user wants to "map the user journey", "create a journey map", "experience map", "service blueprint", or visualize a user's end-to-end experience across stages.
---

Lay out an experience end-to-end so the team can see where it breaks and where the opportunities are. A journey map is a **structured narrative of one persona pursuing one goal across stages** — grounded in research, not imagined. The payoff is the pattern it reveals: where emotion dips, where users drop off, where a small fix has outsized impact.

## Example prompts

- "Map the onboarding journey from our research"
- "Create a journey map for a first-time buyer"
- "Turn these findings into an experience map"

---

## Step 0 — Scope the map (required first)

Pin down, before mapping:
1. **Whose journey, toward what goal?** One persona (from `personas` if available) and one scenario/goal per map. Mixing personas or goals produces mush.
2. **Start and end points.** Where does the journey begin (often before the product — trigger/awareness) and end (often after — outcome/retention)? Don't clip it to just the in-product part.
3. **Evidence base.** Ground stages and emotions in research (`research-synthesis` output, interviews, support data, analytics). Mark anything inferred as an assumption to validate.
4. **Map type.** Journey map (one persona, one scenario), experience map (broader, product-agnostic), or service blueprint (adds behind-the-scenes/backstage). Default to journey map unless asked.

---

## Process

Build the map as stages (columns) × lanes (rows).

1. **Define the stages** — the phases the user moves through (e.g. Trigger → Research → Sign-up → First use → Habit). Name them in the user's terms.
2. **For each stage, populate the lanes:**
   - **Actions** — what the user actually does.
   - **Thoughts / questions** — what's on their mind (verbatim quotes where possible).
   - **Emotions** — the emotional high/low, as a curve across stages. This is what reveals the critical moments.
   - **Touchpoints / channels** — where the interaction happens (app, email, support, offline).
   - **Pain points** — friction, confusion, drop-off (with evidence).
   - **Opportunities** — how the experience could improve at that stage (framed as opportunities/HMW, not locked solutions).
3. **Add backstage lanes** if it's a service blueprint — frontstage vs. backstage actions and supporting systems.
4. **Identify the moments that matter** — call out the biggest emotional dips, the highest-drop-off stage, and the make-or-break moment of truth. This is the headline, not the grid.

---

## Output format

1. **Header** — persona, scenario/goal, and scope (start → end).
2. **The map** — a stage × lane table (Actions / Thoughts / Emotion / Touchpoints / Pain points / Opportunities). Represent the emotion curve explicitly (e.g. 😃 → 😐 → 😟 or a 1–5 rating per stage).
3. **Moments that matter** — the 2–4 critical points, with why they matter and the biggest opportunities.
4. **Recommended focus** — where to invest first based on impact.

Offer to save as markdown or render as a Figma doc page (using the file's own styles). Note that opportunities can feed `divergent-exploration` (to generate solutions) and the `design-planning` brief.

---

## Guardrails

- **One persona, one goal per map.** Combining them destroys the narrative.
- **Ground it in research.** Emotions and pain points come from evidence; label inferences as assumptions to validate — don't present a guessed emotion curve as fact.
- **Map the whole arc.** Include the before (trigger) and after (outcome), not just in-product steps.
- **Lead with insight, not the grid.** The value is the moments that matter and the opportunities — the table is just how you get there.
