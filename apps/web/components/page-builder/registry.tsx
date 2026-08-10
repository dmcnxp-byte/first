import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ModeStrip } from "@/components/sections/ModeStrip";
import { UniversityCardGrid } from "@/components/sections/UniversityCardGrid";
import { SpecializationsGrid } from "@/components/sections/SpecializationsGrid";
import { PullQuoteBand } from "@/components/sections/PullQuoteBand";
import { CounsellorMoment } from "@/components/sections/CounsellorMoment";
import { AiChatInvite } from "@/components/sections/AiChatInvite";
import { ComparisonPreview } from "@/components/sections/ComparisonPreview";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { RichText } from "@/components/sections/RichText";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Gallery } from "@/components/sections/Gallery";
import { VideoEmbed } from "@/components/sections/VideoEmbed";
import { Newsletter } from "@/components/sections/Newsletter";
import { PartnersStrip } from "@/components/sections/PartnersStrip";
import { CompareTable } from "@/components/sections/CompareTable";
import { StepsList } from "@/components/sections/StepsList";
import { ImageContent } from "@/components/sections/ImageContent";
import { Divider } from "@/components/sections/Divider";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  featuredUniversitiesQuery,
  universitiesTag,
} from "@/lib/sanity/queries/university";
import type { University } from "@/lib/sanity/types/university";
import type { PageBuilderBlock } from "@/lib/sanity/types/page";
import type { LeadSourceContext } from "@/lib/leads/scoring";

// `page` is this page's own identity — only the leadFormBlock/newsletterBlock
// adapters below actually read it (JS callbacks may always ignore trailing
// arguments they don't declare), so every other adapter is untouched.
type BlockRenderer<T extends PageBuilderBlock = PageBuilderBlock> = (
  block: T,
  page: LeadSourceContext,
) => React.ReactNode | Promise<React.ReactNode>;

// blockRegistry — DOC/PAGE_BUILDER_ARCHITECTURE.md § 3: a single typed lookup
// table mapping each Sanity block `_type` to its adapter. Adapters are thin:
// most block schemas map 1:1 to their composed-pattern's props (per
// DOC/PAGE_BUILDER_ARCHITECTURE.md § 2), so the adapter's only job is the
// field-name translation. The featured-universities adapter is the one
// exception that fetches its own data — an explicitly allowed "page-builder
// resolver" per DOC/COMPONENT_ARCHITECTURE.md § 1.
export const blockRegistry: {
  [K in PageBuilderBlock["_type"]]: BlockRenderer<
    Extract<PageBuilderBlock, { _type: K }>
  >;
} = {
  heroBlock: (block) => (
    <Hero
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      subhead={block.subhead}
      primaryCta={block.primaryCta}
      secondaryCta={block.secondaryCta}
    />
  ),
  trustStripBlock: (block) => (
    <TrustStrip
      statValue={block.statValue}
      statLabel={block.statLabel}
      badges={block.badges}
    />
  ),
  modeStripBlock: (block) => (
    <ModeStrip
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      intro={block.intro}
      modes={block.modes}
    />
  ),
  featuredUniversitiesBlock: async (block) => {
    const universities =
      (await sanityFetch<University[]>({
        query: featuredUniversitiesQuery,
        tags: [universitiesTag],
      })) ?? [];

    if (universities.length === 0) return null;

    return (
      <UniversityCardGrid
        eyebrow={block.eyebrow}
        heading={block.heading}
        headingAccent={block.headingAccent}
        viewAllLabel={block.viewAllLabel}
        viewAllHref={block.viewAllHref}
        universities={universities}
      />
    );
  },
  specializationsGridBlock: (block) => (
    <SpecializationsGrid
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      items={block.items}
    />
  ),
  pullQuoteBlock: (block) => (
    <PullQuoteBand
      quoteText={block.quoteText}
      attribution={block.attribution}
      cta={block.cta}
    />
  ),
  counsellorMomentBlock: (block) => (
    <CounsellorMoment
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      quote={block.quote}
      counsellorName={block.counsellorName}
      counsellorTitle={block.counsellorTitle}
      counsellorPhoto={block.counsellorPhoto}
      cta={block.cta}
    />
  ),
  aiChatInviteBlock: (block) => (
    <AiChatInvite
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      body={block.body}
      ctaLabel={block.ctaLabel}
    />
  ),
  comparisonPreviewBlock: (block) => (
    <ComparisonPreview
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      items={block.items}
    />
  ),
  leadFormBlock: (block, page) => (
    <LeadFormSection
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      intro={block.intro}
      bullets={block.bullets}
      form={block.form}
      source={page}
    />
  ),
  faqBlock: (block) => (
    <FAQAccordion
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      items={block.items}
    />
  ),
  richTextBlock: (block) => <RichText body={block.body} />,
  statsBlock: (block) => (
    <StatsGrid
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      items={block.items}
    />
  ),
  testimonialsBlock: (block) => (
    <Testimonials
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      items={block.items}
    />
  ),
  ctaBlock: (block) => (
    <CtaBanner heading={block.heading} subhead={block.subhead} cta={block.cta} />
  ),
  galleryBlock: (block) => (
    <Gallery
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      images={block.images}
    />
  ),
  videoBlock: (block) => (
    <VideoEmbed
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      videoUrl={block.videoUrl}
      caption={block.caption}
    />
  ),
  newsletterBlock: (block, page) => (
    <Newsletter
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      subhead={block.subhead}
      form={block.form}
      source={{ slug: page.slug, documentId: page.documentId }}
    />
  ),
  partnersBlock: (block) => (
    <PartnersStrip
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      logos={block.logos}
    />
  ),
  compareTableBlock: (block) => (
    <CompareTable
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      columns={block.columns}
      rows={block.rows}
    />
  ),
  stepsBlock: (block) => (
    <StepsList
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      steps={block.steps}
    />
  ),
  relatedUniversitiesBlock: (block) => (
    <UniversityCardGrid
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      universities={block.universities}
    />
  ),
  imageContentBlock: (block) => (
    <ImageContent
      image={block.image}
      alt={block.alt}
      imagePosition={block.imagePosition}
      eyebrow={block.eyebrow}
      heading={block.heading}
      headingAccent={block.headingAccent}
      body={block.body}
      cta={block.cta}
    />
  ),
  dividerBlock: (block) => <Divider style={block.style} />,
};
