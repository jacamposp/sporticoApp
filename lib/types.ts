import { Role } from '@prisma/client'
import { DefaultSession } from 'next-auth'

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

export type Filters = {
  location: string
  date: string
  time: string
  mode: string
}

export type FieldType = 'FIVE_VS_FIVE' | 'SEVEN_VS_SEVEN' | 'ELEVEN_VS_ELEVEN'

// Helper para mostrar los tipos de campo de forma legible
export const fieldTypeDisplay: Record<FieldType, string> = {
  FIVE_VS_FIVE: '5vs5',
  SEVEN_VS_SEVEN: '7vs7',
  ELEVEN_VS_ELEVEN: '11vs11',
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type DaySchedule = {
  enabled: boolean
  start: string | null // Format: "HH:mm" e.g. "08:00"
  end: string | null // Format: "HH:mm" e.g. "22:00"
}

export type WorkScheduleData = {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}
