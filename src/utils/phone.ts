export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatPhone(value: string): string {
  const digits = normalizePhone(value).slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

export function isValidPhone(value: string): boolean {
  const digits = normalizePhone(value)
  return digits.length === 10 || digits.length === 11
}
