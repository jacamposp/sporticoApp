import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

const SearchBar = () => {
  return (
    <div className="p-4 bg-gray-50 shadow-sm flex justify-center">
      <Dialog>
        <DialogTrigger className="flex items-center gap-2 w-fit py-2 px-10 shadow-md border border-gray-200 bg-white rounded-full focus:border-gray-400 focus:border-2">
          <SearchIcon className="size-4" /> <span className="text-sm font-medium">Comienza a buscar</span>
        </DialogTrigger>
        <DialogContent className="">
          <DialogTitle className="sr-only">Buscar cancha</DialogTitle>
          <Card className='mt-8 h-fit shadow-lg'>
            <CardHeader>
              <CardTitle>Donde?</CardTitle>
            </CardHeader>
            <CardContent>
            <label className="flex items-center w-full rounded-lg border border-gray-300 bg-white px-4 py-2 gap-2">
              <SearchIcon className="size-5" />
              <Input
                className="border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent flex-1"
                placeholder="Buscar cancha"
                type="text"
              />
            </label>
            </CardContent>
          </Card>

          <Card className='mt-8 h-fit shadow-lg'>
            <CardHeader>
              <CardTitle>Cuando?</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              <Input type="date" placeholder="Fecha" />
              <Input type="time" placeholder="Hora" />
            </CardContent>
          </Card>

          <Card className='mt-8 h-fit shadow-lg'>
            <CardHeader>
              <CardTitle>Modo de juego</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              <Input type="text" placeholder="Modo de juego" />
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SearchBar
