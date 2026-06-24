---
name: reattach
description: Audit a selected Figma frame and reattach all raw values — color variables on fills/strokes, text styles, and component instances. Replaces raw frames that match existing components with proper instances, preserving positions and text. Runs three audit passes to verify completeness. Works on any Figma file — all variable collections, mode IDs, component IDs, icon names, and token naming conventions are discovered dynamically at runtime. Trigger when the user says "reattach", "reconnect design system", "attach variables/styles/components", or wants to clean up a raw/detached frame.
---

# Reattach Skill

Reattaches all raw design system values on a selected Figma frame. **Fully file-agnostic** — discovers all variable collections, components, icon names, and token structures at runtime. Never hardcodes IDs, names, or conventions.

1. **Color variables** — dynamically resolves collections and binds fills/strokes
2. **Text styles** — matches by font size + family + weight + decoration
3. **Component instances** — discovers all components and swaps matching raw frames
4. **Verification** — three audit passes confirm completeness

Always load `figma-use` before calling `use_figma`.

---

## Process

### Step 0 — Load figma-use skill
Invoke the `figma-use` skill before any `use_figma` call.

### Step 1 — Identify the target node
Extract `fileKey` and `nodeId` from the Figma URL (`node-id=2126-1922` → `2126:1922`).

### Step 2 — Audit Pass 1 + capture container data (read-only)
Single script that:
- Finds the page containing the target node
- Counts raw fills, strokes, text nodes, and raw frames
- Detects any "container" raw frames (frames that contain 3+ repeating child instances of the same component set — e.g. a Navbar with Nav Items, a TabBar with Tabs) and captures their child data **before** any changes
- Returns structured audit report

Report findings to the user before proceeding.

---

### Step 3 — Build variable RGB map (dynamic)
Discover all variable collections dynamically — no hardcoded mode IDs or collection names:

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const varById = {};
for (const v of allVars) varById[v.id] = v;

// Prefer mode named "Light", "Default", or "Value"; else first mode
function getBestModeId(coll) {
  const pref = ['light','default','value'];
  for (const p of pref) {
    const m = coll.modes.find(m => m.name.toLowerCase() === p);
    if (m) return m.modeId;
  }
  return coll.modes[0]?.modeId;
}

// Semantic = mostly aliases; primitive = direct color values
function classifyCollection(coll) {
  const modeId = getBestModeId(coll);
  const vars = coll.variableIds.map(id => varById[id]).filter(Boolean);
  const aliases = vars.filter(v => v.valuesByMode[modeId]?.type === 'VARIABLE_ALIAS').length;
  return aliases > vars.length / 2 ? 'semantic' : 'primitive';
}

// Resolve alias chain to final RGB
function resolveRGB(varId) {
  const v = varById[varId]; if (!v) return null;
  const coll = collections.find(c => c.id === v.variableCollectionId);
  let val = v.valuesByMode[getBestModeId(coll)];
  let depth = 0;
  while (val?.type === 'VARIABLE_ALIAS' && depth < 8) {
    const alias = varById[val.id]; if (!alias) break;
    const ac = collections.find(c => c.id === alias.variableCollectionId);
    val = alias.valuesByMode[getBestModeId(ac)]; depth++;
  }
  return val?.r !== undefined ? { r: Math.round(val.r*255), g: Math.round(val.g*255), b: Math.round(val.b*255) } : null;
}

// Build RGB → variableId map (semantic collections preferred over primitive)
const collPriority = {};
collections.forEach((coll, i) => { collPriority[coll.id] = classifyCollection(coll) === 'semantic' ? i : i + 1000; });

const rgbMap = {};
for (const v of allVars) {
  if (v.resolvedType !== 'COLOR') continue;
  const rgb = resolveRGB(v.id); if (!rgb) continue;
  const key = `${rgb.r},${rgb.g},${rgb.b}`;
  const ep = collPriority[varById[rgbMap[key]]?.variableCollectionId] ?? Infinity;
  if (!rgbMap[key] || collPriority[v.variableCollectionId] < ep) rgbMap[key] = v.id;
}

