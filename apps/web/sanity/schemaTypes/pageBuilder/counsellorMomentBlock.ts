import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// "You'll speak with a real person" trust device — DOC/REQUIREMENTS_ANALYSIS.md § 9,
// DOC/COMPONENT_ARCHITECTURE.md § 3 `CounsellorNote`.
//
// DOC/SANITY_CMS_ARCHITECTURE.md § 8 requires every counsellor quote to
// reference a real `counsellor` document (EEAT enforcement), but the
// Counsellor document type belongs to a later phase (Counsellor Profile
// pages are out of scope for Phase 3 — Homepage only). This block therefore
// uses inline name/title/photo fields for now and will switch to
// `reference -> counsellor` once that document type is built — see
// PROJECT_STATUS.md Phase 3 notes for this tracked deviation.
export const counsellorMomentBlock = defineType({
  name: "counsellorMomentBlock",
  title: "Counsellor moment",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "counsellorName",
      title: "Counsellor name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "counsellorTitle",
      title: "Counsellor title/credentials",
      description: 'e.g. "Senior Counsellor · 11 years · Pune"',
      type: "string",
    }),
    defineField({
      name: "counsellorPhoto",
      title: "Counsellor photo",
      type: "image",
    }),
    defineField({
      name: "cta",
      title: "Button (optional)",
      description:
        'Covers the design/landing-page-online-mba.html variant with a "Talk to a counsellor now" button.',
      type: "cta",
    }),
  ],
  preview: {
    select: { title: "counsellorName", subtitle: "quote" },
  },
});
