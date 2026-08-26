# Highlight-reel workbook — structure

The companion spreadsheet the skill logs candidates into: **one copy per study.** This is the concrete structure so Claude can recognize an existing workbook or stand one up fresh in any spreadsheet — no dependency on any specific file or location. The *method* is in `SKILL.md`; this is the *shape* of what it produces rows for.

Nothing here is project-specific. Copy it, delete the example rows, fill in your study.

## The tabs

| Tab | One row is | Who / what fills it |
|---|---|---|
| **Start Here** | — (read-me + study setup) | You, once |
| **Sessions** | One session | You, before anything else |
| **Findings** | One finding | You — paste from the findings report (or `research-synthesis`) |
| **Clips** | One clip | Filled as clips are found |
| **Emergent** | One pattern *outside* the findings | Filled as patterns surface |

**Finding ID and Session ID are what join the tabs.** They must match exactly — a typo silently drops a clip out of its finding's counts, with no error to warn you.

## Sessions

`Session ID` · `Transcript file` · `Participant` · `Segment / group` · `Notes`

- IDs run `S01`, `S02`… Put the Session ID in the recording's name in the video tool, so any timecode traces back to its recording.
- **One row per session, including two-person sessions** — both participants named in one row, flagged in Notes. The session count measures distinct conversations; splitting a session into two rows would let one conversation register as two voices and overstate the evidence.

## Findings

`Finding ID` · `Finding` · `What we're hearing` · `Clips` *(formula)* · `Sessions` *(formula)* · `Open question / notes`

- IDs run `F-01`, `F-02`… Set them before any clip is logged; they're the join.
- Fill `What we're hearing` as well as the header — a header alone is ambiguous against a transcript.
- `Clips` and `Sessions` are **formula columns** (don't type in them):
  - **Clips** = how many clips are logged against this finding.
  - **Sessions** = how many **distinct sessions** raise it, *not* how many clips. One person making the same point four times is still 1. A finding on a single session is a quote, not a pattern.

## Clips

Columns in order:

| # | Column | Notes |
|---|---|---|
| A | *(checkbox — no header)* | Progress marker: tick when the clip is cut and added to its reel |
| B | `Clip ID` | `C001`, `C002`… — the handoff unit; the name you carry into the editor |
| C | `Session ID` | Matches a Sessions row |
| D | `Finding ID` | Matches a Findings row |
| E | `In (h:mm:ss)` | Clean in-point on a sentence boundary |
| F | `Out (h:mm:ss)` | Clean out-point |
| G | `Sec` | Clip length; aim ~30s or less |
| H | `Verbatim` | Exact quote, short enough to read as an on-screen caption |
| I | `Valence` | **Supports** / **Contradicts** — two-way; every clip gets one |
| J | `Notes` | Speaker attribution for two-person sessions; proxy-voice flag; context |
| K | `Reel` | The reel this clip belongs to — **one clip lives in exactly one reel** |
| L | `Seq` | Order within the reel — **number in 10s** (10, 20, 30…) so a clip slots between two others without renumbering |

`Reel` and `Seq` are plain inputs, not formulas — they're the reel plan, kept right on the Clips tab so it survives sorting (a sequence stored in row order does not).

## Emergent

`EMG ID` · `Emergent` · `What we're hearing` · `Where heard` · `Notes`

- IDs run `EMG-01`, `EMG-02`…
- `Where heard` folds session and timecode together: `S01 0:12:30; S02 0:04:15` — self-documenting and impossible to desync.
- For patterns that recur across sessions but aren't in the findings report. Tracked here on purpose, never folded into the findings silently. Often where the next finding comes from.

## The two formulas (Findings tab)

Both count against the Clips tab. Written for the column layout above (checkbox in A, so Finding ID is column D and Session ID is column C); a formula reference *auto-adjusts* if you insert or move a Clips column, but any hardcoded column letters in notes like these go stale — re-derive from the live sheet.

**Clips count** — for the finding in row 2:

```
=COUNTIF(Clips!$D:$D, $A2)
```

**Sessions count (distinct)** — counts each session once even when it contributes several clips:

```
=ARRAY_CONSTRAIN(ARRAYFORMULA(IF($A2="","",
  SUMPRODUCT((Clips!$D$2:$D$500=$A2) /
    (COUNTIFS(Clips!$D$2:$D$500,$A2,Clips!$C$2:$C$500,Clips!$C$2:$C$500)
     + (Clips!$D$2:$D$500<>$A2))))), 1, 1)
```

**Capacity:** the ranges are fixed to row 500. If a study exceeds ~499 clips, widen the `Clips!$C` and `Clips!$D` ranges in the Sessions formula to match — a range left too short does not error, it silently undercounts.

## Conventions & styling

- **Example rows:** each tab ships one greyed `EXAMPLE ROW — delete before use`. Delete before use.
- **Colour code:** grey-blue columns are formulas (don't type in them); yellow cells are yours to fill.
- **Name variants:** the Start Here / Study setup block collects the ways transcription mangles a brand or product name (one name can appear three or four ways). Search all of them every time — a keyword search misses every variant you didn't list.
- **IDs:** `S##` sessions, `F-##` findings, `C###` clips, `EMG-##` emergents.

## Recreating the workbook anywhere

The skill doesn't depend on any specific file — build this structure in a fresh spreadsheet per study.

- Create the five tabs with the columns above; add the two Findings formulas; keep one greyed example row per tab.
- Claude generally can't write into a live spreadsheet, so clips come back as **paste-ready, tab-separated rows** in the Clips column order (no header) for you to paste in; same for Emergent rows.
- To view a reel in order, sort or filter the Clips tab by `Reel` then `Seq`. Selection, run length, and which findings become reels are decided later in the video tool with the footage in front of you — the workbook stops at candidates.