// Nearest-color fallback (≤ 15 Euclidean distance)
function nearestVar(r, g, b) {
  let bestId = null, bestDist = Infinity;
  for (const [key, varId] of Object.entries(rgbMap)) {
    const [kr, kg, kb] = key.split(',').map(Number);
    const d = Math.sqrt((r-kr)**2 + (g-kg)**2 + (b-kb)**2);
    if (d < bestDist) { bestDist = d; bestId = varId; }
  }
  return bestDist <= 15 ? bestId : null;
}
```

Also build a **semantic category map** by resolving each variable's RGB and classifying it — used later for variant scoring without relying on token name strings:

```js
// Compute file's primary/brand color: the most chromatic (saturated) color in semantic vars
// Used to identify "primary fill" nodes without relying on token names
function rgbToHSL(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), l = (max+min)/2;
  if (max === min) return { h:0, s:0, l };
  const d = max - min, s = l > 0.5 ? d/(2-max-min) : d/(max+min);
  let h = max===r ? (g-b)/d+(g<b?6:0) : max===g ? (b-r)/d+2 : (r-g)/d+4;
  return { h: h/6, s, l };
}

// Find the file's primary (most saturated) and neutral (least saturated) color pairs
let primaryRGB = null, maxSaturation = 0;
for (const [key, varId] of Object.entries(rgbMap)) {
  const [r,g,b] = key.split(',').map(Number);
  const { s } = rgbToHSL(r,g,b);
  if (s > maxSaturation) { maxSaturation = s; primaryRGB = {r,g,b}; }
}

function isBrandColor(r, g, b, threshold = 60) {
  if (!primaryRGB) return false;
  return Math.sqrt((r-primaryRGB.r)**2+(g-primaryRGB.g)**2+(b-primaryRGB.b)**2) < threshold;
}
function isNeutralColor(r, g, b) {
  const { s } = rgbToHSL(r,g,b); return s < 0.15;
}
```

---

### Step 4 — Bind color variables
For each node: bind unmatched SOLID fills and strokes via `rgbMap`, then `nearestVar`. Always reassign the array (never mutate in place).

---

### Step 5 — Apply text styles
```js
const textStyles = await figma.getLocalTextStylesAsync();
const textStyleMap = {};
for (const ts of textStyles) {
  // Include text decoration in key to distinguish e.g. Label/Large vs Label/Large Underline
  const dec = /underline/i.test(ts.name) ? 'UNDERLINE' : /strikethrough/i.test(ts.name) ? 'STRIKETHROUGH' : 'NONE';
  textStyleMap[`${ts.fontSize}-${ts.fontName.family}-${ts.fontName.style}-${dec}`] = ts.id;
}
// On each TEXT node — use node.textDecoration (not style name) as the key
const dec = node.textDecoration || 'NONE';
const styleId = textStyleMap[`${node.fontSize}-${node.fontName.family}-${node.fontName.style}-${dec}`];
if (styleId) { await figma.loadFontAsync(node.fontName); node.textStyleId = styleId; }
```

---

### Step 6 — Discover all components (dynamic)
Scan every page and build a normalized name → variant list map:

```js
const componentsByNorm = {};
function parseVariantProps(name) {
  const props = {};
  name.split(',').forEach(part => {
    const [k,v] = part.split('=').map(s => s.trim().toLowerCase());
    if (k && v) props[k] = v;
  });
  return props;
}

for (const page of figma.root.children) {
  await figma.setCurrentPageAsync(page);
  page.findAll(n => {
    if (n.type === 'COMPONENT') {
      const setName = n.parent?.type === 'COMPONENT_SET' ? n.parent.name : n.name;
      const norm = setName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!componentsByNorm[norm]) componentsByNorm[norm] = [];
      componentsByNorm[norm].push({ id: n.id, name: n.name, setName, props: parseVariantProps(n.name) });
    }
    return false;
  });
}
// Switch back to target page
for (const p of figma.root.children) { await figma.setCurrentPageAsync(p); if (figma.getNodeById(TARGET)) break; }

