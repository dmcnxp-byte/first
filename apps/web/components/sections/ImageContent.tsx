import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { urlForImage } from "@/lib/sanity/image";
import { cn } from "@/lib/utils/cn";
import type { SanityImage } from "@/lib/sanity/types/shared";
import type { Cta } from "@/lib/sanity/types/shared";

// Image + text split section — for low-structure marketing pages (About,
// Landing) per DOC/PAGE_BUILDER_ARCHITECTURE.md's Task 4 page strategy.
export function ImageContent({
  image,
  alt,
  imagePosition = "left",
  eyebrow,
  heading,
  headingAccent,
  body,
  cta,
}: {
  image: SanityImage;
  alt: string;
  imagePosition?: "left" | "right";
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  body?: string;
  cta?: Cta;
}) {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <Image
            src={urlForImage(image).width(800).height(600).url()}
            alt={alt}
            width={800}
            height={600}
            className={cn(
              "h-auto w-full rounded-xl object-cover",
              imagePosition === "right" && "md:order-2",
            )}
          />
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <Heading as="h2" accent={headingAccent}>
              {heading}
            </Heading>
            {body ? (
              <p className="text-slate mt-4 text-lg leading-relaxed">{body}</p>
            ) : null}
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
