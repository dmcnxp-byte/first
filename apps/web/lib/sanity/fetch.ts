import "server-only";
import { draftMode } from "next/headers";
import { sanityClient, previewClient } from "./client";

type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  /** Seconds before revalidation; omit for content that only changes via webhook (revalidateTag). */
  revalidate?: number | false;
};

/**
 * Resilient Sanity fetch wrapper — every homepage query goes through this.
 *
 * Two things this exists to guarantee, per DOC/FRONTEND_ARCHITECTURE.md § 2
 * and DOC/SANITY_CMS_ARCHITECTURE.md § 6:
 * 1. Draft Mode transparently switches to the preview perspective so editors
 *    see unpublished content on the live Next.js front end (FR-20).
 * 2. A network/config failure (e.g. no real Sanity project connected yet —
 *    see PROJECT_STATUS.md "known items") degrades to `null` instead of
 *    failing the whole route/build — callers render a graceful empty state.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
  revalidate,
}: SanityFetchOptions): Promise<QueryResponse | null> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    const client = isDraftMode ? previewClient : sanityClient;

    return await client.fetch<QueryResponse>(query, params, {
      cache: isDraftMode ? "no-store" : undefined,
      next: isDraftMode ? undefined : { tags, revalidate },
    });
  } catch (error) {
    console.error("[sanityFetch] query failed, degrading to null:", error);
    return null;
  }
}
