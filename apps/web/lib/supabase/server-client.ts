import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client — server-only, never imported by a Client Component.
// The `server-only` import above makes that a build-time error, not just a
// convention. See DOC/SUPABASE_ARCHITECTURE.md § 2: the browser never talks
// to Supabase directly, only to our own Route Handlers.
//
// No table is queried here yet — that's Phase 3 (lib/leads/*, /api/leads,
// /api/chat), once DOC/SUPABASE_ARCHITECTURE.md § 1's schema is actually
// applied to a Supabase project.
export function createServiceRoleClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
