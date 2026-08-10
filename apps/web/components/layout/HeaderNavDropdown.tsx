"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { NavLink } from "@/lib/sanity/types/siteSettings";

// Keyboard-operable disclosure widget — DOC/COMPONENT_ARCHITECTURE.md § 5:
// "click/Enter to open, aria-expanded, Escape to close, focus-trapped,
// touch-friendly" — replaces the mockups' hover-only CSS dropdown.
export function HeaderNavDropdown({ label, links }: { label: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  if (links.length === 0) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="text-navy hover:text-saffron inline-flex items-center gap-1 py-2 font-medium"
      >
        {label}
        <span
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="border-hairline absolute left-0 top-full mt-2 flex min-w-[220px] flex-col gap-1 rounded-lg border bg-white p-2 shadow-lg"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="text-ink hover:bg-mist hover:text-navy rounded-md px-3 py-2 text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
