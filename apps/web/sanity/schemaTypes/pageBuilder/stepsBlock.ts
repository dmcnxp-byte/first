import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Numbered process/steps list — DOC/COMPONENT_ARCHITECTURE.md § 3's
// `StepsList` contract ("shared between eligibility criteria, how-to-apply,
// and future admission-process content"), finally given a page-builder
// home. Evidenced by design/specialization-marketing.html's "How to choose"
// decision framework and design/resource-distance-mba-guide.html's
// eligibility/how-to-apply steps. Realizes the requested "Timeline" section
// — a numbered process, not a literal dated calendar (dated application
// windows stay the University-specific `applicationTimeline` field, per
// DOC/DATA_MODEL.md, since that needs guaranteed per-entity structure).
export const stepsBlock = defineType({
  name: "stepsBlock",
  title: "Timeline / Steps",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "step",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
