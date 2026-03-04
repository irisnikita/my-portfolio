# Code Quality Rules

## Keep the repo non-smelly

### 1) i18n
- No `lang === 'vi' ? ... : ...` for user-facing strings.
- No `{ en, vi }` inline objects.
- Add strings to `src/i18n/locales/<lang>/*.ts`.
- For tool dictionaries passed to React islands, use `src/i18n/dicts/*`.

### 2) Routing
- Do not duplicate `/vi/*` wrappers.
- Use the locale route segment: `src/pages/[...lang]/...`.

### 3) React/JS hygiene
- Avoid mutating DOM styles in handlers (prefer class toggles or CSS).
- Avoid giant inline style objects in React (prefer CSS/Tailwind).
- Use `useMemo/useCallback` only when it prevents real recompute or fixes referential deps.
- Fix `react-hooks/exhaustive-deps` warnings unless there's a documented reason.

### 4) Types
- Prefer `unknown` over `any`.
- If `any` is required (3rd-party), isolate it in a small wrapper.

### 5) Logging
- Avoid logging raw user messages / PII.

## Quick checklist before commit
- `./skills.sh check` (runs **strict lint**, prettier check, and build)
