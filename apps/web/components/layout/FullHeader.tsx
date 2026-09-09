import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { HeaderNavDropdown } from "./HeaderNavDropdown";
import { MobileNavDrawer } from "./MobileNavDrawer";
import type { NavLink } from "@/lib/sanity/types/siteSettings";

// `full` Header variant — DOC/LAYOUT_ARCHITECTURE.md § 2. Sticky, with
// Programmes/Universities dropdowns, phone, CTA, and a real (focus-trapped)
// mobile drawer behind the hamburger.
export function FullHeader({
  phone,
  programmesLinks,
  universitiesLinks,
}: {
  phone: string;
  programmesLinks: NavLink[];
  universitiesLinks: NavLink[];
}) {
  return (
    <header className="border-hairline/50 bg-cream/92 sticky top-0 z-50 border-b backdrop-blur-md backdrop-saturate-[1.4] print:hidden">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 text-sm font-medium md:flex"
        >
          <HeaderNavDropdown label="Programmes" links={programmesLinks} />
          <HeaderNavDropdown label="Universities" links={universitiesLinks} />
          <Link href="/compare" className="text-slate hover:text-navy">
            Compare
          </Link>
          <Link href="/resources" className="text-slate hover:text-navy">
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <PhoneLink
            phone={phone}
            pageType="homepage"
            className="text-navy hover:text-saffron hidden items-center gap-2 text-sm font-semibold lg:inline-flex"
          >
            <span aria-hidden="true" className="text-base opacity-70">
              ☎
            </span>
            {phone}
          </PhoneLink>
          <Button
            href="#lead"
            variant="primary"
            size="sm"
            className="hidden md:inline-flex"
          >
            Talk to a counsellor
          </Button>
          <MobileNavDrawer
            programmesLinks={programmesLinks}
            universitiesLinks={universitiesLinks}
          />
        </div>
      </Container>
    </header>
  );
}
