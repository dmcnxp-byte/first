import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormConfig } from "@/lib/sanity/types/shared";
import type { LeadSourceContext } from "@/lib/leads/scoring";

// Reproduces design/top-distance-mba-finance.html's `.lp-body` sticky-sidebar
// pattern: a CSS grid with `align-items:start` sizes its row to the tallest
// column (the left/main content). The right column's `position:sticky`
// element is then confined to that row's height by its own grid-area
// containing block — it sticks while the row is on screen and releases
// naturally at the row's bottom edge, i.e. right where this page's own
// sections end and the (unrelated, always-full-width) global footer begins.
// No JS scroll listener, no manual height/offset calculation.
//
// Used once per page by SectionRenderer, only when a `heroSplitBlock` is
// present — every other page keeps the plain single-column stack.
export function StickySidebarRegion({
  heroContent,
  children,
  form,
  source,
}: {
  heroContent: React.ReactNode;
  children: React.ReactNode;
  form: LeadFormConfig;
  source: LeadSourceContext;
}) {
  return (
    <Container>
      <div className="grid grid-cols-1 gap-8 pt-8 pb-14 md:pt-10 md:pb-16 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-9">
        <div className="min-w-0">
          {heroContent}
          {children}
        </div>

        {/* Reference's header is 60px + a 16px gap ("top:76px"); this site's
            sticky header is 72px tall, so the offset is derived from that,
            not copied from the reference's own number. */}
        <div id="lead" className="order-first lg:sticky lg:top-[84px] lg:order-none">
          <LeadForm config={form} context={source} />
        </div>
      </div>
    </Container>
  );
}
