import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { fieldTypeDisplay, FieldType } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function MyFieldsPage() {
  // 1. Check authentication
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    console.log(session)
    return <div>No hay sesión</div>
  }

  // 2. Fetch user and their fields
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      fields: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  // 3. Handle no fields case
  if (!user || user.fields.length === 0) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mis Canchas</h1>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No tienes canchas registradas.</p>
          <p className="text-sm text-gray-500">
            Cuando registres una cancha, aparecerá aquí y podrás gestionar su horario.
          </p>
        </div>
      </div>
    )
  }

  // 4. Display fields list
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Mis Canchas</h1>
        <p className="text-gray-600 text-sm">Gestiona los horarios de disponibilidad de tus canchas</p>
      </div>

      <div className="grid gap-4">
        {user.fields.map((field) => (
          <div key={field.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{field.name}</h3>
                <p className="text-sm text-gray-600 mb-2">📍 {field.address}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">
                    Tipo:{' '}
                    <span className="font-medium text-gray-700">{fieldTypeDisplay[field.fieldType as FieldType]}</span>
                  </span>
                  <span className="text-gray-500">
                    Precio: <span className="font-medium text-green-600">${field.pricePerHour}/hora</span>
                  </span>
                </div>
              </div>

              <Link href={`/profile/my-fields/${field.id}`}>
                <Button variant="outline" className="ml-4">
                  ⚙️ Gestionar Horario
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Consejo:</strong> Configura el horario de trabajo de cada cancha para que los usuarios puedan ver
          cuándo está disponible para reservar.
        </p>
      </div>
    </div>
  )
}
