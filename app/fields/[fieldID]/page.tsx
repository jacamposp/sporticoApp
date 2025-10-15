'use client'
//React core

//Third party / external libraries
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Calendar from '@/components/Calendar'

//types

//Icons
import { ArrowLeftIcon, Star, Users, Share, CarFront, ShowerHead, Wifi } from 'lucide-react'

const Header = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div>
      <Button
        variant="outline"
        className="absolute top-4 left-4 h-10 w-10 opacity-75 rounded-full"
        onClick={handleGoBack}
      >
        <ArrowLeftIcon strokeWidth={2.5} />
      </Button>
      <Button variant="outline" className="absolute top-4 right-4 h-10 w-10 opacity-75 rounded-full">
        <Share strokeWidth={2.5} />
      </Button>
      <Image src="/field-1.jpg" alt="Field" width={1000} height={1000} />
    </div>
  )
}

const FieldBasicInfo = () => {
  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold text-center">Cancha de fútbol</h1>
          <span className="text-sm text-gray-500">San Roque, Grecia, Alajuela</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Star strokeWidth={2} />
          <span className="text-sm font-medium">4.5</span>
        </div>
        <Separator orientation="vertical" decorative className="bg-gray-400" style={{ height: '20px', width: '1px' }} />
        <div className="flex items-center gap-2">
          <Users strokeWidth={2} />
          <span className="text-sm font-medium">5vs5</span>
        </div>
      </div>
      <Separator orientation="horizontal" className="bg-gray-200" />
    </>
  )
}

const FieldDescription = () => {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-2">Sobre la cancha</h2>
        <p className="text-sm text-gray-500">
          Esta cancha de fútbol es una cancha de fútbol de 5vs5, con un campo de 100x60 metros.
        </p>
      </div>
    </>
  )
}

const FieldAmenities = () => {
  // TODO: Add amenities map
  const amenitiesexample = [
    {
      icon: CarFront,
      name: 'Estacionamiento',
    },
    {
      icon: ShowerHead,
      name: 'Baños',
    },
    {
      icon: Wifi,
      name: 'Wifi',
    },
  ]
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-2">Amenidades de la cancha</h2>
        <div className="grid grid-cols-2 gap-2">
          {amenitiesexample.map((amenity) => {
            return (
              <div key={amenity.name} className="flex items-center gap-2 rounded-xl border border-gray-400 p-2 w-full">
                <amenity.icon strokeWidth={2} />
                <span className="text-sm font-medium">{amenity.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

const FieldAvailability = () => {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-2">Disponibilidad de la cancha</h2>
        <Calendar />
      </div>
    </>
  )
}

const FieldMap = () => {
  return (
    <>
      <div>
        <h1>Mapa de la cancha de fútbol</h1>
      </div>
      <Separator orientation="horizontal" className="bg-gray-200" />
    </>
  )
}

const FieldReviews = () => {
  return (
    <>
      <div>
        <h1>Reseñas de la cancha de fútbol</h1>
      </div>
      <Separator orientation="horizontal" className="bg-gray-200" />
    </>
  )
}

const FieldsPage = () => {
  return (
    <div>
      <Header />

      <main className="flex flex-col gap-4 pt-4 pb-24">
        <div className="flex flex-col gap-4 w-full -top-16 relative bg-white rounded-4xl p-4">
          <FieldBasicInfo />
          <FieldDescription />
          <FieldAmenities />
          <FieldAvailability />
          <FieldMap />
          <FieldReviews />
        </div>
      </main>
    </div>
  )
}

export default FieldsPage
