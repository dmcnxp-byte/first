import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site";

// DOC/ROUTING_STRATEGY.md § 4: disallow /studio and /api/*, allow everything else.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
