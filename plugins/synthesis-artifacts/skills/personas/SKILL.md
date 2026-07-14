---
name: personas
description: Build evidence-based personas and Jobs-to-be-Done statements from real research, not invented demographics. Clusters research participants into archetypes defined by goals, behaviours, needs, and pain points, and writes JTBD statements ("when… I want to… so I can…") tied to evidence. Flags when the data is too thin to support a persona. Trigger when the user wants to "create personas", "build a persona", "write JTBD / jobs-to-be-done statements", turn research into personas, or define user archetypes.
---

Turn synthesised research into personas and Jobs-to-be-Done that a team can actually design against. A useful persona is a **behavioural archetype grounded in evidence** — not a stock photo with an age and a coffee preference. If the research can't support it, say so.

## Example prompts

- "Create personas from these interview findings"
- "Turn this research synthesis into 2–3 personas"
- "Write JTBD statements for our onboarding research"

---

## Step 0 — Ground in evidence (required first)

Personas are only as good as their inputs. Establish:
1. **What's the source?** Ideally the output of `research-synthesis` (themes + evidence) or raw research. **Personas invented without data are worse than none** — they launder assumptions as fact. If there's no research, offer instead to build a clearly-labelled *provisional / proto-persona* (explicitly marked as a hypothesis to validate).
2. **How many archetypes?** Distinct behaviour patterns drive the count — usually **2–4**. Don't split on demographics that don't change behaviour.
3. **What decision will they serve?** Personas exist to align design and prioritisation; keep them focused on what affects product choices.

---

## Process

1. **Cluster by behaviour and goals.** Group research participants by what they're trying to do, how they do it, and what gets in the way — not by age/role alone. A persona = a recurring pattern across multiple sources.
2. **Define each persona** with the attributes that change design decisions:
   - **Goals** — what they're ultimately trying to achieve.
   - **Behaviours & context** — how they work today, tools, frequency, environment.
   - **Needs & motivations** — what drives them.
   - **Pain points & frustrations** — where the current experience fails them (with evidence).
   - **Key JTBD** — the core jobs this persona hires the product for.
   - A **representative quote** (verbatim, with source) that captures them.
   - A short **name + descriptor** (role/behavioural label, e.g. "Priya, the time-pressed admin") — memorable, not a stereotype.
3. **Write JTBD statements** in the form: **"When [situation], I want to [motivation], so I can [expected outcome]."** Keep them solution-agnostic (a job, not a feature) and tie each to evidence.
4. **Note anti-personas / non-targets** if useful — who this is explicitly *not* for.
5. **Rate confidence** per persona based on evidence strength; flag thin ones as provisional.

---

## Output format

For each persona: name + descriptor, a one-line summary, then Goals / Behaviours & context / Needs & motivations / Pain points / Key JTBD / representative quote / confidence. Follow with a consolidated **JTBD list** across personas.

Keep it tight and decision-useful — a page per persona at most. Offer to save as markdown, feed into the `design-planning` brief, or (if wanted) lay out as a Figma doc page using the file's own text styles.

---

## Guardrails

- **No fabricated data.** Every goal, pain point, and quote traces to research. Never invent demographics, names of real people, or statistics.
- **Behaviour over demographics.** Split personas on what changes their needs, not on age/gender/title for its own sake.
- **Flag thin evidence.** If the research supports one archetype, make one. Mark provisional personas clearly as hypotheses to validate.
- **Avoid stereotypes.** Descriptors describe behaviour and context, not clichés.
- **Personas are a tool, not decoration.** If they won't inform a decision, say so rather than producing filler.
