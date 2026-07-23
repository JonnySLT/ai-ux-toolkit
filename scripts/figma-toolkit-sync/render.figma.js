/**
 * render.figma.js — Figma Plugin API renderer for the toolkit sync.
 *
 * This is NOT run with node. Its body is passed as the `code` argument to the
 * Figma MCP `use_figma` tool, with a `SYNC` object prepended by the caller:
 *
 *   const SYNC = { section: "whats-inside", data: <phases[]> };
 *   // …contents of this file…
 *
 * or, for the (batched) plugin cards:
 *
 *   const SYNC = { section: "plugin-details", data: <plugins slice>, clear: true };
 *   // …contents of this file…
 *
 * It is idempotent: it locates the target Figma nodes BY NAME (never by
 * hardcoded id), clears the data-driven content, and rebuilds it from `SYNC.data`
 * (a slice of toolkit-data.json). The scaffold — boards, sections, styles, phase
 * cards, colored headers — is assumed to already exist (created by the initial
 * build). Presentation-only config that is not in the repo (phase colors, chip
 * palette) lives here, in the sync tool, on purpose.
 */

// ---- presentation config (NOT repo content — lives with the sync tool) ------
const PHASE_COLOR = {
  Meta: '#64748B', Research: '#2563EB', 'Define & plan': '#7C3AED', Ideate: '#D97706',
  Structure: '#0D9488', Design: '#DB2777', Content: '#0891B2', Check: '#16A34A',
  Prototype: '#EA580C', 'Handoff & docs': '#4F46E5', 'Measure & iterate': '#E11D48',
};
const REQ_CHIP = {
  'figma-mcp': { text: 'Figma MCP', bg: '#FCE3EC', fg: '#B0195C' },
  browser: { text: 'Browser', bg: '#ECECEF', fg: '#52525B' },
  codebase: { text: 'Codebase', bg: '#ECECEF', fg: '#52525B' },
};
// Colors for any phase NOT in PHASE_COLOR — so a brand-new workflow phase added
// to the repo gets a color deterministically by position, no code edit needed.
const PHASE_FALLBACK = ['#0EA5E9', '#9333EA', '#CA8A04', '#059669', '#DC2626', '#7C3AED', '#0891B2', '#EA580C'];
function phaseColor(name, idx) { return PHASE_COLOR[name] || PHASE_FALLBACK[idx % PHASE_FALLBACK.length]; }
function shortName(name) { return name.split(/[\s&]+/).filter(Boolean)[0] || name; }

// ---- shared helpers ---------------------------------------------------------
function hex(h) { const n = parseInt(h.slice(1), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; }
function mix(h, t) { const c = hex(h); return { r: c.r * t + (1 - t), g: c.g * t + (1 - t), b: c.b * t + (1 - t) }; }
function AL(dir, props) { const f = figma.createAutoLayout(dir, props || {}); f.fills = []; return f; }
const TS = {}, PS = {};
async function loadStyles() {
  for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s.id;
  for (const s of await figma.getLocalPaintStylesAsync()) PS[s.name] = s.id;
}
async function loadFonts() {
  const F = [['Inter', 'Regular'], ['Inter', 'Italic'], ['Inter', 'Medium'], ['Inter', 'Semi Bold'], ['Inter', 'Bold'], ['Roboto Mono', 'Regular']];
  for (const f of F) await figma.loadFontAsync({ family: f[0], style: f[1] });
}
async function mk(style, fill) { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style]); if (fill) await t.setFillStyleIdAsync(PS[fill]); return t; }

