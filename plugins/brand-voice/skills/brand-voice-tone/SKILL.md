---
name: brand-voice-tone
description: Enforce a project's brand voice and tone. Loads the brand's voice profile (from the project's brand guide, or by asking), then reviews and rewrites copy to match it across any UI context — CTAs, errors, onboarding, notifications, marketing. Use when asked to review, rewrite, check, or fix copy for on-brand voice/tone.
---

Review and rewrite copy so it matches **this project's** brand voice. The voice itself is not baked into this skill — it comes from a **brand voice profile** you load (or gather) at the start. The diagnose → rewrite → verify process below is brand-agnostic; only the profile changes per project/industry.

## When to use

- "Does this copy match our brand voice?"
- "Rewrite this in our voice"
- "Review this error message / CTA / onboarding text"
- "Is this on-brand?"

## Step 0 — Load the brand voice profile (required first)

Before reviewing anything, establish the profile for **this** project, in priority order:

1. **Look in the project** for a brand/voice definition — e.g. a `brand-voice.md`, `BRAND.md`, `VOICE.md`, a "Voice & tone" section in the repo's `README`/`CLAUDE.md`, or a linked brand guide. If found, use it.
2. **Check for a brand-voice plugin/skill** that already encodes guidelines (e.g. a `brand-voice:*` skill) and defer to it if present.
3. **Otherwise, ask the user** for the essentials (keep it to one short exchange):
   - 3–5 **core voice traits** (e.g. "Confident", "Warm", "Precise") + a one-line meaning for each.
   - Any **tone shifts by context** (onboarding / errors / success / marketing) they care about.
   - **Industry / audience** (B2B SaaS, consumer, healthcare, fintech, etc.) — this affects formality, claims, and compliance constraints.

Once you have the profile, restate it back in one or two lines so the user can confirm, then proceed. **Persist it** if possible (offer to save it to `brand-voice.md` in the project) so future runs skip this step.

> Fill the profile in this shape:
>
> | Trait | What it means | Watch out for |
> |---|---|---|
> | _Trait 1_ | _…_ | _anti-patterns_ |
> | _Trait 2_ | _…_ | _…_ |
>
> | Context | Tone | Key rule |
> |---|---|---|
> | Onboarding | _…_ | _…_ |
> | Errors | _…_ | _…_ |
> | Success | _…_ | _…_ |
> | Marketing | _…_ | _…_ |

## Process

### Step 1 — Read the copy

Ask the user to share the copy to review. If they paste multiple strings, treat each one separately.

### Step 2 — Diagnose against the profile

For each piece of copy, identify which of **the profile's** traits are violated, using the "Watch out for" column as the checklist. Common, mostly-universal failure modes to scan for (tune to the profile):

- **Hedging / low confidence**: `might`, `could`, `perhaps`, `possibly`, `consider`, `maybe`; passive constructions that dodge ownership.
- **Cold / robotic**: system-speak, error codes as messages, blaming the user.
- **Imprecise**: filler, redundancy, sentences that could be halved without losing meaning.

Also identify the **context** (error, CTA, onboarding, success, marketing, other) — this selects the tone row from the profile.

### Step 3 — Rewrite

Produce a rewrite, then show a side-by-side:

```
BEFORE  [original]
AFTER   [rewrite]
WHY     [one-line explanation — reference the trait/tone rule applied]
```

If multiple strings are submitted, use a numbered list.

### Step 4 — Flag edge cases

If a piece is already on-brand, say so briefly — don't invent changes. If the context is ambiguous, ask before rewriting. If a rewrite would conflict with an **industry constraint** in the profile (e.g. regulated claims in healthcare/fintech), flag it instead of guessing.

## Generally-good copy rules (apply unless the profile overrides)

1. **Lead with the benefit** — what the user gains, before how it works.
2. **Use active voice** — "We deleted your file" not "Your file was deleted".
3. **Cut the hedge** — remove `might`, `could`, `perhaps`, `possibly`, `consider`.
4. **Speak to one person** — "Export your data" not "Users can export data".
5. **Punctuate for clarity** — sparing `!`; em-dashes for asides; colons to introduce lists.

These are sensible defaults; a project's profile (e.g. a deliberately playful or highly formal brand) can override any of them.

## Output format

Always output:
1. A **verdict** per string — `✓ On-brand` or `✗ Needs revision`.
2. A **rewrite** for anything flagged (BEFORE / AFTER / WHY).
3. A **one-line summary** of how many strings were reviewed and how many were rewritten.

Keep explanations short. Writers want the rewrite, not a lecture.

---

## Example profile (sample — not the default)

A filled-in profile looks like this. **This is only an example** of the shape; load the real profile per Step 0.

> **"Acme Inc." — B2B SaaS.** Voice: **Confident**, **Warm**, **Precise**.
>
> | Trait | What it means | Watch out for |
> |---|---|---|
> | Confident | Speak with authority; own the statement. | "you might want to", "perhaps consider" |
> | Warm | Human; talk to capable adults, not error codes. | cold system-speak, passive blame |
> | Precise | Every word earns its place. | redundancy, vague language |
>
> Tone — Onboarding: encouraging & guiding · Errors: calm, never blame the user · Success: positive & brief · Marketing: bold, benefit-led, no superlatives.
>
> Do/Don't — Empty state: "No reports yet. Create your first to start tracking." not "There are currently no reports available in the system at this time." · CTA: "Start free trial" not "Click here to begin your free trial period". · Success: "Report published." not "Congratulations! Your report has been successfully published to the system!"
