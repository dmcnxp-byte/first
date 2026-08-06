import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Configured client only — no queries live here yet. Per-document-type query
// functions land in lib/sanity/queries/ in Phase 3 alongside the schema types
// they depend on. See DOC/FRONTEND_ARCHITECTURE.md § 2.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
