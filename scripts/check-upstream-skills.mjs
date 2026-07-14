#!/usr/bin/env node
/**
 * check-upstream-skills.mjs
 *
 * Cross-references the vendored third-party skills against their upstream repo
 * and reports drift. Baseline + provenance live in .vendor/<name>.lock.json.
 *
 * Detects, per skill:
 *   - UPSTREAM CHANGED   upstream's file no longer matches our vendored copy
 *   - REMOVED UPSTREAM   upstream deleted/moved the file
 *   - LOCAL MODIFIED     our vendored copy no longer matches the lockfile hash
 * ...plus NEW UPSTREAM SKILLS (skills present upstream we haven't vendored).
 *
 * Usage:
 *   node scripts/check-upstream-skills.mjs [--lock <path>] [--report <path>] [--fail-on-drift]
 *
 * Exit code: 0 always, unless --fail-on-drift is passed and drift was found (then 1).
 * In GitHub Actions it also writes `drift=true|false` to $GITHUB_OUTPUT and the
 * report to $GITHUB_STEP_SUMMARY.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, existsSync, appendFileSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const failOnDrift = process.argv.includes("--fail-on-drift");
const lockPath = join(repoRoot, arg("--lock", ".vendor/designer-skills.lock.json"));
const reportPath = join(repoRoot, arg("--report", "upstream-sync-report.md"));

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const git = (args, cwd) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

const lock = JSON.parse(readFileSync(lockPath, "utf8"));
const { upstream } = lock;

// 1. Shallow-clone upstream at the tracked ref.
const work = mkdtempSync(join(tmpdir(), "vendor-check-"));
const clone = join(work, "upstream");
try {
  git(["clone", "--quiet", "--depth", "1", "--branch", upstream.ref, upstream.repo, clone]);
} catch (e) {
  console.error(`Failed to clone ${upstream.repo}@${upstream.ref}: ${e.message}`);
  process.exit(failOnDrift ? 1 : 0);
}
const currentCommit = git(["rev-parse", "HEAD"], clone);
const currentDate = git(["log", "-1", "--format=%cs"], clone);

// 2. Compare each vendored skill against upstream + against the lock hash.
const rows = [];
let drift = false;
for (const s of lock.skills) {
  const upPath = join(clone, s.upstream);
  const venPath = join(repoRoot, s.vendored);
  const venBuf = existsSync(venPath) ? readFileSync(venPath) : null;
  const upBuf = existsSync(upPath) ? readFileSync(upPath) : null;

  let status;
  if (!upBuf) {
    status = "REMOVED UPSTREAM";
  } else if (!venBuf) {
    status = "LOCAL MISSING";
  } else if (venBuf.equals(upBuf)) {
    status = sha256(venBuf) === s.sha256 ? "in sync" : "LOCAL MODIFIED"; // matches upstream but not the recorded baseline
  } else {
    status = sha256(venBuf) === s.sha256 ? "UPSTREAM CHANGED" : "BOTH CHANGED";
  }
  if (status !== "in sync") drift = true;

  let diff = "";
  if ((status === "UPSTREAM CHANGED" || status === "BOTH CHANGED") && upBuf && venBuf) {
    try {
      git(["diff", "--no-index", "--unified=2", venPath, upPath], repoRoot);
    } catch (e) {
      diff = (e.stdout || "").toString().split("\n").slice(0, 60).join("\n"); // git diff exits 1 on difference
    }
  }
  rows.push({ skill: s.upstream.replace("/SKILL.md", ""), vendored: s.vendored, status, diff });
}

// 3. New upstream skills we haven't vendored (top-level dirs containing SKILL.md).
const vendoredUpstreamDirs = new Set(lock.skills.map((s) => s.upstream.split("/")[0]));
const newSkills = readdirSync(clone, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith(".") && existsSync(join(clone, d.name, "SKILL.md")))
  .map((d) => d.name)
  .filter((name) => !vendoredUpstreamDirs.has(name));
if (newSkills.length) drift = true;

// 4. Build the report.
const behind = lock.synced.commit === currentCommit ? "" :
  ` — you are behind (vendored \`${lock.synced.commit.slice(0, 7)}\`, upstream now \`${currentCommit.slice(0, 7)}\`, ${currentDate})`;
const icon = { "in sync": "✅", "UPSTREAM CHANGED": "🔶", "BOTH CHANGED": "🔷", "LOCAL MODIFIED": "✏️", "REMOVED UPSTREAM": "❌", "LOCAL MISSING": "⚠️" };

let md = `# Upstream sync — ${upstream.name}\n\n`;
md += `Source: [${upstream.repo}](${upstream.repo}) @ \`${upstream.ref}\` (${upstream.license})\n`;
md += `Vendored from \`${lock.synced.commit.slice(0, 7)}\` (${lock.synced.date}); upstream HEAD \`${currentCommit.slice(0, 7)}\` (${currentDate})${behind}.\n\n`;
md += drift ? `**Drift detected — review below.**\n\n` : `**Everything is in sync.** No action needed.\n\n`;
md += `| Skill | Vendored path | Status |\n|---|---|---|\n`;
for (const r of rows) md += `| \`${r.skill}\` | \`${r.vendored}\` | ${icon[r.status] || ""} ${r.status} |\n`;
if (newSkills.length) {
  md += `\n### New upstream skills (not vendored)\n\n`;
  for (const n of newSkills) md += `- \`${n}\` — consider vendoring, or ignore if intentionally excluded.\n`;
}
const diffs = rows.filter((r) => r.diff);
if (diffs.length) {
  md += `\n### Diffs (vendored → upstream)\n`;
  for (const r of diffs) md += `\n<details><summary><code>${r.skill}</code></summary>\n\n\`\`\`diff\n${r.diff}\n\`\`\`\n</details>\n`;
}
md += `\n---\n`;
md += drift
  ? `To resync: re-copy the changed upstream files into their vendored paths (keep them verbatim), then update \`.vendor/${upstream.name}.lock.json\` (\`synced.commit\`, \`synced.date\`, and the per-file \`sha256\`). Re-run this check to confirm.\n`
  : `Re-run any time with \`node scripts/check-upstream-skills.mjs\`.\n`;

// 5. Emit.
writeFileSync(reportPath, md);
process.stdout.write(md);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `drift=${drift}\n`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);

process.exit(drift && failOnDrift ? 1 : 0);
