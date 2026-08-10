import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Published-content client — the CDN API, per DOC/FRONTEND_ARCHITECTURE.md § 2.
// Includes the read token when available: some Sanity projects have
// role-based document permissions where even published content isn't
// readable by a fully anonymous request (confirmed against the real project
// this app is connected to — see PROJECT_STATUS.md). The token is read-only,
// server-only (never `NEXT_PUBLIC_*`), and this client only ever calls
// `.fetch()`, never a write method, so this doesn't change what the token
// can be used to do — it just lets the CDN-cached published client
// authenticate the same way the preview client already does.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN,
});

// Preview-content client — bearer-token authenticated, bypasses the CDN, so
// it can see unpublished drafts. Used only when Next.js Draft Mode is active,
// per DOC/SANITY_CMS_ARCHITECTURE.md § 6. `SANITY_API_READ_TOKEN` is unset
// until a real Sanity project exists (see PROJECT_STATUS.md open items) — in
// that case draft-mode reads fall back to the published client, which still
// works, it just won't show unpublished drafts.
export const previewClient = process.env.SANITY_API_READ_TOKEN
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "drafts",
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : sanityClient;
