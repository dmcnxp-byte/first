# Sanity CMS Architecture

Sanity is the single source of truth for all website content (per the brief's explicit constraint). This document covers Studio structure, schema organization, plugins, roles, and the preview/webhook contracts other docs depend on. Field-level content model lives in [DATA_MODEL.md](DATA_MODEL.md); page-builder mechanics in [PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md).

## 1. Project topology

- **One Sanity project**, three datasets: `development`, `staging`, `production` (mirrors the environment table in [PROJECT_ARCHITECTURE.md § 5](PROJECT_ARCHITECTURE.md#5-environments)).
- Studio is embedded in the Next.js app at `/studio` (route group `(studio)`, see [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)) — one deployable unit, one Vercel project, editors log in with their Sanity account via the same domain. This is the recommended default; a fully standalone Studio deployment remains possible later without a schema change if the team wants independent release cadences.

## 2. Schema organization

```
schemaTypes/
├── documents/
│   ├── university.ts
│   ├── programme.ts            # the "Programme (Mode)" type — Distance/Online/Executive/Correspondence
│   ├── specialization.ts
│   ├── compare.ts
│   ├── offering.ts              # University × Programme × Specialization join document
│   ├── blogPost.ts
│   ├── resourcePage.ts          # pillar/guide long-form
│   ├── landingPage.ts           # still a distinct future document type — narrower block set, /lp/ route (unbuilt)
│   ├── counsellor.ts
│   ├── successStory.ts
│   ├── page.ts                  # the generic Page document — Homepage is the one Page with isHomepage: true
│   ├── siteSettings.ts          # singleton — absorbs the former separate `navigation` singleton
│   └── redirect.ts
├── objects/
│   ├── seo.ts                   # {title, description, ogImage, canonicalUrl, noindex}
│   ├── faq.ts                   # {question, answer} — reused inline everywhere
│   ├── cta.ts                   # {label, href|internalLink, style}
│   ├── leadFormConfig.ts        # {title, subtitle, fields[], submitLabel, footerNote}
│   ├── navLink.ts                # {label, href} — reused across Site Settings' header/footer link arrays
│   ├── quickFact.ts / factRow.ts
│   ├── accreditationBadge.ts
│   └── pageBuilder/             # one object schema per builder block (24 total — see PAGE_BUILDER_ARCHITECTURE.md § 2), incl. compareTableBlock.ts, stepsBlock.ts, relatedUniversitiesBlock.ts, imageContentBlock.ts, dividerBlock.ts
└── index.ts
```

Every document type includes the shared `seo` object and, where applicable, `faq` array — never duplicated as bespoke fields per type.

The 24-entry page-builder catalog is the **finalized** reusable Section Library as of the design-mockup audit documented in [PAGE_BUILDER_ARCHITECTURE.md § 2a](PAGE_BUILDER_ARCHITECTURE.md#2a-what-is-not-a-page-builder-section-the-entity-field-boundary) — that section is the authoritative record of which mockup patterns became generic sections vs. entity-specific fixed fields on `university`/`programme`/`specialization` vs. deferred pending a future document type.

## 3. Studio structure (desk organization)

Custom Structure Builder groups the desk by business concern, not alphabetically:

```
Content
├── Pages                         (list — Homepage is the one Page flagged isHomepage: true, not a hand-wired singleton)
├── Programmes (4 documents, one per mode)
├── Universities (list, grouped by priority tier from content strategy)
├── Specializations (list)
├── Compare Pages (list, grouped: Mode-vs-Mode / University-vs-University)
├── Offerings (list — advanced/editorial-lite, mostly managed via references from University/Specialization docs)
├── Resources & Guides
├── Blog (grouped by category)
├── Counsellors
├── Success Stories
├── Landing Pages                 (still its own document type — narrower block set, /lp/ route)
Site Configuration
├── Site Settings                 (singleton — also owns header/footer nav, absorbing the former separate Navigation singleton)
└── Redirects (list, filterable/searchable — this is the operational tool editors use for FR-18)
```

## 4. Plugins

| Plugin | Purpose |
|---|---|
| `@sanity/vision` | GROQ sandbox for developers (dev-only tool visibility) |
| Structure Tool (built-in) | powers the desk structure above |
| Presentation / Visual Editing (`@sanity/presentation`) | Draft-mode click-to-edit overlay on the live Next.js preview, so editors can click a rendered section and jump straight to its Studio field |
| `@sanity/document-internationalization` | reserved for Phase 2+ per [FUTURE_SCALABILITY.md](FUTURE_SCALABILITY.md) — not enabled for the English-only Phase 1/2 launch |
| Custom "Redirect health" tool | a small custom Studio tool listing redirect documents whose target no longer resolves to a published document — operational safety net for FR-18 |

## 5. Roles & permissions

| Role | Access |
|---|---|
| Administrator | Full schema + content + project settings (agency/dev lead only) |
| Editor | Create/edit/publish all content document types; no schema/project-settings access |
| Contributor | Create/edit blog and resource content; cannot publish (routes to Editor for review) — supports a lightweight editorial review step for SEO/brand-voice compliance called out in the content strategy's governance section |
| Viewer | Read-only — for stakeholders who want to review without edit risk |

## 6. Preview & Draft Mode contract

1. Editor clicks "Preview" in Studio on a draft document.
2. Studio opens `{SITE_URL}/api/draft-mode/enable?secret=...&slug=...`, which validates a shared secret, calls `draftMode().enable()`, and redirects to the resolved front-end URL.
3. Every Server Component data-fetch checks `draftMode().isEnabled` and, if true, uses the Sanity **preview** API (bearer token, sees unpublished drafts) instead of the CDN API.
4. Exiting preview calls `/api/draft-mode/disable`.

This is the same rendering path used for production (see [PAGE_BUILDER_ARCHITECTURE.md § 6](PAGE_BUILDER_ARCHITECTURE.md#6-preview--draft-mode)) — there is no separate preview-only code path to maintain.

## 7. Webhook → revalidation contract

- Sanity project webhook fires on any document publish/unpublish/delete, POSTing `{ _id, _type, slug }` (via a small GROQ projection configured on the webhook) to `/api/revalidate`.
- The Route Handler validates a shared secret header, then calls `revalidateTag('sanity:${_type}:${_id}')` and, for documents with a known public path (university/programme/etc.), also `revalidatePath()` for that specific path as a belt-and-suspenders measure.
- Site Settings changes revalidate a broader tag (`sanity:global`) since it affects every page's header/footer. Page document changes additionally trigger a path-specific `revalidatePath()` (`/` for the Homepage, `/{slug}` otherwise), computed from the webhook's `slug`/`isHomepage` projection.

## 8. Content governance hooks

- A required `seo.title`/`seo.description` validation rule on every public document type, enforcing FR-15/FR-17 at the authoring layer, not just at render time.
- FAQ arrays require 5-10 items on document types where the content strategy mandates it (University, Programme, Compare, Resource) via Studio-level `validation(Rule => Rule.min(5).max(10))`, with Specialization/Landing Page left optional per the confirmed mockup finding that FAQ is conditional there.
- Counsellor quotes (`counsellorNote` object) require a reference to a real `counsellor` document, not a freeform name string — directly enforcing the EEAT requirement that every quote be attributed to a real, named counsellor (content strategy §5.4).
