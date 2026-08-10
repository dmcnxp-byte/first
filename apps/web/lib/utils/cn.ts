type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Minimal `clsx`-equivalent className joiner.
 *
 * DOC/FRONTEND_ARCHITECTURE.md § 5 and DOC/DEVELOPMENT_GUIDELINES.md § 3 call
 * for `class-variance-authority` (+ implicitly `clsx`) for primitive variant
 * styling. This sandboxed environment has no npm registry access (see
 * PROJECT_STATUS.md Phase 3 notes), so those packages can't be installed and
 * declared in package.json right now. This hand-rolled helper reproduces
 * `clsx`'s behavior exactly for the subset this project needs; swap in the
 * real package with no call-site changes once registry access is available.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }
  return out.join(" ");
}
