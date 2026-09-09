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
| Date | `Last updated` | text node stamped when the screens actually change |
| Section | `Section · <Device>` | one per device class present |
| Grid | `Grid` | the wrapping row inside a section |
| Card | `Card · <exact frame name>` | one per screen |
| Link | `Link · <exact frame name>` | the hyperlinked title inside a card |
| Registry | `Link registry` | hidden text node holding the link graph and each screen's added-date, as JSON |
| Badge | `New badge` | the "New" pill overlaid on a recently-added card |

**Never name a node after its own content** (`7 Screens`, `Updated 09/09/26`). The next sync changes the content and the anchor is lost. Name it for its role — `Screen count`, `Last updated`.

This is the single most likely thing to break, because it breaks *from the outside*: a user restyling the header will naturally create a text node named after what it says. **Re-establish the anchors on every run** — find the count and date by matching their content as a fallback, rename them to their role names, and carry on. Failing silently because someone tidied the header is not acceptable behaviour for a scheduled task.

### Step 2 — Read the page

- **Screens** = every top-level **`FRAME`** except the index frame. Nothing else: designs copied onto a page drag loose TEXT labels and component sets along with them, and none of those are screens.
- **Order** by canvas `x`, so the index mirrors the layout someone sees when they zoom out.
- **Device class** by width — a sensible split is ≤ 500 wide is mobile, everything else desktop. Prefer a name prefix (`Mobile/…`) when the file uses one, and fall back to width. Don't demand a naming convention; a copied frame won't have one.

### Step 3 — Reconcile the cards, don't rebuild them

**Only touch what changed.** Rebuilding every run is destructive — it discards any hand-edit to a card and re-exports screens nobody has opened. Reconcile instead:

| State | Action |
|---|---|
| Screen has no card | **add** |
| Card has no screen | **remove** |
| Screen changed | **refresh the thumbnail** |
| Links point at the wrong node | **re-wire** |
| Screen added recently | **show a `New` badge** |
| Badge past its window | **remove it** |
| Otherwise | **leave it completely alone** |

**Detecting a change.** `setPluginData` is unavailable in this API, so there is nowhere conventional to keep prior state. Two things solve it:

1. **Fingerprint the screen structurally** — walk its descendants and hash (FNV-1a is plenty) the node count plus, per node, its type, name, rounded size and position, any text characters, and any solid fill colour. This catches added and removed nodes, moves, resizes, text edits and recolours, and costs well under a second for a few thousand nodes — far cheaper than exporting a PNG to find out nothing moved.
2. **Store it in the thumbnail's node name** — `Thumbnail · fp:<hash>`. The thumbnail's name isn't used for matching, so it's free to carry state, and it survives saves and reopens. Never store it on a node whose name is an anchor.

Verify a fingerprint is *stable across runs* before trusting it — if it drifts on its own, every run refreshes everything and you're back to rebuilding.

**Card anatomy** (build once, on add):

- **Grid maths first.** Content width ÷ cards per row. On a 1440 frame with a page margin of 120 and a 24 gap, four cards land at 282 wide. Derive it; don't guess.
- **Card** — vertical, surface fill, subtle border, large radius, **zero item spacing**, clipping so the thumbnail's top corners stay rounded.
- **Thumbnail** — a fixed-height frame that **clips** a full-length screenshot placed at `y = 0`. This gives a viewport crop of the top of the page with no `imageTransform` maths: put the shot in at card width and let the frame cut it off. A 282 × 176 frame over a 1440-wide page shows its top ~900px.
- **Mobile shots must be narrow.** Filling the card width makes a phone look like a squashed desktop. Around 100px inside a 282 card reads as a phone.
- **Title** — the screen name, tidied (strip a `Desktop/` or `Mobile/` prefix, turn remaining slashes into separators). Style it as a link, because on the canvas the title *is* the clickable thing.
- **Drop the dimensions.** "1440 × 6960" under every card is noise for the people an index is for.

Finally, order the cards within each section to match canvas `x`, and move a card between sections if its device class changed. Both are cheap, non-destructive repositions.

