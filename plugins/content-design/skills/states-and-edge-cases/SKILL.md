---
name: states-and-edge-cases
description: Enumerate every state and edge case a screen, component, or flow must handle — so they're designed on purpose instead of discovered in production. Walks the full set (empty, loading, partial, error, offline, no-permission, first-run, success, max/overflow, long-content, zero-results, slow-network, RTL/localisation) plus data and boundary edge cases, and flags which are missing from the current design. Trigger when the user asks to "list the states", "what edge cases am I missing?", "cover all the states", "handle empty/error/loading states", or wants a completeness check on a design.
---

Make the invisible states visible. Teams design the happy path and ship the rest by accident — the empty screen, the failed load, the 300-character name, the offline moment. This skill **enumerates the full set of states and edge cases** for a screen/component/flow and flags which the current design hasn't accounted for, so they get designed deliberately.

## Example prompts

- "What states does this dashboard need?"
- "What edge cases am I missing on this form?"
- "Cover all the states for this list view"
- "Completeness check on this screen before handoff"

---

## Step 0 — Scope

Establish: **what** you're checking (screen, component, or flow), what **data/content** it displays, and **what already exists** in the design (so you can flag gaps, not just list generics). A screenshot, Figma frame, or description all work.

---

## The enumeration

Walk these categories and, for each, state whether it applies and whether the current design covers it:

**Content / data states**
- **First-run / empty (never had data)** — onboarding opportunity; distinct from…
- **No results / user-cleared empty** — search/filter returned nothing; give a way back.
- **Partial data** — some fields missing, incomplete profile, one item vs. many.
- **Single item vs. many vs. too many** — 1, a few, and pagination/virtualisation limits.
- **Overflow / long content** — long names, big numbers, wrapping, truncation + full-value access.
- **Ideal / fully-populated** — the "designed for the demo" state.

**System / loading states**
- **Loading** — initial load, skeletons vs. spinners; **slow network**.
- **Success / confirmation** — the completed action.
- **Error** — request failed, validation error, server error; recoverable vs. not (copy → `content-design`).
- **Offline / no connection** — and reconnection behavior.
- **Stale / refreshing** — cached data being updated.

**Permission / access states**
- **No permission / gated** — feature not available to this user/plan.
- **Logged out / session expired** mid-flow.
- **Read-only** vs. editable.

**Interaction / boundary edge cases**
- **Input extremes** — min/max, zero, negative, special characters, emoji, whitespace-only, paste of huge content.
- **Timing** — double-submit, rapid actions, timeout, back-button mid-flow, concurrent edits.
- **Accessibility & localisation** — long translated strings, RTL, large text/zoom, reduced motion (hand specifics to `accessibility-check`).
- **Device / viewport** — smallest and largest supported, touch vs. pointer.

---

## Output format

A **coverage table**: State / edge case · Applies? · Covered in current design? · What's needed. Group by category; mark clearly which are **missing** (the actionable output). Follow with a short **priority list** — the highest-risk uncovered states to design first (usually error, empty, loading, permission).

Hand copy needs to `content-design`, per-component state specs to `component-spec`, and build them as a quick harness via `rapid-prototyping` if useful. Offer to save as a markdown checklist.

---

## Guardrails

- **Flag gaps against the real design.** Don't just recite the generic list — say which states *this* design is missing.
- **Applicability matters.** Not every state applies; mark the ones that don't rather than padding.
- **Empty ≠ empty.** Distinguish first-run, no-results, and user-cleared — they need different designs and copy.
- **Prioritize by risk.** Lead with the states most likely to occur and most damaging if unhandled.
