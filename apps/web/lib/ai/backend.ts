// The ChatBackend swap point — DOC/AI_PERSONALIZATION_ARCHITECTURE.md § 2.
// A real LLM vendor plugs in here later without the widget, route contract,
// or scoring integration changing. This phase ships the documented interim:
// "a simple rules-based implementation ... if a real LLM integration isn't
// ready at launch" (§ 2) — an honestly-labeled, server-side rules engine,
// not the mockup's client-side placeholder (which is not ported, per
// DOC/REQUIREMENTS_ANALYSIS.md § 7).

export type ChatMessage = { role: "ai" | "user"; content: string };

export type PageContext = {
  pageType: string;
  documentId?: string;
  slug?: string;
};

export interface ChatBackend {
  reply(input: {
    pageContext: PageContext;
    transcript: ChatMessage[];
    userMessage: string;
  }): Promise<{
    reply: string;
    quickReplies?: string[];
    shouldOfferHumanHandoff: boolean;
  }>;
}

const TOPIC_REPLIES: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["online mba", "online"],
    reply:
      "Online MBA programmes run on a structured cohort calendar with live faculty sessions — closer to a traditional MBA, but fully remote. Fee typically runs ₹1.2L–₹3L over 1.5–2 years. Would you like a shortlist of universities, or details on a specific one?",
  },
  {
    keywords: ["distance mba", "distance"],
    reply:
      "Distance MBA is self-paced, with mailed and digital course materials and minimal live instruction — the most budget-friendly mode, typically ₹40K–₹2L over 2–2.5 years. Want me to compare a few universities on this mode?",
  },
  {
    keywords: ["executive mba", "executive"],
    reply:
      "Executive MBA is designed for senior professionals with 5+ years of experience, usually weekend or hybrid format, ₹3L–₹25L over 1–2 years. Peer network quality is a major part of the value here. What's your current role?",
  },
  {
    keywords: ["correspondence"],
    reply:
      "Correspondence MBA is the legacy term for distance learning — traditional, print-leaning materials, ₹40K–₹1.5L over 2–3 years. Should I compare it against Distance MBA for you?",
  },
  {
    keywords: ["fee", "cost", "price", "emi"],
    reply:
      "Fees vary a lot by university and mode — anywhere from ₹40K to ₹25L depending on the programme. If you tell me which mode or university you're considering, I can give you a tighter range, or connect you with a counsellor for exact, current figures.",
  },
  {
    keywords: ["eligibility", "eligible", "criteria"],
    reply:
      "Most programmes require a recognised bachelor's degree with 50%+ marks; Executive MBA usually also requires 5+ years of work experience. Exact criteria differ by university — want a counsellor to check your specific eligibility?",
  },
];

const DEFAULT_REPLY =
  "I can help with university shortlists, fee ranges, eligibility, or general MBA-mode guidance. What would you like to know — Distance, Online, Executive, or Correspondence MBA, or are you still figuring out where to start?";

function findReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const match = TOPIC_REPLIES.find((topic) =>
    topic.keywords.some((keyword) => lower.includes(keyword)),
  );
  return match?.reply ?? DEFAULT_REPLY;
}

export const rulesBasedBackend: ChatBackend = {
  async reply({ transcript, userMessage }) {
    const reply = findReply(userMessage);
    // Escalate once the conversation has gone deep enough that a human
    // counsellor adds more value than another rules-based reply — per
    // DOC/AI_PERSONALIZATION_ARCHITECTURE.md § 3 ("after 3-5 exchanges").
    const exchangeCount =
      transcript.filter((message) => message.role === "user").length + 1;
    const shouldOfferHumanHandoff = exchangeCount >= 3;

    return {
      reply,
      quickReplies: shouldOfferHumanHandoff
        ? ["Talk to a human counsellor", "Compare universities", "Check eligibility"]
        : ["Compare universities", "Check eligibility", "Talk to a human counsellor"],
      shouldOfferHumanHandoff,
    };
  },
};
