---
name: annotate
description: Annotate a Figma frame or page with the project's "Annotation" component. Places annotation panels beside the frame, each pointing at a high-level component with a pink dashed connector, and fills in component specs, color & tokens, assets & icons, and dev handoff notes. Trigger when the user says "annotate this frame/page", "add annotations", "document this screen", or shares a Figma URL asking for annotations.
---

Annotate a Figma frame using the **Annotation** component from **this project's own design system** — whether that DS is embedded in the file itself or attached as a **linked/enabled library**. The goal is a clean, scannable set of annotation panels that document the **high-level** components on a screen for both designers and developers.

> **Use this project's own design system — never an *unrelated* one.** Resolve the `Annotation` component, tokens/variables, and changelog from **this project's DS**: first the current file, then the design-system **library the file has linked/enabled** (the same DS the frame's own components and tokens already resolve to). What you must **not** do is pull an `Annotation` component or tokens from some *other, unrelated* project's file. A linked library that **is** this project's design system is not "another file" in that sense — instancing its `Annotation` component via `importComponentSetByKeyAsync` is correct.

## Before you start

- **Always load the `figma:figma-use` skill before any `use_figma` call.**
- **Resolve the `Annotation` component in this order** (discover dynamically; don't hardcode IDs):
  1. **Local** — a `COMPONENT_SET` named `Annotation` (or a `COMPONENT` whose name starts with `Direction=`) **in the current file** (often on an `Annotations` page). Prefer this when the DS is embedded in the file.
  2. **Linked library** — if there's no local one, find `Annotation` in the design-system **library the file has linked/enabled** — the same library the frame's own components and tokens come from. Search it (e.g. `search_design_system` for "Annotation"), then instance it with `importComponentSetByKeyAsync(<key>)`. This is the project's DS delivered as a shared library; using it is correct.
  3. **Neither exists** — stop and tell the user; offer to build a local `Annotation` component in this file, bound to this project's own variables/styles. Only proceed once one exists.
- **Match the component you actually resolved.** The content steps below assume a specific internal structure (named text nodes in a known order, `Swatch` ×4). If the resolved `Annotation` differs, **inspect its real text nodes and swatches first** and map content to those — don't blindly fill by index.
- It has two variant properties:
  - **`Direction`** = `Left` | `Right`
    - `Direction=Left` — connector (pink dashed line + dot) on the **left** edge → panel sits to the **right** of the page.
    - `Direction=Right` — connector mirrored to the **right** edge → panel sits to the **left** of the page.
  - **`Line`** = `Top` | `Center` | `Bottom` — vertical position of the dashed connector line within the panel.
    - Use it to point the connector at a target whose vertical center is **not** the panel's center, so a panel can be placed where it fits while still pointing accurately. `Top` → line near the panel top; `Bottom` → near the bottom; `Center` → middle (default).
  - Set both via `inst.setProperties({ Direction: 'Right', Line: 'Top' })`.
- Each panel is a compact **2-column** layout, ~**480px wide × ~320px tall**. The wrapper adds an ~80px connector, so an instance is ~**560px wide**. With `Line=Center` the connector is centered vertically; `Line=Top`/`Bottom` move it near the respective edge.

## Process

### Step 1 — Resolve the target

Extract `fileKey` and `nodeId` from the Figma URL (`node-id=2316-1430` → `2316:1430`). Find the frame and record its bounds.

**Use `frame.absoluteBoundingBox` for position, not `frame.x`/`frame.y`.** The frame is often nested inside a Section or container, so its `.x`/`.y` are relative to that parent — but annotation instances are appended at **page level**, where coordinates are absolute. Positioning with relative `.x` will place the instances in the wrong spot. Always position instances against `absoluteBoundingBox.{x,y,width,height}`.

### Step 2 — Identify high-level components

Inspect the frame's **top 1–2 levels** of children. Pick only **high-level components/sections** — e.g. a sidebar/navbar, a toolbar/page header, a KPI/stat-card row, a chart card, an alert/list card. **Do NOT annotate every element** (no individual buttons, rows, icons, text nodes).

Aim for the number that fits (see Step 4). Note each target's vertical center so connectors point at the right band.

### Step 3 — Decide side(s) and count

- **Default:** place annotations to the **right** of the page using `Direction=Left`.
- If the page is dense and needs more annotations than one side holds, use **both sides** — `Direction=Right` instances to the **left** of the page for left-edge components (e.g. the sidebar).
- **Hard rule:** the stacked annotations on a given side must **never be vertically taller than the referenced frame**. With ~306px panels, a ~1032px frame fits about **3 per side**. If more are needed than fit, use both sides or tell the user you've capped it — never overflow the frame.

### Step 4 — Place the instances

For each side, create instances and stack them **centered within the frame's vertical extent**, with even gaps and no overlap:

```js
const panelH = inst.height;            // ~306
const gap = 30;
const stackH = count * panelH + (count - 1) * gap;
const startY = frameTop + Math.max(0, (frameH - stackH) / 2);
// instance i: y = Math.round(startY + i * (panelH + gap))
```

- Positions are **absolute** (instances are page-level). Use `absoluteBoundingBox`: `frameLeft = fb.x`, `frameRight = fb.x + fb.width`, `frameTop = fb.y`.
- **Keep a 32px gap between the annotation card (panel) and the frame**, measured panel edge to frame edge. Right-side panels: panel's left edge at `frameRight + 32`. Left-side panels (`Direction=Right`, set via `inst.setProperties({ Direction: 'Right' })`): panel's right edge at `frameLeft − 32`. The dashed connector then **stretches across the 32px gap** so its anchor dot still lands on the target component (see the extend functions below). This 32px gap is the standard for every annotation.
- **Pointing accuracy via `Line`:** the connector sits at the panel's vertical center by default. If a target's vertical center differs from where the panel must sit, set `Line` to `Top` or `Bottom` so the connector reaches the target without moving the panel. This also lets you pack panels tighter when targets are close together.
- Name instances meaningfully, e.g. `Annotation/Toolbar`, `Annotation/Sidebar`.

#### Extending the dashed line OVER the frame (point at the exact element)

The connector is a **FILL-width** child and the panel is **FIXED** (panel `480`, base instance width `560`). To make the line reach across/over the frame onto a specific element, **resize the top-level instance wider** — the FILL connector absorbs the extra width and the dashed line stretches (the anchor dot stays pinned to the outer end). The panel stays beside the frame.

> ⚠️ **Do not** try to override the connector frame width or move/resize the line/dot inside the instance — Figma blocks geometry overrides on instance sublayers (`"cannot be overridden in an instance"`). Only resizing the **top-level instance** works.

The annotation must render **above** the frame so the line draws over it — `page.appendChild(inst)` after positioning (it's a page-level sibling, never parented into the frame).

Compute the target X from the element's `absoluteBoundingBox` (its near edge or center, whichever reads best). `BASE_W = 560`.

```js
// Direction=Left (connector on the left): panel stays 32px off the frame's RIGHT edge
function extendLeft(inst, targetX, frameRight) {
  inst.resize(BASE_W, inst.height);
  inst.x = Math.round(frameRight + 32);
  const growth = Math.round((frameRight + 32) - targetX); // targetX is further left → positive
  inst.resize(BASE_W + growth, inst.height);              // FILL connector absorbs it
  inst.x = inst.x - growth;                                // shift left: anchor lands on target, panel stays 32px off
}

// Direction=Right (connector on the right): panel stays 32px off the frame's LEFT edge
function extendRight(inst, targetX, frameLeft) {
  inst.resize(BASE_W, inst.height);
  inst.x = Math.round(frameLeft - BASE_W - 32);
  const growth = Math.round(targetX - (inst.x + inst.width)); // targetX further right → positive
  inst.resize(BASE_W + growth, inst.height);                  // grows rightward; panel stays at inst.x
}
```

#### Elbow connector for vertically-offset targets (pixel-perfect pointing)

A straight extension only points along the panel's row. When the target's vertical center is **offset** from where the line sits, draw an **elbow** (horizontal → vertical bend) for exact pointing.

**Auto-select which connector to use, per annotation:**
1. Compute the line's Y for this panel: `lineY` ≈ panel's vertical center, or near its top/bottom if `Line` is set.
2. If `abs(targetCenterY − lineY)` is small (target is on the panel's row, say ≤ ~24px) → use **straight extension** (`extendLeft`/`extendRight` above).
3. Otherwise → use the **elbow**.

**Drawing the elbow:**
- Reset the instance to base width and place it beside the frame (panel beside the frame edge). Do **not** extend the FILL connector.
- **Hide the built-in straight connector** via visibility override (allowed): set `visible = false` on the connector's `DashLine`, `AnchorDot`, and `Terminator`.
- Compute three absolute points and draw a dashed vector polyline + anchor dot:
  - `S` = panel's connector-side edge, at the line's Y. (Direction=Left → panel left edge; Direction=Right → panel right edge.)
  - `T` = the target element point (from its `absoluteBoundingBox`).
  - `C` = corner = `{ x: T.x, y: S.y }` (horizontal out from the panel, then vertical to the target).

```js
const pink = { r:0.925, g:0.286, b:0.600 };
const originX = Math.min(S.x, C.x, T.x), originY = Math.min(S.y, C.y, T.y);
const L = p => `${p.x - originX} ${p.y - originY}`;
const elbow = figma.createVector();
elbow.name = 'ElbowConnector/<name>';
elbow.vectorPaths = [{ windingRule: 'NONE', data: `M ${L(S)} L ${L(C)} L ${L(T)}` }];
elbow.strokes = [{ type:'SOLID', color: pink }];
elbow.strokeWeight = 1.5;
elbow.dashPattern = [4, 3];
elbow.fills = [];
page.appendChild(elbow);
elbow.x = originX; elbow.y = originY;       // set position AFTER vectorPaths

const dot = figma.createEllipse();
dot.name = 'ElbowAnchorDot';
dot.resize(8, 8);
dot.fills = [{ type:'SOLID', color: pink }];
dot.strokes = [{ type:'SOLID', color: {r:1,g:1,b:1} }]; dot.strokeWeight = 2;
page.appendChild(dot);
dot.x = T.x - 4; dot.y = T.y - 4;

page.appendChild(elbow); page.appendChild(dot); // above the frame
```

- The elbow is a **page-level sibling** drawn by the skill — it does not move with the panel. Name elbow nodes `ElbowConnector/<name>` + `ElbowAnchorDot` so they can be found and cleaned up.
- **Capturing screenshots:** never `figma.group`/`ungroup` the frame with instances to screenshot — it deletes the page-level instances. Instead use `frame.screenshot({ contentsOnly: false })` (includes overlapping siblings; crops to frame bounds), or a temporary **transparent frame** (no children → safe to delete) sized over the region, screenshotted with `contentsOnly:false`.

**Auto-extend / point (default behavior):** for every annotation, connect it to the high-level element it documents — straight extension when on-row, elbow when vertically offset — so the anchor dot lands on the element. Keep connectors purposeful; don't overshoot across unrelated content.

### Step 5 — Customize each panel's content

Each instance has editable text nodes. Override them via name-based lookups (robust) or `findAll(TEXT)` order (the order below is stable):

| # | Node (parent) | Set to |
|---|---|---|
| 0 | `ComponentName` (Header) | Component name, e.g. "Chart Card" |
| 1 | TypeBadge text | `COMPONENT` or `SECTION` |
| 4 | `Value` (Row/Variant) | Variant description |
| 6 | `Value` (Row/State) | State |
| 8 | `Value` (Row/Props) | Props, e.g. `legend=true, tabs=true` |
| 10 | `Value` (Row/Interactive states) | Interactive states |
| 12,13 | TokenName / Usage (1) | Token + usage |
| 14,15 | TokenName / Usage (2) | Token + usage |
| 16,17 | TokenName / Usage (3) | Token + usage |
| 18,19 | TokenName / Usage (4) | Token + usage |
| 22,23 | IconName / IconMeta (1) | Icon name + `SVG · <context>` |
| 25,26 | IconName / IconMeta (2) | Icon name + `SVG · <context>` |
| 28 | `Code` | Code snippet, e.g. `<ChartCard series={2} />` |
| 29,30,31 | `Note` ×3 | Dev handoff notes |

Keep section labels (`COMPONENT SPECS`, `COLOR & TOKENS`, `ASSETS & ICONS`, `DEV HANDOFF`) and the spec keys (`Variant`, `State`, `Props`, `Interactive states`) unchanged.

**Also update the token swatches** to match the token colors you wrote. Find nodes named `Swatch` (4, in order) and set their `fills`. Use **real tokens from the current file's design system** — discover the file's own variables (e.g. `getLocalVariablesAsync`) and bind the swatch fill to the matching variable rather than hardcoding hex. The token names you write in the rows must be ones that actually exist in this project's variable collections.

**Font loading:** load `Inter` (Regular, Medium, Semi Bold) and `JetBrains Mono` (Regular) before setting text. Load each node's own `fontName` before assigning `characters`.

### Step 6 — Verify

Screenshot to confirm: panels don't overlap, the stack fits within the frame height, connectors point at the right components, and content reads cleanly. **Never `group`/`ungroup` the frame with the instances** (it deletes the page-level instances). Use `frame.screenshot({ contentsOnly: false })`, or a temporary transparent frame (no children → safe to delete) sized over the whole region and screenshotted with `contentsOnly:false`. Fix any overlap or off-target pointing before finishing.

### Step 7 — Log to the changelog (if the project keeps one)

If the project has changelog conventions (e.g. in its `CLAUDE.md`) and a Changelog page in the file, add a new entry following **that project's** rules, tagged `DOCUMENTATION`, describing which frame was annotated and which high-level components were covered. **Discover the changelog entries frame dynamically** (find the `Changelog` page and its entries/auto-layout container) — never hardcode a node ID, since it differs per file. If the project has no changelog convention, skip this step.

## Content guidance

Make annotations genuinely useful for handoff — token names over hex, real component prop signatures, icon names from the DS, and notes a developer needs (debounce timing, which DS component a slot uses, accessibility constraints, data dependencies). Be specific to the component each panel points at; never leave the default "Component Name / Button" placeholder text.
