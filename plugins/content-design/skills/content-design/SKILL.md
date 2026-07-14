---
name: content-design
description: Write functional UI microcopy systematically — error messages, empty states, buttons and CTAs, form labels and helper text, confirmation dialogs, notifications, and onboarding. Focuses on what to say and how to structure it (clear, concise, useful, consistent patterns), then works with brand-voice for tone. Trigger when the user wants to "write UI copy / microcopy", "fix this error message", "what should this empty state say?", "name this button", "write the confirmation dialog", or design content for a specific UI element or pattern.
---

Design the words in the interface so they do a job: help the user understand, decide, and act. Good microcopy is **clear, concise, and useful** — and consistent across the product. This skill decides *what to say and how to structure it*; the `brand-voice` plugin then makes it sound like your brand. (For copy *exploration/variants*, use `divergent-exploration`'s copy mode; this is the systematic craft pass.)

## Example prompts

- "Write the error messages for this form"
- "What should this empty state say?"
- "Name these buttons" / "Is 'Submit' the right label?"
- "Write the delete-confirmation dialog"
- "Draft the onboarding tooltips"

---

## Step 0 — Context (brief, required)

Establish: **which element/pattern**, the **user's situation** at that moment (frustrated? first time? mid-task?), the **action** you want to enable, and any **constraints** (character limits, localisation, existing terms/glossary, brand voice profile if one exists). Load the project's voice profile if present so structure and tone align.

---

## Principles (apply to all UI copy)

- **Clarity beats cleverness.** The user must understand instantly. Wit never at the cost of comprehension.
- **Concise, not cryptic.** Cut every word that doesn't help; keep the words that do.
- **Useful and actionable.** Tell the user what happened and what to do next.
- **Lead with the benefit/outcome**, not the mechanism.
- **Consistent terminology.** Same concept, same word, everywhere (build/keep a mini-glossary).
- **Human, blameless, calm.** Never blame the user; no jargon, no scary system-speak.
- **Front-load.** Most important words first (labels, headings, buttons scanned, not read).

---

## Patterns

Apply the pattern-specific rules:

- **Buttons / CTAs** — a verb + object describing the outcome ("Create board", "Send invite"), not vague "Submit/OK". Match the button to what actually happens.
- **Form labels & helper text** — label says what the field is; helper text prevents errors *before* they happen (format, why it's needed). Never rely on placeholder as label.
- **Error messages** — say **what went wrong**, **why** (if useful), and **how to fix it**, in plain language. No codes-only, no "invalid input", no blame. Inline and specific beats a generic banner.
- **Empty states** — explain what goes here, why it's empty, and the one action to fill it (turn a dead end into a first step). Distinguish *first-use* empty from *no-results* empty from *user-cleared* empty.
- **Confirmations** — for destructive/irreversible actions: name the specific consequence ("Delete 3 boards? This can't be undone"), and make the button say the action ("Delete boards"), not "OK". Don't over-confirm reversible actions.
- **Notifications / toasts** — what happened + any next action; success is brief, errors are actionable.
- **Onboarding** — task-focused, progressive, skippable; teach by doing, not walls of text.

---

## Output format

For a single element: the recommended copy, a one-line rationale, and 1–2 alternates if the choice is close. For a set (e.g. all form errors): a **table** — element/trigger · copy · note. Include character counts when limits matter. Flag any new term to add to the product glossary. Offer to run the result through `brand-voice` for tone, and to save a copy deck as markdown.

---

## Guardrails

- **Never blame the user or use scary system language.** Errors are calm and helpful.
- **Say what to do next.** Copy that states a problem without a path forward is half-done.
- **Consistency is a feature.** Reuse established terms and patterns; flag divergence.
- **Respect limits and localisation.** Honour character constraints; avoid idioms/puns that won't translate, and don't concatenate fragments that break in other languages.
- **Structure here, voice via brand-voice.** Decide the message and shape; hand tone/personality to the brand-voice profile rather than inventing a voice.
