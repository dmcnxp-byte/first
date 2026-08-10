import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Generic N-column data table — DOC/COMPONENT_ARCHITECTURE.md § 3's
// `CompareTable` contract, finally given a page-builder home. Evidenced
// across design/programme-online-mba.html (mode comparison),
// design/specialization-marketing.html (career/salary table, university
// comparison), and design/compare-nmims-vs-symbiosis.html (11-row fact
// grid) — DOC/REQUIREMENTS_ANALYSIS.md § 7 calls this "the single most
// reused data component in the system." One flexible schema, not one per
// use case.
export const compareTableBlock = defineType({
  name: "compareTableBlock",
  title: "Comparison Table",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "columns",
      title: "Column headers",
      description:
        'The row-label column is implicit — start with the first data column, e.g. "NMIMS", "Symbiosis".',
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "compareTableRow",
          fields: [
            defineField({
              name: "label",
              title: "Row label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "values",
              title: "Values",
              description: "One value per column header, in the same order.",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: { select: { title: "label" } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
