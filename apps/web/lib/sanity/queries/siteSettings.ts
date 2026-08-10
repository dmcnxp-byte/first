import { groq } from "next-sanity";

// The single global config document — DOC/DATA_MODEL.md § Site Settings.
// Absorbs the former `navigation` singleton's header/footer link fields.
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    logo,
    favicon,
    chatWelcomeMessage,
    headerProgrammesLinks,
    headerUniversitiesLinks,
    footerColumns,
    phone,
    whatsappNumber,
    email,
    legalEntityName,
    cin,
    gst,
    registeredOfficeAddress,
    socialLinks,
    defaultSeo{
      title,
      description,
      ogImage,
      canonicalUrl,
      noindex
    },
    organizationSchema,
    theme
  }
`;

export const siteSettingsTag = "sanity:siteSettings";
