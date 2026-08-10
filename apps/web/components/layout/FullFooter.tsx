import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import type { FooterColumn } from "@/lib/sanity/types/siteSettings";

// `full` Footer variant — DOC/LAYOUT_ARCHITECTURE.md § 3. 4-column grid
// (Brand + editor-managed link columns from Site Settings) + a base bar.
// Link lists are never hardcoded, per DOC/LAYOUT_ARCHITECTURE.md § 3.
export function FullFooter({
  tagline,
  legalEntityName,
  cin,
  registeredOfficeAddress,
  footerColumns,
}: {
  tagline?: string;
  legalEntityName?: string;
  cin?: string;
  registeredOfficeAddress?: string;
  footerColumns: FooterColumn[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark mt-16 pb-8 pt-16 text-white/65 print:hidden">
      <Container>
        <div className="border-white/8 xs:grid-cols-2 grid grid-cols-1 gap-8 border-b pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-12">
          <div>
            <Logo variant="reverse" />
            {tagline ? (
              <p className="font-voice my-4 max-w-[32ch] text-base italic text-white/75">
                {tagline}
              </p>
            ) : null}
            <p className="mt-4 text-xs leading-relaxed text-white/50">
              {legalEntityName ? (
                <>
                  {legalEntityName}
                  <br />
                </>
              ) : null}
              {cin ? (
                <>
                  CIN: {cin}
                  <br />
                </>
              ) : null}
              {registeredOfficeAddress}
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="font-display mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-saffron-2 text-sm text-white/65"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 pt-8 text-xs">
          <span>
            © {year} {legalEntityName ?? "Distance MBA College"}. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-saffron-2">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-saffron-2">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
