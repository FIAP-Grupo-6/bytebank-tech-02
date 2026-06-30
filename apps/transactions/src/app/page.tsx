import { getAccount } from '@bytebank/api-client'
import { getSessionFromCookie } from '@/lib/session'
import { TransactionPage } from '@/components/TransactionPage'

export const dynamic = 'force-dynamic'

export default async function TransactionsZonePage() {
  const session = await getSessionFromCookie()
  const token = session?.accessToken ?? ''

  let accountId = ''
  let apiError = false
  try {
    const response = await getAccount(token)
    accountId = response.result.account[0]?.id ?? ''
  } catch {
    apiError = true
  }

  return (
    <div>
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
        <TransactionPage accountId={accountId} token={token} />
      )}
    </div>
  )
}
