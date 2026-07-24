# Low-fi wireframe recipe

The concrete "how" for Phase 2 of divergent-exploration: turning 2–3 picked options into side-by-side low-fidelity wireframes at "just enough" fidelity. The aim is a fair, legible comparison — the *content strategy* of each option should differ, while incidental chrome stays identical so it doesn't muddy the read.

## The fidelity bar

Grayscale blocks + **real text and sample data**, no brand polish. Enough content to make each concept's structure obvious; not so much that it looks finished or invites color/spacing bikeshedding. If two frames look interchangeable, add content. If the user reacts to polish instead of structure, strip back.

## Grayscale palette

One neutral ramp plus a single faint accent reserved for active/primary state only. These values read as "wireframe" and hold up in light UI:

| Role | Hex | Use |
|---|---|---|
| Page background | `#FFFFFF` | app canvas |
| Panel | `#FAFAFB` | sidebar / distinct surfaces |
| Card / block | `#F8F8FA` | tiles, cards, table container |
| Border | `#D9D9DF` | all strokes / dividers (1px) |
| Ink | `#2E2E3B` | primary text, values, headings |
| Sub | `#808090` | muted labels, captions, secondary text |
| Faint | `#B8B8C2` | placeholder fills, chart bars, progress fills, plain icons |
| Accent fill | `#DBDEF6` | active nav item, primary button, brand mark — **sparingly** |
| Accent ink | `#52579E` | text/icon on accent |

No other colors. No status colors (success/error) — say "Completed" / "Failed" / "Pending" in text instead. No shadows, gradients, photos, or expressive icons (use plain gray squares/circles as icon/avatar stand-ins).

## What content to include

Put in the real words and numbers that make a strategy legible — this is what separates a useful low-fi from meaningless gray boxes:

- **Navigation**: actual item labels (Home, Accounts, Cards…), with the active one on the accent.
- **Headers**: real page title + greeting, section headings.
- **Values**: real-looking currency, names, dates, percentages, counts.
- **Tables/lists**: column headers + several representative rows of data.
- **Controls**: buttons and chips with their real labels; filters showing a chosen value.
- **"Smart"/AI or narrative content**: write one real example sentence, not a gray bar — the phrasing *is* the concept.
- **Status/badges**: as short text, not colored pills.

## Layout for comparison

- **One frame per picked option**, desktop size (e.g. 1440×900), placed **side by side** on the canvas with a text caption above each naming it: `Wireframe <n> — <option label>`.
- **Reuse a shared app-shell** (sidebar/nav, top bar, user row) across all options so only the *content area* differs. Identical chrome makes the structural difference — the thing being decided — pop, and keeps the comparison fair.
- Keep spacing generous and consistent; density itself can be a differentiator (e.g. a dense dashboard vs. a calm command screen), so let the content, not random padding, carry it.

## Building in Figma

Use the **figma-use** skill / `use_figma` tool. Notes from practice:

- **Build with hug-content auto-layout.** Create every container with `figma.createAutoLayout(dir)` (both axes hug by default), then set `FILL`/`FIXED`/`resize` only where you specifically need it.
- **Gotcha that silently breaks layouts:** a raw `figma.createFrame()` is **100×100 FIXED**, and setting `.layoutMode` on it does *not* switch it to hug. Any element you intend to hug its content (nav rows, chips, buttons, badges) will get stuck ~100px tall and your columns/sidebars will look stretched and evenly-spaced for no reason. Always start from `createAutoLayout`, or explicitly set `primaryAxisSizingMode`/`counterAxisSizingMode = "AUTO"`.
- **Pin footers** (user row, etc.) with a `SPACE_BETWEEN` parent holding a top group and the footer, rather than a flex spacer — it's more predictable.
- Apply the single accent only to active/primary elements.
- **Screenshot each frame** (`get_screenshot`) and eyeball it before presenting — cropped text and inflated hug-frames are the common defects.

If a non-Figma medium is in play (HTML/React, a whiteboard tool), the palette, content rules, and side-by-side/shared-shell principles carry over unchanged; only the build mechanics differ.
