---
name: research-planning
description: Plan and instrument research before you collect it — with users and with stakeholders. Helps choose the right method for the question, then drafts the actual instrument — user interview and discussion guides, stakeholder / kickoff interview guides, usability-test scripts (tasks, scenarios, success criteria — the script only; to run and analyze the full study, use the usability-testing skill), survey questionnaires, and recruiting screeners. Writes non-leading questions, sequences them well, and builds in consent, incentives, and realistic sample sizes. The front end that feeds research-synthesis. Trigger when the user wants to "plan user research", "write an interview guide", "stakeholder interview", "kickoff questions", "align stakeholders", "design a survey", "create a usability test script", "write a screener", "discussion guide", "research questions", or asks how to research something with users or stakeholders.
---

Design the research and write the instrument you'll take into the field. Good research is mostly decided before the first session — the method fit, the questions, and who you talk to. This skill gets those right so the data you collect is worth synthesizing. It's the front end; `research-synthesis` (in the `ux-research` plugin) is the back end.

## Example prompts

- "Write an interview guide to understand why users churn"
- "Draft stakeholder interview questions for the project kickoff"
- "Plan a usability test for our new checkout flow"
- "Design a survey to measure onboarding satisfaction"
- "I want to research X — what method should I use and what do I ask?"
- "Write a screener to recruit 6 SMB admins"

---

## Step 0 — Frame the research (required first)