// Inline markdown → styled ranges. Handles **bold**, *italic*, `code`,
// [text](url), <url>. Recursion lets code/links nest inside bold.
function parseInline(str, inh) {
  inh = inh || {}; const segs = []; let last = 0, m;
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))|(<([^>]+)>)/g;
  while ((m = re.exec(str))) {
    if (m.index > last) segs.push({ t: str.slice(last, m.index), ...inh });
    if (m[1] !== undefined) segs.push(...parseInline(m[2], { ...inh, bold: true }));
    else if (m[3] !== undefined) segs.push(...parseInline(m[4], { ...inh, italic: true }));
    else if (m[5] !== undefined) segs.push({ t: m[6], ...inh, code: true });
    else if (m[7] !== undefined) segs.push({ t: m[8], ...inh, link: m[9] });
    else if (m[10] !== undefined) segs.push({ t: m[11], ...inh, link: m[11] });
    last = re.lastIndex;
  }
  if (last < str.length) segs.push({ t: str.slice(last), ...inh });
  return segs;
}
function applyRanges(t, segs, base) {
  let pos = base || 0;
  for (const s of segs) {
    const a = pos, b = pos + s.t.length;
    if (b > a) {
      if (s.code) { t.setRangeFontName(a, b, { family: 'Roboto Mono', style: 'Regular' }); t.setRangeFills(a, b, [{ type: 'SOLID', color: hex('#5B4FE0') }]); }
      else if (s.link) { t.setRangeFontName(a, b, { family: 'Inter', style: 'Medium' }); t.setRangeFills(a, b, [{ type: 'SOLID', color: hex('#5B4FE0') }]); t.setRangeTextDecoration(a, b, 'UNDERLINE'); }
      else if (s.bold) { t.setRangeFontName(a, b, { family: 'Inter', style: 'Semi Bold' }); t.setRangeFills(a, b, [{ type: 'SOLID', color: hex('#18181B') }]); }
      else if (s.italic) { t.setRangeFontName(a, b, { family: 'Inter', style: 'Italic' }); }
    }
    pos = b;
  }
}

// ---- section: What's inside -------------------------------------------------
// data = phases[] from toolkit-data.json. Fully data-driven and self-healing:
// rebuilds the workflow ribbon and both grid columns from scratch, so adding,
// removing, renaming, or reordering a whole workflow phase in the repo all flow
// through with no manual scaffold edits.
async function renderWhatsInside(phases) {
  async function skillRow(body, name, marker, desc) {
    const sep = '  —  ';
    const dsegs = parseInline(desc);
    const prefix = name + (marker ? ' ' + marker : '');
    const t = await mk('Body', 'ink/secondary');
    t.characters = prefix + sep + dsegs.map((s) => s.t).join('');
    t.setRangeFontName(0, name.length, { family: 'Inter', style: 'Semi Bold' });
    t.setRangeFills(0, name.length, [{ type: 'SOLID', color: hex('#18181B') }]);
    if (marker) { const ms = name.length + 1, me = ms + marker.length, mc = marker === '†' ? '#92400E' : '#B0195C'; t.setRangeFontName(ms, me, { family: 'Inter', style: 'Semi Bold' }); t.setRangeFills(ms, me, [{ type: 'SOLID', color: hex(mc) }]); }
    applyRanges(t, dsegs, prefix.length + sep.length);
    body.appendChild(t); t.layoutSizingHorizontal = 'FILL';
  }
  async function buildPhaseCard(col, ph, color) {
    const card = AL('VERTICAL', { name: 'Phase · ' + ph.name, itemSpacing: 0 });
    await card.setFillStyleIdAsync(PS['surface/white']); card.cornerRadius = 16; card.clipsContent = true;
    card.strokes = [{ type: 'SOLID', color: hex('#E6E6EA') }]; card.strokeWeight = 1;
    col.appendChild(card); card.layoutSizingHorizontal = 'FILL';
    const h = AL('HORIZONTAL', { name: 'H', itemSpacing: 10, paddingLeft: 18, paddingRight: 18, paddingTop: 14, paddingBottom: 14, counterAxisAlignItems: 'CENTER' });
    h.fills = [{ type: 'SOLID', color: mix(color, 0.12) }]; card.appendChild(h); h.layoutSizingHorizontal = 'FILL';
    const num = await mk('Badge'); num.characters = ph.num; num.textCase = 'UPPER'; num.fills = [{ type: 'SOLID', color: hex(color) }]; h.appendChild(num);
    const em = await mk('H3'); em.characters = ph.emoji; h.appendChild(em);
    const nm = await mk('H3'); nm.characters = ph.name; nm.fills = [{ type: 'SOLID', color: hex(color) }]; h.appendChild(nm); nm.layoutSizingHorizontal = 'FILL';
    const b = AL('VERTICAL', { name: 'B', itemSpacing: 12, paddingLeft: 18, paddingRight: 18, paddingTop: 16, paddingBottom: 18 });
    card.appendChild(b); b.layoutSizingHorizontal = 'FILL';
    for (const s of ph.skills) await skillRow(b, s.skill, s.marker, s.desc);
  }

  // 1) Workflow ribbon — rebuild the pill row from the phase list.
  const ribbon = figma.currentPage.findOne((n) => n.name === 'Workflow ribbon');
  if (ribbon) {
    const pillRow = ribbon.children.find((c) => c.layoutMode === 'HORIZONTAL') || ribbon.children[ribbon.children.length - 1];
    for (const ch of [...pillRow.children]) ch.remove();
    for (let i = 0; i < phases.length; i++) {
      const ph = phases[i], color = phaseColor(ph.name, i);
      const pill = AL('HORIZONTAL', { itemSpacing: 6, paddingLeft: 11, paddingRight: 12, paddingTop: 6, paddingBottom: 6, cornerRadius: 999, counterAxisAlignItems: 'CENTER' });
      pill.fills = [{ type: 'SOLID', color: mix(color, 0.13) }];
      const n = await mk('Badge'); n.characters = ph.num; n.fills = [{ type: 'SOLID', color: hex(color) }]; pill.appendChild(n);
      const nm = await mk('BodyStrong'); nm.characters = shortName(ph.name); nm.fills = [{ type: 'SOLID', color: hex(color) }]; pill.appendChild(nm);
      pillRow.appendChild(pill);
      if (i < phases.length - 1) { const ar = await mk('BodyStrong', 'ink/muted'); ar.characters = '→'; pillRow.appendChild(ar); }
    }
  }

  // 2) Grid — rebuild both columns; split phases into two contiguous,
  // order-preserving groups balanced by skill count.
  const board = figma.currentPage.findOne((n) => n.name && n.name.indexOf('Board · What') === 0);
  const grid = (board || figma.currentPage).findOne((n) => n.name === 'Grid');
  const cols = grid.children.filter((c) => c.type === 'FRAME');
  for (const c of cols) for (const ch of [...c.children]) ch.remove();
  const total = phases.reduce((s, p) => s + p.skills.length, 0);
  let acc = 0, breakAt = phases.length;
  for (let i = 0; i < phases.length; i++) { if (acc + phases[i].skills.length > total / 2) { breakAt = i; break; } acc += phases[i].skills.length; }
  if (breakAt === 0) breakAt = 1;
  for (let i = 0; i < phases.length; i++) {
    const col = i < breakAt ? cols[0] : (cols[1] || cols[0]);
    await buildPhaseCard(col, phases[i], phaseColor(phases[i].name, i));
  }
  return phases.map((p) => p.name);
}

