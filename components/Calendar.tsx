import WeeklyCalendar from './WeeklyCalendar'
import TimeAvailability from './TimeAvailability'

const Calendar = ({ fieldId }: { fieldId: number }) => {
  return (
    <div className="p-4">
      {/* Calendario */}
      <WeeklyCalendar />

      {/* Disponibilidad de horas */}
      <TimeAvailability fieldId={fieldId} />
    </div>
  )
}

export default Calendar
