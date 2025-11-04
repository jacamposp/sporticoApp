//React core

//Third party / external libraries
import { Booking, Header, Description, Amenities, MainInfo } from './_components'
import Calendar from '@/components/Calendar'
import { prisma } from '@/lib/prisma'
import { FieldType, fieldTypeDisplay } from '@/lib/types'

const FieldAvailability = ({ fieldId }: { fieldId: number }) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-2">Disponibilidad de la cancha</h2>
        <Calendar fieldId={fieldId} />
      </div>
    </>
  )
}

const FieldsPage = async ({ params }: { params: { fieldID: string } }) => {
  const field = await prisma.field.findUnique({
    where: {
      id: parseInt(params.fieldID),
    },
    include: {
      photos: {
        orderBy: { isCover: 'desc' },
      },
    },
  })

  if (!field) {
    return <div>Cancha no encontrada</div>
  }

  const { name, description, address, pricePerHour, fieldType, photos } = field

  return (
    <>
      <main className="flex flex-col gap-4">
        <Header photos={photos} />
        <div className="flex flex-col gap-4 w-full -top-16 relative bg-white rounded-4xl p-4 scroll-mt-24">
          <MainInfo name={name} address={address} fieldType={fieldType as FieldType} />
          <Description description={description} />
          <Amenities />
          <FieldAvailability fieldId={field.id} />
          <Booking pricePerHour={pricePerHour} fieldName={name} fieldId={field.id} />
          {/* <FieldMap /> */}
          {/* <FieldReviews /> */}
        </div>
      </main>
    </>
  )
}

export default FieldsPage
