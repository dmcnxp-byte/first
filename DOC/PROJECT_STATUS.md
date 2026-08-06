# Project Status

**Current phase:** 2 — Project Foundation. Complete, verified, awaiting approval before Phase 3.
**Date:** 2026-08-06

---

## Phase 2 — Project Foundation

**Status:** Complete. `npm install`, `npm run dev`, `npm run lint`, `npm run typecheck`, and `npm run build` all pass clean from a fresh clone. Awaiting approval before any page/component/schema/business-logic work (Phase 3) begins.

### 1. What was built

Strictly technical initialization, per [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md), [DEPLOYMENT_STRATEGY.md](DEPLOYMENT_STRATEGY.md), [GIT_WORKFLOW.md](GIT_WORKFLOW.md), and [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) — no pages, components, Sanity schemas, Supabase tables, forms, API routes, or business logic.

| Area | What exists |
|---|---|
| Repo | npm workspaces at root (`apps/*`), git initialized, one commit |
| Next.js app | `apps/web` — App Router, TypeScript strict, Tailwind CSS |
| Routing skeleton | Route groups `(site)`, `(landing)`, `(studio)` with passthrough layouts; one placeholder page at `(site)/page.tsx` so `/` doesn't 404 |
| Sanity Studio | Embedded at `/studio` (`app/(studio)/studio/[[...tool]]/page.tsx`), `sanity.config.ts`, `structureTool` + `visionTool`, **empty** schema array |
| Supabase | `lib/supabase/server-client.ts` — service-role client guarded by the `server-only` package; `lib/supabase/schema.sql` checked in as a **reference copy, not applied** to any project |
| Sanity read client | `lib/sanity/client.ts` (configured, no queries yet), `lib/sanity/image.ts` (image-url builder) |
| Fonts | Poppins/Inter/Lora via `next/font/google`, wired as CSS variables in `app/layout.tsx` → `app/globals.css` `@theme` block |
| Images | `next.config.ts` allows `cdn.sanity.io` via `remotePatterns` |
| Folder skeleton | `components/{ui,sections,page-builder,layout,forms,chat,seo}`, `lib/{sanity/queries,sanity/types,seo/schema,leads,personalization,utils}` — each empty dir carries a `README.md` stub linking to the owning architecture doc |
| Assets | `logo-primary.png`, `favicon.png` copied from `/design` into `apps/web/public/brand/` |
| Linting/formatting | ESLint (`eslint-config-next` + `eslint-plugin-jsx-a11y`), Prettier (+ `prettier-plugin-tailwindcss`), Husky pre-commit → `lint-staged` |
| Env | Root `.env.example` (names only, matches [DEPLOYMENT_STRATEGY.md § 4](DEPLOYMENT_STRATEGY.md#4-environment-variables)); `apps/web/.env.local` (gitignored, placeholder Sanity project ID so local `dev`/`build` succeed without a real project) |
| Docs | Root `README.md` (setup + repo map), `apps/web/README.md` (pointer to root) |

### 2. Installed technologies & versions

| Package | Version installed | Notes |
|---|---|---|
| next | 16.3.0 | latest stable at time of setup |
| react / react-dom | 19.2.8 | |
| typescript | ^5 | strict mode |
| tailwindcss | ^4 | **v4, CSS-first** — see deviation note below |
| sanity | ^6.9.0 | |
| next-sanity | ^13.3.1 | |
| @sanity/vision | ^6.9.0 | dev/debug GROQ tool |
| @sanity/image-url | ^2.1.1 | |
| @supabase/supabase-js | latest | |
| server-only | latest | enforces the service-role client never reaches a Client Component |
| eslint | ^9 | flat config |
| eslint-config-next | 16.3.0 | |
| eslint-plugin-jsx-a11y | latest | added per [DEVELOPMENT_GUIDELINES.md § 4](DEVELOPMENT_GUIDELINES.md#4-linting--formatting) |
| prettier | ^3.5 | root-level |
| prettier-plugin-tailwindcss | ^0.6 | class sorting |
| husky / lint-staged | latest | pre-commit hook |

### 3. Project structure delivered

```
distance-mba-college/
├── apps/web/
│   ├── app/
│   │   ├── (site)/{layout.tsx, page.tsx}       # placeholder page + passthrough layout
│   │   ├── (landing)/layout.tsx                 # passthrough layout, no pages yet
│   │   ├── (studio)/{layout.tsx, studio/[[...tool]]/page.tsx}   # embedded Sanity Studio
│   │   ├── layout.tsx, globals.css               # root layout: fonts, Tailwind import
│   ├── components/{ui,sections,page-builder,layout,forms,chat,seo}/README.md
│   ├── lib/
│   │   ├── sanity/{client.ts, image.ts, queries/README.md, types/README.md}
│   │   ├── supabase/{server-client.ts, schema.sql}
│   │   ├── seo/schema/README.md
│   │   ├── leads/README.md
│   │   ├── personalization/README.md
│   │   └── utils/README.md
│   ├── sanity/{env.ts, schemaTypes/index.ts}
│   ├── public/brand/{logo-primary.png, favicon.png}
│   ├── sanity.config.ts, next.config.ts, tsconfig.json, eslint.config.mjs, package.json
├── DOC/            # Phase 1 architecture (unchanged)
├── design/         # Phase 1 source material (unchanged)
├── .husky/, .gitignore, .prettierrc.json, .prettierignore, .env.example
├── package.json    # workspaces root
└── README.md
```

Full target tree (including everything still to be built): [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md).

### 4. Verification results

| Command | Result |
|---|---|
| `npm install` (root) | ✅ clean — 1257 packages, 0 errors (15 pre-existing moderate/high advisories in `sanity`'s CLI-only transitive deps — see § 6) |
| `npm run dev` | ✅ ready in <1s; `/` → 200, `/studio` → 200, unknown route → 404 |
| `npm run lint` | ✅ clean (Next.js + jsx-a11y rules) |
| `npm run typecheck` | ✅ clean |
| `npm run build` | ✅ 3 static routes generated (`/`, `/_not-found`, `/studio/[[...tool]]`) |

### 5. Deviations from the Phase 1 documentation (and why)

| Doc reference | Documented | What was actually done | Why |
|---|---|---|---|
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) | `tailwind.config.ts` | Tailwind v4's CSS-first config (`@import "tailwindcss"` + `@theme` in `globals.css`, no config file) | The brief asked for "latest stable versions"; Tailwind v4 (current stable) moved theme config into CSS. Brand colour/spacing tokens are deferred to Phase 3 with the component library either way — only font-family tokens were needed now |
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) `apps/studio/` | Shown as an alternative to embedding | Studio embedded in `apps/web` (no `apps/studio`, no `packages/`) | This is the doc's own **recommended default** ("simpler to deploy... one Vercel project"), and no shared package is needed with only one app |
| — | — | Root lockfile only; the nested `apps/web/package-lock.json` left over from the pre-workspace `create-next-app` run was deleted | npm workspaces must have exactly one lockfile at the root; a stale duplicate could drift from what's actually installed |

Everything else matches the approved documentation as written.

### 6. Known items carried forward (not blocking, tracked for Phase 3)

- **npm audit: 15 advisories (13 moderate, 2 high)** — all in `sanity`'s own CLI/build tooling transitive deps (`js-yaml`, `smol-toml`, `undici`, pulled in via `@sanity/cli` → `@vercel/frameworks` / `@module-federation/*`). These affect Sanity's standalone `sanity dev`/`sanity build` CLI commands, which this project does not use (Studio is embedded via Next.js routes) — not the production runtime bundle. `npm audit fix --force` would downgrade `sanity` to `5.14.1`, which contradicts the "latest stable" instruction and was **not** applied. Re-check when Sanity ships a patched release.
- **Route/page/API-route directories from [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) were intentionally not pre-created** as empty folders (e.g. `app/(site)/about/`, `app/api/leads/`) — Next.js doesn't require them to exist for routes it doesn't yet serve, and creating empty leaf-route folders added no verifiable value. They're created in Phase 3 alongside the page/route implementation that populates them.
- **`middleware.ts`** (redirect resolution + personalization cookie) was not created — both are business logic explicitly out of scope for this phase; see [ROUTING_STRATEGY.md](ROUTING_STRATEGY.md) and [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md).
- **`apps/web/.env.local` uses a placeholder Sanity project ID** (`placeholder`/`development`) purely so `dev`/`build` succeed without live credentials. A real Sanity project must be created and its ID/dataset/tokens supplied before Studio will actually authenticate — this is an open item, not a defect.

### 7. Remaining work (Phase 3+)

Everything on the Phase 1 "DO NOT IMPLEMENT" list for this phase: Sanity schema types (`university`, `programme`, `specialization`, `compare`, `offering`, etc. — [DATA_MODEL.md](DATA_MODEL.md)), Supabase tables actually applied + RLS enabled ([SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md)), the component library ([COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md)), the page-builder block registry ([PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md)), actual page templates and routes, lead forms and `/api/*` route handlers ([FORMS_ARCHITECTURE.md](FORMS_ARCHITECTURE.md)), the redirect engine, and the AI chat widget shell.

---

## Phase 1 — Project Discovery & Architecture

**Status:** Documentation complete and approved.

### 1. What was delivered

| Deliverable | File | Covers |
|---|---|---|
| Business/product context | [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Who the business is, why the rebuild, brand snapshot, stack |
| Step 1 — full requirements analysis | [REQUIREMENTS_ANALYSIS.md](REQUIREMENTS_ANALYSIS.md) | Business/functional/non-functional requirements, pages, journeys, nav, reusable patterns, components, sections, forms, content types, design system, assets, responsive behaviour, missing info, assumptions |
| 1. Overall system architecture | [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) | Context/container diagrams, request flow, integrations, environments, ADRs |
| 2. Frontend architecture | [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) | Rendering strategy per page type, data fetching, images/fonts, styling |
| 3. Enterprise folder structure | [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) | Full target repo tree |
| 4. Component architecture | [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) | Atomic layering, component contracts, accessibility contract |
| 5. Layout architecture | [LAYOUT_ARCHITECTURE.md](LAYOUT_ARCHITECTURE.md) | Header/footer variants, route groups, metadata composition |
| 6. Dynamic page builder architecture | [PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md) | Block registry pattern, editorial constraints, LP specifics |
| 7. Sanity CMS architecture | [SANITY_CMS_ARCHITECTURE.md](SANITY_CMS_ARCHITECTURE.md) | Studio structure, plugins, roles, preview/webhook contracts |
| 8-9. Content model & data relationships | [DATA_MODEL.md](DATA_MODEL.md) | Every document/object type's fields, ERD, sitemap reference |
| 10. Routing strategy | [ROUTING_STRATEGY.md](ROUTING_STRATEGY.md) | Route inventory, redirect engine, sitemap/robots/llms.txt |
| 11. State management strategy | [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) | What needs client state and what deliberately doesn't |
| 12. Supabase architecture | [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md) | Schema, RLS posture, write path, retention |
| 13. Forms architecture | [FORMS_ARCHITECTURE.md](FORMS_ARCHITECTURE.md) | Config-driven LeadForm, validation, scoring rubric, anti-spam |
| AI counsellor & personalization | [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md) | Chat widget contract, smart tools, cookie-based personalization |
| 14. SEO strategy | [SEO_STRATEGY.md](SEO_STRATEGY.md) | SEO/AEO/GEO, schema.org, EEAT, llms.txt |
| 15. Performance strategy | [PERFORMANCE_STRATEGY.md](PERFORMANCE_STRATEGY.md) | Core Web Vitals targets and mechanics |
| 16. Git strategy | [GIT_WORKFLOW.md](GIT_WORKFLOW.md) | Branching, commits, PR process |
| 17. Deployment strategy | [DEPLOYMENT_STRATEGY.md](DEPLOYMENT_STRATEGY.md) | Vercel environments, promotion flow, env vars, rollback |
| 18-19. Coding & development standards | [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) | TS/lint/test standards, accessibility, PR checklist |
| 20. Future scalability | [FUTURE_SCALABILITY.md](FUTURE_SCALABILITY.md) | i18n, multi-brand, AI backend maturity, what's deliberately not built yet |

All 20 architecture items from the brief are covered; every requirement-analysis sub-item from Step 1 is covered.

### 2. Source material consumed

`design/homepage.html`, `design/landing-page-online-mba.html`, `design/programme-online-mba.html`, `design/specialization-marketing.html`, `design/university-nmims.html`, `design/compare-nmims-vs-symbiosis.html`, `design/resource-distance-mba-guide.html`, `design/distance-mba-college-sitemap-content.md`, `design/Distance-MBA-College-Brand-Guidelines-FINAL.docx`, `design/University.csv`, `design/sitemap.xlsx`, `design/logo-primary.png`, `design/favicon.png`.

### 3. Open questions for stakeholder sign-off

Carried forward from [REQUIREMENTS_ANALYSIS.md § 15](REQUIREMENTS_ANALYSIS.md#15-missing-information--open-items-for-stakeholder-sign-off) — **still open**, none were resolved during Phase 2 since it was technical-foundation-only:

| # | Question | Blocking? |
|---|---|---|
| 1 | Confirm `distance-mba-college-sitemap-content.md` is authoritative over `sitemap.xlsx` for nav IA (the xlsx's Compare/Resources columns are empty) | No — architecture already defaults to the markdown doc |
| 2 | Real per-university `Fees`/`Duration`/`Eligibility` content — `University.csv` has inconsistent fee formats and uniform placeholder duration/eligibility text across all 30 rows | **Yes, before content migration** |
| 3 | Final authoritative university count/priority order (CSV: 30 rows; content strategy: ~25-30 named + priority tiers; xlsx: "25+") | **Yes, for build sequencing** |
| 4 | AI counsellor backend vendor/model selection | No — out of scope by design; needed before that specific feature ships |
| 5 | Name/credentials of the existing CRM system leads currently flow into | **Yes, before Phase 3 forms/API work begins** |
| 6 | Logo variant files (reverse/mono/stacked/icon/monogram) — only the primary PNG exists today | **Yes, before the `Header`/`Footer` components are built** |
| 7 | Design review of Blog Post/Counsellor Profile/Success Story layouts — no HTML mockup exists for these three types | Recommended before building those three templates |
| 8 | Lead data retention policy (how long Supabase keeps `leads`/`ai_chat_sessions` after CRM handoff) | **Yes, before production launch** |

### 4. Recommended build sequence (Phase 3+, pending approval)

1. **Core schema & data** — Sanity document/object types per [DATA_MODEL.md](DATA_MODEL.md); apply the Supabase schema + RLS.
2. **Component library** — primitives → sections → layout shells, per [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md).
3. **Critical pages** — Homepage (page builder + default preset), Programmes overview + 4 mode hubs, Universities directory, About/How-It-Works/Contact/Brochure.
4. **Critical entity pages** — highest-priority university pages (NMIMS, Symbiosis, Amity, Manipal Jaipur, BITS WILP, ISB), 2-3 comparison pages, all 27 campaign LPs migrated under `/lp/` with redirects.
5. **Lead pipeline** — `LeadForm`, `/api/leads`, redirect middleware, CRM webhook (blocked on open item #5).
6. **AI chat widget shell + smart tools** (rules-based backend initially, per the seam in [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md)).
7. **Verification** — schema/structured-data validation, Core Web Vitals audit, full redirect-map crawl test, cross-device QA, `llms.txt` live, lead pipeline end-to-end test.
8. **Remaining catalogue** — remaining university pages, all specialization pages, remaining comparison pages, resource/pillar guides, counsellor profiles, success stories, blog.

This sequencing is a **recommendation**, not a commitment made in this document.

### 5. Approval gate

**Phase 1 is approved.** Phase 2 (this document's top section) is complete and awaiting approval. **Phase 3 (schemas, components, pages, forms, business logic) does not begin until Phase 2 is explicitly approved.**
