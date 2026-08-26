---
name: highlight-reels
description: Find and organize the video clips that back a set of research findings, ready to cut into short thematic quote-montages — one reel per finding — for a findings presentation. Takes timestamped interview or usability transcripts plus a frozen finding list and returns candidate clips (session, finding, in/out, verbatim, and a Supports/Contradicts valence) as paste-ready rows for the highlight-reel workbook, plus emergent patterns the findings don't cover. Surfaces counter-evidence on purpose, not just confirming clips. Pairs with research-synthesis (which produces the findings) and a transcript-based video editor (which cuts and assembles the reels). Trigger when the user wants to "make a highlight reel", "pull clips", "quote montage", "sizzle reel", "find clips for a finding", turn interviews into supporting video, build a findings showreel, or assemble clips for a research readout.
---

Find and organize the clips that support a set of findings, ready to cut into short thematic quote-montages — one reel per finding. It answers one question for each finding: which moments, in which sessions, say this — and where exactly are they. This is a **first pass, not a selection tool**: it surfaces candidates fast so a human can weigh them, and the real editorial calls — which clips make the cut, how long each reel runs, which findings become reels — happen in the video editor with the footage in front of you. Pairs with `research-synthesis` (which produces the findings) on the front end and a transcript-based video tool on the back end.

## Example prompts

- "Pull clips for these findings from my 15 interview transcripts"
- "Find quotes that back 'users don't trust autosave' — and any that push against it"
- "Turn these sessions into quote montages for the findings deck"
- "Which moments support finding F-03?"
- "Build a highlight reel, one reel per finding"

---

## Step 0 — Set up before pulling (required first)

Everything downstream depends on getting these right first; backfilling after clips are logged means reopening every session. Infer from the prompt; ask only what's missing.

1. **The findings, frozen.** A stable finding list, one row each, with a short **Finding ID** (`F-01`…). These IDs are what join clips to findings, so they must exist and stop changing before any clip is logged. Take the team's own wording of what each finding means, not just a header — a header alone is ambiguous against a transcript. (If findings don't exist yet, that's `research-synthesis`'s job first.)
2. **The transcripts.** One timestamped transcript per session (SRT/VTT). Fix speaker labels before export if you can — without them, moderator and participant can only be told apart by inference, which is unreliable in any session with more than one person, and a clip that starts mid-question reads as the participant saying it.
3. **Name variants.** Transcription mangles brand, product, and company names — one name can appear three or four different ways across a corpus (a product name misheard as a similar-sounding word). Collect the variants up front and search for **all** of them every time; a keyword search silently misses every variant you didn't list.
4. **The workbook and the tool.** Candidates are logged in the highlight-reel workbook — a **Sessions** tab (one row per session), a **Findings** tab (one row per finding), a **Clips** tab (one row per clip), and an **Emergent** tab (patterns outside the findings). Reels are cut and assembled in the video tool. Put the Session ID in the recording's name there, so a timestamp can always be traced back to the recording it came from. The full tab-and-column spec, the two Findings-tab count formulas, and the ID and styling conventions are in **[references/workbook-structure.md](references/workbook-structure.md)** — read it to recognize an existing workbook or stand up a fresh one in any spreadsheet.

If the user already supplied findings and transcripts, skip the questions and confirm your read of the source in one line.

---

## Process

### Step 1 — Sweep each transcript against the whole finding list

Read every transcript in full against every finding — not one finding at a time. For each candidate moment, capture the Session ID, the Finding ID, in/out timecodes, a **verbatim** quote, and a valence (next step). Search on the name variants, not just the canonical name.

**Locate clips by their words, not by raw timecode.** The exported transcript's timeline and the editor's timeline drift, so the quote text is the reliable anchor and the timecode is only a place to start searching near. Log the timecode, but treat the verbatim as the source of truth for finding the moment again.

### Step 2 — Assign valence, and hunt counter-evidence on purpose

