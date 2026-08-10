import "server-only";

// Generic outbound CRM webhook — DOC/SUPABASE_ARCHITECTURE.md § 3/5.
// The concrete CRM identity/endpoint is an open item (DOC/PROJECT_STATUS.md
// open item #5 / MI-5) — deployment supplies `CRM_WEBHOOK_URL` when known.
// Until then this no-ops (logged, not thrown) so lead capture never fails
// because the downstream CRM isn't configured yet.
export async function forwardLeadToCrm(
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) {
    console.warn(
      "[crm-webhook] CRM_WEBHOOK_URL not configured — lead persisted to Supabase only.",
    );
    return { ok: false, error: "CRM_WEBHOOK_URL not configured" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, error: `CRM webhook responded ${res.status}` };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown CRM webhook error",
    };
  }
}
