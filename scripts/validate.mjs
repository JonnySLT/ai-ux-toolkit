#!/usr/bin/env node
/**
 * validate.mjs — structural integrity check for the ai-ux-toolkit marketplace.
 *
 * Run: node scripts/validate.mjs   (exit 0 = clean, 1 = problems found)
 * CI:  invoked by .github/workflows/validate.yml on push / PR.
 *
 * Checks: JSON validity, marketplace ↔ filesystem consistency, triple name
 * match (dir = plugin.json.name = marketplace entry), no orphan dirs, every
 * plugin has ≥1 skill, SKILL.md frontmatter (name matches dir, description
 * present and ≤1024 chars), no duplicate skill names, vendored plugins carry an
 * Apache LICENSE + license fields, README has an install line per plugin, and no
 * broken in-page README anchors. Pure structural — no network.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = (...a) => join(ROOT, ...a);
const problems = [];
const fail = (m) => problems.push(m);

const VENDORED = new Set([
  "design-planning", "information-architecture", "design-tokens", "frontend-design", "design-review",
]);

// --- marketplace ---
let mkt;
try {
  mkt = JSON.parse(readFileSync(P(".claude-plugin/marketplace.json"), "utf8"));
} catch (e) {
  fail(`marketplace.json invalid JSON: ${e.message}`);
}

const allSkills = [];
if (mkt) {
  const entryNames = mkt.plugins.map((p) => p.name);
  entryNames.filter((n, i) => entryNames.indexOf(n) !== i).forEach((n) => fail(`duplicate marketplace entry: ${n}`));

  const pluginDirs = readdirSync(P("plugins")).filter((d) => statSync(P("plugins", d)).isDirectory());
  const listed = new Set(entryNames);
  pluginDirs.filter((d) => !listed.has(d)).forEach((d) => fail(`plugin dir "${d}" not listed in marketplace`));

  for (const p of mkt.plugins) {
    for (const k of ["name", "source", "description", "version"]) if (!p[k]) fail(`marketplace ${p.name || "?"}: missing "${k}"`);
    const src = String(p.source || "").replace("./", "");
    if (!existsSync(P(src))) { fail(`${p.name}: source path missing (${p.source})`); continue; }

    const pjPath = P(src, ".claude-plugin/plugin.json");
    if (!existsSync(pjPath)) { fail(`${p.name}: no plugin.json`); continue; }
    let pj;
    try { pj = JSON.parse(readFileSync(pjPath, "utf8")); } catch (e) { fail(`${p.name}: plugin.json invalid JSON: ${e.message}`); continue; }

    if (pj.name !== p.name) fail(`${p.name}: plugin.json name "${pj.name}" != marketplace entry`);
    if (pj.name !== src.split("/").pop()) fail(`${p.name}: plugin.json name != directory`);
    for (const k of ["name", "version", "description"]) if (!pj[k]) fail(`${p.name}: plugin.json missing "${k}"`);
    if (!existsSync(P(src, "README.md"))) fail(`${p.name}: no README.md`);

    if (VENDORED.has(p.name)) {
      if (p.license !== "Apache-2.0") fail(`${p.name}: marketplace license != Apache-2.0`);
      if (pj.license !== "Apache-2.0") fail(`${p.name}: plugin.json license != Apache-2.0`);
      const lic = P(src, "LICENSE");
      if (!existsSync(lic)) fail(`${p.name}: vendored plugin missing LICENSE`);
      else if (!readFileSync(lic, "utf8").includes("Apache License")) fail(`${p.name}: LICENSE is not Apache`);
    }

    const skillsDir = P(src, "skills");
    if (!existsSync(skillsDir)) { fail(`${p.name}: no skills/ directory`); continue; }
    const skills = readdirSync(skillsDir).filter((s) => existsSync(join(skillsDir, s, "SKILL.md")));
    if (!skills.length) fail(`${p.name}: no skills`);
    for (const s of skills) {
      const txt = readFileSync(join(skillsDir, s, "SKILL.md"), "utf8");
      const fm = txt.match(/^---\n([\s\S]*?)\n---/);
      if (!fm) { fail(`${p.name}/${s}: no valid frontmatter`); continue; }
      const nameM = fm[1].match(/^name:\s*(.+)$/m);
      const name = nameM ? nameM[1].trim() : null;
      if (name !== s) fail(`${p.name}/${s}: frontmatter name "${name}" != directory`);
      // description: inline or block scalar (>)
      let desc = "";
      const inline = fm[1].match(/^description:\s*(?!>)(.+)$/m);
      const block = fm[1].match(/^description:\s*>[-]?\s*\n((?:[ \t]+.+\n?)+)/m);
      if (inline) desc = inline[1].trim();
      else if (block) desc = block[1].replace(/\s+/g, " ").trim();
      if (!desc) fail(`${p.name}/${s}: empty description`);
      else if (desc.length > 1024) fail(`${p.name}/${s}: description ${desc.length} chars > 1024`);
      allSkills.push(s);
    }
  }

  allSkills.filter((n, i) => allSkills.indexOf(n) !== i).forEach((n) => fail(`duplicate skill name: ${n}`));

  // --- README ---
  const rme = readFileSync(P("README.md"), "utf8");
  for (const n of entryNames) if (!rme.includes(`/plugin install ${n}@ai-ux-toolkit`)) fail(`README: no install line for ${n}`);
  const slug = (h) => h.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-");
  const heads = new Set((rme.match(/^#{1,4} .+$/gm) || []).map((h) => slug(h.replace(/^#+ /, ""))));
  const links = [...new Set((rme.match(/\]\(#([a-z0-9-]+)\)/g) || []).map((s) => s.replace(/\]\(#|\)/g, "")))];
  links.filter((l) => !heads.has(l)).forEach((l) => fail(`README: broken in-page anchor #${l}`));
}

// --- report ---
if (problems.length) {
  console.error(`✖ ${problems.length} problem(s):\n` + problems.map((m) => "  - " + m).join("\n"));
  process.exit(1);
}
console.log(`✓ marketplace valid — ${mkt.plugins.length} plugins, ${allSkills.length} skills, no problems.`);
