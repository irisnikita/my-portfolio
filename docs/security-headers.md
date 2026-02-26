# Security headers baseline (starter)

This is a **starter** set intended to be safe and not break Astro assets.
Tighten later once you know all third-party domains (analytics, form providers, embeds).

## Headers

- Referrer-Policy: `strict-origin-when-cross-origin`
- X-Content-Type-Options: `nosniff`
- Permissions-Policy: `camera=(), microphone=(), geolocation=()`

## CSP (starter)

Included in `vercel.json` (enforced):

```
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
img-src 'self' data: https:;
font-src 'self' https: data:;
style-src 'self' 'unsafe-inline';
script-src 'self';
connect-src 'self' https:
```

## Report-only option

If you want to trial CSP without breaking the site, switch the header key in `vercel.json` from:
- `Content-Security-Policy` → `Content-Security-Policy-Report-Only`

(Do **not** ship both at once unless you explicitly want enforce+report behavior.)

## Notes
- `style-src 'unsafe-inline'` is often needed initially due to inline styles; remove later if you can.
- If you add analytics (e.g. Plausible, GA), update `script-src`/`connect-src` accordingly.
- If you embed YouTube, add `frame-src` and update other directives as needed.
