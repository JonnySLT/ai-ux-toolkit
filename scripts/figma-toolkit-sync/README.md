# figma-toolkit-sync

Keeps the **[AI UX Toolkit Figma file](https://www.figma.com/design/n4Hh5v0xiIdezIiiP0Hiu5/AI-UX-Toolkit)**
in sync with this repo. **The repo is the source of truth**; the Figma file is a
generated view of it.

When the main README's opening paragraphs, a plugin README, a `SKILL.md`, or the
main README's "What's inside" tables change, this tool regenerates the
data-driven Figma content so the file matches the repo verbatim:

- the Overview page's **intro** — the hero subtitle and the "What it is" card — rewritten from the main README's opening paragraphs (`render.figma.js`, `section: "intro"`),
- the Overview page's **What's inside** index (`render.figma.js`, `section: "whats-inside"`), and
- one **per-plugin page** each — a mini-TOC of the plugin's skills plus its README notes, followed by every `SKILL.md` in full (`render-pages.figma.js`). In "What's inside", skills are grouped under their owning plugin and each plugin label links to its page (skill rows are plain text); on the plugin pages, each mini-TOC entry links to its skill's deep-dive frame.

The **rest** of the curated **Overview** and **Reference** boards is left untouched — only the intro paragraph *text* (in place, curated fonts preserved) and the What's-inside index are regenerated there; the hero title, scaffold, styles, and Reference content stay hand-authored. (Plugin detail content used to live in a "Plugin details" board on the Overview page; it now lives on each plugin's own page, paired with its skills.)

## Why it works the way it does

Figma canvas nodes can only be created through the **Figma Plugin API**, which
runs *inside Figma* (via the Figma MCP `use_figma` tool). The Figma REST API
cannot create nodes. So the sync is **agent-driven**: a scheduled Claude Code
run reads the repo and rewrites Figma through the MCP. It is made deterministic
by two committed artifacts:

| File | Role |
|---|---|
| `extract.mjs` | Parses the READMEs **and every `SKILL.md`** → `toolkit-data.json` (structured source of truth) + a sha256 `fingerprint`. Pure Node, no deps. |
| `render.figma.js` | Renderer for the Overview page, dispatched by `SYNC.section`. `"whats-inside"` rebuilds the **What's inside** index (locates nodes **by name**, clears the Grid, rebuilds every phase card from data); `"intro"` rewrites the **hero subtitle + "What it is" card** from the README's opening paragraphs, changing only each node's characters and preserving its curated font. Passed to `use_figma`. |
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
3. **Rebuild the Overview intro** — one `use_figma` call. Prepend the SYNC
   object, then the full contents of `render.figma.js`:
   ```js
   const SYNC = { section: "intro", data: /* toolkit-data.json .intro */ };
   // …contents of render.figma.js…
   ```
   This rewrites the hero subtitle and the "What it is" card from the README's
   opening paragraphs, changing only each node's text (curated fonts preserved).
4. **Rebuild "What's inside"** — one `use_figma` call. Prepend the SYNC object,
   then the full contents of `render.figma.js`:
   ```js
   const SYNC = { section: "whats-inside", data: /* toolkit-data.json .phases */ };
   // …contents of render.figma.js…
   ```
   This clears the Grid and rebuilds all phase cards, naming each skill row
   `WI · <skill>` so the `link` step (below) can hyperlink it. The board hugs its
   content (auto-layout), so no section refit is needed.
