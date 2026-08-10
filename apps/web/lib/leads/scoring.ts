// Lead scoring rubric — DOC/FORMS_ARCHITECTURE.md § 6, DOC/SUPABASE_ARCHITECTURE.md.
// Returns both the total score and the individual `lead_events` rows so the
// score stays auditable rather than a single opaque number.

export type SourcePageType =
  | "homepage"
  | "programme"
  | "university"
  | "specialization"
  | "compare"
  | "landing_page"
  | "resource"
  | "apply";

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

const INDIAN_MOBILE_RE = /^(\+?91[-\s]?)?[6-9]\d{9}$/;

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
