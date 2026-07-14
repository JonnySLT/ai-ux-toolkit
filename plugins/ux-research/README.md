# ux-research

- **research-synthesis** — feed in interview transcripts, survey responses, or support tickets and get back themes, patterns, representative quotes, frequency/severity, and prioritised opportunity areas.
- **research-repository** — the ResearchOps layer: set up a research repository of atomic, tagged, evidence-linked insights (with a tagging taxonomy), so past research stays findable and reusable across studies instead of being lost or re-run.

**Project-agnostic:** nothing about the domain is baked in. The skill reads whatever qualitative data you point it at (pasted text or file paths) and adapts to the source type. It never invents quotes and keeps participant PII out of the output.

No external services required. Can optionally push a synthesis summary into a Figma doc page (needs the Figma MCP server). Triggers from natural language ("synthesise these interviews", "what themes are in this feedback?").

Install: `/plugin install ux-research@ai-ux-toolkit`
