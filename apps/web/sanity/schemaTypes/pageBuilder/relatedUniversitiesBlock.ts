import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Editor-curated university teaser grid — distinct from
// `featuredUniversitiesBlock`, which resolves via the `isFeaturedOnHomepage`
// flag (one global set). This is a per-page, hand-picked reference list —
// e.g. "Compare NMIMS with" (design/university-nmims.html) or a Resource
// page's "related universities" grid. References real `university`
// documents rather than duplicating their content, per the same pattern
// already used by `modeStripBlock` for programmes.
export const relatedUniversitiesBlock = defineType({
  name: "relatedUniversitiesBlock",
  title: "Related Universities",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "universities",
      title: "Universities",
      type: "array",
      of: [{ type: "reference", to: [{ type: "university" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
