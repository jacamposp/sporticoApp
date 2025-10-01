import SearchBar from '@/components/SearchBar'
import BottomNavBar from '@/components/BottomNavBar'
import { FieldCard } from '@/components/FieldCard'
import { Separator } from '@/components/ui/separator'

import { prisma } from '@/lib/prisma'

export default async function Home() {
  const canchas = await prisma.field.findMany({
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
