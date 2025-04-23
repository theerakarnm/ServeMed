export function validateQuery(q: Record<string, (string | string[]) | null | undefined>): q is Record<string, string> {
  for (const [key, value] of Object.entries(q)) {
    if (value === undefined || value === null) {
      delete q[key];
    } else if (Array.isArray(value)) {
      q[key] = value.join(',');
    }
  }

  return true;
}

export function queryBuilder(q: { query?: Record<string, (string | string[]) | undefined> }) {
  if (!q.query) return '';

  // handle type Record<string, string | undefined> to Record<string, string>
  if (!validateQuery(q.query)) return '';
  const query = new URLSearchParams(q.query);
  return `?${query.toString()}`
}
