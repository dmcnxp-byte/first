// Lead scoring rubric — DOC/FORMS_ARCHITECTURE.md § 6, DOC/SUPABASE_ARCHITECTURE.md.
// Returns both the total score and the individual `lead_events` rows so the
// score stays auditable rather than a single opaque number.

import { INDIAN_MOBILE_RE } from "./validation";

// The full set of source-page identities a lead can be attributed to. Every
// page that renders the reusable LeadForm supplies one of these itself — this
// module never assumes which page called it.
export type SourcePageType =
  | "homepage"
  | "programme"
  | "university"
  | "specialization"
  | "compare"
  | "landing_page"
  | "resource"
  | "apply"
  | "newsletter";

export const SOURCE_PAGE_TYPES: readonly SourcePageType[] = [
  "homepage",
  "programme",
  "university",
  "specialization",
  "compare",
  "landing_page",
  "resource",
  "apply",
  "newsletter",
];

// The page-specific identity a caller of the reusable LeadForm supplies —
// DOC/FORMS_ARCHITECTURE.md § 3. `documentId` is the Sanity document that owns
// the rendered leadFormBlock/newsletterBlock (used to re-derive that
// document's actual field config server-side, per § 3's anti-tampering rule).
export type LeadSourceContext = {
  pageType: SourcePageType;
  slug: string;
  documentId?: string;
};

const MAX_SLUG_LENGTH = 200;
const SANITY_DOCUMENT_ID_RE = /^[a-zA-Z0-9_.-]+$/;

// The browser-submitted page context is never trusted as-is — an unrecognized
// pageType is bucketed into "landing_page" rather than silently mislabeled as
// "homepage", an oversized/malformed slug is trimmed and capped, and a
// documentId that doesn't look like a real Sanity document id is dropped
// (it's only ever used as a query param, never interpolated into GROQ, but a
// garbage value can't resolve to a real document anyway). Missing fields keep
// the same defaults the API has always used, so anonymous click-beacons
// (PhoneLink/WhatsAppLink, which only ever send `{ pageType }`) are unaffected.
export function sanitizeSourceContext(raw?: {
  pageType?: string;
  slug?: string;
  documentId?: string;
}): LeadSourceContext {
  let pageType: SourcePageType = "homepage";
  if (raw?.pageType) {
    pageType = (SOURCE_PAGE_TYPES as string[]).includes(raw.pageType)
      ? (raw.pageType as SourcePageType)
      : "landing_page";
  }

  const slug = raw?.slug?.trim().slice(0, MAX_SLUG_LENGTH) || "/";

  const trimmedDocumentId = raw?.documentId?.trim();
  const documentId =
    trimmedDocumentId && SANITY_DOCUMENT_ID_RE.test(trimmedDocumentId)
      ? trimmedDocumentId
      : undefined;

  return { pageType, slug, documentId };
}

export type ScoringInput = {
  sourcePageType: SourcePageType;
  phone?: string;
  email?: string;
  city?: string;
  interestRaw?: string;
  aiChatExchangeCount?: number;
  timeOnSiteSeconds?: number;
  isReturningVisitor?: boolean;
};

export type ScoreEvent = { eventType: string; points: number };

const PAGE_TYPE_POINTS: Partial<
  Record<SourcePageType, { eventType: string; points: number }>
> = {
  apply: { eventType: "bofu_submit", points: 30 },
  compare: { eventType: "compare_submit", points: 20 },
  university: { eventType: "university_submit", points: 15 },
  landing_page: { eventType: "campaign_lp_submit", points: 10 },
  resource: { eventType: "resource_submit", points: 5 },
  // homepage / programme / specialization carry no page-type bonus of their
  // own per the rubric in DOC/FORMS_ARCHITECTURE.md § 6 — only the
  // field-completion bonuses below apply.
};

export function scoreLead(input: ScoringInput): {
  totalScore: number;
  events: ScoreEvent[];
} {
  const events: ScoreEvent[] = [];

  const pageBonus = PAGE_TYPE_POINTS[input.sourcePageType];
  if (pageBonus) events.push(pageBonus);

  if (input.aiChatExchangeCount !== undefined && input.aiChatExchangeCount >= 5) {
    events.push({ eventType: "ai_chat_5_exchanges", points: 25 });
  }

  if (input.phone && INDIAN_MOBILE_RE.test(input.phone.replace(/\s/g, ""))) {
    events.push({ eventType: "valid_phone", points: 10 });
  }

  if (input.email) events.push({ eventType: "email_complete", points: 5 });
  if (input.city) events.push({ eventType: "city_complete", points: 5 });
  if (input.interestRaw) events.push({ eventType: "interest_specified", points: 10 });

  if (input.timeOnSiteSeconds !== undefined && input.timeOnSiteSeconds > 5 * 60) {
    events.push({ eventType: "time_on_site_5min", points: 10 });
  }

  if (input.isReturningVisitor) {
    events.push({ eventType: "returning_visitor", points: 5 });
  }

  const totalScore = events.reduce((sum, event) => sum + event.points, 0);
  return { totalScore, events };
}
