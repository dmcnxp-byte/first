import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanity Studio",
  robots: { index: false, follow: false },
};

// Sanity Studio manages its own chrome entirely — no marketing layout wraps it.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
