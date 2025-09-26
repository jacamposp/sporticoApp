import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { SearchIcon } from 'lucide-react'

const SearchBar = () => {
  return (
    <div className="p-4 bg-gray-50 shadow-sm">
      <Dialog>
        <DialogTrigger className="flex place-self-center items-center gap-2 w-fit py-2 px-10 shadow-md border border-gray-200 bg-white rounded-full focus:border-gray-400 focus:border-2">
          <SearchIcon className="size-4" /> <span className="text-sm font-medium">Comienza a buscar</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comienza a buscar</DialogTitle>
            <DialogDescription>Encuentra el campo de fútbol perfecto para ti</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SearchBar