// Also discover icon components: components on pages named "Icon" / "Icons" / "Iconography"
// Build an icon name → component map for icon restoration
const iconsByNorm = {};
for (const page of figma.root.children) {
  if (!/icon/i.test(page.name)) continue;
  await figma.setCurrentPageAsync(page);
  page.findAll(n => {
    if (n.type === 'COMPONENT') {
      iconsByNorm[n.name.toLowerCase().replace(/[^a-z0-9]/g, '')] = n.id;
      // Also index by common synonyms
      const lower = n.name.toLowerCase();
      if (/magnif|search/i.test(lower))  iconsByNorm['__search__']  = n.id;
      if (/chevron.*down|arrow.*down/i.test(lower)) iconsByNorm['__chevrondown__'] = n.id;
      if (/close|xmark|dismiss/i.test(lower)) iconsByNorm['__close__'] = n.id;
      if (/gear|setting|cog/i.test(lower)) iconsByNorm['__settings__'] = n.id;
      if (/bell|notif/i.test(lower)) iconsByNorm['__bell__'] = n.id;
      if (/user|person|account/i.test(lower)) iconsByNorm['__user__'] = n.id;
    }
    return false;
  });
}
for (const p of figma.root.children) { await figma.setCurrentPageAsync(p); if (figma.getNodeById(TARGET)) break; }
```

---

### Step 7 — Match raw frames to components (dynamic)
Build a **dynamic alias map** by inspecting the file — look for raw frames whose name doesn't exactly match a component, then find the best structural match by comparing child count and child names:

```js
// Dynamic alias: if a raw frame has no exact match, check if any component's default instance
// has a similar child structure (same child count, overlapping child names)
function findMatchingComponent(rawNode) {
  const norm = rawNode.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (norm.length < 3) return null; // too short — skip entirely

  // 1. Exact normalized match
  if (componentsByNorm[norm]) return componentsByNorm[norm];

  // 2. Prefix match — both key and node name must be ≥ 4 chars
  if (norm.length >= 4) {
    for (const [key, comps] of Object.entries(componentsByNorm)) {
      if (key.length < 4) continue;
      if (norm.startsWith(key) || key.startsWith(norm)) return comps;
    }
  }

  // 3. Structural alias: if the raw frame's normalized name contains a known component name
  //    as a substring and dimensions/children roughly match, use it
  for (const [key, comps] of Object.entries(componentsByNorm)) {
    if (key.length < 4) continue;
    if (norm.includes(key) || key.includes(norm)) return comps;
  }

  return null;
}
```

**False positive guards — check BEFORE swapping:**
```js
function isSafeToSwap(rawNode, isContainer = false) {
  if (!('children' in rawNode)) return true;
  // Container components (Navbars, TabBars, etc.) with repeating child instances are always safe
  // — they have many children by design. Only block non-container frames with too many children.
  if (!isContainer && rawNode.children.length > 6) return false;
  // Frames with slash names containing chart/data/layout content are custom containers
  if (rawNode.name.includes('/')) {
    const childNames = rawNode.children.map(c => c.name.toLowerCase());
    const looksCustom = childNames.some(n =>
      ['chart','area','row','section','list','grid','legend','bar','line','axis'].some(kw => n.includes(kw))
    );
    if (looksCustom) return false;
  }
  // Single-character text-only frames are custom decorative elements (e.g. PlusIcon with "+" text)
  // — not icon component wrappers
  if (rawNode.children.length === 1 && rawNode.children[0].type === 'TEXT') {
    const chars = rawNode.children[0].characters?.trim();
    if (chars && chars.length <= 2) return false;
  }
  return true;
}
```

---

### Step 8 — Select best variant (dynamic, file-agnostic)
Score variants using **structural signals** (fill presence/color, dimensions, text content) rather than token name strings:

```js
function selectBestVariant(variants, rawNode) {
  const fill = rawNode.fills?.[0];
  const fillRGB = fill?.type === 'SOLID' ? {
    r: Math.round(fill.color.r*255),
    g: Math.round(fill.color.g*255),
    b: Math.round(fill.color.b*255)
  } : null;

  // Use structural color classification (built in Step 3) — not token name strings
  const fillIsBrand   = fillRGB ? isBrandColor(fillRGB.r, fillRGB.g, fillRGB.b) : false;
  const fillIsNeutral = fillRGB ? isNeutralColor(fillRGB.r, fillRGB.g, fillRGB.b) : false;
  const fillIsLight   = fillRGB ? rgbToHSL(fillRGB.r, fillRGB.g, fillRGB.b).l > 0.85 : false;
  const hasFill       = rawNode.fills?.some(f => f.type === 'SOLID' && (f.opacity ?? 1) > 0);

  const h = Math.round(rawNode.height);
  const firstText = rawNode.findOne?.(n => n.type === 'TEXT' && n.characters?.trim())?.characters?.trim() || '';

  const desired = { state: 'default', enabled: 'enabled' };

  // Size — from height
  if      (h <= 28) desired.size = 'small';
  else if (h <= 40) desired.size = 'medium';
  else if (h <= 52) desired.size = 'large';

  // Style — from fill color structure
  if      (fillIsBrand && !fillIsLight) desired.style = 'primary';
  else if (fillIsNeutral || fillIsLight) desired.style = 'secondary';
  else if (!hasFill)                    desired.style = 'ghost';

  // Badge/status — from fill color
  if (fillRGB) {
    const { h: hue, s } = rgbToHSL(fillRGB.r, fillRGB.g, fillRGB.b);
    if (s > 0.3) {
      if      (hue >= 0.25 && hue <= 0.45) desired.style = 'success'; // green range
      else if (hue >= 0.08 && hue <= 0.18) desired.style = 'warning'; // amber range
      else if (hue >= 0.93 || hue <= 0.05) desired.style = 'error';   // red range
    }
  }

  // Toggle — brand fill = on, neutral/light = off
  if (fillIsBrand)           desired.state = 'on';
  else if (fillIsNeutral || fillIsLight) desired.state = 'off';

  // Select/Input — has text content → filled state
  if (firstText && /select|dropdown|combobox/i.test(rawNode.name)) desired.state = 'filled';

  // Avatar — 1–2 uppercase chars = initials
  if (/^[A-Z]{1,2}$/.test(firstText)) desired.type = 'initials';

  // Tab — default to inactive
  if (rawNode.name.toLowerCase() === 'tab') desired.state = 'inactive';

  const score = v => {
    let s = 0;
    if (desired.state && v.props.state === desired.state) s += 4;
    else if (v.props.state === 'default') s += 1;
    if (desired.style && v.props.style === desired.style) s += 3;
    if (desired.size  && v.props.size  === desired.size)  s += 2;
    if (desired.type  && v.props.type  === desired.type)  s += 3;
    if (v.props.enabled === 'enabled' || !v.props.enabled) s += 1;
    return s;
  };

  return variants.slice().sort((a, b) => score(b) - score(a))[0];
}
```

---

### Step 9 — Swap frames to instances
Process deepest nodes first. For each candidate that passes `isSafeToSwap`:

```js
// Capture before removal
const { x, y, width, height, name } = rawNode;
const textMap = {};
rawNode.findAll(n => n.type === 'TEXT').forEach(t => { textMap[t.name] = t.characters; });
const visMap = {};
if ('children' in rawNode) rawNode.children.forEach(c => { visMap[c.name] = c.visible; });