5. **Rebuild the per-plugin pages** with `render-pages.figma.js`. For each plugin
   that actually changed — see [Only rebuild the pages that changed](#only-rebuild-the-pages-that-changed);
   on most syncs that is one or two, not all 24 — split its `.skills` into batches
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
6. **Update the lock.** Write the new `fingerprint` + `lastSyncedAt` into
   `.figma-sync.lock.json`.
7. *(Optional)* Log a one-line entry to the file's Changelog page, mirroring
   `changelog-automation`.

## Only rebuild the pages that changed

Step 5 reads as though every plugin page gets re-rendered. It doesn't have to.

The fingerprint gate in step 2 is all-or-nothing: it tells you *something*
changed, not *what*. But `toolkit-data.json` is committed, so the last-synced
state is one `git show HEAD:` away — diff the two and you have the exact work
list. Adding the `highlight-reels` plugin touched **2** pages, not 24.

Run this from the repo root, after step 1 regenerates the data:

```bash
node -e '
const { execSync } = require("child_process");
const prev = JSON.parse(execSync("git show HEAD:scripts/figma-toolkit-sync/toolkit-data.json", { maxBuffer: 1e8 }));
const next = require("./scripts/figma-toolkit-sync/toolkit-data.json");
const was = new Map(prev.plugins.map((p) => [p.name, p]));
const sig = (p) => JSON.stringify([p.readme, p.phase, p.requirements, p.skills.map((s) => [s.name, s.description, s.body])]);
for (const p of next.plugins) {
  const o = was.get(p.name);
  if (!o) console.log("NEW PAGE      " + p.name);
  else if (sig(o) !== sig(p)) console.log("REBUILD PAGE  " + p.name);
}
for (const n of was.keys()) if (!next.plugins.some((p) => p.name === n)) console.log("STALE PAGE    " + n);
const chg = (k) => JSON.stringify(prev[k]) !== JSON.stringify(next[k]);
console.log("intro:", chg("intro"), " whats-inside:", chg("phases"), " pagePlan:", chg("pagePlan"));
'
```

Read the output as the work list:

| Output | Do |
|---|---|
| `NEW PAGE` / `REBUILD PAGE` | Run step 5's `plugin-page` op for those plugins only |
| `STALE PAGE` | Nothing — `organize` removes it |
| `intro: true` | Run step 3 |
| `whats-inside: true` | Run step 4 |
| `pagePlan: true` | Run `organize` |

Run `link` whenever any page was built or reordered — it re-derives everything
from node names, so it is always safe and always cheap.

**A single changed `description` still means rebuilding that plugin's whole
page**, because the description renders inside the skill card. The one case
worth doing by hand is a description-only change on a plugin whose skill bodies
are untouched: locate the card's description TEXT node, load its fonts, and
rewrite `characters` — the result is byte-identical to a re-render, because the
renderer draws that node with the same plain-body styling.

Rebuilding everything is never *wrong* — the renderers are idempotent. It is
just a full clear-and-recreate on pages whose content did not move.

## Scope & guarantees

- **Idempotent.** Re-running with no repo change is a no-op (fingerprint gate).
  Re-running after a change produces the same result regardless of prior state
  (nodes located by name, content cleared and rebuilt).
- **Scaffold assumed.** The Overview page's boards (incl. the What's-inside
  `Grid` and `Workflow ribbon`) and the local text/paint styles must already
  exist (created by the initial build). This tool refreshes *content*; the
  What's-inside Grid and every plugin page are cleared and rebuilt from data.
- **On the Overview page, only the intro paragraphs and the What's inside board**
  are rewritten (the intro in place — text only, curated fonts kept); the rest of
  the curated Overview board and the whole Reference board are never overwritten.
  The per-plugin pages (and phase-divider pages) are fully managed — tagged and
  safe to rebuild.

## Editing checklist for maintainers

- Changed the main README's **opening paragraphs** (hero subtitle / "What it is"
  card)? The intro sync rewrites those Figma nodes to match — no manual Figma
  edit needed. Keep them to a hero paragraph followed by the card paragraphs, in
  the order they should read on the Overview page.
- Changed a plugin's skills or copy? Just edit its `README.md` — the sync picks
  it up.
- Added/removed a plugin, or moved a skill between phases? Edit the plugin
  `README.md` **and** the main README's "What's inside" table (as you already do
  per the root README's maintenance rules); the sync reflects both.
- Requirement chips (Figma MCP / Browser / Codebase) are the one thing not
  parseable from a single table — update the `REQUIREMENTS` map at the top of
  `extract.mjs` if a plugin's requirements change.
