# conceptual-architecture

- **conceptual-architecture** — create a high-level conceptual architecture: an annotated sitemap of a product's top-level areas, the key pages in each with a one-line purpose, and any global / cross-cutting features. Renders natively into a Figma file using that file's own design system — color variables and text styles (text-only; it uses no icons). Works from a description or brief, from the screens already designed in the file, or from a live site URL.

**Requires the Figma MCP server (`use_figma`)** and a target file with a design system (embedded, or a linked/enabled library). If the file has no design system, the skill offers clean neutral defaults.

**Distinct from `information-architecture`.** That skill defines the *detailed* structural layer — navigation, content hierarchy, URL patterns, and user flows. This one is the *high-level visual map* you show early to align on scope; it can be built from an IA or stand alone.

**Project-agnostic:** the map is styled with whatever design system the target file uses — never an unrelated one — so it reads as part of the same system. The descriptions are documentation, so they follow the toolkit's house document voice, not a product's brand voice.

Install: `/plugin install conceptual-architecture@ai-ux-toolkit`
