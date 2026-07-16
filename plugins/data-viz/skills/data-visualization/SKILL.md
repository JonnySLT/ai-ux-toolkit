---
name: data-visualization
description: Design clear, accessible charts, dashboards, and data displays. Chooses the right chart for the question and data type, applies accessible color and honest scales, cuts chart junk, and lays out dashboards (KPI tiles, hierarchy, filters) that answer questions at a glance. Tool-agnostic — applies to Figma, charting libraries, or BI tools. Trigger when the user asks "what chart should I use?", "design this dashboard", "visualize this data", "is this chart accessible/misleading?", or wants help presenting metrics, analytics, or a data display.
---

Turn data into something a person can read at a glance and trust. Good data-viz starts from **the question and the data type**, not a chart picker — then makes the encoding accessible and honest. This is design guidance that works in any medium (Figma, Recharts/D3/Plotly/matplotlib, a BI tool); it uses the project's palette/tokens where they exist.

> If a design system or brand palette exists, derive chart colors from its tokens. This skill focuses on the *design* of the visualization; hand the build to `frontend-design`/`figma-design-system` and verify contrast with `accessibility-check`.

## Example prompts

- "What chart should I use for revenue by region over time?"
- "Design a dashboard for our support team"
- "Is this pie chart the right choice?" / "Why does this chart feel misleading?"
- "Make these charts accessible"

---

## Step 0 — Question & data (required first)

1. **What question must the viz answer?** ("Is revenue growing?" "Which segment churns most?") The question picks the chart, not aesthetics.
2. **What's the data?** Type of each variable (categorical, ordinal, quantitative, time, geographic), how many series/categories, and the size. 
3. **Audience & context** — an exec glance, an analyst deep-dive, a public report? Drives density and interactivity.

---

## Choose the chart (match to the relationship)

- **Trend over time** → line (or area for cumulative). 
- **Comparison across categories** → bar (horizontal when labels are long or many).
- **Part-to-whole** → stacked bar or a single value with context; use pie **only** for 2–3 slices, never many.
- **Distribution** → histogram, box plot.
- **Correlation** → scatter (add trend line if useful).
- **Ranking** → sorted bar.
- **Single key number** → big-number / KPI tile with a comparison (vs. target/prior).
- **Geographic** → map only when location is the point.

Prefer the simplest chart that answers the question. If a table would communicate better (precise values, few numbers), use a table.

## Make it clear, honest, and accessible

- **Honest scales** — bar charts start the axis at zero; don't truncate to exaggerate. Label axes and units; avoid dual axes that imply false correlation.
- **Accessible color** — never encode meaning by color alone (add labels, patterns, or direct labeling); use a color-blind-safe palette; ensure sufficient contrast for text and marks (verify via `accessibility-check`). Limit the palette — categorical series beyond ~6–8 colors become unreadable; consider grouping or small multiples.
- **Cut chart junk** — maximize data-ink: drop heavy gridlines, 3-D, needless decoration, redundant legends (direct-label where possible).
- **Guide the eye** — sort meaningfully, highlight the point being made, annotate the key insight, and give every chart a **descriptive title that states the takeaway** ("Revenue grew 18% in Q3"), not just "Revenue".
- **Provide text alternatives** — summary/alt text and, where relevant, access to the underlying data for screen-reader users.

## Dashboards (multiple views)

- **Lead with the question** — most-important metric top-left; layout follows reading order and priority (inverted pyramid).
- **KPI tiles** — value + comparison (vs. target/prior/trend), consistent format; one glance = status.
- **Group related views**, keep consistent scales/colors across charts, and don't overload — a dashboard answers a few key questions, not all of them.
- **Filters & interaction** — sensible defaults, clear current state; progressive detail (overview → drill-down).

---

## Output format

1. **Recommendation** — the chart/dashboard choice with a one-line why (tied to the question + data type), and what to avoid.
2. **Encoding spec** — axes/scales, color mapping (from tokens, color-blind-safe), labels/titles, annotations.
3. **Dashboard layout** (if applicable) — what goes where and why, KPI tiles, filters.
4. **Accessibility notes** — non-color encoding, contrast, alt text/data access.

Offer to hand the build to `frontend-design`/`figma-design-system` and verify with `accessibility-check`.

---

## Guardrails

- **Question first.** Pick the chart from what it must communicate, not from novelty; a table often wins.
- **Don't mislead.** Zero-baseline bars, honest scales, no cherry-picked ranges or dual-axis tricks.
- **Never color-only.** Encode meaning redundantly; use color-blind-safe, sufficient-contrast palettes.
- **Simplify.** Cut chart junk; fewer series, clearer story. If it needs a paragraph to explain, redesign it.
- **State the takeaway.** Title says the insight; annotate the point — don't make the reader hunt for it.
