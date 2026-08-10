# Project Status

**Current phase:** 3.3 — Reusable Section Library Finalization. Complete, verified, awaiting approval before University Detail page implementation.
**Date:** 2026-08-08

---

## Phase 3.3 — Reusable Section Library Finalization

**Status:** Complete. `npm run lint`, `npm run typecheck`, and `npm run build` all pass clean; the live Homepage smoke test (`/`, `/studio`, `/robots.txt`, `/sitemap.xml`) still passes with zero regressions; a headless-browser check shows 0 console errors on both `/` and `/studio`; the 5 new block titles were confirmed present in the compiled Studio bundle. Awaiting approval before implementing University Detail pages.

### 1. What this phase did

Before building University Detail, Programme Detail, Compare, or Resource pages, this phase audited every remaining design mockup in `design/` (`university-nmims.html`, `programme-online-mba.html`, `specialization-marketing.html`, `compare-nmims-vs-symbiosis.html`, `landing-page-online-mba.html`, `resource-distance-mba-guide.html` — the 6 not yet analyzed; `homepage.html` was already fully covered in Phase 3.2) to find every reusable content pattern across the whole site, then finalized the Page Builder's Section Library so future page work reuses what exists rather than inventing a schema per page. Two research passes read all 6 files section-by-section with real markup quoted, cross-checked against the already-approved `DOC/REQUIREMENTS_ANALYSIS.md §7/§9` and `DOC/DATA_MODEL.md`.

### 2. Final Section Library: 24 blocks (was 19)

**5 new blocks**, each with real design evidence and no existing block covering it:

| Block | Studio title | Evidence |
|---|---|---|
| `compareTableBlock` | Comparison Table | The `.compare-table` pattern appeared with 4 different column sets across 3 mockups (mode comparison, university-listing, career/salary, university/marketing-depth) — `REQUIREMENTS_ANALYSIS.md §7` already called this "the single most reused data component in the system," and `COMPONENT_ARCHITECTURE.md §3` already specified a `CompareTable` contract that had never been built. This phase builds it: a real `<table>` with `scope` attributes and a CSS-only stacked-card collapse below the `tc` (660px) breakpoint — an accessibility improvement over the mockups' div-grid, consistent with this project's established pattern |
| `stepsBlock` | Timeline / Steps | The `.steps-list`/`.step-item` numbered-process pattern in specialization-marketing.html ("How to choose") and twice in resource-distance-mba-guide.html (eligibility, how-to-apply) — matches the already-documented-but-unbuilt `StepsList` composed pattern. Realizes the requested "Timeline" as a numbered process, not a literal dated calendar (dated application windows stay the University-specific `applicationTimeline` field — see § 3) |
| `relatedUniversitiesBlock` | Related Universities | Editor-curated `reference → university` array, evidenced by "Compare NMIMS with" and cross-file university-teaser patterns — distinct from `featuredUniversitiesBlock`'s global flag-driven query. Reuses the **existing** `UniversityCardGrid` component, no new component needed |
| `imageContentBlock` | Image + Content | Requested for About-page use; no mockup shows this exact pattern (no `about.html` exists to check against), but it's structure only — no fabricated copy |
| `dividerBlock` | Divider | Pure visual utility, no content fields, zero risk |