Every clip gets a valence: it **Supports** or **Contradicts** its finding. This is the step most easily skipped and the most important. A request to "find clips that show X" is a confirmation search, and a transcript corpus is long enough that it will *always* succeed — so confirming clips alone prove nothing. Deliberately look for moments that contradict or qualify each finding and log them too. A finding with only supporting clips is unverified, not proven; surface both sides and let the human weigh them.

### Step 3 — Count sessions, not clips; weight the voice

- A finding's strength is how many **distinct sessions** raise it, not how many clips you found. One person making the same point four times is still one voice. A finding backed by a single voice is a quote, not a pattern — flag it as thin rather than inflating it with clip count.
- **Two-person sessions get one session, not two** — a single row with both participants named. Attribute each clip to the right speaker in the notes, and flag it hard when speaker labels are missing, because a clip pinned to the wrong person is worse than one left out.
- Note when a voice is a **proxy** — someone speaking *for* a user group (internal staff, a reseller) rather than a member of it. It's still evidence, but it weights differently from the group's own voice, and the readout should be able to tell them apart.

### Step 4 — Keep clips tight and log with intent

- Set clean in/out points on sentence boundaries; aim for short clips (roughly 30 seconds or less) — short enough to read as an on-screen caption.
- Log a clip because it fills a gap, adds a new facet, brings a new voice, or balances the valence — not to pile a fifth supporting clip onto an already-saturated finding.

### Step 5 — Log emergent patterns separately

Expect the sweep to surface patterns that recur across sessions but aren't in the findings report. Don't fold them into the findings silently, and don't discard them — log them on the **Emergent** tab, called out as their own thing (a short label, what you're hearing, where you heard it), for the team to decide what to do with. They're often where the next finding comes from.

### Step 6 — Return paste-ready rows

You can't write into the workbook directly, so hand back rows the user can paste straight in: tab-separated, no header, columns in the Clips tab's order. Same for emergent rows against the Emergent tab. Match the Finding IDs and Session IDs exactly — a typo drops a clip out of its finding's counts with no error to warn you.

---

## Output format

Deliver in this order:

1. **Coverage summary** — which findings have at least one clip and which are at zero; the distinct-session count behind each (so a one-voice "finding" shows up as a quote, not a pattern); and the valence balance (flag any finding that's all-supporting and hasn't been tested for counter-evidence).
2. **Paste-ready Clips rows** — tab-separated, one clip per row, in the Clips tab's column order: `Clip ID · Session ID · Finding ID · In · Out · Sec · Verbatim · Valence · Notes`.
3. **Paste-ready Emergent rows** — the patterns outside the findings, tracked separately.
4. **Handoff** — the rows go into the workbook, then into the video tool to cut and sequence into reels. One clip belongs to one reel; order within a reel is set by a sequence number (in 10s, so clips slot between without renumbering), or a reel simply maps to a finding. Which clips make the cut, how long each reel runs, and which findings become reels are decided in the tool with the footage in front of you — not here.

---

## Guardrails

- **Never fabricate a quote or a timecode.** Every verbatim is exact and every clip points at a real moment. If you can't locate the moment, say so — don't approximate it into existence.
- **Hunt counter-evidence, not just confirmation.** Report clips that contradict a finding as readily as ones that support it. A confirmation-only sweep is worse than useless — it launders an assumption as a result.
- **Freeze findings before tagging.** Don't log clips against findings that might still change; the IDs are the join, and backfilling after a change means reopening every session.
- **Count sessions, not clips.** A single repeated voice is still one voice. Flag single-voice findings as quotes, not patterns; small samples are directional, not proof.
- **Anchor on the words, not the timecode.** Transcript and editor timelines drift — locate every clip by its verbatim, and never attribute a clip to the wrong speaker in a multi-person session.
- **Search every name variant.** A keyword search misses every mangled variant of a name you didn't list — collect them first.
- **The workbook stops at candidates.** Selection, length, and which findings become reels are the editor's call with the video in front of them, not the sheet's.
