import { getAccount } from '@bytebank/api-client'
import { getSessionFromCookie } from '@/lib/session'
import { TransactionPage } from '@/components/TransactionPage'
import { ZoneHeader } from '@/components/ZoneHeader'

export const dynamic = 'force-dynamic'

export default async function TransactionsZonePage() {
  const session = await getSessionFromCookie()

  if (!session) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold">B</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            Sessão não encontrada
          </h1>
          <p className="text-sm text-muted-foreground">
            Faça login para acessar suas transações. Se você está rodando esta
            zona standalone (porta 3001), acesse-a através do host.
          </p>
          <a
            href="/login"
            className="inline-block bg-brand-green text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-green-dark transition-colors"
          >
            Ir para o login
          </a>
        </div>
      </main>
    )
  }

  let accountId = ''
  let apiError = false
  try {
    const response = await getAccount(session.accessToken)
    accountId = response.result.account[0]?.id ?? ''
  } catch {
    apiError = true
  }

  return (
    <main className="min-h-screen bg-background">
      <ZoneHeader username={session.username} />

      {apiError ? (
        <div className="max-w-4xl mx-auto p-6">
          <div
            role="alert"
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400"
          >
            Não foi possível carregar os dados da conta. Verifique se a API
            está rodando e recarregue a página.
          </div>
        </div>
      ) : (
        <TransactionPage accountId={accountId} token={session.accessToken} />
      )}
    </main>
  )
}
