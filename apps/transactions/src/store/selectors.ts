import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index'
import type { Transaction } from '@bytebank/types'

// ─── Seletores base ──────────────────────────────────────────────────────────

const selectItems = (state: RootState) => state.transactions.items
const selectFilters = (state: RootState) => state.transactions.filters
const selectCurrentPage = (state: RootState) => state.transactions.currentPage
const selectPageSize = (state: RootState) => state.transactions.pageSize

// ─── Seletor memorizado: transações filtradas ────────────────────────────────

export const selectFilteredTransactions = createSelector(
  [selectItems, selectFilters],
  (items, filters): Transaction[] => {
    return items.filter((t) => {
      if (filters.type && filters.type !== 'all' && t.type !== filters.type)
        return false

      if (filters.dateFrom && new Date(t.date) < new Date(filters.dateFrom))
        return false

      if (filters.dateTo && new Date(t.date) > new Date(filters.dateTo))
        return false

      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matchesType = t.type.toLowerCase().includes(q)
        const matchesValue = String(Math.abs(t.value)).includes(q)
        const matchesFrom = (t.from ?? '').toLowerCase().includes(q)
        const matchesTo = (t.to ?? '').toLowerCase().includes(q)
        if (!matchesType && !matchesValue && !matchesFrom && !matchesTo)
          return false
      }

      return true
    })
  }
)

// ─── Seletor memorizado: página atual ───────────────────────────────────────

export const selectPaginatedTransactions = createSelector(
  [selectFilteredTransactions, selectCurrentPage, selectPageSize],
  (filtered, page, pageSize): Transaction[] => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }
)

// ─── Seletor memorizado: total de páginas ────────────────────────────────────

export const selectTotalPages = createSelector(
  [selectFilteredTransactions, selectPageSize],
  (filtered, pageSize): number => Math.max(1, Math.ceil(filtered.length / pageSize))
)

// ─── Seletor memorizado: total filtrado ─────────────────────────────────────

export const selectFilteredCount = createSelector(
  [selectFilteredTransactions],
  (filtered): number => filtered.length
)

// ─── Re-exporta seletores base para uso direto ───────────────────────────────

export { selectCurrentPage, selectFilters }
