'use client'

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, ArrowLeftRight, CreditCard } from 'lucide-react'
import { AppSidebar } from '@bytebank/ui'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: pathname === '/dashboard' },
    { href: '/transactions', label: 'Transações', icon: ArrowLeftRight, active: pathname === '/transactions' },
    { href: '/cards', label: 'Cartões', icon: CreditCard, active: pathname === '/cards' },
  ]

  return (
    <AppSidebar
      navItems={navItems}
      onSignOut={() => signOut({ callbackUrl: '/login' })}
    />
  )
}
