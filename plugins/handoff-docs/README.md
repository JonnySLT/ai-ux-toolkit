# handoff-docs

- **component-spec** — draft a developer-ready spec for a single component from a Figma component, code, or a description: anatomy, variants, states, props/API, token usage, accessibility notes, and usage do/don't.
- **design-system-docs** — generate design-system documentation from a project's *existing* patterns: a component inventory, per-component usage guidelines, a token reference, and a list of inconsistencies to reconcile.
- **annotate** — place annotation cards beside a Figma screen, each pointing at a high-level component with specs, tokens, icons, and dev-handoff notes, using the file's own `Annotation` component (32px from the frame). **Requires the Figma MCP.**

**Project-agnostic:** each reads the project's own system as the source of truth — variants, tokens, and props are discovered at runtime, never assumed. `annotate` documents *on the Figma canvas*; the others produce written docs from Figma, code, or a description.

Reading from Figma needs the Figma MCP server; reading from code needs the repo. Triggers from natural language ("write a spec for this component", "document our design system", "generate component docs").

Install: `/plugin install handoff-docs@ai-ux-toolkit`
