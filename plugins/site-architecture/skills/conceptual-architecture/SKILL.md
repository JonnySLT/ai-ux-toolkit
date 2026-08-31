---
name: conceptual-architecture
description: Create a conceptual architecture — a layered, annotated map of a product's structure, rendered as two Figma frames. Frame 1 (Conceptual Architecture) shows entry points, core domains, audience on-ramps, shared systems, the chain connecting them, and the foundations underneath. Frame 2 (Navigation Model) shows the global nav that falls out of it — desktop AND mobile — what sits under each item, and the judgment calls needing a decision. For defining a NEW or REDESIGNED architecture, not a record of what exists today. Renders natively into a Figma file using that file's own variables and text styles (text-only, no icons). Works from a brief, research, screens already in the file, or a live site URL. Trigger on "conceptual architecture", "navigation model", a "sitemap" for a new or redesigned product, or visualizing a proposed structure in Figma. To map an EXISTING site as it is today, use site-audit; for URL patterns and user flows, use information-architecture.
---

Create a **conceptual architecture**: a layered map of how a product is organized around what its people need. It names the parts of the product and how they relate, so page-level structure has something to be derived from. It sits between a strategy and a sitemap.

The deliverable is **two frames**, built side by side in the same Figma file:

1. **Conceptual Architecture** — the layers: entry points → core domains → audience on-ramps → shared systems → the chain that connects them → the foundations underneath.
2. **Navigation Model** — the global nav that falls out of those layers, shown at **desktop and mobile**, what sits under each item, and the decisions that need a human to sign off.

Build both. The architecture without the nav model is an argument nobody can act on; the nav model without the architecture is a menu with no reasoning behind it.

It is **forward-looking** — the map of the product you're *going to build*, brand-new or a redesign. To document a live site **as it exists today** (current-state audit, page inventory, IA tree), use **`site-audit`** instead; a common flow is `site-audit` the existing site → then use *this* skill to propose the redesigned architecture. It is also distinct from `information-architecture` (URL patterns, content hierarchy, user flows). If a request is really about detailed IA, hand off to that skill.

> **Style everything with the design system and libraries the file ALREADY uses — never import from anywhere else.** Resolve every text style, color/spacing variable, and paint style from the current file or the libraries it *already has enabled*, so the map reads as part of the same system. **The token and style names throughout this document are illustrative** (`brand/primary`, `background/surface`, `content/secondary`, `Heading/H4`, …) — resolve the equivalents that actually exist in the file, by role, and bind to those. This map is **text-only — it uses no icons at all.** Do not pull assets from any other library or file, even one a cross-library search surfaces. If something fitting isn't in the file's own system, omit it or ask. If the file has **no** design system, say so and offer clean neutral defaults.

## Example prompts

- "Build a conceptual architecture for the redesign"
- "Map the structure of the new product in Figma"
- "What should the navigation model be?"
- "Turn this strategy into an architecture we can review with the client"
- "Show me the nav at desktop and mobile"

---

## Before you start

- **Always load the `figma:figma-use` skill before any `use_figma` call.**
- **Know the target file.** Extract `fileKey` from the URL the user shares, or ask. Build on a new page or a clearly empty area of the canvas — never on top of existing work.
- **Three inputs, combinable:**
  1. **A description, brief, or research.** You propose the architecture. Interview only for real gaps. If user research exists, it outranks your own reasoning — see Step 2.
  2. **Screens already in the Figma file.** Read the frames and organize them into domains. Ignore components, variants, and scratch frames.
  3. **A live site URL.** Browse it as raw material for the *new* architecture. This is not a current-state audit — for that, run `site-audit` and bring its output here.

## Process

### Step 1 — Gather the raw material

Establish the **product** and what it's for, the **primary audiences**, the **core jobs** it must support, and any **known constraints** (roles, plans, platforms, integrations). Infer from the prompt; ask only for genuine gaps, in one short batch. Propose a first pass and let the user react.

**If research is available, read it first and let it lead.** Findings about how people actually arrive, choose, and return should shape the layers — not be decorated onto a structure you already picked. Quote the evidence in the map itself (see Step 4); a stakeholder reading "not one participant found the store" understands the reorganization instantly.

### Step 2 — Structure it

