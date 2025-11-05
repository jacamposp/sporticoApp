'use client'

import { useBookingStore } from '@/lib/store/bookingStore'
import { useEffect, useState } from 'react'
import { BookingModal } from './BookingModal'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export const Booking = ({
  pricePerHour,
  fieldName,
  fieldId,
}: {
  pricePerHour: number
  fieldName?: string
  fieldId: number
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const totalPrice = useBookingStore((state) => state.getTotalPrice())
  const quantityOfHours = useBookingStore((state) => state.quantityOfHours)
  const setPricePerHour = useBookingStore((state) => state.setPricePerHour)

  useEffect(() => {
    setPricePerHour(pricePerHour)
  }, [pricePerHour])

  return (
    <>
      {isOpen && <BookingModal open={isOpen} onOpenChange={setIsOpen} fieldName={fieldName} fieldId={fieldId} />}
      <div className="flex justify-between items-center bottom-0 bg-white w-full p-4 sticky border-t border-gray-200">
        <div className="flex flex-col items-start gap-2">
          <span className="text-sm text-gray-500 text-left">Total</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(totalPrice)}</span>
        </div>
        <Button
          variant="outline"
          className="bg-primary text-white rounded-full"
          disabled={quantityOfHours === 0 || totalPrice === 0}
          onClick={() => setIsOpen(true)}
        >
          Reservar cancha
        </Button>
      </div>
    </>
  )
}
