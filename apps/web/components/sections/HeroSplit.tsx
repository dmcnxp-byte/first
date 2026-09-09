import type { AccreditationBadge } from "@/lib/sanity/types/shared";
import type { StatItem } from "@/lib/sanity/types/page";

// Hero copy for the two-column campaign-landing-page hero
// (design/top-distance-mba-finance.html `.lp-main`'s hero portion) —
// eyebrow/heading/subhead/trust-strip/stats. Deliberately bare (no
// `<section>`/`<Container>`/grid of its own): it renders as the first item
// inside the shared left column that `StickySidebarRegion` builds, which
// owns the container/grid/sticky-form structure so this content can sit
// beside the sticky LeadForm exactly like the reference's `.lp-body`.
export function HeroSplitContent({
  eyebrow,
  heading,
  headingAccent,
  subhead,
  trustStrip,
  stats,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  subhead?: string;
  trustStrip?: { statValue: string; statLabel: string; badges: AccreditationBadge[] };
  stats?: StatItem[];
}) {
  return (
    <div className="min-w-0">
      {eyebrow ? (
        <span className="text-saffron mb-3.5 inline-flex items-center gap-2.5 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase">
          <span aria-hidden="true" className="bg-saffron h-0.5 w-6" />
          {eyebrow}
        </span>
      ) : null}

      <h1 className="font-display text-navy max-w-[18ch] text-[clamp(1.75rem,4.2vw,2.75rem)] leading-[1.1] font-bold tracking-[-0.022em]">
        {heading}
        {headingAccent ? (
          <>
            {" "}
            <span className="font-voice text-navy-2 font-medium italic">
              {headingAccent}
            </span>
          </>
        ) : null}
      </h1>

      {subhead ? (
        <p className="text-slate mt-3.5 max-w-[54ch] text-base leading-[1.65]">
          {subhead}
        </p>
      ) : null}

      {trustStrip ? (
        <div className="border-hairline mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[14px] border bg-white px-4 py-3.5">
          {trustStrip.badges[0] ? (
            <span className="bg-saffron-50 text-navy border-saffron/30 font-display rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap">
              {trustStrip.badges[0].label}
            </span>
          ) : null}
          <span className="text-slate text-[13px]">
            <strong className="font-display text-navy font-bold">
              {trustStrip.statValue}
            </strong>{" "}
            {trustStrip.statLabel}
          </span>
          {trustStrip.badges.slice(1).map((badge) => (
            <span key={badge._key} className="flex items-center gap-x-4">
              <span aria-hidden="true" className="bg-hairline h-4 w-px" />
              <span className="text-slate text-[13px]">{badge.label}</span>
            </span>
          ))}
        </div>
      ) : null}

      {stats && stats.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-[18px]">
          {stats.map((stat) => (
            <div key={stat._key} className="min-w-[150px] flex-1">
              <div className="font-display text-saffron text-2xl leading-none font-bold tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="text-slate mt-1 text-[13px] font-medium">{stat.label}</div>
              {stat.subLabel ? (
                <div className="text-slate-2 mt-0.5 text-xs">{stat.subLabel}</div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
