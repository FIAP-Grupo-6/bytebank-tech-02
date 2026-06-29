import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authUser } from '@bytebank/api-client'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const response = await authUser({
            email: credentials.email,
            password: credentials.password,
          })

          if (response?.result?.token) {
            // Decodifica o payload do JWT para pegar os dados do usuário
            const payload = JSON.parse(
              Buffer.from(response.result.token.split('.')[1], 'base64').toString()
            )
            return {
              id: payload.id,
              name: payload.username,
              email: payload.email,
              // Guardamos o token para usar nas chamadas à API
              accessToken: response.result.token,
            }
          }
          return null
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
      }
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 horas (expira junto com o token da API)
  },
  secret: process.env.NEXTAUTH_SECRET,
}
