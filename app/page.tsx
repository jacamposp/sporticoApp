import SearchBar from '@/components/SearchBar'
import { FieldCard } from '@/components/FieldCard'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/prisma'
import { FieldType } from '@/lib/types'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  const whereConditions: any = {}

  if (params.location) {
    whereConditions.OR = [
      { city: { contains: params.location, mode: 'insensitive' } },
      { address: { contains: params.location, mode: 'insensitive' } },
      { name: { contains: params.location, mode: 'insensitive' } },
    ]
  }

  if (params.date) {
    const searchDate = new Date(params.date as string)

    whereConditions.availability = {
      some: {
        date: {
          gte: searchDate,
          lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
        isBooked: false,
        ...(params.time && {
          startTime: {
            lte: new Date(`${params.date}T${params.time}`),
          },
        }),
      },
    }
  }

  if (params.mode) {
    whereConditions.fieldType = params.mode as FieldType
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
      </main>
    </>
  )
}
