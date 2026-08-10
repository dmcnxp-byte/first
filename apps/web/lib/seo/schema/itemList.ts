import type { University } from "@/lib/sanity/types/university";

// ItemList JSON-LD for the Featured Universities section — DOC/SEO_STRATEGY.md § 2.
export function buildUniversityItemListSchema(
  siteUrl: string,
  universities: University[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: universities.map((university, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: university.name,
      url: `${siteUrl}/universities/${university.slug}`,
    })),
  };
}
