//React core

//Third party / external libraries
import Image from 'next/image'

import { HeaderButtons, Booking } from './_components'

import { Separator } from '@/components/ui/separator'
import Calendar from '@/components/Calendar'
import { prisma } from '@/lib/prisma'
import { FieldType } from '@/lib/types'

//types

//Icons
import { Star, Users, CarFront, ShowerHead, Wifi } from 'lucide-react'

const Header = () => {
  return (
    <div>
      <HeaderButtons />
      <Image src="/field-1.jpg" alt="Field" width={1000} height={1000} />
    </div>
  )
}

const FieldBasicInfo = ({ name, address, fieldType }: { name: string; address: string; fieldType: FieldType }) => {
  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold text-center">{name}</h1>
          <span className="text-sm text-gray-500">{address}</span>
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
          <span className="text-sm font-medium">{fieldType}</span>
        </div>
      </div>
      <Separator orientation="horizontal" className="bg-gray-200" />
    </>
  )
}

const FieldDescription = ({ description }: { description: string }) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-2">Sobre la cancha</h2>
        <p className="text-sm text-gray-500">{description}</p>
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

// const FieldMap = () => {
//   return (
//     <>
//       <div>
//         <h1>Mapa de la cancha de fútbol</h1>
//       </div>
//       <Separator orientation="horizontal" className="bg-gray-200" />
//     </>
//   )
// }

// const FieldReviews = () => {
//   return (
//     <>
//       <div>
//         <h1>Reseñas de la cancha de fútbol</h1>
//       </div>
//       <Separator orientation="horizontal" className="bg-gray-200" />
//     </>
//   )
// }

// const FieldBooking = () => {
//   return (
//     <div className="flex justify-between items-center bottom-0 bg-white w-full p-4 sticky border-t border-gray-200">
//       <div className="flex flex-col items-start gap-2">
//         <span className="text-sm text-gray-500 text-left">Total</span>
//         <span className="text-lg font-bold text-gray-900">{10000} ₡</span>
//       </div>
//       <Button variant="outline" className="bg-primary text-white rounded-full">
//         Reservar cancha
//       </Button>
//     </div>
//   )
// }

const FieldsPage = async ({ params }: { params: { fieldID: string } }) => {
  const field = await prisma.field.findUnique({
    where: {
      id: parseInt(params.fieldID),
    },
  })

  if (!field) {
    return <div>Cancha no encontrada</div>
  }

  const { name, description, address, pricePerHour, fieldType } = field

  return (
    <>
      <main className="flex flex-col gap-4">
        <Header />
        <div className="flex flex-col gap-4 w-full -top-16 relative bg-white rounded-4xl p-4">
          <FieldBasicInfo name={name} address={address} fieldType={fieldType as FieldType} />
          <FieldDescription description={description} />
          <FieldAmenities />
          <FieldAvailability />
          <Booking pricePerHour={pricePerHour} />
          {/* <FieldMap /> */}
          {/* <FieldReviews /> */}
        </div>
      </main>
    </>
  )
}

export default FieldsPage
