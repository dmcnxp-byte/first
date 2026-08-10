import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import type { SpecializationCard } from "@/lib/sanity/types/page";

// Specialisations grid — DOC/REQUIREMENTS_ANALYSIS.md § 9.
export function SpecializationsGrid({
  eyebrow,
  heading,
  headingAccent,
  items,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  items: SpecializationCard[];
}) {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHead eyebrow={eyebrow} heading={heading} headingAccent={headingAccent} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const CardContent = (
              <>
                <h4 className="font-display text-navy font-semibold">{item.name}</h4>
                {item.description ? (
                  <p className="text-slate mt-1 text-sm">{item.description}</p>
                ) : null}
                <span aria-hidden="true" className="text-saffron mt-auto">
                  →
                </span>
              </>
            );
            const cardClassName =
              "border-hairline hover:border-saffron flex flex-col gap-1 rounded-xl border bg-white p-5 transition-[transform,border-color] duration-200 hover:-translate-y-px";
            return item.href ? (
              <Link key={item._key} href={item.href} className={cardClassName}>
                {CardContent}
              </Link>
            ) : (
              <div key={item._key} className={cardClassName}>
                {CardContent}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
