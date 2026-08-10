import "server-only";
import { Resend } from "resend";
import type { LeadFormPayload } from "@/lib/leads/validation";

// Internal lead notification only — never sent to the visitor. The caller
// must only invoke this after the Supabase insert has already succeeded;
// failure here is logged and swallowed, never allowed to lose the lead or
// surface a provider error to the visitor.
export async function sendLeadNotificationEmail(params: {
  leadId: string;
  fields: LeadFormPayload;
  selectLabel?: string;
  pageType: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.warn(
      "[lead-notification] RESEND_API_KEY, LEAD_NOTIFICATION_EMAIL, or LEAD_EMAIL_FROM not configured — skipping internal notification.",
    );
    return { ok: false, error: "Email notification not configured" };
  }

  const { fields, selectLabel, pageType } = params;
  const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const rows: Array<[string, string]> = [
    ["Name", fields.name],
    ["Phone", fields.phone ? `+91 ${fields.phone}` : undefined],
    ["Email", fields.email],
    ["City", fields.city],
    [selectLabel ?? "Interest", fields.select],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  const sourceLabel = pageType.charAt(0).toUpperCase() + pageType.slice(1);

  const text = [
    "New Homepage Lead Submission",
    "",
    "Lead Details",
    "--------------------------------",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Source: ${sourceLabel}`,
    `Submitted: ${submittedAt}`,
    "--------------------------------",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;color:#0b1f4d;">
      <h2 style="margin-bottom:16px;">New Homepage Lead Submission</h2>
      <table cellpadding="0" cellspacing="0">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#5b6472;">${escapeHtml(label)}</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin-top:16px;color:#5b6472;font-size:13px;">
        Source: ${escapeHtml(sourceLabel)}<br />
        Submitted: ${submittedAt}
      </p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: "New Homepage Lead Submission",
      html,
      text,
    });
    if (error) {
      console.error(
        `[lead-notification] Resend rejected the email for lead ${params.leadId}:`,
        error,
      );
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    console.error(`[lead-notification] send failed for lead ${params.leadId}:`, error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
