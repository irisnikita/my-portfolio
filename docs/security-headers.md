# Security headers baseline (starter)

This is a **starter** set intended to be safe and not break Astro assets.
Tighten later once you know all third-party domains (analytics, form providers, embeds).

## Headers

- Referrer-Policy: `strict-origin-when-cross-origin`
- X-Content-Type-Options: `nosniff`
- Permissions-Policy: `camera=(), microphone=(), geolocation=()`

## CSP (starter)

Included in `vercel.json`:

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

Notes:
- `style-src 'unsafe-inline'` is often needed initially due to inline styles; remove later if you can.
- If you add analytics (e.g. Plausible, GA), update `script-src`/`connect-src` accordingly.
- If you embed YouTube, update `frame-src` and potentially `img-src`.
