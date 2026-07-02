import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@bytebank/ui'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Sobre | ByteBank',
  description: 'Conheça o ByteBank — projeto desenvolvido para o Tech Challenge Fase 2 da FIAP.',
}

interface ArchitectureItem {
  title: string
  description: string
}

const architecture: ReadonlyArray<ArchitectureItem> = [
  {
    title: 'Monorepo com Turborepo',
    description:
      'Múltiplas aplicações e pacotes compartilhados num único repositório, com builds incrementais.',
  },
  {
    title: 'Multi-Zones (microfrontends)',
    description:
      'Zona host e zona transactions são Next.js apps independentes. O host faz proxy transparente via rewrites.',
  },
  {
    title: 'Next.js App Router',
    description:
      'Server Components, renderização híbrida (SSR e SSG) utilizando o App Router.',
  },
  {
    title: 'Design System compartilhado',
    description:
      'Pacote @bytebank/ui com componentes reutilizáveis (Logo, Modal, AppSidebar, Button…) consumido pelas duas zonas.',
  },
]

const stack: string[] = [
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'NextAuth.js',
  'Redux Toolkit',
  'React Hook Form',
  'Zod',
  'Turborepo',
  'Recharts',
]

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center bg-sidebar px-4 py-3 border-b border-border/40">
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Sobre o ByteBank</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Plataforma de gerenciamento financeiro desenvolvida como Tech Challenge da Fase 2 da Pós Tech Frontend Engineering da FIAP.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">O que é</h2>
          <p className="text-muted-foreground">
            O ByteBank é uma aplicação web de controle financeiro pessoal que permite visualizar saldo, registrar transações e acompanhar indicadores financeiros personalizados.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Arquitetura</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {architecture.map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-5 space-y-1"
              >
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Stack</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stack.map((tech) => (
              <li
                key={tech}
                className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground font-medium text-center"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Equipe</h2>
          <p className="text-muted-foreground">
            Desenvolvido pelo Grupo 6 — FIAP · Pós-graduação em Desenvolvimento Full Stack · 2025.
          </p>
        </section>
      </main>
    </div>
  )
}
