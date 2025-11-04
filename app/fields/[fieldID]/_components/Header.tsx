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

type HeaderProps = {
  photos?: Array<{ url: string }>
}

export const Header = ({ photos }: HeaderProps) => {
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

  const imageUrls = (photos && photos.length > 0 ? photos : []).map((p) => p.url)
  //TODO: Add fallback images
  const fallback = ['/field-1.jpg', '/campnou.webp', '/field-1.jpg']
  const slides = imageUrls.length > 0 ? imageUrls : fallback

  return (
    <>
      <div className="relative">
        <HeaderButtons />
        <Carousel setApi={setApi}>
          <CarouselContent>
            {slides.map((src, idx) => (
              <CarouselItem key={`${src}-${idx}`} className="flex justify-center">
                <div className="relative w-full max-w-[1000px] h-[300px] sm:h-[360px] md:h-[420px] overflow-hidden">
                  <Image
                    src={src}
                    alt="Field"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))}
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
