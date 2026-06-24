# figma-design-system

Figma + design-system workflow skills. **Requires the Figma MCP server (`use_figma`).**

- **figma-designer** — senior product-designer knowledge for accessible, consistent, polished UI in Figma.
- **reattach** — reconnect a raw/detached frame to the design system (variables, text styles, component instances), all discovered at runtime.
- **annotate** — place annotation cards beside a screen with specs, tokens, icons, and dev-handoff notes.

**Project-agnostic:** every skill reads the **current file's own** design system — components, variables, and styles — and never imports from another Figma file. `annotate` uses the file's own `Annotation` component (and offers to build one bound to that project's tokens if missing); cards always sit 32px from the frame.

Install: `/plugin install figma-design-system@design-system-toolkit`
