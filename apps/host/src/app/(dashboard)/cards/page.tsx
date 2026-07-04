import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAccount } from '@bytebank/api-client'
import { CreditCard } from 'lucide-react'
import type { Card } from '@bytebank/types'
import { CardItem } from './CardItem'

export default async function CardsPage() {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken || ''

  let cards: Card[] = []

  try {
    const response = await getAccount(token)
    cards = response.result.cards
  } catch {
    cards = []
  }

  const totalCards = cards.length

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Meus cartões</h1>
        <p className="text-sm text-muted-foreground">
          {totalCards} cartão{totalCards !== 1 ? 'ões' : ''} vinculado{totalCards !== 1 ? 's' : ''} à sua conta
        </p>
      </div>

      {totalCards === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center border border-border">
          <CreditCard className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhum cartão encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}
