import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

function formatDateRange(start: Date, end: Date) {
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()

  const dateFormatter = new Intl.DateTimeFormat('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeFormatter = new Intl.DateTimeFormat('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  if (sameDay) {
    return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`
  }
  return `${dateFormatter.format(start)} ${timeFormatter.format(start)} – ${dateFormatter.format(
    end
  )} ${dateFormatter.format(end)}`
}

function statusBadgeVariant(status: BookingStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'CONFIRMED':
      return 'default'
    case 'PENDING':
      return 'secondary'
    case 'CANCELLED':
      return 'destructive'
    case 'COMPLETED':
      return 'outline'
    default:
      return 'outline'
  }
}

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/login')
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      field: {
        include: {
          photos: { where: { isCover: true }, take: 1 },
        },
      },
    },
    orderBy: { startTime: 'asc' },
  })

  const now = new Date()
  const active = bookings.filter(
    (b) => b.startTime <= now && b.endTime > now && (b.status === 'CONFIRMED' || b.status === 'PENDING')
  )
  const upcoming = bookings.filter((b) => b.startTime > now && (b.status === 'CONFIRMED' || b.status === 'PENDING'))
  const past = bookings.filter((b) => b.endTime <= now || b.status === 'CANCELLED' || b.status === 'COMPLETED')

  const renderList = (items: typeof bookings) => {
    if (items.length === 0) {
      return <p className="text-muted-foreground text-sm">No hay reservas.</p>
    }

    return (
      <div className="flex flex-col gap-4">
        {items.map((b) => {
          const cover = b.field.photos[0]?.url || '/field-1.jpg'
          return (
            <Card key={b.id} className="overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-6">
                <div className="col-span-4 sm:col-span-3 py-4">
                  <img src={cover} alt={b.field.name} className="w-full h-24 rounded-md object-cover" />
                </div>
                <div className="col-span-8 sm:col-span-9">
                  <CardHeader className="px-0 pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">{b.field.name}</CardTitle>
                      <Badge variant={statusBadgeVariant(b.status)}>{b.status}</Badge>
                    </div>
                    <CardDescription>{formatDateRange(b.startTime, b.endTime)}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-medium">{formatCurrency(b.totalPrice)}</div>
                    </div>
                    <div className="mt-3">
                      <Link href={`/fields/${b.fieldId}`} className="text-primary text-sm font-medium">
                        Ver cancha
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <main className="container mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Mis reservas</h1>

      <Tabs defaultValue={active.length > 0 ? 'en-curso' : 'proximas'}>
        <TabsList className="w-full bg-white">
          <TabsTrigger value="en-curso">En curso ({active.length})</TabsTrigger>
          <TabsTrigger value="proximas">Próximas ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="pasadas">Pasadas ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="en-curso" className="mt-4">
          {renderList(active)}
        </TabsContent>
        <TabsContent value="proximas" className="mt-4">
          {renderList(upcoming)}
        </TabsContent>
        <TabsContent value="pasadas" className="mt-4">
          {renderList(past)}
        </TabsContent>
      </Tabs>
    </main>
  )
}
