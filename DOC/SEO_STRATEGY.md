# SEO / AEO / GEO Strategy

Implements content-strategy Part 5 in full — the client's stated position is that this is "the single biggest content architecture shift in 2026," so schema/AEO/GEO are build requirements, not a post-launch add-on (BR-5).

## 1. Three engines, one implementation surface

| Engine | Share of discovery (client estimate) | What it needs |
|---|---|---|
| **SEO** (traditional) | ~65% | Keyword-relevant titles/metas, fast pages, backlinks, internal linking, content depth |
| **AEO** (Answer Engines) | ~25%, growing | FAQ-formatted structured answers, direct-answer paragraphs, `FAQPage`/Q&A schema, EEAT |
| **GEO** (Generative Engines / AI Overviews) | ~10% | Citable original facts/statistics, named experts, brand mentions on authoritative third-party sites, `llms.txt` |

All three are served by the **same content model** — there is no separate "AEO content" vs. "SEO content." The FAQ block, the schema generator, and the EEAT fields (author/counsellor attribution, sourced accreditation links) documented elsewhere are the shared surface.

## 2. Schema.org / JSON-LD

Every page emits site-wide schema (`Organization`, `WebSite` with `SearchAction`, `BreadcrumbList`) plus page-type-specific schema, generated programmatically from Sanity content — never hand-authored per page (FR-15):

| Page type | Schemas |
|---|---|
| Homepage | Organization, WebSite, ItemList (featured universities), FAQPage |
| University | EducationalOrganization, Course (one per programme offered), FAQPage, AggregateRating (only if/when reviews exist) |
| Programme mode | Course, FAQPage, HowTo (application process) |
| Specialization | Course, FAQPage, ItemList (universities offering it) |
| Compare | FAQPage, structured comparison data |
| Resource/Pillar | Article, FAQPage, HowTo (where applicable) |
| Counsellor | Person (`jobTitle`, `worksFor`, `knowsAbout`) |
| Success story | Person (learner), Review, EducationalOccupationalCredential |
| Blog post | Article, BreadcrumbList, Author |
| Campaign LP | Organization, Course, FAQPage |

Implementation: `lib/seo/schema/*.ts` — one pure builder function per schema type, taking the already-fetched document data and returning a JSON-LD object; rendered via the shared `<JsonLd>` server component (see [FRONTEND_ARCHITECTURE.md § 3](FRONTEND_ARCHITECTURE.md#3-metadata--seo-wiring)). `FAQAccordion`'s rendered items and `FAQPage` schema are generated from the **same** `faqs` array on the document — closing the drift the mockups exhibited (6 schema items vs. 8 rendered).

## 3. FAQ structure requirements (content strategy §5.3)

- 5-10 questions per applicable page type (enforced at the Studio validation layer, [SANITY_CMS_ARCHITECTURE.md § 8](SANITY_CMS_ARCHITECTURE.md#8-content-governance-hooks)).
- Questions phrased as real users ask them ("Is NMIMS Online MBA worth it in 2026?" not "How is NMIMS?") — an editorial guideline documented here and in the CMS field description, not a code-enforced rule.
- Answers 40-80 words, each containing a specific fact/data point, ordered most-asked to least.

## 4. EEAT implementation

| Signal | Mechanism |
|---|---|
| Experience | Every counsellor quote references a real `counsellor` document (name, photo, years, bio) — schema-enforced, not a free-text field (see [DATA_MODEL.md § Counsellor](DATA_MODEL.md#counsellor)) |
| Expertise | Blog posts require an `author` reference to a `counsellor` document — "DMC Team" as an author is structurally impossible |
| Authoritativeness | About page + footer surface `siteSettings.cin`/`gst`/`registeredOfficeAddress`; every `accreditationDetail` row on a University document carries a `sourceUrl` |
| Trustworthiness | HTTPS (Vercel default), visible Privacy/Terms links in every footer variant, real phone number, transparent fee tables (no hidden fees pattern) |

## 5. llms.txt

Served from `app/llms.txt/route.ts` (see [ROUTING_STRATEGY.md § 4](ROUTING_STRATEGY.md#4-search-surface-routes)), generated at request/revalidation time from live content rather than hand-maintained, per the template structure specified in the content strategy (title, summary blockquote, Programme modes section, Universities section, About section, Optional section linking Blog/Success Stories). Regenerating this from source data means it can never silently drift out of date the way a static file would as new universities/programmes are added.

## 6. Metadata & sitemap

- `generateMetadata()` per route reads the document's `seo` object (title/description/OG image/canonical/noindex) — see [FRONTEND_ARCHITECTURE.md § 3](FRONTEND_ARCHITECTURE.md#3-metadata--seo-wiring).
- `app/sitemap.ts` includes every published, non-`noindex`, non-landing-page document; Campaign LPs are excluded (BR paid-traffic-only surface, not meant for organic indexing).
- No year is embedded in evergreen URLs (per content strategy §3.2) — freshness is signaled via `dateModified` in schema and a visible "Last updated" field sourced from one field (fixing the mockups' 3-places-same-date drift, see [DATA_MODEL.md § Blog Post](DATA_MODEL.md#blog-post)).

## 7. Entity SEO & topical authority

- **Consistent entity naming** ("NMIMS," never "Narsee Monjee" elsewhere) — enforced by always rendering the university's canonical `name` field, never a free-typed alternative, in generated schema and headings.
- **Internal linking density** — implemented as content-model relationships and Studio validation minimums, per [ROUTING_STRATEGY.md § 5](ROUTING_STRATEGY.md#5-internal-linking-enforcement).
- **Topic clusters** — each Programme mode is a cluster root; its pillar `resourcePage` and every University/Specialization/Compare document referencing that mode form the supporting network, queryable via the `offering`/`compare` relationships in [DATA_MODEL.md](DATA_MODEL.md).
- **Citable data assets** (annual counsellor survey, fee benchmark report, outcomes report) are modeled as `resourcePage` documents with a distinct `isOriginalResearch` flag, so they can be surfaced distinctly in navigation/llms.txt as GEO-bait — a content/PR execution task for Phase 3, flagged here as a content-model hook, not built out further in this phase.

## 8. Redirect-driven SEO preservation

Covered fully in [ROUTING_STRATEGY.md § 2](ROUTING_STRATEGY.md#2-redirect-resolution-the-seo-preservation-engine) — restated here only to note the SEO team's pre-launch acceptance test: every one of the ~72 legacy URLs in the content strategy's Appendix A must return a 301 to a resolving destination before cutover, verified via an automated crawl in the Sprint 1 "Day 7 verification" step (see [PROJECT_STATUS.md](PROJECT_STATUS.md)).

## 9. Core Web Vitals — targets only

Concrete performance mechanics live in [PERFORMANCE_STRATEGY.md](PERFORMANCE_STRATEGY.md); targets restated here because they are explicitly an SEO ranking input per the content strategy: LCP < 2.5s, INP < 200ms, CLS < 0.1, mobile PageSpeed 85+.
