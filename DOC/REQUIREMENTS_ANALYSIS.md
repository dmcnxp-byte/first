# Requirements Analysis

**Phase 1, Step 1.** Full analysis of `/design` — business, functional, non-functional requirements, IA, journeys, reusable patterns, content types, design system, assets, responsive behaviour, and open assumptions.

---

## 1. Business requirements

| # | Requirement | Source |
|---|---|---|
| BR-1 | Grow qualified leads from ~100/day to 200/day (90 days) and 300/day (6 months) | content strategy §Quick read |
| BR-2 | Counsel only on **private universities, deemed universities, and private B-schools** — never open universities (IGNOU, KSOU, TNOU, etc.) or state-government distance programmes | content strategy §1.2 |
| BR-3 | Preserve all existing SEO equity — **zero URL deletions**; every retired page 301s to a better-fit page | content strategy §2.3, Appendix A |
| BR-4 | Support four distinct MBA "modes" (Distance, Online, Executive, Correspondence) as first-class, separately marketed products | content strategy §1.1 |
| BR-5 | Be discoverable and citable by AI answer/generative engines (ChatGPT, Perplexity, Gemini, Claude) in addition to Google | content strategy §5 |
| BR-6 | Deliver an AI counsellor assistant ("Aarya") that pre-qualifies leads before a human counsellor calls | content strategy §6.1 |
| BR-7 | Maintain existing CRM/webhook integrations — leads must keep flowing to the current downstream system without disruption | content strategy §6.4 |
| BR-8 | Apply the v2.0 brand system (navy/saffron identity, Poppins/Inter/Lora typography, calm-not-urgent voice) consistently across web, and leave headroom for print/email applications | Brand Guidelines |
| BR-9 | Honest, non-commission-driven advisory positioning must be visible in content (trade-offs stated, "who should look elsewhere" sections, no dark-pattern urgency) | Brand Guidelines §Voice, content strategy §9.5 |

## 2. Functional requirements

Grouped by capability area; each maps to an architecture document.

