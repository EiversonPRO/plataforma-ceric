import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const LOCKOUT_ATTEMPTS = 5
const LOCKOUT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

async function getRecentFailedAttempts(email: string): Promise<number> {
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MS)
  return prisma.loginAttempt.count({
    where: {
      email,
      success: false,
      attemptedAt: { gte: since },
    },
  })
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Correo electrónico', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Correo y contraseña son requeridos')
        }

        const ipAddress =
          (req?.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
          '0.0.0.0'

        const failedAttempts = await getRecentFailedAttempts(credentials.email)
        if (failedAttempts >= LOCKOUT_ATTEMPTS) {
          throw new Error('Cuenta bloqueada temporalmente. Intenta en 10 minutos.')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        const isValidPassword =
          user ? await bcrypt.compare(credentials.password, user.passwordHash) : false

        await prisma.loginAttempt.create({
          data: {
            email: credentials.email,
            ipAddress,
            success: isValidPassword && !!user,
            userId: isValidPassword && user ? user.id : null,
          },
        })

        if (!user || !isValidPassword) {
          throw new Error('Correo o contraseña incorrectos')
        }

        if (user.status === 'INACTIVE') {
          throw new Error('Tu cuenta está inactiva. Contacta al administrador.')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          forcePasswordChange: user.forcePasswordChange,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: string }).role
        token.forcePasswordChange = (user as { forcePasswordChange: boolean }).forcePasswordChange
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.forcePasswordChange = token.forcePasswordChange as boolean
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
