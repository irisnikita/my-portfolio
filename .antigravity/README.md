# Antigravity rules (repo-local)

If you're using Antigravity (Gemini Pro Opus 4.6) to work on this repo, **read these files first**:

1) `AGENTS.md` (the strict rules)
2) `docs/i18n.md` (how i18n is structured)
3) `skills.sh` (how to run checks)

## Definition of Done
A change is "done" when:
- `npm run build` passes
- `npm run lint` passes (no errors)
- No new i18n inline strings / no `isVi` branches are introduced

## Where to put new rules
- General rules: `AGENTS.md`
- Detailed conventions: `docs/rules/*.md`
- Reusable prompts: `prompts/*.md`
