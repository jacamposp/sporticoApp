import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/fields/[fieldId]
// Returns field basic information including photos
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fieldId: string }> }
) {
  try {
    const { fieldId: fieldIdStr } = await context.params
    const fieldId = parseInt(fieldIdStr)

    const field = await prisma.field.findUnique({
      where: { id: fieldId },
      include: { photos: true, workSchedule: true },
    })

    if (!field) {
      return NextResponse.json({ error: 'Field not found' }, { status: 404 })
    }

    return NextResponse.json(field)
  } catch (error) {
    console.error('Error fetching field:', error)
    return NextResponse.json({ error: 'Failed to fetch field' }, { status: 500 })
  }
}

// PUT /api/fields/[fieldId]
// Updates field basic information and replaces photos list
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ fieldId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fieldId: fieldIdStr } = await context.params
    const fieldId = parseInt(fieldIdStr)

    // Verify ownership
    const existing = await prisma.field.findUnique({
      where: { id: fieldId },
      include: { owner: true },
    })
    if (!existing || existing.owner.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized - You do not own this field' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, address, city, country, pricePerHour, fieldType, photos } = body

    // Normalize photos (array of { url, isCover? })
    const normalizedPhotos: Array<{ url: string; isCover?: boolean }> = Array.isArray(photos)
      ? photos
          .filter((p: any) => p && typeof p.url === 'string' && p.url.length > 0)
          .map((p: any) => ({ url: p.url, isCover: Boolean(p.isCover) }))
      : []

    // Update the field and replace photos in a transaction
    await prisma.$transaction([
      prisma.field.update({
        where: { id: fieldId },
        data: {
          name,
          description,
          address,
          city,
          country,
          pricePerHour,
          fieldType,
          photos: {
            deleteMany: {},
          },
        },
      }),
      normalizedPhotos.length
        ? prisma.fieldPhoto.createMany({
            data: normalizedPhotos.map((p) => ({ fieldId, url: p.url, isCover: Boolean(p.isCover) })),
          })
        : prisma.fieldPhoto.deleteMany({ where: { fieldId } }),
    ])

    const updated = await prisma.field.findUnique({
      where: { id: fieldId },
      include: { photos: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating field:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update field', details: message }, { status: 500 })
  }
}
