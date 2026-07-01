import { cache } from 'react'
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt'

/**
 * ─── COMUNICAÇÃO ENTRE ZONAS: sessão compartilhada via cookie ──────────────
 *
 * Como funciona a autenticação entre os microfrontends (Multi-Zones):
 *
 * 1. O usuário faz login no HOST → NextAuth grava o cookie de sessão
 *    (JWT criptografado com NEXTAUTH_SECRET) no domínio.
 * 2. Quando o usuário navega para /transactions, o host faz proxy da
 *    request para ESTA zona — e o proxy preserva os cookies, já que
 *    para o browser é tudo a mesma origem.
 * 3. Esta zona usa o MESMO NEXTAUTH_SECRET para decodificar o cookie
 *    e extrair o accessToken da API — sem nenhuma chamada extra.
 *
 * Resultado: SSO entre microfrontends sem postMessage, sem query string
 * com token (inseguro) e sem estado global compartilhado.
 */

interface SessionData {
  accessToken: string
  userId: string
  username: string
}

export const getSessionFromCookie = cache(async (): Promise<SessionData | null> => {
  const cookieStore = cookies()

  // Em produção (HTTPS) o NextAuth prefixa o cookie com __Secure-
  const raw =
    cookieStore.get('next-auth.session-token')?.value ??
    cookieStore.get('__Secure-next-auth.session-token')?.value

  if (!raw) return null

  try {
    const decoded = await decode({
      token: raw,
      secret: process.env.NEXTAUTH_SECRET ?? '',
    })

    if (!decoded?.accessToken) return null

    return {
      accessToken: decoded.accessToken as string,
      userId: (decoded.id as string) ?? '',
      username: (decoded.name as string) ?? '',
    }
  } catch {
    // Cookie inválido/expirado ou secret divergente entre as zonas
    return null
  }
})
