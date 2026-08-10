import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { urlForImage } from "@/lib/sanity/image";
import type { PartnerLogo } from "@/lib/sanity/types/page";

// Partner/client logo strip — DOC brief's "Partners" section option.
export function PartnersStrip({
  eyebrow,
  heading,
  headingAccent,
  logos,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  logos: PartnerLogo[];
}) {
  return (
    <section className="border-hairline border-y bg-white py-12">
      <Container>
        <SectionHead
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          center
        />
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((partner) => {
            const image = (
              <Image
                src={urlForImage(partner.logo).height(80).url()}
                alt={partner.name ?? ""}
                width={120}
                height={40}
                className="h-10 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
              />
            );
            return (
              <span key={partner._key}>
                {partner.href ? (
                  <a href={partner.href} target="_blank" rel="noopener noreferrer">
                    {image}
                  </a>
                ) : (
                  image
                )}
              </span>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
