# AI Counsellor Assistant & Personalization Architecture

Covers the "Aarya" AI counsellor widget, the three smart tools, and the client-side personalization layer (content strategy Part 6). Per assumption 2 in [REQUIREMENTS_ANALYSIS.md § 16](REQUIREMENTS_ANALYSIS.md#16-assumptions), this document defines **integration seams**, not a specific LLM vendor/model — vendor selection is a Phase 2+ decision made against this contract.

## 1. Why a seam, not a build, in this phase

The mockups' chat logic is explicitly a hardcoded keyword-matcher, commented in the source as a placeholder. There is no existing backend to reverse-engineer, and no vendor has been chosen. What the architecture must guarantee is that **whichever backend is chosen later plugs into the same contract** without changing the front-end widget, the lead-scoring integration, or the human-escalation path.

## 2. Chat widget contract

```
Browser <ChatWidget/>
   │  POST /api/chat  { sessionId, message, pageContext: {pageType, documentId, slug} }
   ▼
Route Handler /api/chat
   │  1. Load or create an ai_chat_sessions row (Supabase) for sessionId
   │  2. Build the model request: system prompt (Aarya persona, honesty rules) +
   │     pageContext (so replies can reference the actual university/programme being viewed) +
   │     transcript so far
   │  3. Call the configured backend (interface below) — swappable without touching this route's contract
   │  4. Append the exchange to transcript (jsonb), persist
   │  5. If the qualification flow (see §3) has completed this turn, create/update the linked `leads` row
   │     via the same lib/leads/scoring.ts used by LeadForm (FORMS_ARCHITECTURE.md) — chat-derived leads
   │     are scored identically to form-derived leads, not a parallel scoring path
   │  6. Return { reply, quickReplies?, shouldOfferHumanHandoff }
```

```ts
// lib/ai/backend.ts — the swap point
interface ChatBackend {
  reply(input: {
    systemPrompt: string
    pageContext: PageContext
    transcript: ChatMessage[]
    userMessage: string
  }): Promise<{ reply: string; quickReplies?: string[] }>
}
```

Phase 1/2 can ship this interface backed by a simple rules-based implementation (an evolved, honestly-labeled version of the mockup's keyword logic) if a real LLM integration isn't ready at launch — the widget, scoring, and escalation code paths do not change when a real LLM implementation replaces it later.

## 3. Conversational design rules (content strategy §6.1 — encoded as product requirements, not just copy)

- Aarya is always visually distinct from human counsellors and never claims to be human — enforced by a fixed `senderType: 'ai'` badge in the message-bubble component, not left to prompt-following alone.
- Page-aware opener: the widget's first message is chosen from `siteSettings.chatDefaults.openingMessagesByPageType[pageType]` (or a document-level override) — reproduces the confirmed mockup behaviour (different opener on homepage vs. landing page vs. specialization page) as content, not hardcoded strings.
- The 5 fixed qualification questions from content strategy §6.1 are asked in order once a conversation reaches the qualification stage; answers populate `ai_chat_sessions.qualification_answers` (jsonb) and drive the lead-scoring "AI Chat after 5+ exchanges (+25)" rule.
- After 3-5 exchanges, or whenever the backend signals `shouldOfferHumanHandoff`, the widget renders a persistent "Talk to a human counsellor" quick-reply that posts through the same lead-submission path with `channel: 'ai_chat'`.
- If the backend has low confidence in an answer (a property the `ChatBackend` interface should surface, e.g. a `confidence` score or an explicit "I'm not sure" detection), the widget escalates rather than guessing — never let the assistant assert an unverified accreditation/fee claim (this is a brand-integrity requirement, not just a UX nicety, given BR-9's honesty positioning).

## 4. Smart tools

| Tool | Location | Mechanics |
|---|---|---|
| Fee & EMI Calculator | `/resources/fee-emi-calculator/` (standalone) + inline `EMICalcWidget` embed in pillar articles | Pure client-side computation (university/programme/specialization → fee lookup via a small Sanity query, EMI = fee ÷ tenure across 3 illustrative lenders); result screen carries a soft-CTA into `LeadForm` |
| Eligibility Checker | `/resources/eligibility-checker/` | 6-question client form → `/api/chat` or a dedicated `/api/eligibility` rules endpoint (simple deterministic rules over Offering data, not necessarily an LLM call) → ranked 3-5 qualifying universities; captures phone number to deliver the shortlist via WhatsApp deep-link |
| Programme Matcher | embedded as a `ChatWidget` conversation mode (6-8 turns) | Reuses the chat contract above with a distinct system prompt/flow, not a separate widget |

## 5. Personalization layer (content strategy §6.3)

**Explicit constraint carried into this architecture verbatim: no PII, no server-side profile — cookie + rules engine only.**

```
Edge Middleware
  on each request:
    read/update cookie `dmc_ctx` = { utmSource?, utmCampaign?, lastViewedType?, lastViewedSlug?, viewCount: {[slug]: n} }
    (small, non-PII, ~few hundred bytes, httpOnly, 30-day expiry)
```

| Signal | Effect |
|---|---|
| UTM source/campaign on landing | Server Components read `dmc_ctx.utmSource` to bias which Programme mode is emphasized in shared sections (e.g. an Executive-MBA-ad visitor sees Executive-MBA-prioritized featured universities on a generic page) |
| Session page-view history | If `dmc_ctx` shows 2+ views of the same university, cross-page components (e.g. homepage's featured grid, another university's "compare with" teaser) can bias toward that university first |
| Returning visitor | If `dmc_ctx.lastViewedSlug` exists on a fresh session, render a small "Welcome back — continue exploring {name}" callout instead of the generic hero secondary CTA |

All of this is read server-side before render (no client-side personalization flash), and none of it is ever joined with the Supabase `leads` table — the two systems are intentionally disconnected at the storage layer (see [SUPABASE_ARCHITECTURE.md § 4](SUPABASE_ARCHITECTURE.md#4-data-retention--privacy)) so personalization can never become a PII-linkage risk.

## 6. CRM tagging (content strategy §6.4)

Every lead created via the AI chat path carries `source_channel = 'ai_chat'` and `ai_qualified = true` in Supabase (see schema in [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md)), and the CRM webhook payload includes the full `qualification_answers` and transcript reference so, per the content strategy's stated goal, "the call starts at a much higher information state."
