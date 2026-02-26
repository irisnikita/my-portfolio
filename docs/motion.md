# Motion rules (cinematic but mobile-smooth)

This doc defines what motion is allowed and how we keep it smooth.

## Global gating

- Respect `prefers-reduced-motion: reduce`
  - No parallax, no sweep loops, no cursor-follow
  - Keep a static hero that still looks good
- Disable pointer-follow effects unless `(pointer: fine)` and `(hover: hover)`
- Pause rAF loops on `document.visibilityState !== 'visible'`

## Allowed properties

- ✅ `transform` (translate/scale/rotate)
- ✅ `opacity`
- ⚠️ `background-position` (only if extremely slow; prefer transform on a pseudo-layer)

## Avoid

- ❌ animating `filter` (blur/glow) at runtime
- ❌ animating large box-shadows
- ❌ expensive SVG filters (`feGaussianBlur` on big areas)

## Suggested budgets

- Hero layers: <= 6
- Pointer-follow amplitude: <= 12px
- Sweep duration: 10–16s, opacity <= ~0.12
- Scanline opacity: 0.03–0.06
