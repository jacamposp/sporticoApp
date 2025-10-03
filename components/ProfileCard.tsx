import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const ProfileCard = ({ name, image, bookings, reviews }: { name: string, image: string, bookings: number, reviews: number }) => {
  return (
    <Card className="w-full  max-w-full">
      <CardContent className="flex flex-row gap-10 justify-between">
        <div className="flex flex-col gap-4">
          <Avatar className="size-24">
            <AvatarImage src={image} />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg text-center font-bold">{name}</h2>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <span className="text-lg font-bold">{bookings}</span>
          <span className="text-sm text-gray-500 font-medium">Reservas</span>
          <Separator className="w-full my-4" />
          <span className="text-lg font-bold">{reviews}</span>
          <span className="text-sm text-gray-500 font-medium">Reseñas</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
