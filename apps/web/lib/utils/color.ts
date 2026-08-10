const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{3,8}$/;

/**
 * Validates a CMS-editor-supplied hex color before it's interpolated into a
 * `<style>` tag (Site Settings' theme overrides) — guards against CSS/markup
 * injection from Sanity content. Returns `undefined` for anything that
 * doesn't match a plain hex color.
 */
export function sanitizeHexColor(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return HEX_COLOR_PATTERN.test(value) ? value : undefined;
}
