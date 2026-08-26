# highlight-reels

- **highlight-reels** — take timestamped interview or usability transcripts plus a frozen finding list and get back candidate video clips (session, finding, in/out, verbatim, and a Supports/Contradicts valence) as paste-ready rows for the highlight-reel workbook, ready to cut into short quote-montages — one reel per finding.

**Project-agnostic:** nothing about the domain is baked in. The skill reads whatever transcripts and findings you point it at and adapts to the source. It never invents a quote or a timecode, deliberately surfaces counter-evidence alongside supporting clips, and logs emergent patterns the findings don't cover separately.

Pairs with `research-synthesis` (which produces the findings) on the front end and a transcript-based video editor on the back end (which cuts and assembles the reels). No external services required to find the clips; the video tool is where they're assembled. Triggers from natural language ("pull clips for these findings", "make a highlight reel", "find quotes that back this finding").

Install: `/plugin install highlight-reels@ai-ux-toolkit`
