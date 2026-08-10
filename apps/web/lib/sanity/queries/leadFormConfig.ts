import { groq } from "next-sanity";

// Re-derives the Homepage's lead-form field configuration server-side so
// `/api/leads` can validate a submission against what was actually offered,
// per DOC/FORMS_ARCHITECTURE.md § 3 ("a tampered client payload can't claim
// fields it wasn't offered").
export const homepageLeadFormConfigQuery = groq`
  *[_type == "page" && isHomepage == true][0].sections[_type == "leadFormBlock"][0].form
`;
