# brand-voice

- **brand-voice-tone** — review and rewrite UI copy (CTAs, errors, onboarding, notifications, marketing) to match a brand's voice.

**Project-agnostic:** the voice itself isn't baked in. At the start of a run the skill loads a **voice profile** from the project (a `brand-voice.md` / brand guide, a `brand-voice:*` plugin, or a quick interview), then applies it. Works for any brand or industry; the Acme profile in the skill is only a labeled example of the shape to fill in.

No external services required. Triggers from natural language ("is this on-brand?", "rewrite this in our voice").

Install: `/plugin install brand-voice@ai-ux-toolkit`
