"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Faq } from "@/lib/sanity/types/shared";

// FAQAccordion — DOC/REQUIREMENTS_ANALYSIS.md § 7. Takes the same `items`
// array the FAQPage JSON-LD builder consumes (lib/seo/schema/faq.ts), so the
// rendered accordion and the structured data can never drift — the mockups'
// confirmed 6-vs-8-item gap — per DOC/COMPONENT_ARCHITECTURE.md § 3.
export function FAQAccordion({
  eyebrow,
  heading,
  headingAccent,
  items,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  items: Faq[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(items[0]?._key ?? null);

  return (
    <section className="bg-white py-16 md:py-20">
      <Container narrow>
        <SectionHead
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          center
        />
        <div className="divide-hairline border-hairline flex flex-col divide-y border-y">
          {items.map((item) => {
            const isOpen = openKey === item._key;
            const panelId = `faq-panel-${item._key}`;
            return (
              <div key={item._key}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenKey(isOpen ? null : item._key)}
                  className="font-display text-navy flex w-full items-center justify-between gap-4 py-5 text-left font-semibold"
                >
                  {item.question}
                  <span
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-150 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {isOpen ? (
                  <div id={panelId} className="text-slate pb-5">
                    {item.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
