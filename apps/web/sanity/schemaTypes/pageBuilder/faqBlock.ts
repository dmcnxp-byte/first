import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// FAQ section — single-sourced with FAQPage JSON-LD via the same `items`
// array (DOC/SEO_STRATEGY.md § 2). 5-10 items enforced per
// DOC/SANITY_CMS_ARCHITECTURE.md § 8 for document types the content strategy
// mandates it on; Homepage is one of them per DOC/REQUIREMENTS_ANALYSIS.md § 9.
export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [{ type: "faq" }],
      validation: (Rule) => Rule.required().min(5).max(10),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