- **Entry points (Layer 1).** Where someone arrives, and what each must answer before it asks for anything. Include the non-obvious ones — an invitation, a campaign link, a location-led entry — not just the homepage. Aim for 3–5.
- **Core domains (Layer 2).** The 3–5 ways to be part of the product. Each domain answers the same three questions in order: what is this, why does it matter, what do I do next. Give each a one-line promise and 4–7 sub-items. **Merge domains the evidence says are one decision** — if people choose between two paths in the same moment, they belong in one domain, not two.
- **Audience on-ramps (Layer 3).** Landing pages for groups arriving with a shared reason. They inherit domain content rather than duplicating it, and they don't take a top-level nav slot. Render as chips, not cards — they own no content of their own.
- **Shared systems (Layer 4).** Things built once and surfaced inside every domain — the connective tissue that makes separate transactions feel like one relationship. Each names **where it surfaces**. These are systems, not menu items. Aim for 3–5.
- **The chain.** One object or sequence that runs through every domain. This is the argument for why the layers exist and is usually the thing to lead a review with. If the evidence shows people re-enter at the start, say so and call it a **loop** — that's a stronger finding than a chain.
- **Foundations.** The non-negotiables every layer depends on. Chips. 5–7.
- **Then derive the nav** (Step 5) — the nav model must fall out of the architecture, never be designed first.

Tag domains and shared systems with the **strategy goal or theme** each serves, if the project has numbered goals. It's how a stakeholder checks coverage at a glance.

### Step 3 — Discover the design system

Resolve from the target file (local first, then its linked/enabled libraries) — discover dynamically, never hardcode IDs:

- **Text styles** — a display/title style, a section eyebrow (overline/caption), a card-title style, a sub-title style, a body style, and a small muted style.
- **Color variables** — brand/primary, an on-brand text color, a light brand tint, page canvas, card surface, a subtle surface, subtle and default borders, default ink, and a secondary text color.
- **Spacing / radius variables** — page margin, section gap, card padding, grid gap, and small/medium steps; a large radius for cards and a pill radius for chips. If the file has responsive spacing modes, set the frame's mode explicitly (usually Desktop).

**A card whose fill matches the page canvas is invisible.** In many systems the surface and canvas tokens are both near-white — if they resolve close, give those cards the file's subtle border so they still read as cards. Check this by looking at the render, not the token names.

**Never use a "muted" color for body text without checking its contrast** — in many systems that token is disabled-state only and fails WCAG AA. Default to the secondary text color.

### Step 4 — Render Frame 1: Conceptual Architecture

Auto-layout throughout; bind every fill, stroke, padding, gap, and radius to a variable. Measurements below are sensible defaults from the reference layout — adapt to the file's own scale.

- **Root frame** `Conceptual Architecture — <Product>` — vertical, ~1440 wide, page-margin horizontal padding (~120), section-y vertical padding (~64), section-gap item spacing (~48), page-canvas fill. Content column lands at ~1200.
- **Header** (vertical, ~12 gap): eyebrow (Overline, secondary) · title (Display) · intro paragraph **constrained to ~900 wide** · a meta line (Caption) naming the author, date, and what it was derived from.
- **Every layer section** (vertical, ~16 gap): eyebrow in caps · a ~900-wide intro sentence explaining what the layer is for · a row.
- **Layer 1 · Entry points** — row of equal-height cards (~24 gap). Card: card-padding, ~8 gap, surface fill, subtle 1px stroke, large radius. Title (Heading/H4, ink) + purpose line (Body/Small, secondary).
- **Layer 2 · Core domains** — row of cards (~24 gap), each clipping its content so the header corners stay rounded. Card = surface fill, subtle stroke, large radius, **zero item spacing**, split into two children:
  - **Header** — card-padding, ~4 gap, **brand fill**; title (Heading/H3, on-brand) + promise line (Body/Small, on-brand).
  - **Body** — card-padding, ~12 gap; a newline-separated sub-item list (`· item` per line, Body/Small, secondary) then — only if the project uses numbered goals or named themes — a **Tags** row of chips (chip = ~4/12 padding, subtle fill, pill radius, Caption). Omit the row entirely when there is nothing to tag; never invent goal numbers to fill it.
