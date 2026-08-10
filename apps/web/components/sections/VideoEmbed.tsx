import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";

// DOC brief's "Video" section option. Accepts a plain YouTube/Vimeo URL and
// converts it to its embeddable form rather than requiring editors to paste
// an iframe embed URL by hand.
function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      return `https://player.vimeo.com/video${parsed.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}

export function VideoEmbed({
  eyebrow,
  heading,
  headingAccent,
  videoUrl,
  caption,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  videoUrl: string;
  caption?: string;
}) {
  return (
    <section className="py-16 md:py-20">
      <Container narrow>
        <SectionHead
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          center
        />
        <div className="border-hairline overflow-hidden rounded-xl border bg-black">
          <div className="relative aspect-video">
            <iframe
              src={toEmbedUrl(videoUrl)}
              title={heading}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        {caption ? (
          <p className="text-slate mt-3 text-center text-sm">{caption}</p>
        ) : null}
      </Container>
    </section>
  );
}
