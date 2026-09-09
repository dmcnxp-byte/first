"use client";

import { createContext, useContext, useMemo, useState } from "react";

// Opt-in bridge between a university card's CTA and the page's LeadForm —
// lets clicking "Get this shortlisted" on universityShortlistBlock show an
// "Interested in: X" chip on the form and carry that name into the
// submitted lead (merged server-side into the existing `select`/interest
// signal — see app/api/leads/route.ts). Purely additive: SectionRenderer
// wraps every page in this provider (see components/page-builder/
// SectionRenderer.tsx), but it only does anything when a page has both a
// universityShortlistBlock and a leadFormBlock — every other page's
// LeadForm renders exactly as before.
type SelectedUniversityContextValue = {
  selected: string | null;
  select: (name: string) => void;
  clear: () => void;
};

const SelectedUniversityContext = createContext<SelectedUniversityContextValue>({
  selected: null,
  select: () => {},
  clear: () => {},
});

export function SelectedUniversityProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);

  const value = useMemo<SelectedUniversityContextValue>(
    () => ({
      selected,
      select: (name: string) => setSelected(name),
      clear: () => setSelected(null),
    }),
    [selected],
  );

  return (
    <SelectedUniversityContext.Provider value={value}>
      {children}
    </SelectedUniversityContext.Provider>
  );
}

export function useSelectedUniversity() {
  return useContext(SelectedUniversityContext);
}
