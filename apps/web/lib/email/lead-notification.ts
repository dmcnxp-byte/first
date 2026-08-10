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
  pageSlug: string;
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

  const { fields, selectLabel, pageType, pageSlug } = params;
  const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const rows: Array<[string, string]> = [
    ["Name", fields.name],
    ["Phone", fields.phone ? `+91 ${fields.phone}` : undefined],
    ["Email", fields.email],
    ["City", fields.city],
    [selectLabel ?? "Interest", fields.select],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  // e.g. "Homepage" or "University - Nmims" — generic across every page that
  // renders the reusable LeadForm, never assuming which one submitted.
  const sourceLabel =
    pageType === "homepage"
      ? "Homepage"
      : `${titleCase(pageType)} - ${titleCase(pageSlug)}`;
  const subject =
    pageType === "homepage"
      ? "New Homepage Lead Submission"
      : `New Lead Submission — ${sourceLabel}`;

  const text = [
    subject,
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
      <h2 style="margin-bottom:16px;">${escapeHtml(subject)}</h2>
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
      subject,
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

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
