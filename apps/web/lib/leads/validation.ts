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

const INDIAN_MOBILE_RE = /^(\+?91[-\s]?)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFormPayload = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  select?: string;
};

export type ValidationResult =
  | { valid: true; errors: Record<string, never> }
  | { valid: false; errors: Partial<Record<keyof LeadFormPayload, string>> };

export function validateLeadFormPayload(
  fields: LeadFormFieldName[],
  payload: LeadFormPayload,
  selectOptions?: string[],
): ValidationResult {
  const errors: Partial<Record<keyof LeadFormPayload, string>> = {};

  if (fields.includes("name")) {
    const name = payload.name?.trim() ?? "";
    if (name.length < 2 || name.length > 80)
      errors.name = "Name must be 2-80 characters.";
  }

  if (fields.includes("phone")) {
    const phone = payload.phone?.replace(/\s/g, "") ?? "";
    if (!INDIAN_MOBILE_RE.test(phone))
      errors.phone = "Enter a valid Indian mobile number.";
  }

  if (fields.includes("email")) {
    const email = payload.email?.trim() ?? "";
    if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  }

  // city is optional even when present, per DOC/FORMS_ARCHITECTURE.md § 2 — no validation.

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
    }
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return { valid: true, errors: {} };
}
