'use client'

import { useBookingStore } from '@/lib/store/bookingStore'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

type AvailabilityData = {
  availableSlots: string[]
  bookedSlots: string[]
}

type TimeAvailabilityProps = {
  fieldId: number
}

const TimeAvailability = ({ fieldId }: TimeAvailabilityProps) => {
  const selectedDate = useBookingStore((state) => state.selectedDate)
  const selectedTimeRange = useBookingStore((state) => state.selectedTimeRange)
  const setTimeRange = useBookingStore((state) => state.setTimeRange)
  const clearTimeSelection = useBookingStore((state) => state.clearTimeSelection)

  const [availability, setAvailability] = useState<AvailabilityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [tempStartTime, setTempStartTime] = useState<string | null>(null)

  // Fetch availability when date changes
  useEffect(() => {
    if (!selectedDate) return

    const fetchAvailability = async () => {
      setLoading(true)
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const response = await fetch(`/api/fields/${fieldId}/availability?date=${dateStr}`)

        if (!response.ok) {
          console.error('API error:', response.status)
          setAvailability({ availableSlots: [], bookedSlots: [] })
          return
        }

        const data = await response.json()

        // Ensure data has the expected structure
        if (data && typeof data === 'object') {
          setAvailability({
            availableSlots: data.availableSlots || [],
            bookedSlots: data.bookedSlots || [],
          })
        } else {
          setAvailability({ availableSlots: [], bookedSlots: [] })
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error)
        setAvailability({ availableSlots: [], bookedSlots: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
    clearTimeSelection()
    setTempStartTime(null)
  }, [selectedDate, fieldId])

  if (!selectedDate) {
    return (
      <div className="mt-4 text-gray-500 text-sm text-center">Selecciona una fecha para ver las horas disponibles.</div>
    )
  }

  if (loading) {
    return <div className="mt-4 text-center text-sm text-gray-500">Cargando disponibilidad...</div>
  }

  if (!availability || !availability.availableSlots || availability.availableSlots.length === 0) {
    return <div className="mt-4 text-center text-sm text-gray-500">No hay horarios disponibles para esta fecha.</div>
  }

  const formattedDate = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const formattedDateCapitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  // Handle slot click for consecutive selection
  const handleSlotClick = (slot: string) => {
    if (!tempStartTime) {
      // First click - immediately book this 1 hour
      setTempStartTime(slot)
      const hourNum = parseInt(slot.split(':')[0])
      const endTime = `${(hourNum + 1).toString().padStart(2, '0')}:00`
      setTimeRange(slot, endTime)
    } else {
      // Second click - create range from tempStart to this slot
      const startHour = parseInt(tempStartTime.split(':')[0])
      const endHour = parseInt(slot.split(':')[0])

      // If clicking same hour, do nothing (already booked)
      if (endHour === startHour) {
        return
      }

      let finalStart: string
      let finalEnd: string

      if (endHour < startHour) {
        // Backwards selection - swap them
        finalStart = slot
        finalEnd = `${(startHour + 1).toString().padStart(2, '0')}:00`
      } else {
        // Forward selection
        finalStart = tempStartTime
        finalEnd = `${(endHour + 1).toString().padStart(2, '0')}:00`
      }

      // Check if all hours in range are available
      const startCheck = parseInt(finalStart.split(':')[0])
      const endCheck = parseInt(finalEnd.split(':')[0]) - 1
      let allAvailableInRange = true

      for (let h = startCheck; h <= endCheck; h++) {
        const timeSlot = `${h.toString().padStart(2, '0')}:00`
        if (!availability.availableSlots.includes(timeSlot)) {
          allAvailableInRange = false
          break
        }
      }

      if (!allAvailableInRange) {
        alert('No puedes seleccionar un rango con horas no disponibles')
        setTempStartTime(null)
        return
      }

      setTimeRange(finalStart, finalEnd)
      setTempStartTime(null)
    }
  }

  // Check if all hours in a range are available
  const checkRangeAvailability = (start: string, end: string): boolean => {
    const startHour = parseInt(start.split(':')[0])
    const endHour = parseInt(end.split(':')[0])

    for (let hour = startHour; hour <= endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`
      if (!availability.availableSlots.includes(timeSlot)) {
        return false
      }
    }
    return true
  }

  // Check if a slot is in the selected range
  const isInSelectedRange = (slot: string): boolean => {
    if (!selectedTimeRange) return false
    const slotHour = parseInt(slot.split(':')[0])
    const startHour = parseInt(selectedTimeRange.start.split(':')[0])
    const endHour = parseInt(selectedTimeRange.end.split(':')[0])
    return slotHour >= startHour && slotHour < endHour
  }

  // Combine available and booked slots to show all hours
  const allSlots = [...(availability.availableSlots || []), ...(availability.bookedSlots || [])].sort()

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 text-center mb-3">
        Horas disponibles para <span className="text-blue-700">{formattedDateCapitalized}</span>
      </h3>

      {tempStartTime && (
        <p className="text-xs text-center mb-2 text-blue-600">
          Inicio: {tempStartTime}. Ahora selecciona la hora de fin.
        </p>
      )}

      {selectedTimeRange && (
        <div className="text-center mb-3">
          <p className="text-sm font-medium text-green-600">
            Seleccionado: {selectedTimeRange.start} - {selectedTimeRange.end}
          </p>
          <button
            onClick={() => {
              clearTimeSelection()
              setTempStartTime(null)
            }}
            className="text-xs text-red-500 hover:text-red-700 mt-1 underline"
          >
            Limpiar selección
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
        {allSlots.map((slot) => {
          const isBooked = availability.bookedSlots.includes(slot)
          const isAvailable = availability.availableSlots.includes(slot)
          const isSelected = isInSelectedRange(slot)
          const isStart = tempStartTime === slot

          return (
            <button
              key={slot}
              onClick={() => isAvailable && handleSlotClick(slot)}
              disabled={isBooked}
              className={`py-2 rounded-lg border text-sm transition
                ${
                  isBooked
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through'
                    : isSelected
                    ? 'bg-primary text-white border-primary font-semibold'
                    : isStart
                    ? 'bg-blue-200 text-blue-800 border-blue-400 font-semibold'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'
                }`}
            >
              {slot}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TimeAvailability
