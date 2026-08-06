# Deployment Strategy

Target platform: Vercel, per the brief. Covers environment promotion, CI gates, and the Sanity/Supabase configuration that travels with each environment.

## 1. Vercel project topology

One Vercel project for the Next.js app (which embeds Sanity Studio at `/studio`, per the recommended default in [SANITY_CMS_ARCHITECTURE.md § 1](SANITY_CMS_ARCHITECTURE.md#1-project-topology)). No separate Vercel project for Studio unless the team later splits it into its own package.

## 2. Promotion flow

```
Feature branch → PR opened → Vercel Preview Deployment (unique URL per PR, per push)
                                   │ points at Sanity `staging` dataset + Supabase `staging` project
                                   │ CI: typecheck, lint, tests, Lighthouse budget gate
                                   ▼
                              PR approved & merged → main
                                   │
                                   ▼
                        Vercel Production Deployment (auto, on merge to main)
                                   │ points at Sanity `production` dataset + Supabase `production` project
                                   ▼
                              Live at distancembacollege.com
```

Every PR gets an isolated, shareable preview URL — this is how stakeholders and content editors review both code changes and content/page-builder arrangements (via Sanity's Presentation tool pointed at the preview URL, see [SANITY_CMS_ARCHITECTURE.md § 4](SANITY_CMS_ARCHITECTURE.md#4-plugins)) before anything reaches production.

## 3. Environments summary

| Environment | Trigger | Sanity dataset | Supabase project | Notes |
|---|---|---|---|---|
| Local | `next dev` | `development` | local/dev Supabase project | Fastest iteration loop |
| Preview | any PR push | `staging` | staging project | One per PR, ephemeral |
| Production | merge to `main` | `production` | production project | Custom domain, `distancembacollege.com` |

## 4. Environment variables

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | all | Public — dataset name differs per environment |
| `SANITY_API_READ_TOKEN` | server-only | CDN API read token, per environment |
| `SANITY_API_PREVIEW_TOKEN` | server-only | Draft-mode preview reads |
| `SANITY_REVALIDATE_SECRET` | server-only | Validates incoming webhook calls to `/api/revalidate` |
| `SANITY_STUDIO_PREVIEW_SECRET` | server-only | Validates `/api/draft-mode/enable` calls from Studio |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | server-only | Never exposed to the client — see [SUPABASE_ARCHITECTURE.md § 2](SUPABASE_ARCHITECTURE.md#2-row-level-security) |
| `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` | server-only | Outbound lead forwarding, per environment (staging should point at a sandbox/test CRM endpoint, never the real one) |
| `AI_CHAT_BACKEND_*` | server-only | Whatever the chosen backend needs (§ [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md)) — placeholder until Phase 2+ vendor selection |
| `WHATSAPP_NUMBER` | public | `918669661005` — sourced from Site Settings ideally, env var only as a build-time fallback |

All server-only variables are configured directly in Vercel's project settings per environment, never in a committed file (see [GIT_WORKFLOW.md § 5](GIT_WORKFLOW.md#5-environmentconfig-safety)).

## 5. Content-change deploy path (no code deploy required)

Editor publishes in Sanity → webhook → `/api/revalidate` → `revalidateTag`/`revalidatePath` → next request for that path serves fresh content. This path **never touches Vercel's build pipeline** — it's the explicit mechanism by which NFR-9 ("zero-downtime content publishing") is met, and it's why the homepage/landing-page builder pattern is viable for marketers without engineering involvement per change.

## 6. Domain & redirects at the platform level

- `distancembacollege.com` (and `www` variant, redirected to the canonical) configured as the Production custom domain in Vercel.
- The bulk of the ~72 legacy-URL redirects are handled by the application-level Edge Middleware (see [ROUTING_STRATEGY.md](ROUTING_STRATEGY.md)), **not** Vercel's static `redirects` config in `next.config.ts` — because the redirect set is editor-managed content, not a deploy-time constant. `next.config.ts` redirects are reserved only for a small number of truly permanent, code-level path changes (e.g. an old `/blogs/` → `/blog/` structural rename) that will never need runtime editing.

## 7. Rollback

Vercel's atomic deployments mean any previous Production deployment can be instantly promoted back if a bad merge ships — no separate rollback tooling needed. Content rollbacks (a bad publish in Sanity) are handled via Sanity's own document history/revert, independent of the code rollback path — the two are decoupled by design (ADR-1), so a bad content publish never requires a code rollback and vice versa.

## 8. CI gates (run on every PR, before merge is allowed)

TypeScript typecheck → ESLint → unit tests → build → Lighthouse budget check against the preview deployment URL (see [PERFORMANCE_STRATEGY.md § 8](PERFORMANCE_STRATEGY.md#8-performance-budget-enforcement)). Full standards for what these checks enforce are in [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md).
