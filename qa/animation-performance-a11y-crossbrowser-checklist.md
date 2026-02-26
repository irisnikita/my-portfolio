# Animation + Performance + A11y + Cross-browser Checklist

Captured: 2026-02-26

## Animation checklist
- [ ] Hover micro-interactions: cards/buttons/links
  - [ ] No layout shift
  - [ ] No jank
  - [ ] Focus-visible equivalent states (keyboard parity)
- [ ] Reveal rhythm
  - [ ] Stagger timing consistent
  - [ ] No re-trigger spam on scroll
  - [ ] Works on mobile
- [ ] Page transitions
  - [ ] Projects → Detail and back
  - [ ] No flicker
  - [ ] No broken scroll restoration
- [ ] Reduced-motion
  - [ ] All loops/parallax/stagger/page transitions disabled or minimal fade

## Performance checklist (mobile-first)
- [ ] Lighthouse mobile: Perf **≥ 90** (track LCP/CLS/INP)
- [ ] Hero idle: CPU/GPU stable
  - [ ] No continuous heavy repaint
  - [ ] rAF work stops when tab hidden
- [ ] Continuous effects are transform/opacity-only
  - [ ] No large blur/filter animations
- [ ] Hero layers count ≤ 6
- [ ] Mobile disables near grid + pointer hotspot

## A11y checklist
- [ ] Keyboard-only nav
- [ ] Skip link works
- [ ] Focus visible on all interactive elements
- [ ] Headings
  - [ ] Single H1 per page
  - [ ] Hierarchy valid
- [ ] Contrast
  - [ ] Body text readable
  - [ ] Neon doesn’t wash out

## Cross-browser
- [ ] iOS Safari
- [ ] Chrome Android
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] View transitions fallback (if unsupported) still usable

## Regression list
- [ ] Reduced-motion regressions
- [ ] CLS from fonts/images/posters
- [ ] Nav active state with `/#contact`
- [ ] Project detail rendering (MDX) + outbound links
