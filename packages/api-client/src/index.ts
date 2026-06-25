import type {
  AuthPayload,
  AuthResponse,
  AccountResponse,
  CreateTransactionPayload,
  Transaction,
  StatementResponse,
  CreateUserPayload,
} from '@bytebank/types'

const getBaseUrl = () =>
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// ─── Helpers ────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }

  return res.json()
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function createUser(payload: CreateUserPayload) {
  return apiFetch('/user', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function authUser(payload: AuthPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/user/auth', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ─── Conta ───────────────────────────────────────────────────────────────────

export async function getAccount(token: string): Promise<AccountResponse> {
  return apiFetch<AccountResponse>('/account', {}, token)
}

export async function getStatement(
  accountId: string,
  token: string
): Promise<StatementResponse> {
  return apiFetch<StatementResponse>(
    `/account/${accountId}/statement`,
    {},
    token
  )
}

// ─── Transações ──────────────────────────────────────────────────────────────

export async function createTransaction(
  payload: CreateTransactionPayload,
  token: string
): Promise<Transaction> {
  return apiFetch<Transaction>(
    '/account/transaction',
    { method: 'POST', body: JSON.stringify(payload) },
    token
  )
}

export async function updateTransaction(
  id: string,
  payload: Partial<CreateTransactionPayload>,
  token: string
): Promise<Transaction> {
  return apiFetch<Transaction>(
    `/account/transaction/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) },
    token
  )
}

export async function deleteTransaction(
  id: string,
  token: string
): Promise<void> {
  return apiFetch<void>(
    `/account/transaction/${id}`,
    { method: 'DELETE' },
    token
  )
}

// ─── Utilitários de cálculo ──────────────────────────────────────────────────

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => acc + t.value, 0)
}

export function calculateTotalCredit(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'Credit')
    .reduce((acc, t) => acc + t.value, 0)
}

export function calculateTotalDebit(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'Debit')
    .reduce((acc, t) => acc + Math.abs(t.value), 0)
}

export * from '@bytebank/types'
