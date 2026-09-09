"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useSelectedUniversity } from "@/components/forms/SelectedUniversityContext";
import type { UniversityShortlistCard } from "@/lib/sanity/types/page";

// Per-page university shortlist grid (design/top-distance-mba-finance.html
// "card-grid" pattern) — 3-up desktop, 2-up tablet, 1-up mobile. Each card's
// primary CTA sets the shared "selected university" context (see
// components/forms/SelectedUniversityContext.tsx) so the page's LeadForm
// shows an "Interested in: X" chip, then scrolls to it.
export function UniversityShortlistGrid({
  eyebrow,
  heading,
  headingAccent,
  intro,
  cardCtaLabel,
  cardSecondaryCtaLabel,
  footnote,
  items,
  bare,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  intro?: string;
  cardCtaLabel: string;
  cardSecondaryCtaLabel?: string;
  footnote?: string;
  items: UniversityShortlistCard[];
  bare?: boolean;
}) {
  const { select } = useSelectedUniversity();

  function handleSelect(cardLabel: string) {
    select(cardLabel);
    const formSection = document.getElementById("lead");
    if (!formSection) return;
    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    const nameInput = formSection.querySelector<HTMLInputElement>('input[name="name"]');
    window.setTimeout(() => nameInput?.focus(), 400);
  }

  const content = (
    <>
      <SectionHead
        eyebrow={eyebrow}
        heading={heading}
        headingAccent={headingAccent}
        intro={intro}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const cardLabel = `${item.university.name} ${item.programLabel}`;
          return (
            <article
              key={item._key}
              className={`border-hairline relative flex flex-col rounded-2xl border bg-white p-6 shadow-[0_1px_0_rgba(11,31,77,0.02),0_4px_12px_-8px_rgba(11,31,77,0.08)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(11,31,77,0.15)] ${
                item.featured ? "border-saffron" : ""
              }`}
            >
              {item.featured && item.featuredTag ? (
                <span className="bg-saffron text-navy font-display absolute -top-2.5 left-5 rounded px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                  {item.featuredTag}
                </span>
              ) : null}

              <div className="font-display text-saffron mb-2 text-xs font-bold tracking-wider uppercase">
                Rank {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-navy text-[17px] leading-tight font-semibold">
                {item.university.name}
              </h3>
              <p className="text-slate mt-1 text-sm">{item.programLabel}</p>

              <div className="border-mist my-4 grid grid-cols-2 gap-3 border-y py-3.5">
                <div>
                  <div className="text-slate-2 text-[10px] font-semibold tracking-wider uppercase">
                    Total fee*
                  </div>
                  <div className="font-display text-saffron mt-0.5 text-base font-bold">
                    {item.university.quickFacts.feeDisplay}
                  </div>
                </div>
                <div>
                  <div className="text-slate-2 text-[10px] font-semibold tracking-wider uppercase">
                    Duration
                  </div>
                  <div className="font-display text-navy mt-0.5 text-sm font-semibold">
                    {item.university.quickFacts.durationDisplay}
                  </div>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                <Badge tone="neutral">{item.mode}</Badge>
                {item.university.trustBadges?.slice(0, 2).map((badge) => (
                  <Badge key={badge._key} tone="success">
                    {badge.label}
                  </Badge>
                ))}
              </div>

              <p className="text-slate mb-4 flex-1 text-sm leading-relaxed">
                <strong className="text-navy font-semibold">Best for: </strong>
                {item.university.positioningStatement}
              </p>

              <Button
                type="button"
                variant="primary"
                block
                withArrow
                onClick={() => handleSelect(cardLabel)}
              >
                {cardCtaLabel}
              </Button>
              {cardSecondaryCtaLabel ? (
                <Link
                  href={`/universities/${item.university.slug}`}
                  className="border-hairline text-navy hover:border-navy mt-2 flex items-center justify-center rounded-md border-[1.5px] px-4 py-2 text-sm font-semibold"
                >
                  {cardSecondaryCtaLabel}
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
      {footnote ? <p className="text-slate-2 mt-4 text-xs">{footnote}</p> : null}
    </>
  );

  if (bare) {
    return <div className="py-8 md:py-10">{content}</div>;
  }

  return (
    <section className="py-16 md:py-20">
      <Container>{content}</Container>
    </section>
  );
}
