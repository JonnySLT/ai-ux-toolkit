# handoff-docs

- **component-spec** — draft a developer-ready spec for a single component from a Figma component, code, or a description: anatomy, variants, states, props/API, token usage, accessibility notes, and usage do/don't.
- **design-system-docs** — generate design-system documentation from a project's *existing* patterns: a component inventory, per-component usage guidelines, a token reference, and a list of inconsistencies to reconcile.

**Project-agnostic:** both read the project's own system as the source of truth — variants, tokens, and props are discovered at runtime, never assumed. Pairs with the `figma-design-system` plugin's `annotate` skill for on-canvas handoff.

Reading from Figma needs the Figma MCP server; reading from code needs the repo. Triggers from natural language ("write a spec for this component", "document our design system", "generate component docs").

Install: `/plugin install handoff-docs@ai-ux-toolkit`