**The `New` badge.** Record each screen's added-date in the registry (`{ id, added }`) the first time a card is built for it, then **re-evaluate every run**: show the badge while `today − added` is inside the window (a week is a sensible default), remove it once past. The badge is *derived state, not a sticky decoration* — removing it matters as much as adding it, or within a month everything is "new" and the badge means nothing.

- **Overlay it on the thumbnail**, top-right with a small inset. The thumbnail is a plain clipping frame, so position it absolutely.
- **Don't use the call-to-action colour.** A "New" flag is a notice, not a button — reach for the brand colour rather than whatever the file uses for its primary action, or people will try to click it.
- **Backfill existing screens as `added: null` when you first add tracking.** Screens that predate it are not new, and badging all of them at once is exactly the noise the badge exists to avoid.

### Step 4 — Wire both kinds of link

Every card gets **two**, because they work in different places:

1. **A prototype reaction on the card** — `ON_CLICK` → `NODE` → the screen, `navigation: 'NAVIGATE'`. Makes the whole card clickable in presentation mode.
2. **A hyperlink on the title text** — `setRangeHyperlink(…, { type: 'NODE', value: screenId })`. Works on the canvas and in dev mode. Figma hyperlinks attach only to **text ranges** — a frame cannot carry one, which is why the title is styled as the link.

**Both must point at the copy on this page.** The classic failure is linking back to the original on the source page: the hyperlink still works, so it looks fine, but the prototype silently does nothing. Verify by node, not by name.

### Step 5 — Record and repair the inter-screen links

**Figma deletes a prototype reaction outright when its destination frame is deleted.** No dangling reference, no warning, nothing left to inspect. So if someone edits a screen elsewhere and copy-replaces it onto this page, every *other* screen's link to it silently disappears — the index self-heals, and the navigation quietly dies. The only defence is to have written the graph down beforehand.

**Record it** in the hidden `Link registry` text node (JSON; hidden children are excluded from auto-layout, so it costs no space). For each reaction whose destination is another screen on the page, store:

- each screen's **added-date**, alongside its node id, which drives the `New` badge
- the **source** and **target** screen names
- a **locator** for the node carrying the reaction: its name-path from the screen root (`Nav bar/Nav bar/Logo`) plus an ordinal to disambiguate repeats
- the trigger, navigation, transition, and scroll-preservation, so a restored link matches the original
- alongside it, a **screen-name → node-id map**, which is how a replacement is detected later

Skip reactions that target components (variant swaps) — those are page-independent and survive a replace.

**Repair, in this order.** Getting the order wrong produces false alarms, which destroy trust in the report faster than a missed link:

1. **Check liveness first.** Does *any* node in the source screen already link to the target? If yes, the link is fine — stop. A source screen that was itself copied brings its reactions along, and if the target's id never changed they still work. Do not try to locate the node before checking this.
2. **Only repair a genuine replacement.** Compare each recorded screen id against the current one. If it changed, the screen was replaced and any missing link to it is collateral damage worth restoring. If the id is unchanged and the link is gone, **someone deleted it on purpose** — report it, never resurrect it.
3. **Locate, then append.** Resolve the node by name-path and ordinal, falling back to the first path match rather than giving up. Then **append** the restored reaction to whatever reactions the node already has — `setReactionsAsync` replaces the whole array, and these nodes commonly carry component variant swaps you must not clobber.
4. **Refresh the registry** with the new ids once repairs are done.

Report links that are live, repaired, deliberately removed, and unresolvable — and flag any link found on the page that isn't in the registry, since that's someone wiring by hand.

### Step 6 — Make the index the starting point

Set the index frame as the page's flow starting point (`page.flowStartingPoints`). The prototype then opens on the index, and **R** returns to it from any screen.

### Step 7 — Update the count and the date

**Adopt the formats already on the page; don't impose your own.** Read the existing copy and match its casing and shape — if the count says `7 Screens` with a capital S, write `8 Screens`, not `8 screens`. If the date reads `Updated 09/09/26`, keep `MM/DD/YY`. A sync that rewrites a user's wording every run is a sync they will turn off.

- **Count** — write it into `Screen count` only when the number actually moved. Handle the singular, and produce something sensible for zero.
- **Date** — stamp `Last updated` **only when the screens changed**: a card added, removed, or a thumbnail refreshed. Do **not** stamp it on a run that found nothing, and do not stamp it for a link repair alone. The date answers "when did the designs last move", not "when did this task last run" — a date that changes every morning tells the reader nothing.
- **Empty** — with no screens, remove the empty sections rather than leaving labelled voids.

