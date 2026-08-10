import type { Faq } from "@/lib/sanity/types/shared";

// FAQPage JSON-LD, generated from the exact same `items` array FAQAccordion
// renders — DOC/SEO_STRATEGY.md § 2, closing the mockups' confirmed
// 6-vs-8-item schema/render drift.
export function buildFaqPageSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
