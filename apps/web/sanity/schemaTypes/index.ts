import type { SchemaTypeDefinition } from "sanity";

// Shared objects — DOC/SANITY_CMS_ARCHITECTURE.md § 2.
import { seo } from "./objects/seo";
import { faq } from "./objects/faq";
import { cta } from "./objects/cta";
import { leadFormConfig } from "./objects/leadFormConfig";
import { accreditationBadge } from "./objects/accreditationBadge";
import { navLink } from "./objects/navLink";

// Page-builder blocks — DOC/PAGE_BUILDER_ARCHITECTURE.md § 2.
import { pageBuilderBlockTypes } from "./pageBuilder";

// Documents — DOC/DATA_MODEL.md.
import { siteSettings } from "./documents/siteSettings";
import { page } from "./documents/page";
import { university } from "./documents/university";
import { programme } from "./documents/programme";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects
    seo,
    faq,
    cta,
    leadFormConfig,
    accreditationBadge,
    navLink,
    // Page-builder blocks
    ...pageBuilderBlockTypes,
    // Documents
    siteSettings,
    page,
    university,
    programme,
  ],
};
