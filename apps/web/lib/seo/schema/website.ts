// WebSite JSON-LD — DOC/SEO_STRATEGY.md § 2 (site-wide). DOC calls for
// "WebSite with SearchAction," but no on-site search route exists yet this
// phase — asserting a `SearchAction` against a non-existent endpoint would
// be exactly the kind of unverified claim BR-9's honesty positioning rules
// out. Add `potentialAction` once `/search` actually exists.
export function buildWebsiteSchema(siteUrl: string, siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };
}
