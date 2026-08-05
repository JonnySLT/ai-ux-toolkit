#!/usr/bin/env node
/**
 * extract.mjs — Turn the repo's own README files into a single structured
 * data file (`toolkit-data.json`) that the Figma renderer consumes.
 *
 * The repo is the source of truth. This script derives, deterministically:
 *   - intro      : the README's opening paragraphs (markdown-stripped) — the
 *                  hero subtitle + the "What it is" card — so the curated
 *                  Overview intro tracks the repo too, not just the catalog.
 *   - phases[]   : the "What's inside" table, grouped by workflow phase,
 *                  with each skill's verbatim "Use it to…" description.
 *   - plugins[]  : every plugin's full, verbatim README markdown, plus the
 *                  chip metadata (phase, origin, requirements) shown on cards.
 *   - fingerprint: a sha256 of the normalized data, for change detection.
 *
 * Usage:
 *   node scripts/figma-toolkit-sync/extract.mjs          # write toolkit-data.json
 *   node scripts/figma-toolkit-sync/extract.mjs --check  # print fingerprint only
 *
 * No dependencies — Node stdlib only.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const PLUGINS_DIR = join(REPO, 'plugins');
const MAIN_README = join(REPO, 'README.md');
const OUT = join(HERE, 'toolkit-data.json');

/**
 * Requirement chips are the one piece not cleanly parseable from a single
 * table — they're scattered across each plugin's prose and the main README's
 * Requirements section. Keep the mapping here, explicitly, as the single
 * hand-maintained bit. Values: 'figma-mcp' | 'browser' | 'codebase'.
 */
const REQUIREMENTS = {
  'competitive-analysis': ['browser'],
  'site-architecture': ['figma-mcp', 'browser'],
  'figma-design-system': ['figma-mcp'],
  'design-tokens': ['codebase'],
  'frontend-design': ['codebase'],
  'accessibility-heuristics': ['browser'],
  'design-review': ['browser'],
  'rapid-prototyping': ['browser'],
  'changelog-automation': ['figma-mcp'],
};

// ---- helpers ----------------------------------------------------------------

