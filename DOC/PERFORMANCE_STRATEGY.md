# Performance Strategy

Targets are fixed by NFR-1..5 ([REQUIREMENTS_ANALYSIS.md § 3](REQUIREMENTS_ANALYSIS.md#3-non-functional-requirements)) and restated by the content strategy as direct SEO ranking inputs.

## 1. Targets

| Metric | Current (client estimate, old site) | Target |
|---|---|---|
| LCP | ~3.5s | < 2.5s |
| INP | ~300ms | < 200ms |
| CLS | ~0.15 | < 0.1 |
| Mobile PageSpeed score | ~55 | 85+ |
| Initial JS bundle | likely heavy (unbundled inline scripts in the mockups) | < 200KB |

## 2. Rendering strategy as the primary lever

SSG/ISR-first rendering (ADR-2, [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)) means most requests are served from the edge cache with no origin compute — this alone addresses the majority of the LCP/TTFB gap versus a client-rendered SPA. See [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md).

## 3. JavaScript budget

- Server Components by default; a component is a Client Component only when it needs browser interactivity (forms, chat, accordions, calculators, mobile nav) — see the layering rule in [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md).
- The AI chat widget and any analytics/tracking script load via `next/script` with a deferred strategy, never blocking initial render — a direct fix for the mockups' pattern of loading a monitoring/tracking script inline at the very top of `<head>`, before any content.
- Route-level code splitting is automatic under the App Router; large, rarely-used client components (e.g. `EMICalcWidget`, full `ChatWidget` panel body) are dynamically imported (`next/dynamic`) so they don't inflate the shared bundle for pages that don't render them.

## 4. Images

- All images through `next/image` + Sanity's image CDN, served as WebP/AVIF with a JPG fallback, explicit dimensions to prevent layout shift (CLS target), and lazy-loading for anything below the fold — directly replacing the mockups' plain `<img>`/CSS-background patterns (no image optimization pipeline existed in the design references).
- The homepage hero is deliberately image-free by brand design ("no stock photography... editorial typography is the hero" — brand guidelines §10), which incidentally also removes the single heaviest asset most competitor homepages carry above the fold.

## 5. Fonts

Poppins/Inter/Lora self-hosted via `next/font/google` with automatic subsetting and `font-display: swap` defaults, eliminating the external `fonts.googleapis.com` request-chain present in every mockup (`<link rel="preconnect">` + external stylesheet + external font files = 3 extra round trips per font family, times 3 families, on the old approach).

## 6. Caching & revalidation

- ISR with tag-based `revalidateTag` scoped to the exact document that changed (see [SANITY_CMS_ARCHITECTURE.md § 7](SANITY_CMS_ARCHITECTURE.md#7-webhook--revalidation-contract)) — avoids the alternative of either (a) full-site rebuilds on every content edit, or (b) uncached SSR on every request.
- Static assets (fonts, brand SVGs, favicons) served with long-lived immutable cache headers via Vercel's CDN.

## 7. Third-party scripts

Zero third-party tracking/session-recording scripts of the kind found injected in the mockups' `<head>` (an "InsightJs"/monitoring payload, unrelated to the design, flagged as exporter noise during discovery) — any analytics the client wants in production is a deliberate, reviewed addition in Phase 2, loaded deferred, not inherited from the mockups.

## 8. Performance budget enforcement

- CI runs Lighthouse (or equivalent) on every PR's preview deployment (see [DEPLOYMENT_STRATEGY.md](DEPLOYMENT_STRATEGY.md) and [GIT_WORKFLOW.md](GIT_WORKFLOW.md)) with a budget gate on LCP/CLS/bundle size, failing the check (not just warning) if a PR regresses below target — operationalizing NFR-1..5 rather than leaving them as aspirational numbers in a document.