Nail these down before writing anything (infer from the prompt; ask only what's missing):

1. **The decision or question.** What will this research inform? Good research serves a decision. Turn a vague ask ("learn about users") into specific **research questions** ("what stops first-time users from completing setup?").
2. **What you already know / assume.** Surface the assumptions being tested, so questions probe them rather than confirm them.
3. **Method fit.** Match method to question type — don't default to interviews:
   - **User interviews** — the *why*: motivations, mental models, context, unmet needs.
   - **Stakeholder / kickoff interviews** — *internal* context, not user data: business goals, definition of success, constraints, assumptions, prior attempts, and where stakeholders disagree. Usually run at project start, often alongside user research.
   - **Usability test** — *can they do it*: task success, friction, confusion on a real (or prototype) UI.
   - **Survey** — *how many / how much*: prevalence, satisfaction, segmentation at scale (needs enough responses to matter).
   - **Diary / field study** — behavior over time or in context.
   - **Card sort / tree test** — IA and labeling (pairs with the `information-architecture` plugin).
   State the recommended method and why; note when a mix is warranted. (Studying users and aligning stakeholders are different jobs — don't substitute one for the other.)
4. **Audience & sample.** Who, how many, and any segments. Be honest about sample size: qualitative (interviews/usability) saturates around **5–8 per distinct segment**; surveys need enough for the cut you'll make.
5. **Constraints.** Timeline, moderated vs unmoderated, remote vs in-person, tools available.

If the user already specified method + question, skip ahead and confirm your read in one line.

---

## Process — write the instrument

Produce the artifact for the chosen method. Core craft rules apply to all:

- **Ask open, non-leading questions.** "Walk me through the last time you…" not "Don't you find X frustrating?" Never embed the desired answer or a value judgement.
- **One idea per question.** No double-barrelled asks.
- **Behavior before opinion.** Past/actual behavior is more reliable than predicted or hypothetical.
- **Sequence intentionally.** Warm-up → broad context → focused topics → sensitive/specific → wrap-up. Easy and rapport-building first.
- **Neutral language.** Plain words, no jargon, no brand cheerleading.

### Interview / discussion guide
- **Intro script** — purpose, consent to record, no right answers, ~duration, permission to skip.
- **Warm-up** — 1–2 easy context questions.
- **Core sections** — grouped by research question; each a lead question plus **probes/follow-ups** ("tell me more", "why did that matter?", "what did you do next?").
- **Task/artifact prompts** if relevant ("show me how you currently…").
- **Wrap-up** — anything we missed, magic-wand question, thanks + next steps.
- Mark must-ask vs. time-permitting so a short session still lands the essentials.

### Stakeholder / kickoff interview guide
For internal stakeholders (product, exec, engineering, sales, support, SMEs) at the start of a project. The aim is to gather context and **align**, and to surface disagreement rather than paper over it.
- **Intro** — purpose, how you'll use their input, and that candid answers help; note confidentiality (who sees attributed vs. aggregated views).
- **Role & stake** — their relationship to the project and what success looks like *for them*.
- **Goals & vision** — the business goal, the problem being solved, and how this fits the wider strategy.
- **Definition of success & metrics** — how they'll know it worked (ties to `success-metrics`); watch for different stakeholders naming different measures.
- **Users & assumptions** — who they believe the users are and what they're assuming (flag these as hypotheses for *user* research to test, not facts).
- **Constraints** — technical, legal/compliance, budget, timeline, brand, and organizational realities.
- **Prior attempts & history** — what's been tried, what exists, what failed and why.
- **Scope & non-goals** — what's explicitly in and out; where they expect trade-offs.
- **Risks & concerns** — what worries them; what would make this fail.
- **Snowball** — who else should be interviewed, and what they might know.
- **Reconcile** — after the round, compile where stakeholders *agree*, where they *conflict* (goals, success metrics, scope, priorities), and the open questions those conflicts raise. Surfacing and resolving conflict is the primary value; note conflicts explicitly rather than averaging them away.

### Usability-test script
- **Intro** — think-aloud instructions, "we're testing the design, not you," consent.
- **Pre-task questions** — brief context/expectations.
- **Tasks** — realistic, scenario-framed goals ("You want to change your billing email — go ahead"), **not** instructions that reveal the UI path. For each task define a **success criterion** and note what to observe (hesitation, errors, wrong turns, quotes).
- **Post-task** — ease rating (e.g. SEQ) + why.
- **Post-session** — overall impressions, SUS if wanted, wrap-up.
- Keep to ~5 tasks; order by priority in case time runs short.

### Survey questionnaire
- **Intro** — purpose, length, anonymity.
- **Questions** — mostly closed for analysis; match scale to intent (Likert for agreement, and note if using a validated measure like SUS/NPS/CSAT). Balanced scales, no leading stems, avoid double negatives. Add "N/A / prefer not to say" where honest.
- **Screening & demographics** — only what you'll actually analyze; place sensitive items late.
- **Open-text** — a few, sparingly (they feed `research-synthesis`).
- Flag likely bias (order effects, acquiescence) and note target N for the cuts planned.

### Recruiting screener
- **Qualifying criteria** from the target segment (role, behavior, tenure, tool use).
- **Screener questions** that don't telegraph the "right" answer (avoid "Do you use X often?" → ask frequency with a neutral scale and set the threshold).
- **Quotas** per segment, target count (with over-recruit buffer), incentive, and logistics/consent line.

---

## Output format

Deliver a ready-to-use instrument, in this order:

1. **Research plan header** — the decision, research questions, recommended method (+ why), audience & sample size, and any assumptions being tested.
2. **The instrument** — full guide / script / questionnaire / screener, formatted for use in a session.
3. **Facilitation notes** — practical reminders (probes to keep handy, what to observe, time-boxing, consent).
4. **Handoff** — note that once data is collected, the `research-synthesis` skill turns it into themes and insights.

Offer to save it as a markdown file in the project.

---

## Guardrails

- **Never write leading or loaded questions.** If the user wants to "prove" something, redirect to neutral phrasing — biased instruments produce worthless data.
- **Match method to the question.** Don't run a survey for a *why*, or interviews for prevalence. Say so if the requested method won't answer the question.
- **Be realistic about sample size and claims.** Small qualitative studies are directional, not statistical; say what the study can and can't conclude.
- **Bake in ethics.** Consent, the right to skip/stop, honest framing of purpose, and no collection of sensitive data you don't need.
- **Test the design, not the user.** For usability scripts, tasks state a goal, never the steps — and the framing must never make a struggling participant feel at fault.
- **Stakeholders describe the business, not the user.** Treat what stakeholders believe about users as assumptions to validate with real users — never as findings. And surface stakeholder conflict explicitly; don't average away disagreement to look aligned.
