import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, User, Heart } from 'lucide-react'

const BottomNavBar = () => {
  return (
    <Tabs defaultValue="home" className="fixed bottom-0 left-0 right-0 bg-white rounded-t-none h-16">
      <TabsList className="bg-white w-full h-16">
        <TabsTrigger value="home" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
          <Search className="size-5" />
        </TabsTrigger>
        <TabsTrigger value="search" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
          <Heart className="size-5" />
        </TabsTrigger>
        <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
          <User className="size-5" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default BottomNavBar
