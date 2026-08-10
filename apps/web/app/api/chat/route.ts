import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import { rulesBasedBackend, type ChatMessage } from "@/lib/ai/backend";
import { scoreLead } from "@/lib/leads/scoring";
import type { AiChatSessionRow, LeadEventInsert, LeadInsert } from "@/lib/supabase/types";

// POST /api/chat — DOC/AI_PERSONALIZATION_ARCHITECTURE.md § 2. Loads/creates
// the session, calls the swappable ChatBackend, persists the transcript, and
// — once the conversation is deep enough to count as "AI Chat after 5+
// exchanges" per the scoring rubric — creates the linked lead exactly once,
// through the same lib/leads/scoring.ts a form submission uses.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: "Sorry, something went wrong." }, { status: 400 });
  }

  const { sessionId, message, pageSlug } = body as {
    sessionId?: string;
    message?: string;
    pageSlug?: string;
  };
  if (!sessionId || !message) {
    return NextResponse.json({ reply: "Missing session or message." }, { status: 400 });
  }

  // Best-effort read of prior turns — a visitor still gets a reply even if
  // Supabase isn't reachable (e.g. no real project connected yet, see
  // PROJECT_STATUS.md open items); the conversation just won't have memory
  // of earlier turns for that one request.
  let existing: AiChatSessionRow | null = null;
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("ai_chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle<AiChatSessionRow>();
    existing = data;
  } catch (error) {
    console.error("[/api/chat] session lookup failed:", error);
  }

  const transcript: ChatMessage[] = (existing?.transcript ?? []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const backendResult = await rulesBasedBackend.reply({
    pageContext: { pageType: "homepage", slug: pageSlug },
    transcript,
    userMessage: message,
  });

  try {
    const supabase = createServiceRoleClient();

    const now = new Date().toISOString();
    const updatedTranscript = [
      ...(existing?.transcript ?? []),
      { role: "user" as const, content: message, at: now },
      { role: "ai" as const, content: backendResult.reply, at: now },
    ];

    const exchangeCount = updatedTranscript.filter((m) => m.role === "user").length;
    const alreadyQualified = Boolean(existing?.lead_id);
    let leadId = existing?.lead_id ?? null;

    // Create the linked lead exactly once, on the turn that crosses the
    // 5-exchange threshold — DOC/FORMS_ARCHITECTURE.md § 6 "AI Chat after 5+ exchanges (+25)".
    if (!alreadyQualified && exchangeCount >= 5) {
      const { totalScore, events } = scoreLead({
        sourcePageType: "homepage",
        aiChatExchangeCount: exchangeCount,
      });
      const leadInsert: LeadInsert = {
        source_channel: "ai_chat",
        source_page_type: "homepage",
        source_page_slug: pageSlug ?? "/",
        lead_score: totalScore,
        ai_qualified: true,
      };
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .insert(leadInsert)
        .select("id")
        .single();
      if (!leadError && lead) {
        leadId = lead.id;
        if (events.length > 0) {
          const eventRows: LeadEventInsert[] = events.map((e) => ({
            lead_id: lead.id,
            event_type: e.eventType,
            points: e.points,
          }));
          await supabase.from("lead_events").insert(eventRows);
        }
      }
    }

    await supabase.from("ai_chat_sessions").upsert({
      id: sessionId,
      lead_id: leadId,
      page_slug: pageSlug ?? "/",
      transcript: updatedTranscript,
      escalated_to_human: backendResult.shouldOfferHumanHandoff,
    });
  } catch (error) {
    console.error("[/api/chat] session persistence failed:", error);
  }

  return NextResponse.json({
    reply: backendResult.reply,
    quickReplies: backendResult.quickReplies,
    shouldOfferHumanHandoff: backendResult.shouldOfferHumanHandoff,
  });
}
