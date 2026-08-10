import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site";
import { sanityFetch } from "@/lib/sanity/fetch";
import { allPagesForSitemapQuery, pageTag } from "@/lib/sanity/queries/page";

type SitemapPage = {
  slug: string;
  isHomepage?: boolean;
  noindex?: boolean;
  _updatedAt?: string;
};

// DOC/ROUTING_STRATEGY.md § 4, DOC/SEO_STRATEGY.md § 6: every published,
// non-noindex Page document. Only Pages exist as real routes this phase —
// other document types' entries land as their routes are built.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await sanityFetch<SitemapPage[]>({
    query: allPagesForSitemapQuery,
    tags: [pageTag],
  });

  return (pages ?? [])
    .filter((page) => !page.noindex)
    .map((page) => ({
      url: page.isHomepage ? siteUrl : `${siteUrl}/${page.slug}`,
      lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: page.isHomepage ? 1 : 0.7,
    }));
}
