---
name: research-repository
description: Make research findable and reusable over time — set up and maintain a research repository of atomic insights. Defines a tagging taxonomy, breaks studies into atomic, evidence-linked insights, deduplicates and merges across studies, and surfaces cross-study patterns so past research isn't lost or re-run. The ResearchOps layer on top of research-synthesis. Trigger when the user wants to "organise research", "build a research repository", "tag insights", "atomic research / atomic insights", "make research findable", "insight taxonomy", or manage findings across many studies.
---

Stop research from evaporating after the readout. Individual studies get synthesised (that's `research-synthesis`); this skill is the layer above — turning findings into **atomic, tagged, evidence-linked insights** that accumulate into a searchable body of knowledge, so teams reuse what's known instead of re-running it or losing it in old decks.

## Example prompts

- "Set up a research repository / insight taxonomy for us"
- "Turn these study findings into atomic insights"
- "Tag and organise our past research"
- "What do we already know about onboarding across studies?"

---

## Mode 0 — Which job?

Detect: **set up** a repository structure/taxonomy, **atomise** a study into insights, or **query/synthesise across** existing insights. Do the relevant part.

---

## Set up the structure

- **Atomic insight format** — the unit of the repo. Each insight = a single, self-contained finding: a **statement** (what's true), **evidence** (verbatim quotes / data, with source & study), **confidence** (strength of evidence), **tags**, and **date/study** provenance.
- **Tagging taxonomy** — design a small, consistent set of facets rather than freeform tags: e.g. **topic/theme**, **journey stage / feature area**, **persona/segment**, **method/study**, **severity/opportunity**. Keep it controlled (a defined vocabulary) so tags stay useful; document it.
- **Governance** — naming conventions, how new tags are added, review cadence, and how insights are marked stale/superseded.

## Atomise a study

- Break a synthesis (or raw study) into discrete atomic insights — one finding each, no compound claims.
- Attach verbatim evidence + source IDs (never fabricate), confidence, and taxonomy tags.
- Link each insight back to its study for traceability.

## Query & synthesise across studies

- Pull insights by tag/facet to answer "what do we know about X?".
- **Deduplicate & merge** — combine insights that say the same thing across studies (strengthening confidence), and flag **contradictions** between studies (a valuable signal — often a segment or time difference).
- Surface **cross-study patterns** and note gaps where evidence is thin or missing (feeds `research-planning` for the next study).

---

## Output format

- **Setup** — the atomic-insight template + the tagging taxonomy (facets and their controlled values) + governance notes, as markdown ready to drop into a repo/wiki/Notion.
- **Atomised study** — a list/table of atomic insights (statement · evidence+source · confidence · tags · study).
- **Cross-study query** — the matching insights, merged/deduped, with contradictions and gaps called out.

Keep it tool-agnostic (works for a spreadsheet, Notion, Dovetail, or a markdown folder). Pairs with `research-synthesis` (produces the findings) and `research-planning` (fills the gaps you find).

---

## Guardrails

- **Evidence-linked, never fabricated.** Every insight ties to real quotes/data and a source study; confidence reflects evidence strength.
- **Atomic means atomic.** One finding per insight — compound claims can't be tagged or reused cleanly.
- **Controlled vocabulary.** A small consistent taxonomy beats sprawling freeform tags; resist tag proliferation.
- **Surface contradictions, don't average them.** Conflicting findings across studies are signal (segment/time), not noise to smooth over.
- **Keep it current.** Mark stale/superseded insights; an out-of-date repository quietly misleads.
- **Mind privacy.** Store insights and quotes without participant PII.
