# accessibility-heuristics

- **inclusive-design** — proactive guidance for designing accessibly *from the start*: designing for the range of human ability (vision, motor, hearing, cognitive, situational) and baking WCAG into decisions before build.
- **accessibility-check** — a first-pass WCAG check on a screenshot, Figma frame, live URL, or code: contrast ratios, missing labels/alt text, focus order and visible focus, target sizes, heading/landmark structure, and color-only signals. Each finding cites the WCAG success criterion and a suggested fix.
- **heuristic-review** — evaluate a screen or flow against Nielsen's 10 usability heuristics, scoring each issue by severity with a concrete fix.

**A first filter, not a replacement.** These catch the obvious, mechanical issues so a human review (and real assistive-tech / user testing) can focus on judgement calls. They never certify a design as accessible or usable.

`accessibility-check` can drive the browser preview when given a URL, and computes contrast from tokens/CSS when given code. Triggers from natural language ("check this for accessibility", "run a heuristic review", "is this contrast okay?").

Install: `/plugin install accessibility-heuristics@ai-ux-toolkit`
