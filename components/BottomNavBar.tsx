'use client'
import { useSession } from 'next-auth/react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, User, Heart } from 'lucide-react'

const BottomNavBar = () => {
  const { data: session } = useSession()

  const isLoggedIn = !!session

  return (
    <Tabs defaultValue="home" className="fixed bottom-0 left-0 right-0 bg-white rounded-t-none h-24">
      <TabsList className="bg-white w-full h-16">
        <TabsTrigger
          value="home"
          className="flex flex-col items-center justify-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          <Search className="size-5" strokeWidth={2.5} /> Explorar
        </TabsTrigger>
        <TabsTrigger
          value="search"
          className="flex flex-col items-center justify-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          <Heart className="size-5" strokeWidth={2.5} /> Favoritos
        </TabsTrigger>
        <TabsTrigger
          value="profile"
          className="flex flex-col items-center justify-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          <User className="size-5" strokeWidth={2.5} /> {isLoggedIn ? 'Perfil' : 'Iniciar sesión'}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default BottomNavBar
