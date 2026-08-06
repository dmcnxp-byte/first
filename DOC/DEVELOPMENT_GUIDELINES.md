# Coding Standards & Development Guidelines

## 1. Language & type safety

- TypeScript in `strict` mode, no `any` without an inline justification comment; Sanity content types are generated (not hand-maintained) from the schema, per [FRONTEND_ARCHITECTURE.md § 2](FRONTEND_ARCHITECTURE.md#2-data-fetching), so a schema change that removes/renames a field is a compile error at every call site, not a silent runtime `undefined`.
- Path aliases (`@/components/...`, `@/lib/...`) over deep relative imports.

## 2. Component conventions

- One component per file; naming and layering rules per [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) — Server Components by default, `'use client'` only at the leaf that genuinely needs it.
- Props are explicit, named types (`type CompareTableProps = {...}`), never inline-anonymous for anything reused across more than one call site.
- No component fetches data itself outside of the Template layer — this is enforced by convention/review, not a lint rule, but is called out explicitly in PR review checklists.

## 3. Styling

- Tailwind utility classes are the default; a shared `cva()` variant map exists per primitive rather than ad-hoc conditional class strings scattered across call sites.
- No inline `style={{}}` except for genuinely dynamic values that cannot be expressed as a class (e.g. a computed width from CMS data) — the mockups leaned on inline styles in a few spots (e.g. the author byline avatar); the rebuild componentizes those instead.

## 4. Linting & formatting

- ESLint (Next.js recommended config + `eslint-plugin-jsx-a11y` given the accessibility gaps identified in discovery) + Prettier, both run in CI and via a pre-commit hook (lint-staged) so formatting is never a PR review topic.

## 5. Testing strategy

| Layer | Tool | Coverage expectation |
|---|---|---|
| Unit (pure functions) | Vitest/Jest | `lib/leads/scoring.ts`, `lib/seo/schema/*`, redirect-resolution logic, EMI calculation — anything with business rules and no rendering |
| Component | React Testing Library | `LeadForm` (field-list-driven rendering + validation), `FAQAccordion` (schema/render parity), `CompareTable` (mobile collapse) |
| Integration | Playwright (or Next.js's own test runner) | Critical journeys: submit a lead form end-to-end against a test Supabase project; redirect resolution for a sample of legacy URLs; draft-mode preview round-trip |
| Visual/accessibility | axe-core in CI on key page templates | Nav dropdown, mobile drawer, and form label pairing specifically — direct regression protection for the accessibility gaps fixed during this rebuild (§6) |

Not every component needs a test; the bar is "does this carry a business rule or a regression risk the mockups already demonstrated" (e.g. FAQ schema/render drift, non-functional hamburger) — test what would silently break the business, not for coverage-percentage's own sake, consistent with this project's broader preference against unnecessary process.

## 6. Accessibility standards (WCAG 2.1 AA, per NFR-6)

Concrete fixes required (not optional polish), carried from the gaps found in [REQUIREMENTS_ANALYSIS.md § 14](REQUIREMENTS_ANALYSIS.md#14-responsive-behaviour) and [COMPONENT_ARCHITECTURE.md § 5](COMPONENT_ARCHITECTURE.md#5-accessibility-contract-fixes-carried-from-requirements_analysis-gaps):
- Nav dropdowns must be keyboard-operable disclosure widgets with `aria-expanded`, not CSS `:hover`-only.
- The mobile hamburger must open a real, focus-trapped drawer.
- Every form input has a programmatically associated `<label>` (via the shared `Field` primitive — never left to per-page markup).
- Color contrast checked against the navy/saffron/cream palette at each token's actual use (e.g. saffron-on-cream body text would fail contrast — restrict saffron to large text/buttons per the brand guide's own "10% reserved for what should be clicked" rule, which happens to also be the accessible usage pattern).
- All interactive elements have a visible focus state (saffron focus ring, per the mockups' existing focus-glow pattern — kept, just made consistent).

## 7. PR review checklist (abbreviated — full detail lives in the PR template, not duplicated here)

- Does this change touch a Server/Client Component boundary correctly (no unnecessary `'use client'`)?
- If it adds a new page-builder block or content field, is the corresponding Sanity schema change in the same PR (or explicitly linked)?
- If it adds a new lead-form field configuration, does `lib/leads/scoring.ts` need updating?
- Does it maintain the Lighthouse budget gate?
- Does it maintain WCAG AA on any touched interactive component?

## 8. Documentation-as-code

Any architectural decision that deviates from this `/DOC` set during implementation must update the relevant document in the same PR — the documentation is expected to stay a living, accurate reflection of the system, not a one-time Phase 1 artifact that drifts from reality.
