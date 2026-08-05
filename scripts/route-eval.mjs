#!/usr/bin/env node
/**
 * route-eval.mjs — measure skill-routing accuracy for the toolkit's descriptions.
 *
 * For each test prompt, a fresh blind `claude -p` call sees ONLY the skill
 * names + descriptions (the same signal Claude Code uses at selection time)
 * and must pick one skill. The script reports which skill won per prompt and
 * an overall accuracy score. Use it after adding a skill or editing a
 * description to check routing still lands — especially across the overlap
 * clusters (review lenses, research front/back, metrics trio, prototype pair,
 * copy trio, define artifacts).
 *
 * Run:   node scripts/route-eval.mjs          (from the repo root)
 * Needs: the `claude` CLI on PATH. Each prompt = one model call (~20 calls,
 *        a few minutes, real token usage). Calls are spaced 1.5s apart.
 *
 * Notes on reading results:
 * - The judge may answer NONE ("no skill needed") — a single NONE on retest
 *   is usually sampling noise / the known undertriggering tendency, not a
 *   description gap. Rerun the prompt a few times before editing anything.
 * - Descriptions of the 5 vendored skills are sync-locked (see
 *   .vendor/designer-skills.lock.json); fix routing issues involving them by
 *   editing OUR skills' boundary lines, not theirs.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Build the catalog: every skill's name + description (the real routing signal).
const cat = [];
for (const p of readdirSync(join(ROOT, "plugins"))) {
  const sdir = join(ROOT, "plugins", p, "skills");
  if (!existsSync(sdir)) continue;
  for (const s of readdirSync(sdir)) {
    const f = join(sdir, s, "SKILL.md");
    if (!existsSync(f)) continue;
    const fm = readFileSync(f, "utf8").match(/^---\n([\s\S]*?)\n---/)[1];
    const inl = fm.match(/^description:\s*(?!>)(.+)$/m);
    const blk = fm.match(/^description:\s*>[-]?\s*\n((?:[ \t]+.+\n?)+)/m);
    const d = inl ? inl[1].trim() : blk ? blk[1].replace(/\s+/g, " ").trim() : "";
    cat.push({ name: s, desc: d });
  }
}
const names = new Set(cat.map((c) => c.name));
const catalog = cat.map((c) => `- ${c.name}: ${c.desc}`).join("\n");

// [expected skill, realistic prompt] — weighted toward the overlap-prone clusters.
const tests = [
  ["accessibility-check", "our new checkout screen is built — can you check the color contrast and that all the form fields have proper labels before we ship it?"],
  ["heuristic-review", "before this dashboard goes to eng, walk it against nielsen's 10 heuristics and flag the usability issues by severity"],
  ["design-review", "here's the figma for the settings redesign — give me an overall critique against our brief: visual hierarchy, consistency, does it feel polished"],
  ["usability-testing", "i want to put the onboarding flow in front of 5 real users and watch where they get stuck, then analyze the results"],
  ["inclusive-design", "how do i design this signup form to be accessible from the start for screen-reader and keyboard users?"],
  ["research-planning", "write me the moderator script and task list for a usability test of our new billing page"],
  ["research-synthesis", "i've got notes from 6 usability sessions and 20 support tickets — pull out the top themes and pain points"],  ["research-planning", "draft a stakeholder interview guide for our project kickoff next week"],
  ["success-metrics", "we're about to build a new onboarding flow — what should we measure to know if it actually worked?"],
  ["measurement-plan", "the checkout redesign shipped 3 weeks ago and here's the funnel data — did it improve conversion?"],
  ["experimentation", "i want to A/B test the new green CTA button against the current one — how many users do i need and how do i read the result?"],
  ["rapid-prototype", "turn this rough idea into something clickable i can test the interaction with — doesn't need to look pretty"],
  ["frontend-design", "build a polished, production-ready pricing page component for our marketing site"],
  ["content-design", "what should the error message say when someone's payment fails at checkout?"],
  ["brand-voice-tone", "does this onboarding copy sound like us? rewrite it to match our brand voice"],
  ["divergent-exploration", "give me 10 different options for the headline on our landing page hero"],
  ["personas", "turn our interview findings into 2-3 evidence-based personas"],
  ["journey-map", "map the end-to-end experience of a first-time buyer, including the emotional highs and lows"],  ["prompt-builder", "before i ask you to redesign this page, help me write a prompt that gives you all the context you need"],
  ["prompt-builder", "here's the prompt i was going to run — can you improve it so nothing important is missing?"],
];

const ask = (prompt) => {
  const full = `You are routing a user's request to exactly ONE skill from this catalog. Pick the single best-fit skill.\n\nSkills:\n${catalog}\n\nUser request: "${prompt}"\n\nReply with ONLY the skill name (or NONE). No other text.`;
  try {
    const out = execSync("claude -p", { input: full, encoding: "utf8", maxBuffer: 1e7, timeout: 120000 }).trim();
    if (/hit your limit/i.test(out)) return "RATE_LIMITED";
    // longest names first so e.g. usability-testing matches before a shorter substring
    return [...names].sort((a, b) => b.length - a.length).find((n) => out.toLowerCase().includes(n)) || "NONE";
  } catch (e) {
    if (/hit your limit/i.test((e.stdout || e.message || "").toString())) return "RATE_LIMITED";
    return "ERROR";
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, errors = 0;
for (let i = 0; i < tests.length; i++) {
  const [expected, prompt] = tests[i];
  const pick = ask(prompt);
  if (pick === "RATE_LIMITED") { console.log(`⏸ rate-limited at test ${i + 1} — stopping early`); break; }
  const ok = pick === expected;
  if (ok) pass++; else if (pick === "ERROR") errors++;
  console.log(`${ok ? "✅" : "❌"}  expected ${expected.padEnd(22)} got ${pick.padEnd(22)} | ${prompt.slice(0, 55)}`);
  await sleep(1500);
}
console.log(`\nRouting accuracy: ${pass}/${tests.length} (${Math.round((pass / tests.length) * 100)}%)${errors ? ` — ${errors} call error(s)` : ""}`);
console.log("A single ❌ where the judge said NONE is often sampling noise — rerun that prompt a few times before editing a description.");
