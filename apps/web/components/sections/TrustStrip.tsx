import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { AccreditationBadge } from "@/lib/sanity/types/shared";

// Accreditation credibility band directly under the Hero — DOC/REQUIREMENTS_ANALYSIS.md § 7 `TrustStrip`.
export function TrustStrip({
  statValue,
  statLabel,
  badges,
}: {
  statValue: string;
  statLabel: string;
  badges: AccreditationBadge[];
}) {
  return (
    <div className="border-hairline border-y bg-white py-6">
      <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-slate text-sm">
          Trusted by <strong className="text-navy font-semibold">{statValue}</strong>{" "}
          {statLabel}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge) => (
            <Badge key={badge._key} tone="accreditation">
              {badge.label}
            </Badge>
          ))}
        </div>
      </Container>
    </div>
  );
}
