import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Studio "Open preview" -> here — DOC/SANITY_CMS_ARCHITECTURE.md § 6.
// Validates the shared secret, enables Draft Mode, redirects to the slug.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") ?? "/";

  if (
    !process.env.SANITY_STUDIO_PREVIEW_SECRET ||
    secret !== process.env.SANITY_STUDIO_PREVIEW_SECRET
  ) {
    return new Response("Invalid token", { status: 401 });
  }

  // Only ever redirect to a same-site path — never an attacker-controlled
  // absolute URL from searchParams (open-redirect prevention).
  const safeSlug = slug.startsWith("/") ? slug : "/";

  const draft = await draftMode();
  draft.enable();

  redirect(safeSlug);
}
