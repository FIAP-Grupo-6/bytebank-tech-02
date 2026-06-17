import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getAccount } from '@bytebank/api-client'
import type { Account, Transaction, Card } from '@bytebank/types'

// ─── Estado ─────────────────────────────────────────────────────────────────

interface AccountState {
  account: Account | null
  transactions: Transaction[]
  cards: Card[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AccountState = {
  account: null,
  transactions: [],
  cards: [],
  status: 'idle',
  error: null,
}

// ─── Thunk assíncrono ────────────────────────────────────────────────────────

export const fetchAccount = createAsyncThunk<
  { account: Account; transactions: Transaction[]; cards: Card[] },
  { token: string },
  { rejectValue: string }
>('account/fetch', async ({ token }, { rejectWithValue }) => {
  try {
    const response = await getAccount(token)
    const { account, transactions, cards } = response.result
    return {
      account: account[0],
      transactions,
      cards,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar conta'
    return rejectWithValue(message)
  }
})

// ─── Slice ───────────────────────────────────────────────────────────────────

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.account = action.payload.account
        state.transactions = action.payload.transactions
        state.cards = action.payload.cards
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Erro desconhecido'
      })
  },
})

export const { addTransaction } = accountSlice.actions
export default accountSlice.reducer
