import type { Metadata } from "next";
import { urlForImage } from "@/lib/sanity/image";
import type { Seo } from "@/lib/sanity/types/shared";

// generateMetadata() input builder, reading the document's `seo` object —
// DOC/FRONTEND_ARCHITECTURE.md § 3, DOC/SEO_STRATEGY.md § 6.
export function buildMetadataFromSeo(seo: Seo, siteUrl: string, path = "/"): Metadata {
  const canonical = seo.canonicalUrl ?? `${siteUrl}${path}`;
  const ogImageUrl = seo.ogImage
    ? urlForImage(seo.ogImage).width(1200).height(630).url()
    : undefined;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical },
    robots: seo.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      type: "website",
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}
