---
name: heuristic-review
description: Evaluate a screen or flow against Nielsen's 10 usability heuristics as a first-pass expert review. Takes a screenshot, Figma frame, live URL, or description and flags where the interface violates each heuristic, scoring every issue by severity (0–4) with a concrete fix, then splits results into quick wins and deeper fixes. A first filter before a human critique or usability test — not a replacement for either. Trigger when the user asks for a "heuristic review", "usability review", "expert review", "Nielsen heuristics", or wants to catch obvious usability problems on a screen or flow.
---

Run a structured heuristic evaluation — the fast expert-review method for catching common usability problems without recruiting users. This is a **first filter**: it surfaces likely issues so a human critique or a usability test can focus where it matters. It does not measure real user behaviour.

## Example prompts

- "Do a heuristic review of this checkout screen"
- "Run Nielsen's heuristics on this flow" (+ screenshots)
- "Expert-review localhost:3000/settings"
- "What usability issues do you see here?"

---

## Step 0 — Scope

Establish:
1. **What's under review** — a single screen, a component, or a multi-step flow (get all screens/URLs for a flow).
2. **The user & task** — who's using this and what are they trying to accomplish? Heuristics are judged against a goal; without one you're guessing.
3. **Input type** — screenshot, Figma frame, live URL (drive it with the browser-preview tools), or description.

---

## The 10 heuristics (Nielsen)

Evaluate the interface against each. Note where it does well *and* where it violates — a review that only lists faults is less useful.

1. **Visibility of system status** — does the UI keep users informed (loading, saved, progress, current location) with timely feedback?
2. **Match between system and the real world** — language, concepts, and order that fit the user's world, not internal jargon?
3. **User control and freedom** — clear exits, undo/redo, cancel, back; no dead ends or forced paths?
4. **Consistency and standards** — internal consistency and platform conventions; same word/action means the same thing throughout?
5. **Error prevention** — does the design prevent problems (constraints, confirmations, good defaults) rather than just handle them?
6. **Recognition rather than recall** — options, actions, and info visible when needed; minimal memory load across steps?
7. **Flexibility and efficiency of use** — accelerators, shortcuts, and paths for both novices and experts?
8. **Aesthetic and minimalist design** — no irrelevant/competing content diluting the important; clear visual hierarchy?
9. **Help users recognise, diagnose, and recover from errors** — plain-language error messages that say what's wrong and how to fix it?
10. **Help and documentation** — findable, task-focused help where users need it (ideally little needed)?

Extend with domain-specific heuristics (e.g. onboarding, forms, data-density) when the context calls for it — say so when you do.

---

## Severity rating (Nielsen's 0–4 scale)

Rate each issue on **frequency × impact × persistence**:

- **0** — not a usability problem.
- **1** — cosmetic; fix if time permits.
- **2** — minor; low priority.
- **3** — major; important to fix, high priority.
- **4** — catastrophe; imperative to fix before release.

---

## Process

1. Walk the screen/flow against all 10 heuristics, in the user's task order for a flow.
2. Log each issue: **heuristic · what's wrong · where (screen/element) · severity 0–4 · fix**.
3. Note genuine strengths briefly so the team keeps what works.
4. Rank by severity; then split into **quick wins** (high severity, low effort) and **deeper fixes** (need design/eng work).

---

## Output format

**Summary** — what was reviewed, the user/task assumed, issue count by severity, and one-line overall read.

**Findings table:**

| # | Heuristic | Issue | Where | Severity | Fix |
|---|---|---|---|---|---|
| 1 | Visibility of status | No feedback after "Save" — user can't tell it worked | Settings header | 3 | Show a confirmation toast + update the timestamp |
| 2 | Error prevention | Destructive "Delete" has no confirm | Row actions | 4 | Add a confirm step or undo window |

**What's working** — 2–4 bullets on the strengths worth preserving.

**Priorities** — quick wins vs. deeper fixes, ordered.

**Still needs a human** — this is expert judgement, not observed behaviour; call out what a usability test with real users should validate (especially any severity-3/4 calls that hinge on assumptions).

---

## Guardrails

- **Tie every issue to a heuristic and a task.** "I don't like this" isn't a finding; "recognition rather than recall — the user must remember the code from the previous step" is.
- **Rate honestly.** Reserve 4 for genuine blockers; inflating severity makes the list useless for prioritising.
- **Credit strengths.** Flagging what works prevents teams from "fixing" good decisions.
- **Don't fabricate flow steps.** If you only have one screen, review one screen and say the flow wasn't assessed.
- **Expert review ≠ user testing.** Always name what still needs real users.
