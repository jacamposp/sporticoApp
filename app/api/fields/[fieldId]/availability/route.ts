import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { fieldId: string } }) {
  try {
    const fieldId = parseInt(params.fieldId)
    if (Number.isNaN(fieldId)) {
      return NextResponse.json({ error: 'Invalid fieldId' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date') // Expected: YYYY-MM-DD
    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Parse YYYY-MM-DD as LOCAL date to avoid UTC shifting the day
    const [yStr, mStr, dStr] = dateParam.split('-')
    const y = Number(yStr)
    const m = Number(mStr)
    const d = Number(dStr)
    if (!y || !m || !d) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    const selectedDate = new Date(y, m - 1, d)
    // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const dayOfWeek = selectedDate.getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayOfWeek] as
      | 'sunday'
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'

    // Get work schedule
    const workSchedule = await prisma.workSchedule.findUnique({
      where: { fieldId },
    })

    if (!workSchedule) {
      return NextResponse.json({ availableSlots: [], bookedSlots: [] })
    }

    const enabledKey = `${dayName}Enabled` as keyof typeof workSchedule
    const startKey = `${dayName}Start` as keyof typeof workSchedule
    const endKey = `${dayName}End` as keyof typeof workSchedule

    const isEnabled = Boolean(workSchedule[enabledKey])
    const startTime = workSchedule[startKey] as string | null
    const endTime = workSchedule[endKey] as string | null

    if (!isEnabled || !startTime || !endTime) {
      return NextResponse.json({ availableSlots: [], bookedSlots: [] })
    }

    const startHour = Number(startTime.split(':')[0])
    const endHour = Number(endTime.split(':')[0])

    if (Number.isNaN(startHour) || Number.isNaN(endHour) || startHour < 0 || endHour > 24 || endHour <= startHour) {
      return NextResponse.json({ availableSlots: [], bookedSlots: [] })
    }

    // Generate all one-hour slots within the schedule: [startHour, endHour)
    const allSlots: string[] = []
    for (let hour = startHour; hour < endHour; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`)
    }

    // Day bounds in LOCAL time
    const startOfDay = new Date(y, m - 1, d, 0, 0, 0, 0)
    const endOfDay = new Date(y, m - 1, d, 23, 59, 59, 999)

    // Existing bookings for this day
    const bookings = await prisma.booking.findMany({
      where: {
        fieldId,
        startTime: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { startTime: true, endTime: true },
    })

    // Build set of booked hour slots (local hours)
    const bookedHours = new Set<string>()
    for (const b of bookings) {
      const bStart = new Date(b.startTime)
      const bEnd = new Date(b.endTime)
      for (let t = bStart.getTime(); t < bEnd.getTime(); t += 60 * 60 * 1000) {
        const h = new Date(t).getHours()
        bookedHours.add(`${h.toString().padStart(2, '0')}:00`)
      }
    }

    const availableSlots = allSlots.filter((slot) => !bookedHours.has(slot))
    return NextResponse.json({
      availableSlots,
      bookedSlots: Array.from(bookedHours).sort(),
    })
  } catch (error) {
    console.error('Availability error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch availability', details: message }, { status: 500 })
  }
}