- **Layer 3 · Audience on-ramps** — a **wrapping** row (~8 gap) of pill chips: ~8/16 padding, subtle fill, subtle stroke, pill radius, Label/Base in ink.
- **Layer 4 · Shared systems** — row of equal-height cards (~24 gap): card-padding, ~12 gap, **brand-tint fill**, default stroke, large radius. Title (Heading/H4, ink) · description (Body/Small, secondary) · a **Spacer** frame that grows · a footer line (Caption, secondary) reading `Appears in: A · B · C`, with ` —   Goal N` appended only where the project has goals to cite.
- **The chain** — eyebrow, ~900-wide intro, then a horizontal row (~12 gap, centered) alternating **link cards** and a `→` text node (Heading/H4, secondary). Link card: card-padding, ~8 gap, surface fill, default stroke, large radius; title (Label/Large, ink) + sub-line (Caption, secondary). Close with a ~900-wide line stating what breaks if the chain breaks.
- **Foundations** — eyebrow, ~900-wide intro, wrapping row of pill chips, same as Layer 3.

### Step 5 — Render Frame 2: Navigation Model

A second root frame below or beside the first, same width, padding, and fill.

- **Header** — eyebrow (`DERIVED FROM THE ARCHITECTURE`), title, ~900-wide intro stating what the architecture asks the nav to do.
- **Global nav — desktop** — a horizontal bar: ~12/24 padding, ~24 gap, surface fill, subtle stroke, large radius. Wordmark (Label/Large, ink) · a **Primary items** row that grows to fill (~24 gap) · a **Utility** row (~16 gap). Every nav item is a frame with ~12/8 padding so it stands **44px tall** — state that target explicitly, it is an accessibility requirement, not a style choice. The primary call to action is a filled pill (accent fill, pill radius, ~12/16 padding).
- **Global nav — mobile** — a row (~24 gap, top-aligned, **filling the content column**) holding **one 390-wide example — the open drawer** — captioned underneath (Caption, secondary), with the breakpoint note **beside it**, filling the remaining width.
  - **The drawer** — a vertical surface card, large radius, subtle stroke: a top bar (wordmark · a growing spacer · a `✕` glyph in a 44px hit area), a divider, one full-width row per primary item (Label/Base, ink, ~12/16 padding, **44px tall**), another divider, then the utility items and a full-width call to action.
  - **Don't draw the collapsed bar.** It is the desktop bar minus its items — it teaches nothing the open state doesn't, and it costs a column of width. The open drawer is where the architecture is visible.
  - **The breakpoint note is the deliverable, not the picture.** Name what collapses into the drawer, what stays permanently visible, and where sign-in goes. A drawer without that sentence proves nothing.
  - Any glyph (`≡`, `✕`) takes a **heading-scale style** — at label scale it reads as punctuation, not a control.
- **What sits under each item** — eyebrow, then a row (~24 gap) of equal-height columns, one per primary nav item: card-padding, ~12 gap, surface fill, **subtle stroke** (without it these read as bare text columns on a near-white canvas), large radius; item name (Label/Large, ink) + a newline-separated list of what it contains (Body/Small, secondary).
- **Decisions to review** — a panel: card-padding, ~16 gap, subtle fill, default stroke, large radius. Title (Heading/H4, ink), then a **Points** stack (~16 gap). Each point is a vertical frame (~8 gap): the **claim** in one sentence (Label/Base, ink) and the **rationale and trade-off** underneath (Body/Small, secondary). Cover every judgment call you made that a stakeholder could reasonably reverse — this panel is what turns the review into a decision meeting instead of a reaction.

### Step 6 — Verify

Screenshot both frames and check, in this order:

1. **Nothing is clipped.** Audit it — for every clipping frame, compare the summed heights of its children (plus gaps and padding) against its own height. **Clipped text is invisible to a token audit**, so a clean variables sweep proves nothing about whether the document is readable.
2. Columns align, cards in a row are equal height, and no text overlaps.
3. Header counts and any goal or theme tags match what's actually rendered.
4. Every fill, stroke, padding, gap, radius, and text node binds to a variable or style of this file — nothing raw, nothing foreign.
5. Contrast: measure every text-on-fill pairing used, including on-brand text on the domain headers.
6. Nav items measure 44px.

Fix everything before finishing, then share the screenshots.

### Step 7 — Log to the changelog (if the project keeps one)

If the file has a Changelog page and the project documents changes (e.g. conventions in its `CLAUDE.md`), add an entry following **that project's** rules, tagged as documentation. Discover the changelog container dynamically; never hardcode a node ID. If there's no changelog convention, skip this.

## Content guidance

