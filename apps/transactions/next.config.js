/**
 * ─── ZONA "TRANSACTIONS" (Multi-Zones) ─────────────────────────────────────
 *
 * Aplicação Next.js 100% independente: build, deploy e versionamento
 * próprios. O host faz proxy de /transactions/* para cá via rewrites.
 *
 * basePath garante que TODAS as rotas e assets deste app vivam sob
 * /transactions — assim um único rewrite no host cobre páginas E assets,
 * sem conflito com o /_next/ do host.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/transactions',

  // Necessário para o Dockerfile (copia .next/standalone)
  output: 'standalone',

  // Os packages do monorepo são TypeScript puro — o Next precisa transpilá-los
  transpilePackages: ['@bytebank/types', '@bytebank/api-client', '@bytebank/ui'],
}

module.exports = nextConfig
