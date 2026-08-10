import type { LeadFormFieldName } from "@/lib/sanity/types/shared";

// Field-level validation — DOC/FORMS_ARCHITECTURE.md § 2. Built dynamically
// from the field list actually offered to the visitor (never trust a
// client-submitted field the page never rendered), and re-validated here
// server-side regardless of what client-side validation already did.
//
// A hand-rolled validator rather than `zod` (DOC/FORMS_ARCHITECTURE.md § 2
// calls for "a single zod schema") — this sandboxed environment has no npm
// registry access to add zod as a declared dependency (see
// PROJECT_STATUS.md Phase 3 notes). Behavior matches the documented rules
// exactly; swap in zod with no contract changes once registry access exists.

const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFormPayload = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  select?: string;
};

export type ValidationResult =
  | { valid: true; errors: Record<string, never>; normalized: LeadFormPayload }
  | { valid: false; errors: Partial<Record<keyof LeadFormPayload, string>> };

// Strips spaces/dashes and an optional country code down to a bare 10-digit
// Indian mobile number — the one format stored in Supabase and sent to the
// CRM/scoring, however the visitor typed it (with +91, with 0-prefix, with
// spaces, pasted from anywhere). Returns null when what's left isn't valid.
export function normalizeIndianPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let core = digits;
  if (core.length === 12 && core.startsWith("91")) core = core.slice(2);
  else if (core.length === 11 && core.startsWith("0")) core = core.slice(1);
  return INDIAN_MOBILE_RE.test(core) ? core : null;
}

// Trims and lowercases so the same address always lands in Supabase the same
// way regardless of casing/whitespace the visitor typed.
export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  return EMAIL_RE.test(email) ? email : null;
}

export function validateLeadFormPayload(
  fields: LeadFormFieldName[],
  payload: LeadFormPayload,
  selectOptions?: string[],
): ValidationResult {
  const errors: Partial<Record<keyof LeadFormPayload, string>> = {};
  const normalized: LeadFormPayload = {};

  if (fields.includes("name")) {
    const name = payload.name?.trim() ?? "";
    if (name.length < 2 || name.length > 80) {
      errors.name = "Please enter your full name.";
    } else {
      normalized.name = name;
    }
  }

  if (fields.includes("phone")) {
    const phone = normalizeIndianPhone(payload.phone ?? "");
    if (!phone) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    } else {
      normalized.phone = phone;
    }
  }

  if (fields.includes("email")) {
    const email = normalizeEmail(payload.email ?? "");
    if (!email) {
      errors.email = "Please enter a valid email address.";
    } else {
      normalized.email = email;
    }
  }

  if (fields.includes("city")) {
    // city is optional even when present, per DOC/FORMS_ARCHITECTURE.md § 2 — no validation.
    const city = payload.city?.trim();
    if (city) normalized.city = city;
  }

  if (fields.includes("select")) {
    const select = payload.select?.trim() ?? "";
    if (!select) {
      errors.select = "Please make a selection.";
    } else if (
      selectOptions &&
      selectOptions.length > 0 &&
      !selectOptions.includes(select)
    ) {
      errors.select = "Selection is not one of the offered options.";
    } else {
      normalized.select = select;
    }
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return { valid: true, errors: {}, normalized };
}
