# figma-toolkit-sync

Keeps the **[AI UX Toolkit Figma file](https://www.figma.com/design/n4Hh5v0xiIdezIiiP0Hiu5/AI-UX-Toolkit)**
in sync with this repo. **The repo is the source of truth**; the Figma file is a
generated view of it.

When a plugin README, a `SKILL.md`, or the main README's "What's inside" tables
change, this tool regenerates the data-driven Figma content so the file matches
the repo verbatim:

- the main page's **What's inside** and **Plugin details** sections (`render.figma.js`), and
- one **per-plugin skill page** each, rendering every `SKILL.md` in full, cross-linked from the Plugin Details catalogue (`render-pages.figma.js`).

The curated **Overview** and **Reference** sections are left untouched.

## Why it works the way it does

Figma canvas nodes can only be created through the **Figma Plugin API**, which
runs *inside Figma* (via the Figma MCP `use_figma` tool). The Figma REST API
cannot create nodes. So the sync is **agent-driven**: a scheduled Claude Code
run reads the repo and rewrites Figma through the MCP. It is made deterministic
by two committed artifacts:

| File | Role |
|---|---|
| `extract.mjs` | Parses the READMEs **and every `SKILL.md`** → `toolkit-data.json` (structured source of truth) + a sha256 `fingerprint`. Pure Node, no deps. |
| `render.figma.js` | Renderer for the **main catalogue page** (What's inside + Plugin details). Idempotent: locates nodes **by name**, clears, rebuilds from data. Passed to `use_figma`. |
| `render-pages.figma.js` | Renderer for the **per-plugin skill deep-dive pages** — one Figma page per plugin, a frame per skill showing its full `SKILL.md` (markdown: headings, lists, tables, code, blockquotes). Ops: `plugin-page`, `organize` (phase dividers + ordering), `link` (catalogue → skill hyperlinks). Kept separate so one large SKILL.md body + the renderer stay under the `use_figma` size limit. |
| `toolkit-data.json` | Generated. The exact data both renderers consume — includes each plugin's `skills[]` (full SKILL.md) and a `pagePlan` (order + phase dividers). Commit it so diffs are reviewable. |
| `.figma-sync.lock.json` | The last-synced fingerprint. Sync is a no-op when the current fingerprint matches. |

Presentation-only details that are **not** in the repo (phase colors, chip
palette) live in `render.figma.js` on purpose — they are the tool's styling, not
toolkit content.

## Run the sync (the scheduled task does exactly this)

1. **Regenerate the data + fingerprint**
   ```bash
   node scripts/figma-toolkit-sync/extract.mjs
   ```
2. **Change gate.** Compare `fingerprint` in `toolkit-data.json` against
   `.figma-sync.lock.json`. If equal → **stop, nothing to do.**
3. **Rebuild "What's inside"** — one `use_figma` call. Prepend the SYNC object,
   then the full contents of `render.figma.js`:
   ```js
   const SYNC = { section: "whats-inside", data: /* toolkit-data.json .phases */ };
   // …contents of render.figma.js…
   ```
4. **Rebuild "Plugin details"** — in batches of ~4 plugins to stay under the
   `use_figma` 50 KB code limit. First batch clears the stack:
   ```js
   const SYNC = { section: "plugin-details", data: /* plugins[0..3] */, clear: true };
   // …contents of render.figma.js…
   ```
   Subsequent batches: `clear: false`, next slices, in `toolkit-data.json` order.
5. **Refit the sections.** After each board changes height, resize its wrapping
   Section: `section.resizeWithoutConstraints(board.width + 96, board.height + 104)`
   (What's inside → Section "02 · …"; Plugin details → Section "03 · …").
6. **Rebuild the per-plugin skill pages** with `render-pages.figma.js`. For each
   plugin in `toolkit-data.json` `.plugins` (in order), split its `.skills` into
   batches whose total `body` length stays under ~22 000 chars (a big skill goes
   alone), then:
   ```js
   // first batch of a plugin (clears + builds the page header):
   const SYNC = { op: "plugin-page", reset: true,
                  plugin: /* the plugin WITHOUT its skills field */,
                  skills: /* first batch */ };
   // …contents of render-pages.figma.js…
   ```
   Later batches for the same plugin use `reset: false`. Each call returns
   `skillFrames: [{ skill, id }]` — collect `{ plugin, skill, nodeId: id }` for
   every skill. Then order the pages and link the catalogue:
   ```js
   const SYNC = { op: "organize", order: /* pagePlan.order */, dividers: /* pagePlan.dividers */ };
   const SYNC = { op: "link", links: /* the collected {plugin, skill, nodeId} list */ };
   ```
7. **Update the lock.** Write the new `fingerprint` + `lastSyncedAt` into
   `.figma-sync.lock.json`.
8. *(Optional)* Log a one-line entry to the file's Changelog page, mirroring
   `changelog-automation`.

## Scope & guarantees

- **Idempotent.** Re-running with no repo change is a no-op (fingerprint gate).
  Re-running after a change produces the same result regardless of prior state
  (nodes located by name, content cleared and rebuilt).
- **Scaffold assumed.** Boards, sections, styles, and the 11 phase-card shells
  must already exist (created by the initial build). This tool refreshes
  *content*, it does not recreate the file from scratch.
- **Only two sections** are touched. Overview and Reference are curated prose and
  are never overwritten.

## Editing checklist for maintainers

- Changed a plugin's skills or copy? Just edit its `README.md` — the sync picks
  it up.
- Added/removed a plugin, or moved a skill between phases? Edit the plugin
  `README.md` **and** the main README's "What's inside" table (as you already do
  per the root README's maintenance rules); the sync reflects both.
- Requirement chips (Figma MCP / Browser / Codebase) are the one thing not
  parseable from a single table — update the `REQUIREMENTS` map at the top of
  `extract.mjs` if a plugin's requirements change.
