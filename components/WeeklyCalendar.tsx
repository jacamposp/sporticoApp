'use client'

import { useState } from 'react'
import { useBookingStore } from '@/lib/store/bookingStore'
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// interface WeeklyCalendarProps {
//   selectedDate: Date | null;
//   onDateSelect: (date: Date) => void;
// }

const WeeklyCalendar = () => {
  const selectedDate = useBookingStore((state) => state.selectedDate)
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate)

  const [currentDate, setCurrentDate] = useState(new Date())
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7))
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7))

  const formattedMonth =
    format(currentDate, 'MMMM yyyy', { locale: es }).charAt(0).toUpperCase() +
    format(currentDate, 'MMMM yyyy', { locale: es }).slice(1)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="w-full p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-gray-700">{formattedMonth}</h2>
        <div className="flex gap-1">
          <button onClick={handlePrevWeek} className="p-1 rounded-md hover:bg-gray-200">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={handleNextWeek} className="p-1 rounded-md hover:bg-gray-200">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-1">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Días */}
      <div className="grid grid-cols-7 text-center">
        {weekDays.map((day) => {
          const dayCopy = new Date(day)
          dayCopy.setHours(0, 0, 0, 0)
          const isPast = dayCopy < today
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
          return (
            <button
              key={day.toISOString()}
              onClick={() => !isPast && setSelectedDate(day as Date)}
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm transition
                ${
                  isSelected
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : isPast
                    ? 'text-gray-400  cursor-not-allowed'
                    : 'text-gray-800 hover:bg-gray-200'
                }`}
              disabled={isPast}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WeeklyCalendar
