import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/fields/[fieldId]/work-schedule
// Fetch work schedule for a field
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fieldId: string }> }
) {
  try {
    const { fieldId: fieldIdStr } = await context.params
    const fieldId = parseInt(fieldIdStr)

    const workSchedule = await prisma.workSchedule.findUnique({
      where: { fieldId },
    })

    return NextResponse.json(workSchedule)
  } catch (error) {
    console.error('Error fetching work schedule:', error)
    return NextResponse.json({ error: 'Failed to fetch work schedule' }, { status: 500 })
  }
}

// PUT /api/fields/[fieldId]/work-schedule
// Create or update work schedule for a field
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ fieldId: string }> }
) {
  try {
    // 1. Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fieldId: fieldIdStr } = await context.params
    const fieldId = parseInt(fieldIdStr)

    // 2. Verify field ownership (security!)
    const field = await prisma.field.findUnique({
      where: { id: fieldId },
      include: { owner: true },
    })

    if (!field || field.owner.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized - You do not own this field' }, { status: 403 })
    }

    // 3. Get the schedule data from request body
    const scheduleData = await request.json()

    // 4. Save to database (upsert = update if exists, create if not)
    const workSchedule = await prisma.workSchedule.upsert({
      where: { fieldId },
      create: {
        fieldId,
        ...scheduleData,
      },
      update: scheduleData,
    })

    return NextResponse.json(workSchedule)
  } catch (error) {
    console.error('Error updating work schedule:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update work schedule', details: message }, { status: 500 })
  }
}
