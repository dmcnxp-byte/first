import { groq } from "next-sanity";
import { universityFields } from "./university";

// Shared `sections[]` projection reused by every Page fetch — cross-document
// lookups (Programme references inside modeStripBlock, University references
// inside relatedUniversitiesBlock) are resolved inline via `->` per
// DOC/FRONTEND_ARCHITECTURE.md § 2 ("resolved inside one GROQ query, not N+1
// client-side fetches"). Both the Homepage and every future page-builder
// page share this exact projection — DOC/PAGE_BUILDER_ARCHITECTURE.md.
const sectionsProjection = groq`
  sections[]{
    ...,
    _type == "modeStripBlock" => {
      modes[]->{
        _id,
        modeName,
        "slug": slug.current,
        summary,
        feeRange,
        durationLabel,
        formatLabel,
        bestFor,
        order
      }
    },
    _type == "relatedUniversitiesBlock" => {
      universities[]->{
        ${universityFields}
      }
    }
  }
`;

const pageFields = groq`
  _id,
  title,
  "slug": slug.current,
  isHomepage,
  seo{
    title,
    description,
    ogImage,
    canonicalUrl,
    noindex
  },
  ${sectionsProjection}
`;

// The one Homepage — the `page` document flagged `isHomepage: true`, rendered
// at "/". Not a singleton document type; just a query filter.
export const homePageQuery = groq`
  *[_type == "page" && isHomepage == true][0]{
    ${pageFields}
  }
`;

// Any page by slug, including the Homepage — the route handler redirects a
// homepage hit to "/" so it never renders at two URLs, per
// DOC/ROUTING_STRATEGY.md.
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    ${pageFields}
  }
`;

export const allPageSlugsQuery = groq`
  *[_type == "page" && isHomepage != true].slug.current
`;

export const allPagesForSitemapQuery = groq`
  *[_type == "page"]{
    "slug": slug.current,
    isHomepage,
    "noindex": seo.noindex,
    _updatedAt
  }
`;

export const pageTag = "sanity:page";
