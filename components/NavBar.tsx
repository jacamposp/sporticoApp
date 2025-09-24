'use client'

import { useState, Dispatch, SetStateAction } from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import { Menu, Search, User, LogOut, Settings } from 'lucide-react'
// import { formatTime12h } from '@/lib/utils'
import { useSession, signOut } from 'next-auth/react'
// import { Filters } from '@/lib/types'

const vsMode = [
  { value: '1 vs 1', label: '1 vs 1' },
  { value: '2 vs 2', label: '2 vs 2' },
  { value: '3 vs 3', label: '3 vs 3' },
  { value: '4 vs 4', label: '4 vs 4' },
]

const Navbar = () => {
  const { data: session } = useSession()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>('')
  const [jugadores, setJugadores] = useState<string>('')
  const [location, setLocation] = useState<string>('')

  //   const handleSearch = (key: keyof Filters, value: Filters[keyof Filters]) => {
  //     setFilters((prev) => ({
  //       ...prev,
  //       [key]: value,
  //     }))
  //     console.log(filters)
  //   }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-gray-50 w-full flex items-center px-6 py-4">
      <Menubar className="w-full h-10 rounded-4xl border-none items-center justify-center">
        <MenubarMenu>
          <MenubarTrigger className="flex items-center gap-2 data-[state=open]:bg-transparent">
            <Search className="size-4" /> Comienza tu búsqueda
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </header>
  )
}

export default Navbar
