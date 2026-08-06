# Project Overview — Distance MBA College

**Document type:** Phase 1 — Discovery
**Status:** Draft for approval
**Prepared by:** Solution Architecture (AI-assisted discovery pass over `/design`)
**Source material:** `design/distance-mba-college-sitemap-content.md` (v2.0), `design/Distance-MBA-College-Brand-Guidelines-FINAL.docx` (v2.0), `design/University.csv`, `design/sitemap.xlsx`, and 7 HTML design-reference mockups.

---

## 1. What this business is

**Distance MBA College** (distancembacollege.com) is a **higher-education discovery and advisory platform** — a lead-generation business, not a university. It helps Indian working professionals choose a Distance, Online, Executive, or Correspondence MBA from an accredited **private** university, and pairs that research with human counsellor calls.

| | |
|---|---|
| **Brand** | Distance MBA College |
| **Parent company** | MagicWorks IT Solutions Private Limited (incorporated 29 Sept 2012) |
| **Founder & Director** | Mr. Swapnil Avdhutrao Ughade |
| **Category** | Higher Education Discovery & Advisory Platform |
| **Business model** | Lead generation for distance/online MBA programmes from accredited Indian private universities — counsellors, not the universities, are paid to advise; the platform's honesty is its differentiator |
| **Current scale** | ~100 qualified leads/day |
| **Target scale (this rebuild)** | 200 leads/day within 90 days, 300/day within 6 months |
| **Primary phone / WhatsApp** | +91 86696 61005 / `wa.me/918669661005` |

The site has run for two years. This project is **not a greenfield build** — it's a rebuild that must preserve two years of SEO equity (every existing URL gets a 301, none are deleted) while restructuring the information architecture around a business clarification the client only recently made explicit: **the directory only covers private institutions**, not IGNOU-style open universities or state government distance-education programmes.

## 2. Why now — the three-part strategic shift (v2.0)

1. **Four MBA modes, not one undifferentiated "distance MBA."** Distance, Online, Executive, and Correspondence MBA are treated as four distinct products with different audiences, fee bands, and search intent. Today's site doesn't structurally reflect that; the rebuild does, via a first-class **Programme (Mode)** content type.
2. **Directory rebuilt around private universities only.** Open/government university content is not deleted — it's reclassified as **REDIRECT** (301 to the nearest relevant private-university or mode page), preserving link equity while re-pointing the business at ~25-30 private institutions, deemed universities, and B-schools.
3. **Built for three discovery engines at once: SEO, AEO, GEO.** In 2026, MBA research starts on Google *and* on ChatGPT/Perplexity/Gemini/Claude. Schema.org markup, EEAT signals, and an `llms.txt` file are first-class build requirements, not an SEO afterthought — see [SEO_STRATEGY.md](SEO_STRATEGY.md).

A fourth, parallel requirement layered on top by the brand refresh: an **AI counsellor assistant ("Aarya")** and a client-side personalization layer are part of the architecture from day one — see [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md).

## 3. Who the site is for

Five personas drive every content and conversion decision (full detail in [REQUIREMENTS_ANALYSIS.md](REQUIREMENTS_ANALYSIS.md)):

