#!/usr/bin/env node
/**
 * extract.mjs — Turn the repo's own README files into a single structured
 * data file (`toolkit-data.json`) that the Figma renderer consumes.
 *
 * The repo is the source of truth. This script derives, deterministically:
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

// ---- build ------------------------------------------------------------------

function build() {
  const readme = readFileSync(MAIN_README, 'utf8');
  const phases = parsePhases(readme);
  const phaseByPlugin = pluginPhaseIndex(phases);

  const pluginDirs = readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const plugins = [];
  for (const name of pluginDirs) {
    const md = readIfExists(join(PLUGINS_DIR, name, 'README.md'));
    if (!md) continue;
    const phase = phaseByPlugin[name] || null;
    plugins.push({
      name,
      phase: phase ? phase.name : null,
      phaseNum: phase ? phase.num : null,
      vendored: isVendored(md),
      requirements: REQUIREMENTS[name] || [],
      readme: md.replace(/\s+$/, ''), // verbatim, trailing whitespace trimmed
    });
  }

  const data = { generatedFrom: 'ai-ux-toolkit README files', phases, plugins };
  const fingerprint = createHash('sha256')
    .update(JSON.stringify({ phases, plugins }))
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
      `  phases:  ${data.phases.length}\n` +
      `  skills:  ${skillCount} (rows in What's inside)\n` +
      `  plugins: ${data.plugins.length}\n` +
      `  fingerprint: ${data.fingerprint.slice(0, 16)}…\n`
  );
}
