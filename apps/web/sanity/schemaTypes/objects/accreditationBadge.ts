import { defineField, defineType } from "sanity";

// Text-only accreditation pill (UGC-DEB / AICTE / NAAC / AIU, etc.) —
// DOC/COMPONENT_ARCHITECTURE.md § 2 `Badge` contract: "no logo-image slot,
// matches mockup finding that no image-based badges exist today."
export const accreditationBadge = defineType({
  name: "accreditationBadge",
  title: "Accreditation badge",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      description: "Verifiable source for this accreditation claim (EEAT) — optional.",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "label" },
  },
});