- **Layers are an argument, not a taxonomy.** Each layer earns its place by explaining something the layer above can't.
- **Domains are a mental model, not a menu dump.** If two "domains" are chosen in the same moment on the same axis, they're one domain.
- **Purpose lines do work.** A few concrete words on why the thing exists — never "the page for X" filler.
- **Shared systems are shown once**, with where they surface. If it's in every domain, it isn't a domain.
- **A journey stage must produce pages.** If a finding describes something that happens *over time* — a return, a follow-up, an escalation into deeper involvement — check that it earns a **domain**, not just a shared system or a step in the chain. A system with no pages behind it, and a chain step with nothing to click, both vanish the moment this becomes a sitemap. Consolidating to hit "3–5 domains" is how the post-act journey gets quietly deleted.
- **One treatment per element type.** Every goal or theme tag is the same pill everywhere it appears — same fill, stroke, radius, padding, and text style. Don't render a tag as a chip in one layer and as trailing text in another; check by comparing the built nodes, not by eye.
- **Quote the evidence.** A finding in the supporting text — a participant's words, a measured failure — is worth more than an assertion, and it survives the meeting.
- **Descriptions are documentation, not UI copy.** They follow the house document voice, not the product's brand voice. Respect the project's trademark and claims rules — those apply to every word you render.

## Guardrails

- **Never render on top of existing work.** Fresh page or clearly empty canvas.
- **No icons.** Text-only, including in the nav examples — use text characters (`→`, `≡`, `✕`) where a glyph is needed, always at a heading-scale style so they read as controls rather than punctuation.
- **Only the design system the file already uses.** Never import from another library or file.
- **Don't invent screens or findings to look thorough.** Where structure is genuinely uncertain, mark it as proposed and put it in the Decisions panel.
- **Stay high-level.** No URL patterns, no flow arrows between pages, no every-leaf-page. Hand detailed structure to `information-architecture`.
- **The nav model is derived, never designed first.** If it can't be traced back to a layer, the architecture is wrong or the nav item is.

## Gotchas (learned in practice)

These cost real rebuilds. Read before writing the render code.

- **Never leave a child set to `layoutGrow = 1` or `layoutSizingVertical = 'FILL'` inside a parent that is still hugging.** The child collapses to a minimum and the card silently clips — while a token audit still passes clean. Correct order for a row of equal-height cards:
  1. Force every card and its children to hug (`primaryAxisSizingMode = 'AUTO'`, `layoutGrow = 0`).
  2. Measure the tallest card.
  3. Set the row `counterAxisSizingMode = 'FIXED'` and resize it to that height.
  4. *Then* set each card `layoutSizingVertical = 'FILL'`.
  5. Only now re-apply `layoutGrow = 1` to a spacer that pins a footer to the bottom.
- **Never fake a bullet with a `· ` prefix.** A manual bullet cannot hang-indent, so the moment an item wraps, its second line falls back to the left margin and reads as a new item. Use Figma's native list — `setRangeListOptions(0, node.characters.length, { type: 'UNORDERED' })` — which hangs wrapped lines under the text. Then give the node **paragraph spacing** so items separate from their own wraps.
- **For a deliberately unbulleted list, paragraph spacing must beat the line height.** With a 20px line height, 4px between items is invisible — a wrapped item still reads as two. Use at least half the line height, and check a column whose longest item actually wraps.
- **`setBoundVariable('paragraphSpacing', …)` silently no-ops.** It neither throws nor applies. Set paragraph spacing as a raw number and read the property back to confirm it took — this is the one spacing value that legitimately escapes tokenization.
- **An empty auto-layout frame defaults to 100×100.** A spacer used to push items apart will silently dictate its row's height. Set it to `FILL` on **both** axes after appending — sizing it on the primary axis alone leaves the 100px default governing the counter axis.
- **Long header text stretches the root frame.** Constrain intro paragraphs to a fixed width (~900) rather than letting them hug, or the frame grows far wider than its content column.
- **Set the root width to `content + horizontal padding`.** Check the padding token's real value first — assuming 48 when the token resolves to 64 clips the last column.
- **`resize()` reverts sizing modes to FIXED.** Re-apply `HUG`/`FILL` after every resize.
- **Load fonts before touching text.** Any mutation on a text node — including `textAutoResize` — throws if the node's current font isn't loaded. Load via `getStyledTextSegments(['fontName'])` when editing existing text.

---

## Output
A short summary: both frame names and node IDs, the layers built and how many items sit in each, the primary nav items and what changed across the breakpoint, how many decisions are queued for review, and confirmation that every colour, type style, and spacing value binds to the host file's own design system with nothing clipped.
