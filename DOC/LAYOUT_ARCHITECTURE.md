# Layout Architecture

How the App Router's nested `layout.tsx`/`template.tsx` model implements the header/footer variants, metadata composition, and chrome shared across page types identified in [REQUIREMENTS_ANALYSIS.md § 6](REQUIREMENTS_ANALYSIS.md#6-navigation-structure).

## 1. Layout hierarchy

```
app/layout.tsx                         (root: <html>, fonts via next/font, ThemeProvider if any, global providers)
├── app/(site)/layout.tsx              (Header variant="full" + Footer variant="full" + MobileActionBar + ChatWidget)
│   ├── page.tsx                       (Homepage)
│   ├── programmes/**                  
│   ├── universities/**
│   ├── specializations/**
│   ├── compare/**
│   ├── resources/**
│   ├── blog/**
│   ├── counsellors/**
│   └── success-stories/**
├── app/(landing)/layout.tsx           (Header variant="minimal" + Footer variant="minimal" + MobileActionBar[variant=lp] + ChatWidget)
│   └── lp/[slug]/page.tsx
└── app/(studio)/layout.tsx            (no marketing chrome at all — Sanity Studio owns its own shell)
    └── studio/[[...tool]]/page.tsx
```

This maps directly to the two header/footer variants confirmed in the mockups (`full` on every standard page, `minimal` on Campaign Landing Pages) — implemented as **two different route-group layouts**, not a single layout with a boolean prop threaded through every page. Route groups keep the decision at the routing level where it belongs, and mean a Campaign LP can never accidentally render the full nav (a real risk if it were a runtime prop).

## 2. Header component variants

| Variant | Used by | Contents |
|---|---|---|
| `full` | `(site)` route group | Logo, Programmes ▾, Universities ▾, Compare, Resources, phone (desktop), "Talk to a counsellor" CTA button, hamburger (mobile) — sticky |
| `minimal` | `(landing)` route group | Logo, phone only — not sticky, no CTA button, no dropdowns, no hamburger (per mockup finding that LPs deliberately minimize distraction) |

Both variants are compositions of the same `Logo` and `PhoneLink` subcomponents, differing only in which optional slots they render — implemented as two named exports (`FullHeader`, `MinimalHeader`) sharing a common `HeaderShell`, not a single component branching on a `variant` string internally (keeps each variant's markup simple and independently testable).

## 3. Footer component variants

| Variant | Contents |
|---|---|
| `full` | 4-column grid: Brand (logo, tagline, CIN/GST/registered office from Site Settings), Programmes links, Universities links, Company links; base bar (copyright, Privacy, Terms) |
| `minimal` | Single centered legal line + copyright + Privacy/Terms links |

Link lists in the `full` footer are **not hardcoded** — they read from Site Settings in Sanity (see [SANITY_CMS_ARCHITECTURE.md](SANITY_CMS_ARCHITECTURE.md); the former separate `navigation` singleton was absorbed into Site Settings) so editors can adjust footer link sets without a deploy.

## 4. Global chrome present in both layouts

- **`MobileActionBar`** — rendered by both `(site)` and `(landing)` layouts, but with a different third-slot action resolved from a small per-route-group config (`chat` on `(site)`, `get-callback` anchor on `(landing)`), matching the confirmed content-level (not just styling) difference between the homepage and landing-page mockups.
- **`ChatWidget`** — same component both places; its opening message is content-driven (per-page-type default copy in Sanity `siteSettings.chatDefaults`, overridable per document), reproducing the mockups' page-aware greeting behaviour without hardcoding strings into the component.

## 5. Metadata composition

Each layout level contributes to the final `<head>` via Next.js metadata merging:
- Root layout sets `metadataBase`, default OG image, `viewport`, `themeColor` (navy).
- Each `page.tsx` calls `generateMetadata()` for document-specific title/description/canonical/OG (see [SEO_STRATEGY.md](SEO_STRATEGY.md)).
- JSON-LD (`Organization`, `WebSite` with `SearchAction`) that is truly site-wide is injected once in the `(site)` layout, not repeated per page; page-type-specific schema (Course, FAQPage, etc.) is injected per page.

## 6. Print stylesheet

A `@media print` rule (confirmed present in every mockup) hides `Header`, `Footer`, `MobileActionBar`, and `ChatWidget` — implemented once as a shared `print:hidden` utility class applied at the layout level to these four components, rather than repeated per page.
