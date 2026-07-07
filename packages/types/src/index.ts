// ─── Usuário ───────────────────────────────────────────────────────────────

export interface User {
  id: string
  username: string
  email: string
}

export interface CreateUserPayload {
  username: string
  email: string
  password: string
}

export interface AuthPayload {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  result: {
    token: string
  }
}

// ─── Conta ─────────────────────────────────────────────────────────────────

export interface Account {
  id: string
  type: 'Debit' | 'Credit'
  userId: string
}

export interface Card {
  id: string
  accountId: string
  type: 'Debit' | 'Credit'
  is_blocked: boolean
  number: string
  dueDate: string
  functions: string
  cvc: string
  paymentDate: string | null
  name: string
}

// ─── Transações ────────────────────────────────────────────────────────────

export type TransactionType = 'Credit' | 'Debit'

export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  value: number
  from?: string
  to?: string
  anexo?: string
  date: string
}

export interface CreateTransactionPayload {
  accountId: string
  type: TransactionType
  value: number
  from?: string
  to?: string
  anexo?: string
}

// ─── Resposta GET /account ─────────────────────────────────────────────────

export interface AccountData {
  account: Account[]
  transactions: Transaction[]
  cards: Card[]
}

export interface AccountResponse {
  message: string
  result: AccountData
}

// ─── Extrato ───────────────────────────────────────────────────────────────

export interface StatementResponse {
  message: string
  result: {
    transactions: Transaction[]
  }
}

// ─── Filtros de transação ──────────────────────────────────────────────────

export interface TransactionFilters {
  type?: TransactionType | 'all'
  category?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  pageSize?: number
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export interface DashboardSummary {
  balance: number
  totalCredit: number
  totalDebit: number
  recentTransactions: Transaction[]
}
