# Project Status — Phase 1

**Phase:** 1 — Project Discovery & Architecture
**Status:** Documentation complete. Awaiting stakeholder approval before any implementation begins.
**Date:** 2026-08-06

## 1. What was delivered

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

All 20 architecture items from the brief are covered; every requirement-analysis sub-item from Step 1 is covered. No application code, Next.js project, Sanity schema files, or Supabase tables were created, per the Phase 1 rules.

## 2. Source material consumed

`design/homepage.html`, `design/landing-page-online-mba.html`, `design/programme-online-mba.html`, `design/specialization-marketing.html`, `design/university-nmims.html`, `design/compare-nmims-vs-symbiosis.html`, `design/resource-distance-mba-guide.html`, `design/distance-mba-college-sitemap-content.md`, `design/Distance-MBA-College-Brand-Guidelines-FINAL.docx`, `design/University.csv`, `design/sitemap.xlsx`, `design/logo-primary.png`, `design/favicon.png`.

## 3. Open questions for stakeholder sign-off before/during Phase 2

Carried forward from [REQUIREMENTS_ANALYSIS.md § 15](REQUIREMENTS_ANALYSIS.md#15-missing-information--open-items-for-stakeholder-sign-off):

| # | Question | Blocking? |
|---|---|---|
| 1 | Confirm `distance-mba-college-sitemap-content.md` is authoritative over `sitemap.xlsx` for nav IA (the xlsx's Compare/Resources columns are empty) | No — architecture already defaults to the markdown doc |
| 2 | Real per-university `Fees`/`Duration`/`Eligibility` content — `University.csv` has inconsistent fee formats and uniform placeholder duration/eligibility text across all 30 rows | **Yes, before content migration** — the `csvLegacy*` staging fields in [DATA_MODEL.md](DATA_MODEL.md) hold the raw data, but real content is needed before publish |
| 3 | Final authoritative university count/priority order (CSV: 30 rows; content strategy: ~25-30 named + priority tiers; xlsx: "25+") | **Yes, for build sequencing** — recommend the content strategy's tiered list as the backlog order unless the client corrects it |
| 4 | AI counsellor backend vendor/model selection | No — out of scope for this architecture phase by design (see [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md)); needed before that specific feature ships in Phase 2+ |
| 5 | Name/credentials of the existing CRM system leads currently flow into | **Yes, before Phase 2 forms work begins** — needed to configure `CRM_WEBHOOK_URL` and test the forwarding contract in [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md) |
| 6 | Logo variant files (reverse/mono/stacked/icon/monogram) — only the primary PNG exists today | **Yes, before Phase 2 asset handoff** — needed for the responsive `Header`/`Footer` logo behaviour |
| 7 | Design review of Blog Post/Counsellor Profile/Success Story layouts — no HTML mockup exists for these three types, only textual description | Recommended before building those three templates, not blocking earlier work |
| 8 | Lead data retention policy (how long Supabase keeps `leads`/`ai_chat_sessions` after CRM handoff) | **Yes, before production launch** — a legal/business decision, not an engineering default |

## 4. Recommended build sequence (Phase 2, pending approval)

Mirrors the client's own stated priority order from the content strategy, adapted to this architecture's deliverables:

1. **Foundation** — Next.js app scaffold, Tailwind theme from brand tokens, Sanity Studio + core schema types, redirect engine, CRM webhook wiring (blocked on open item #5).
2. **Critical pages** — Homepage (page builder + default preset), Programmes overview + 4 mode hubs, Universities directory, About/How-It-Works/Contact/Brochure.
3. **Critical entity pages** — highest-priority university pages (NMIMS, Symbiosis, Amity, Manipal Jaipur, BITS WILP, ISB), 2-3 comparison pages, all 27 campaign LPs migrated under `/lp/` with redirects.
4. **AI chat widget shell + smart tools** (rules-based backend initially, per the seam in [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md)).
5. **Verification** — schema/structured-data validation across all shipped pages, Core Web Vitals audit, full redirect-map crawl test, cross-device QA, `llms.txt` live, lead pipeline end-to-end test.
6. **Remaining catalogue** — remaining university pages, all specialization pages, remaining comparison pages, resource/pillar guides, counsellor profiles, success stories, blog.

This sequencing is a **recommendation for Phase 2 planning**, not a commitment made in this document — actual sprint planning happens after this Phase 1 documentation set is approved.

## 5. Approval gate

**Implementation (Phase 2) does not begin until this documentation set is explicitly approved by the stakeholder.** No code, no `create-next-app`, no Sanity project, no Supabase project has been created as part of this phase, consistent with the Phase 1 rules stated in the brief.
