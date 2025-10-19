import { PrismaClient, Role, BookingStatus, PaymentStatus, FieldType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create or get HOST user
  const host = await prisma.user.upsert({
    where: { email: 'host@example.com' },
    update: {},
    create: {
      name: 'Field Owner',
      email: 'host@example.com',
      role: Role.HOST,
      phone: '+50688887777',
    },
  })

  // Create or get CLIENT user
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'John Client',
      email: 'client@example.com',
      role: Role.CLIENT,
      phone: '+50688886666',
    },
  })

  // Create or get field owned by the HOST
  let field = await prisma.field.findFirst({
    where: {
      name: 'Soccer 5v5 Grecia',
      ownerId: host.id,
    },
    include: { photos: true },
  })

  if (!field) {
    field = await prisma.field.create({
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
        fieldType: FieldType.FIVE_VS_FIVE,
        photos: {
          create: [{ url: 'https://example.com/field1.jpg', isCover: true }, { url: 'https://example.com/field2.jpg' }],
        },
      },
      include: { photos: true },
    })
  }

  // Add availability slots (only if they don't exist)
  const existingAvailability = await prisma.availability.findFirst({
    where: { fieldId: field.id },
  })

  if (!existingAvailability) {
    await prisma.availability.createMany({
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
  }

  // Create a booking by CLIENT (only if it doesn't exist)
  let booking = await prisma.booking.findFirst({
    where: {
      fieldId: field.id,
      userId: client.id,
      startTime: new Date('2025-09-25T18:00:00Z'),
    },
  })

  if (!booking) {
    booking = await prisma.booking.create({
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
  }

  // Create 3 additional fields
  const field2Data = {
    ownerId: host.id,
    name: 'Cancha 7v7 San José Centro',
    description: 'Césped natural, vestuarios, iluminación LED.',
    address: 'Avenida Central, San José',
    city: 'San José',
    country: 'Costa Rica',
    latitude: 9.9281,
    longitude: -84.0907,
    pricePerHour: 35000,
    fieldType: FieldType.SEVEN_VS_SEVEN,
    photos: {
      create: [{ url: 'https://example.com/field3.jpg', isCover: true }],
    },
  }

  let field2 = await prisma.field.findFirst({
    where: { name: field2Data.name, ownerId: host.id },
  })
  if (!field2) {
    field2 = await prisma.field.create({ data: field2Data })
  }

  const field3Data = {
    ownerId: host.id,
    name: 'Estadio 11v11 Cartago',
    description: 'Campo profesional, graderías, estacionamiento amplio.',
    address: 'Barrio San Francisco, Cartago',
    city: 'Cartago',
    country: 'Costa Rica',
    latitude: 9.8644,
    longitude: -83.9194,
    pricePerHour: 50000,
    fieldType: FieldType.ELEVEN_VS_ELEVEN,
    photos: {
      create: [{ url: 'https://example.com/field4.jpg', isCover: true }],
    },
  }

  let field3 = await prisma.field.findFirst({
    where: { name: field3Data.name, ownerId: host.id },
  })
  if (!field3) {
    field3 = await prisma.field.create({ data: field3Data })
  }

  const field4Data = {
    ownerId: host.id,
    name: 'Fútbol 5 Heredia',
    description: 'Sintético de última generación, techado parcial.',
    address: 'Barva, Heredia',
    city: 'Heredia',
    country: 'Costa Rica',
    latitude: 10.0379,
    longitude: -84.1169,
    pricePerHour: 18000,
    fieldType: FieldType.FIVE_VS_FIVE,
    photos: {
      create: [{ url: 'https://example.com/field5.jpg', isCover: true }],
    },
  }

  let field4 = await prisma.field.findFirst({
    where: { name: field4Data.name, ownerId: host.id },
  })
  if (!field4) {
    field4 = await prisma.field.create({ data: field4Data })
  }

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
