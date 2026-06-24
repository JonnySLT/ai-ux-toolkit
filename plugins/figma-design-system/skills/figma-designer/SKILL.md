---
name: figma-designer
description: >
  Core design knowledge skill for any Figma work. Load this skill before
  designing or building anything in Figma — components, screens, design
  systems, layouts, or anything visual. This is not about Figma API mechanics
  (those are covered elsewhere). This is the internalized knowledge of a
  senior product designer: what makes a design accessible, consistent,
  usable, and polished. Triggers on any request to design, create, or build
  UI — whether that's a single component, a screen, or a full design system.
---

# Senior Designer Knowledge Skill

This skill encodes what an experienced product designer knows by instinct.
It is not about Figma API calls — it is about design decisions: what to
build, how to structure it, and what separates professional output from
amateur output.

Read and apply this before making any design decision.

---

## 0. Designer Mindset

Before touching Figma, answer these mentally:

1. **What is this for?** — Component, screen, or system? Mobile, desktop, or both?
2. **What already exists?** — Check for an existing design system, token set, or component library before creating anything new. Extend; don't duplicate.
3. **What are the constraints?** — Brand colors, fonts, platform conventions (iOS HIG, Material, web)?
4. **Who is the user?** — Accessibility is not a checkbox. Assume some users have low vision, motor impairment, or use assistive technology.

Never start building without answers to these. If uncertain, ask — but ask once, concisely.

---

## 1. Design System Foundations

### 1.1 Always Work Token-First

Every color, size, and spacing value in a design should come from a token.
Never hardcode a raw hex value or pixel number onto a component — always
reference a variable/token. This is what makes a system maintainable.

**Token hierarchy** (always follow this order when building from scratch):

```
Primitive tokens    →  Semantic tokens        →  Component tokens (if needed)
#2563EB (blue-600)  →  color/action/primary   →  button/bg/default
#1D4ED8 (blue-700)  →  color/action/primary-hover
#FFFFFF (white)     →  color/text/on-primary
```

- **Primitive tokens** are raw values. They are never applied directly to components.
- **Semantic tokens** describe intent (primary, danger, surface, on-surface). Components always reference semantic tokens.
- **Component tokens** are optional and only created for genuinely unique overrides.

If someone provides brand colors, always build the primitive layer first,
then the semantic layer, before touching a single component.

### 1.2 Color System Requirements

A complete, usable color system requires:

- **Brand/action colors**: default, hover, active, disabled states
- **Neutral scale**: at minimum 9 steps (50–900) for surfaces, borders, text
- **Semantic colors**: success, warning, error, info — each with a background tint, a border, and a text/icon color
- **Surface hierarchy**: background, surface, surface-raised, surface-overlay
- **Text hierarchy**: primary, secondary, tertiary, disabled, on-color (for colored backgrounds)
- **Border hierarchy**: default, strong, focus

Every color pairing used in the UI must pass WCAG AA contrast at minimum.
WCAG AAA for body text if at all possible.

### 1.3 Typography Scale

A type scale is not random sizes. Use a modular scale or an established
system (e.g., 12/14/16/20/24/32/40/48). Never use arbitrary sizes like
15px or 22px.

Every text style needs:
- Font family (and fallback)
- Weight (use the actual numeric weight, not "bold")
- Size
- Line height (1.2–1.35 for headings; 1.5–1.6 for body; 1.4 for UI labels)
- Letter spacing (tighter for large headings: -0.02em; normal/loose for small text)
- Optional: text transform, text case

Minimum accessible text sizes:
- Body copy: 16px (14px acceptable for secondary/caption with sufficient contrast)
- UI labels: 12px absolute minimum, never smaller
- Touch targets: always ≥ 44×44pt regardless of text size

### 1.4 Spacing Scale

Use a base-4 or base-8 scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
Never use values outside this scale unless there is a specific reason (and
there almost never is). Arbitrary spacing like 13px or 22px is a mistake.

---

## 2. Components — What a Senior Designer Always Gets Right

### 2.1 The Non-Negotiables for Every Component

Before considering a component done, it must have:

**States**: default, hover, focus, active, disabled — at minimum. Some
components also need: loading, error, selected, checked, empty, skeleton.

**Accessibility built in**:
- Focus state must be visible. A 2px outline offset by 2px in the brand's
  focus color (or blue if none defined) is the baseline.
- Never rely on color alone to communicate state. Use shape, icon, or label
  in addition to color.
- Interactive elements must meet 44×44pt minimum touch target on mobile.

