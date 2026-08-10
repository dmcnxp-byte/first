import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { urlForImage } from "@/lib/sanity/image";
import type { TestimonialItem } from "@/lib/sanity/types/page";

// Multiple attributed testimonials — DOC brief's "Testimonials" section
// option; distinct from `PullQuoteBand` (one unattributed brand-voice quote).
export function Testimonials({
  eyebrow,
  heading,
  headingAccent,
  items,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  items: TestimonialItem[];
}) {
  return (
    <section className="bg-mist py-16 md:py-20">
      <Container>
        <SectionHead eyebrow={eyebrow} heading={heading} headingAccent={headingAccent} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._key}
              className="border-hairline flex flex-col gap-4 rounded-xl border bg-white p-6"
            >
              <p className="text-ink flex-1 text-sm leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {item.photo ? (
                  <Image
                    src={urlForImage(item.photo).width(80).height(80).url()}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-navy font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-navy text-sm font-semibold">{item.name}</p>
                  {item.role ? <p className="text-slate text-xs">{item.role}</p> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
