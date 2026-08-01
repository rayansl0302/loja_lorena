export function isSafeHttpUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true

  try {
    const url = new URL(trimmed)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function toSafeImageSrc(value: string | undefined | null): string | undefined {
  if (!value?.trim()) return undefined
  return isSafeHttpUrl(value) ? value.trim() : undefined
}
