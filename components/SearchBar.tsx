import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import SearchBarCard from '@/components/SearchBarCard'
import { SearchIcon } from 'lucide-react'

const SearchBar = () => {
  return (
    <div className="p-4 bg-gray-50 shadow-sm flex justify-center">
      <Dialog>
        <DialogTrigger className="flex items-center gap-2 w-fit py-2 px-10 shadow-md border border-gray-200 bg-white rounded-full focus:border-gray-400 focus:border-2">
          <SearchIcon className="size-4" /> <span className="text-sm font-medium">Comienza a buscar</span>
        </DialogTrigger>
        <DialogContent className="w-full max-w-2xl rounded-none bg-gray-200">
          <DialogTitle className="sr-only">Buscar cancha</DialogTitle>
          <DialogDescription className="sr-only">Buscar cancha</DialogDescription>
          <SearchBarCard />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SearchBar
