---
name: competitive-analysis
description: Run a live competitive analysis across 3–6 B2B SaaS competitors. Browses each competitor's site in real time, analyzes UI patterns, messaging, features, and brand identity, then delivers a structured comparison matrix, written narrative, and opportunities/gaps. Can also push findings into a Figma doc page. Trigger when the user wants to research competitors, benchmark a product, audit the market, or mentions "competitive analysis", "comp analysis", or "research competitors".
---

Run a structured competitive analysis. Default space is **B2B SaaS / productivity tools**, but adapt to whatever market the user names.

## Example prompts

- "Run a comp analysis on project management tools"
- "Research our top 5 competitors in the CRM space"
- "Benchmark our onboarding flow against competitors"
- "Who's doing pricing pages well in our space?"

---

## Process

### Step 1 — Intake

Ask the user:
1. **What product / space are we analyzing?** (e.g. "CRM tools", "analytics dashboards", "design tools")
2. **Which competitors?** Get 3–6 names or URLs. If they only give names, find the URLs yourself.
3. **Any specific focus?** (e.g. "just pricing pages", "onboarding flows", "homepage messaging"). Default is a full sweep.
4. **Figma output?** Ask if they want findings pushed to a Figma doc page. If yes, get the file URL.

If the user already provided this info in their prompt, skip asking.

---

### Step 2 — Live research

Use the browser tools to research each competitor. For each one, visit and screenshot:

| Page | What to capture |
|---|---|
| **Homepage** | Hero headline, subheadline, main CTA, social proof, nav structure |
| **Pricing page** | Tier names, price points, feature lists, CTA per tier, free trial offer |
| **Product / Features page** | Key features highlighted, screenshots or demo shown, language used |
| **Sign-up / Onboarding** (if accessible) | Flow length, fields asked, friction level |

Take a screenshot at each key page. Note the URL you visited.

**Research checklist per competitor:**
- [ ] Homepage screenshotted and headline captured verbatim
- [ ] Pricing tiers documented (names, prices, what's included)
- [ ] Top 3–5 features they emphasize on the product page
- [ ] CTA language noted on each page
- [ ] Any notable UI patterns, animations, or layout choices

---

### Step 3 — Analyze each competitor

For each competitor, assess all four dimensions:

#### UI & Design patterns
- Navigation: mega-menu, simple top nav, sidebar, sticky?
- Layout: grid system, card-based, editorial, minimal?
- Visual density: busy/feature-rich vs. clean/spacious?
- Component style: sharp corners vs. rounded, flat vs. elevated?
- Color palette: dominant hues, accent usage, dark/light mode?
- Typography feel: geometric, humanist, monospace elements?
- Mobile-first signals or desktop-first?

#### Messaging & Copy
- **Hero headline** (verbatim)
- **Value proposition**: what problem do they claim to solve?
- **Target audience**: who are they speaking to? (signals from language, imagery, use cases shown)
- **Tone of voice**: formal/casual, technical/accessible, confident/humble, witty/earnest?
- **CTA language**: action verbs used, urgency signals, friction level
- **Social proof**: G2/Capterra ratings, logos, testimonial style

#### Features & Pricing
- Number of pricing tiers
- Free plan or free trial?
- Key differentiating features per tier
- Feature gaps vs. category norms
- Pricing anchoring strategy (highlight middle/top tier?)

#### Brand & Positioning
- Brand archetype: helper, expert, rebel, innovator?
- Premium vs. accessible vs. enterprise-focused?
- Personality adjectives (3 words max)
- Logo style and visual identity feel
- How they differentiate vs. generic SaaS aesthetic

---

### Step 4 — Synthesize

#### 4a. Comparison matrix

Produce a markdown table with competitors as columns and the key dimensions as rows. Use concise values (3–5 words max per cell). Example structure:

| Dimension | Competitor A | Competitor B | Competitor C |
|---|---|---|---|
| Hero headline | "Work smarter, not harder" | "The OS for modern teams" | "Ship faster together" |
| Tone | Casual, approachable | Confident, technical | Energetic, startup-y |
| Pricing model | 3 tiers + free | 4 tiers, no free | Usage-based |
| Top UI pattern | Card-heavy dashboard | Sidebar navigation | Kanban-first |
| Target audience | SMBs | Mid-market | Developer teams |
| Brand in 3 words | Friendly, simple, reliable | Powerful, bold, modern | Fast, flexible, indie |

#### 4b. Per-competitor narrative

For each competitor, write a 3–4 sentence summary covering:
- What they do and who they're for
- Their strongest differentiator
- Their clearest weakness or gap
- One standout design or messaging choice worth noting

#### 4c. Opportunities & gaps

This is the most actionable section. Identify:

**White space** — things none of the competitors do well that represent an opening:
- e.g. "No competitor clearly targets solo founders in their messaging"
- e.g. "Pricing pages are universally complex — a simpler, transparent model would stand out"

**Messaging gaps** — angles no one is owning:
- e.g. "Everyone talks about speed; nobody talks about reducing meeting overhead"

**Design patterns to adopt** — things competitors do that genuinely work:
- e.g. "Competitor B's inline onboarding checklist removes friction — worth exploring"

**Design patterns to avoid** — antipatterns appearing across competitors:
- e.g. "Three of six competitors have cluttered pricing pages with 20+ feature rows — this creates decision paralysis"

**Positioning recommendation** — one clear statement of where your product can differentiate based on findings.

---

### Step 5 — Figma output (if requested)

If the user asked for a Figma doc page, load the `/figma:figma-use` skill and create a new page in their design system file following the foundation page format:

**Frame spec**: `_Doc/Competitive Analysis` — VERTICAL auto-layout, `paddingTop: 80`, `paddingLeft/Right/Bottom: 120`, `itemSpacing: 0`, width 1440, content width 1200.

**Page sections**:
1. **Title block** — `Display/Medium` title "Competitive Analysis", `Body/Large` description with scope and date
2. **Competitors overview** — one row per competitor with name, URL, and 3-word brand summary
3. **Comparison matrix** — table built from Step 4a, using the `Label/Small` + `Body/Small` + divider pattern
4. **Opportunities** — bullet lists using the dash `—` pattern, grouped by type (white space, messaging, design)

Use existing design system variables for all colors and text styles. Follow the exact same structure as the Getting Started and Typography foundation pages.

---

## Output format

Always deliver in this order:
1. **Comparison matrix** (table)
2. **Per-competitor summaries** (one section per competitor)
3. **Opportunities & gaps** (the most actionable section — make it prominent)
4. **Figma doc page** (if requested — confirm URL when done)

Keep the tone analytical and direct. Flag when data was unavailable (e.g. pricing not public). Cite verbatim headlines in quotes. Be specific — "their CTA says 'Start for free'" beats "they have a free trial CTA".

---

## Notes

- If a competitor requires sign-in to see the product, note that and focus on public-facing pages only.
- If pricing is hidden ("Contact sales"), record that explicitly — it's itself a data point.
- If the user gives fewer than 3 competitors, suggest 2–3 well-known alternatives in the space and ask if they want those included.
- Run one competitor at a time in the browser — don't try to open multiple tabs simultaneously.
