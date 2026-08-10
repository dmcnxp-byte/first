import { Container } from "@/components/ui/Container";

// Pure visual spacer/rule between page-builder sections.
export function Divider({ style = "line" }: { style?: "line" | "space" }) {
  if (style === "space") {
    return <div className="h-12 md:h-20" aria-hidden="true" />;
  }

  return (
    <div className="py-8 md:py-12">
      <Container>
        <hr className="border-hairline border-t" />
      </Container>
    </div>
  );
}
