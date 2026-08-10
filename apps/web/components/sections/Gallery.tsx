import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { urlForImage } from "@/lib/sanity/image";
import type { GalleryImage } from "@/lib/sanity/types/page";

// Captioned image gallery — DOC brief's "Gallery" section option.
export function Gallery({
  eyebrow,
  heading,
  headingAccent,
  images,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  images: GalleryImage[];
}) {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHead eyebrow={eyebrow} heading={heading} headingAccent={headingAccent} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <figure key={image._key} className="overflow-hidden rounded-xl">
              <Image
                src={urlForImage(image).width(600).height(450).url()}
                alt={image.alt ?? ""}
                width={600}
                height={450}
                className="h-full w-full object-cover"
              />
              {image.caption ? (
                <figcaption className="text-slate mt-2 text-xs">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
