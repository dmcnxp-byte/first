import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

// Sanity webhook -> revalidation — DOC/SANITY_CMS_ARCHITECTURE.md § 7.
// Fires on any document publish/unpublish/delete; validates a shared secret,
// then revalidates the document's own tag plus, for global-chrome documents
// (Site Settings only, now that Homepage/Navigation no longer exist as
// singletons), the broader `sanity:global` tag since it affects every page's
// header/footer.
const GLOBAL_TYPES = new Set(["siteSettings"]);

export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-webhook-secret");
  if (
    !process.env.SANITY_REVALIDATE_SECRET ||
    secret !== process.env.SANITY_REVALIDATE_SECRET
  ) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret." },
      { status: 401 },
    );
  }

  let body: { _id?: string; _type?: string; slug?: string; isHomepage?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { _id, _type, slug, isHomepage } = body;
  if (!_id || !_type) {
    return NextResponse.json(
      { revalidated: false, message: "Missing _id/_type." },
      { status: 400 },
    );
  }

  // Type-level tag — matches what list/singleton queries actually tag with
  // today (e.g. `sanity:university` for the featured-universities query).
  revalidateTag(`sanity:${_type}`, "max");
  // Document-level tag — a no-op today (no query tags at this granularity
  // yet) but forward-compatible once per-document detail-page queries exist.
  revalidateTag(`sanity:${_type}:${_id}`, "max");
  if (GLOBAL_TYPES.has(_type)) {
    revalidateTag("sanity:global", "max");
  }

  // Path-specific revalidation for Page documents — belt-and-suspenders
  // alongside the tag-based revalidation above, per
  // DOC/SANITY_CMS_ARCHITECTURE.md § 7. Requires the webhook's GROQ
  // projection to include `slug`/`isHomepage` (configured on the Sanity
  // project's webhook, not in this repo).
  if (_type === "page" && slug) {
    revalidatePath(isHomepage ? "/" : `/${slug}`);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