**Proper use of component properties**:
- Text content → Text property
- Icon visibility → Boolean property ("Show icon", "Show leading icon")
- Icon choice → Instance swap property pointing to the icon component set
- State variants → Variant property
- Size variants → Variant property

### 2.2 Buttons — The Reference Component

Buttons are the most common component and the most commonly done wrong.
Get these right and the pattern applies everywhere.

**Color rule — always**: Button label text and any icons inside the button
MUST use the same color token. They are a single visual unit. If text is
`color/text/on-primary` (white), the icon fill is also `color/text/on-primary`.
Never assign icon color independently from text color on a button.

**Required button variants** (at minimum):
- Type: Primary, Secondary, Ghost/Outline, Destructive
- Size: Small, Medium, Large (or as specified)
- State: Default, Hover, Focus, Active, Disabled, Loading

**Required button properties**:
- Label (text property)
- Leading icon (instance swap → icon component set) + Show leading icon (boolean)
- Trailing icon (instance swap → icon component set) + Show trailing icon (boolean)
- Size (variant)
- State (variant) — or use interactive states via variant

**Icon setup inside a button**:
1. Place an icon instance inside the button frame.
2. Set its color to the SAME semantic token as the button label text.
3. Expose it as an INSTANCE_SWAP property so the icon is swappable.
4. The swap target must be the master icon component set — not a random
   frame or a copy of an icon.
5. When the button variant changes (e.g., to destructive), the icon color
   updates automatically because it references the same token as the text.

**Disabled state**: reduce opacity OR use a dedicated disabled color token.
Never just grey out by changing a hex value manually — use the token.

**Button sizing**:
- Padding is horizontal. Height is fixed per size tier. Never let text
  determine button height arbitrarily.
- Standard: Small 32px / Medium 40px / Large 48px height
- Horizontal padding: at least equal to height value (e.g., 40px height → 16–20px horizontal padding)

### 2.3 Icon Library — The Right Way to Set It Up

An icon library done wrong breaks all components that use icons. Do it right once.

**Structure**:
```
Icons (component set)
├── icon/arrow-right
├── icon/check
├── icon/close
├── icon/chevron-down
└── ... (every icon as a separate component in the set)
```

Each icon component:
- Is a single frame, square (e.g., 24×24)
- Contains the SVG vector with fill set to a color token (typically
  `color/icon/default` or `color/text/primary`) — NEVER hardcoded black
  or any raw hex
- Has no extra padding frames or wrappers unless intentional

