/**
 * render-pages.figma.js — Figma Plugin API renderer for the per-plugin skill
 * deep-dive PAGES. Kept separate from render.figma.js (which does the main
 * catalogue page) so one large SKILL.md body plus this renderer stay under the
 * use_figma code-size limit.
 *
 * Passed as the `code` arg to use_figma with a `SYNC` object prepended:
 *
 *   const SYNC = { op: "plugin-page", plugin: {...}, skills: [...], reset: true };
 *   // …contents of this file…
 *
 * Ops (idempotent; pages/nodes located BY NAME):
 *   - "plugin-page": ensure a page named plugin.name; reset:true clears it and
 *       builds the header, then appends a frame per skill in `skills` (its full
 *       SKILL.md). Batch skills across calls for big plugins (reset only on the
 *       first). Returns skill-frame ids so the catalogue can link to them.
 *   - "organize": create phase divider pages, order all managed pages after the
 *       main page, and delete stale plugin/divider pages. Pass { order, dividers }.
 *   - "link": on the main catalogue page, hyperlink each plugin-card skill name
 *       to its skill frame. Pass { links: [{plugin, skill, nodeId}] }.
 */

// ---- shared helpers ---------------------------------------------------------
function hex(h) { const n = parseInt(h.slice(1), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; }
function mix(h, t) { const c = hex(h); return { r: c.r * t + (1 - t), g: c.g * t + (1 - t), b: c.b * t + (1 - t) }; }
function AL(dir, props) { const f = figma.createAutoLayout(dir, props || {}); f.fills = []; return f; }
const PHASE_COLOR = { Meta: '#64748B', Research: '#2563EB', 'Define & plan': '#7C3AED', Ideate: '#D97706', Structure: '#0D9488', Design: '#DB2777', Content: '#0891B2', Check: '#16A34A', Prototype: '#EA580C', 'Handoff & docs': '#4F46E5', 'Measure & iterate': '#E11D48' };
const PHASE_FALLBACK = ['#0EA5E9', '#9333EA', '#CA8A04', '#059669', '#DC2626', '#7C3AED', '#0891B2', '#EA580C'];
function phaseColor(name) { return PHASE_COLOR[name] || PHASE_FALLBACK[0]; }
const REQ_CHIP = { 'figma-mcp': { text: 'Figma MCP', bg: '#FCE3EC', fg: '#B0195C' }, browser: { text: 'Browser', bg: '#ECECEF', fg: '#52525B' }, codebase: { text: 'Codebase', bg: '#ECECEF', fg: '#52525B' } };
const TS = {}, PS = {};
async function loadStylesAndFonts() {
  for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s.id;
  for (const s of await figma.getLocalPaintStylesAsync()) PS[s.name] = s.id;
  for (const f of [['Inter', 'Regular'], ['Inter', 'Italic'], ['Inter', 'Medium'], ['Inter', 'Semi Bold'], ['Inter', 'Bold'], ['Roboto Mono', 'Regular']]) await figma.loadFontAsync({ family: f[0], style: f[1] });
}
async function mk(style, fill) { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style]); if (fill) await t.setFillStyleIdAsync(PS[fill]); return t; }

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
async function richText(style, fill, str) {
  const segs = parseInline(str);
  const t = await mk(style, fill);
  t.characters = segs.map((s) => s.t).join('');
  let pos = 0;
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
  return t;
}

