# Future Scalability

What this architecture already accommodates without rework, and what would need a deliberate follow-on phase. None of this is scoped into Phase 1/2 delivery — it exists so today's decisions don't foreclose it.

## 1. Internationalization

The content-strategy source material already references locale codes `en, hi, mr, ta, te, kn, bn, gu, pa` in its schema examples — a clear signal the client anticipates regional-language expansion (Persona C's tier 2/3 city audience in particular). This phase ships **English only**, but:
- Sanity's `@sanity/document-internationalization` plugin is named as a reserved-but-disabled plugin in [SANITY_CMS_ARCHITECTURE.md § 4](SANITY_CMS_ARCHITECTURE.md#4-plugins) — enabling it later is a schema migration, not a rebuild.
- `next/font` subsetting choices should keep Devanagari/other Indic script support in mind when the font strategy is finalized in Phase 2, even though only Latin subsets ship initially.
- The App Router's route-group structure ([FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)) can absorb a `[locale]` segment ahead of `(site)`/`(landing)` without disturbing the page-type routes beneath it.

## 2. Additional MBA modes or adjacent programmes

The `programme` document type ([DATA_MODEL.md](DATA_MODEL.md)) is a generic "mode" entity, not hardcoded to 4 values in the data layer (only the Studio's `list` validation constrains it today) — adding a 5th mode (e.g. if the business later counsels on PGDM independent of the current "B-School" university categorization) is a content addition plus a Studio validation-list update, not an architecture change. The same is true of adding a wholly new programme category (e.g. a future "Distance MCA" vertical) — the Offering join pattern generalizes beyond MBA-specific fields as long as the fee/duration/mode shape holds.

## 3. Multi-brand / multi-site

MagicWorks IT Solutions is the parent company; if it later wants a sibling brand (e.g. an Engineering or Law equivalent of this platform) reusing the same page-type patterns, the current architecture's clean Sanity/Supabase/Next.js separation and the page-builder's block-registry pattern ([PAGE_BUILDER_ARCHITECTURE.md](PAGE_BUILDER_ARCHITECTURE.md)) would port largely as-is into a second Sanity project + Vercel project sharing the same component library as an internal package — not a from-scratch rebuild. This is not designed for today, but nothing here actively prevents it.

## 4. AI assistant backend maturity

The `ChatBackend` interface in [AI_PERSONALIZATION_ARCHITECTURE.md § 2](AI_PERSONALIZATION_ARCHITECTURE.md#2-chat-widget-contract) is the deliberate seam for this: starting with a simple rules-based implementation and later swapping to a real LLM (with retrieval over the Sanity content graph for grounded, citation-safe answers) requires no change to the widget, the lead-scoring integration, or the escalation UX — only a new implementation of one interface.

## 5. Headless commerce / application-fee payments

Not in scope anywhere in the source material, but if the business ever wants to collect application fees or brochure-unlock payments directly (rather than purely lead-gen to a counsellor call), Supabase's existing `leads` table and RLS posture ([SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md)) is a reasonable foundation to extend with a `payments` table behind the same service-role-only access pattern, rather than introducing a second database.

## 6. Personalization depth

The current cookie-based, no-PII personalization layer ([AI_PERSONALIZATION_ARCHITECTURE.md § 5](AI_PERSONALIZATION_ARCHITECTURE.md#5-personalization-layer-content-strategy-63)) is explicitly minimal by the client's own stated preference ("no PII required, no GDPR/DPDPA complications"). If the business later wants authenticated-user personalization (e.g. a saved-shortlist account feature), that is a materially different privacy posture requiring its own consent/data-retention design — flagged here as a future decision point, not a natural extension of the current cookie mechanism.

## 7. Analytics & reporting maturity

The content strategy's measurement framework (weekly/monthly/quarterly KPIs — lead volume, source mix, AI-engine citation traffic, schema validation health) is currently satisfied by direct Supabase queries plus standard web-analytics tooling. A dedicated internal reporting dashboard (e.g. a counsellor-facing lead queue, or a marketing-facing funnel dashboard) is a natural Phase 3+ addition on top of the existing `leads`/`lead_events` schema, requiring its own authenticated Supabase role (see the note in [SUPABASE_ARCHITECTURE.md § 2](SUPABASE_ARCHITECTURE.md#2-row-level-security)) rather than a schema change.

## 8. What is deliberately *not* future-proofed

Per this project's stated engineering principle against speculative abstraction: the architecture does not pre-build multi-tenancy, a plugin marketplace, a generic CMS-agnostic data layer, or a payments system today. Each of the extension points above is documented as a **seam that exists because it was the right shape for Phase 1's actual requirements anyway** (e.g. the `ChatBackend` interface exists because no vendor is chosen yet, not because we're speculatively over-engineering) — not as infrastructure built ahead of demonstrated need.
