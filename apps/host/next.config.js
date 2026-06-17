/**
 * ─── ARQUITETURA MULTI-ZONES (microfrontends oficiais do Next.js) ──────────
 *
 * O host é a "zona principal". A rota /transactions é servida por OUTRA
 * aplicação Next.js independente (apps/transactions), com build e deploy
 * separados. O host apenas faz proxy via rewrites — o browser nem percebe
 * que são dois apps.
 *
 * Por que Multi-Zones e não @module-federation/nextjs-mf?
 * O plugin de Module Federation não suporta o App Router (issue #2157 do
 * module-federation/core) e será descontinuado. Multi-Zones é a abordagem
 * recomendada pela própria Vercel para microfrontends com Next.js.
 */

const TRANSACTIONS_URL =
  process.env.TRANSACTIONS_URL || 'http://localhost:3001'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Necessário para o Dockerfile (copia .next/standalone)
  output: 'standalone',

  // Os packages do monorepo são TypeScript puro — o Next precisa transpilá-los
  transpilePackages: ['@bytebank/types', '@bytebank/api-client', '@bytebank/ui'],

  async rewrites() {
    return [
      // Tudo sob /transactions é servido pela zona "transactions".
      // Como a zona usa basePath '/transactions', os assets dela
      // (/transactions/_next/...) passam pelo MESMO rewrite.
      {
        source: '/transactions',
        destination: `${TRANSACTIONS_URL}/transactions`,
      },
      {
        source: '/transactions/:path*',
        destination: `${TRANSACTIONS_URL}/transactions/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
