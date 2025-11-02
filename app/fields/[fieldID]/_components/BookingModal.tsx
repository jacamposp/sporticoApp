'use client'

import { useMemo, useState } from 'react'
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
  fieldId: number
}

export const BookingModal = ({ open, onOpenChange, fieldName, fieldId }: BookingModalProps) => {
  const selectedDate = useBookingStore((s) => s.selectedDate)
  const selectedTimeRange = useBookingStore((s) => s.selectedTimeRange)
  const quantityOfHours = useBookingStore((s) => s.quantityOfHours)
  const pricePerHour = useBookingStore((s) => s.pricePerHour)
  const totalPrice = useBookingStore((s) => s.getTotalPrice())
  const resetBooking = useBookingStore((s) => s.resetBooking)

  const [submitting, setSubmitting] = useState(false)

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

  const formatDateYmd = (date: Date) => {
    const y = date.getFullYear()
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTimeRange) return
    try {
      setSubmitting(true)
      const res = await fetch(`/api/fields/${fieldId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formatDateYmd(selectedDate),
          start: selectedTimeRange.start,
          end: selectedTimeRange.end,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err?.error || 'No se pudo crear la reserva')
        return
      }

      const data = await res.json()
      alert(`Reserva creada (${data.status}). #${data.bookingId}`)
      resetBooking()
      onOpenChange(false)
    } catch (e) {
      alert('Error al crear la reserva')
    } finally {
      setSubmitting(false)
    }
  }

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
          <Button className="bg-primary text-white" disabled={!canConfirm || submitting} onClick={handleConfirm}>
            {submitting ? 'Creando…' : 'Confirmar reserva'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
