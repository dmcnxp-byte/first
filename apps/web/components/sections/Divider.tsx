import { Container } from "@/components/ui/Container";

// Pure visual spacer/rule between page-builder sections. `bare` skips the
// self-contained Container — used when StickySidebarRegion already supplies
// one shared Container for the whole sticky-sidebar region (see
// components/page-builder/SectionRenderer.tsx).
export function Divider({
  style = "line",
  bare,
}: {
  style?: "line" | "space";
  bare?: boolean;
}) {
  if (style === "space") {
    return <div className="h-12 md:h-20" aria-hidden="true" />;
  }

  if (bare) {
    return <hr className="border-hairline my-8 border-t md:my-12" />;
  }

  return (
    <div className="py-8 md:py-12">
      <Container>
        <hr className="border-hairline border-t" />
      </Container>
    </div>
  );
}
