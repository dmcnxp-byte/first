import { groq } from "next-sanity";

// Shared University field projection — reused by both the featured-flag
// query below and `relatedUniversitiesBlock`'s reference dereference in
// lib/sanity/queries/page.ts, so the two never drift out of sync.
export const universityFields = groq`
  _id,
  name,
  "slug": slug.current,
  logo,
  universityType,
  positioningStatement,
  trustBadges,
  quickFacts,
  isFeaturedOnHomepage,
  featuredOrder
`;

// Featured Universities for the Homepage grid — resolved by flag + order
// rather than a manually duplicated list, per DOC/DATA_MODEL.md § Offering's
// `isFeaturedOnHomepage` rationale (see university.ts schema notes).
export const featuredUniversitiesQuery = groq`
  *[_type == "university" && isFeaturedOnHomepage == true] | order(featuredOrder asc) {
    ${universityFields}
  }
`;

export const universitiesTag = "sanity:university";
