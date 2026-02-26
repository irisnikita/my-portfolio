# Polish Pass QA Criteria (Cinematic Dark Neon)

Applies to hero layering + hotspot + light sweep + scanline + content density upgrades.

## Non-negotiables (release gates)
- **Mobile smoothness:** no jank on mid-tier phones; avoid continuous paints when idle.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables all non-essential motion (no parallax/loop/sweep/hotspot follow).
- **A11y:** keyboard-only navigation works; focus visible; headings order sane; icons have aria-label; skip link works.
- **Perf target:** Lighthouse Mobile **Perf ≥ 90** (baseline) and no single regression >5 points after polish.

## Hero effects: implementation constraints (QA checks map)
### 1) Light sweep
- Must be **opacity/transform only** (no blur/filter animation).
- Duration 10–16s, low opacity.
- **Stops** under reduced motion.
- **Pause when tab hidden** (if JS-driven); if CSS animation, verify reduced-motion media query stops it.

QA:
- Check computed styles: no animating `filter`, `box-shadow`, `background-position` on huge layers.
- Timeline sample: compositor-only animations (Chrome DevTools → Rendering → Paint flashing should stay quiet when idle).

### 2) Cursor glow hotspot
- **Desktop only** (pointer fine + hover), disabled on touch/mobile.
- Uses rAF throttle; clamps to bounds; no layout reads per frame besides cached rect.
- Under reduced motion: disabled.

QA:
- Verify on mobile emulation/touch: hotspot inactive.
- Verify no continuous rAF loop when pointer idle.

### 3) Scanline / interference
- Opacity 0.03–0.05.
- Must not create banding; avoid heavy SVG filters.
- Under reduced motion: either static or disabled.

QA:
- Visual check at low brightness + dark mode: no banding.

### Optional: Canvas orb
- Only if chosen: cap DPR ≤ 1.5, low FPS (24), pause on tab hidden, stop on reduced motion.

QA:
- Idle CPU/GPU: ensure canvas not rendering when hidden or reduced motion.

## Content density upgrades
- Proof bar items: readable contrast; doesn’t wrap awkwardly at 360px.
- Project cards:
  - Cover “poster” must not shift layout (fixed aspect ratio placeholder).
  - Metric text must be real text (not baked into image).
- Case study sections: Overview → Problem → Constraints → Approach → Result → Learnings
  - Headings in order; one H1 per page.

## Regression focus
- **CLS:** images/posters reserve space; fonts avoid FOIT; hero layers not causing layout shifts.
- **INP:** pointer-follow doesn’t degrade button interactions.
- **Scroll perf:** parallax only on scroll events; no scroll-linked effects beyond transform.

## Quick evidence to capture per build
- Lighthouse report (mobile)
- 2 screenshots: hero (default + reduced motion)
- 10s Performance recording: idle on hero + scroll a bit
