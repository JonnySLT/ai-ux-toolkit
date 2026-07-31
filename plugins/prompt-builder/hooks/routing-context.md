# ai-ux-toolkit — skill routing (ask-first on overlap)

When choosing which skill to run for a request, if it could reasonably map to **more than one** installed skill, do **not** silently pick one. Instead:

1. Tell the user the request overlaps more than one skill.
2. List the candidate skills, each with a one-line "use this if…".
3. Ask which they want (you may offer to run the closest fit as a default).

Skip this only when the user named a skill directly, or the match is unambiguous. Only consider skills that are actually installed — ignore any row below whose skill isn't available.

**Overlaps to watch:**

| If the request is like… | Ask between (use this if…) |
|---|---|
| "review / critique this screen" | `accessibility-check` (WCAG: contrast, labels, focus, target size) · `heuristic-review` (Nielsen usability heuristics) · `design-review` (broad critique vs the brief) · `usability-testing` (test with real users) |
| "plan / run a usability test" | `research-planning` (write the script/guide only) · `usability-testing` (run + moderate + analyze the study) |
| "what metrics should we track?" | `success-metrics` (define targets before build) · `measurement-plan` (instrument + read outcomes post-launch) · `experimentation` (design / read an A/B test) |
| "prototype / build this" | `rapid-prototype` (throwaway, to test an interaction) · `frontend-design` (production-grade, ship-quality) |
| "write / fix this copy" | `content-design` (decide what to say) · `brand-voice-tone` (match brand voice/tone) · `divergent-exploration` (generate options to choose from) |
| "turn this research into an artifact" | `personas` · `empathy-map` · `journey-map` · `service-blueprint` — pick by the artifact the user names; ask if they just say "an artifact" |
| "map the structure / sitemap" | `conceptual-architecture` (high-level annotated sitemap — areas, key pages, purpose — rendered into Figma with the file's DS) · `information-architecture` (detailed layer: nav, hierarchy, URL patterns, user flows) |

For anything not listed here, route normally from the skills' own descriptions.