### 2.1 Content delivery
- FR-1 Render 7 core page **types** dynamically from CMS content: Homepage, Programme (Mode), University, Specialization, Compare, Resource/Pillar, Campaign Landing Page — plus Blog Post, Counsellor Profile, Success Story. See [DATA_MODEL.md](DATA_MODEL.md).
- FR-2 Homepage must be a **fully dynamic, page-builder-driven document** from day one — no hardcoded sections. See [PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md).
- FR-3 University, Programme, Specialization, and Compare documents must be reusable templates, not one-off pages — one Next.js route template renders any document of that type.
- FR-4 Support a many-to-many **University ↔ Programme Mode ↔ Specialization "Offering"** relationship (a university offers a mode+specialization combination at a specific fee/duration) — confirmed by overlapping fee/mode data appearing on both Programme and Specialization mockups. See [DATA_MODEL.md § Offering](DATA_MODEL.md#offering).
- FR-5 Support Comparison documents that reference exactly two "comparable" entities (university-vs-university or mode-vs-mode) and render a neutral side-by-side table plus editorial verdict content.
- FR-6 Support legacy flat URLs (e.g. `/nmims-distance-mba/`) resolving to the same University document as the new `/universities/nmims/` path, per the SEO-preservation constraint.

### 2.2 Lead capture / conversion
- FR-7 Every page type must offer at least 3 of 4 lead channels: form, click-to-call, WhatsApp deep-link, AI chat. See [FORMS_ARCHITECTURE.md](FORMS_ARCHITECTURE.md).
- FR-8 Lead form **field sets are content-driven per page type** (1 field on a resource page up to 6 on a BOFU apply page) — the form component must accept a configurable field schema, not a hardcoded shape.
- FR-9 Every submitted lead must be scored (cold/cool/warm/hot) using the point rubric in content strategy §7.5 and routed accordingly.
- FR-10 Leads must be persisted to Supabase and forwarded to the existing CRM webhook, tagged with source channel (`form` / `phone-click` / `whatsapp-click` / `ai-chat`).
- FR-11 A mobile sticky action bar (Call / WhatsApp / Chat or Get-Callback) must appear on every page ≤880px.

### 2.3 AI counsellor & personalization
- FR-12 A floating AI chat widget ("Aarya") must be present on every page, with page-aware opening context and a 3-5 question qualification flow, escalating to a human counsellor.
- FR-13 Three smart tools — Fee & EMI Calculator, Eligibility Checker, Programme Matcher — must be embeddable inline (e.g. mid-article) or as standalone resource pages.
- FR-14 Client-side personalization (UTM attribution, session page-view history, returning-visitor recognition) must adjust CTA/recommendation content **without server-side PII storage** — cookie + rules-engine only.

### 2.4 SEO / AEO / GEO
- FR-15 Every page emits at least 2 schema.org JSON-LD blocks per the page-type table in [SEO_STRATEGY.md](SEO_STRATEGY.md); FAQ content is single-sourced between the visible accordion and `FAQPage` schema (mockups showed drift here — must not recur).
- FR-16 `llms.txt` served at the site root, generated/maintained alongside content.
- FR-17 XML sitemap(s), `robots.txt`, canonical tags, and Open Graph metadata generated per page from Sanity SEO fields.
- FR-18 A redirect engine resolves the full legacy URL migration map (Appendix A of the content strategy doc) as 301s with zero manual per-request coding once configured.

### 2.5 CMS & editorial
- FR-19 Non-technical editors can create/edit any page type, reorder homepage/landing-page sections via a page builder, and manage the university/specialization/compare directories — all inside Sanity Studio, without a deploy.
- FR-20 Draft/preview mode: editors can preview unpublished content on the live Next.js front end before publishing.

## 3. Non-functional requirements

| # | Requirement | Target | Doc |
|---|---|---|---|
| NFR-1 | Largest Contentful Paint | < 2.5s | [PERFORMANCE_STRATEGY.md](PERFORMANCE_STRATEGY.md) |
| NFR-2 | Interaction to Next Paint | < 200ms | same |
| NFR-3 | Cumulative Layout Shift | < 0.1 | same |
| NFR-4 | Mobile PageSpeed score | 85+ | same |
| NFR-5 | Initial JS bundle | < 200KB | same |
| NFR-6 | Accessibility | WCAG 2.1 AA minimum (mockups have real gaps — hover-only nav dropdowns, non-functional hamburger, no `aria-expanded` — must be fixed in rebuild, not carried forward) | [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) |
| NFR-7 | Mobile traffic share | Design mobile-first; 70%+ of traffic is mobile per content strategy §7.6 | [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) |
| NFR-8 | Data residency / privacy | No PII in client-side personalization; DPDPA-conscious lead handling in Supabase | [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md) |
| NFR-9 | Zero-downtime content publishing | Sanity webhook-driven ISR revalidation, no redeploy needed for content changes | [DEPLOYMENT_STRATEGY.md](DEPLOYMENT_STRATEGY.md) |
| NFR-10 | SEO continuity | No ranking/traffic drop during cutover; redirect map tested pre-launch | [ROUTING_STRATEGY.md](ROUTING_STRATEGY.md) |
| NFR-11 | Editorial safety | Non-technical staff cannot break page structure; page builder constrained to approved section types | [PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md) |
| NFR-12 | Internationalization readiness | Schema/site metadata already reference `en, hi, mr, ta, te, kn, bn, gu, pa` — architecture must not preclude future locales even though Phase 1 ships English only | [FUTURE_SCALABILITY.md](FUTURE_SCALABILITY.md) |

## 4. Website pages / page types (as designed today)

Seven page **templates**, each backed by a reusable Sanity document type, plus supporting singleton/collection types:

| Page type | Example URL | Funnel stage | Mockup evidence |
|---|---|---|---|
| Homepage | `/` | TOFU | `homepage.html` |
| Programme (Mode) hub | `/programmes/online-mba/` | TOFU | `programme-online-mba.html` |
| University profile | `/universities/nmims/` (+ legacy `/nmims-distance-mba/`) | MOFU | `university-nmims.html` |
| Specialization | `/specializations/marketing/` | MOFU | `specialization-marketing.html` |
| Compare | `/compare/nmims-vs-symbiosis/` | MOFU | `compare-nmims-vs-symbiosis.html` |
| Resource / Pillar guide | `/resources/distance-mba-guide-2026/` | TOFU | `resource-distance-mba-guide.html` |
| Campaign Landing Page | `/lp/{slug}/` | BOFU | `landing-page-online-mba.html` |
| Blog post | `/blog/{category}/{slug}/` | TOFU | described in content strategy, no mockup |
| Counsellor profile | `/counsellors/{slug}/` | Trust/EEAT support | described only |
| Success story | `/success-stories/{slug}/` | MOFU/BOFU trust | described only |
| Utility pages | `/about/`, `/contact/`, `/brochure/`, `/how-it-works/`, `/privacy-policy/`, `/terms-and-conditions/`, `/thank-you/` | mixed | described only |

Full sitemap detail — every planned URL, funnel tag, and the private-university target list — is preserved in [DATA_MODEL.md § Sitemap Reference](DATA_MODEL.md#sitemap-reference) rather than duplicated here.

## 5. User journeys

Three funnel stages gate every journey (content strategy §1.4):

- **TOFU (~50% of organic traffic)** — "I'm thinking about an MBA, where do I start?" Enters via pillar guides, mode explainers, blog, AEO/GEO FAQ pages. Primary CTA: download a comparison guide or open AI chat. Exits toward MOFU via "Explore universities."
- **MOFU (~35%)** — "I'm comparing 3-5 universities/specializations/modes." Enters via university pages, specialization pages, compare pages (**the single highest-converting page type**). Primary CTA: request a counsellor callback.
- **BOFU (~15%)** — "I've decided, help me apply." Enters via apply pages, eligibility checker results, campaign LPs. Primary CTA: "Speak to a counsellor now," phone-first, WhatsApp deep-link with pre-filled programme context.

Representative end-to-end journey (Persona A, Rahul):
`Google search "distance MBA from private university"` → **Programme Mode hub** (`/programmes/distance-mba/`) → clicks a featured university card → **University profile** (`/universities/nmims/`) → opens **Compare** (`/compare/nmims-vs-symbiosis/`) from a "Compare with" teaser → engages **AI chat** for a quick fee question → submits the **university-page lead form** (4 fields) → lead scored "warm" (30-49) → counsellor call within 4 hours.

Persona D (Vikram, Executive) journey differs structurally: enters via an Executive-MBA-targeted paid ad → **Campaign LP** (1-2 field form, phone-first) → if not converting immediately, retargeted → returns via `/programmes/executive-mba/iim-alternatives/` (captures IIM search intent honestly without misrepresenting the business) → converts on a Compare page (ISB vs XLRI).

## 6. Navigation structure

**Desktop primary nav** (confirmed identical across all non-landing-page mockups):
`[Logo] Programmes ▾ | Universities ▾ | Compare | Resources ······ [☎ phone] [Talk to a counsellor btn] [☰]`
- Programmes ▾ reveals the 4 modes.
- Universities ▾ reveals top 5 + "View all 25+."
- Header is `position: sticky` on all standard pages.
- Campaign landing pages use a **minimal header variant**: logo + phone only, not sticky, no dropdowns, no CTA button — deliberately reduces distraction from the single conversion goal. See [LAYOUT_ARCHITECTURE.md](LAYOUT_ARCHITECTURE.md).

**Footer** (full variant): 4 columns — Brand (logo, tagline, CIN/GST/registered office), Programmes, Universities, Company (About/How It Works/Counsellors/Success Stories/Contact) — plus a base bar (copyright, Privacy, Terms). Landing pages use a **minimal footer**: one centered legal line.

**Mobile:** nav links collapse behind a hamburger (non-functional in the mockups — flagged as a real gap to fix, not a pattern to copy) below 880px; a fixed **mobile action bar** (Call / WhatsApp / third slot) replaces the header CTA, with the third slot being content-driven — Chat on most pages, "Get callback" on landing pages.

## 7. Reusable layouts & UI patterns

Confirmed as genuinely shared (byte-identical or near-identical markup/CSS across every mockup) — these become the atomic/section-level component library in [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md):

| Pattern | Purpose | Notes for rebuild |
|---|---|---|
| `Header` | Site nav | Two variants: `full`, `minimal` (LP). Dropdowns are hover-only CSS in the mockup — must become click/focus-accessible disclosure widgets. |
| `Footer` | Site-wide footer | Two variants: `full`, `minimal`. |
| `Hero` | Page-opening block | Eyebrow + H1 (with Lora-italic accent span) + subhead + 1-2 CTAs; University/Programme pages add an embedded lead form beside it (2-col). |
| `TrustStrip` | Accreditation credibility band | Label + badge row (UGC-DEB/AICTE/NAAC/AIU); appears directly under most heroes. |
| `SectionHead` | Section intro | Eyebrow + H2 (optional italic accent) + optional intro paragraph; optional right-aligned "view all" action. |
| `Card` (base) → `UniCard`, `ModeCard`, `SpecCard` | Grid tile | Title, meta key/value row(s), "best for" line, optional badge, optional link — grid collapses 4→2→1 col at 880px/500px. |
| `CompareTable` | Neutral N-column data grid | CSS-grid table; each cell carries `data-label` for a **table-to-card mobile collapse** at ≤660px. Reused for mode-comparison, fee tables, university-listing tables, and the head-to-head Compare page — this is the single most reused data component in the system. |
| `WhoFitsCards` | Fit-guidance pair | "This suits you if" (green) / "Look elsewhere if" (red/saffron) two-card grid, cross-referencing competing options by name. |
| `FactsStrip` | Quick-facts bar | N label/value cells (5→2→1 col). |
| `CounsellorNote` / `CounsellorBlock` | EEAT trust device | Inline pull-quote variant (`.counsel-note`) vs. large navy testimonial-style block (`.counsel`) — same underlying data (quote, name, title, years, location), two presentational components. |
| `FAQAccordion` | FAQ + AEO/schema source | Must be single-sourced so the rendered accordion and `FAQPage` JSON-LD never drift (mockups had a 6-vs-8 item mismatch). |
| `LeadFormCard` | Conversion form | Configurable field list per page type; title/subtitle/footer-disclaimer are content fields, not hardcoded copy. |
| `MobileActionBar` | Fixed bottom conversion bar | 3 data-driven slots `{icon, label, href|action, isPrimary}`. |
| `ChatWidget` | AI counsellor UI | Launcher + slide-up panel; page-aware opening message; **the current keyword-matching logic is an explicit placeholder** to be replaced by a real backend, not ported. |
| `StepsList` | Numbered process | Shared between "eligibility criteria," "how to apply," and future "admission process" content — generic ordered list of {number, heading, body}. |
| `CalloutBox` | Editorial emphasis / AEO snippet | Two variants (amber, navy); one variant is explicitly an "AEO one-line definition" block — should be its own schema type distinct from generic callouts. |
| `TOC` (table of contents) | Long-form navigation | Sticky sidebar with scrollspy on Resource/Pillar pages; **must gain a mobile fallback** (mockup hides it completely ≤960px with no replacement — a real gap). |
| `EMICalcWidget` | Interactive fee tool | Self-contained client component: 2 selects → live-computed EMI result. |

## 8. Components inventory

See [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) for the full atomic breakdown (primitives → composed → sections → templates). Cross-cutting note: **University-offering data (fee, duration, mode, "best for"/depth) is rendered by at least two different presentational components** (`UniCard` grid vs. `CompareTable` dense listing) from what must be **one normalized data shape** — confirmed by the Programme-page vs Specialization-page mockups showing the same NMIMS/Symbiosis/Amity fee data in a card grid on one page and a table on the other.

## 9. Sections catalogue (by page type)

| Page type | Sections, top to bottom |
|---|---|
| Homepage | Hero → TrustStrip → 4-Mode strip → Featured Universities (8 cards) → Specializations grid (14 cards) → Brand-promise pull-quote band → Counsellor moment → AI-chat invitation → Lead form → FAQ → Footer |
| Programme (Mode) | Hero → TrustStrip → "What is a {Mode} MBA?" + mode-comparison table → Who-it's-for/Look-elsewhere → Top Universities (card grid) → Counsellor quote → Lead form → FAQ → Footer |
| University | Hero+embedded lead form → Quick-facts strip → Who-fits/Who-doesn't → About (rich text) → Specializations list → Fee structure table → Eligibility list → Application timeline → Accreditation deep-dive → Counsellor note → "Compare with" teasers (3 cards) → FAQ → Footer |
| Specialization | Hero → What-you'll-learn (curriculum topics) → Who-it-suits → Career paths/salary table + recruiter categories → Universities-offering table → How-to-choose (numbered steps) → Lead form → Footer *(no FAQ in this mockup — optional per type)* |
| Compare | Hero + one-line verdict callout → Side-by-side table (11 attribute rows) → Where-each-wins (2 cards) → Choose-A-if/Choose-B-if (2 cards) → Honest-trade-off narrative + counsellor note → Lead form → "Compare others" teasers → FAQ → Footer |
| Resource/Pillar | Hero (breadcrumb, author byline, updated date, read time) → Key-facts strip → **2-col layout: sticky TOC sidebar + long-form article body** (11 H2 sections, embedded lead-strip CTA mid-article, callouts, data tables, EMI calc widget, uni-card grid, steps lists) → FAQ (8 items) → full lead-capture section → Footer |
| Campaign LP | Minimal header → Hero **with embedded above-fold form** (2-col) → Featured Universities (non-linking cards) → Counsellor moment + CTA → FAQ (objection-focused, 4 items) → Minimal footer |

Every page type additionally carries the global `MobileActionBar` and `ChatWidget`.

## 10. Forms catalogue

| Page type | Fields | CTA copy |
|---|---|---|
| Homepage | Name, Phone, Course of interest (select), City | "Request a callback →" |
| Campaign LP | Name, Phone, Preferred specialisation (select) | "Get my free counselling →" |
| Programme (Mode) | Name, Phone, Specialisation (select) | "Request a callback →" |
| University | Name, Phone, Specialisation interest (select) | "Request a callback →" |
| Specialization | Name, Phone, Target role (select, specialization-specific options) | "Request a callback →" |
| Compare | Name, Phone, "Leaning toward A / B / Unsure" (select) | "Request a callback →" |
| Resource/Pillar (inline mid-article) | Phone only | "Get a call →" |
| Resource/Pillar (full section) | Name, Phone, Course of interest (select), City | "Request a callback →" |

This confirms FR-8: field count and field *meaning* both vary by page type and even by specialization (the "select" options are content, not fixed enum labels) — the form component contract is **schema-driven field list in, validated submission out**, detailed in [FORMS_ARCHITECTURE.md](FORMS_ARCHITECTURE.md).

## 11. Content types (summary — full field-level schema in DATA_MODEL.md)

University, Programme (Mode), Specialization, Compare, Offering (join type), Blog Post, Resource/Pillar Page, Campaign Landing Page, Counsellor Profile, Success Story, Homepage (singleton, page-builder-driven), Site Settings (singleton), Navigation (singleton), Redirect (collection), FAQ (shared object, reused inline across types).

## 12. Design system

Full brand source: `Distance-MBA-College-Brand-Guidelines-FINAL.docx` v2.0. Summary for engineering handoff:

**Colour tokens**

| Token | Hex | Use |
|---|---|---|
| `navy` | `#0B1F4D` | Logo, headlines, nav, trust surfaces — dominant identity colour |
| `saffron` | `#E8930E` | CTAs, accents, highlights — reserved for "what we want clicked"; never two saffron CTAs in one view |
| `counsel-blue` | `#1E3A8A` | Italic emphasis, secondary headings, link hover |
| `soft-gold` | `#FBBF24` | Light highlights, badges |
| `cream` | `#FAF7F0` | Page background |
| `ink` | `#1F2937` | Primary body text |
| `slate` | `#475569` | Secondary text, captions |
| `mist` | `#F1F5F9` | Section backgrounds, cards |
| `verify-green` | `#10B981` | Verified/success states |

Colour ratio target: 60% whites/cream/mist, 30% navy/counsel-blue, 10% saffron/gold.

**Type tokens**

| Role | Family | Weights | Note |
|---|---|---|---|
| Display/headings | Poppins | 500, 600, 700 | Also the logo wordmark face |
| Body | Inter | 400, 500, 600 | Screen-legible at small sizes |
| Voice/emphasis | Lora | 400 italic, 500 italic | The brand's typographic signature — 2-4 italic words inside an otherwise-Poppins headline |

Both fonts are Google Fonts, free for commercial use — confirmed loadable via `next/font/google`.

**Layout tokens:** max content width 1200px, 24px gutter, 12-column grid; section padding ≥80px desktop / 48px mobile; card radius 16px with 1px hairline border + soft shadow; button radius 8px, 14-16px vertical / 26-30px horizontal padding — never sharp rectangles or pills.

**Logo variants:** primary lockup, reverse (navy/dark surfaces), monochrome (single-colour print), stacked (narrow spaces), icon-only (favicon/watermark), monogram "DMC" (sub-60px contexts). Minimum digital width 180px for the primary lockup; below that, switch to icon or monogram — a concrete responsive-logo requirement for the `Header`/`Footer` components.

**Voice do/don't (content governance):** say "programme," "working professionals," "UGC-DEB recognised" — avoid "cutting-edge curriculum," "aspirants/candidates," "best/top-rated/premier" without proof. Every counsellor quote must be attributed to a real named counsellor.

## 13. Assets inventory

| Asset | File | Notes |
|---|---|---|
| Logo (primary) | `logo-primary.png` | Full lockup — architecture should also plan for an SVG export per Sanity's image-asset pipeline and the variant set described in the brand doc (reverse/mono/stacked/icon/monogram) even though only PNG exists today |
| Favicon | `favicon.png` | Brand doc specifies the monogram, not the full logo, for favicon use — verify current asset matches before launch |
| Fonts | Google Fonts (Poppins, Inter, Lora) — no local font files bundled | Loaded via `<link>` in mockups; rebuild should self-host via `next/font` for performance (no FOIT, no third-party request) |
| Brand guidelines | `Distance-MBA-College-Brand-Guidelines-FINAL.docx` | Source of truth for all visual/voice rules above |
| University data | `University.csv` | 30 rows — **not the sitemap's authoritative university list** (that list, ~25-30 institutions with priority tiers, lives in the content-strategy doc); CSV has messy/uneven data (`Acceditaion` header typo, mixed fee formats, uniform placeholder `Duration`/`Eligibility` values) and needs a cleanup pass before CMS seeding — see [DATA_MODEL.md § University field notes](DATA_MODEL.md#university) |
| Nav sketch | `sitemap.xlsx` | A partial 5-column nav-tree sketch (Programmes/Universities/Compare/Resources/Other Pages), **not a URL inventory** — Compare and Resources columns are empty; the content-strategy markdown is the authoritative IA source, this file is superseded by it |

No CSS/JS/font/image asset *files* exist as separate deliverables in `/design` — every mockup is a self-contained HTML export with one inline `<style>` block; there is no separate design-tokens file to import. The token values must be transcribed from the mockups' `:root` custom properties (confirmed byte-identical across all 7 HTML files) into the Tailwind config — see [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md).

## 14. Responsive behaviour

Confirmed breakpoints (identical CSS across all mockups): **960px** (pillar-page sidebar disappears), **880px** (primary tablet break — nav collapses, all major grids go to 1 column, mobile action bar appears), **660px** (compare-table → stacked card view via `data-label`, phone number hides from header), **600px**, **500px** (final grid collapse to single column). A `@media print` rule hides nav/footer/mobile-actions/chat widget.

Two responsive **gaps** found in the mockups that the rebuild must not repeat:
1. **Non-functional hamburger** — nav links vanish below 880px with no working drawer/menu behind the hamburger icon.
2. **TOC sidebar has no mobile fallback** — it's simply `display:none` below 960px on the Resource/Pillar template, losing in-page navigation entirely on mobile.

## 15. Missing information / open items for stakeholder sign-off

| # | Item | Why it matters | Recommended default (see PROJECT_STATUS.md for tracking) |
|---|---|---|---|
| MI-1 | `sitemap.xlsx`'s Compare and Resources/Blogs nav columns are empty | Nav IA for those two sections isn't confirmed by the client artifact, even though the content-strategy doc describes them in full | Treat the content-strategy markdown as authoritative; flag the xlsx as superseded |
| MI-2 | `University.csv`'s `Fees` column mixes plain integers, comma-grouped strings, `/-` suffixes, and one range value; `Duration` and `Eligibility` are 100% uniform placeholder text across all 30 rows | Cannot be imported into a typed Sanity field as-is | Model `fee` as a display string + optional numeric `feeMin`/`feeMax` for filtering/sorting; treat `Duration`/`Eligibility` as needing real per-university content before launch |
| MI-3 | `University.csv`'s university count (30) vs. the content strategy's target list (~25-30 named institutions) vs. `sitemap.xlsx`'s "View all 25+" label don't perfectly reconcile | Directory completeness/priority order needs one authoritative source | Recommend the content-strategy doc's tiered list (Deemed / Private / B-School / Aggregator, each with a Critical/High/Medium/Low priority) as the build backlog order |
| MI-4 | No real backend exists yet for the AI counsellor — current mockups explicitly comment the chat logic as a placeholder | Determines whether Phase 2 scope includes LLM integration work or only the widget shell + escalation contract | Architecture in this phase defines the **integration seam only** (see AI_PERSONALIZATION_ARCHITECTURE.md); actual model/vendor selection is a Phase 2+ decision |
| MI-5 | CRM identity (which system leads currently flow into) is referenced ("existing CRM," "existing webhook endpoints") but never named in the source material | [FORMS_ARCHITECTURE.md](FORMS_ARCHITECTURE.md) defines a generic outbound-webhook contract; the concrete endpoint/credentials are a deployment-time configuration input, not an architecture decision | — |
| MI-6 | No visual asset exists for logo variants beyond the primary PNG (reverse/mono/stacked/icon/monogram all specified in the brand doc but not supplied as files) | Needed before the `Header`/`Footer` responsive-logo behaviour can be fully implemented | Flag for the client's design vendor before Phase 2 asset handoff |
| MI-7 | Blog Post, Counsellor Profile, and Success Story page types have no HTML mockup — only textual description | Layout/section-order for these three types is inferred from the content-strategy doc's prose, not verified against a visual | Treat as lower design-fidelity risk; validate with the client design team before building |

## 16. Assumptions

1. "Fully dynamic homepage from day one" means **page-builder-driven** (an ordered array of typed sections editors can add/remove/reorder in Sanity), not merely "populated from CMS fields in a fixed layout." This is the assumption load-bearing the whole [PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md).
2. The "AI-powered engagement" requirement is scoped, for this architecture, to defining integration seams (widget shell, conversation-logging contract, escalation-to-human contract, lead-scoring hook) — not to selecting or building an actual LLM backend, which is outside a documentation-only Phase 1.
3. Supabase's "forms only" scope means: lead submissions, lead-scoring state, AI chat transcripts tied to a lead, and redirect/analytics logging **if** needed — never CMS content, which stays exclusively in Sanity even for structured data like the University directory.
4. Legacy URLs are preserved as **redirects**, not as permanently dual-served routes — i.e., `/nmims-distance-mba/` 301s to the canonical `/universities/nmims/`, it does not remain an independent renderable route long-term. (Content strategy explicitly allows either "keep legacy URL live" or "redirect" case-by-case per its migration map — this project defaults to redirect-to-canonical everywhere unless a specific URL is called out otherwise, to keep exactly one canonical path per entity.)
5. Multi-language site metadata already present in the source schema (`hi, mr, ta, te, kn, bn, gu, pa`) is a **future-proofing signal**, not a Phase 1/2 delivery requirement — English-only ships first; see [FUTURE_SCALABILITY.md](FUTURE_SCALABILITY.md).
6. "Reusable University documents" and "reusable Course documents" in the brief map to this analysis's **University** and **Programme (Mode)** content types respectively — "Course" in the brief is not a third, separate type from Programme, since no mockup or content-strategy section describes a "Course" distinct from a Programme mode or a University's own programme listing.
