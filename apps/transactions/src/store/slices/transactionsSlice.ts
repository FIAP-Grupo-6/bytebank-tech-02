import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getStatement, deleteTransaction as deleteTransactionApi } from '@bytebank/api-client'
import type { Transaction, TransactionFilters } from '@bytebank/types'

// ─── Estado ─────────────────────────────────────────────────────────────────

interface TransactionState {
  items: Transaction[]
  filters: TransactionFilters
  currentPage: number
  pageSize: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  accountId: string
  token: string
}

const initialFilters: TransactionFilters = {
  type: 'all',
  category: '',
  dateFrom: '',
  dateTo: '',
  search: '',
}

const initialState: TransactionState = {
  items: [],
  filters: initialFilters,
  currentPage: 1,
  pageSize: 10,
  status: 'idle',
  error: null,
  accountId: '',
  token: '',
}

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchTransactions = createAsyncThunk<
  Transaction[],
  { accountId: string; token: string },
  { rejectValue: string }
>('transactions/fetchAll', async ({ accountId, token }, { rejectWithValue }) => {
  try {
    const data = await getStatement(accountId, token)
    return data.result.transactions
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Erro ao carregar transações'
    )
  }
})

export const deleteTransactionAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: { transactions: TransactionState } }
>('transactions/delete', async (id, { getState, rejectWithValue }) => {
  const { token } = getState().transactions
  try {
    await deleteTransactionApi(id, token)
    return id
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Erro ao excluir transação'
    )
  }
})

// Re-busca silenciosa após mutações — não altera o status de loading
export const refreshTransactions = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string; state: { transactions: TransactionState } }
>('transactions/refresh', async (_, { getState, rejectWithValue }) => {
  const { accountId, token } = getState().transactions
  if (!accountId || !token) return rejectWithValue('Sem credenciais')
  try {
    const data = await getStatement(accountId, token)
    return data.result.transactions
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Erro ao atualizar'
    )
  }
})

// ─── Slice ───────────────────────────────────────────────────────────────────

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.items.unshift(action.payload)
    },
    updateTransactionAction(state, action: PayloadAction<Transaction>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) state.items[idx] = action.payload
    },
    removeTransaction(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
    setFilters(state, action: PayloadAction<Partial<TransactionFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
      state.currentPage = 1
    },
    resetFilters(state) {
      state.filters = initialFilters
      state.currentPage = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.accountId = action.meta.arg.accountId
        state.token = action.meta.arg.token
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Erro desconhecido'
      })
      .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload)
      })
      .addCase(refreshTransactions.fulfilled, (state, action) => {
        state.items = action.payload
      })
  },
})

export const {
  addTransaction,
  updateTransactionAction,
  removeTransaction,
  setFilters,
  resetFilters,
  setPage,
} = transactionsSlice.actions

export default transactionsSlice.reducer
