---
name: conceptual-architecture
description: Create a conceptual architecture — a high-level, annotated sitemap of a product's top-level sections (areas), the key pages/screens in each, and a one-line purpose for every page, plus any global or cross-cutting features (persistent overlays, assistants, sitewide search). This is for defining a NEW or REDESIGNED architecture — the forward-looking target structure, not a record of what exists today. Renders natively into a Figma file using that file's own design system — its color variables and text styles (text-only; it uses no icons). Works from a description or brief you give it, from the screens already designed in the Figma file, or from a live site URL used only as a starting point for a redesign. Trigger when the user wants a "conceptual architecture", a "sitemap" or "site map" for a new or redesigned product, a "high-level structure / architecture", to "map the sections and pages" of something being designed, or to visualize a proposed product structure in Figma. To map an EXISTING site as it is today (a current-state audit / page inventory), use the site-audit skill first — then bring its findings here to design the redesign. For the detailed structural layer — navigation, content hierarchy, URL patterns, and user flows — use the information-architecture skill instead; this one is the high-level visual map that renders in Figma.
---

Create a **conceptual architecture**: a one-glance, annotated sitemap that shows a product's top-level **areas**, the **key pages** in each, a **short purpose line** for every page, and any **global / cross-cutting features** that live on every screen. It's the map you show early to align on scope and structure — broader and more visual than a full IA. This skill renders it **natively into a Figma file, styled with that file's own design system**.

It is **forward-looking** — the map of the product you're *going to build*, whether brand-new or a redesign. To document a live site **as it exists today** (a current-state audit, page inventory, IA tree of the real site), use **`site-audit`** instead; a common flow is `site-audit` the existing site → then use *this* skill to propose the redesigned architecture. It is also distinct from `information-architecture` (the detailed structural layer — nav, hierarchy, URL patterns, user flows). Conceptual architecture is the high-level visual; it can be built *from* an IA or an audit, or stand alone. If a request is really about detailed IA, hand off to that skill.

> **Style everything with the design system and libraries the file ALREADY uses — never import from anywhere else.** Resolve every text style, color/spacing variable, paint style, and component from the current file or the libraries it *already has enabled* — matching its brand color and type ramp so the map reads as part of the same system. (This map is **text-only — it uses no icons at all.**) **Do not pull assets from any other library or file**, even one that a cross-library asset search surfaces (that search returns unrelated design systems from across the account). If something fitting isn't in the file's own system, **omit it or ask** — never substitute a foreign one. If the file has **no** design system at all, say so and offer clean neutral defaults.

## Before you start

- **Always load the `figma:figma-use` skill before any `use_figma` call.**
- **Know the target file.** You need a Figma file to render into (extract `fileKey` from the URL the user shares, or ask which file / page). The map is created on a new page or an empty area of the canvas — never on top of existing work.
- **This skill supports three inputs** — pick based on what the user gives you (and you can combine them):
  1. **A description or brief** — the user describes the product, audience, and goals (or pastes a rough section list). You *propose* the architecture. Interview briefly only for genuine gaps (see Step 1).
  2. **Screens already in the Figma file** — read the frames/pages that exist and organize them into areas. Good for documenting a design that's underway.
  3. **A live site URL, as a redesign starting point** — browse the site (needs a browser the environment can drive), infer its sections and key pages, and use them as raw material for the *new* architecture you propose. This is not a current-state audit: to capture the existing site faithfully (as-is inventory + IA tree), run **`site-audit`** and bring its output here. Use this input when re-architecting.

## Process

### Step 1 — Gather the raw material

**From a description/brief.** Establish, inferring from the prompt and asking only for real gaps (one short batch): the **product** and what it's for, the **primary audience(s)**, the **core jobs/journeys** it must support, and any **known constraints** (roles, plans, integrations). Don't over-interview — propose a first pass and let the user react.

**From existing Figma frames.** Inspect the file's pages and top-level frames. Treat each meaningful screen as a candidate page; read frame names and obvious content to infer purpose. Ignore components, variants, and scratch frames.

**From a live URL.** Browse the site; capture the primary navigation, footer, and section landing pages. Follow one level deep into each section to find its key pages. Note anything persistent across pages (search, chat, account menu) — those are candidates for global features.

### Step 2 — Structure and write it

- **Group into 4–8 top-level areas.** Areas are how a user would mentally divide the product ("Discovery & Shopping", "Cart & Checkout", "Account", "Order Management"), not a flat page dump. If you have more than ~8, you're probably too granular — merge.
- **Pick the key pages per area — not every screen.** Include the pages that define the area and that a stakeholder needs to see; leave out trivial states and one-off utilities. Aim for ~4–8 per area.
- **Write a one-line purpose for each page** — what it's *for*, in a few words ("Faceted search, filters, sortable grid/list"; "PO number, payment terms, net account"). Terse, specific, scannable. Follow the **SLT house document voice**: concrete over vague, no filler, consistent terms. These are document annotations, not in-product UI copy.
- **Identify global / cross-cutting features** — anything present on *every* page (a persistent AI assistant, sitewide search, a support chat overlay). Each gets a one-line description and is shown once, up top — not repeated in every area.
- **Compute the summary counts** — total key pages ("screens") and number of areas, for the header line.

