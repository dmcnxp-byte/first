-- Reference copy of the approved Supabase schema — see DOC/SUPABASE_ARCHITECTURE.md § 1.
--
-- NOT YET APPLIED to any Supabase project. This file is checked in purely as
-- a source-controlled reference; running these migrations against a real
-- Supabase project (and enabling RLS per § 2) is Phase 3 work, done once lead
-- forms/API routes/business logic are actually being implemented.

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

-- Row Level Security: enabled on every table above, with NO policies granting
-- anonymous/authenticated client access — all reads/writes go through Next.js
-- Route Handlers using the service-role key. See DOC/SUPABASE_ARCHITECTURE.md § 2.
-- alter table leads enable row level security;
-- alter table lead_events enable row level security;
-- alter table ai_chat_sessions enable row level security;
-- alter table redirect_hits enable row level security;
