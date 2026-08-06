# Frontend Architecture

Covers Next.js App Router usage, rendering strategy per page type, data fetching, caching, and asset optimization. For component composition see [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md); for layouts see [LAYOUT_ARCHITECTURE.md](LAYOUT_ARCHITECTURE.md); for routes see [ROUTING_STRATEGY.md](ROUTING_STRATEGY.md).

## 1. Rendering strategy per page type

| Page type | Strategy | Revalidation trigger |
|---|---|---|
| Homepage | SSG + ISR | Sanity webhook on homepage document publish |
| University / Programme / Specialization / Compare | SSG + ISR (generated for known slugs at build, `generateStaticParams`; on-demand for new slugs via fallback) | Webhook, tag-scoped to the document `_id` |
| Blog / Resource / Pillar | SSG + ISR | Webhook |
| Campaign Landing Page | SSG + ISR, but excluded from `sitemap.xml` (paid-traffic only) | Webhook |
| Counsellor / Success Story | SSG + ISR | Webhook |
| Thank-you page | Static, no CMS dependency | — |
| API routes (`/api/leads`, `/api/chat`, `/api/revalidate`) | Always dynamic (Route Handlers) | N/A |
| Sanity Studio (`/studio`) | Client-rendered SPA, excluded from static export and from search indexing | N/A |

Default: **Server Components everywhere**; a component only becomes a Client Component when it needs interactivity (`LeadForm`, `ChatWidget`, `FAQAccordion`, `EMICalcWidget`, mobile nav drawer, personalization-aware CTA). This is the direct fix for the mockups' "everything is one big static HTML file" pattern — in the rebuild, interactivity is isolated to leaf components so the rest of each page ships zero client JS.

## 2. Data fetching

- All Sanity reads happen in Server Components via a single typed client wrapper (`lib/sanity/client.ts`), using the **CDN API** for published content and the **preview API** (with a draft-mode token) only when Next.js Draft Mode is active.
- Every query is a named, typed GROQ query co-located with the content type in `lib/sanity/queries/`, returning types generated from the Sanity schema (via `sanity typegen` or an equivalent codegen step) — no ad-hoc inline GROQ strings in page components.
- Queries are tagged for cache invalidation: `fetch(url, { next: { tags: [`sanity:${_type}:${_id}`] } })` equivalent via the Sanity client's cache options, so a webhook can call `revalidateTag('sanity:university:<id>')` and invalidate exactly the pages that used that document — not the whole site.
- Cross-document lookups needed for a single page (e.g., a University page's "Compare with" teasers, or a Specialization's Offering-derived university table) are resolved **inside one GROQ query** using dereferencing (`->`), not N+1 client-side fetches.

## 3. Metadata & SEO wiring

- Every route exports `generateMetadata()` reading the document's `seo` object (title, description, OG image, canonical, noindex flag) — see [SEO_STRATEGY.md](SEO_STRATEGY.md).
- JSON-LD is rendered via a shared `<JsonLd schema={...} />` server component fed by a per-page-type schema builder function (`lib/seo/schema/*.ts`), never hand-authored per page.

## 4. Images & fonts

- All images go through `next/image` backed by Sanity's image CDN (`@sanity/image-url`), with responsive `sizes` per component and explicit `width`/`height` (or `fill` with an aspect-ratio wrapper) to guarantee CLS < 0.1 (NFR-3).
- Poppins, Inter, and Lora are self-hosted via `next/font/google` (subset to `latin` + Devanagari-ready if/when Hindi ships, per [FUTURE_SCALABILITY.md](FUTURE_SCALABILITY.md)) — no external Google Fonts `<link>` request, unlike the mockups.
- Logo/icon variants (primary, reverse, mono, stacked, icon-only, monogram) are static SVG assets in `public/brand/`, selected by a `<Logo variant="..." />` component per [REQUIREMENTS_ANALYSIS.md § 12](REQUIREMENTS_ANALYSIS.md#12-design-system).

## 5. Styling

- Tailwind CSS v4-style config (or v3 `tailwind.config.ts`, pinned to whatever is current "latest" at build time) with the brand tokens transcribed from the mockups' `:root` custom properties as theme extensions (colors, spacing, radii, shadows, font families) — see the token tables in [REQUIREMENTS_ANALYSIS.md § 12](REQUIREMENTS_ANALYSIS.md#12-design-system).
- No component ships hand-rolled CSS-in-JS; utility classes plus a small set of `class-variance-authority` (or equivalent) variant maps per primitive (`Button`, `Badge`, `Card`) replace the mockups' bespoke class names (`.btn-primary`, `.uni-card`, etc.) one-to-one in spirit, not verbatim.

## 6. Third-party scripts

- The AI chat widget's eventual backend call and any analytics tag are loaded via `next/script` with `strategy="lazyOnload"` or `worker` where supported, kept out of the initial bundle to protect the < 200KB JS budget (NFR-5). No third-party script may block LCP.

## 7. Personalization at the edge

- Edge Middleware reads/writes a lightweight, non-PII cookie (`dmc_ctx`) capturing UTM source and last-viewed entity slug, per FR-14. Server Components read this cookie to bias CTA copy/recommendations without any client-side flash of unpersonalized content. Full design in [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md) and [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md).
