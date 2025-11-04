import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fieldTypeDisplay, FieldType } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function MyFieldsPage() {
  // 1. Check authentication
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    //TODO: ADD NOT AUTHENTICATED PAGE AND REDIRECT TO LOGIN PAGE
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
        include: {
          photos: {
            orderBy: { isCover: 'desc' },
          },
          workSchedule: true,
          bookings: {
            where: {
              // count only today's bookings for the summary indicator
              startTime: {
                gte: (() => {
                  const d = new Date()
                  d.setHours(0, 0, 0, 0)
                  return d
                })(),
                lt: (() => {
                  const d = new Date()
                  d.setHours(23, 59, 59, 999)
                  return d
                })(),
              },
            },
          },
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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Mis Canchas</h1>
      </div>

      <Tabs defaultValue="Estadísticas" className="w-full items-center">
        <TabsList className="w-full bg-white">
          <TabsTrigger value="Estadísticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="Canchas">Canchas</TabsTrigger>
        </TabsList>
        <TabsContent value="Estadísticas"></TabsContent>
        <TabsContent value="Canchas">
          <div className="grid gap-5">
            {user.fields.map((field) => {
              const coverPhotoUrl =
                field.photos?.find((p) => p.isCover)?.url || field.photos?.[0]?.url || '/field-1.jpg'
              const isPublished = Boolean(field.workSchedule)
              const todaysBookings = field.bookings?.length ?? 0

              return (
                <div key={field.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={coverPhotoUrl}
                      alt={field.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 640px"
                      priority={false}
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-gray-500 mb-1">{fieldTypeDisplay[field.fieldType as FieldType]}</p>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 leading-snug">{field.name}</h3>
                        <div className="mt-2 flex items-center gap-3 text-sm">
                          <span className={isPublished ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                            {isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">
                            {todaysBookings > 0
                              ? `${todaysBookings} booking${todaysBookings === 1 ? '' : 's'} today`
                              : 'No upcoming bookings'}
                          </span>
                        </div>
                      </div>

                      <Link href={`/my-fields/${field.id}`}>
                        <Button className="px-5">Edit</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add new court - empty state style card */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-2xl">⚽</span>
              </div>
              <p className="text-gray-900 font-semibold mb-1">No courts yet</p>
              <p className="text-gray-500 text-sm mb-4">Add your first court to get started!</p>
              <Button disabled className="px-4">
                Add your first court
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
