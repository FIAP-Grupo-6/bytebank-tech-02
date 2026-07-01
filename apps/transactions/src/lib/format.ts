export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatAbsoluteBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency',
    currency: 'BRL'
  }).format(Math.abs(value))
}

export function formatDecimal(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
