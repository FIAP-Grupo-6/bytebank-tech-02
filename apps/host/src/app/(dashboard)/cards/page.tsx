import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAccount } from '@bytebank/api-client'
import { CreditCard, Lock, Unlock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Logo } from '@bytebank/ui'
import type { Card } from '@bytebank/types'

function maskCardNumber(number: string) {
  return '**** **** **** ' + number.slice(-4)
}

function CardItem({ card }: { card: Card }) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
      {/* Visual do cartão */}
      <div className="bg-gradient-to-br from-surface-sidebar to-brand-green rounded-xl p-5 mb-4 text-white">
        <div className="flex justify-between items-start mb-8">
          <Logo size="md" withText={false} />
          <span className="text-xs font-medium uppercase tracking-wider opacity-80">
            {card.functions}
          </span>
        </div>
        <p className="font-mono text-sm tracking-widest mb-4">
          {maskCardNumber(card.number)}
        </p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs opacity-60 mb-0.5">Titular</p>
            <p className="text-sm font-semibold">{card.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-60 mb-0.5">Validade</p>
            <p className="text-sm font-semibold">
              {format(new Date(card.dueDate), 'MM/yy', { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>

      {/* Detalhes */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{card.type}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
            card.is_blocked
              ? 'bg-red-500/20 text-red-400'
              : 'bg-emerald-500/20 text-emerald-400'
          }`}
        >
          {card.is_blocked ? (
            <>
              <Lock className="w-3 h-3" /> Bloqueado
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3" /> Ativo
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function CardsPage() {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken || ''

  let cards: Card[] = []
  try {
    const response = await getAccount(token)
    cards = response.result.cards
  } catch {
    // mantém lista vazia
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Meus cartões</h1>
        <p className="text-sm text-muted-foreground">
          {cards.length} cartão{cards.length !== 1 ? 'ões' : ''} vinculado{cards.length !== 1 ? 's' : ''} à sua conta
        </p>
      </div>

      {cards.length === 0 ? (
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
