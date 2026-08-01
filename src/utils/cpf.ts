export function normalizeCpf(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCpf(value: string): string {
  const digits = normalizeCpf(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function checkDigit(base: string): number {
  let sum = 0
  for (let i = 0; i < base.length; i += 1) {
    sum += Number(base[i]) * (base.length + 1 - i)
  }
  const remainder = (sum * 10) % 11
  return remainder === 10 ? 0 : remainder
}

export function isValidCpf(value: string): boolean {
  const cpf = normalizeCpf(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  const base = cpf.slice(0, 9)
  const d1 = checkDigit(base)
  const d2 = checkDigit(base + d1)
  return cpf === `${base}${d1}${d2}`
}
