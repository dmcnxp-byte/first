import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage, Cta } from "@/lib/sanity/types/shared";

// "You'll speak with a real person" trust device — a navy card with a large
// gradient-ringed avatar and an italic pull-quote, transcribed from
// design/homepage.html's `.counsel`/`.counsel-avatar`/`.counsel-quote` rules
// — DOC/REQUIREMENTS_ANALYSIS.md § 9, DOC/COMPONENT_ARCHITECTURE.md § 3 `CounsellorNote`.
export function CounsellorMoment({
  eyebrow,
  heading,
  headingAccent,
  quote,
  counsellorName,
  counsellorTitle,
  counsellorPhoto,
  cta,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  quote: string;
  counsellorName: string;
  counsellorTitle?: string;
  counsellorPhoto?: SanityImage;
  cta?: Cta;
}) {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHead eyebrow={eyebrow} heading={heading} headingAccent={headingAccent} />
        <div className="bg-navy grid grid-cols-1 items-center gap-8 rounded-2xl p-8 text-center sm:grid-cols-[auto_1fr] sm:gap-12 sm:p-12 sm:text-left lg:p-16">
          {counsellorPhoto ? (
            <Image
              src={urlForImage(counsellorPhoto).width(240).height(240).url()}
              alt={counsellorName}
              width={120}
              height={120}
              className="border-saffron mx-auto h-[120px] w-[120px] shrink-0 rounded-full border-[3px] object-cover sm:mx-0"
            />
          ) : (
            <div
              className="border-saffron text-saffron font-display mx-auto flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-full border-[3px] text-4xl font-semibold sm:mx-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-navy-2) 0%, var(--color-navy) 100%)",
              }}
            >
              {counsellorName.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-voice text-[clamp(1.125rem,2.4vw,1.75rem)] font-medium italic leading-[1.4] text-white">
              <span aria-hidden="true" className="text-saffron not-italic">
                &ldquo;
              </span>
              {quote}
            </p>
            <p className="font-display mt-6 text-sm font-semibold text-white">
              {counsellorName}
              {counsellorTitle ? (
                <span className="text-saffron-2 mt-1 block font-sans text-xs font-medium">
                  {counsellorTitle}
                </span>
              ) : null}
            </p>
            {cta ? (
              <div className="mt-6">
                <Button href={cta.href} variant={cta.style} withArrow>
                  {cta.label}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
