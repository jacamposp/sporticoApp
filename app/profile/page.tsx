'use client'
import { useSession } from 'next-auth/react'
import ProfileCard from '@/components/ProfileCard'
import MenuOptions from '@/components/MenuOptions'

import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Handshake } from 'lucide-react'

const ProfilePage = () => {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <ProfileCard name={session?.user?.name ?? ''} image={session?.user?.image ?? ''} bookings={4} reviews={0} />
      <Card className="w-full  max-w-full">
        <CardContent>
          <div className="flex flex-row gap-4 items-center">
            <Handshake className="size-20 text-center" strokeWidth={2} />
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Conviértete en Host</h2>
              <span className="text-sm text-gray-500">Conviértete en Host y gana dinero al alquilar tu cancha</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Separator orientation="horizontal" className="border border-gray-200 my-4" />
      <MenuOptions />
    </div>
  )
}

export default ProfilePage
