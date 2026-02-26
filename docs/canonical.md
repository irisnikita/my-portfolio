# Canonical enforcement (non-www)

## Redirects

`vercel.json` redirects:
- `www` → non-www
- `http` → `https`

## Canonical tags (Astro)

In your base layout, set canonical based on the final URL:

```astro
---
const { url } = Astro;
const canonical = url ? url.toString() : undefined;
---
<link rel="canonical" href={canonical} />
```

Notes:
- If you generate pages at build-time without a runtime URL, you can instead construct canonical from `site` in `astro.config`.
- Ensure you set `site` in `astro.config.mjs` for consistent canonical URLs:

```js
export default defineConfig({
  site: 'https://example.com',
});
```
