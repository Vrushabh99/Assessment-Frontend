export function readStoredValue(key: string, fallback = null): string | null {
  const value = window.localStorage.getItem(key)
  if (!value) return fallback

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function writeStoredValue(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value))
}