function readIfExists(p) {
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

/** Extract the "## What's inside" section body (up to the next "## "). */
function sliceWhatsInside(readme) {
  const start = readme.indexOf('## What');
  if (start === -1) throw new Error('Could not find "## What\'s inside" heading in README.md');
  const rest = readme.slice(start + 3);
  const next = rest.indexOf('\n## ');
  return next === -1 ? readme.slice(start) : readme.slice(start, start + 3 + next);
}

/** First `code span` in a string, or null. */
function firstCode(s) {
  const m = s.match(/`([^`]+)`/);
  return m ? m[1] : null;
}

/** Marker († or §) present in a cell, or null. */
function markerOf(s) {
  if (s.includes('§')) return '§';
  if (s.includes('†')) return '†';
  return null;
}

/** Markdown inline → plain text: drop bold/italic emphasis, unwrap code + links. */
function stripMarkdown(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<([^>]+)>/g, '$1')
    .trim();
}

/**
 * The README's opening paragraphs — the prose between the H1 title and the
 * first horizontal rule (`---`) or `## ` section. These mirror the curated Figma
 * Overview intro: the first paragraph is the hero subtitle; the rest are the
 * "What it is" card, in order. Blockquote callouts (`> …`) and stray headings
 * are skipped, and inline markdown is stripped so the text matches how the
 * curated (uniformly-styled) Figma nodes render it.
 */
function parseIntro(readme) {
  const lines = readme.split('\n');
  let i = lines.findIndex((l) => /^#\s+/.test(l));
  i = i === -1 ? 0 : i + 1; // start just after the H1
  const paras = [];
  let buf = [];
  const flush = () => { if (buf.length) { paras.push(buf.join(' ').trim()); buf = []; } };
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (/^---\s*$/.test(l) || /^##\s+/.test(l)) break;   // end of the intro block
    if (l.trim() === '' || l.startsWith('>') || l.startsWith('#')) { flush(); continue; }
    buf.push(l.trim());
  }
  flush();
  const clean = paras.map(stripMarkdown).filter(Boolean);
  return { hero: clean[0] || '', card: clean.slice(1) };
}

/**
 * Parse the What's inside section into ordered phases. Each "### <emoji>
 * <name> — <plugins>" heading starts a phase; the markdown table under it
 * lists the skills. Tables are either 2-col (Skill | Use it to…) or 3-col
 * (Skill | Plugin | Use it to…).
 */
function parsePhases(readme) {
  const section = sliceWhatsInside(readme);
  const lines = section.split('\n');
  const phases = [];
  let cur = null;

  for (const line of lines) {
    const h = line.match(/^###\s+(\S+)\s+(.+?)\s+—\s+(.+)$/);
    if (h) {
      const emoji = h[1];
      const name = h[2].trim();
      const plugins = [...h[3].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
      cur = { num: String(phases.length + 1).padStart(2, '0'), emoji, name, plugins, skills: [] };
      phases.push(cur);
      continue;
    }
    if (!cur) continue;
    // table rows only: start with '|', not a separator row, contain a code span
    if (!line.startsWith('|')) continue;
    if (/^\|[\s:|-]+\|?\s*$/.test(line)) continue; // |---|---| separator
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2) continue;
    const skill = firstCode(cells[0]);
    if (!skill) continue; // header row "| Skill | ... |" has no code span
    const marker = markerOf(cells[0]);
    const plugin = cells.length >= 3 ? cells[1] : null;
    const desc = cells[cells.length - 1];
    cur.skills.push({ skill, marker, plugin, desc });
  }
  return phases;
}

/** Map each skill/plugin to its phase name via the parsed phases. */
function pluginPhaseIndex(phases) {
  const byPlugin = {};
  for (const ph of phases) {
    for (const p of ph.plugins) byPlugin[p] = { name: ph.name, num: ph.num };
    // also index by the plugin column when present
    for (const s of ph.skills) if (s.plugin) byPlugin[s.plugin] = { name: ph.name, num: ph.num };
  }
  return byPlugin;
}

/** A plugin is vendored if its README carries an Attribution / "vendored" note. */
function isVendored(md) {
  return /##\s*Attribution/i.test(md) || /vendored\s+\*\*verbatim\*\*/i.test(md);
}

/** Split a SKILL.md into its frontmatter (name, description) and body. */
function parseSkill(md) {
  const fm = md.match(/^---\n([\s\S]*?)\n---\n?/);
  let name = null, description = null, body = md;
  if (fm) {
    const nm = fm[1].match(/^name:\s*(.+)$/m);
    const dm = fm[1].match(/^description:\s*(.+)$/m);
    if (nm) name = nm[1].trim();
    if (dm) description = dm[1].trim();
    body = md.slice(fm[0].length);
  }
  return { name, description, body: body.replace(/\s+$/, '') };
}

/** Ordered skill dirs for a plugin — README bullet order first, then any extras. */
function skillOrder(readme, dirs) {
  const bulletOrder = [...readme.matchAll(/^-\s+\*\*([^*]+)\*\*/gm)].map((m) => m[1]);
  return dirs.slice().sort((a, b) => {
    const ia = bulletOrder.indexOf(a), ib = bulletOrder.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
}

// ---- build ------------------------------------------------------------------

function build() {
  const readme = readFileSync(MAIN_README, 'utf8');
  const intro = parseIntro(readme);
  const phases = parsePhases(readme);
  const phaseByPlugin = pluginPhaseIndex(phases);

  // Order plugins by workflow phase (matching the "What's inside" flow), then
  // by their order within the phase heading — so Plugin details reads in the
  // same sequence as What's inside rather than alphabetically. Anything not
  // listed in a phase falls to the end, alphabetically.
  const phaseOrder = [];
  for (const ph of phases) for (const p of ph.plugins) if (!phaseOrder.includes(p)) phaseOrder.push(p);
  const orderKey = (name) => { const i = phaseOrder.indexOf(name); return i === -1 ? Number.MAX_SAFE_INTEGER : i; };
  const pluginDirs = readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => orderKey(a) - orderKey(b) || a.localeCompare(b));

  const plugins = [];
  for (const name of pluginDirs) {
    const md = readIfExists(join(PLUGINS_DIR, name, 'README.md'));
    if (!md) continue;
    const phase = phaseByPlugin[name] || null;

    // Read every skill's full SKILL.md (frontmatter + body) for the per-plugin
    // deep-dive pages. Ordered to match the plugin README's skill bullets.
    const skills = [];
    const skillsDir = join(PLUGINS_DIR, name, 'skills');
    if (existsSync(skillsDir)) {
      const dirs = readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
      for (const sd of skillOrder(md, dirs)) {
        const sm = readIfExists(join(skillsDir, sd, 'SKILL.md'));
        if (!sm) continue;
        const p = parseSkill(sm);
        skills.push({ dir: sd, name: p.name || sd, description: p.description || '', body: p.body });
      }
    }

    plugins.push({
      name,
      phase: phase ? phase.name : null,
      phaseNum: phase ? phase.num : null,
      vendored: isVendored(md),
      requirements: REQUIREMENTS[name] || [],
      readme: md.replace(/\s+$/, ''), // verbatim, trailing whitespace trimmed
      skills, // each: { dir, name, description, body } — full SKILL.md
    });
  }

  // Hash the sync's own code too, so a change to the parser or the renderer
  // (not just the READMEs) also flips the fingerprint and re-applies to Figma.
  const toolHash = createHash('sha256')
    .update(readFileSync(join(HERE, 'extract.mjs')))
    .update(readFileSync(join(HERE, 'render.figma.js')))
    .update(readFileSync(join(HERE, 'render-pages.figma.js')))
    .digest('hex');

  // Page plan for the per-plugin skill pages: plugin order + phase dividers.
  const pagePlan = { order: plugins.map((p) => p.name), dividers: [] };
  const seenPhase = new Map();
  for (const p of plugins) {
    const key = (p.phaseNum || '99') + '|' + (p.phase || 'Other');
    if (!seenPhase.has(key)) {
      const div = { name: `──  ${p.phaseNum} · ${p.phase}  ──`, plugins: [] };
      seenPhase.set(key, div);
      pagePlan.dividers.push(div);
    }
    seenPhase.get(key).plugins.push(p.name);
  }
  // Divider order follows the workflow phase number (01→11), not plugin-array
  // order — so a skill that straddles into an earlier phase (its plugin listed
  // under two phase headings) can't pull its home-phase divider out of sequence.
  pagePlan.dividers.sort((a, b) => a.name.localeCompare(b.name));

  const data = { generatedFrom: 'ai-ux-toolkit README files', intro, phases, plugins, pagePlan, toolHash };
  const fingerprint = createHash('sha256')
    .update(JSON.stringify({ intro, phases, plugins, tool: toolHash }))
    .digest('hex');
  data.fingerprint = fingerprint;
  return data;
}

// ---- main -------------------------------------------------------------------

const data = build();
if (process.argv.includes('--check')) {
  process.stdout.write(data.fingerprint + '\n');
} else {
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  const skillCount = data.phases.reduce((n, p) => n + p.skills.length, 0);
  process.stdout.write(
    `Wrote ${OUT}\n` +
      `  intro:   1 hero + ${data.intro.card.length} card paragraph(s)\n` +
      `  phases:  ${data.phases.length}\n` +
      `  skills:  ${skillCount} (rows in What's inside)\n` +
      `  plugins: ${data.plugins.length}\n` +
      `  fingerprint: ${data.fingerprint.slice(0, 16)}…\n`
  );
}
