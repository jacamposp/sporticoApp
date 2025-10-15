'use client';

import { useState } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import TimeAvailability from './TimeAvailability';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <div className="p-4">
      {/* Calendario */}
      <WeeklyCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Disponibilidad de horas */}
      <TimeAvailability selectedDate={selectedDate} />
    </div>
  );
};

export default Calendar;
