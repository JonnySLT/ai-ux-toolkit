<!--
ai-ux-toolkit — skill-routing hints for Claude Code.

YOU PROBABLY DON'T NEED THIS FILE. The `prompt-builder` plugin ships this exact
routing behavior as a SessionStart hook, so once prompt-builder is installed
ask-first routing works automatically — no setup, in every session and project.

This template is only a MANUAL ALTERNATIVE, for when you want to:
  • scope routing to a single project — put this in that project's ./CLAUDE.md; or
  • customize the overlap rows by hand; or
  • get the behavior without installing prompt-builder.
To use it manually, append the "Skill routing" section below to your GLOBAL user
memory at ~/.claude/CLAUDE.md (or a project ./CLAUDE.md):
  • macOS/Linux:  cat this section >> ~/.claude/CLAUDE.md   (create the file if absent)

This makes Claude ASK which skill you want, and name the overlap, instead of
silently picking one. Delete any rows for plugins you didn't install.
-->

## Skill routing (ai-ux-toolkit)

Before using a skill: if the request could reasonably map to **more than one** skill, do **not** silently pick one. Instead —

1. Tell the user their request overlaps more than one skill.
2. List the candidate skills, each with a one-line "use this if…".
3. Ask which they want (you may offer to run the closest fit as a default).

Skip this only when the user named a skill directly, or the match is unambiguous.

**Overlaps to watch:**

| If the request is like… | Ask between (use this if…) |
|---|---|
| "review / critique this screen" | `accessibility-check` (WCAG: contrast, labels, focus, target size) · `heuristic-review` (Nielsen usability heuristics) · `design-review` (broad critique vs the brief) · `usability-testing` (test with real users) |
| "plan / run a usability test" | `research-planning` (write the script/guide only) · `usability-testing` (run + moderate + analyze the study) |
| "pull themes / clips out of these transcripts" | `research-synthesis` (find the findings — themes, insights, opportunities) · `highlight-reels` (find the video moments for findings you already have) |
| "what metrics should we track?" | `success-metrics` (define targets before build) · `measurement-plan` (instrument + read outcomes post-launch) · `experimentation` (design / read an A/B test) |
| "prototype / build this" | `rapid-prototype` (throwaway, to test an interaction) · `frontend-design` (production-grade, ship-quality) |
| "write / fix this copy" | `content-design` (decide what to say) · `brand-voice-tone` (match brand voice/tone) · `divergent-exploration` (generate options to choose from) |
| "turn this research into an artifact" | `personas` · `journey-map` — pick by the artifact the user names; ask if they just say "an artifact" |
| "map the structure / sitemap" | `conceptual-architecture` (high-level annotated sitemap — areas, key pages, purpose — rendered into Figma with the file's DS) · `information-architecture` (detailed layer: nav, hierarchy, URL patterns, user flows) |

For anything not listed here, route normally from the skills' own descriptions.

## House document voice — SLT (ai-ux-toolkit)

<!-- prompt-builder injects this same rule via its SessionStart hook; this is the manual mirror. -->

Write every **document / deliverable** in the SLT (Straight Line Theory) voice — research plans & guides, synthesis, competitive analyses, personas, journey maps, success metrics, design briefs, task breakdowns, IA, component specs, design-system docs, changelog entries, measurement/experiment plans, briefing prompts.

**Do NOT apply it to UI / screen copy** — button labels, empty states, errors, onboarding, and any text inside a designed screen or prototype follow the **project's brand voice** (`brand-voice` plugin). So `content-design`, `states-and-edge-cases`, and text produced while building screens (`figma-design-system`, `frontend-design`, `rapid-prototype`) use the brand voice. Rule of thumb: **words inside the product → brand voice; words in a document about the work → SLT voice.**

SLT voice = **"quiet excellence"**: confident without announcing itself; a trusted senior colleague — warm, direct, useful; never performative or cold. Attributes: **affable, conversational, straightforward, perceptive, smart** (each without tipping into slick/folksy/blunt/cutting/boastful). Principles: lead with what matters; active voice; one idea per sentence; plain language; be specific (show, don't tell); no unsubstantiated superlatives; contractions; consistent terms; Oxford comma; B2B/UX caps. The test: *would a trusted senior colleague say it this way in a meeting?*