Both nodes are optional. If a file has no `Last updated`, skip it rather than inventing one.

### Step 8 — Optional: a "how to use" band

For a client-facing prototype, a short band under the header earns its place. Keep it to the shortcuts, as keycaps rather than prose:

- **C** — start commenting; click the spot, type, hit Enter
- **V** — stop commenting; back to the normal cursor
- **R** — return to the index

Be accurate about where each works: **C** and **V** are editor shortcuts, **R** only applies in presentation view (in the editor, R is the rectangle tool). Add a line reminding people that comments pin to the clicked spot and that replies belong in threads — that's what keeps review feedback manageable.

### Step 9 — Verify

1. Every card's **reaction** and **hyperlink** resolve to a node **on this page**.
2. Every link in the registry is live, or accounted for as deliberately removed.
3. The count matches the number of cards, and the cards match the frames on the page.
4. Nothing is clipped; cards in a row are equal height.
5. Every fill, stroke, padding, gap, radius and text style binds to the file's own design system.

Report what changed — added, removed, unchanged — not just "done".

## Guardrails

- **Never move or edit the screens.** This skill reads them and builds an index. Copying designs onto the page is the user's job unless they ask otherwise.
- **Preserve hand-edits to the header.** Users retitle and rewrite the intro. Regenerate cards and the count; leave their words alone.
- **Never regenerate a card that hasn't changed.** Users hand-edit these. Refresh a thumbnail only when the fingerprint moves, and re-wire only when a link actually points somewhere wrong.
- **Don't invent screens.** If the page is empty, say so and produce the empty state.
- **Don't add dimensions, dates, or status badges** unless asked. An index is for finding a screen.

## Gotchas (learned in practice)

- **`createImage` rejects images over roughly 4096px on a side.** Long pages blow past this — a 9,488px-tall mobile screen fails at any scale above ~0.43. Compute per screen: `scale = Math.min(1, 4000 / node.height)`. Expect long pages to yield softer thumbnails; that's the ceiling, not a bug.
- **Clip, don't transform.** A fixed-height clipping frame over a full-length shot is deterministic; `imageTransform` matrix maths for a top crop is not worth debugging.
- **Capture a node's name before you remove it.** Reading `node.name` after `node.remove()` throws `the node with id … does not exist`, and it's an easy trap when cleaning up state keyed by name.
- **`resize()` reverts sizing modes to FIXED.** Re-apply `FILL`/`HUG` after every resize — especially on a thumbnail frame that must keep filling its card.
- **An empty auto-layout frame defaults to 100×100** and will silently dictate a row's height. Set spacers to `FILL` on both axes.
- **Prototype navigation cannot cross pages.** Verified by the API rejecting it outright. Design around it rather than discovering it late.
- **The first run refreshes everything.** No card carries a fingerprint yet, so every thumbnail is re-exported once and the hashes are stored. That's the migration, not a bug — say so in the report rather than letting it look like everything changed.
- **A deleted frame takes every reaction pointing at it with it — silently.** Text hyperlinks are *not* cleaned up the same way; they keep pointing at a dead id. So after a replace you get vanished reactions and dangling hyperlinks, two different failure shapes from one action.
- **A failed locator is not a broken link.** Check whether the link is already live before reporting it missing, or a cloned screen whose reactions came along will be reported as damage that never happened.
- **Thumbnails are snapshots.** They only get refreshed when a fingerprint moves, so a screen edited outside this page's frames (a swapped library component, say) may not register. When in doubt, delete the `fp:` suffix from a thumbnail's name to force that one card to refresh.

---

## Output
A short summary: how many screens the page holds, and which cards were **added, removed, thumbnail-refreshed, re-wired, or left untouched** — naming the untouched ones matters, since it's the evidence the sync was incremental. Plus which cards gained or lost a `New` badge, whether the date was stamped and why, the state of the inter-screen links — live, repaired, deliberately removed, unresolvable — the new count, confirmation that every card links to a screen on this page in both presentation and canvas, and confirmation that the index is the flow starting point.
