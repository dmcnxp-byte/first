import { defineField, defineType } from "sanity";

// The entire content-driven lead-form contract — DOC/FORMS_ARCHITECTURE.md § 1.
// <LeadForm config={config} .../> renders exactly `fields`, in a fixed visual
// order (name -> phone -> email -> city -> select); field SET and select
// OPTIONS are both editor-authored, never a hardcoded enum per page type.
export const leadFormConfig = defineType({
  name: "leadFormConfig",
  title: "Lead form",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Form title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Form subtitle",
      type: "string",
    }),
    defineField({
      name: "fields",
      title: "Fields to render",
      description:
        "Rendered in a fixed order regardless of selection order: name, phone, email, city, select.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Name", value: "name" },
          { title: "Phone", value: "phone" },
          { title: "Email", value: "email" },
          { title: "City", value: "city" },
          { title: "Select (dropdown)", value: "select" },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "selectLabel",
      title: "Select field label",
      description:
        'e.g. "Course of interest", "Specialisation". Required if "select" is one of the fields above.',
      type: "string",
      hidden: ({ parent }) => !parent?.fields?.includes("select"),
    }),
    defineField({
      name: "selectOptions",
      title: "Select field options",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ parent }) => !parent?.fields?.includes("select"),
    }),
    defineField({
      name: "submitLabel",
      title: "Submit button label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerNote",
      title: "Footer disclaimer note",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
