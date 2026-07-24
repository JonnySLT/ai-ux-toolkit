# figma-toolkit-sync

Keeps the **[AI UX Toolkit Figma file](https://www.figma.com/design/n4Hh5v0xiIdezIiiP0Hiu5/AI-UX-Toolkit)**
in sync with this repo. **The repo is the source of truth**; the Figma file is a
generated view of it.

When a plugin README, a `SKILL.md`, or the main README's "What's inside" tables
change, this tool regenerates the data-driven Figma content so the file matches
the repo verbatim:

- the Overview page's **What's inside** index (`render.figma.js`), and
- one **per-plugin page** each — a mini-TOC of the plugin's skills plus its README notes, followed by every `SKILL.md` in full (`render-pages.figma.js`). In "What's inside", skills are grouped under their owning plugin and each plugin label links to its page (skill rows are plain text); on the plugin pages, each mini-TOC entry links to its skill's deep-dive frame.

The curated **Overview** and **Reference** boards are left untouched. (Plugin detail content used to live in a "Plugin details" board on the Overview page; it now lives on each plugin's own page, paired with its skills.)

## Why it works the way it does

Figma canvas nodes can only be created through the **Figma Plugin API**, which
runs *inside Figma* (via the Figma MCP `use_figma` tool). The Figma REST API
cannot create nodes. So the sync is **agent-driven**: a scheduled Claude Code
run reads the repo and rewrites Figma through the MCP. It is made deterministic
by two committed artifacts:

| File | Role |
|---|---|
| `extract.mjs` | Parses the READMEs **and every `SKILL.md`** → `toolkit-data.json` (structured source of truth) + a sha256 `fingerprint`. Pure Node, no deps. |
| `render.figma.js` | Renderer for the Overview page's **What's inside** index. Idempotent: locates nodes **by name**, clears the Grid, rebuilds every phase card from data. Passed to `use_figma`. |
| `render-pages.figma.js` | Renderer for the **per-plugin pages** — one Figma page per plugin: header, an intro block (mini-TOC of the plugin's skills + README notes), then a frame per skill showing its full `SKILL.md` (markdown: headings, lists, tables, code, blockquotes). Ops: `plugin-page`, `add-intro` (retrofit the intro block), `organize` (phase dividers + ordering), `link` (self-discovering: wires mini-TOC entries and What's-inside rows to skill frames). Kept separate so one large SKILL.md body + the renderer stay under the `use_figma` size limit. |
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
   This clears the Grid and rebuilds all phase cards, naming each skill row
   `WI · <skill>` so the `link` step (below) can hyperlink it. The board hugs its
   content (auto-layout), so no section refit is needed.
4. **Rebuild the per-plugin pages** with `render-pages.figma.js`. For each plugin
   in `toolkit-data.json` `.plugins` (in order), split its `.skills` into batches
   whose total `body` length stays under ~22 000 chars (a big skill goes alone):
   ```js
   // first batch of a plugin — clears the page, builds the header + intro block
   // (mini-TOC of skills + README notes), then the first skill frames:
   const SYNC = { op: "plugin-page", reset: true,
                  plugin: /* the plugin object (readme kept; heavy skills field dropped) */,
                  skills: /* first batch */ };
   // …contents of render-pages.figma.js…
   ```
   Later batches for the same plugin use `reset: false`. Then order the pages and
   wire the hyperlinks — the `link` op is **self-discovering** (it re-derives skill
   frames from node names), so it needs no pre-collected id list:
   ```js
   const SYNC = { op: "organize", order: /* pagePlan.order */, dividers: /* pagePlan.dividers */ };
   const SYNC = { op: "link" }; // wires each mini-TOC entry → its skill frame, and each What's-inside plugin label → its page
   ```
   *(`render-pages.figma.js` also exposes an `add-intro` op — `{ op: "add-intro", plugin }` — that retrofits the intro block onto an already-built plugin page without re-rendering its skills. It's a one-time migration helper, not part of the normal sync.)*
5. **Update the lock.** Write the new `fingerprint` + `lastSyncedAt` into
   `.figma-sync.lock.json`.
6. *(Optional)* Log a one-line entry to the file's Changelog page, mirroring
   `changelog-automation`.

## Scope & guarantees

- **Idempotent.** Re-running with no repo change is a no-op (fingerprint gate).
  Re-running after a change produces the same result regardless of prior state
  (nodes located by name, content cleared and rebuilt).
- **Scaffold assumed.** The Overview page's boards (incl. the What's-inside
  `Grid` and `Workflow ribbon`) and the local text/paint styles must already
  exist (created by the initial build). This tool refreshes *content*; the
  What's-inside Grid and every plugin page are cleared and rebuilt from data.
- **Only the What's inside board** on the Overview page is touched there; the
  curated Overview and Reference boards are never overwritten. The per-plugin
  pages (and phase-divider pages) are fully managed — tagged and safe to rebuild.

## Editing checklist for maintainers

- Changed a plugin's skills or copy? Just edit its `README.md` — the sync picks
  it up.
- Added/removed a plugin, or moved a skill between phases? Edit the plugin
  `README.md` **and** the main README's "What's inside" table (as you already do
  per the root README's maintenance rules); the sync reflects both.
- Requirement chips (Figma MCP / Browser / Codebase) are the one thing not
  parseable from a single table — update the `REQUIREMENTS` map at the top of
  `extract.mjs` if a plugin's requirements change.
