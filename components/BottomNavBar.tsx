'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, User, Heart } from 'lucide-react'

const BottomNavBar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const isLoggedIn = !!session

  return (
    <Tabs defaultValue="home" className="fixed bottom-0 left-0 right-0 bg-white rounded-t-none max-h-24 min-h-18">
      <TabsList className="bg-white w-full h-16">
        <TabsTrigger
          value="home"
          className="flex flex-col items-center justify-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
          onClick={() => {
            router.push('/')
          }}
        >
          <Search className="size-5" strokeWidth={2} /> Explorar
        </TabsTrigger>
        <TabsTrigger
          value="search"
          className="flex flex-col items-center justify-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          <Heart className="size-5" strokeWidth={2} /> Favoritos
        </TabsTrigger>
        <TabsTrigger
          value="profile"
          className="flex flex-col items-center justify-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
          onClick={() => {
            isLoggedIn ? router.push('/profile') : router.push('/login')
          }}
        >
          <Avatar className="size-5">
            <AvatarImage src={session?.user?.image ?? ''} />
            <AvatarFallback className="bg-transparent">
              <User className="size-5" strokeWidth={2} />
            </AvatarFallback>
          </Avatar>
          {isLoggedIn ? 'Perfil' : 'Iniciar sesión'}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default BottomNavBar
