'use client';

import { useState } from 'react';

interface AvailableHoursProps {
  selectedDate: Date | null;
}

const TimeAvailability = ({ selectedDate }: AvailableHoursProps) => {
  // Lista de horas disponibles (puedes cambiar el rango)
  const horas = [
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
  ];

  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);

  if (!selectedDate) {
    return (
      <div className="mt-4 text-gray-500 text-sm text-center">
        Selecciona una fecha para ver las horas disponibles.
      </div>
    );
  }

  const fechaFormateada = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Capitalizar la primera letra
  const fechaConMayuscula =
    fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 text-center mb-3">
        Horas disponibles para <span className="text-blue-700">{fechaConMayuscula}</span>
      </h3>

      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
        {horas.map((hora) => (
          <button
            key={hora}
            onClick={() => setHoraSeleccionada(hora)}
            className={`py-2 rounded-lg border text-sm transition
              ${
                horaSeleccionada === hora
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'
              }`}
          >
            {hora}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TimeAvailability