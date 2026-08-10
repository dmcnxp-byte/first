import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homepageLeadFormConfigQuery } from "@/lib/sanity/queries/leadFormConfig";
import { validateLeadFormPayload, type LeadFormPayload } from "@/lib/leads/validation";
import { scoreLead, type SourcePageType } from "@/lib/leads/scoring";
import { forwardLeadToCrm } from "@/lib/leads/crm-webhook";
import type { LeadFormConfig, LeadFormFieldName } from "@/lib/sanity/types/shared";
import type { LeadEventInsert, LeadInsert } from "@/lib/supabase/types";

// POST /api/leads — DOC/FORMS_ARCHITECTURE.md § 3, DOC/SUPABASE_ARCHITECTURE.md § 3.
// Handles both full form submissions (channel: 'form') and anonymous
// click-to-call/WhatsApp beacons (channel: 'phone_click' | 'whatsapp_click'),
// which share the same scoring + persistence + CRM-forwarding path.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { channel, fields, context, honeypot } = body as {
    channel?: string;
    fields?: LeadFormPayload;
    context?: { pageType?: string; documentId?: string; slug?: string };
    honeypot?: string;
  };

  // Silent honeypot drop — DOC/FORMS_ARCHITECTURE.md § 7: invisible to real
  // users, filled only by bots; submissions with it populated are dropped,
  // not stored, and the client still sees a normal success response.
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  const pageType = (context?.pageType ?? "homepage") as SourcePageType;
  const sourceDocumentId = context?.documentId;
  const sourcePageSlug = context?.slug ?? "/";

  let leadPayload: LeadFormPayload = {};
  let selectLabel: string | undefined;

  if (channel === "form") {
    const config = await sanityFetch<LeadFormConfig>({
      query: homepageLeadFormConfigQuery,
      tags: ["sanity:page"],
    });

    const allowedFields: LeadFormFieldName[] = config?.fields ?? [
      "name",
      "phone",
      "select",
      "city",
    ];
    const selectOptions = config?.selectOptions;
    selectLabel = config?.selectLabel;

    const validation = validateLeadFormPayload(
      allowedFields,
      fields ?? {},
      selectOptions,
    );
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 422 },
      );
    }

    // Only persist fields the re-derived config actually allows — a
    // tampered client payload can't smuggle extra fields through.
    leadPayload = {
      name: allowedFields.includes("name") ? fields?.name : undefined,
      phone: allowedFields.includes("phone") ? fields?.phone : undefined,
      email: allowedFields.includes("email") ? fields?.email : undefined,
      city: allowedFields.includes("city") ? fields?.city : undefined,
      select: allowedFields.includes("select") ? fields?.select : undefined,
    };
  } else if (channel !== "phone_click" && channel !== "whatsapp_click") {
    return NextResponse.json(
      { success: false, error: "Unknown channel." },
      { status: 400 },
    );
  }

  const { totalScore, events } = scoreLead({
    sourcePageType: pageType,
    phone: leadPayload.phone,
    email: leadPayload.email,
    city: leadPayload.city,
    interestRaw: leadPayload.select,
  });

  const leadInsert: LeadInsert = {
    source_channel: (channel as LeadInsert["source_channel"]) ?? "form",
    source_page_type: pageType,
    source_page_slug: sourcePageSlug,
    source_document_id: sourceDocumentId,
    name: leadPayload.name,
    phone: leadPayload.phone,
    email: leadPayload.email,
    city: leadPayload.city,
    interest_raw: leadPayload.select,
    lead_score: totalScore,
  };

  try {
    const supabase = createServiceRoleClient();

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert(leadInsert)
      .select("id")
      .single();
    if (leadError || !lead) throw leadError ?? new Error("Insert returned no row");

    if (events.length > 0) {
      const eventRows: LeadEventInsert[] = events.map((event) => ({
        lead_id: lead.id,
        event_type: event.eventType,
        points: event.points,
      }));
      await supabase.from("lead_events").insert(eventRows);
    }

    if (channel === "form") {
      const crmResult = await forwardLeadToCrm({
        leadId: lead.id,
        channel,
        pageType,
        fields: leadPayload,
        selectLabel,
        leadScore: totalScore,
      });
      await supabase
        .from("leads")
        .update(
          crmResult.ok
            ? { crm_forwarded_at: new Date().toISOString() }
            : { crm_forward_error: crmResult.error },
        )
        .eq("id", lead.id);
    }

    const leadTier =
      totalScore >= 50
        ? "hot"
        : totalScore >= 30
          ? "warm"
          : totalScore >= 15
            ? "cool"
            : "cold";
    return NextResponse.json({ success: true, leadTier });
  } catch (error) {
    console.error("[/api/leads] persistence failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't save your details right now — please try again shortly.",
      },
      { status: 502 },
    );
  }
}
