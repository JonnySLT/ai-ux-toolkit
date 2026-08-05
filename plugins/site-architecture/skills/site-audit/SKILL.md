---
name: site-audit
description: >
  Produce a structural "site audit" of an EXISTING website as a polished,
  tabbed Figma document — Overview (metrics + key findings + sections),
  Site Architecture (the IA tree), and Page Inventory (a Page · Path · Depth ·
  Type · Function table) — styled entirely from the current file's own
  design-system tokens and text styles. Classifies every page against a fixed
  template-type and function vocabulary, records navigation depth as L-levels,
  and audits ONLY the current state (never recommendations or "what should
  change"). After building the audit it OFFERS to also generate a matching
  visual Site Map diagram. Trigger when the user says "site audit", "audit this
  site / its IA", "current site architecture", "map the existing site", "page
  inventory", or wants a structural map of a live site before a redesign.
---

# Site Audit

Turn a live website's structure into a clean, tabbed Figma document: **Overview · Site Architecture · Page Inventory**. It's a *record of what exists today* — the raw material for a redesign conversation, not the redesign itself.

**Fully file-agnostic.** Read the current file's own variables and text styles at runtime and bind everything to them — never hardcode a hex, font, or spacing value. If the file has no design system, say so and stop (this skill dresses the audit in the file's system).

Always load the **`figma-use`** skill before any `use_figma` call.

## Governing principle — bind to the host file's design system
**Every node this skill creates, in every step, must be dressed in the design system of the file it is built in — never a design system from anywhere else, and never hardcoded values.** Whatever file the audit (or the Site Map) is generated in, discover *that file's* variable collections and text styles at runtime and bind to them: fills, strokes, text colour, padding, radius, item-spacing, and every text style. The token *names* used throughout this doc (`brand/primary`, `background/subtle`, `content/secondary`, `Display/XL`, …) are **illustrative** — resolve the equivalent tokens/styles that actually exist in the current file, by role, and bind to those. If the file has no design system, say so and stop; this skill has no palette of its own. Treat "does this element bind to a token/style of *this* file?" as the check that gates every element.

## When to use vs. neighbours
- **site-audit (this):** map an *existing* site's IA + templates into a document — a record of **what exists today**. Optionally also draws the visual Site Map diagram. Current-state only.
- **`conceptual-architecture`:** define the **NEW or redesigned** high-level architecture (the forward-looking target). This is the natural *next* step: audit the current site here, then hand the findings to `conceptual-architecture` to propose the redesign. If the user wants "the new structure / a redesigned sitemap," that skill owns it — this one never proposes changes.
- **`figma-designer` / `figma-generate-design`:** design the *new* site. This skill deliberately does not.
- **`harvest-components` / `reattach`:** work on components/tokens, not IA.

---

## The one hard rule — current state only
The audit records **what is there now**. No recommendations, no "should", no "redesign", no "opportunity", no forward-looking framing — not even in the intro (describe the current site, not the redesign it will inform). **Before finishing, scan every text node and strip any such phrasing.** A good gut check: every line answers "what exists?", never "what to change?".

## Inputs to gather first
1. **The site's current IA.** Get it from the live `sitemap.xml` (best), or by crawling / browsing the site. **Collapse repeating detail pages** — blog posts, location pages, campaign variants — into one template plus a count, so the *shape* stays legible instead of drowning in near-identical URLs.
2. **The file's design system.** Enumerate its variable collections (color / spacing / radius) and text styles; capture their **keys** so you can import and bind them. Discover, don't assume.

