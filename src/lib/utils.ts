/**
 * Minimal class-name combiner (clsx-style). Joins truthy string classes.
 * Used by the mapcn map component and other UI helpers.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}