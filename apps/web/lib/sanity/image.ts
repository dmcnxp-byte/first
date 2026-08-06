import createImageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Thin wrapper around @sanity/image-url — components pass the result to
// next/image per DOC/FRONTEND_ARCHITECTURE.md § 4. No component consumes this
// yet; it exists so the image pipeline is wired before Phase 3 needs it.
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
