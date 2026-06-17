import type { Transaction } from '@bytebank/types'

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function progressColor(pct: number, alertThreshold = 80): string {
  if (pct >= 100) return 'hsl(var(--destructive))'
  if (pct >= alertThreshold) return 'hsl(38, 92%, 50%)'
  return 'hsl(var(--success))'
}

export function currentMonthDebit(transactions: Transaction[]): number {
  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  return transactions
    .filter((t) => t.type === 'Debit' && new Date(t.date) >= start)
    .reduce((acc, t) => acc + Math.abs(t.value), 0)
}
