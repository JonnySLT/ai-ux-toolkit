---
name: usability-testing
description: Run a usability study end-to-end with real users — plan it, moderate it, and analyse the results. Builds a test plan (objectives, realistic tasks with success criteria, metrics like task success, time, error rate, SEQ/SUS), gives moderation guidance, and turns session data into a findings report with task-level metrics and severity-rated issues. The empirical counterpart to expert audits. (To only draft an interview or usability script without running the study, use research-planning.) Trigger when the user wants to "plan/run a usability test", "analyse usability test results", "moderate a session", "rate usability issue severity", or measure whether users can actually complete tasks.
---

Find out whether real people can actually use the thing. Usability testing observes users attempting real tasks and measures where they succeed, struggle, or fail. This skill covers the whole study — **plan → moderate → analyse** — and is method-specific: it deals in tasks, success criteria, and usability metrics, where an expert `heuristic-review` or `design-review` predicts problems without users. Use both; only this one produces evidence of behaviour.

> Relationship to neighbours: `research-planning` covers general question craft (and can draft a usability *script*); `research-synthesis` does open qualitative coding. This skill adds the usability-specific spine — task metrics, benchmark scores, and severity — and can hand its qualitative notes to `research-synthesis`.

## Example prompts

- "Plan a usability test for the new checkout"
- "Here are my 6 session notes — analyse the results"
- "What tasks should I test for this flow, and how do I score them?"
- "Severity-rate these usability issues"

---

## Mode 0 — Which part do you need?

Detect from the prompt: **plan** a test, **moderate** guidance, or **analyse** results. Do the relevant part(s); a full study runs all three in order.

---

## Plan

1. **Objectives** — what questions must this test answer? (e.g. "Can new users complete setup unaided?") Tie to the design decision at stake.
2. **Type** — moderated vs. unmoderated, remote vs. in-person, on prototype vs. live build; formative (diagnose issues, small n) vs. summative (benchmark, larger n). Recommend a fit.
3. **Participants** — target segment and count. Formative testing surfaces most issues at **~5 per segment**; benchmarking needs more (often 20+). Say which and why. (Recruiting screener → `research-planning`.)
4. **Tasks** — 3–6 realistic, scenario-framed goals ("You want to change your billing email — go ahead"). **Never reveal the UI path in the task.** For each task define:
   - a **success criterion** (what "done" means),
   - what to **measure** (success/partial/fail, time on task, errors, assists),
   - what to **observe** (hesitation, wrong turns, quotes).
5. **Metrics** — choose from task **success rate**, **time on task**, **error rate**, **assists**, post-task ease (**SEQ**), and post-session (**SUS**/UMUX-Lite). Only what you'll act on.

## Moderate

Guidance to run clean sessions:
- **Intro** — think-aloud, "we're testing the design, not you," consent to record, permission to stop.
- **Stay neutral** — don't lead, don't rescue too early, don't answer a question with the answer ("What would you expect to happen?"). Note when you give an assist (it counts).
- **Observe and log** per task: outcome, time, errors, verbatim quotes, and the moment things went wrong.
- **Post-task/session** — ease rating + why; overall impressions.

## Analyse

1. **Task-level metrics** — success/partial/fail rate per task, average time, error/assist counts, average SEQ. A completion table across participants makes patterns obvious.
2. **Issue log** — every problem observed, where it occurred, how many participants hit it, and supporting quotes.
3. **Severity rating** — rate each issue (Nielsen 0–4 or critical/serious/minor) on **frequency × impact × persistence**. Reserve the top rating for task-blockers.
4. **Findings & recommendations** — group issues by area, lead with the highest-severity task failures, and give a concrete fix per issue. Note what to re-test.

---

## Output format

- **Plan** — objectives · method · participants · task list (with success criteria + metrics) · what you'll measure.
- **Results** — a task × participant completion table, the metrics summary (success rates, times, SEQ/SUS), a severity-ranked issue list with evidence, and prioritised recommendations.

Offer to save as markdown. Hand rich qualitative notes to `research-synthesis`; feed usability metrics that map to product goals toward `success-metrics` / `product-analytics`.

---

## Guardrails

- **Test the design, not the user.** Tasks state a goal, never the steps; framing must never make a struggling participant feel at fault.
- **Don't lead or over-rescue.** Neutral moderation; log assists honestly — they're data.
- **Right sample for the purpose.** ~5 for finding issues; more for benchmarking. State what the sample can and can't conclude; small studies are directional.
- **Severity honestly.** Reserve the top rating for genuine blockers so the priority list stays meaningful.
- **Metrics you'll act on.** Don't collect SUS/time just to have numbers — tie each metric to a decision.