**The critical rule**: Icon color is NEVER hardcoded black (#000000). Icons
must use a semantic color token so they respond correctly when placed inside
colored components (buttons, badges, alerts). An icon inside a primary
button should be white because it inherits/matches the text token, not
because it was manually set to white.

**Connecting icons to components**:
When adding an icon property to a component (e.g., button, input, list
item), the INSTANCE_SWAP source must point to this icon component set. This
is what allows designers to swap icons without breaking color or sizing.

### 2.4 Form Components

Inputs, selects, checkboxes, radios, toggles. These are high-stakes for
accessibility and are frequently done poorly.

**Input states** (all required): Default, Focus, Filled, Error, Disabled, Read-only

**Input anatomy** (always include these as toggleable elements):
- Label (always above the field, never placeholder-only)
- Placeholder text (inside field, disappears on focus)
- Helper text (below field, always present space reserved to avoid layout shift)
- Error message (replaces or appears below helper text)
- Leading icon / trailing icon (optional, instance swap)
- Character count (optional)

**Critical accessibility rule**: Never use placeholder text as a label.
The label must always be visible. This is a WCAG failure and a UX failure.

**Error state**: must use icon + color + text. Never color alone.

**Focus state**: 2px solid focus ring, offset 2px, visible on all form
elements. The focus color must pass 3:1 contrast against adjacent colors
(WCAG 2.1 success criterion 1.4.11).

### 2.5 Consistency Rules Across All Components

These rules prevent the "feels inconsistent" problem:

1. **One corner radius system**: pick 2–3 values (e.g., 4px for small
   elements, 8px for cards/inputs, 16px for modals/sheets). Never use
   arbitrary radii.
2. **One shadow system**: 2–3 elevation levels (e.g., subtle/card,
   medium/dropdown, strong/modal). Never invent a one-off shadow.
3. **Icon sizes tied to text sizes**: 16px icon with 14px text, 20px icon
   with 16px text, 24px icon with 18–20px text. Mismatched sizes are
   immediately noticeable.
4. **Stroke weights**: 1px for subtle borders, 1.5px for inputs, 2px for
   focus rings. Never mix randomly.
5. **Animation/transition**: if prototyping, use one easing curve and one
   duration per interaction type. Don't mix.

---

## 3. Layout — Mobile and Desktop

### 3.1 Grids

Always set up a layout grid before placing content on a screen.

**Mobile** (360–390px width): 4-column grid, 16px margins, 16px gutters
**Tablet** (768px): 8-column grid, 24px margins, 16–24px gutters
**Desktop** (1280–1440px): 12-column grid, 80–120px margins (or max-width
container ~1200px centered), 24–32px gutters

Content never bleeds to the edge of the screen (except full-bleed images/
backgrounds). Always respect the grid margins.

### 3.2 Mobile-Specific Rules

- **Touch targets**: all interactive elements ≥ 44×44pt. This includes
  icon buttons, list items, checkboxes, and radio buttons.
- **Thumb zone**: primary actions should be reachable in the bottom third
  of the screen. Destructive or infrequent actions can live at the top.
- **Safe areas**: account for notch/dynamic island at top and home
  indicator at bottom. Content must not be obscured.
- **Bottom navigation vs. top tabs**: bottom navigation is standard on
  mobile for primary nav (≤5 items). Top tabs for secondary/content tabs.
- **Tap feedback**: interactive elements should have a visible pressed
  state — not just hover (hover doesn't exist on touch).
- **Keyboard avoidance**: inputs near the bottom of the screen need to be
  placed with the software keyboard in mind. Main content area should
  scroll when keyboard is open.

### 3.3 Desktop-Specific Rules

- **Hover states are required**. On desktop, hover is a primary interaction
  signal. Every interactive element needs a hover state distinct from default.
- **Cursor**: pointer cursor on all clickable elements (this is obvious in
  code but often missed in specs).
- **Dense vs. comfortable**: desktop can afford denser layouts than mobile,
  but "dense" doesn't mean cramped. Minimum 8px between interactive elements.
- **Sidebar navigation**: standard for desktop apps. Should have a
  collapsed/expanded state for narrow viewports.
- **Focus management**: keyboard navigation must be logical (top-left to
  bottom-right). Tab order follows visual reading order.

### 3.4 Spacing Hierarchy on Screens

Space communicates grouping and hierarchy. Use this pattern consistently:

```
Between sections:          48–80px
Between groups in section: 24–32px
Between related elements:  12–16px
Between tightly coupled:   4–8px  (label + input, icon + text)
```

Cramped spacing and inconsistent spacing are the top two causes of "feels
off" feedback from stakeholders. Generous, consistent spacing reads as
professional.

### 3.5 Visual Hierarchy Checklist

Every screen needs a clear answer to: *"What is the most important thing
on this screen?"*

- One H1-equivalent per screen (never two competing primary headlines)
- Clear primary action (one primary button or CTA per view)
- Supporting information visually subordinate (smaller, lighter, less contrast)
- Empty states, loading states, and error states designed — not left blank

---

## 4. Accessibility — Non-Negotiable Rules

Accessibility is not optional. Apply these to everything without exception.

### 4.1 Color Contrast

| Context | Minimum ratio | Target |
|---|---|---|
| Normal text (< 18pt / < 14pt bold) | 4.5:1 AA | 7:1 AAA |
| Large text (≥ 18pt / ≥ 14pt bold) | 3:1 AA | 4.5:1 AAA |
| UI components and graphical objects | 3:1 AA | — |
| Focus indicators | 3:1 against adjacent colors | — |

Check every text/background pairing. Check icon/background pairings.
Check border/background pairings for form elements.

Never use light grey text on white background for anything important.
`#767676` on white is the absolute minimum for normal text (4.54:1).

### 4.2 Never Communicate by Color Alone

Every state communicated by color must also use one of:
- An icon
- A text label
- A change in shape or pattern

Examples:
- Error: red color + error icon + error message text (not red border alone)
- Required field: asterisk (*) + label (not red label color alone)
- Selected state: filled/checked indicator + color (not color alone)
- Disabled: reduced opacity + cursor change + aria-disabled (not grey color alone)

### 4.3 Focus States

Every interactive element — buttons, links, inputs, dropdowns, checkboxes,
custom controls — must have a clearly visible focus state. This is the
most commonly missing accessibility feature in Figma files.

Standard focus ring: 2px solid, offset 2px, color passes 3:1 contrast
against background. Blue (#2563EB or similar) is safe on white/light
backgrounds. For dark mode, use a lighter focus color.

### 4.4 Touch Targets

44×44pt minimum on mobile. If the visual element is smaller (e.g., a 16px
icon), the tap target is enlarged with padding to meet 44×44pt. The visual
appearance is unchanged; only the interactive area grows.

### 4.5 Text Accessibility

- Don't use font weight alone to convey hierarchy — size AND weight together
- Don't use italic alone for emphasis on critical information
- Avoid ALL CAPS for body text (reduces reading speed by ~14%)
- ALL CAPS for short UI labels (2–3 words) is acceptable
- Line length: 60–80 characters for body text is optimal for reading

---

## 5. Visual Polish — What Makes It Look Professional

These are the subtle things that separate polished work from rough work.

### 5.1 Alignment

- Everything aligns to something. Nothing floats.
- Text aligns to a baseline grid (multiples of 4 or 8px from the top of a frame).
- Icons align optically to adjacent text — not always mathematically centered.
  A 20×20 icon next to 16px text often looks better aligned to the text's
  cap height than mathematically centered.
- Left-align body text in Latin scripts. Centered text only for headings,
  empty states, and short UI moments.

### 5.2 Proportions and Scale

- Type scale has clear jumps. If heading is 32px and subheading is 28px,
  they look like mistakes, not hierarchy. Min 1.25× jump between levels.
- Component sizes follow the spacing scale. A button that's 38px tall
  instead of 40px is a mistake.
- Icons scale with the component. A 24px icon in a small (32px) button is wrong.
  Use a 16px icon in a 32px button.

### 5.3 Color Application

- A primary color used everywhere loses meaning. Use it for primary actions
  and key highlights only.
- Backgrounds should have subtle hierarchy: base → surface → elevated.
  Flat all-white UIs look unfinished.
- Semantic colors (success green, error red) should not be used as
  decorative colors. They carry meaning.

### 5.4 Density and Breathing Room

- When in doubt, add more space. Cramped UIs feel amateur. Generous UIs
  feel premium.
- Cards and containers need internal padding ≥ 16px on mobile, ≥ 24px on desktop.
- List items need vertical padding: 12px minimum, 16px comfortable.

### 5.5 Consistency Audit (Run Before Handing Off)

Before finishing any design:
- [ ] All text uses defined text styles — no free-floating font properties
- [ ] All colors use tokens/variables — no raw hex values on components
- [ ] All spacing follows the scale — no arbitrary values
- [ ] All components use the library — no detached or one-off elements
- [ ] All states exist — no component missing hover, focus, or disabled
- [ ] All icons are from the icon library — no ad-hoc SVG drops
- [ ] Alignment checked — nothing floating, nothing misaligned
- [ ] Contrast checked — all text/background pairings verified
- [ ] Touch targets checked (mobile) — all interactive elements ≥ 44×44pt

---

## 6. Common Mistakes — Never Make These

| Mistake | Why it's wrong | Correct approach |
|---|---|---|
| Button icon color ≠ text color | Visually inconsistent, breaks token system | Icon and text always use the same semantic color token |
| Icons hardcoded black | Breaks inside colored components | Icons always use a semantic color token |
| Icon component set not connected to component properties | Icons can't be swapped by designers | Always use INSTANCE_SWAP pointing to the icon component set |
| Placeholder text as a label | Fails WCAG, disappears on focus | Always show a visible persistent label above the field |
| No focus state on interactive elements | Fails keyboard/accessibility users | Every interactive element has a 2px focus ring |
| Color-only error state | Fails color-blind users | Error = icon + color + text |
| Arbitrary spacing values | Looks inconsistent at scale | Only use spacing scale values (4, 8, 12, 16, 24, 32…) |
| Two competing primary buttons | Confuses users about what to do | One primary CTA per view |
| Light grey text on white for important content | Fails contrast | Check all pairings; min 4.5:1 for normal text |
| Missing disabled state | Designers can't prototype correctly | All interactive components need a disabled variant |
| Missing hover state on desktop | Breaks desktop UX | All interactive components need a hover variant |
| Free-floating font properties | Breaks design system | All text uses a defined text style |
| One-off shadow values | Inconsistent depth system | Only use defined elevation tokens |
| Corner radius inconsistency | Feels unprofessional | Only use the defined radius scale |
| Icon size mismatched with text size | Looks visually jarring | 16px icon/14px text, 20px/16px, 24px/20px |