// Capture icon instances by name → their mainComponent.id
const iconMap = {};
rawNode.findAll(n => n.type === 'INSTANCE' && /icon/i.test(n.name)).forEach(ic => {
  iconMap[ic.name] = ic.mainComponent?.id;
});

// Detect if this is a container (Navbar, TabBar, etc.) with repeating child instances
const containerMap = detectContainerChildren(rawNode);

const best = selectBestVariant(candidates, rawNode);
const comp = await getComp(best.id);
const inst = comp.createInstance();
inst.name = name;
parent.insertChild(index, inst);
inst.x = x; inst.y = y;
inst.resizeWithoutConstraints(width, height);

// Restore visibility
if ('children' in inst) inst.children.forEach(c => { if (visMap[c.name] !== undefined) c.visible = visMap[c.name]; });

// Restore icons — use captured mainComponent.id; fall back to semantic lookup in iconsByNorm
for (const iconInst of inst.findAll(n => n.type === 'INSTANCE' && /icon/i.test(n.name))) {
  let targetCompId = iconMap[iconInst.name]; // exact match from original
  if (!targetCompId) {
    // Semantic fallback: infer icon type from parent component name
    const parentName = rawNode.name.toLowerCase();
    if (/input|search/i.test(parentName))   targetCompId = iconsByNorm['__search__'];
    else if (/select|dropdown/i.test(parentName)) targetCompId = iconsByNorm['__chevrondown__'];
    else if (/close|dismiss/i.test(parentName))   targetCompId = iconsByNorm['__close__'];
    else if (/setting|gear/i.test(parentName))    targetCompId = iconsByNorm['__settings__'];
  }
  if (targetCompId) {
    const ic = await getComp(targetCompId);
    if (ic) iconInst.swapComponent(ic);
  }
}

