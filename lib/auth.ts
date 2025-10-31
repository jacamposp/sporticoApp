import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session.user?.email) return session

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      if (!user) return session

      session.user.id = user.id
      session.user.role = user.role
      session.user.phone = user.phone ?? null
      session.user.isHost = user.role === 'HOST' || user.role === 'ADMIN'
      // session.user.hasFields = user.fields.length > 0
      // session.user.emailVerified = user.emailVerified ?? null
      session.user.createdAt = user.createdAt
      return session
    },
  },
}
