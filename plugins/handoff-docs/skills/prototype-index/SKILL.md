---
name: prototype-index
description: Build and maintain an index page for a Figma prototype — a grid of screen thumbnails, one card per screen, each clickable in presentation mode and on the canvas, in the style of the old InVision project overview. The page itself is the source of truth: every top-level frame on it becomes a card, cards for removed screens disappear, and the screen count updates itself. Re-run it any time someone copies a design onto the page. Trigger on "prototype index", "index page", "add this screen to the index", "update the prototype index", "sync the index", "make an InVision-style overview", or when someone has copied designs onto a prototype page and wants them listed. For mapping a product's structure rather than listing built screens, use conceptual-architecture; for annotating a single frame for developers, use annotate.
---

Build and maintain an **index page for a prototype**: a grid of screen thumbnails that links to every screen, the way the old InVision project overview worked. Open the prototype, land on the index, click a screen, come back.

It is **idempotent and page-driven**. The page is the source of truth — every top-level frame on it is a screen, and the index is rebuilt from what's actually there. Run it once to create the index, and again every time someone copies a design onto the page.

> **The index and the screens must live on the same page.** Figma rejects a prototype `NAVIGATE` action whose destination is on another page — *"destinations must be a different top-level frame on the same page."* Text hyperlinks *can* cross pages, but they only jump the canvas; they never produce a click-through prototype. So if the screens live elsewhere, either copy them onto the index's page or build the index on theirs. Say this out loud rather than quietly shipping hyperlinks and calling it a prototype.

> **Style everything with the design system the file already uses.** Resolve text styles and colour/spacing variables from the current file or the libraries it already has enabled. Token names in this document are illustrative — resolve the equivalents by role. If the file has no design system, say so and offer clean neutral defaults.

## Example prompts

- "Build an index page for this prototype"
- "Add the screens I just copied over to the index"
- "Update the prototype index"
- "Make an InVision-style overview page"
- "How many screens are on the prototype page?"

---

## Before you start

- **Always load the `figma:figma-use` skill before any `use_figma` call.**
- **Know the page**, not just the file. Extract the `fileKey` and the page from the URL the user shares. Everything this skill does is scoped to one page.
- **Check what's already there.** If an index frame exists, this is a sync, not a build — preserve its header, its copy, and any hand-edits the user has made. Only the cards and the count are yours to regenerate.

## Process

### Step 1 — Find the anchors

Locate by **name**, never by stored ID, so the skill survives a rebuild:

| Anchor | Name | Role |
|---|---|---|
| Index frame | `Prototype Index` | the root; the only top-level frame that is *not* a screen |
| Count | `Screen count` | text node the header count is written into |
| Section | `Section · <Device>` | one per device class present |
| Grid | `Grid` | the wrapping row inside a section |
| Card | `Card · <exact frame name>` | one per screen |
| Link | `Link · <exact frame name>` | the hyperlinked title inside a card |

**Never name a node after its own content** (`7 screens`). The next sync changes the content and the anchor is lost. Name it for its role.

### Step 2 — Read the page

- **Screens** = every top-level `FRAME` or `COMPONENT` except the index frame.
- **Order** by canvas `x`, so the index mirrors the layout someone sees when they zoom out.
- **Device class** by width — a sensible split is ≤ 500 wide is mobile, everything else desktop. Prefer a name prefix (`Mobile/…`) when the file uses one, and fall back to width. Don't demand a naming convention; a copied frame won't have one.

### Step 3 — Rebuild the cards

Delete every existing `Card · …` and rebuild. Regenerating is cheap, and diffing invites stale thumbnails and orphaned cards.

