# Release Gates (MVP)

Use this as Definition of Done for QA sign-off.

## P0 — Blockers (must be FIXED before release)
- Any **404** or broken navigation in core flow: Home → Projects → Project Detail → Contact.
- Page crash / blank screen / console error that breaks UX.
- **Keyboard-only** cannot reach key CTAs/links; focus trapped; skip link broken.
- **Reduced motion**: animations/parallax/loops/transitions still run in a noticeable way when `prefers-reduced-motion: reduce`.
- Lighthouse Mobile **Performance < 90** on Home or Projects.
- CLS that causes visible layout jump on load or route transition.

## P1 — High (fix before “premium” ship; can ship MVP only if explicitly accepted)
- Heading structure issues (missing H1, wrong hierarchy) on key pages.
- Contrast issues that reduce readability (body text, links, focus ring).
- Hover micro-interactions not mirrored by `:focus-visible`.
- View transition flicker or broken scroll restoration (but navigation still works).
- Hero causes measurable idle work (minor continuous paints / small CPU churn).

## P2 — Medium/Low (polish backlog)
- Minor spacing/typography inconsistencies.
- Glow/grain/vignette tuning.
- Subtle cross-browser rendering differences without usability impact.

## Evidence required for QA sign-off
- Lighthouse mobile report(s) saved under `qa/artifacts/<commit>/`.
- Reduced-motion screenshots: hero + projects grid.
- Short perf recording: idle hero + scroll sample.
