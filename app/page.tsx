import SearchBar from '@/components/SearchBar'
import BottomNavBar from '@/components/BottomNavBar'
import { FieldCard } from '@/components/FieldCard'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/prisma'
import { FieldType } from '@/lib/types'

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const whereConditions: any = {}

  if (searchParams.location) {
    whereConditions.OR = [
      { city: { contains: searchParams.location, mode: 'insensitive' } },
      { address: { contains: searchParams.location, mode: 'insensitive' } },
      { name: { contains: searchParams.location, mode: 'insensitive' } },
    ]
  }

  if (searchParams.date) {
    const searchDate = new Date(searchParams.date as string)

    whereConditions.availability = {
      some: {
        date: {
          gte: searchDate,
          lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
        isBooked: false,
        ...(searchParams.time && {
          startTime: {
            lte: new Date(`${searchParams.date}T${searchParams.time}`),
          },
        }),
      },
    }
  }

  if (searchParams.mode) {
    whereConditions.fieldType = searchParams.mode as FieldType
  }

  const canchas = await prisma.field.findMany({
    where: whereConditions,
    include: {
      photos: true,
      availability: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <>
      <SearchBar />
      <Separator orientation="horizontal" className="border border-gray-200" />
      <main className="flex flex-col gap-4 pt-4 pb-24 px-8">
        <h1 className="text-2xl font-bold text-center">Reserva tu cancha</h1>
        <p className="text-sm text-center">Descubre campos de fútbol premium disponibles para reservar en tu zona</p>

        {/* CARD */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {canchas.map((cancha) => (
            <FieldCard
              key={cancha.id}
              id={cancha.id}
              name={cancha.name}
              image={'/field-1.jpg'}
              location={cancha.address}
              rating={4}
              reviewCount={10}
              price={cancha.pricePerHour}
              type={'Exterior'}
              capacity={'5vs5'}
            />
          ))}
        </div>
        <BottomNavBar />
      </main>
    </>
  )
}
