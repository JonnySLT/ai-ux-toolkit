---
name: research-synthesis
description: Synthesise messy qualitative research into themes and patterns. Takes interview transcripts, survey responses, support tickets, sales-call notes, or usability-test observations (pasted or as file paths) and surfaces recurring themes, representative verbatim quotes, frequency and severity, and prioritised opportunity areas — the coding pass that would take hours by hand. Trigger when the user wants to synthesise research, "find themes", "code these transcripts", "what are people saying?", analyse feedback/tickets/survey results, or mentions "research synthesis" or "affinity mapping".
---

Turn a pile of qualitative data into a structured, evidence-backed set of themes. This is a **first coding pass**, not a substitute for the researcher's judgement — it finds threads fast so a human can validate, weigh, and decide.

## Example prompts

- "Synthesise these 8 interview transcripts"
- "What themes are in this survey's open-text responses?"
- "Code this batch of support tickets and tell me the top pain points"
- "Here are my usability-test notes — what patterns do you see?"

---

## Step 0 — Intake the data (required first)

Before analysing, establish:

1. **What's the source?** Interviews, survey open-text, support tickets, sales calls, usability sessions, app-store reviews — the source type changes how you read it (a ticket is a reported problem; an interview answer is a self-report).
2. **Where is it?** Pasted inline, or file paths (`.txt`, `.md`, `.csv`, `.vtt`/transcript exports, `.json`). Read every file before starting. If a connected source is named (Intercom, Granola, a Drive folder), pull it via the relevant MCP if available; otherwise ask the user to export.
3. **What's the question?** "General themes" is fine, but if they have a focus ("why are people churning?", "friction in onboarding") let that steer the coding.
4. **Any segments?** Persona, plan tier, tenure, role — capture if present so themes can be sliced later.

If the user already supplied the data and a focus in their prompt, skip the questions and confirm your read of the source type in one line.

---

## Process

### Step 1 — Normalise & assign source IDs

Split the corpus into discrete units (one participant, one ticket, one response). Assign each a stable short ID — `P1`–`Pn` for people, `T1`–`Tn` for tickets, `R1`–`Rn` for responses. Every quote and count later traces back to these IDs. Strip names, emails, and other PII as you go — refer to sources only by ID and, if useful, segment.

### Step 2 — Open-code

Read each unit and tag the specific observations in it (short, concrete codes — "couldn't find export", "expected autosave", "price felt high for team size"). Stay close to the source's own words; don't jump to solutions yet. A single unit can carry several codes.

### Step 3 — Cluster into themes (affinity)

Group related codes into themes. A theme is a pattern that recurs across **multiple sources** — name it as a plain statement of what's happening ("Users expect their work to save automatically"), not a vague bucket ("Saving"). Keep a theme tight; split it if it's really two ideas.

### Step 4 — Attach evidence

For each theme, pull 1–3 **verbatim** quotes with their source IDs. Quote exactly — never paraphrase into quotation marks, never invent or composite. If a theme has only one weak mention, keep it but mark it as thin evidence rather than inflating it.

### Step 5 — Rate frequency & severity

- **Frequency** — how many distinct sources raised it (e.g. "7 / 12 participants"). Count sources, not mentions, so one loud voice doesn't dominate.
- **Severity** — how much it hurts the user when it occurs: `high` (blocks the task / drives churn), `medium` (friction, workaround exists), `low` (annoyance / preference). Frequency × severity is what makes something worth acting on — a rare blocker can still outrank a common annoyance.

### Step 6 — Frame opportunities

For each significant theme, add a neutral opportunity framing — a "How might we…" or a plain problem statement. Keep it a problem to solve, not a pre-picked solution, so the design work stays open.

### Step 7 — Prioritise & surface the through-lines

Rank themes by frequency × severity. Then step back and name the 3–5 **top insights** — the cross-cutting stories the individual themes add up to. Flag any surprises, contradictions between segments, or notable outliers worth a closer look.

---

## Output format

Deliver in this order:

**1. Themes table**

| Theme | Frequency | Severity | Evidence | Opportunity |
|---|---|---|---|---|
| Users expect work to autosave | 7 / 12 | High | "I lost a whole draft — I assumed it saved" (P3); "why is there even a save button?" (P9) | HMW reassure users their work is safe without a manual save step |

**2. Top insights** — 3–5 short paragraphs naming the through-lines and what they imply.

**3. Recommended next steps** — concrete, prioritised: what to fix now, what to investigate further (thin-evidence themes), what to validate with more research.

Optionally, if the user asked to **push to Figma**, load the `/figma:figma-use` skill and create a `_Doc/Research Synthesis` page mirroring the foundation-page format (title block, themes table, top insights, next steps), using the file's own design-system text styles and colour variables.

---

## Guardrails

- **Never fabricate quotes or numbers.** Every quote is verbatim with a source ID; every count is real. If evidence is thin, say so.
- **Count sources, not mentions.** Frequency reflects how many people/tickets, so a single repetitive source can't manufacture a theme.
- **Keep PII out.** IDs and segments only — no names, emails, company names, or other identifying detail in the output.
- **Stay descriptive before prescriptive.** Report what the data says; frame opportunities as problems, not chosen solutions.
- **Small sample ≠ significance.** Flag when the corpus is small; qualitative themes are directional, not statistical.
