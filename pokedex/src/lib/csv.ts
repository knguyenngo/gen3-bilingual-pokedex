// src/lib/csv.ts
export const parseMaybeList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String)

  if (typeof value === 'string') {
    const s = value.trim()
    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s)
        return Array.isArray(parsed) ? parsed.map(String) : [s]
      } catch {
        return [s]
      }
    }

    // already comma-joined
    if (s.includes(',')) return s.split(',').map(x => x.trim()).filter(Boolean)

    return s ? [s] : []
  }

  return value == null ? [] : [String(value)]
}

