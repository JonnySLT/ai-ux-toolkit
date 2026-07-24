# Changelog conventions (portable default)

The default entry structure the changelog skills use when a project **doesn't** define
its own `CHANGELOG_RULES`. A project may override any of this in its own config; if it
does, follow the project's rules instead. These defaults are design-system-agnostic —
they work for a component library or a screens/flows file.

## Page & container

- A page named **`Changelog`**.
- Inside it, a **`VERTICAL` auto-layout** frame named **`Entries`** — the container the
  sweep locates by name and prepends into. Newest entry first: `entriesFrame.insertChild(0, entry)`.
- Gaps come from the container's **`itemSpacing`** (default **12px**) — do **not** add
  spacer layers or dividers between entries.
- Entries have **no bottom stroke**.

## Entry structure

Each entry is a `VERTICAL` auto-layout frame with **12px vertical padding** and **12px
itemSpacing**, containing, top to bottom:

1. **Header row** (`HORIZONTAL`, space-between):
   - **Left:** the **version** (e.g. `v1.4.2`) + a **tag pill** (see tags). When an entry
     spans 2+ categories, use one pill per section instead (see below).
   - **Right:** the **date** and an **author badge**. The date text layer must **HUG**
     (never FILL), so it sits flush right.
2. **Section(s):** one per category that changed. Each section = a small label + a list
   of bullet rows. Include a **per-section label pill only when there are 2+ sections**;
   a single-category entry needs no section label, just its bullets under the header.
3. **Bullets:** one line per changed entity, naming the entity and what changed
   (e.g. `Button — added Destructive variant`, `Home screen — reworked KPI band`).

## Versioning

- **Semver-ish**, newest at top. Increment the **patch** for a routine sweep
  (`v1.4.2` → `v1.4.3`); bump minor/major by hand for larger releases.
- The first (seed) entry is `v1.0.0` (or `v0.1.0`).

## Tags

Tag by what changed. Multiple sections → multiple pills.

| Tag | Use for |
|---|---|
| `TOKENS` | variables / design tokens |
| `COMPONENTS` | components & variants |
| `DOCUMENTATION` | pages, styles, docs, setup/seed entries |
| `SCREENS` | design-file frames / screens |
| `FLOWS` | multi-screen flows |

## Date & author badges

- **Date format:** `MMM D, YYYY` (e.g. `Jul 24, 2026`) unless the project specifies otherwise.
- **Author badge:**
  - `MANUAL` — a human/unattributed edit detected by a **sweep** (the sweep can't attribute it). No repo-push badge.
  - A repo-push badge (e.g. `SYNCED`) — only when the entry corresponds to a known repo→Figma push, per the project's own rules.

## Styling (tokens over hex)

- Prefer the **file's own design-system tokens/styles** (local or linked) for fills, text,
  and radii so entries look native to that file. Bind to variables/styles rather than
  hardcoding colours.
- The **sweep clones the most recent existing entry** for all styling (fills, fonts,
  padding, pills) — so the **seed entry created at setup is the style template**. Make it
  correct; everything after inherits from it.
- If a file has no usable tokens, neutral defaults are fine: ~13–14px body, a muted
  small label, subtle pill backgrounds, 8px pill radius.