## Styling — derived from the file's tokens (pattern)
Bind every fill / text / space to a token. The pattern (shown with a blue-brand system; substitute the file's equivalents):
- **Canvas** = a *subtle* background token; **cards / rows** = a *surface* token.
- **Section identity + all accents** = `brand/primary`; a dark *inverse* token for root chips.
- **Text** = `content/primary | secondary | muted`; on colored fills use `content/on-brand`.
- **Type styles**: a Display for titles, Heading for section headings, Body for prose, **Label** for page names / tab labels, **Overline** for eyebrows & keys, **Caption** for paths.
- Import by key: `importStyleByKeyAsync` / `importVariableByKeyAsync`. Bind fills with `figma.variables.setBoundVariableForPaint(paint,'color',v)`; padding / radius / itemSpacing with `node.setBoundVariable(...)`; text with `node.setTextStyleIdAsync(style.id)` **after** `figma.loadFontAsync(style.fontName)`.

---

## Build — the audit (three tabs, one frame each, e.g. 1024 wide)

Every frame, card, row, and text node below binds to the **host file's** tokens and styles (governing principle) — the descriptions name roles (canvas, surface, brand accent, Heading, Body…); map each to the current file's actual token/style.

### Shared header — identical on every tab
- **Top tab bar**: `Overview · Site Architecture · Page Inventory`; active label = brand, others = muted.
- **Eyebrow** (Overline, brand): `<SITE.TLD> — SITE AUDIT`.
- **Title** (Display) = the tab's own name (`Overview`, `Site Architecture`, `Page Inventory`) — not a repeated generic title.
- A one-line intro / caption (Body or Body-Small, secondary).
- Keep casing consistent between the tab-bar label and the title.

### Tab 1 — Overview
- **4 metric tiles**, equal height. Big number (Heading/Display) + a ~2-line label (Body/Small). Equalise height by setting each tile `layoutSizingVertical='FILL'`. Metrics are counts of the current site (top-level sections, max click depth, key template counts, collapsed-page counts).
- **"Key findings"** — a *tinted card* (brand-subtle fill + a thin left accent bar) holding 3–4 **scannable bullets** (bold lead + one clause). Each bullet is a current-state observation (e.g. "wide but shallow", "two sections overlap", "a hidden signed-in area") — never a recommendation.
- **"Top-level sections at a glance"** — a numbered list: index + section name (Label) + one-line description.

### Tab 2 — Site Architecture (the IA tree, as text)
- A short notation caption / intro — keep the Site Architecture tab's description to **at most 2 lines** (trim the wording until it fits two lines).
- A **white card** with the tree: a dark **root chip** (the domain); then each section = a brand bullet + section name (brand) + path (muted), and an indented child line listing its pages (comma-separated; `(+N)` for collapsed deeper pages; `→` for steps in a flow).
- An **"Authenticated · My Account"** sub-block for sign-in-only areas.
- A **"Site Map ↗"** link (top-right of the header) that drills down to the visual Site Map, if built (see optional step).

### Tab 3 — Page Inventory (the table)
Columns: **Page · Path · Depth · Type · Function**. Header row → section subheader rows → data rows.
- **Depth = L-levels**: `L0` home, `L1` one click from home, `L2` two, … and **`Global`** for header/footer/account-menu pages that live site-wide rather than at a nav depth.
- **Type** and **Function** come from the fixed vocabularies below — verbatim, so pages stay countable.
- Build it with the **column-frame technique** (below) so a column is one draggable frame.

## Fixed vocabularies (closed sets — do not invent free-text values)
**Template type** — the reusable layout:
`Home` homepage · `Hub` section index that routes deeper · `Listing` filterable/paginated feed · `Content` standard editorial page · `Detail` repeated leaf template, many records (note `× count`) · `Form` single-step capture · `Flow` multi-step process · `Landing` curated conversion page, often one-off · `Utility` search/legal/account · `External` off-site link.

**Function** — the page's primary job:
`Navigate` helps users find their way · `Inform` explains · `Convert` prompts a commitment · `Transact` completes a multi-step action · `Account` signed-in.

Include a compact **key** near the top of the Page Inventory only if the user wants one; the vocabularies are self-explanatory enough to omit.

## The column-frame table technique
- Table = one **HORIZONTAL** auto-layout; **each column is its own VERTICAL auto-layout frame** (fixed width; the last column FILL). Resizing a column = dragging that one frame — its cells (all FILL width) follow.
- Build **column-by-column** so the row order matches across columns.
- Give every **data cell a deterministic FIXED height** (~30) and **section-header cells a taller FIXED height** (~44), vertically centred (`primaryAxisAlignItems='CENTER'`). **Widen columns so each cell is one line.** Do **not** use max-height normalisation — it mis-picks a tall cell and yields wrong heights (section headers ballooned to 100px in practice).
- Section headers: put the text in the **first column only**, with **empty cells at the same row index in the others** (equal fixed height keeps rows aligned). Give header-row cells a bottom border via `strokeBottomWeight`.

---

## Optional step — offer the visual Site Map
This is a required part of the flow. **Once the skill is activated (after you understand the request / gather the IA), ask the user whether they also want a matching visual Site Map** — the diagram twin of the Site Architecture tab. Use `AskUserQuestion` (or a direct yes/no). Build the audit regardless; build the Site Map only if they say yes.

If yes, build it bound to the **same host-file tokens/styles** (governing principle — resolve this file's equivalents by role) as a **tree diagram** (this is `layoutMode: NONE` / absolute positioning with thin **connector rectangles** — a border/gray token — from the root down to each section; it is not an auto-layout flow):
- **Header**: same eyebrow + a Display title ("Site Map") + subtitle — **set the subtitle/description text to a max width of 760px** so it wraps cleanly; plus a **"‹ Back"** link to the audit.
- **Root node**: a dark card (fill an inverse/deep-brand token) with the domain (Heading, on-brand) + a caption path.
- **Section card**: a white *surface* frame; a **`head`** sub-frame filled `brand/primary` with the section name (Heading, on-brand) + path (Caption); then **rows** — each a small brand dot + page name (Body/Small) — with `(+N)` collapse badges and `↗` for external links.
- **Authenticated band**: a differently-accented root (e.g. `accent/interactive`) labelled "Logged-in / My Account" + its sections in the same card style.
- **Legend** card defining the node types (root, section, page, +N, ↗, authenticated).
- **Cross-link** it with the audit: the audit's Site Architecture tab gets the **"Site Map ↗"** link to this diagram; the diagram gets the **"‹ Back"** link to the audit's Site Architecture tab.

## Verify
- Screenshot each tab (and the Site Map if built). Confirm: table rows align, metric cards are equal height, nothing is clipped, and **every** colour/type is bound to a token/style (nothing hardcoded).
- Re-scan all copy for forward-looking language — the audit must be current-state only.

## Gotchas (learned in practice)
- **`resize()` re-locks an auto-layout frame to FIXED sizing** — set `primaryAxisSizingMode` / `counterAxisSizingMode` / `layoutSizing*` **after** any resize.
- **Equal-height cards**: set each card `layoutSizingVertical='FILL'`. (`counterAxisAlignItems` has no `STRETCH`.)
- **Table alignment**: deterministic FIXED cell heights beat max-height normalisation.
- **Deleting a GROUP deletes its children.** To reorganise, move children to the page first (the group auto-removes when emptied; a following explicit `remove()` then throws — wrap it in try/catch). Never "clean up" by deleting a group whose contents you still need.
- **Text**: load the style's `fontName` before `setCharacters` / `setTextStyleIdAsync`.
- **Wrapped chip rows** (if used for a key): `layoutWrap='WRAP'` + `counterAxisSpacing`.

## Output
A short summary: which tabs were built, the headline counts, whether a visual Site Map was added, and confirmation the copy is current-state only.
