import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import type { StatItem } from "@/lib/sanity/types/page";

// Statistics grid — DOC brief's "Statistics" section option.
export function StatsGrid({
  eyebrow,
  heading,
  headingAccent,
  items,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  items: StatItem[];
}) {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHead
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          center
        />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item._key} className="text-center">
              <p className="font-display text-navy text-3xl font-bold md:text-4xl">
                {item.value}
              </p>
              <p className="text-slate mt-2 text-sm">{item.label}</p>
              {item.subLabel ? (
                <p className="text-slate-2 mt-0.5 text-xs">{item.subLabel}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
