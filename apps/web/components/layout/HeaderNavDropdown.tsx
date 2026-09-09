import Link from "next/link";
import type { NavLink } from "@/lib/sanity/types/siteSettings";

// Desktop nav dropdown — design/homepage.html's `.nav-dropdown:hover
// .nav-dropdown-menu { display: block }`: opens on hover, no click required.
// Pure CSS (`group`/`group-hover`), no JS state — this component only ever
// renders inside FullHeader's desktop `nav` (hidden below the `md` (880px)
// breakpoint), never inside MobileNavDrawer, so it can't affect mobile.
//
// The menu's own wrapper carries the 8px top offset as `pt-2` (padding, not
// margin) so its hit-area touches the toggle with zero gap — the pointer is
// always over a descendant of `.group` while moving from toggle to menu, so
// hover never drops in that gap. `group-focus-within` keeps it open for
// keyboard users tabbing through the links, with no extra JS.
export function HeaderNavDropdown({ label, links }: { label: string; links: NavLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className="text-slate hover:text-navy group-focus-within:text-navy inline-flex items-center gap-1 py-2"
      >
        {label}
        <span aria-hidden="true" className="text-[10px] opacity-60">
          ▾
        </span>
      </button>
      {/*
        w-[max-content] (bracket-escaped), not the bare `w-max` utility:
        this project's globals.css defines a custom `--container-max` theme
        token, and Tailwind v4 wires every `--container-*` theme key into
        the `w-*`/`max-w-*` namespace too — so plain `w-max` resolves
        against `--container-max` (1180px) instead of the CSS keyword
        `max-content`, stretching the dropdown across the header. The
        max-w caps it against the viewport so an unexpectedly long,
        Sanity-authored link label still can't push it past the screen
        edge on narrower desktop/tablet widths.
      */}
      <div className="absolute top-full left-[-16px] hidden w-[max-content] max-w-[min(320px,calc(100vw-2rem))] pt-2 group-focus-within:block group-hover:block">
        <div
          role="menu"
          className="border-hairline flex min-w-[220px] flex-col rounded-md border bg-white p-3 shadow-lg"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className="text-ink hover:bg-mist hover:text-navy block rounded-sm p-3 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
