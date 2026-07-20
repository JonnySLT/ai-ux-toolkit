---
name: prompt-builder
description: Turn a rough ask into a complete, context-rich prompt before Claude starts work. Runs a short targeted interview (goal, definition of done, constraints, references, output format) — but first checks what's already discoverable in the project so it never asks for what Claude can find itself — then delivers a polished, self-contained prompt and offers to execute it immediately. Also reviews and upgrades a draft prompt the user pastes in, and flags standing rules that belong in CLAUDE.md or memory so future prompts stay short. Trigger when the user says "help me write a prompt", "improve this prompt", "build a prompt for…", "what context do you need?", "am I giving you enough context?", "make my prompt better", or wants help briefing Claude (or any AI agent) on a task before running it.
---

Help the user brief Claude properly before work starts. The best prompt is not the longest one — it's the one that lets Claude make the hundred small decisions the user *didn't* specify in the direction the user would want. Missing context (goal, constraints, definition of done) is the #1 cause of rework; boilerplate padding is noise. This skill closes the gaps and only the gaps.

## Example prompts

- "Help me write a prompt for redesigning our settings page"
- "Here's the prompt I was going to use — improve it"
- "What context do you need before I ask you to build this?"
- "Am I giving you enough to work with?"

---

## Step 0 — Detect the mode

1. **Build** — the user has a rough idea ("help me write a prompt for X"). Interview, then assemble.
2. **Refine** — the user pasted a draft prompt. Audit it against the checklist below, keep what's good, fix what's missing, return an upgraded version with a one-line note per change.
3. **Audit only** — the user asks "is this enough context?" Answer honestly: list what's covered, what's missing and why it matters, and what you'd assume in each gap. Don't rewrite unless asked.

In every mode the deliverable is a prompt (or verdict) **plus** the offer to run it — never silently execute the underlying task instead.

---

## Step 1 — Scan before you ask

Before asking the user anything, check what's already discoverable. **Never ask for information Claude can find itself** — every needless question costs trust and time.

- Read the project's `CLAUDE.md` / `AGENTS.md` if present — conventions, file keys, standing rules already live there.
- Glance at any file, directory, URL, or Figma frame the user mentioned.
- Check for relevant installed skills: if the task maps to one (e.g. a design review, a synthesis pass), the prompt should *name it* and supply that skill's expected inputs rather than re-describe the workflow.

Then tell the user what you found and will assume, so they only correct — not recite.

## Step 2 — Interview for the genuine gaps

Ask **one batch of at most 5 questions**, only for things neither discoverable nor stated. Draw from this checklist, skipping anything already known:

| Ingredient | The question behind it | Why it matters |
|---|---|---|
| **Goal & definition of done** | What does finished look like, and how will you judge it? | Prevents the right work to the wrong standard |
| **Constraints & non-goals** | What must not change? What's out of scope? | Prevents more rework than anything else |
| **References (pointers, not payloads)** | Which file / frame / URL / past example should this match? | A pointer beats a paste — Claude can go read it |
| **Output format & audience** | Code, doc, Figma frame, list? For whom, at what depth? | Shapes the whole deliverable |
| **The why** | What's this for? | Steers every unspecified decision |

If the user answers "whatever you think," record the default you'll use in the prompt itself — assumptions belong *in* the prompt, not in the conversation.

## Step 3 — Assemble the prompt

Produce a **self-contained** prompt — it must work pasted into a fresh session with no memory of this conversation. Use this shape, dropping empty sections:

```text
**Task:** <one sentence — the action and the deliverable>

**Context:** <the why + relevant background that isn't discoverable>

**References:** <files, URLs, frames, examples to match — pointers, not pasted content>

**Constraints:** <what must not change; explicit non-goals>

**Done means:** <observable success criteria>

**Output:** <format, location, audience>
```

Present it in a fenced code block so it's copyable. Keep it as short as completeness allows — no role-play padding ("you are a world-class expert…"), no restating what a reference already contains.

## Step 4 — Deliver and offer

After presenting the prompt, offer exactly these paths and let the user choose:

1. **Run it now** — execute the prompt in this session.
2. **Take it away** — they copy it for later or for another tool.
3. **Make it durable** — see below.

## Durable-context check (always run)

While interviewing, watch for answers that are **standing rules, not one-off facts** — "we always use tokens, never hardcoded values", "output goes in /docs", "match the brand voice". For each one, point out that it belongs in persistent context so no future prompt has to repeat it, and offer to add it:

- **Project rule** → the project's `CLAUDE.md`.
- **Personal preference across projects** → Claude's memory or `~/.claude/CLAUDE.md`.
- **A whole recurring workflow** → a new skill (offer to draft the `SKILL.md`).

This is the compounding win: every rule promoted out of the prompt makes every future prompt shorter.

## Anti-patterns

- **Interviewing past the point of value** — 5 questions max, one batch; a good prompt now beats a perfect prompt after 3 rounds.
- **Asking what's discoverable** — scan first (Step 1), always.
- **Padding** — persona boilerplate, "think step by step", restated file contents. Cut anything that doesn't change the outcome.
- **Absorbing the task** — the user asked for a prompt; don't just do the underlying work uninvited (offer to, in Step 4).
