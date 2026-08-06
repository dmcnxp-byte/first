# Enterprise Folder Structure

Documentation-only artifact — this tree is the target structure for Phase 2 implementation; nothing here is created yet (per Phase 1 rules, no project is initialized).

```
distance-mba-college/
├── apps/
│   └── web/                              # the Next.js application
│       ├── app/
│       │   ├── (site)/                   # public marketing site, uses full Header/Footer
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx              # Homepage (page-builder driven)
│       │   │   ├── how-it-works/page.tsx
│       │   │   ├── about/page.tsx
│       │   │   ├── contact/page.tsx
│       │   │   ├── brochure/page.tsx
│       │   │   ├── privacy-policy/page.tsx
│       │   │   ├── terms-and-conditions/page.tsx
│       │   │   ├── thank-you/page.tsx
│       │   │   ├── programmes/
│       │   │   │   ├── page.tsx                    # overview + mode-matcher widget
│       │   │   │   └── [mode]/
│       │   │   │       ├── page.tsx                # e.g. /programmes/online-mba/
│       │   │   │       └── iim-alternatives/page.tsx
│       │   │   ├── universities/
│       │   │   │   ├── page.tsx                    # directory/listing
│       │   │   │   └── [slug]/page.tsx
│       │   │   ├── specializations/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [slug]/page.tsx
│       │   │   ├── compare/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [slug]/page.tsx             # slug = "a-vs-b"
│       │   │   ├── resources/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── fee-emi-calculator/page.tsx
│       │   │   │   ├── eligibility-checker/page.tsx
│       │   │   │   └── [slug]/page.tsx
│       │   │   ├── blog/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [category]/[slug]/page.tsx
│       │   │   ├── counsellors/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [slug]/page.tsx
│       │   │   ├── success-stories/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [slug]/page.tsx
│       │   │   └── [...legacy]/route.ts            # fallback catch-all -> redirect resolver (belt-and-suspenders behind middleware)
│       │   ├── (landing)/
│       │   │   ├── layout.tsx                       # minimal header/footer variant
│       │   │   └── lp/[slug]/page.tsx
│       │   ├── (studio)/
│       │   │   └── studio/[[...tool]]/page.tsx       # embedded Sanity Studio
│       │   ├── api/
│       │   │   ├── leads/route.ts
│       │   │   ├── chat/route.ts
│       │   │   ├── revalidate/route.ts
│       │   │   ├── draft-mode/enable/route.ts
│       │   │   ├── draft-mode/disable/route.ts
│       │   │   └── sitemap.xml/route.ts
│       │   ├── llms.txt/route.ts
│       │   ├── robots.ts
│       │   ├── sitemap.ts
│       │   ├── layout.tsx                            # root layout: fonts, providers
│       │   ├── globals.css
│       │   └── not-found.tsx
│       ├── components/
│       │   ├── ui/                        # primitives: Button, Badge, Input, Select, Field
│       │   ├── sections/                  # Hero, TrustStrip, FactsStrip, WhoFitsCards, CompareTable, FAQAccordion, CounsellorNote, StepsList, CalloutBox, TOC, EMICalcWidget...
│       │   ├── page-builder/              # SectionRenderer + one component per registered builder block
│       │   ├── layout/                    # Header (full/minimal), Footer (full/minimal), MobileActionBar, Logo
│       │   ├── forms/                     # LeadForm, fields, validation schemas
│       │   ├── chat/                      # ChatWidget, ChatLauncher, message list
│       │   └── seo/                       # JsonLd, Breadcrumbs
│       ├── lib/
│       │   ├── sanity/
│       │   │   ├── client.ts
│       │   │   ├── queries/               # one file per document type
│       │   │   ├── image.ts               # @sanity/image-url helper
│       │   │   └── types/                 # generated types
│       │   ├── supabase/
│       │   │   ├── server-client.ts       # service-role, server-only
│       │   │   └── schema.sql             # reference copy of applied schema (see SUPABASE_ARCHITECTURE.md)
│       │   ├── seo/
│       │   │   ├── schema/                # jsonld builders per page type
│       │   │   └── metadata.ts
│       │   ├── leads/
│       │   │   ├── scoring.ts
│       │   │   └── crm-webhook.ts
│       │   ├── personalization/
│       │   │   └── cookie.ts
│       │   └── utils/
│       ├── middleware.ts                  # redirect resolution + personalization cookie
│       ├── public/
│       │   └── brand/                     # logo variants, favicon set
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── apps/
│   └── studio/                            # OR embedded under apps/web/(studio) — see SANITY_CMS_ARCHITECTURE.md decision
│       ├── schemaTypes/
│       │   ├── documents/                 # university.ts, programme.ts, specialization.ts, compare.ts, offering.ts, blogPost.ts, resourcePage.ts, landingPage.ts, counsellor.ts, successStory.ts, homePage.ts, redirect.ts
│       │   ├── objects/                   # faq.ts, seo.ts, cta.ts, leadFormConfig.ts, pageBuilder block objects
│       │   ├── singletons/                # siteSettings.ts, navigation.ts
│       │   └── index.ts
│       ├── structure/                     # Studio desk structure customization
│       ├── sanity.config.ts
│       └── package.json
│
├── packages/                              # only if a monorepo is warranted — see note below
│   └── shared-types/                      # generated Sanity types shared between web and studio, if split into separate apps
│
├── DOC/                                   # this documentation set
└── README.md
```

## Notes

- **Monorepo vs. single app:** whether Studio lives embedded inside the Next.js app (`app/(studio)/studio/[[...tool]]`) or as a separate `apps/studio` package is a Phase 2 decision, not an architectural requirement — the embedded route is simpler to deploy (one Vercel project) and is the recommended default; the `packages/` split above is shown for completeness if the team later prefers separate deploy lifecycles for Studio vs. the site.
- **Route groups** `(site)`, `(landing)`, `(studio)` share the root `layout.tsx` (fonts, global providers) but each defines its own nested `layout.tsx` for header/footer variants — see [LAYOUT_ARCHITECTURE.md](LAYOUT_ARCHITECTURE.md).
- **`components/sections/`** holds every reusable pattern catalogued in [REQUIREMENTS_ANALYSIS.md § 7](REQUIREMENTS_ANALYSIS.md#7-reusable-layouts--ui-patterns) as its own component + Storybook-style variant coverage (test setup, not Storybook itself, is a development-standards concern — see [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)).
- **`components/page-builder/`** is intentionally separate from `sections/` — page-builder blocks are thin wrappers that map a Sanity block's shape to the underlying section component's props; see [PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md).
- No `pages/` directory anywhere — App Router only, per the brief's "Next.js (Latest App Router)" requirement.
