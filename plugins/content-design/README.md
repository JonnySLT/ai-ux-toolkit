# content-design

- **content-design** — write functional UI microcopy systematically: error messages, empty states, buttons/CTAs, form labels and helper text, confirmations, notifications, and onboarding. Clear, concise, useful; consistent patterns across the product.
- **states-and-edge-cases** — enumerate every state and edge case a screen or flow must handle (empty, loading, partial, error, offline, permission, first-run, max/overflow, zero-results…) so they're designed on purpose, not discovered in production.

**Project-agnostic.** `content-design` writes the copy and works alongside `brand-voice` (which enforces *voice and tone* — content-design decides *what to say and its structure*; brand-voice makes it sound like you). `states-and-edge-cases` pairs with `component-spec` (states per component) and `rapid-prototyping`.

No external services required. Triggers from natural language ("write the error messages", "what should this empty state say?", "what states does this screen need?", "enumerate the edge cases").

Install: `/plugin install content-design@ai-ux-toolkit`
