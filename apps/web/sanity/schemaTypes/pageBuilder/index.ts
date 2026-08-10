import type { SchemaTypeDefinition } from "sanity";
import { heroBlock } from "./heroBlock";
import { trustStripBlock } from "./trustStripBlock";
import { modeStripBlock } from "./modeStripBlock";
import { featuredUniversitiesBlock } from "./featuredUniversitiesBlock";
import { specializationsGridBlock } from "./specializationsGridBlock";
import { pullQuoteBlock } from "./pullQuoteBlock";
import { counsellorMomentBlock } from "./counsellorMomentBlock";
import { aiChatInviteBlock } from "./aiChatInviteBlock";
import { comparisonPreviewBlock } from "./comparisonPreviewBlock";
import { leadFormBlock } from "./leadFormBlock";
import { faqBlock } from "./faqBlock";
import { richTextBlock } from "./richTextBlock";
import { statsBlock } from "./statsBlock";
import { testimonialsBlock } from "./testimonialsBlock";
import { ctaBlock } from "./ctaBlock";
import { galleryBlock } from "./galleryBlock";
import { videoBlock } from "./videoBlock";
import { newsletterBlock } from "./newsletterBlock";
import { partnersBlock } from "./partnersBlock";
import { compareTableBlock } from "./compareTableBlock";
import { stepsBlock } from "./stepsBlock";
import { relatedUniversitiesBlock } from "./relatedUniversitiesBlock";
import { imageContentBlock } from "./imageContentBlock";
import { dividerBlock } from "./dividerBlock";

// The page-builder block catalog — DOC/PAGE_BUILDER_ARCHITECTURE.md § 2/4
// (NFR-11). Curated, not a generic free-for-all: every entry maps 1:1 to a
// real, reusable section component. Adding a new block: (1) schema here,
// (2) adapter in components/page-builder/registry.tsx, (3) register below.
export const pageBuilderBlockTypes: SchemaTypeDefinition[] = [
  heroBlock,
  trustStripBlock,
  modeStripBlock,
  featuredUniversitiesBlock,
  specializationsGridBlock,
  pullQuoteBlock,
  counsellorMomentBlock,
  aiChatInviteBlock,
  comparisonPreviewBlock,
  leadFormBlock,
  faqBlock,
  richTextBlock,
  statsBlock,
  testimonialsBlock,
  ctaBlock,
  galleryBlock,
  videoBlock,
  newsletterBlock,
  partnersBlock,
  compareTableBlock,
  stepsBlock,
  relatedUniversitiesBlock,
  imageContentBlock,
  dividerBlock,
];

export const pageBuilderBlockNames = [
  "heroBlock",
  "trustStripBlock",
  "modeStripBlock",
  "featuredUniversitiesBlock",
  "specializationsGridBlock",
  "pullQuoteBlock",
  "counsellorMomentBlock",
  "aiChatInviteBlock",
  "comparisonPreviewBlock",
  "leadFormBlock",
  "faqBlock",
  "richTextBlock",
  "statsBlock",
  "testimonialsBlock",
  "ctaBlock",
  "galleryBlock",
  "videoBlock",
  "newsletterBlock",
  "partnersBlock",
  "compareTableBlock",
  "stepsBlock",
  "relatedUniversitiesBlock",
  "imageContentBlock",
  "dividerBlock",
] as const;
