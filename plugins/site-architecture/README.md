# site-architecture

Map a site's structure in Figma — from **capturing what exists today** to **designing the new architecture** — styled with the current file's own design system. **Requires the Figma MCP server (`use_figma`).**

- **site-audit** — map an existing website's structure into a tabbed Figma document (Overview · Site Architecture · Page Inventory) styled from the file's own tokens, classifying every page by a fixed template-type/function vocabulary; current-state only, with an optional visual Site Map diagram.
- **conceptual-architecture** — render a layered, forward-looking map of a new or redesigned product as two frames: the **Conceptual Architecture** (entry points, core domains, audience on-ramps, shared systems, the chain that connects them, and the foundations underneath) and the **Navigation Model** it produces (global nav at desktop *and* mobile, what sits under each item, and the decisions that need a stakeholder to sign off) — natively in the file's own design system, text-only. Works from a brief, from research, from screens already in the file, or from a live site used as a redesign starting point.

**The pair, in order:** run `site-audit` to record the current site, then `conceptual-architecture` to propose the redesigned structure. Both are current-file-driven — each reads the design system of whatever file you run it in and never imports from another.

Install: `/plugin install site-architecture@ai-ux-toolkit`