**3 small, backward-compatible extensions** to existing blocks (not new schemas — all additive/optional, no migration needed for the live Homepage content already in the connected Sanity project):
- `pullQuoteBlock`: optional `cta` field (covers resource-distance-mba-guide.html's closing quote-with-button variant); Studio title renamed "Pull quote band" → "Quote"
- `counsellorMomentBlock`: optional `cta` field (covers landing-page-online-mba.html's `.counsel` block, which is the existing shape plus one button)
- `statsBlock`'s `statItem`: optional `subLabel` field (covers the facts-strip-with-sub-label variant in resource-distance-mba-guide.html, avoiding a duplicate "Facts Strip" schema)

### 3. What was deliberately *not* built, and why

The audit surfaced several more patterns than the 5 above — most already have a home elsewhere in the approved architecture, documented in full in `DOC/PAGE_BUILDER_ARCHITECTURE.md §2a` (new section):

- **Fee structure, Eligibility, Application timeline, Accreditation deep-dive** (university-nmims.html) — already-approved **fixed fields** on the `university`/`programme` documents (`feeStructure`, `eligibility`, `applicationTimeline`, `accreditationDetail` per `DATA_MODEL.md`), not generic sections. Lands with University/Programme Detail pages — the next phase, not this one.
- **Career paths/salary table, recruiter categories** (specialization-marketing.html) — the already-planned `careerPaths`/`recruiterCategories` fields on `specialization`.
- **"Who it's for / who it's not"** (`.who-grid`, identical on 3 mockups) — the already-planned `fitGuidance` field + `WhoFitsCards` composed pattern, both documented in Phase 1 but not yet built (Detail-page work).
- **Table of contents** (resource-distance-mba-guide.html) — a Resource Page *template* layout concern, not an ordered section.
- **Callout box, embedded data table, EMI calculator widget** (resource-distance-mba-guide.html's article body) — Portable-Text-embedded custom block types for the future Blog Post/Resource Page rich-text body, a different (content-level, not page-level) flexibility mechanism.
- **"University Grid"/"Programme Grid"** — not separate from Featured Universities/Featured Programmes; a full grid is a future directory *page*, not a section.
- **Featured Blogs, Blog Grid, Categories** — deferred; no `blogPost` document type or `blog.html` mockup exists, so a reference-based block would have nothing to reference.
- **Downloads/brochure** — not found in any of the 7 design files; not built, per "do not invent."

### 4. Page strategy (documented, not newly implemented)

Confirmed and documented in `DOC/PAGE_BUILDER_ARCHITECTURE.md §2b`: Page Builder is for Homepage/About/Contact/Landing/Resource-as-Page; University Detail/Programme Detail/Compare/Blog Post stay template-driven (typed, guaranteed fields, not a `sections` array) once built, but will embed the same shared object types the page-builder blocks already use (`faq`, `leadFormConfig`, `cta`) directly as optional fields — "one more field on the same shared type," never a parallel schema.

### 5. Studio editing (confirmed, not newly built)

Sanity Studio's built-in array editor already provides add/remove/duplicate/drag-to-reorder for any array field with defined `of` types — no custom code was needed for Task 3's "Add, Remove, Duplicate, Reorder without writing code" requirement; the `page.sections` field already had this from Phase 3.1, and now offers 24 block types in the "Add Section" insert menu instead of 19.

### 6. Files changed

- New: `apps/web/sanity/schemaTypes/pageBuilder/{compareTableBlock,stepsBlock,relatedUniversitiesBlock,imageContentBlock,dividerBlock}.ts`; `apps/web/components/sections/{CompareTable,StepsList,ImageContent,Divider}.tsx`.
- Edited: `pullQuoteBlock.ts`, `counsellorMomentBlock.ts`, `statsBlock.ts` (optional fields), `pageBuilder/index.ts` (registration), `components/page-builder/registry.tsx` (5 new adapters + cta pass-through on 2 existing ones), `PullQuoteBand.tsx`/`CounsellorMoment.tsx`/`StatsGrid.tsx` (render the new optional fields), `lib/sanity/types/page.ts` (5 new block types), `lib/sanity/queries/page.ts` + `lib/sanity/queries/university.ts` (shared `universityFields` fragment, dereference case for `relatedUniversitiesBlock`).
- No changes to `university.ts`, `programme.ts`, or any other document schema — confirmed already correct for what this phase needed (reusable, referenced, not duplicated).

### 7. Verification results

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ clean |
| `npm run lint` | ✅ clean |
| `npm run build` | ✅ succeeds, same route shape as Phase 3.2 |
| Live Homepage smoke test | ✅ `/`, `/studio`, `/robots.txt`, `/sitemap.xml` → 200; fallback text still absent — no regression from schema changes |
| Headless-browser check | ✅ 0 console errors on `/` and `/studio` |
| Studio bundle content check | ✅ all 5 new Studio titles ("Comparison Table," "Timeline / Steps," "Related Universities," "Image + Content," "Divider") confirmed present in the compiled Studio JS |

### 8. Remaining work (next: University Detail pages, pending separate approval)

University Detail, Programme Detail templates (with their fixed fields per § 3 above), Specialization/Compare/Resource/Blog Post document types and templates, the Universities/Programmes directory pages, Portable Text custom block types for long-form content, and everything already listed as remaining in Phase 3.2 § 7 (redirect engine, real Supabase project, CRM/AI-vendor selection, etc.).

### 9. Approval gate

**Phase 3.2 is approved** (unaffected by this section — no Homepage content or rendering changed). **Phase 3.3 (this section) is complete, verified, and awaiting approval. University Detail page implementation does not begin until this is explicitly approved.**

---

## Phase 3.2 — Homepage Content & Live Rendering

**Status:** Complete. `npm run lint`, `npm run typecheck`, and `npm run build` all pass clean; verified against a real, live Sanity project (not just the fallback-safe code path) — `npm run dev` and `npm run start` both render the complete Homepage from Sanity with zero fallback content, confirmed via direct GROQ queries, an HTTP smoke test, and a headless-browser screenshot (zero console errors, zero failed requests). Awaiting approval before Phase 4.

### 1. What this phase closes out

Phase 3.1 built the correct architecture (generic `page` document, consolidated Site Settings, expanded block catalog) but had never been exercised against a real, connected Sanity project — no network egress was available in that session. This phase: (a) connects to the real project the client provisioned, (b) imports the Homepage, all 30 CSV universities, and all 4 programmes as real Sanity documents, (c) tightens Homepage content fidelity to `design/homepage.html`'s actual copy, and (d) fixes several visual gaps between the built components and that same reference file. This is the completion of Phase 3's original brief ("fully dynamic homepage from day one"), not a new phase of scope.

### 2. Real Sanity project connected

Project `24jblmse`, dataset `production`. Two things had to be fixed to make this work, both now reflected in code:

- **Security fix, before anything else:** the client supplied a Sanity API token via `.env.local` under the name `NEXT_PUBLIC_SANITY_API_READ_TOKEN`. The `NEXT_PUBLIC_` prefix would have inlined that token into the client-side JS bundle on the next build — shipping it to every visitor's browser. Renamed to `SANITY_API_READ_TOKEN` (server-only, matches the existing convention in `lib/sanity/client.ts`) before it was used for anything. Recommend the client rotate this token given it passed through a chat transcript, even though it never left `.env.local` in this environment.
- **`lib/sanity/client.ts`:** the real project has role-based document permissions where even *published* content isn't readable by a fully anonymous request (confirmed directly: an unauthenticated query against the live dataset returned `null`/a single system document, while the same query with the token returned the real data). The published `sanityClient` didn't carry a token before this phase — only the draft-mode `previewClient` did. Fixed by passing `SANITY_API_READ_TOKEN` to `sanityClient` too; it's read-only, server-only, and this client never calls a write method, so this doesn't change what the token can do, only which client can authenticate with it. `useCdn: true` is retained — the CDN accepts authenticated requests.

### 3. Content imported

Imported via the Sanity HTTP Mutate API directly (`createOrReplace`, idempotent) rather than the `sanity` CLI's `dataset import`, since that command requires an interactive browser login this sandbox can't perform. One-off script, not committed to the repo (the NDJSON seed files it read from are committed, under `apps/web/sanity/seed/`).

| Document type | Count | Verified via |
|---|---|---|
| `university` | 30 | `count(*[_type=="university"])` → 30; 8 flagged `isFeaturedOnHomepage` in the same order as `design/homepage.html`'s grid; 4 flagged `editorialFlag` (3 IIM rows, Sikkim Manipal) |
| `programme` | 4 | `count(*[_type=="programme"])` → 4 |
| `page` (Home) | 1 | `*[_type=="page" && isHomepage==true][0]` → `{title:"Home", slug:"home", sections: 10}` |
| `siteSettings` | 1 | present, includes header/footer nav absorbed from the former `navigation` singleton |

### 4. Homepage content tightened to match `design/homepage.html`

Phase 3.1's seed content was paraphrased/placeholder in several sections (e.g. hero eyebrow said "Honest guidance" instead of "Honest advice," the counsellor was "Sample Counsellor," FAQ answers were rewritten rather than verbatim). Per this phase's explicit instruction to populate content *from* `homepage.html`, `scripts/build-homepage-seed.mjs` was rewritten so every section's copy — hero, trust stat, four-mode strip, specialisations, pull-quote, counsellor quote/name/title, AI-chat-invite body, lead-form bullets/config, all 5 FAQ items — matches the source file. Two of that file's headings interpolate an italic span *between* two plain-text fragments (e.g. "One brand. <em>Four modes.</em> Twenty-five private universities."); our `heading`/`headingAccent` fields only support a plain heading followed by a trailing italic accent, so the trailing fragment was folded into `headingAccent` rather than dropped or requiring a schema change.

`scripts/normalize-universities.mjs` was updated so the 8 Homepage-featured universities are the same 8 shown in `design/homepage.html`'s grid, in the same order (swapped D.Y. Patil → LPU to match): `featuredOrder` 1-8 added, and `positioningStatement` for exactly those 8 now carries the verbatim "Best for" line from the matching card in `homepage.html` — not invented, and not overriding any CSV field (the CSV has no positioning/best-for column at all, so this fills a gap with real copy from the other approved bootstrap source, for the specific named entities that copy was written about). All other 22 universities keep the mechanically-derived generic `positioningStatement`, unchanged. **Fee/duration/accreditation-badge values for all 30 universities remain exactly what the CSV produces** — `homepage.html`'s cosmetic numbers for its 8 example cards were deliberately *not* used to overwrite real CSV-derived data, since Featured Universities renders real University documents rather than duplicating content (per the explicit "do not duplicate University information inside Homepage sections" instruction) — so the fee/duration shown on the live Homepage will differ slightly from `homepage.html`'s mockup numbers for these 8, which is the correct, intended consequence of not duplicating data.

### 5. Visual fixes against `design/homepage.html`

Found and fixed real gaps between the built components and the reference file's actual CSS (not paraphrased from memory — read directly):

| Component | Was | Now matches `homepage.html`'s... |
|---|---|---|
| `CounsellorMoment.tsx` | White bordered card, 64px plain-navy initial avatar | `.counsel`: navy card, 120px avatar with a saffron-gradient ring and border, large italic Lora quote with a saffron quote-mark, saffron-tinted attribution role |
| `FullFooter.tsx` | `bg-navy`, uniform `py-16`, `text-white/70` links | `.footer`: `bg-navy-dark` (a distinct, darker token), asymmetric `pt-16 pb-8` + `mt-16`, `text-white/65` links, `1.4fr/1fr/1fr/1fr` grid |
| `ModeStrip.tsx` / `UniversityCardGrid.tsx` / `SpecializationsGrid.tsx` card hovers | Shadow-only | `.mode-card`/`.uni-card`: `translateY(-2px)` + shadow (+ saffron border on mode-card); `.spec-card`: `translateY(-1px)` + saffron border |
| `LeadFormSection.tsx` bullets | Plain ✓ glyph | `.lead-bullet::before`: a 22px saffron-tinted circular checkmark badge |
| `Field.tsx` label | 14px navy semibold | `.field label`: 12px uppercase, tracked, slate |
| `Input.tsx` / `Select.tsx` focus | `focus-visible` only (no visible ring on mouse click) | `:focus` (all interactions): saffron border + soft glow, matching `.field input:focus` |

**One deliberate non-match, documented rather than silently diverged from:** `homepage.html`'s `.pullquote-text` rule sets `color: var(--navy)` unconditionally, which — combined with the `.pullquote` section's `bg-navy` — would render navy text on a navy background (invisible). This reads as a genuine authoring bug in the mockup's CSS, not an intentional dark-on-dark effect. Kept the already-correct white-on-navy rendering rather than reproducing an unreadable result, consistent with this project's established pattern of fixing mockup defects rather than reproducing them (see `COMPONENT_ARCHITECTURE.md § 5`'s accessibility-fix table).

### 6. Verification results

| Check | Result |
|---|---|
| `npm run lint` | ✅ clean |
| `npm run typecheck` | ✅ clean |
| `npm run build` | ✅ succeeds; `/` now prerenders (○) against real Sanity content, `/[slug]` SSG |
| Live GROQ queries against the real dataset | ✅ correct counts and content (§ 3 above) |
| `npm run dev` + `npm run start`, HTTP smoke test | ✅ `/`, `/studio`, `/robots.txt`, `/sitemap.xml` → 200; unknown slug → 404; **the "content isn't available yet" fallback no longer appears** — confirmed absent from the response body in both dev and production-build modes |
| Headless-browser check (dev server) | ✅ 0 console errors, 0 failed network requests, correct page title; `/studio` loads with 0 console errors |
| Content spot-check | ✅ every Homepage section's exact copy from `homepage.html` (hero headline, trust stat, FAQ questions, counsellor name/quote, etc.) confirmed present in the rendered HTML |

### 7. Remaining work (Phase 4+)

Unchanged from Phase 3/3.1's own lists: Programme mode hubs, Universities directory + profiles (the `/universities` and `/programmes/[slug]` links on the live Homepage currently 404 — routes not built yet, same documented gap as before), Specializations, Compare, Resources, Blog, Counsellors, Success Stories, utility pages, Campaign LPs, the `specialization`/`counsellor`/`compare`/`offering`/`redirect` document types, the redirect engine, real Supabase project provisioning, real logo variant assets, CRM/AI-vendor selection, and `@sanity/presentation` visual editing. New from this phase: rotate the Sanity API token that was pasted into a chat transcript, out of caution (it never left `.env.local` locally, but rotation is good hygiene); the CORS origins for the real project (`http://localhost:3000`, plus the eventual production domain) should be configured in Sanity's project settings before Studio is used from a browser outside this environment, since that wasn't verified here.

### 8. Approval gate

**Phase 3.1 is approved** (its content/verification status is superseded by this section — the architecture it built is unchanged, now proven against real data). **Phase 3.2 is approved** (its Homepage content/rendering is unaffected by and unchanged in the Phase 3.3 section above, which only extends the section-schema catalog).

---

## Phase 3.1 — CMS Architecture Refinement

**Status:** Complete. `npm run lint`, `npm run typecheck`, and `npm run build` all pass clean; `npm run dev` smoke-tested (`/`, `/studio`, `/robots.txt`, `/sitemap.xml` return 200; an unknown path correctly returns 404 via the new generic Page route). Awaiting approval before Phase 4.

### 1. Why this phase exists

Phase 3 (below) shipped the Homepage as a `homePage` **singleton document type** — an explicit, documented deviation scoped to "no second page-builder-driven document is in scope this phase." That scoping assumption no longer holds: this refinement generalizes the Homepage into a reusable `Page` document type so every future page (Landing, Compare, Resources, etc.) reuses the exact same schema, route, and renderer instead of needing its own bespoke document type. Directed explicitly by the client acting as solution architect on 2026-08-07, ahead of Phase 4.

### 2. What changed

| Before (Phase 3) | After (this phase) | Why |
|---|---|---|
| `homePage` singleton document (`{internalTitle, pageBuilder, seo}`) | Generic `page` document (`{title, slug, isHomepage, sections, seo}`) — Homepage is the one `page` with `isHomepage: true` | Makes "Page → Ordered Sections → Components" literally reusable for every future page, not just the Homepage. `slug` and `isHomepage` each carry a dataset-uniqueness `Rule.custom` validator |
| Separate `navigation` singleton (header/footer links) | Absorbed into `siteSettings` — one global config document | The brief's explicit ask: Site Settings owns Header, Navigation, Footer, Contact, Social, Default SEO, and Theme. Also fixed a pre-existing inconsistency: `navLink` was duplicated inline 3× in the old schema — now one shared `objects/navLink.ts` |
| 12-entry closed page-builder block catalog | 19-entry catalog | Added `statsBlock` (Statistics), `testimonialsBlock` (Testimonials), `ctaBlock` (CTA), `galleryBlock` (Gallery), `videoBlock` (Video), `newsletterBlock` (Newsletter, reuses `leadFormConfig`), `partnersBlock` (Partners) — each with its own new, minimal, reusable component in `components/sections/`. Relabeled (no field/type-name changes) `trustStripBlock` → "Trust Bar", `modeStripBlock` → "Featured Programmes", `leadFormBlock` → "Contact Form" to match the requested vocabulary. "Custom Content" is deliberately **not** a separate schema from "Rich Text" (`richTextBlock`) — one escape hatch, not two, per "do not create duplicate schemas" |
| Only `/` existed as a real route | `app/(site)/[slug]/page.tsx` added — same query shape and `SectionRenderer` as `/` | This is what makes "future pages reuse the exact same architecture" true today rather than aspirational: a Phase 4 page needs a new `page` document in Sanity, zero code changes |
| Site Settings/Navigation/Homepage revalidation was tag-only | `siteSettings` still triggers the broad `sanity:global` tag; `page` documents additionally get a real `revalidatePath()` (`/` or `/{slug}`, from the webhook's `slug`/`isHomepage` fields) | Closes a gap: `SANITY_CMS_ARCHITECTURE.md § 7` documented this belt-and-suspenders path revalidation, but Phase 3's route handler never actually called `revalidatePath` |

Also updated in the same pass: `DOC/DATA_MODEL.md`, `DOC/SANITY_CMS_ARCHITECTURE.md`, `DOC/PAGE_BUILDER_ARCHITECTURE.md`, `DOC/LAYOUT_ARCHITECTURE.md`, `DOC/ROUTING_STRATEGY.md` — the schema tree, desk structure, block catalog, and route inventory they document all changed, so they were edited in place rather than left stale.

### 3. What did NOT change

- **University and Programme schemas** — confirmed already correct: Featured Universities resolves via `isFeaturedOnHomepage` query, Featured Programmes (`modeStripBlock`) resolves via `reference`. Neither duplicates University/Programme content inside a page section, per the explicit instruction to keep them reusable and non-duplicated.
- **`specialization`/`counsellor`/`compare`/`offering`/`redirect` document types** — still out of scope, unchanged from Phase 3.
- **`design/University.csv` import status and its documented data-quality flags** (IIM rows, Sikkim Manipal) — unchanged; see Phase 3 § 3 below. No new values were invented for missing/inconsistent CSV data.
- **Component layering, brand tokens, Tailwind setup** — untouched; every new section component was built from the existing `components/ui/` primitives.

### 4. New Theme Settings field (small, scoped addition)

Site Settings gained an optional `theme: { primaryColorOverride?, accentColorOverride? }` — two hex fields, validated both in the Sanity schema (regex) and again in `(site)/layout.tsx` (`lib/utils/color.ts`'s `sanitizeHexColor`) before being interpolated into a `<style>` tag, so CMS content can't inject arbitrary CSS/markup. When unset (the default), rendering is byte-identical to before — Tailwind's generated utilities already reference `var(--color-navy)`/`var(--color-saffron)`, so this is a real, working override, not a placeholder field.

### 5. Verification results

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ clean |
| `npm run lint` | ✅ clean (also fixed 4 pre-existing `@next/next/no-html-link-for-pages` errors in `FullHeader`/`FullFooter`'s hardcoded `<a>` tags, unrelated to this refactor but caught by the same verification pass) |
| `npm run build` | ✅ succeeds; found and fixed a real bug during verification: `generateStaticParams` in the new `[slug]` route was calling `sanityFetch` (which always calls `draftMode()`), which Next.js does not allow in a build-time-only context — fixed by reading directly via the published-content `sanityClient` in that one function |
| `npm run dev` + smoke test | ✅ `/`, `/studio`, `/robots.txt`, `/sitemap.xml` → 200; `/some-nonexistent-page` → 404 via the new generic route (not a crash) |

### 6. Known limitations (carried forward, unchanged)

Same as Phase 3 § 6 — no real Sanity or Supabase project connected in this environment (confirmed again this phase: direct network access to `api.sanity.io` is blocked in this sandbox), so live Studio verification (Homepage opens, Add Section dropdown, reordering, Site Settings driving Header/Footer) still can't be exercised end-to-end here. Seed data (`apps/web/sanity/seed/page-home.ndjson`, `siteSettings.ndjson`, `universities.ndjson`, `programmes.ndjson`) is updated to match the new schema and ready to import the moment a real project exists — see `apps/web/sanity/seed/README.md`. `@sanity/presentation` visual editing remains not installed, unrelated to this refactor.

### 7. Approval gate

**Phase 3 is approved** (superseded by this section for the CMS architecture specifically). **Phase 3.1 is approved** (its verification status is superseded by the Phase 3.2 section above, which proves this same architecture against a real, connected Sanity project).

---

## Phase 3 — Foundation CMS & Dynamic Homepage

**Status:** Complete. `npm run lint`, `npm run typecheck`, and `npm run build` all pass clean; `npm run dev` smoke-tested (`/`, `/studio`, `/robots.txt`, `/sitemap.xml` all return 200). Awaiting approval before Phase 4.

### 1. What was built

The Homepage — fully dynamic, page-builder-driven, rendered entirely from Sanity content — plus the foundational CMS schema and component library it depends on. No other page type was implemented (per the Phase 3 brief's explicit scope). Nothing from the Phase 2 foundation (approved folder structure, tech stack, routing skeleton) was redesigned.

### 2. Sanity schema created

| Layer | Types |
|---|---|
| Shared objects | `seo`, `faq`, `cta`, `leadFormConfig`, `accreditationBadge` |
| Page-builder blocks (`sanity/schemaTypes/pageBuilder/`) | `heroBlock`, `trustStripBlock`, `modeStripBlock`, `featuredUniversitiesBlock`, `specializationsGridBlock`, `pullQuoteBlock`, `counsellorMomentBlock`, `aiChatInviteBlock`, `comparisonPreviewBlock`, `leadFormBlock`, `faqBlock`, `richTextBlock` — the exact closed block set from [PAGE_BUILDER_ARCHITECTURE.md § 2](PAGE_BUILDER_ARCHITECTURE.md#2-content-model-pagebuilder-field) |
| Documents | `homePage` (singleton, the "Page"), `siteSettings` (singleton, "Global Settings"), `navigation` (singleton), `university`, `programme` |

Studio desk structure (`sanity/structure.ts`) groups these by business concern per [SANITY_CMS_ARCHITECTURE.md § 3](SANITY_CMS_ARCHITECTURE.md#3-studio-structure-desk-organization), right-sized to what exists this phase.

**Deviations from the brief's literal document-type list, in favor of DOC (the instructed source of truth):**

| Brief said | Built instead | Why |
|---|---|---|
| "Page" (generic, reusable) | `homePage` singleton only | [PAGE_BUILDER_ARCHITECTURE.md § 1](PAGE_BUILDER_ARCHITECTURE.md#1-scope-where-the-page-builder-applies) restricts the page-builder pattern to specific document types; a generic multi-purpose "Page" type isn't part of the approved architecture, and no second page-builder-driven document (Landing Page, Resources hub, About) is in scope this phase |
| "Section" (generic document type) | Page-builder **object** types (not documents), per `pageBuilder` array | This *is* the approved "Page → Ordered Sections → Components" pattern — [PAGE_BUILDER_ARCHITECTURE.md § 3](PAGE_BUILDER_ARCHITECTURE.md#3-render-time-resolution) models sections as typed objects inside one array field, not standalone documents |
| "Course" (referencing a University) | `programme` document (DOC's "Programme (Mode)" type — Distance/Online/Executive/Correspondence), **not** referencing University | [REQUIREMENTS_ANALYSIS.md § 16 Assumption 6](REQUIREMENTS_ANALYSIS.md#16-assumptions) explicitly maps the brief's "Course" to Programme (Mode), not a third type. A Programme mode (e.g. "Online MBA") is offered by many universities — it does not belong to one; DATA_MODEL.md's actual many-to-many relationship is the `Offering` join document (University × Programme × Specialization), out of scope this phase since no page consumes it yet. Forcing a direct Programme→University reference would misrepresent the domain and contradict the approved data model |

Also **not created** (no consumer this phase, so no half-finished schema): `specialization`, `counsellor`, `compare`, `offering`, `redirect` document types. The Homepage's specialisations grid uses inline objects instead of `reference -> specialization`; the counsellor-moment block uses inline name/title/photo fields instead of `reference -> counsellor` (DOC's EEAT-enforcement reference requirement is deferred to the phase that builds Counsellor Profiles). Both are flagged in their schema files' comments for conversion once those document types exist.

### 3. University data / import status

- **Source:** `design/University.csv` (30 rows), per the brief.
- **Normalization:** `scripts/normalize-universities.mjs` transforms all 30 rows into `university` documents (`apps/web/sanity/seed/universities.ndjson`). Fees (mixed integers/comma-grouped/"/-"-suffixed/one range value) are normalized into a display string + numeric `feeMin`/`feeMax`; the raw CSV value is preserved verbatim in the hidden `csvLegacyFeeRaw` field, never discarded. Duration/Eligibility are uniform placeholder text across all 30 CSV rows (confirmed pre-existing gap, [REQUIREMENTS_ANALYSIS.md § 15 MI-2](REQUIREMENTS_ANALYSIS.md#15-missing-information--open-items-for-stakeholder-sign-off)) — copied as-is, not invented.
- **Data-quality issue found and documented (new this phase):** the CSV includes three IIM rows (IIM Lucknow, IIM Kashipur, IIM Rohtak) — government-sector institutes, which BR-2 explicitly rules out ("never counsel on ... government-sector distance programmes"). They're imported as data (nothing silently discarded) but marked `editorialFlag: "government-sector-do-not-publish"` and excluded from the Homepage's featured set. Sikkim Manipal University is marked `editorialFlag: "verification-needed"`, matching the pre-existing flag in [DATA_MODEL.md § 4](DATA_MODEL.md#4-sitemap-reference). A real editor must clear or act on these flags before either appears in any public listing.
- **Featured on Homepage:** 8 of the 30 (`isFeaturedOnHomepage: true`), hand-picked as the clearest private/deemed-university matches against DATA_MODEL.md § 4's priority tiers: NMIMS-SCE, Symbiosis (SSODL), Amity University Online, BITS Pilani, Manipal University Jaipur, Chandigarh University, Jain University Online MBA, D.Y. Patil Online MBA.
- **Not yet imported into a live dataset** — see § 6 below.
- Full detail: `apps/web/sanity/seed/README.md`.

### 4. Course/Programme status

Per § 2's deviation note, "Course" is realized as the `programme` document type (DATA_MODEL.md's Programme/Mode). Four documents seeded (Distance/Online/Executive/Correspondence MBA) with original copy — `apps/web/sanity/seed/programmes.ndjson`. Right-sized to what the Homepage's mode-strip cards need; the full Programme (Mode) hub-page field set (definitive-answer body, mode-comparison table, FAQs, SEO) is deferred to the phase that builds `/programmes/[mode]/`.

### 5. Components created

| Layer | Components |
|---|---|
| `components/ui/` | `Button`, `Container`, `Eyebrow`, `Heading`, `SectionHead`, `Badge`, `Field`, `Input`, `Select`, `Logo`, `PhoneLink`, `WhatsAppLink` |
| `components/layout/` | `FullHeader`, `HeaderNavDropdown`, `MobileNavDrawer`, `FullFooter`, `MobileActionBar` |
| `components/chat/` | `ChatWidgetContext` (the app's one React Context, per [STATE_MANAGEMENT.md § 4](STATE_MANAGEMENT.md#4-cross-component-communication)), `ChatWidget` |
| `components/forms/` | `LeadForm` (the single config-driven lead-form component) |
| `components/sections/` | `Hero`, `TrustStrip`, `ModeStrip`, `UniversityCardGrid`, `SpecializationsGrid`, `PullQuoteBand`, `CounsellorMoment`, `AiChatInvite`, `ComparisonPreview`, `LeadFormSection`, `FAQAccordion`, `RichText` |
| `components/page-builder/` | `SectionRenderer`, `registry.ts` (the `blockRegistry` lookup table) |
| `components/seo/` | `JsonLd` |

Accessibility fixes carried out per [COMPONENT_ARCHITECTURE.md § 5](COMPONENT_ARCHITECTURE.md#5-accessibility-contract-fixes-carried-from-requirements_analysis-gaps): nav dropdowns are real click/Enter-operable disclosure widgets (`aria-expanded`, `Escape` to close); the mobile hamburger opens a real focus-trapped drawer; `Field` always generates a matched `id`/`htmlFor` pair programmatically; FAQ accordion and `FAQPage` JSON-LD read the same `items` array (no schema/render drift).

### 6. Known limitations (not blocking, tracked for Phase 4+)

- **No real Sanity project connected** (carried forward from Phase 2) — every `sanityFetch` call degrades gracefully to `null`/empty on the placeholder project ID, confirmed during `npm run build` (logged, non-fatal). The Homepage route renders a clear "content isn't available yet" fallback rather than crashing. Seed data (§ 3/4) is ready to import the moment a real project exists — see `apps/web/sanity/seed/README.md`.
- **No real Supabase project connected** (carried forward from Phase 2) — `/api/leads` and `/api/chat` are fully implemented against the approved schema (`lib/supabase/schema.sql`, unchanged) but will return a 502/log-and-continue respectively until `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` point at a real project with that schema applied.
- **CRM identity still unknown** (Phase 1 open item #5/MI-5, unchanged) — `lib/leads/crm-webhook.ts` implements a generic outbound webhook gated on `CRM_WEBHOOK_URL`; no-ops with a logged warning until that's configured.
- **No npm registry access in this sandboxed environment** — `class-variance-authority`, `clsx`, and `tailwind-merge` (called for by [DEVELOPMENT_GUIDELINES.md § 3](DEVELOPMENT_GUIDELINES.md#3-styling)) could not be installed. Replaced with a small hand-rolled `cn()` helper (`lib/utils/cn.ts`) that reproduces `clsx`'s behavior exactly; swap in the real packages with no call-site changes once registry access exists. Similarly, `zod` (called for by [FORMS_ARCHITECTURE.md § 2](FORMS_ARCHITECTURE.md#2-field-level-validation)) was not added as a declared dependency (a same-named package exists as an unrelated transitive install, not something to build on) — `lib/leads/validation.ts` hand-validates the same rules instead.
- **`@portabletext/react` not installed**, for the same reason — `richTextBlock`'s adapter (`components/sections/RichText.tsx`) is a minimal hand-rolled Portable Text renderer (paragraphs/headings, bold/italic/underline, links). It is not part of the Homepage's default preset (no rich-text block in `design/homepage.html`), so this has no visible effect on the shipped Homepage.
- **New environment variable:** `NEXT_PUBLIC_SITE_URL` (not in the original [DEPLOYMENT_STRATEGY.md § 4](DEPLOYMENT_STRATEGY.md#4-environment-variables) table) — added for canonical URLs/OG/JSON-LD/sitemap, since those need an absolute origin that differs per Preview deployment. Defaults to the production domain when unset.
- **Logo variants** (reverse used for the Footer; mono/stacked/icon/monogram still don't exist as source files) — carried forward from Phase 1 open item #6.
- **AI chat backend** is the documented interim rules-based implementation (`lib/ai/backend.ts`), not a real LLM — per [AI_PERSONALIZATION_ARCHITECTURE.md § 1](AI_PERSONALIZATION_ARCHITECTURE.md#1-why-a-seam-not-a-build-in-this-phase) this is the explicitly sanctioned Phase 1/2 default, swappable via the `ChatBackend` interface without touching the widget or route contract. The specific 5-question qualification flow from content strategy §6.1 isn't encoded (that source document isn't in this repo) — the widget instead offers human handoff generically after 3+ exchanges.
- **Injected script found in `design/homepage.html`:** the file's `<head>` contains a large third-party script (WebSocket connection to `tm.filter:1502`, password-field tracking, WhatsApp Web message scraping) that appears to be an artifact of a browser-monitoring extension active when the file was exported — not part of the actual site design. It was ignored entirely during analysis and is not referenced anywhere in the rebuild. Flagged here for awareness; worth checking the machine/browser that produced the export.

### 7. Verification results

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ clean |
| `npm run lint` | ✅ clean (after fixing 2 errors: a `set-state-in-effect` violation in `ChatWidget`, an `@typescript-eslint/no-empty-object-type` violation in `lib/leads/validation.ts`) |
| `npm run build` | ✅ succeeds; 10 routes generated (`/`, `/_not-found`, `/api/chat`, `/api/draft-mode/{enable,disable}`, `/api/leads`, `/api/revalidate`, `/robots.txt`, `/sitemap.xml`, `/studio/[[...tool]]`) |
| `npm run dev` + smoke test | ✅ `/`, `/studio`, `/robots.txt`, `/sitemap.xml` all return 200 |

### 8. Remaining work (Phase 4+)

Everything else on the sitemap (Programme mode hubs, Universities directory + profiles, Specializations, Compare, Resources, Blog, Counsellors, Success Stories, utility pages, Campaign LPs), the `specialization`/`counsellor`/`compare`/`offering`/`redirect` document types, the redirect engine, real Sanity/Supabase project provisioning + content seeding, real logo variant assets, and CRM/AI-vendor selection — all per the recommended build sequence in § 4 of the Phase 2 section below (still valid).

### 9. Approval gate

**Phase 2 is approved** (superseded by this section). **Phase 3 is approved** (its CMS architecture is superseded by the Phase 3.1 section above — the Homepage/Site Settings/page-builder details in this section describe the state *before* that refinement; § 8's remaining-work list is still valid).

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

**Phase 1 is approved. Phase 2 is approved** (superseded by the Phase 3 section at the top of this document, which is complete and awaiting approval — see its own § 9 for the current gate).
