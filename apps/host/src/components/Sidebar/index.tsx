'use client'

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, ArrowLeftRight, CreditCard, Info } from 'lucide-react'
import { AppSidebar } from '@bytebank/ui'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: pathname === '/dashboard' },
    { href: '/transactions', label: 'Transações', icon: ArrowLeftRight, active: pathname === '/transactions' },
    { href: '/cards', label: 'Cartões', icon: CreditCard, active: pathname === '/cards' },
  ]

  const footerItems = [
    { href: '/sobre', label: 'Sobre', icon: Info, active: pathname === '/sobre' },
  ]

  return (
    <AppSidebar
      navItems={navItems}
      footerItems={footerItems}
      onSignOut={() => signOut({ callbackUrl: '/login' })}
    />
  )
}
