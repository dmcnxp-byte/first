import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Featured Universities grid — DOC/REQUIREMENTS_ANALYSIS.md § 9. Universities
// themselves are NOT listed here; they're resolved at query time from
// `university` documents with `isFeaturedOnHomepage: true`, ordered by
// `featuredOrder` — this mirrors DOC/DATA_MODEL.md § Offering's stated reason
// for that flag ("lets editors control the homepage's 8-card featured set
// without a separate duplicated list").
export const featuredUniversitiesBlock = defineType({
  name: "featuredUniversitiesBlock",
  title: "Featured universities",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "viewAllLabel",
      title: '"View all" link label',
      type: "string",
    }),
    defineField({
      name: "viewAllHref",
      title: '"View all" link target',
      type: "string",
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
