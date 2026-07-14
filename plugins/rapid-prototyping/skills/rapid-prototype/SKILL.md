---
name: rapid-prototype
description: Turn a rough idea, brief, sketch, or set of chosen concepts into a clickable, functional prototype — minimal runnable front-end code (single-file HTML or React) that you can actually interact with, verified live in the browser preview. Built to test real interaction and flow, not to be production code or a static comp. Uses the project's design system/tokens if present, else clean neutral defaults. Trigger when the user wants to "prototype this", "make it clickable", "build a quick interactive version", "turn this idea into something I can test", or mentions "rapid prototype" or "clickable mockup".
---

Get from idea to something a person can click through, fast. The output is a **functional prototype to test interaction and flow** — deliberately not production code, not a design-system contribution, and not a static mockup. Optimise for speed of building and speed of learning.

## Example prompts

- "Prototype this onboarding flow so I can click through it"
- "Turn concept #3 from the exploration into something interactive"
- "Make a clickable version of this wireframe" (+ sketch/screenshot)
- "I want to test whether this filter interaction feels right"

---

## Step 0 — Pin down what you're testing (required)

A prototype is only useful if it answers a question. Establish, briefly:

1. **The core interaction or flow to test** — the one thing that must feel real (the swipe, the multi-step form, the filtering, the state change). Everything else can be faked.
2. **Fidelity needed** — low (grey boxes, real behaviour) is usually right for testing flow; only go higher if the visual is the thing being tested.
3. **Scope / screens** — which screens or states, and the happy path through them. Resist building the whole app.
4. **Design system?** — check the project for design tokens / a component library / a running app to match. If present, use its tokens and patterns so the prototype feels native. If not, use clean neutral defaults (system font, restrained palette, generous spacing) — don't invent an elaborate visual language.

If the input is the output of `divergent-exploration` or a design brief, read it and confirm which concept/flow to build.

---

## Process

### 1. Pick the minimal stack
- Default to a **single self-contained file** — one HTML file with inline CSS/JS, or a single React component — that the browser preview can run with no build step where possible.
- Match the project's stack if you're prototyping inside an existing app (its framework, its tokens). Otherwise stay minimal.
- Fake the backend: hardcode data, mock responses, use local state. No real APIs, no auth, no persistence unless the interaction being tested depends on it.

### 2. Build for interaction, not completeness
- Make the **core interaction genuinely work** — real state, real transitions, real feedback. That's the point.
- Stub the periphery: non-essential buttons can be visibly inert or route to a placeholder. Use realistic placeholder content (real-ish copy, plausible data) — lorem ipsum hides usability problems.
- Include the states the test needs: empty, loading, error, success — if they're part of what you're evaluating.

### 3. Run and verify it in the browser preview
This is mandatory — a prototype that hasn't been run isn't a prototype. Follow the environment's verification workflow:
- Start/refresh the preview and load the prototype.
- Check the console and logs for errors; fix any before showing the user.
- Drive the core interaction with the browser tools (click, type, navigate) and confirm it behaves — state changes, transitions fire, the flow completes.
- Check responsive/dark behaviour only if it's relevant to what's being tested.

### 4. Share proof
- Capture a screenshot (or a short interaction trace) showing the prototype working.
- Tell the user how to run/open it themselves, and walk them through the flow to test.
- Note explicitly what's real vs. faked, so no one mistakes a stub for a decision.

---

## Output format

1. **What it tests** — one line naming the interaction/flow the prototype exercises.
2. **The prototype** — the file(s), runnable, with a clear entry point.
3. **Proof it works** — screenshot / interaction result from the preview.
4. **How to try it** — run/open instructions and the path to click through.
5. **Real vs. faked** — a short list of what's genuinely functional and what's stubbed.
6. **Next step** — offer to raise fidelity, add a screen/state, wire a real interaction, or (if wanted) rebuild it in the project's actual stack.

---

## Guardrails

- **This is throwaway code by design.** Don't gold-plate it, don't add tests, don't refactor for reuse. Speed and learnability win. Say so, so it isn't mistaken for production work.
- **Always run it before handing it over.** Verify in the preview; never ship an unverified prototype or ask the user to check it manually.
- **Fake generously, but keep the tested interaction real.** The whole value is that the core thing behaves — everything else is scenery.
- **Match the system if there is one; don't invent one if there isn't.** Neutral defaults beat an elaborate bespoke look that muddies the test.
- **Keep scope to the question.** One flow, the happy path, plus whatever states the test needs — not the whole product.
