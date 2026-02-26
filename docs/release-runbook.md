# Release runbook (Vercel)

## Default flow

1) **Open PR** into `main`
2) Vercel creates a **Preview Deployment**
3) **QA sign-off** on preview URL
4) Merge PR → Vercel deploys **Production** (from `main`)

## Env vars

- `PUBLIC_CONTACT_EMAIL` (used for mailto links / contact section)

## QA sign-off checklist (preview)

- Visual pass: layout, typography, responsive (mobile + desktop)
- Hero: smooth, no jank, `prefers-reduced-motion` works
- Forms (if any): submit works, confirmation path works
- Navigation: no broken internal links
- Quick perf sanity: Lighthouse or DevTools performance glance

## Rollback

If a production deploy has an issue:
- Go to Vercel → Project → Deployments
- Pick the last known-good deployment
- **Promote to Production** (or redeploy) 

## Hotfix

- Create PR with fix
- QA on preview
- Merge to `main`