- **Grid maths first.** Content width ÷ cards per row. On a 1440 frame with a page margin of 120 and a 24 gap, four cards land at 282 wide. Derive it; don't guess.
- **Card** — vertical, surface fill, subtle border, large radius, **zero item spacing**, clipping so the thumbnail's top corners stay rounded.
- **Thumbnail** — a fixed-height frame that **clips** a full-length screenshot placed at `y = 0`. This gives a viewport crop of the top of the page with no `imageTransform` maths: put the shot in at card width and let the frame cut it off. A 282 × 176 frame over a 1440-wide page shows its top ~900px.
- **Mobile shots must be narrow.** Filling the card width makes a phone look like a squashed desktop. Around 100px inside a 282 card reads as a phone.
- **Title** — the screen name, tidied (strip a `Desktop/` or `Mobile/` prefix, turn remaining slashes into separators). Style it as a link, because on the canvas the title *is* the clickable thing.
- **Drop the dimensions.** "1440 × 6960" under every card is noise for the people an index is for.

### Step 4 — Wire both kinds of link

Every card gets **two**, because they work in different places:

1. **A prototype reaction on the card** — `ON_CLICK` → `NODE` → the screen, `navigation: 'NAVIGATE'`. Makes the whole card clickable in presentation mode.
2. **A hyperlink on the title text** — `setRangeHyperlink(…, { type: 'NODE', value: screenId })`. Works on the canvas and in dev mode. Figma hyperlinks attach only to **text ranges** — a frame cannot carry one, which is why the title is styled as the link.

**Both must point at the copy on this page.** The classic failure is linking back to the original on the source page: the hyperlink still works, so it looks fine, but the prototype silently does nothing. Verify by node, not by name.

### Step 5 — Make the index the starting point

Set the index frame as the page's flow starting point (`page.flowStartingPoints`). The prototype then opens on the index, and **R** returns to it from any screen.

### Step 6 — Update the count and handle empty

Write the count into the `Screen count` node — singular for one, and a plain "No screens yet" for none. With no screens, remove the empty sections rather than leaving labelled voids.

### Step 7 — Optional: a "how to use" band

For a client-facing prototype, a short band under the header earns its place. Keep it to the shortcuts, as keycaps rather than prose:

- **C** — start commenting; click the spot, type, hit Enter
- **V** — stop commenting; back to the normal cursor
- **R** — return to the index

Be accurate about where each works: **C** and **V** are editor shortcuts, **R** only applies in presentation view (in the editor, R is the rectangle tool). Add a line reminding people that comments pin to the clicked spot and that replies belong in threads — that's what keeps review feedback manageable.

### Step 8 — Verify

1. Every card's **reaction** and **hyperlink** resolve to a node **on this page**.
2. The count matches the number of cards, and the cards match the frames on the page.
3. Nothing is clipped; cards in a row are equal height.
4. Every fill, stroke, padding, gap, radius and text style binds to the file's own design system.

Report what changed — added, removed, unchanged — not just "done".

## Guardrails

- **Never move or edit the screens.** This skill reads them and builds an index. Copying designs onto the page is the user's job unless they ask otherwise.
- **Preserve hand-edits to the header.** Users retitle and rewrite the intro. Regenerate cards and the count; leave their words alone.
- **Don't invent screens.** If the page is empty, say so and produce the empty state.
- **Don't add dimensions, dates, or status badges** unless asked. An index is for finding a screen.

## Gotchas (learned in practice)

- **`createImage` rejects images over roughly 4096px on a side.** Long pages blow past this — a 9,488px-tall mobile screen fails at any scale above ~0.43. Compute per screen: `scale = Math.min(1, 4000 / node.height)`. Expect long pages to yield softer thumbnails; that's the ceiling, not a bug.
- **Clip, don't transform.** A fixed-height clipping frame over a full-length shot is deterministic; `imageTransform` matrix maths for a top crop is not worth debugging.
- **`resize()` reverts sizing modes to FIXED.** Re-apply `FILL`/`HUG` after every resize — especially on a thumbnail frame that must keep filling its card.
- **An empty auto-layout frame defaults to 100×100** and will silently dictate a row's height. Set spacers to `FILL` on both axes.
- **Prototype navigation cannot cross pages.** Verified by the API rejecting it outright. Design around it rather than discovering it late.
- **Thumbnails are snapshots.** They go stale when a design changes, which is the main reason to re-run rather than diff.

---

## Output
A short summary: how many screens the page holds, which cards were added, removed or rebuilt, the new count, confirmation that every card links to a screen on this page in both presentation and canvas, and confirmation that the index is the flow starting point.
