'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setFilters, resetFilters } from '@/store/slices/transactionsSlice'
import { selectFilteredCount } from '@/store/selectors'
import { Card, CardContent, CardHeader, Input, Select, SelectItem, DatePicker } from '@bytebank/ui'

export function TransactionFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.transactions.filters)
  const total = useAppSelector(selectFilteredCount)

  return (
    <Card role="search" aria-label="Filtros de transação">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <span className="text-sm text-muted-foreground font-medium" aria-live="polite">
          {total} transaç{total !== 1 ? 'ões' : 'ão'} encontrada{total !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-xs text-primary hover:underline"
          aria-label="Limpar todos os filtros"
        >
          Limpar filtros
        </button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        <Input
          type="text"
          label="Buscar"
          placeholder="Buscar transação..."
          value={filters.search ?? ''}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
        />

        <Select
          label="Tipo"
          value={filters.type ?? 'all'}
          onValueChange={(v) =>
            dispatch(setFilters({ type: v as 'Credit' | 'Debit' | 'all' }))
          }
        >
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="Credit">Crédito</SelectItem>
          <SelectItem value="Debit">Débito</SelectItem>
        </Select>

        <DatePicker
          id="filter-date-from"
          label="De"
          placeholder="Data inicial"
          value={filters.dateFrom ?? ''}
          onChange={(v) => dispatch(setFilters({ dateFrom: v }))}
        />

        <DatePicker
          id="filter-date-to"
          label="Até"
          placeholder="Data final"
          value={filters.dateTo ?? ''}
          onChange={(v) => dispatch(setFilters({ dateTo: v }))}
        />
      </CardContent>
    </Card>
  )
}
