# Routing Strategy

Covers App Router route design, dynamic-slug resolution, the redirect engine that carries the SEO-preservation constraint (BR-3), and search-surface routes (sitemap/robots/llms.txt).

## 1. Route inventory

See the full tree in [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md). Summary of dynamic segments:

| Route | Param | Resolves via |
|---|---|---|
| `/` | — | `app/(site)/page.tsx` — the one `page` document flagged `isHomepage: true` |
| `/[slug]/` | `slug` | `app/(site)/[slug]/page.tsx` — the generic Page route, `generateStaticParams()` from all `page` documents except the Homepage; a static literal sibling folder (e.g. `universities/`) always wins over this dynamic segment, so entity directories below can coexist with it |
| `/programmes/[mode]/` | `mode` ∈ {distance-mba, online-mba, executive-mba, correspondence-mba} | `generateStaticParams()` from the 4 `programme` documents |
| `/universities/[slug]/` | `slug` | `generateStaticParams()` from all published `university` documents |
| `/specializations/[slug]/` | `slug` | same pattern, 14 documents |
| `/compare/[slug]/` | `slug` (alphabetical `a-vs-b`) | same pattern |
| `/resources/[slug]/` | `slug` | same pattern |
| `/blog/[category]/[slug]/` | both | same pattern, nested |
| `/counsellors/[slug]/`, `/success-stories/[slug]/` | `slug` | same pattern |
| `/lp/[slug]/` | `slug` | same pattern, `(landing)` route group |

All dynamic routes ship `dynamicParams = true` so a brand-new document published in Sanity is servable on-demand (SSR once, then cached) before the next full build, rather than 404ing until redeploy.

## 2. Redirect resolution (the SEO-preservation engine)

This is the architectural answer to BR-3/FR-18/NFR-10 — **no URL in the legacy migration map is ever deleted**; every one resolves to a 301.

```
Incoming request
   │
   ▼
Edge Middleware (middleware.ts)
   │  1. Look up request.pathname in an in-memory redirect map
   │     (map is hydrated from Sanity `redirect` documents, refreshed
   │      on every Sanity webhook that touches a `redirect` document,
   │      cached at the edge — not re-queried per request)
   │
   ├─ match found ──────────────► NextResponse.redirect(target, 301)
   │
   └─ no match ─────────────────► NextResponse.next() → normal App Router resolution
                                        │
                                        ├─ known static/dynamic route → render
                                        └─ no route matches → app/not-found.tsx (404)
```

- The redirect map is **not** re-fetched from Sanity on every request (that would add latency to every single page view) — it's built once per deployment/revalidation cycle and kept in an Edge Config store (or equivalent low-latency KV) that the middleware reads synchronously, updated by the same `/api/revalidate` webhook handler whenever a `redirect` document changes.
- Legacy flat URLs for private universities that predate the new `/universities/{slug}/` structure (e.g. `/nmims-distance-mba/`) are **not** dual-rendered as independent routes — per Assumption 4 in [REQUIREMENTS_ANALYSIS.md § 16](REQUIREMENTS_ANALYSIS.md#16-assumptions), they resolve as 301s to the canonical `/universities/nmims/`, keeping exactly one indexable URL per entity while the old URL still 200s-then-redirects for any inbound link/bookmark.
- The three redirect sub-categories from the content strategy (open/govt university pages → mode hub; IIM/government-sector pages → `iim-alternatives`; templated SEO-fluff posts → the matching real university page) are simply **rows of data** in the `redirect` collection — the engine itself has no special-cased logic per category, keeping the mechanism generic and the categorization purely editorial/data-driven.
- A fallback catch-all route handler (`app/(site)/[...legacy]/route.ts`) exists as a second line of defense: any path that somehow bypasses middleware (e.g. a stale edge cache) still gets checked against the same redirect source before falling through to a real 404 — belt-and-suspenders, not the primary mechanism.

## 3. Canonical vs. legacy slugs

Each `university` document stores exactly one canonical `slug` plus a `legacySlugs` array (see [DATA_MODEL.md § University](DATA_MODEL.md#university)). A migration script seeds one `redirect` document per legacy slug pointing at the canonical path — this keeps "which old URLs point at this entity" visible and editable from the University document itself in Studio (via a computed/reference view), even though the actual redirect execution reads from the `redirect` collection.

## 4. Search-surface routes

| Route | Behavior |
|---|---|
| `app/sitemap.ts` | Generates `sitemap.xml` from all published, non-`noindex` documents across every public type; Campaign Landing Pages are explicitly excluded (paid-traffic-only, per [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md)) |
| `app/robots.ts` | Disallows `/studio`, `/api/*`; allows everything else; points to the sitemap |
| `app/llms.txt/route.ts` | Generates the `llms.txt` structure specified in the content strategy (title, summary, Programme modes, Universities, About, Optional sections) from live Sanity data rather than a hand-maintained static file — see [SEO_STRATEGY.md](SEO_STRATEGY.md) |

## 5. Internal linking enforcement

The content-strategy's internal-linking-density requirement (every University page links to ≥3 Compare pages, ≥2 Specialization pages, and its Programme mode hub; pillar pages link to 15+ supporting pages) is implemented as **content model relationships**, not manual link-typing: University's `compareWith`/`specializationsOffered` references and the Offering-derived Programme link are structural, so the count is queryable and can be flagged by a Studio validation rule if a document falls under the minimum — turning an SEO guideline into an enforced editorial constraint.
