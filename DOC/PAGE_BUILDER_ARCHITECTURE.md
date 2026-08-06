# Dynamic Page Builder Architecture

Satisfies "fully dynamic homepage from day one" and "Dynamic Landing Pages." Builds on the layering rule in [COMPONENT_ARCHITECTURE.md § 1](COMPONENT_ARCHITECTURE.md#1-layers): page-builder blocks are thin adapters, never the components themselves.

## 1. Scope: where the page builder applies

| Document type | Uses page builder? | Why |
|---|---|---|
| Homepage | **Yes** | Explicit requirement; also the page most likely to be restructured by marketing without a deploy |
| Campaign Landing Page | **Yes** | Each ad campaign needs a different section order/emphasis; editors iterate fast on these |
| Resources hub / About / How-It-Works | **Yes** | Low-structure marketing pages benefit from flexibility |
| University / Programme / Specialization / Compare | **No — fixed template** | Per ADR-3 in [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md), these need guaranteed structure for AEO/schema extraction and cross-page comparability; a fixed template with optional-but-ordered fields (not a freeform block array) is the correct model |
| Blog Post / Resource Article | **No — Portable Text body** | Long-form content is authored as rich text with embedded custom blocks (callout, data-table, uni-card-grid, steps-list, EMI-calc — see [SANITY_CMS_ARCHITECTURE.md](SANITY_CMS_ARCHITECTURE.md)), which is a *content* flexibility model, not a page-*structure* flexibility model — the section order (hero → TOC+body → FAQ → footer) stays fixed |

## 2. Content model: `pageBuilder` field

Any document type that opts in gets a single field:

```ts
defineField({
  name: 'pageBuilder',
  title: 'Page sections',
  type: 'array',
  of: [
    { type: 'heroBlock' },
    { type: 'trustStripBlock' },
    { type: 'modeStripBlock' },
    { type: 'featuredUniversitiesBlock' },
    { type: 'specializationsGridBlock' },
    { type: 'pullQuoteBlock' },
    { type: 'counsellorMomentBlock' },
    { type: 'aiChatInviteBlock' },
    { type: 'comparisonPreviewBlock' },
    { type: 'leadFormBlock' },
    { type: 'faqBlock' },
    { type: 'richTextBlock' },       // escape hatch for ad-hoc marketing copy
  ],
})
```

Each block type is a Sanity object schema whose fields are exactly the content a corresponding composed pattern needs (e.g. `heroBlock` → `{eyebrow, heading, subhead, primaryCta, secondaryCta}` maps 1:1 to `<Hero>`'s props). This is deliberately **not** a generic "flexible content" free-for-all — the block list is a closed, curated set (NFR-11, editorial safety), matching exactly the section catalogue already validated against the mockups in [REQUIREMENTS_ANALYSIS.md § 9](REQUIREMENTS_ANALYSIS.md#9-sections-catalogue-by-page-type).

## 3. Render-time resolution

```
Sanity pageBuilder array  →  SectionRenderer (Server Component)  →  switch on block._type  →  matching adapter in components/page-builder/  →  underlying composed pattern
```

```tsx
// components/page-builder/SectionRenderer.tsx
export function SectionRenderer({ blocks }: { blocks: PageBuilderBlock[] }) {
  return blocks.map((block) => {
    const Adapter = blockRegistry[block._type]
    if (!Adapter) return null // unknown block type: fail soft, never crash the page
    return <Adapter key={block._key} {...block} />
  })
}
```

`blockRegistry` is a single typed lookup table (`components/page-builder/registry.ts`) mapping each Sanity block `_type` string to its adapter component — adding a new page-builder block is: (1) add a Sanity object schema, (2) add one adapter, (3) register it. No template file needs to change.

## 4. Editorial constraints (NFR-11)

- Sanity Studio's array editor for `pageBuilder` uses the `insert menu` restricted to the block list above — editors cannot add a raw HTML block or an unregistered component.
- Certain blocks can be marked `single: true` at the schema-validation level in Studio custom validation (e.g., discourage more than one `leadFormBlock` per page) without hard-blocking unusual-but-legitimate cases — a soft warning, not a hard constraint, since campaign LPs may legitimately want two lead forms (top + bottom).
- A `pageBuilder` array on the Homepage document ships with a **sensible default preset** (the exact section order from `homepage.html`) pre-populated when the singleton is first created, so the dynamic system's default output matches the approved design without an editor having to assemble it from scratch.

## 5. Campaign Landing Page specifics

Landing Pages reuse the identical `pageBuilder` mechanism but draw from a **narrower** block allow-list appropriate to a single-goal conversion page (`heroBlock` with embedded form, `featuredUniversitiesBlock` non-linking variant, `counsellorMomentBlock`, `faqBlock`) — enforced by giving `landingPage.pageBuilder` its own `of` array in the schema rather than reusing the homepage's, even though the underlying block schemas and adapters are shared.

## 6. Preview & draft mode

Editors preview an in-progress `pageBuilder` arrangement via Next.js Draft Mode: Studio's "Open preview" action sets a draft cookie, the Next.js route then fetches with the preview (unfiltered, includes drafts) API and renders the exact same `SectionRenderer` path — there is no separate "preview renderer," which guarantees preview-vs-published parity.
