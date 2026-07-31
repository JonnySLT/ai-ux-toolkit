---
name: conceptual-architecture
description: Create a conceptual architecture — a high-level, annotated sitemap of a product's top-level sections (areas), the key pages/screens in each, and a one-line purpose for every page, plus any global or cross-cutting features (persistent overlays, assistants, sitewide search). Renders natively into a Figma file using that file's own design system — its color variables, text styles, and icon components. Works from a description or brief you give it, from the screens already designed in the Figma file, or from a live site URL. Trigger when the user wants a "conceptual architecture", a "sitemap" or "site map", a "high-level structure / architecture", to "map the sections and pages", or to visualize a product's structure in Figma. For the detailed structural layer — navigation, content hierarchy, URL patterns, and user flows — use the information-architecture skill instead; this one is the high-level visual map that renders in Figma.
---

Create a **conceptual architecture**: a one-glance, annotated sitemap that shows a product's top-level **areas**, the **key pages** in each, a **short purpose line** for every page, and any **global / cross-cutting features** that live on every screen. It's the map you show early to align on scope and structure — broader and more visual than a full IA. This skill renders it **natively into a Figma file, styled with that file's own design system**.

It is distinct from `information-architecture` (the detailed structural layer — nav, hierarchy, URL patterns, user flows). Conceptual architecture is the high-level visual; it can be built *from* an IA, or stand alone. If a request is really about detailed IA, hand off to that skill.

> **Style everything with the target file's own design system — never an unrelated one.** Resolve text styles, color variables, and icon components from **this project's DS**: first the current file, then the design-system **library the file has linked/enabled**. Match the file's look (brand color, type ramp, icon set) so the map reads as part of the same system. If the file has **no** design system, say so and offer to render with clean neutral defaults.

## Before you start

- **Always load the `figma:figma-use` skill before any `use_figma` call.**
- **Know the target file.** You need a Figma file to render into (extract `fileKey` from the URL the user shares, or ask which file / page). The map is created on a new page or an empty area of the canvas — never on top of existing work.
- **This skill supports three inputs** — pick based on what the user gives you (and you can combine them):
  1. **A description or brief** — the user describes the product, audience, and goals (or pastes a rough section list). You *propose* the architecture. Interview briefly only for genuine gaps (see Step 1).
  2. **Screens already in the Figma file** — read the frames/pages that exist and organize them into areas. Good for documenting a design that's underway.
  3. **A live site URL** — browse the site (needs a browser the environment can drive), infer its sections and key pages, and map them. Good for auditing or re-architecting an existing product.

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
- **Pick a fitting icon per area** from the file's own icon set (see Step 3) — e.g. a house for a home/discovery area, a cart for checkout, a person for account.

### Step 3 — Discover the design system

Resolve from the target file (local first, then its linked/enabled DS library) — discover dynamically, never hardcode IDs:

- **Text styles** — a display/title style (for the header), a section-name style, a page-name style (semibold), a description/body style, and a small muted style (for counts and the subtitle). Map to the closest styles the file actually has.
- **Color variables** — the **brand/primary** color (area headers + the global-feature accent), an on-brand text color (for text on the header fill), the default ink/body color (page names), a muted color (descriptions, counts), a subtle surface/border, and a light brand **tint** for the global-feature band. Bind fills to the file's variables rather than hardcoding hex.
- **Icon components** — the file's icon set (local components or a linked icon library). Instance a fitting icon per area and for each global-feature band. If there's no icon set, omit icons rather than inventing shapes.

If the file has neither styles nor variables, tell the user and offer clean neutral defaults (a single accent, Inter type ramp).

### Step 4 — Render it in Figma

Build with **auto-layout** so it stays tidy, and bind fills/text to the DS tokens from Step 3. Target this anatomy (measurements are sensible defaults from the reference layout — adapt to the file's type scale):

- **Root frame** `Conceptual Architecture` — vertical auto-layout, ~48px padding, ~32px item spacing, surface/background fill.
  - **Header** (vertical, ~8px spacing):
    - **Title** — "Conceptual Architecture" in the display/title style.
    - **Subtitle row** (horizontal, muted style) — `Product name` · `N screens across M areas` · `Feature (global)` for each global feature, joined by " · " separators.
  - **Global-feature band** — one per global feature. Horizontal auto-layout, ~16px padding, rounded (~12px), filled with the brand **tint** and a brand stroke. Contains: a small rounded **icon chip** (brand fill, an icon or glyph) · a **label pill** (brand-soft fill, brand text, the feature name) · an em-dash · the **description** (fills remaining width).
  - **Area columns** — a horizontal auto-layout row (~12px gap), each area a fixed-width column (~214–260px):
    - **Area header** — rounded block filled with the **brand** color: a name row (icon instance + area name in the on-brand text color, semibold) and a "`N screens`" line in a lighter on-brand tone.
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
- **Look like the system.** Brand color on the headers, the file's type styles, the file's icons — the map should feel designed in the same DS as the product.

## Guardrails

- **Never render on top of existing work.** Use a fresh page or a clearly empty area of the canvas.
- **Use the file's own design system — never an unrelated file's.** A linked library that *is* this project's DS is correct; another project's file is not.
- **Don't invent screens to look thorough.** Map what the input supports; where structure is genuinely uncertain, mark it as proposed and ask.
- **Stay high-level.** This is the map, not the IA. Resist adding URL patterns, flow arrows, or every leaf page — hand detailed structure to `information-architecture`.
- **Descriptions are documentation, not UI copy** — they follow the SLT document voice, not a product's brand voice.
