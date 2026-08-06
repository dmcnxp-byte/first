# Forms Architecture

Implements the "Conversion Engine" (content strategy Part 7) and the field-variability finding from the mockup teardown (FR-8, [REQUIREMENTS_ANALYSIS.md § 10](REQUIREMENTS_ANALYSIS.md#10-forms-catalogue)).

## 1. The core problem this solves

Every mockup's lead form has a **different field set and different select options**, driven by page type and even by which specific Specialization/University the page represents. A hardcoded `<LeadForm>` component per page type would duplicate validation/submission logic 7+ times. Instead:

```ts
// The entire content-driven contract — matches leadFormConfig in DATA_MODEL.md
type LeadFormConfig = {
  title: string
  subtitle?: string
  fields: Array<'name' | 'phone' | 'email' | 'city' | 'select'>
  selectLabel?: string          // e.g. "Specialisation", "Target role", "Leaning toward"
  selectOptions?: string[]      // content-authored, not a hardcoded enum
  submitLabel: string
  footerNote?: string
}
```

`<LeadForm config={config} context={{ pageType, documentId, slug }} />` is the **only** lead-form component in the codebase. It renders exactly the fields listed in `config.fields`, in a fixed visual order (name → phone → email → city → select), and posts a payload shaped by whichever fields were actually rendered.

## 2. Field-level validation

| Field | Rule |
|---|---|
| `name` | required if present, 2-80 chars |
| `phone` | required if present, Indian mobile format (`+91` prefix auto-applied per the `Field` primitive in [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md), 10-digit validation) |
| `email` | required if present, standard email format |
| `city` | optional even when present, free text |
| `select` | required if present; validated against `config.selectOptions` server-side too (never trust the client-submitted label alone) |

Validation is a single `zod` schema built dynamically from `config.fields` (both client-side, for inline error messages, and re-validated server-side in the Route Handler — never trust client validation alone).

## 3. Submission flow

```
LeadForm (Client Component)
  onSubmit → POST /api/leads { fields..., context: {pageType, documentId, slug}, channel: 'form' }
       │
       ▼
/api/leads Route Handler
  1. zod-validate against the field set implied by context (re-derives the same config server-side
     from Sanity by documentId, so a tampered client payload can't claim fields it wasn't offered)
  2. lib/leads/scoring.ts computes lead_score from the rubric below
  3. Insert into Supabase `leads` + `lead_events` (see SUPABASE_ARCHITECTURE.md)
  4. lib/leads/crm-webhook.ts forwards to the existing CRM webhook, tagged with channel/source
  5. Respond { success: true } → LeadForm shows a confirmation state (or redirects to /thank-you/ for BOFU forms)
```

No `alert()` stubs, no client-only "demo" submission — every mockup's placeholder `onsubmit` is replaced by this real path.

## 4. Multi-channel capture (FR-7)

Every page renders **at least 3 of these 4** channel affordances, each independently instrumented:

| Channel | Component | Instrumentation |
|---|---|---|
| Form | `LeadForm` | as above |
| Phone | `PhoneLink` (`tel:` anchor) | `onClick` fires a lightweight beacon to `/api/leads` with `channel: 'phone_click'` and no PII fields (score-only event, per the rubric's "phone click +10" — this is an anonymous intent signal, not a full lead record, unless the visitor later also submits a form) |
| WhatsApp | `WhatsAppLink` | Deep link format fixed by the content strategy: `https://wa.me/918669661005?text=I%27m%20interested%20in%20{programme_name}` — `programme_name` is interpolated from the current document's name at render time, never hardcoded per page |
| AI Chat | `ChatWidget` | See [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md) — qualification completion creates a full lead record via the same `/api/leads` contract with `channel: 'ai_chat'` |

## 5. Progressive field count by page type

Directly reproduces the confirmed pattern in [REQUIREMENTS_ANALYSIS.md § 10](REQUIREMENTS_ANALYSIS.md#10-forms-catalogue) — each document type's `leadForm` field defaults:

| Page type | Default fields |
|---|---|
| Campaign LP (cold, paid) | phone (+ optional name) |
| Resource/Pillar (inline mid-article) | phone only |
| Resource/Pillar (full section) | name, phone, select (course), city |
| Programme mode hub | name, phone, select (specialisation) |
| University | name, phone, select (specialisation interest) |
| Specialization | name, phone, select (target role — options specific to that specialization) |
| Compare | name, phone, select ("leaning toward A / B / unsure") |
| BOFU/apply pages | name, phone, email, select (course), city, select (eligibility year) |

These are **editable defaults on the Sanity document**, not hardcoded per route — an editor can add/remove fields per specific page if a campaign needs it, without a code change.

## 6. Lead scoring rubric (content strategy §7.5, implemented in `lib/leads/scoring.ts`)

| Signal | Points |
|---|---|
| BOFU page submit (apply/eligibility) | +30 |
| AI Chat after 5+ exchanges | +25 |
| Compare page submit | +20 |
| University page submit | +15 |
| Campaign LP submit | +10 |
| Blog/resource submit | +5 |
| Valid Indian mobile phone | +10 |
| Email complete | +5 |
| City complete | +5 |
| Mode/interest specified | +10 |
| Time on site > 5 min | +10 |
| Returning visitor | +5 |

Tiers and routing SLA (enforced downstream by the CRM, not by this codebase, but the tier is computed and forwarded so the CRM can act on it): **hot** (50+) → call within 30 min; **warm** (30-49) → within 4 hrs; **cool** (15-29) → within 24 hrs; **cold** (<15) → nurture only.

## 7. Anti-spam / abuse protection

- Route Handler applies basic rate limiting per IP/session (e.g. via Vercel's built-in abuse protection or a lightweight token-bucket check) to prevent form-flooding.
- Honeypot field included in `LeadForm`'s rendered fields but excluded from `config.fields` (invisible to real users, filled only by bots) — submissions with it populated are silently dropped, not stored.
- No CAPTCHA by default (would depress the legitimate 2-4% form conversion rate the business is optimizing for) — revisit only if abuse is observed post-launch.
