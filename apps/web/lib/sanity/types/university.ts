import type { AccreditationBadge, SanityImage, Seo } from "./shared";

export type University = {
  _id: string;
  name: string;
  slug: string;
  legacySlugs?: string[];
  logo?: SanityImage;
  universityType?: "deemed" | "private" | "b-school" | "aggregator";
  positioningStatement: string;
  trustBadges?: AccreditationBadge[];
  quickFacts: {
    feeDisplay: string;
    feeMin?: number;
    feeMax?: number;
    durationDisplay: string;
  };
  isFeaturedOnHomepage?: boolean;
  featuredOrder?: number;
  seo?: Seo;
};