| Persona | Share of leads | One-line profile | Best-fit mode |
|---|---|---|---|
| **A — Rahul**, the Stuck Mid-Career Professional | ~45% | 28-36, 4-10 yrs experience, watching peers with MBAs get promoted | Online or Distance MBA |
| **B — Priya**, the Career Switcher | ~20% | 25-32, technical background, wants Marketing/HR/PM/Analytics | Online MBA |
| **C — Sneha**, the Returning Learner | ~12% | 30-45, career-break or tier 2/3 city, worried about EMIs and eligibility | Distance or Online MBA (EMI) |
| **D — Vikram**, the Senior Executive | ~13% (new in v2.0) | 32-48, 8-20 yrs experience, targeting CXO roles | Executive MBA |
| **E — The Aspirant Family** | present in ~35% of conversations | Parents/spouse, silent veto power, reads the accreditation fine print | (influences, doesn't convert directly) |

## 4. Brand system snapshot

Full detail in [REQUIREMENTS_ANALYSIS.md § Design System](REQUIREMENTS_ANALYSIS.md#design-system). This drives the Tailwind theme and Sanity SEO/brand-voice conventions.

- **Archetype:** The Sage with a touch of The Caregiver — "a senior, well-read mentor explaining a serious decision over a cup of chai."
- **Tagline:** "Your Future. One Smart Step Away."
- **Primary colour:** Navy `#0B1F4D` · **Accent:** Saffron `#E8930E` · supporting Counsel Blue, Soft Gold, Cream, Ink, Slate, Mist, Verify Green.
- **Type:** Poppins (display/logo, 500/600/700), Inter (body, 400/500/600), Lora italic (the brand's "human-voice" signature — 2-4 words per headline, sparingly).
- **Voice rules:** plain over polished, specifics over slogans, calm over urgent, honest about trade-offs. Never two saffron CTAs in one view. Never a stock photo of cheering graduates.
- **Colour ratio:** 60% whites/cream/mist, 30% navy/counsel-blue, 10% saffron/gold (reserved for what should be clicked).

## 5. Target technology stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js (latest, App Router), React, TypeScript |
| Styling | Tailwind CSS, design tokens ported from the mockups' CSS custom properties |
| Content | Sanity CMS — single source of truth for **all** website content |
| Transactional data | Supabase — **forms/leads only**, never marketing content |
| Hosting | Vercel |
| AI assistant backend | Out of scope for this phase's architecture beyond the integration seam — see [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md) |

This is a deliberate split: **Sanity owns everything a marketer or content editor should be able to change** (pages, universities, copy, FAQs, SEO fields); **Supabase owns everything a lead generates** (form submissions, AI chat transcripts, lead scoring state) and nothing else. See [SANITY_CMS_ARCHITECTURE.md](SANITY_CMS_ARCHITECTURE.md) and [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md).

## 6. What "done" looks like for Phase 1

This phase produces **documentation only** — no code, no `create-next-app`, no Sanity schema files, no Supabase tables. Deliverables live in `/DOC` and are listed in [PROJECT_STATUS.md](PROJECT_STATUS.md). Implementation begins only after the client/stakeholder explicitly approves this documentation set.

## 7. Document map

| Concern | Document |
|---|---|
| Requirements (Step 1 of this phase) | [REQUIREMENTS_ANALYSIS.md](REQUIREMENTS_ANALYSIS.md) |
| System-level architecture | [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) |
| Next.js rendering/data strategy | [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) |
| Repo layout | [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) |
| React component system | [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) |
| Layouts, headers/footers, templates | [LAYOUT_ARCHITECTURE.md](LAYOUT_ARCHITECTURE.md) |
| Dynamic page builder | [PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md) |
| Sanity Studio & schema design | [SANITY_CMS_ARCHITECTURE.md](SANITY_CMS_ARCHITECTURE.md) |
| Content model & relationships | [DATA_MODEL.md](DATA_MODEL.md) |
| URL/routing strategy & redirects | [ROUTING_STRATEGY.md](ROUTING_STRATEGY.md) |
| Client/server state strategy | [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) |
| Supabase schema & RLS | [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md) |
| Lead forms & conversion engine | [FORMS_ARCHITECTURE.md](FORMS_ARCHITECTURE.md) |
| AI counsellor + personalization | [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md) |
| SEO/AEO/GEO strategy | [SEO_STRATEGY.md](SEO_STRATEGY.md) |
| Performance strategy | [PERFORMANCE_STRATEGY.md](PERFORMANCE_STRATEGY.md) |
| Git workflow | [GIT_WORKFLOW.md](GIT_WORKFLOW.md) |
| Deployment strategy | [DEPLOYMENT_STRATEGY.md](DEPLOYMENT_STRATEGY.md) |
| Coding & development standards | [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) |
| Future scalability | [FUTURE_SCALABILITY.md](FUTURE_SCALABILITY.md) |
| Phase status & open questions | [PROJECT_STATUS.md](PROJECT_STATUS.md) |
