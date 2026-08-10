#!/usr/bin/env node
// One-time data-prep script — normalizes design/University.csv into NDJSON
// University documents matching apps/web/sanity/schemaTypes/documents/university.ts.
// Run: node scripts/normalize-universities.mjs
//
// Per PROJECT_STATUS.md Phase 3 notes: Fees are messy (plain integers,
// comma-grouped "lakh" strings, one range value, trailing "/-"); Duration
// and Eligibility are uniform placeholder text across all 30 rows. This
// script normalizes what is mechanically normalizable (fee display + numeric
// min/max) and copies the rest verbatim into the hidden `csvLegacy*` staging
// fields — it never invents Duration/Eligibility content. See
// DOC/DATA_MODEL.md § University field notes.
//
// Universities featured on the Homepage (isFeaturedOnHomepage: true) are the
// same 8 institutions shown in design/homepage.html's "Featured Universities"
// grid (NMIMS, Symbiosis, Amity, Manipal Jaipur, Chandigarh, Jain, LPU, BITS
// Pilani), in the same order (featuredOrder), cross-checked against
// DOC/DATA_MODEL.md § 4's private-university priority tiers. Three IIM rows
// and Sikkim Manipal University are deliberately NOT featured — see the
// flags below and PROJECT_STATUS.md for why.
//
// FEATURED_POSITIONING carries the exact "Best for" line from each matching
// university-nmims.html/homepage.html card into `positioningStatement` — the
// CSV has no such field at all, so this isn't overriding CSV data, it's
// filling a CSV gap with real copy from the other approved bootstrap source,
// for the specific named entities that copy was actually written about.
// Every other (non-featured) university keeps the mechanically-derived
// generic positioningStatement below, since no bespoke copy exists for them
// — per "do not invent missing information."

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, "../design/University.csv");
const outPath = path.join(__dirname, "../apps/web/sanity/seed/universities.ndjson");

// Order matches design/homepage.html's Featured Universities grid exactly.
const FEATURED_ORDER = [
  "nmims-sce",
  "symbiosis-ssodl",
  "amity-university-online",
  "manipal-university-jaipur",
  "chandigarh-university",
  "jain-university-online-mba",
  "lpu-online-mba",
  "bits-pilani",
];
const FEATURED_SLUGS = new Set(FEATURED_ORDER);

// Verbatim "Best for" copy from each matching card in design/homepage.html.
const FEATURED_POSITIONING = {
  "nmims-sce": "Corporate management roles at brand-conscious employers",
  "symbiosis-ssodl": "Marketing, HR, Digital Marketing specialisations",
  "amity-university-online": "Flexibility plus strong national brand recognition",
  "manipal-university-jaipur": "Digital-first learning experience",
  "chandigarh-university": "Scholarship-friendly, affordable tier-1 brand",
  "jain-university-online-mba": "South India base, modern curriculum",
  "lpu-online-mba": "Tier 2/3 affordability, large alumni base",
  "bits-pilani": "Executive MBA, tech-leaning senior professionals",
};

// Government-sector / historically-complicated rows — never counseled on
// per BR-2 (IIMs) or flagged for verification before publish (Sikkim
// Manipal, per DOC/DATA_MODEL.md § 4 point 5). Imported as data (never
// silently discarded) but never featured, and left unpublished-equivalent
// (isFeaturedOnHomepage: false, plus an internal flag) pending stakeholder
// review — see PROJECT_STATUS.md.
const GOVERNMENT_SECTOR_SLUGS = new Set(["iim-lucknow", "iim-kashipur", "iim-rohtak"]);
const FLAGGED_FOR_VERIFICATION_SLUGS = new Set(["sikkim-manipal-university"]);

function parseCsv(text) {
  const lines = text.trim().split("\n");
  const rows = [];
  let i = 1; // skip header
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    // Simple CSV parser handling quoted fields (sufficient for this file's shape).
    const fields = [];
    let cur = "";
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        fields.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    fields.push(cur);
    rows.push(fields);
    i++;
  }
  return rows;
}

function normalizeFee(raw) {
  const cleaned = raw.replace(/\/-$/, "").trim();

  if (cleaned.includes(" to ")) {
    const [minRaw, maxRaw] = cleaned.split(" to ").map((s) => s.replace(/\/-$/, "").replace(/,/g, "").trim());
    const min = Number(minRaw);
    const max = Number(maxRaw);
    return { feeDisplay: `${formatLakh(min)} – ${formatLakh(max)}`, feeMin: min, feeMax: max };
  }

  const numeric = Number(cleaned.replace(/,/g, ""));
  if (Number.isNaN(numeric)) {
    return { feeDisplay: raw, feeMin: undefined, feeMax: undefined };
  }
  return { feeDisplay: formatLakh(numeric), feeMin: numeric, feeMax: numeric };
}

function formatLakh(amount) {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

function universityType(accreditation, name) {
  const lower = `${accreditation} ${name}`.toLowerCase();
  if (lower.includes("iim") || lower.includes("indian school of business")) return "b-school";
  if (lower.includes("xlri") || lower.includes("great lakes") || lower.includes("welingkar")) return "b-school";
  return "private";
}

const csvText = readFileSync(csvPath, "utf-8");
const rows = parseCsv(csvText);

const docs = rows.map(([name, slug, studyMode, duration, accreditation, fees, eligibility]) => {
  const { feeDisplay, feeMin, feeMax } = normalizeFee(fees.trim());
  const trimmedSlug = slug.trim();
  const isGovernmentSector = GOVERNMENT_SECTOR_SLUGS.has(slug);
  const isFlaggedForVerification = FLAGGED_FOR_VERIFICATION_SLUGS.has(slug);
  const isFeatured = FEATURED_SLUGS.has(trimmedSlug);
  const featuredOrder = isFeatured ? FEATURED_ORDER.indexOf(trimmedSlug) + 1 : undefined;

  const trustBadges = accreditation
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((label) => ({ _type: "accreditationBadge", _key: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label }));

  return {
    _id: `university.${slug}`,
    _type: "university",
    name: name.trim(),
    slug: { _type: "slug", current: slug.trim() },
    universityType: universityType(accreditation, name),
    positioningStatement: isGovernmentSector
      ? "Government-sector institute — not counseled on per BR-2; imported for data completeness only, not for public display."
      : (FEATURED_POSITIONING[trimmedSlug] ?? `${studyMode.trim()} MBA programme`),
    trustBadges,
    quickFacts: {
      feeDisplay,
      ...(feeMin !== undefined ? { feeMin } : {}),
      ...(feeMax !== undefined ? { feeMax } : {}),
      durationDisplay: duration.trim(),
    },
    isFeaturedOnHomepage: isFeatured,
    ...(featuredOrder !== undefined ? { featuredOrder } : {}),
    ...(isGovernmentSector
      ? { editorialFlag: "government-sector-do-not-publish" }
      : isFlaggedForVerification
        ? { editorialFlag: "verification-needed" }
        : {}),
    seo: {
      _type: "seo",
      title: `${name.trim()} — Distance MBA College`,
      description: `${name.trim()} MBA programme details, fees, and eligibility — placeholder SEO copy pending editorial review.`,
    },
    csvLegacyFeeRaw: fees.trim(),
    csvLegacyDurationRaw: duration.trim(),
    csvLegacyEligibilityRaw: eligibility.trim(),
  };
});

writeFileSync(outPath, docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} university documents to ${outPath}`);
console.log(`Featured on homepage: ${docs.filter((d) => d.isFeaturedOnHomepage).length}`);
console.log(`Flagged for editorial review: ${docs.filter((d) => d.editorialFlag).length}`);
