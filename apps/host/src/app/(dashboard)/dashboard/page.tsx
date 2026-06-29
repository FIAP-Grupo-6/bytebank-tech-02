import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getAccount,
  calculateBalance,
  calculateTotalCredit,
  calculateTotalDebit,
} from '@bytebank/api-client'
import { DashboardCards } from '@/components/DashboardCards'
import { Charts } from '@/components/Charts'
import { DashboardWidgets } from '@/components/DashboardWidgets'
import { RecentTransactions } from './RecentTransactions'
import type { Transaction, DashboardSummary } from '@bytebank/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken ?? ''

  let transactions: Transaction[] = []
  let fetchError = false

  try {
    const response = await getAccount(token)
    transactions = response.result.transactions
  } catch {
    fetchError = true
  }

  const summary: DashboardSummary = {
    balance: calculateBalance(transactions),
    totalCredit: calculateTotalCredit(transactions),
    totalDebit: calculateTotalDebit(transactions),
    recentTransactions: transactions.slice(0, 5),
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <header>
        <h1 className="text-xl font-semibold text-foreground">
          Olá, {session?.user?.name?.split(' ')[0] ?? 'visitante'} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Aqui está um resumo da sua conta
        </p>
      </header>

      {fetchError && (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400"
        >
          Não foi possível carregar os dados da conta. Verifique se a API está
          rodando e tente novamente.
        </div>
      )}

      <section aria-label="Resumo financeiro">
        <DashboardCards summary={summary} />
      </section>

      <section aria-label="Gráficos de movimentação financeira">
        <Charts transactions={transactions} />
      </section>

      <section aria-label="Widgets personalizados" className="space-y-4">
        <DashboardWidgets balance={summary.balance} transactions={transactions} />
      </section>

      <section aria-label="Últimas transações">
        <RecentTransactions transactions={summary.recentTransactions} />
      </section>
    </div>
  )
}
