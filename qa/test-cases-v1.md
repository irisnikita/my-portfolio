# Test Cases v1 — Portfolio MVP

Owner: QA
Last updated: 2026-02-27

Conventions:
- Priority: **P0** blocker, **P1** high, **P2** medium/low.
- Evidence: store screenshots/reports under `qa/artifacts/<commit>/`.

| ID | Area | Priority | Preconditions | Steps | Expected result | Evidence |
|---:|------|:--------:|---------------|-------|-----------------|----------|
| SMK-001 | Smoke | P0 | Build deployed or `npm run preview` | Open `/` | Home loads, no console-breaking errors, no 404 | |
| SMK-002 | Smoke | P0 | — | From Home click **Projects** (nav + in-page link) | Lands on `/projects`, content renders | |
| SMK-003 | Smoke | P0 | — | Open a project card | Lands on `/projects/<slug>` with correct title/content | |
| SMK-004 | Smoke | P0 | — | Use Back to return to Projects, then Home | Navigation works, no blank/flicker that blocks usage | |
| SMK-005 | Smoke | P0 | Home has anchor | Click **Contact** CTA/nav (links to `/#contact`) | Scrolls to Contact section; URL includes `/#contact`; section visible | |
| SMK-006 | Smoke | P0 | — | Open `/contact` directly | Contact page loads, content present | |
| SMK-007 | Regression | P0 | — | Refresh on `/projects/<slug>` | Page still loads (no router-only state) | |
| SMK-008 | Regression | P0 | — | Verify no dead links in header/footer | All internal links resolve; external links open | |

| PERF-001 | Performance | P0 | Preview/deployed reachable | Run Lighthouse Mobile on `/` | Perf ≥ 90; capture LCP/CLS/INP (or INP proxy) | LH report |
| PERF-002 | Performance | P0 | — | Run Lighthouse Mobile on `/projects` | Perf ≥ 90; no major regressions vs Home | LH report |
| PERF-003 | Performance | P1 | — | Run Lighthouse Mobile on one project detail | Perf acceptable; no huge LCP regressions | LH report |
| PERF-004 | Performance | P0 | Browser devtools available | Idle on Home hero 20–30s | CPU/GPU stable; no continuous heavy repaint | Perf recording |
| PERF-005 | Performance | P1 | — | Background tab the site for 10s then return | Animations/rAF work paused or minimal while hidden | Perf recording |
| PERF-006 | Performance | P1 | — | Inspect continuous effects | Only `transform`/`opacity` animate; no runtime blur/filter on large layers | Notes |
| PERF-007 | Regression | P0 | — | Verify posters/images reserve space | No CLS from posters/images on projects grid | Video/LH |
| PERF-008 | Regression | P1 | — | Font loading | No FOIT; no font-induced CLS | Video |

| RM-001 | Reduced motion | P0 | OS/browser set to reduce motion | Load `/` | Hero: no parallax/loop/sweep/hotspot; reveal minimal or none | Screens |
| RM-002 | Reduced motion | P0 | — | Scroll Home and Projects | Reveal/stagger does not animate (or minimal fade only) | Video |
| RM-003 | Reduced motion | P0 | — | Navigate Projects → Detail → back | View transitions disabled/minimal; no motion-heavy transitions | Video |
| RM-004 | Reduced motion | P1 | — | Hover cards/buttons (desktop) | Hover motion/glow reduced/disabled per spec | Video |

| A11Y-001 | A11y | P0 | — | Keyboard-only: Tab from top of Home | Can reach nav + CTAs; no focus trap | Video |
| A11Y-002 | A11y | P0 | — | Activate skip link, then continue tabbing | Skip link jumps to main; focus remains visible | Video |
| A11Y-003 | A11y | P1 | — | Check focus-visible styling on buttons/links/cards | Focus clearly visible; not color-only subtle | Screens |
| A11Y-004 | A11y | P1 | — | Headings on `/` | Exactly one H1; sections use H2/H3 in order | Notes |
| A11Y-005 | A11y | P1 | — | Headings on `/projects` | Exactly one H1; card titles are not H1 | Notes |
| A11Y-006 | A11y | P1 | — | Headings on `/projects/<slug>` | Exactly one H1; subsections use H2 | Notes |
| A11Y-007 | A11y | P1 | — | Icon-only links (socials) | Have `aria-label`/accessible name | Notes |
| A11Y-008 | A11y | P1 | — | Contrast | Body text readable on dark bg; glow doesn’t wash out text | Screens |

| MOT-001 | Motion | P1 | — | Reveal rhythm on Home | Stagger timing consistent; no re-trigger spam on scroll | Video |
| MOT-002 | Motion | P1 | — | Reveal reset per section container | Sections animate independently; delays don’t accumulate globally | Video |
| MOT-003 | Motion | P1 | — | Hover micro-interactions | No layout shift; transform-based; parity with focus-visible | Video |
| MOT-004 | Motion | P1 | — | View transitions fallback | On unsupported browsers, navigation still instant/usable | Notes |

| SEO-001 | SEO | P1 | SEO pack implemented | Title/description unique per page | Correct meta on `/`, `/projects`, `/about`, detail, `/contact` | Notes |
| SEO-002 | SEO | P1 | — | OG/Twitter tags | Preview data present and correct | Notes |
| SEO-003 | SEO | P1 | — | Canonical | Correct canonical URL per page | Notes |
| SEO-004 | SEO | P1 | — | robots.txt + sitemap | Accessible, correct | Notes |
| SEO-005 | SEO | P1 | — | 404 page | Unknown route shows 404 UI and correct status (on deploy) | Notes |

| XB-001 | Cross-browser | P0 | Devices available | iOS Safari: smoke flow | Layout ok, scroll ok, sticky header ok | Screens |
| XB-002 | Cross-browser | P0 | — | Chrome Android: smoke flow | Same as above; no jank | Screens |
| XB-003 | Cross-browser | P1 | — | Firefox desktop | Hover/focus OK; view transitions fallback usable | Screens |
| XB-004 | Cross-browser | P1 | — | Desktop Safari (if available) | Backdrop-filter fallback acceptable | Screens |

## Minimum set to call MVP “QA-ready”
- All **P0** PASS.
- P1: only acceptable if explicitly waived (with notes).
- At least 2 Lighthouse reports saved (Home + Projects).
