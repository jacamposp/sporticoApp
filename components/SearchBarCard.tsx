'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

const modes = [
  { value: '5v5', label: '5v5' },
  { value: '7v7', label: '7v7' },
  { value: '8v8', label: '8v8' },
  { value: '9v9', label: '9v9' },
  { value: '11v11', label: '11v11' },
]

const SearchBarCard = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [openAccordion, setOpenAccordion] = useState<string>('')
  const [openPopover, setOpenPopover] = useState<boolean>(false)

  const handleSearch = (id: string, term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set(id, term)
    } else {
      params.delete(id)
    }
    router.push(`/?${params.toString()}`)
  }

  const handleReset = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('location')
    params.delete('date')
    params.delete('time')
    params.delete('mode')
    router.push(`/?${params.toString()}`)
  }

  return (
    <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
      <AccordionItem value="location" className="shadow-xl rounded-lg p-2 bg-white mb-4">
        <AccordionTrigger icon={false} className="cursor-pointer px-2">
          <span className="text-gray-500">Donde?</span>
          {openAccordion !== 'location' && <span>{searchParams.get('location') || 'Cerca de mí'}</span>}
        </AccordionTrigger>
        <AccordionContent>
          <Input
            type="text"
            placeholder="Buscar cancha"
            defaultValue={searchParams.get('location') || ''}
            onChange={(e) => handleSearch('location', e.target.value)}
            className="shadow-none rounded-lg border border-gray-300 focus-visible:border-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="date" className="shadow-xl rounded-lg p-2 bg-white mb-4">
        <AccordionTrigger icon={false} className="cursor-pointer px-2">
          <span className="text-gray-500">Cuando?</span>
          {openAccordion !== 'date' && (
            <span>
              {searchParams.get('date') && searchParams.get('time')
                ? `${searchParams.get('date')} ${searchParams.get('time')}`
                : 'Cualquier fecha'}
            </span>
          )}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <Input
            type="date"
            placeholder="Fecha"
            defaultValue={searchParams.get('date') || ''}
            onChange={(e) => handleSearch('date', e.target.value)}
            className="shadow-none rounded-lg border border-gray-300 focus-visible:border-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Input
            type="time"
            placeholder="Hora"
            defaultValue={searchParams.get('time') || ''}
            onChange={(e) => handleSearch('time', e.target.value)}
            className="shadow-none rounded-lg border border-gray-300 focus-visible:border-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="mode" className="shadow-xl rounded-lg p-2 bg-white mb-4">
        <AccordionTrigger icon={false} className="cursor-pointer px-2">
          <span className="text-gray-500">Modo de juego</span>
          {openAccordion !== 'mode' && <span>{searchParams.get('mode') || 'Cualquier modo'}</span>}
        </AccordionTrigger>
        <AccordionContent>
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full">
                {searchParams.get('mode') || 'Cualquier modo'}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput placeholder="Buscar modo de juego" />
                <CommandList>
                  {modes.map((mode) => (
                    <CommandItem key={mode.value} onSelect={() => handleSearch('mode', mode.value)}>
                      {mode.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </AccordionContent>
      </AccordionItem>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleReset}>
          Limpiar filtros
        </Button>
        <Button variant="default">Buscar</Button>
      </div>
    </Accordion>
  )
}

export default SearchBarCard
