# Performance budget (do / don't)

Goal: keep the site fast and Lighthouse-friendly while still allowing a signature hero.

## Islands hydration

**Budget (home page):** max **2–3 hydrated islands** total.

DO:
- Prefer static HTML/CSS.
- Use `client:visible` or `client:idle` when hydration is necessary.

DON'T:
- Avoid `client:load` by default.
- Don’t hydrate purely decorative components.

## Hero (neon grid parallax)

**Layer cap:** max **6 layers** (background, grid, glow accents, content, optional noise, optional foreground highlight).

DO:
- Animate only `transform` and `opacity`.
- Keep parallax amplitude small (2–12px).
- Keep SVG simple (few paths, low opacity lines).
- Provide `prefers-reduced-motion` fallback (static hero).

DON'T:
- No heavy SVG filters (large `feGaussianBlur`, animated filters).
- No full-screen CSS `filter: blur()`.
- No large animated box-shadows.
- Don’t stack 15–30 absolute layers for "depth".

## JS budget

DO:
- One tiny parallax script (no large animation libs).
- Throttle with `requestAnimationFrame`.
- Disable on `prefers-reduced-motion` and when tab is hidden.

DON'T:
- Don’t attach multiple scroll/mouse listeners per component.

## Images

DO:
- Use AVIF/WebP when possible.
- Use responsive sizes (`srcset`) for large images.

DON'T:
- Don’t ship multi-megabyte hero images.
