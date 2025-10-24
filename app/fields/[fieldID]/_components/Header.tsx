'use client'

import * as React from 'react'
import { HeaderButtons } from './HeaderButtons'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import Image from 'next/image'

export const Header = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <>
      <div className="relative">
        <HeaderButtons />
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem>
              <Image src="/field-1.jpg" alt="Field" width={1000} height={1000} />
            </CarouselItem>
            <CarouselItem>
              <Image src="/campnou.webp" alt="Field" width={1000} height={1000} />
            </CarouselItem>
            <CarouselItem>
              <Image src="/field-1.jpg" alt="Field" width={1000} height={1000} />
            </CarouselItem>
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
        <span className="absolute bottom-16 right-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm font-medium">
          {current} / {count}
        </span>
      </div>
    </>
  )
}