// ---- markdown block renderer ------------------------------------------------
async function renderMarkdown(box, md) {
  const HEAD = { 1: 'H1', 2: 'H2', 3: 'H3', 4: 'BodyStrong', 5: 'BodyStrong', 6: 'BodyStrong' };
  const lines = md.split('\n');
  let i = 0;
  const add = (n) => { box.appendChild(n); n.layoutSizingHorizontal = 'FILL'; };
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    // fenced code
    if (/^```/.test(line.trim())) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i].trim())) { buf.push(lines[i]); i++; } i++; const c = AL('VERTICAL', { paddingLeft: 16, paddingRight: 16, paddingTop: 14, paddingBottom: 14, cornerRadius: 10 }); await c.setFillStyleIdAsync(PS['surface/code']); c.strokes = [{ type: 'SOLID', color: hex('#E6E6EA') }]; c.strokeWeight = 1; const t = await mk('Code', 'ink/secondary'); t.characters = buf.join('\n') || ' '; c.appendChild(t); t.layoutSizingHorizontal = 'FILL'; add(c); continue; }
    // table
    if (/^\|/.test(line.trim()) && i + 1 < lines.length && /^\|[\s:|-]+\|?\s*$/.test(lines[i + 1].trim())) {
      const rows = [line]; i += 2; while (i < lines.length && /^\|/.test(lines[i].trim())) { rows.push(lines[i]); i++; }
      const parsed = rows.map((r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
      const tbl = AL('VERTICAL', { itemSpacing: 0, cornerRadius: 10, clipsContent: true }); tbl.strokes = [{ type: 'SOLID', color: hex('#E6E6EA') }]; tbl.strokeWeight = 1;
      for (let r = 0; r < parsed.length; r++) {
        const row = AL('HORIZONTAL', { itemSpacing: 0 }); if (r === 0) row.fills = [{ type: 'SOLID', color: hex('#F3F3F6') }];
        tbl.appendChild(row); row.layoutSizingHorizontal = 'FILL';
        for (let cIdx = 0; cIdx < parsed[r].length; cIdx++) {
          const cell = AL('VERTICAL', { paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }); if (cIdx > 0) { cell.strokes = [{ type: 'SOLID', color: hex('#ECECEF') }]; cell.strokeLeftWeight = 1; cell.strokeTopWeight = 0; cell.strokeRightWeight = 0; cell.strokeBottomWeight = 0; }
          row.appendChild(cell); cell.layoutSizingHorizontal = 'FILL';
          const t = await richText(r === 0 ? 'BodyStrong' : 'Body', r === 0 ? 'ink/primary' : 'ink/secondary', parsed[r][cIdx]); cell.appendChild(t); t.layoutSizingHorizontal = 'FILL';
        }
        if (r === 0 && parsed.length > 1) { const d = figma.createRectangle(); d.resize(1, 1); d.fills = [{ type: 'SOLID', color: hex('#E6E6EA') }]; tbl.appendChild(d); d.layoutSizingHorizontal = 'FILL'; d.resize(d.width, 1); }
      }
      add(tbl); continue;
    }
    // heading
    let hm = line.match(/^(#{1,6})\s+(.*)$/);
    if (hm) { const t = await richText(HEAD[hm[1].length], 'ink/primary', hm[2]); add(t); i++; continue; }
    // hr
    if (/^-{3,}$/.test(line.trim())) { const d = figma.createRectangle(); d.resize(1, 1); await d.setFillStyleIdAsync(PS['border/default']); add(d); d.resize(d.width, 1); i++; continue; }
    // blockquote
    if (/^>\s?/.test(line)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; } const q = AL('HORIZONTAL', { paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, cornerRadius: 8 }); q.fills = [{ type: 'SOLID', color: hex('#F7F7F9') }]; q.strokes = [{ type: 'SOLID', color: hex('#6D5EF6') }]; q.strokeLeftWeight = 3; q.strokeTopWeight = 0; q.strokeRightWeight = 0; q.strokeBottomWeight = 0; const t = await richText('Body', 'ink/secondary', buf.join(' ')); q.appendChild(t); t.layoutSizingHorizontal = 'FILL'; add(q); continue; }
    // ordered list
    if (/^\d+\.\s/.test(line)) { const items = []; while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, '')); i++; } const list = AL('VERTICAL', { itemSpacing: 7 }); let n = 1; for (const it of items) { const row = AL('HORIZONTAL', { itemSpacing: 9, counterAxisAlignItems: 'MIN' }); const num = await mk('BodyStrong', 'accent/600'); num.characters = (n++) + '.'; row.appendChild(num); const t = await richText('Body', 'ink/secondary', it); row.appendChild(t); t.layoutSizingHorizontal = 'FILL'; list.appendChild(row); row.layoutSizingHorizontal = 'FILL'; } add(list); continue; }
    // unordered list (supports one level of nesting)
    if (/^\s*[-*]\s/.test(line)) { const items = []; while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) { const indent = lines[i].match(/^(\s*)/)[1].length; items.push({ indent, text: lines[i].replace(/^\s*[-*]\s/, '') }); i++; } const list = AL('VERTICAL', { itemSpacing: 7 }); for (const it of items) { const row = AL('HORIZONTAL', { itemSpacing: 9, counterAxisAlignItems: 'MIN', paddingLeft: it.indent >= 2 ? 20 : 0 }); const dot = await mk('Body', it.indent >= 2 ? 'ink/muted' : 'accent/500'); dot.characters = it.indent >= 2 ? '◦' : '•'; row.appendChild(dot); const t = await richText('Body', 'ink/secondary', it.text); row.appendChild(t); t.layoutSizingHorizontal = 'FILL'; list.appendChild(row); row.layoutSizingHorizontal = 'FILL'; } add(list); continue; }
    // paragraph
    const t = await richText('Body', 'ink/secondary', line); add(t); i++;
  }
}

// ---- page helpers -----------------------------------------------------------
async function ensurePage(name) {
  let page = figma.root.children.find((p) => p.name === name);
  if (!page) { page = figma.createPage(); page.name = name; }
  page.setSharedPluginData('figmaToolkitSync', 'managed', '1'); // tag so cleanup never touches user pages
  await figma.setCurrentPageAsync(page);
  return page;
}
async function chip(row, text, bg, fg) {
  const c = AL('HORIZONTAL', { paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, cornerRadius: 6 });
  c.fills = [{ type: 'SOLID', color: typeof bg === 'string' ? hex(bg) : bg }];
  const t = await mk('Badge'); t.characters = text; t.textCase = 'UPPER'; t.fills = [{ type: 'SOLID', color: hex(fg) }];
  c.appendChild(t); row.appendChild(c);
}

// board = the vertical container frame that holds a plugin page's content
async function pluginPage(plugin, skills, reset) {
  const page = await ensurePage(plugin.name);
  let board;
  if (reset) {
    for (const ch of [...page.children]) ch.remove();
    board = AL('VERTICAL', { name: 'PluginPage', itemSpacing: 28, paddingLeft: 72, paddingRight: 72, paddingTop: 64, paddingBottom: 72 });
    await board.setFillStyleIdAsync(PS['surface/white']); board.cornerRadius = 28; board.counterAxisSizingMode = 'FIXED'; board.resize(940, board.height); board.x = 120; board.y = 120;
    page.appendChild(board);
    // header
    const head = AL('VERTICAL', { name: 'Header', itemSpacing: 12 }); board.appendChild(head); head.layoutSizingHorizontal = 'FILL';
    const eyebrow = await mk('Overline', 'ink/muted'); eyebrow.characters = (plugin.phaseNum ? plugin.phaseNum + ' · ' : '') + (plugin.phase || 'Plugin'); eyebrow.textCase = 'UPPER'; head.appendChild(eyebrow);
    const title = await mk('Display', 'ink/primary'); title.characters = plugin.name; head.appendChild(title); title.layoutSizingHorizontal = 'FILL';
    const chips = AL('HORIZONTAL', { itemSpacing: 6, counterAxisAlignItems: 'CENTER' }); chips.layoutWrap = 'WRAP'; head.appendChild(chips); chips.layoutSizingHorizontal = 'FILL';
    if (plugin.phase) await chip(chips, plugin.phase, mix(phaseColor(plugin.phase), 0.14), phaseColor(plugin.phase));
    if (plugin.vendored) await chip(chips, 'Vendored †', '#FEF3C7', '#92400E'); else await chip(chips, 'Original', '#ECECEF', '#52525B');
    for (const r of plugin.requirements || []) { const cfg = REQ_CHIP[r]; if (cfg) await chip(chips, cfg.text, cfg.bg, cfg.fg); }
    const inst = AL('HORIZONTAL', { itemSpacing: 9, paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 9, cornerRadius: 8, counterAxisAlignItems: 'CENTER' }); await inst.setFillStyleIdAsync(PS['surface/code']); head.appendChild(inst); inst.layoutSizingHorizontal = 'FILL';
    const lab = await mk('Badge', 'ink/muted'); lab.characters = 'INSTALL'; lab.textCase = 'UPPER'; inst.appendChild(lab);
    const cc = await mk('Code', 'ink/secondary'); cc.characters = '/plugin install ' + plugin.name + '@ai-ux-toolkit'; inst.appendChild(cc); cc.layoutSizingHorizontal = 'FILL';
  } else {
    board = page.findOne((n) => n.name === 'PluginPage');
  }
  // skill frames
  const out = [];
  for (const sk of skills) {
    const card = AL('VERTICAL', { name: 'Skill · ' + sk.name, itemSpacing: 16, paddingLeft: 32, paddingRight: 32, paddingTop: 30, paddingBottom: 34 });
    await card.setFillStyleIdAsync(PS['surface/subtle']); card.cornerRadius = 20; card.strokes = [{ type: 'SOLID', color: hex('#E6E6EA') }]; card.strokeWeight = 1; card.clipsContent = true;
    board.appendChild(card); card.layoutSizingHorizontal = 'FILL';
    const label = await mk('Overline', 'accent/600'); label.characters = 'Skill'; label.textCase = 'UPPER'; card.appendChild(label);
    const nm = await mk('H1', 'ink/primary'); nm.characters = sk.name; card.appendChild(nm); nm.layoutSizingHorizontal = 'FILL';
    if (sk.description) { const desc = await richText('Body', 'ink/secondary', sk.description); card.appendChild(desc); desc.layoutSizingHorizontal = 'FILL'; }
    const d = figma.createRectangle(); d.resize(1, 1); await d.setFillStyleIdAsync(PS['border/default']); card.appendChild(d); d.layoutSizingHorizontal = 'FILL'; d.resize(d.width, 1);
    const bodyBox = AL('VERTICAL', { itemSpacing: 14 }); card.appendChild(bodyBox); bodyBox.layoutSizingHorizontal = 'FILL';
    await renderMarkdown(bodyBox, sk.body);
    out.push({ skill: sk.name, id: card.id });
  }
  return { page: page.id, pluginPageId: board.id, skillFrames: out };
}

// ---- organize: dividers, ordering, stale cleanup ----------------------------
async function organize(order, dividers) {
  const wanted = new Set([...order, ...dividers.map((d) => d.name)]);
  const main = figma.root.children.find((p) => p.name === 'AI UX Toolkit') || figma.root.children[0];
  // ensure + tag divider pages
  for (const d of dividers) {
    let dp = figma.root.children.find((p) => p.name === d.name);
    if (!dp) { dp = figma.createPage(); dp.name = d.name; }
    dp.setSharedPluginData('figmaToolkitSync', 'managed', '1');
  }
  // remove managed pages no longer wanted (only pages WE tagged — never user pages)
  for (const p of [...figma.root.children]) {
    if (p === main) continue;
    if (p.getSharedPluginData('figmaToolkitSync', 'managed') === '1' && !wanted.has(p.name)) {
      if (figma.currentPage === p) await figma.setCurrentPageAsync(main);
      p.remove();
    }
  }
  // order: main, then [divider, its plugins…], then any leftovers
  const seq = [main];
  for (const d of dividers) { const dp = figma.root.children.find((p) => p.name === d.name); if (dp) seq.push(dp); for (const slug of d.plugins) { const pp = figma.root.children.find((p) => p.name === slug); if (pp && !seq.includes(pp)) seq.push(pp); } }
  for (const p of figma.root.children) if (!seq.includes(p)) seq.push(p);
  seq.forEach((p, idx) => figma.root.insertChild(idx, p));
  return { pages: figma.root.children.map((p) => p.name) };
}

// ---- link: hyperlink catalogue skill names to their skill frames ------------
async function linkCatalogue(links) {
  const main = figma.root.children.find((p) => p.name === 'AI UX Toolkit') || figma.root.children[0];
  await figma.setCurrentPageAsync(main);
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  const stack = main.findOne((n) => n.name === 'PluginStack');
  let linked = 0;
  for (const lk of links) {
    const card = stack.children.find((c) => { const t = c.children.find((x) => x.type === 'TEXT'); return t && t.characters === lk.plugin; });
    if (!card) continue;
    // match the skill BULLET (name followed by an em-dash), not the plugin title
    const texts = card.findAll((n) => n.type === 'TEXT' && n.characters.indexOf(lk.skill) === 0 && /\s—\s/.test(n.characters));
    for (const t of texts) { try { t.setRangeHyperlink(0, lk.skill.length, { type: 'NODE', value: lk.nodeId }); linked++; } catch (e) { } }
  }
  return { linked };
}

// ---- dispatcher -------------------------------------------------------------
await loadStylesAndFonts();
if (SYNC.op === 'plugin-page') return await pluginPage(SYNC.plugin, SYNC.skills || [], !!SYNC.reset);
if (SYNC.op === 'organize') return await organize(SYNC.order || [], SYNC.dividers || []);
if (SYNC.op === 'link') return await linkCatalogue(SYNC.links || []);
throw new Error('Unknown SYNC.op: ' + SYNC.op);
