# Component Architecture

An atomic-design layering over the reusable patterns identified in [REQUIREMENTS_ANALYSIS.md § 7-9](REQUIREMENTS_ANALYSIS.md#7-reusable-layouts--ui-patterns). Folder mapping in [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md).

## 1. Layers

```
Primitives (ui/)  →  Composed patterns (sections/)  →  Layout shells (layout/)  →  Templates (app/**/page.tsx)  →  Page-builder blocks (page-builder/)
```

| Layer | Responsibility | Examples |
|---|---|---|
| **Primitives** | Unstyled-logic-free, brand-token-styled base elements. No content awareness. | `Button`, `Badge`, `Input`, `Select`, `Field`, `Container`, `Grid` |
| **Composed patterns** | One reusable content pattern; owns its own layout/responsive behaviour; takes typed props, never fetches data itself | `Hero`, `TrustStrip`, `SectionHead`, `Card` family, `CompareTable`, `WhoFitsCards`, `FactsStrip`, `CounsellorNote`, `FAQAccordion`, `LeadFormCard`, `StepsList`, `CalloutBox`, `TOC`, `EMICalcWidget` |
| **Layout shells** | Site-chrome components composed once per route group | `Header` (full/minimal), `Footer` (full/minimal), `MobileActionBar`, `ChatWidget` |
| **Templates** | Route-level Server Components: fetch data, map document fields to composed-pattern props, in a fixed, type-guaranteed order per document type | `app/(site)/universities/[slug]/page.tsx`, etc. |
| **Page-builder blocks** | Thin adapters between an arbitrary, editor-ordered array of Sanity blocks and the composed-pattern components | `components/page-builder/*` — see [PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md) |

**Key rule:** composed patterns and layout shells are **presentation-only** — they receive fully-resolved props and never import a Sanity client. Only Templates and page-builder resolvers touch data. This is what makes every pattern in the catalogue genuinely reusable across the entity-page templates *and* the page builder without duplication.

## 2. Primitive component contracts

| Component | Variant props | Notes |
|---|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'ghost'`, `size: 'sm' \| 'md' \| 'lg'`, `block?: boolean`, `withArrow?: boolean`, `as: 'button' \| 'a'` | Enforces "never two primary/saffron buttons visible in one view" at the section level via composition convention, not a runtime guard — documented in [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) |
| `Badge` | `tone: 'accreditation' \| 'success' \| 'neutral'` | Text-only pill; no logo-image slot — matches mockup finding that no image-based badges exist today |
| `Card` | `variant: 'university' \| 'mode' \| 'specialization'` | Backing shape: `{title, meta: {label, value}[], bestFor?, badge?, href?}` — one shape, three presentational skins |
| `Field` / `Select` / `Input` | standard, plus `phonePrefix?: string` | Reproduces the mockups' `+91`-prefixed phone field pattern as a real, accessible affix, not a CSS `::before` |

## 3. Composed pattern contracts (selected)

**`CompareTable`** (`components/sections/CompareTable.tsx`, page-builder block `compareTableBlock` — **built**) — the single most reused component (mode-comparison, fee tables, university-listing tables, head-to-head Compare pages):
```ts
type CompareTableProps = {
  columns: string[]                       // e.g. ["Attribute", "NMIMS", "Symbiosis"]
  rows: { label: string; values: string[] }[]
}
```
Renders as a semantic `<table>` (not a CSS-grid div-table as in the mockups) with `scope` attributes for accessibility, and a CSS-only stacked-card view below the `tc` (660px) breakpoint — implemented as two parallel renders toggled by Tailwind's responsive display utilities (`hidden tc:block` / `tc:hidden`), not `data-label`/`content: attr()` tricks.

**`StepsList`** (`components/sections/StepsList.tsx`, page-builder block `stepsBlock`, Studio title "Timeline / Steps" — **built**) — numbered process, shared between eligibility criteria, how-to-apply, and any other step-by-step content:
```ts
type StepsListProps = {
  steps: { title: string; description?: string }[]   // number comes from array position, not a stored field
}
```

**`FAQAccordion`** — takes `items: {question, answer}[]` and **also** returns/exposes the same array for `generateFAQSchema()` to consume in `lib/seo/schema/faq.ts`, closing the drift gap flagged in requirements (mockups had 6 schema items vs. 8 rendered items).

**`WhoFitsCards`** — `{ suits: {heading, bullets: string[]}, lookElsewhere: {heading, bullets: string[]} }`; bullets support inline `<Link>` cross-references to other Programme/University/Specialization documents (mockups reference competitors by name in plain text — rebuild makes these real internal links, improving the internal-linking-density SEO requirement in [SEO_STRATEGY.md](SEO_STRATEGY.md)).

**`LeadFormCard`** — the field-list-driven contract detailed in [FORMS_ARCHITECTURE.md](FORMS_ARCHITECTURE.md); never hardcodes a field shape.

**`EMICalcWidget`** — Client Component; pure client-side computation (no network round-trip needed for the calculation itself), but final "email me this" or "get shortlist via WhatsApp" action reuses the shared lead-submission contract.

**`ImageContent`** (`components/sections/ImageContent.tsx`, page-builder block `imageContentBlock` — **built**) — image + text split section for low-structure marketing pages (About, Landing): `{image, alt, imagePosition: 'left'|'right', eyebrow?, heading, headingAccent?, body?, cta?}`.

**`Divider`** (`components/sections/Divider.tsx`, page-builder block `dividerBlock` — **built**) — pure visual spacer/rule between page-builder sections, no content fields: `{style?: 'line'|'space'}`.

## 4. Naming & file conventions

- One component per file, PascalCase filename matching the export (`CompareTable.tsx`), colocated `*.test.tsx` and (if used) `*.stories.tsx`.
- Variant styling via a single `cva()` (class-variance-authority) definition per primitive, exported alongside the component for reuse in composed patterns that need to match a primitive's visual variant without re-wrapping it.
- No component reaches into global state or calls `fetch`/Sanity client directly (see layering rule above) — data always arrives via props from a Template or a page-builder resolver.

## 5. Accessibility contract (fixes carried from REQUIREMENTS_ANALYSIS gaps)

| Mockup gap | Rebuild requirement |
|---|---|
| Hover-only nav dropdowns | `Header`'s dropdown is a real disclosure widget: click/Enter to open, `aria-expanded`, `Escape` to close, focus-trapped, touch-friendly |
| Non-functional hamburger | `MobileNavDrawer` Client Component with real open/close state, focus management, `aria-controls` |
| TOC vanishes on mobile with no replacement | `TOC` renders as a collapsible "Jump to section" disclosure on mobile instead of disappearing |
| Form `id`/`label` inconsistency (present in one mockup, absent in another) | `Field` primitive always generates a matched `id`/`htmlFor` pair programmatically — never left to the calling page |
| No visible breadcrumb UI despite `BreadcrumbList` schema existing | A real, visible `Breadcrumbs` component renders wherever the schema is emitted, keeping visible content and structured data in sync |

## 6. Responsive contract

All composed patterns implement the confirmed breakpoint set (960 / 880 / 660 / 600 / 500px, see [REQUIREMENTS_ANALYSIS.md § 14](REQUIREMENTS_ANALYSIS.md#14-responsive-behaviour)) via Tailwind's responsive utility variants mapped 1:1 to those breakpoints in `tailwind.config.ts`, rather than each component inventing its own breakpoint values.
