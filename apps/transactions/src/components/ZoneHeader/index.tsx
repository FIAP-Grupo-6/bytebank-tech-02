import { ArrowLeft } from 'lucide-react'
import { Logo } from '@bytebank/ui'

export function ZoneHeader({ username }: { username: string }) {
  return (
    <header className="bg-surface-sidebar border-b border-border/30">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Dashboard
        </a>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground" aria-label="Usuário logado">
            {username}
          </span>
          <Logo withText={false} size="sm" />
        </div>
      </div>
    </header>
  )
}
