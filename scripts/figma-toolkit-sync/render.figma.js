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
// rebuilds the workflow ribbon and every phase card from scratch, so adding,
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
  async function buildPhaseCard(parent, ph, color) {
    const card = AL('VERTICAL', { name: 'Phase · ' + ph.name, itemSpacing: 0 });
    await card.setFillStyleIdAsync(PS['surface/white']); card.cornerRadius = 16; card.clipsContent = true;
    card.strokes = [{ type: 'SOLID', color: hex('#E6E6EA') }]; card.strokeWeight = 1;
    parent.appendChild(card); card.layoutSizingHorizontal = 'FILL';
    const h = AL('HORIZONTAL', { name: 'H', itemSpacing: 10, paddingLeft: 18, paddingRight: 18, paddingTop: 14, paddingBottom: 14, counterAxisAlignItems: 'CENTER' });
    h.fills = [{ type: 'SOLID', color: mix(color, 0.12) }]; card.appendChild(h); h.layoutSizingHorizontal = 'FILL';
    const num = await mk('Badge'); num.characters = ph.num; num.textCase = 'UPPER'; num.fills = [{ type: 'SOLID', color: hex(color) }]; h.appendChild(num);
    const em = await mk('H3'); em.characters = ph.emoji; h.appendChild(em);
    const nm = await mk('H3'); nm.characters = ph.name; nm.fills = [{ type: 'SOLID', color: hex(color) }]; h.appendChild(nm); nm.layoutSizingHorizontal = 'FILL';
    const b = AL('VERTICAL', { name: 'B', itemSpacing: 18, paddingLeft: 18, paddingRight: 18, paddingTop: 16, paddingBottom: 18 });
    card.appendChild(b); b.layoutSizingHorizontal = 'FILL';
    // Group skills under their owning plugin (= the page you'd navigate to),
    // falling back to the phase's single plugin when a skill's plugin is null;
    // preserve first-appearance order. The plugin label is the navigation anchor:
    // real plugins get an accent label named `WIP · <plugin>` that the `link` op
    // hyperlinks to the plugin's page; a group whose plugin isn't one of the
    // phase's real plugins (e.g. "Figma MCP") is external — labelled muted and
    // left unlinked. Skill rows themselves are plain text, not links.
    const groups = [], gi = {};
    for (const s of ph.skills) {
      const plug = s.plugin || (ph.plugins && ph.plugins[0]) || '—';
      if (!(plug in gi)) { gi[plug] = groups.length; groups.push({ plugin: plug, skills: [] }); }
      groups[gi[plug]].skills.push(s);
    }
    for (const grp of groups) {
      const external = !(ph.plugins && ph.plugins.includes(grp.plugin));
      const group = AL('VERTICAL', { name: 'PluginGroup · ' + grp.plugin, itemSpacing: 8 });
      b.appendChild(group); group.layoutSizingHorizontal = 'FILL';
      const lab = await mk('Overline', external ? 'ink/muted' : 'accent/600');
      lab.characters = external ? grp.plugin + '  §' : grp.plugin; lab.textCase = 'UPPER';
      if (!external) lab.name = 'WIP · ' + grp.plugin;
      group.appendChild(lab); lab.layoutSizingHorizontal = 'FILL';
      const rows = AL('VERTICAL', { name: 'Rows', itemSpacing: 9, paddingLeft: 14 });
      group.appendChild(rows); rows.layoutSizingHorizontal = 'FILL';
      for (const s of grp.skills) await skillRow(rows, s.skill, s.marker, s.desc);
    }
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

  // 2) Grid — a single vertical column of phase cards. Clear whatever the grid
  // currently holds (old cards, leftover column wrappers, or orphaned frames)
  // and rebuild every phase as a direct child, in order. Self-healing: it makes
  // NO assumption about the grid's prior child structure, so a corrupted grid
  // scaffold can't survive a sync. (The previous "filter to the 2 column frames"
  // logic accreted 9 empty orphan frames + ~2,700px of dead whitespace when the
  // grid held anything other than exactly two column sub-frames.)
  const board = figma.currentPage.findOne((n) => n.name && (n.name.indexOf('Board · What') === 0 || n.name === "What's Inside"));
  const grid = (board || figma.currentPage).findOne((n) => n.name === 'Grid');
  for (const ch of [...grid.children]) ch.remove();
  for (let i = 0; i < phases.length; i++) {
    await buildPhaseCard(grid, phases[i], phaseColor(phases[i].name, i));
  }
  return phases.map((p) => p.name);
}

// ---- section: Overview intro (hero subtitle + "What it is" card) ------------
// data = { hero, card[] } from toolkit-data.json — the README's opening
// paragraphs, markdown-stripped. Unlike the phase cards, these nodes live on the
// CURATED Overview board, so we do NOT rebuild them: we locate the existing text
// nodes and rewrite ONLY their `characters`, preserving each node's curated
// font/size/color. Positional assignment for the card also re-imposes README
// paragraph order, self-healing a manual reorder.
async function setCharsPreservingFont(node, chars) {
  for (const seg of node.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(seg.fontName);
  node.characters = chars;
  return node.id;
}
async function renderIntro(intro) {
  const ids = [];
  // Hero subtitle: located by its stable name `Hero subtitle`. On first run
  // (before the name is set) fall back to the SMALLER-font TEXT child of the
  // "Hero" frame — the title is the larger font size — then set the stable name
  // so later runs are exact. (Never identify by text length: dirtying/shortening
  // the subtitle would then make the title look like the target.)
  const hero = figma.currentPage.findOne((n) => n.name === 'Hero');
  if (hero && intro.hero) {
    let sub = hero.findOne((n) => n.type === 'TEXT' && n.name === 'Hero subtitle');
    if (!sub) {
      const texts = hero.children.filter((c) => c.type === 'TEXT');
      const size = (t) => (typeof t.fontSize === 'number' ? t.fontSize : 0);
      const title = texts.slice().sort((a, b) => size(b) - size(a))[0];
      sub = texts.filter((t) => t !== title)[0];
      if (sub) sub.name = 'Hero subtitle';
    }
    if (sub) ids.push(await setCharsPreservingFont(sub, intro.hero));
  }
  // "What it is" card: its direct TEXT children, in order, take the card
  // paragraphs in README order.
  const card = figma.currentPage.findOne((n) => n.name === 'What it is');
  if (card && intro.card) {
    const texts = card.children.filter((c) => c.type === 'TEXT');
    for (let i = 0; i < intro.card.length && i < texts.length; i++) {
      ids.push(await setCharsPreservingFont(texts[i], intro.card[i]));
    }
  }
  return { mutatedNodeIds: ids };
}

// ---- dispatcher -------------------------------------------------------------
// This renderer owns the Overview page: the "What's inside" index AND the intro
// paragraphs (hero subtitle + "What it is" card). Plugin detail content lives on
// each plugin's own page (built by render-pages.figma.js), paired with its skills.
await loadFonts();
await loadStyles();
if (SYNC.section === 'whats-inside') return await renderWhatsInside(SYNC.data);
if (SYNC.section === 'intro') return await renderIntro(SYNC.data);
throw new Error('Unknown SYNC.section: ' + SYNC.section);
