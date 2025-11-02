import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookingStatus, PaymentStatus } from '@prisma/client'

type PostBody = {
  date: string // YYYY-MM-DD (local)
  start: string // HH:mm
  end: string // HH:mm
  idempotencyKey?: string
}

export async function POST(request: NextRequest, { params }: { params: { fieldId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fieldId = Number(params.fieldId)
    if (Number.isNaN(fieldId)) {
      return NextResponse.json({ error: 'Invalid fieldId' }, { status: 400 })
    }

    const body = (await request.json()) as Partial<PostBody>
    const { date, start, end } = body
    if (!date || !start || !end) {
      return NextResponse.json({ error: 'Missing required fields: date, start, end' }, { status: 400 })
    }

    // Parse date in LOCAL time
    const [yStr, mStr, dStr] = date.split('-')
    const y = Number(yStr)
    const m = Number(mStr)
    const d = Number(dStr)
    if (!y || !m || !d) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    const startHour = Number(start.split(':')[0])
    const endHour = Number(end.split(':')[0])
    if (Number.isNaN(startHour) || Number.isNaN(endHour) || startHour < 0 || endHour > 24 || endHour <= startHour) {
      return NextResponse.json({ error: 'Invalid time range' }, { status: 400 })
    }

    const startTime = new Date(y, m - 1, d, startHour, 0, 0, 0)
    const endTime = new Date(y, m - 1, d, endHour, 0, 0, 0)

    const now = new Date()
    if (startTime.getTime() <= now.getTime()) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
    }

    // Load field and work schedule
    const field = await prisma.field.findUnique({
      where: { id: fieldId },
      include: { workSchedule: true },
    })
    if (!field) {
      return NextResponse.json({ error: 'Field not found' }, { status: 404 })
    }

    const dayOfWeek = startTime.getDay() // 0=Sun..6=Sat
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
    const dayName = dayNames[dayOfWeek]

    const ws = field.workSchedule
    if (!ws) {
      return NextResponse.json({ error: 'Field has no work schedule' }, { status: 400 })
    }

    const enabledKey = `${dayName}Enabled` as keyof typeof ws
    const startKey = `${dayName}Start` as keyof typeof ws
    const endKey = `${dayName}End` as keyof typeof ws
    const isEnabled = Boolean(ws[enabledKey])
    const wsStart = (ws[startKey] as string | null) ?? null
    const wsEnd = (ws[endKey] as string | null) ?? null
    if (!isEnabled || !wsStart || !wsEnd) {
      return NextResponse.json({ error: 'Field closed that day' }, { status: 400 })
    }

    const wsStartHour = Number(wsStart.split(':')[0])
    const wsEndHour = Number(wsEnd.split(':')[0])
    if (
      Number.isNaN(wsStartHour) ||
      Number.isNaN(wsEndHour) ||
      wsEndHour <= wsStartHour ||
      startHour < wsStartHour ||
      endHour > wsEndHour
    ) {
      return NextResponse.json({ error: 'Requested time is outside of work schedule' }, { status: 400 })
    }

    const hours = endHour - startHour
    const totalPrice = field.pricePerHour * hours

    const autoConfirm = (field as any).autoConfirmBookings ?? true
    const result = await prisma.$transaction(async (tx) => {
      // Conflict check (overlap): existing.start < newEnd AND existing.end > newStart
      const existing = await tx.booking.findFirst({
        where: {
          fieldId,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
        select: { id: true },
      })

      if (existing) {
        throw new Error('Time range already booked')
      }

      const booking = await tx.booking.create({
        data: {
          fieldId,
          userId: session.user.id,
          startTime,
          endTime,
          totalPrice,
          status: autoConfirm ? BookingStatus.CONFIRMED : BookingStatus.PENDING,
        },
      })

      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: totalPrice,
          paymentMethod: 'CARD',
          status: PaymentStatus.PENDING,
        },
      })

      return { bookingId: booking.id, status: booking.status }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const status = message.includes('already booked') ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
