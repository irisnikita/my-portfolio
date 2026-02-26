# MVP Smoke Checklist (Mobile-first)

Captured: 2026-02-26 15:40 (GMT+7)

## MVP smoke (mobile-first)
- [ ] Home → Projects → Project Detail → Contact
  - [ ] Layout không vỡ (mobile-first)
  - [ ] Link/CTA đúng
  - [ ] Không 404

## Performance
- [ ] Lighthouse mobile: **Performance ≥ 90**
- [ ] Kiểm **LCP / CLS / INP**
- [ ] Đảm bảo **hero không ngốn CPU/GPU khi idle**

## Reduced motion
- [ ] Bật `prefers-reduced-motion` → **hero static**
- [ ] Không parallax/loop
- [ ] Section reveal tối giản

## A11y
- [ ] Keyboard-only navigation (không kẹt focus)
- [ ] Focus visible
- [ ] Headings order đúng
- [ ] Alt text
- [ ] `aria-label` cho icon links
- [ ] Skip link hoạt động

## Cross-browser
- [ ] iOS Safari
- [ ] Chrome Android
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Kiểm scroll, font render, hover/focus behavior

## Visual QA
- [ ] Glow không làm mờ chữ
- [ ] Grain/vignette không banding
- [ ] Contrast body text đủ đọc

## SEO QA
- [ ] Title/description unique
- [ ] OG/Twitter preview đúng
- [ ] canonical / sitemap / robots OK
- [ ] 404 page

## Form QA (nếu có)
- [ ] Honeypot
- [ ] Validation
- [ ] Success/error states
- [ ] Deliverability test

## Regression checklist (polish)
- [ ] Animation throttle
- [ ] Lazy images
- [ ] Font loading (FOIT/CLS)
- [ ] Dark mode consistency