// Restore container children (dynamic — any repeating child instances)
if (containerMap) {
  for (const child of inst.findAll(n => n.type === 'INSTANCE')) {
    const config = containerMap[child.name]; if (!config) continue;
    if (config.selectedVariantId) {
      const sc = await getComp(config.selectedVariantId); if (sc) child.swapComponent(sc);
    }
    for (const t of child.findAll(n => n.type === 'TEXT')) {
      const val = config.labels[t.name];
      if (val !== undefined && t.fontName !== figma.mixed) {
        try { await figma.loadFontAsync(t.fontName); t.characters = val; } catch(e) {}
      }
    }
  }
}

// Restore top-level texts + email fallback
for (const t of inst.findAll(n => n.type === 'TEXT')) {
  let p = t.parent; let insideChild = false;
  while (p && p.id !== inst.id) { if (p.type === 'INSTANCE') { insideChild = true; break; } p = p.parent; }
  if (insideChild || t.fontName === figma.mixed) continue;
  if (textMap[t.name] !== undefined) {
    try { await figma.loadFontAsync(t.fontName); t.characters = textMap[t.name]; } catch(e) {}
  } else if (t.characters?.includes('@')) {
    // Email nodes are often named after their default value (e.g. "john@example.com")
    const emailVal = Object.values(textMap).find(v => typeof v === 'string' && v.includes('@'));
    if (emailVal) { try { await figma.loadFontAsync(t.fontName); t.characters = emailVal; } catch(e) {} }
  }
}

