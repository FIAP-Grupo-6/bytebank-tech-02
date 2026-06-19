'use client'

import { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { Plus } from 'lucide-react'
import { Button, Alert } from '@bytebank/ui'
import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTransactions } from '@/store/slices/transactionsSlice'
import { TransactionFilters } from '@/components/TransactionFilters'
import { TransactionList } from '@/components/TransactionList'
import { TransactionModal } from '@/components/TransactionModal'
import type { Transaction } from '@bytebank/types'

interface Props {
  accountId: string
  token: string
}

function TransactionPageContent({ accountId, token }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const dispatch = useAppDispatch()
  const status = useAppSelector((s) => s.transactions.status)
  const error = useAppSelector((s) => s.transactions.error)
  // Evita double fetch do React 18 Strict Mode (monta/desmonta/remonta em dev)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!accountId || !token) return
    if (fetchedRef.current) return
    fetchedRef.current = true
    dispatch(fetchTransactions({ accountId, token }))
  }, [accountId, token, dispatch])

  const openCreate = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const openEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Transações</h1>
          <p className="text-sm text-muted-foreground">
            Histórico completo da sua conta
          </p>
        </div>
        <Button
          onClick={openCreate}
          disabled={!accountId || status === 'loading'}
          aria-label="Abrir formulário de nova transação"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Nova transação
        </Button>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <TransactionFilters />
      <TransactionList onEdit={openEdit} />

      <TransactionModal
        key={editingTransaction?.id ?? 'create'}
        isOpen={isModalOpen}
        onClose={closeModal}
        accountId={accountId}
        token={token}
        editTransaction={editingTransaction}
      />
    </div>
  )
}

export function TransactionPage(props: Props) {
  return (
    <Provider store={store}>
      <TransactionPageContent {...props} />
    </Provider>
  )
}
