import WeeklyCalendar from './WeeklyCalendar'
import TimeAvailability from './TimeAvailability'

const Calendar = () => {
  return (
    <div className="p-4">
      {/* Calendario */}
      <WeeklyCalendar />

      {/* Disponibilidad de horas */}
      <TimeAvailability />
    </div>
  )
}

export default Calendar