rawNode.remove();
```

---

### Step 10 — Detect container children (dynamic)
Handles any component containing repeating child instances — no assumed component names:

```js
function detectContainerChildren(rawFrame) {
  if (!('findAll' in rawFrame)) return null;
  const childInsts = rawFrame.findAll(n => n.type === 'INSTANCE');
  if (childInsts.length < 3) return null;

  // Group by component set name
  const bySet = {};
  for (const inst of childInsts) {
    const setName = inst.mainComponent?.parent?.name || inst.mainComponent?.name;
    if (!setName) continue;
    if (!bySet[setName]) bySet[setName] = [];
    bySet[setName].push(inst);
  }
  const dominant = Object.values(bySet).sort((a,b) => b.length - a.length)[0];
  if (!dominant || dominant.length < 3) return null;

  const map = {};
  for (const inst of dominant) {
    const labels = {};
    inst.findAll(n => n.type === 'TEXT').forEach(t => { labels[t.name] = t.characters; });

    // Detect active/selected: fill color differs from siblings AND is chromatic (brand color)
    let selectedVariantId = null;
    const fill = inst.fills?.[0];
    const fillRGB = fill?.type === 'SOLID' ? {
      r: Math.round(fill.color.r*255), g: Math.round(fill.color.g*255), b: Math.round(fill.color.b*255)
    } : null;
    if (fillRGB && isBrandColor(fillRGB.r, fillRGB.g, fillRGB.b)) {
      // Find active/selected variant in this component set
      const setId = inst.mainComponent?.parent?.id;
      if (setId) {
        const setNode = figma.getNodeById(setId);
        const sv = setNode?.children?.find(c =>
          c.type === 'COMPONENT' && /selected|active|on/i.test(c.name) && !/hover|disabled/i.test(c.name)
        );
        selectedVariantId = sv?.id || null;
      }
    }
    map[inst.name] = { labels, selectedVariantId };
  }

  // Capture top-level texts (outside child instances — e.g. email, user name)
  rawFrame.findAll(n => n.type === 'TEXT').forEach(t => {
    let p = t.parent; let inside = false;
    while (p && p.id !== rawFrame.id) { if (p.type === 'INSTANCE') { inside = true; break; } p = p.parent; }
    if (!inside) for (const config of Object.values(map)) config.labels[`__top__${t.name}`] = t.characters;
  });

  return map;
}
```

---

### Step 11 — Audit Passes 2 and 3
Re-run raw-count checks. Pass 3 checks:
- Detached instances (`mainComponent === null`)
- TEXT nodes with unbound SOLID fills
- Remaining raw frames whose normalized name fuzzy-matches any discovered component

Report final before/after table.

---

## Key rules

- **Never hardcode IDs, names, mode IDs, or token names** — discover everything at runtime
- **Page context resets between calls** — always loop `figma.root.children` and `await figma.setCurrentPageAsync(page)` at the start of every script
- **Semantic color detection uses HSL, not token names** — `isBrandColor` / `isNeutralColor` work in any file regardless of what the tokens are called
- **Icon discovery at runtime** — scan pages named "Icon"/"Icons"/"Iconography" and index by semantic synonym (`__search__`, `__chevrondown__`, etc.) — no hardcoded icon names
- **Container detection is purely structural** — 3+ instances of the same component set → container pattern; works for Navbars, TabBars, ListGroups, anything
- **Active child detection uses fill chromaticity** — a child whose fill is a brand/saturated color is active; no reliance on variable name strings
- **Nearest-color fallback** — threshold ≤ 15 Euclidean distance; increase to 25 for files without fine-grained palettes
- **Text decoration in style keys** — `node.textDecoration` prevents Label/Large vs Label/Large Underline collisions
- **Email node name fallback** — component defaults name email nodes after their content; use `characters.includes('@')` match
- **Always restore dimensions** — `resizeWithoutConstraints(width, height)` after every swap
- **Deep-first swaps** — process deepest nodes first to avoid parent removal invalidating child IDs
- **Font loading** — `await figma.loadFontAsync(node.fontName)` before any text change
- **`setBoundVariableForPaint` returns a new paint** — always capture and reassign the array
- **Custom content containers** — frames with `/` in name + chart/layout children (>6 kids, or child names containing chart/area/row/grid) must NOT be swapped; skip and flag
- **When transplanting children back into a wrongly-swapped frame** — also copy `paddingTop/Bottom/Left/Right`, `itemSpacing`, `primaryAxisSizingMode` from the source frame to avoid inherited spacing from the generic component
