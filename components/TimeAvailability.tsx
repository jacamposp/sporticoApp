'use client'

import { useBookingStore } from '@/lib/store/bookingStore'

const hours = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
]

const TimeAvailability = () => {
  const selectedDate = useBookingStore((state) => state.selectedDate)
  const selectedHours = useBookingStore((state) => state.selectedHours)
  const toggleHour = useBookingStore((state) => state.toggleHour)

  if (!selectedDate) {
    return (
      <div className="mt-4 text-gray-500 text-sm text-center">Selecciona una fecha para ver las horas disponibles.</div>
    )
  }

  const formattedDate = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const formattedDateWithCapitalizedFirstLetter = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 text-center mb-3">
        Horas disponibles para <span className="text-blue-700">{formattedDateWithCapitalizedFirstLetter}</span>
      </h3>

      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
        {hours.map((hour) => (
          <button
            key={hour}
            onClick={() => toggleHour(hour)}
            className={`py-2 rounded-lg border text-sm transition
              ${
                selectedHours.includes(hour)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'
              }`}
          >
            {hour}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeAvailability
