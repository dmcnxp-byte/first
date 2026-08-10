"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import type { NavLink } from "@/lib/sanity/types/siteSettings";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Real, focus-trapped mobile drawer behind the hamburger — DOC/COMPONENT_ARCHITECTURE.md § 5
// fixes the mockups' non-functional hamburger (nav links simply vanishing below 880px).
export function MobileNavDrawer({
  programmesLinks,
  universitiesLinks,
}: {
  programmesLinks: NavLink[];
  universitiesLinks: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span aria-hidden="true" className="bg-navy h-0.5 w-6 rounded-full" />
        <span aria-hidden="true" className="bg-navy h-0.5 w-6 rounded-full" />
        <span aria-hidden="true" className="bg-navy h-0.5 w-6 rounded-full" />
      </button>

      {open ? (
        <div className="z-100 fixed inset-0 md:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="bg-navy/40 absolute inset-0"
          />
          <div
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="absolute inset-y-0 right-0 flex w-[min(320px,85vw)] flex-col gap-6 overflow-y-auto bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-navy p-2 text-2xl"
              >
                ×
              </button>
            </div>

            {programmesLinks.length > 0 ? (
              <nav aria-label="Programmes">
                <p className="text-slate mb-2 text-xs font-semibold uppercase tracking-wide">
                  Programmes
                </p>
                <ul className="flex flex-col gap-1">
                  {programmesLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-ink hover:bg-mist block rounded-md px-2 py-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {universitiesLinks.length > 0 ? (
              <nav aria-label="Universities">
                <p className="text-slate mb-2 text-xs font-semibold uppercase tracking-wide">
                  Universities
                </p>
                <ul className="flex flex-col gap-1">
                  {universitiesLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-ink hover:bg-mist block rounded-md px-2 py-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <Link
              href="/compare"
              onClick={() => setOpen(false)}
              className="text-ink hover:bg-mist rounded-md px-2 py-2"
            >
              Compare
            </Link>
            <Link
              href="/resources"
              onClick={() => setOpen(false)}
              className="text-ink hover:bg-mist rounded-md px-2 py-2"
            >
              Resources
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
