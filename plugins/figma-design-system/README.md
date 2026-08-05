# figma-design-system

Figma + design-system workflow skills. **Requires the Figma MCP server (`use_figma`).**

- **figma-designer** — senior product-designer knowledge for accessible, consistent, polished UI in Figma.
- **reattach** — reconnect a raw/detached frame to the design system (variables, text styles, component instances), all discovered at runtime.
- **harvest-components** — audit a finished design and decide what *should* be a component: map bespoke frames to existing components, nominate recurring ones as new components, leave genuine one-offs, then swap and verify. The editorial layer above `reattach`.

**Project-agnostic:** every skill reads the **current file's own** design system — components, variables, and styles — and never imports from another Figma file.

Install: `/plugin install figma-design-system@ai-ux-toolkit`
