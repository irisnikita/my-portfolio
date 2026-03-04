# Agent Rules (Antigravity / coding agents)

This repo is an **Astro 5 + React islands** portfolio.

## Non‑negotiables

### i18n
- **No inline if/else strings** in components (e.g. `lang === 'vi' ? ... : ...`).
- **No hardcoded `{ en, vi }` objects** embedded in components.
- All user-facing strings must come from `src/i18n/locales/<lang>/*.ts`.
- Messages are **split by feature/file** (not one giant dictionary).
- Add keys to **EN first** (source of truth), then mirror to VI.
- Use:
  - `getLangFromUrl(Astro.url)`
  - `useTranslations(lang)`
  - `useTranslatedPath(lang)`

### Routing
- Locale routing uses an **optional route segment**: `src/pages/[[lang]]/...`
- Default locale (**en**) has **no prefix**: `/projects`
- Vietnamese is prefixed: `/vi/projects`
- Do not re-introduce duplicated `/vi/*` page wrappers.

### React islands
- Avoid inline style objects for large components (prefer CSS / Tailwind / CSS variables).
- Only use `useMemo` / `useCallback` when:
  - a derived computation is non-trivial **and** runs on every render, or
  - referential stability is required (dependencies, memoized children).

## Before committing
Run:
- `npm run lint`
- `npm run build`

(Optionally) `npm run format:check`

## Files to read first
- `src/i18n/messages.ts`
- `src/i18n/utils.ts`
- `src/i18n/routing.ts`
- `docs/i18n.md`
