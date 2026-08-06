# Supabase Architecture

Supabase's scope on this project is deliberately narrow: **form submissions and the transactional data that surrounds them.** It never stores editorial/marketing content — that is Sanity's exclusive domain (ADR-1 in [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)).

## 1. Schema

```sql
-- Core lead record — one row per form/phone-click/whatsapp-click/ai-chat conversion event
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_channel text not null check (source_channel in ('form','phone_click','whatsapp_click','ai_chat')),
  source_page_type text,              -- 'university' | 'programme' | 'specialization' | 'compare' | 'landing_page' | 'resource' | 'homepage' ...
  source_page_slug text,
  source_document_id text,            -- Sanity document _id, for cross-referencing which entity generated the lead
  utm_source text,
  utm_campaign text,
  name text,
  phone text,
  email text,
  city text,
  interest_raw text,                  -- the raw select value (course/specialisation/mode/target-role — meaning varies by page type per FORMS_ARCHITECTURE.md)
  lead_score int not null default 0,
  lead_tier text generated always as (
    case
      when lead_score >= 50 then 'hot'
      when lead_score >= 30 then 'warm'
      when lead_score >= 15 then 'cool'
      else 'cold'
    end
  ) stored,
  ai_qualified boolean not null default false,
  crm_forwarded_at timestamptz,
  crm_forward_error text
);

-- Append-only scoring/attribution events, so lead_score is auditable, not just a final number
create table lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  event_type text not null,           -- e.g. 'bofu_submit', 'ai_chat_5_exchanges', 'compare_submit', 'valid_phone', 'returning_visitor'
  points int not null
);

-- AI counsellor conversation transcripts, linkable to a lead once qualification completes
create table ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references leads(id) on delete set null,
  page_slug text,
  transcript jsonb not null default '[]',   -- array of {role, content, at}
  qualification_answers jsonb,               -- the 5 structured Q&A from content strategy §6.1
  escalated_to_human boolean not null default false
);

-- Operational log of redirect hits, useful for validating the legacy-URL migration post-launch
create table redirect_hits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  from_path text not null,
  to_path text not null
);
```

## 2. Row Level Security

- RLS is **enabled on every table**.
- **No anonymous or authenticated client role has any policy granting direct access.** All reads/writes happen through Next.js Route Handlers using the **service-role key**, which is never sent to the browser (server-only environment variable, per [DEPLOYMENT_STRATEGY.md](DEPLOYMENT_STRATEGY.md)).
- This is a deliberate stricter-than-default posture: Supabase's client-side SDK is not used from the browser at all in this architecture. The browser only ever talks to `/api/leads` and `/api/chat` on the same origin; Supabase is an implementation detail behind those routes, not a service the client calls directly. This removes an entire class of RLS-policy-misconfiguration risk for lead PII.
- If a future internal admin dashboard needs read access (e.g., a counsellor-facing lead queue), it gets its own authenticated Supabase role with a narrowly scoped RLS policy at that time — not part of this phase's scope.

## 3. Write path

```
Browser (LeadForm submit) → POST /api/leads (Route Handler)
  1. Validate payload (zod schema matching the page's leadFormConfig field list)
  2. Compute lead_score via lib/leads/scoring.ts (rubric in FORMS_ARCHITECTURE.md)
  3. Insert into `leads` (service-role client, server-only)
  4. Insert corresponding `lead_events` rows
  5. Fire outbound CRM webhook (lib/leads/crm-webhook.ts), update crm_forwarded_at / crm_forward_error
  6. Return { success, leadTier } to the browser (no PII echoed back beyond what the form already has)
```

The AI chat path (`/api/chat`) writes/updates one `ai_chat_sessions` row per conversation, and on qualification completion creates/links a `leads` row exactly as a form submission would (`source_channel = 'ai_chat'`), so lead scoring and CRM forwarding logic is **shared code**, not duplicated per channel.

## 4. Data retention & privacy

- No PII (name/phone/email) is ever written client-side to cookies or `localStorage` — it exists only in the request body en route to `/api/leads` and then in Supabase. This directly supports the personalization layer's "no PII required, no DPDPA complications" design goal (content strategy §6.3) by keeping PII entirely out of the client-side personalization mechanism described in [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md) — the two systems never share a storage layer.
- A retention policy (e.g., anonymize or purge `leads`/`ai_chat_sessions` after N months once forwarded to the CRM) is a business/legal decision for the client to set, not an architectural default asserted here — flagged as an open item in [PROJECT_STATUS.md](PROJECT_STATUS.md).

## 5. Why Supabase (not just POST-to-CRM directly)

Writing to Supabase first, then forwarding, rather than calling the CRM webhook directly from the Route Handler with no persistence:
- Guarantees no lead is lost if the CRM webhook is briefly down (`crm_forward_error` + a retry job/cron can re-drive `crm_forwarded_at is null` rows).
- Gives the business its own queryable lead history independent of the CRM, satisfying the measurement framework in the content strategy (§9.6 — lead volume, source mix, tier distribution) without needing CRM API access for internal reporting.
