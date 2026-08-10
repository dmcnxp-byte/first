import { defineField } from "sanity";

// Shared field group for the "eyebrow + heading (+ italic accent) + intro"
// section-head pattern repeated across most homepage blocks — see
// DOC/REQUIREMENTS_ANALYSIS.md § 7 `SectionHead` and § 12's Lora-italic-accent
// requirement. A plain helper, not a nested Sanity object type, so Studio's
// array/object editor stays flat for content editors.
export function sectionHeadFields(headingDescription?: string) {
  return [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      description: headingDescription,
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingAccent",
      title: "Heading — italic accent phrase",
      description:
        "The trailing 2-4 word phrase rendered in the brand's Lora-italic voice accent (DOC/REQUIREMENTS_ANALYSIS.md § 12).",
      type: "string",
    }),
  ];
}
