/**
 * Normalizes a username for database lookups.
 * Converts to lowercase and trims whitespace.
 */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

/**
 * Formats a date to a short readable string.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncates a string to a maximum length with an ellipsis.
 */
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}