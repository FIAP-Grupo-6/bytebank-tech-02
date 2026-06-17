'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  Info,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

/**
 * `zone: true` → rota servida por OUTRO microfrontend (Multi-Zones).
 * Links entre zonas usam <a> nativo: o App Router do host não conhece
 * essas rotas, então a navegação precisa ser um page load completo —
 * é a regra oficial do padrão Multi-Zones.
 */
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, zone: false },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight, zone: true },
  { href: '/cards', label: 'Cartões', icon: CreditCard, zone: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar — visível apenas em telas < md */}
      <div className="md:hidden flex items-center justify-between bg-sidebar px-4 py-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">B</span>
          </div>
          <span className="text-foreground font-semibold">ByteBank</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar — sempre visível em md+, drawer em mobile */}
      <aside
        className={clsx(
          'bg-sidebar flex flex-col z-40 border-r border-border/30',
          // md+ sempre visível (estático, sem translate)
          'md:static md:translate-x-0 md:h-full md:flex',
          // md: ícones apenas (w-16)
          'md:w-16',
          // lg: completa (w-56)
          'lg:w-56',
          // Mobile: posição fixa, drawer
          'fixed top-0 left-0 h-full w-56 transition-transform duration-200',
          // Mobile: abrir/fechar — md+ fica sempre visível via md:translate-x-0
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo — ícone em md, completo em lg, completo no drawer mobile */}
        <div className="px-5 py-5 hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          <span className="text-foreground font-semibold text-lg">ByteBank</span>
        </div>

        <div className="py-5 hidden md:flex lg:hidden justify-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
        </div>

        <div className="px-5 py-5 flex md:hidden items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          <span className="text-foreground font-semibold text-lg">ByteBank</span>
        </div>

        {/* Nav */}
        <nav aria-label="Navegação principal" className="flex-1 px-2 space-y-1 pt-2 lg:pt-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            const classes = clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              'md:justify-center lg:justify-start',
              active
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )

            if (item.zone) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={classes}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="md:hidden lg:block">{item.label}</span>
                </a>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={classes}
                title={item.label}
              >
                <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="md:hidden lg:block">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t border-border/30">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sair"
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium transition-colors',
              'md:justify-center lg:justify-start',
              'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span className="md:hidden lg:block">Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay para fechar o drawer no mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
