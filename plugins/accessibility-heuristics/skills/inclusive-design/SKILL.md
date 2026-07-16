---
name: inclusive-design
description: Design accessibly and inclusively from the start — proactive guidance during design, not an after-the-fact audit. Covers designing for the range of human ability (vision, motor, hearing, cognitive, situational), inclusive patterns (touch targets, focus order, error recovery, plain language, reduced-motion, color-independent meaning), and how to bake WCAG in early. Complements accessibility-check (which audits a finished design). Trigger when the user asks how to "design for accessibility", "make this inclusive", "accessible design patterns", "design for screen readers / low vision / motor / cognitive", or wants a11y considered before build rather than after.
---

Build accessibility in from the first sketch rather than bolting it on before launch. `accessibility-check` audits a *finished* design against WCAG; this skill guides the *design decisions* that stop those issues existing — designing for the full range of human ability, permanent and situational. Getting it right early is far cheaper than retrofitting, and it makes the product better for everyone.

## Example prompts

- "How do I make this form accessible from the start?"
- "Inclusive-design considerations for this flow"
- "Design this for screen-reader and keyboard users"
- "What should I keep in mind for low-vision / motor / cognitive needs?"

---

## Step 0 — Context

Establish what's being designed (component / screen / flow), the platform (web, iOS, Android — conventions differ), and who might be excluded by the obvious/default approach. Design for a spectrum of ability, including **situational and temporary** limits (bright sun, one hand, noisy room, broken arm, low bandwidth), not just permanent disability.

---

## Design for the range of ability

Consider each dimension and the patterns that include it:

- **Vision** (blind, low-vision, color-blind) — don't rely on color alone (add text/icon/pattern); ensure strong contrast by design; support text resize/zoom and reflow; write meaningful labels and alt text; design a logical reading/DOM order and visible focus; make content screen-reader-friendly (headings, landmarks, names).
- **Motor** (limited dexterity, tremor, one-handed, switch/keyboard-only) — large, well-spaced targets (aim 44px); full keyboard operability with a sensible focus order; avoid drag-only, hover-only, or precise-timing interactions; forgiving hit areas and undo.
- **Hearing** (deaf, hard of hearing) — captions/transcripts for audio & video; never convey information by sound alone; visual equivalents for audio cues.
- **Cognitive** (memory, attention, literacy, processing, dyslexia, ADHD, autism) — plain language, short chunks, one primary action per screen; consistency and predictability; recognition over recall; clear error prevention and recovery; avoid unnecessary time limits; reduce distraction and cognitive load.
- **Vestibular / motion sensitivity** — respect reduced-motion preferences; avoid large parallax/auto-play/animation as the only signal.
- **Situational & low-bandwidth** — designs that hold up one-handed, in glare, on slow connections, in a second language.

## Bake WCAG in early

Fold the common success criteria into design decisions rather than leaving them for audit: color contrast & non-color cues, focus visibility & order, target size, labels/names, error identification + suggestions, no keyboard traps, and content structure. Then hand the finished design to `accessibility-check` to verify.

---

## Output format

Deliver design guidance tied to the specific thing being designed:
1. **Inclusive approach** — the key decisions to make now (per relevant ability dimension), specific to this component/flow.
2. **Patterns to use / avoid** — concrete do/don't for the interactions involved.
3. **States & content** — accessible names, error recovery, plain-language copy (hand wording to `content-design`), reduced-motion behavior.
4. **Verify later** — note that `accessibility-check` should audit the built result against WCAG.

---

## Guardrails

- **Proactive, not a substitute for testing.** Designing inclusively reduces issues; it doesn't replace an `accessibility-check` audit or testing with disabled users and assistive tech.
- **Real range of ability.** Cover vision, motor, hearing, cognitive, vestibular, and situational — not just screen readers.
- **Inclusion helps everyone.** Frame choices as better-for-all (curb-cut effect), not niche accommodation.
- **Don't over-claim.** Inclusive intent ≠ compliance; verification and lived-experience testing still decide.
