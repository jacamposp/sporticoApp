import Navbar from '@/components/NavBar'
import { FieldCard } from '@/components/FieldCard'
import { Separator } from '@/components/ui/separator'
// import { removeAccents } from '@/lib/utils'
// import { Filters } from '@/lib/types'

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

  console.log(canchas)

  // const [filters, setFilters] = useState<Filters>({
  //   date: undefined,
  //   time: '',
  //   players: '',
  //   location: '',
  // })
  // const [filteredCanchas, setFilteredCanchas] = useState(canchas)

  // useEffect(() => {
  //   setFilteredCanchas(
  //     canchas.filter(
  //       (cancha) =>
  //         removeAccents(cancha.location.toLowerCase()).includes(
  //           removeAccents((filters.location || '').toLowerCase())
  //         ) &&
  //         cancha.capacity.includes(filters.players || '') &&
  //         cancha.availability.includes(filters.time || '')
  //       // cancha.date.includes(filters.date) //TODO: add date filter
  //     )
  //   )
  // }, [filters])

  return (
    <>
      <Navbar />
      <Separator orientation="horizontal" className="bg-border" />
      <main className="flex flex-col gap-4 p-4">
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
      </main>
    </>
  )
}
