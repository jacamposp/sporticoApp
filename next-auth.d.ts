import { DefaultSession } from 'next-auth'
import type { Role } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: Role
      phone: string | null
      isHost: boolean
      hasFields?: boolean
      emailVerified?: Date
      createdAt?: Date
    }
  }
}
