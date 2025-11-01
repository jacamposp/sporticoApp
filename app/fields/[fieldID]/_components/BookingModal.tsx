'use client'

import { useMemo } from 'react'
import { useBookingStore } from '@/lib/store/bookingStore'
import { formatCurrency } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type BookingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldName?: string
}

export const BookingModal = ({ open, onOpenChange, fieldName }: BookingModalProps) => {
  const selectedDate = useBookingStore((s) => s.selectedDate)
  const selectedTimeRange = useBookingStore((s) => s.selectedTimeRange)
  const quantityOfHours = useBookingStore((s) => s.quantityOfHours)
  const pricePerHour = useBookingStore((s) => s.pricePerHour)
  const totalPrice = useBookingStore((s) => s.getTotalPrice())

  const formattedDate = useMemo(() => {
    if (!selectedDate) return '-'
    return selectedDate.toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [selectedDate])

  const timeRange = selectedTimeRange ? `${selectedTimeRange.start} - ${selectedTimeRange.end}` : '-'
  const durationLabel = quantityOfHours === 1 ? '1 hora' : `${quantityOfHours} horas`

  const canConfirm = Boolean(selectedDate && selectedTimeRange && quantityOfHours > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resumen de reserva</DialogTitle>
          <DialogDescription>Revisa los detalles antes de confirmar.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {fieldName && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cancha</span>
              <span className="font-medium">{fieldName}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fecha</span>
            <span className="font-medium capitalize">{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Horario</span>
            <span className="font-medium">{timeRange}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Duración</span>
            <span className="font-medium">{durationLabel}</span>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Precio por hora</span>
            <span className="font-medium">{formatCurrency(pricePerHour)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-bold">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Editar</Button>
          </DialogClose>
          <Button className="bg-primary text-white" disabled={!canConfirm} onClick={() => onOpenChange(false)}>
            Confirmar reserva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
