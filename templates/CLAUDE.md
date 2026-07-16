<!--
ai-ux-toolkit — skill-routing hints for Claude Code.

HOW TO USE: copy this file into YOUR project's root as `CLAUDE.md`, or append the
"Skill routing" section below to your existing `CLAUDE.md`. Claude Code auto-loads
`CLAUDE.md` into context, so these rules are read at skill-selection time — which is
why they steer routing when the plain README (which Claude doesn't load) cannot.

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
| "what metrics should we track?" | `success-metrics` (define targets before build) · `measurement-plan` (instrument + read outcomes post-launch) · `experimentation` (design / read an A/B test) |
| "prototype / build this" | `rapid-prototype` (throwaway, to test an interaction) · `frontend-design` (production-grade, ship-quality) |
| "write / fix this copy" | `content-design` (decide what to say) · `brand-voice-tone` (match brand voice/tone) · `divergent-exploration` (generate options to choose from) |
| "turn this research into an artifact" | `personas` · `empathy-map` · `journey-map` · `service-blueprint` — pick by the artifact the user names; ask if they just say "an artifact" |

For anything not listed here, route normally from the skills' own descriptions.
