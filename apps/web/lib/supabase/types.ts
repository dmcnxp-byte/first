// Row shapes mirroring lib/supabase/schema.sql — DOC/SUPABASE_ARCHITECTURE.md § 1.
export type SourceChannel = "form" | "phone_click" | "whatsapp_click" | "ai_chat";

export type LeadInsert = {
  source_channel: SourceChannel;
  source_page_type?: string;
  source_page_slug?: string;
  source_document_id?: string;
  utm_source?: string;
  utm_campaign?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  interest_raw?: string;
  lead_score: number;
  ai_qualified?: boolean;
};

export type LeadEventInsert = {
  lead_id: string;
  event_type: string;
  points: number;
};

export type AiChatSessionRow = {
  id: string;
  lead_id: string | null;
  page_slug: string | null;
  transcript: Array<{ role: "ai" | "user"; content: string; at: string }>;
  qualification_answers: Record<string, unknown> | null;
  escalated_to_human: boolean;
};