### Step 3 — Discover the design system

Resolve from the target file (local first, then its linked/enabled DS library) — discover dynamically, never hardcode IDs:

- **Text styles** — a display/title style (for the header), a section-name style, a page-name style (semibold), a description/body style, and a small muted style (for counts and the subtitle). Map to the closest styles the file actually has.
- **Color variables** — the **brand/primary** color (area headers + the global-feature accent), an on-brand text color (for text on the header fill), the default ink/body color (page names), a muted color (descriptions, counts), a subtle surface/border, and a light brand **tint** for the global-feature band. Bind fills to the file's variables rather than hardcoding hex.
**No icons.** This map is text-only — area headers and the global band carry no icons. Don't resolve, place, or import any icon (not from the file, not from any library).

If the file has neither styles nor variables, tell the user and offer clean neutral defaults (a single accent, Inter type ramp).

### Step 4 — Render it in Figma

Build with **auto-layout** so it stays tidy, and bind fills/text to the DS tokens from Step 3. Target this anatomy (measurements are sensible defaults from the reference layout — adapt to the file's type scale):

- **Root frame** `Conceptual Architecture` — vertical auto-layout, ~48px padding, ~32px item spacing, surface/background fill.
  - **Header** (vertical, ~8px spacing):
    - **Title** — "Conceptual Architecture" in the display/title style.
    - **Subtitle row** (horizontal, muted style) — `Product name` · `N screens across M areas` · `Feature (global)` for each global feature, joined by " · " separators.
  - **Global-feature band** — one per global feature. Horizontal auto-layout, ~16px padding, rounded (~12px), filled with the brand **tint** and a brand stroke. Contains: a **label pill** (brand fill, on-brand text, the feature name) · an em-dash · the **description** (fills remaining width). No icon.
  - **Area columns** — a horizontal auto-layout row (~12px gap), each area a fixed-width column (~214–260px):
    - **Area header** — rounded block filled with the **brand** color: the area name (on-brand text color, semibold) and a "`N screens`" line in a lighter on-brand tone. No icon.
    - **Screen list** — vertical stack of page items. Each item (~16px padding): the **page name** (page-name style, ink) then its **purpose** (description style, muted). Keep items evenly sized; let one- vs two-line purposes size naturally.

Order areas by the product's flow (discovery → transaction → management → support), left to right. If there are more areas than fit one row comfortably, widen the frame or wrap to a second row — keep columns aligned.

**Fonts:** load every font used by the resolved text styles before setting text.

### Step 5 — Verify

Screenshot the finished frame. Check: columns align and don't overlap, no text is clipped, the header counts match the actual pages/areas, the global band(s) read clearly, and colors/type resolve to the file's DS (not stray defaults). Fix issues before finishing, then share the screenshot.

### Step 6 — Log to the changelog (if the project keeps one)

If the file has a Changelog page and the project documents changes (e.g. conventions in its `CLAUDE.md`), add an entry following **that project's** rules, tagged as documentation, noting the product mapped and the areas covered. Discover the changelog container dynamically; never hardcode a node ID. If there's no changelog convention, skip this.

## Content guidance

- **Areas are a mental model, not a menu dump.** Group by how users think about the product.
- **Key pages, not every screen.** A conceptual architecture earns its value by being scannable — include what matters, cut the rest, and let the counts convey total scope.
- **Purposes do work.** Each line should tell a stakeholder why the page exists in a few concrete words — never "The page for X" filler.
- **Global features are shown once.** If it's on every screen, it belongs in the top band, not in each column.
- **Look like the system.** Brand color on the headers and the file's type styles — the map should feel designed in the same DS as the product. (No icons — it's a text-only map.)

## Guardrails

- **Never render on top of existing work.** Use a fresh page or a clearly empty area of the canvas.
- **No icons.** The map is text-only — area headers and the global band never carry an icon. Don't add, place, or import one.
- **Only ever reference the design system and libraries the file already uses.** Resolve every style, variable, and component from the file itself or the libraries it *already has enabled* — never import from another library or file, even one a cross-library search returns. A linked library the file already uses is correct; anything the file doesn't already use is off-limits. If something fitting isn't in the file's own system, omit it or ask.
- **Don't invent screens to look thorough.** Map what the input supports; where structure is genuinely uncertain, mark it as proposed and ask.
- **Stay high-level.** This is the map, not the IA. Resist adding URL patterns, flow arrows, or every leaf page — hand detailed structure to `information-architecture`.
- **Descriptions are documentation, not UI copy** — they follow the SLT document voice, not a product's brand voice.
