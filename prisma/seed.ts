import { PrismaClient, Role, FieldType, BookingStatus, PaymentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a HOST user
  const host = await prisma.user.create({
    data: {
      name: 'Field Owner',
      email: 'host@example.com',
      role: Role.HOST,
      phone: '+50688887777',
    },
  })

  // Create a CLIENT user
  const client = await prisma.user.create({
    data: {
      name: 'John Client',
      email: 'client@example.com',
      role: Role.CLIENT,
      phone: '+50688886666',
    },
  })

  // Create a field owned by the HOST
  const field = await prisma.field.create({
    data: {
      ownerId: host.id,
      name: 'Soccer 5v5 Grecia',
      description: 'Synthetic grass, night lights, free parking.',
      address: 'San Roque, Grecia, Alajuela',
      city: 'Grecia',
      country: 'Costa Rica',
      latitude: 10.0735,
      longitude: -84.3117,
      pricePerHour: 22000,
      fieldType: FieldType.FIVE_A_SIDE,
      photos: {
        create: [{ url: 'https://example.com/field1.jpg', isCover: true }, { url: 'https://example.com/field2.jpg' }],
      },
    },
    include: { photos: true },
  })

  // Add availability slots
  const availability = await prisma.availability.createMany({
    data: [
      {
        fieldId: field.id,
        date: new Date('2025-09-25'),
        startTime: new Date('2025-09-25T18:00:00Z'),
        endTime: new Date('2025-09-25T19:00:00Z'),
      },
      {
        fieldId: field.id,
        date: new Date('2025-09-25'),
        startTime: new Date('2025-09-25T19:00:00Z'),
        endTime: new Date('2025-09-25T20:00:00Z'),
      },
    ],
  })

  // Create a booking by CLIENT
  const booking = await prisma.booking.create({
    data: {
      fieldId: field.id,
      userId: client.id,
      startTime: new Date('2025-09-25T18:00:00Z'),
      endTime: new Date('2025-09-25T19:00:00Z'),
      totalPrice: 22000,
      status: BookingStatus.CONFIRMED,
    },
  })

  // Add a payment for the booking
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: 22000,
      paymentMethod: 'CREDIT_CARD',
      status: PaymentStatus.PAID,
      transactionId: 'txn_123456',
    },
  })

  // Add a review
  await prisma.review.create({
    data: {
      bookingId: booking.id,
      userId: client.id,
      fieldId: field.id,
      rating: 5,
      comment: 'Great field, well maintained!',
    },
  })

  console.log('✅ Seeding complete')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