// ---- section: Plugin details ------------------------------------------------
// data = plugins slice; clear=true empties the stack first (batch 1 only)
async function renderPluginDetails(plugins, clear) {
  const stack = figma.currentPage.findOne((n) => n.name === 'PluginStack');
  if (!stack) throw new Error('PluginStack not found — run the initial build first.');
  if (clear) for (const ch of [...stack.children]) ch.remove();

  async function chip(row, text, bg, fg) {
    const c = AL('HORIZONTAL', { paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, cornerRadius: 6 });
    c.fills = [{ type: 'SOLID', color: typeof bg === 'string' ? hex(bg) : bg }];
    const t = figma.createText(); await t.setTextStyleIdAsync(TS['Badge']); t.characters = text; t.textCase = 'UPPER'; t.fills = [{ type: 'SOLID', color: hex(fg) }];
    c.appendChild(t); row.appendChild(c);
  }
  async function card(p) {
    const c = AL('VERTICAL', { name: 'Plugin card', itemSpacing: 13, paddingLeft: 28, paddingRight: 28, paddingTop: 26, paddingBottom: 28 });
    await c.setFillStyleIdAsync(PS['surface/white']); c.cornerRadius = 16; c.strokes = [{ type: 'SOLID', color: hex('#E6E6EA') }]; c.strokeWeight = 1; c.clipsContent = true;
    stack.appendChild(c); c.layoutSizingHorizontal = 'FILL';
    const lines = p.readme.split('\n');
    let titleDone = false;
    for (const raw of lines) {
      const line = raw.replace(/\s+$/, '');
      if (line.trim() === '') continue;
      if (line.startsWith('# ')) {
        const t = await mk('H2', 'ink/primary'); t.characters = line.slice(2); c.appendChild(t); t.layoutSizingHorizontal = 'FILL';
        // chip row right under the title
        const row = AL('HORIZONTAL', { name: 'Chips', itemSpacing: 6, counterAxisAlignItems: 'CENTER' }); row.layoutWrap = 'WRAP';
        c.appendChild(row); row.layoutSizingHorizontal = 'FILL';
        if (p.phase && PHASE_COLOR[p.phase]) await chip(row, p.phase, mix(PHASE_COLOR[p.phase], 0.14), PHASE_COLOR[p.phase]);
        if (p.vendored) await chip(row, 'Vendored †', '#FEF3C7', '#92400E'); else await chip(row, 'Original', '#ECECEF', '#52525B');
        for (const r of p.requirements || []) { const cfg = REQ_CHIP[r]; if (cfg) await chip(row, cfg.text, cfg.bg, cfg.fg); }
        titleDone = true; continue;
      }
      if (line.startsWith('## ')) { const t = await mk('H3', 'ink/primary'); const sg = parseInline(line.slice(3)); t.characters = sg.map((s) => s.t).join(''); applyRanges(t, sg); c.appendChild(t); t.layoutSizingHorizontal = 'FILL'; continue; }
      if (line.trim() === '---') { const d = figma.createRectangle(); d.resize(1, 1); await d.setFillStyleIdAsync(PS['border/default']); c.appendChild(d); d.layoutSizingHorizontal = 'FILL'; d.resize(d.width, 1); continue; }
      if (line.startsWith('- ')) { const row = AL('HORIZONTAL', { itemSpacing: 9, counterAxisAlignItems: 'MIN' }); const dot = await mk('Body', 'accent/500'); dot.characters = '•'; row.appendChild(dot); const t = await mk('Body', 'ink/secondary'); const sg = parseInline(line.slice(2)); t.characters = sg.map((s) => s.t).join(''); applyRanges(t, sg); row.appendChild(t); c.appendChild(row); row.layoutSizingHorizontal = 'FILL'; t.layoutSizingHorizontal = 'FILL'; continue; }
      if (line.startsWith('> ')) { const q = AL('HORIZONTAL', { paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, cornerRadius: 8 }); q.fills = [{ type: 'SOLID', color: hex('#F7F7F9') }]; q.strokes = [{ type: 'SOLID', color: hex('#6D5EF6') }]; q.strokeTopWeight = 0; q.strokeRightWeight = 0; q.strokeBottomWeight = 0; q.strokeLeftWeight = 3; const t = await mk('Body', 'ink/secondary'); const sg = parseInline(line.slice(2)); t.characters = sg.map((s) => s.t).join(''); applyRanges(t, sg); q.appendChild(t); c.appendChild(q); q.layoutSizingHorizontal = 'FILL'; t.layoutSizingHorizontal = 'FILL'; continue; }
      if (line.startsWith('Install:')) { const cmd = (line.match(/`([^`]+)`/) || [])[1] || line.slice(8).trim(); const pill = AL('HORIZONTAL', { itemSpacing: 9, paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 9, cornerRadius: 8, counterAxisAlignItems: 'CENTER' }); await pill.setFillStyleIdAsync(PS['surface/code']); const lab = await mk('Badge', 'ink/muted'); lab.characters = 'INSTALL'; lab.textCase = 'UPPER'; pill.appendChild(lab); const cc = await mk('Code', 'ink/secondary'); cc.characters = cmd; pill.appendChild(cc); c.appendChild(pill); pill.layoutSizingHorizontal = 'FILL'; cc.layoutSizingHorizontal = 'FILL'; continue; }
      const t = await mk('Body', 'ink/secondary'); const sg = parseInline(line); t.characters = sg.map((s) => s.t).join(''); applyRanges(t, sg); c.appendChild(t); t.layoutSizingHorizontal = 'FILL';
    }
    return c.id;
  }
  const ids = [];
  for (const p of plugins) ids.push(await card(p));
  return ids;
}

// ---- dispatcher -------------------------------------------------------------
await loadFonts();
await loadStyles();
if (SYNC.section === 'whats-inside') return await renderWhatsInside(SYNC.data);
if (SYNC.section === 'plugin-details') return await renderPluginDetails(SYNC.data, !!SYNC.clear);
throw new Error('Unknown SYNC.section: ' + SYNC.section);
