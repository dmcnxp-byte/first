import type { SiteSettings } from "@/lib/sanity/types/siteSettings";

// Organization JSON-LD — DOC/SEO_STRATEGY.md § 2 (site-wide, emitted once).
export function buildOrganizationSchema(siteUrl: string, settings: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name:
      settings?.organizationSchema?.legalName ??
      settings?.siteName ??
      "Distance MBA College",
    url: siteUrl,
    ...(settings?.logo ? { logo: `${siteUrl}/brand/logo-primary.png` } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(settings?.organizationSchema?.foundingDate
      ? { foundingDate: settings.organizationSchema.foundingDate }
      : {}),
  };
}
