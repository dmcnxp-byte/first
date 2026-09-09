import { groq } from "next-sanity";

// Re-derives the actual lead-form field configuration of the page/document
// that rendered the form, keyed by the `documentId` the submitting page
// supplied — so `/api/leads` validates against what THAT page actually
// offered, not always the Homepage's. Per DOC/FORMS_ARCHITECTURE.md § 3 ("a
// tampered client payload can't claim fields it wasn't offered"). Matches
// any block type the reusable LeadForm backs (leadFormBlock, newsletterBlock,
// heroSplitBlock's own `form` field).
export const leadFormConfigByDocumentIdQuery = groq`
  *[_id == $documentId][0].sections[_type in ["leadFormBlock", "newsletterBlock", "heroSplitBlock"]][0].form
`;

// Fallback used only when a submission carries no documentId at all (e.g. an
// older client) — re-derives the Homepage's config specifically, preserving
// prior behavior.
export const homepageLeadFormConfigQuery = groq`
  *[_type == "page" && isHomepage == true][0].sections[_type == "leadFormBlock"][0].form
`;
