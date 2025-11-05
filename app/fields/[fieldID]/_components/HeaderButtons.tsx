'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ShareIcon } from 'lucide-react'

export const HeaderButtons = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div>
      <Button
        variant="outline"
        className="absolute top-4 left-4 h-10 w-10 opacity-75 rounded-full z-10"
        onClick={handleGoBack}
      >
        <ArrowLeftIcon strokeWidth={2.5} />
      </Button>
      <Button variant="outline" className="absolute top-4 right-4 h-10 w-10 opacity-75 rounded-full z-10">
        <ShareIcon strokeWidth={2} />
      </Button>
    </div>
  )
}
