'use client'

import { signOut } from 'next-auth/react'
import { LayoutDashboard, ArrowLeftRight, CreditCard, Info } from 'lucide-react'
import { AppSidebar } from '@bytebank/ui'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: false },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight, active: true },
  { href: '/cards', label: 'Cartões', icon: CreditCard, active: false },
]

const footerItems = [
  { href: '/sobre', label: 'Sobre', icon: Info, active: false },
]

export function Sidebar() {
  return (
    <AppSidebar
      navItems={navItems}
      footerItems={footerItems}
      onSignOut={() => signOut({ callbackUrl: '/login' })}
    />
  )
}
