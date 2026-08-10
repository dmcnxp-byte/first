import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Specialisations grid — DOC/REQUIREMENTS_ANALYSIS.md § 9. Items are inline
// objects rather than references to a `specialization` document: that
// document type belongs to the Specialization detail-page phase (out of
// scope here per the Phase 3 brief — "do not build pages not part of the
// Homepage"), so this block will switch to `reference -> specialization`
// once that type exists — see PROJECT_STATUS.md Phase 3 notes.
export const specializationsGridBlock = defineType({
  name: "specializationsGridBlock",
  title: "Specialisations grid",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "items",
      title: "Specialisations",
      type: "array",
      of: [
        {
          type: "object",
          name: "specializationCard",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Short description",
              type: "string",
            }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
          preview: {
            select: { title: "name", subtitle: "description" },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
