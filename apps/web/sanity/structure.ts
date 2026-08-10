import type { StructureResolver } from "sanity/structure";

// Desk structure grouped by business concern, not alphabetically —
// DOC/SANITY_CMS_ARCHITECTURE.md § 3. "Pages" is a real document-type list
// (Homepage is just the one Page document flagged `isHomepage: true`, not a
// hand-wired singleton) — this is what makes every future page reuse the
// same editing experience as the Homepage.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("page").title("Pages"),
      S.divider(),
      S.documentTypeListItem("programme").title("Programmes"),
      S.documentTypeListItem("university").title("Universities"),
      S.divider(),
      S.listItem()
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
