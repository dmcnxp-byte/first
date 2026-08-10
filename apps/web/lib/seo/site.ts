// Absolute site origin for canonical URLs, OG/JSON-LD, sitemap.xml, robots.txt.
// See PROJECT_STATUS.md Phase 3 notes for why `NEXT_PUBLIC_SITE_URL` was added.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://distancembacollege.com"
).replace(/\/$/, "");
