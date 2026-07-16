---
name: user-stories
description: Turn a design, feature, or brief into agile user stories with clear acceptance criteria. Writes stories in the "As a [user], I want [goal], so that [benefit]" form scoped to independently shippable slices, plus testable acceptance criteria (checklist or Given/When/Then), and flags edge cases, states, and non-functional needs (a11y, performance). The dev-handoff bridge between design and engineering. Trigger when the user wants to "write user stories", "acceptance criteria", "Gherkin / Given-When-Then", turn a design into tickets/stories, or define done for a feature. 
---

Translate design intent into stories engineering can build and QA can verify. A good user story is a **thin, user-centered slice of value** with acceptance criteria that make "done" unambiguous. This complements `brief-to-tasks` (which sequences buildable work): here the output is properly-formed stories + criteria ready for a backlog.

## Example prompts

- "Write user stories for this checkout design"
- "Add acceptance criteria to this story"
- "Turn this feature into tickets with Given/When/Then"

---

## Step 0 — Source & scope (required first)

1. **What's the input?** A design/screen, a `design-planning` brief, a journey, or a feature description. Read it.
2. **Who are the users?** Use real personas/roles (from `personas`) rather than a generic "user" where possible.
3. **Slice size.** Each story should be independently valuable and shippable (vertical slice) — small enough to build in a short span, not a whole epic. Split large ones; note the parent epic.

---

## Process

### Write the stories
- Form: **"As a [specific user/role], I want [goal], so that [benefit]."** The *so that* is the point — it captures why, and guards against building the wrong thing.
- User-centered and solution-agnostic where possible (describe the need, not the widget), unless the story is deliberately UI-specific.
- Independent, negotiable, valuable, estimable, small, testable (INVEST) — flag stories that fail these (too big, no clear value, untestable).

### Write acceptance criteria
For each story, define testable conditions for "done". Use whichever fits:
- **Checklist** — bulleted, verifiable statements ("User sees an inline error when email is invalid").
- **Given / When / Then** (Gherkin) — for behavior with clear pre-conditions ("Given a logged-out user, When they submit valid credentials, Then they land on the dashboard").
Criteria must be **specific and testable** — no "works well". Cover the happy path *and* the key alternate/error paths.

### Don't forget the non-happy-path
Explicitly enumerate (lean on `states-and-edge-cases`):
- Empty / loading / error / permission states relevant to the story.
- Validation and edge cases.
- **Non-functional needs** — accessibility (per `inclusive-design`/`accessibility-check`), performance, responsive behavior, security/privacy — as criteria, not afterthoughts.

---

## Output format

For each story:
- **Title** + the "As a… I want… so that…" statement.
- **Acceptance criteria** — checklist or Given/When/Then.
- **Notes** — states/edge cases covered, non-functional requirements, dependencies, and design references (link the frame/spec; pair with `component-spec` for component detail).
- Group under the parent epic; flag any story that violates INVEST with how to split it.

Offer to save as markdown (backlog-ready). Note the flow: `design-brief` → `brief-to-tasks` (sequence) → **user-stories** (formalise for the backlog).

---

## Guardrails

- **Keep the "so that".** A story without its benefit invites building the wrong thing — always capture why.
- **Criteria must be testable.** If QA couldn't objectively check it, rewrite it. No "should be intuitive".
- **Vertical slices.** Each story delivers user value on its own; split epics, don't ship half a feature as a "story".
- **Bake in the non-happy-path.** Error, empty, and accessibility criteria belong in the story, not "later".
- **Stories describe outcomes, not solutions** (unless intentionally UI-specific) — leave room for engineering judgement.
