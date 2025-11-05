'use client'

import { useState } from 'react'
import { WorkScheduleData, DayOfWeek } from '@/lib/types'
import { Button } from './ui/button'

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

// Generate hours from 00:00 to 23:00
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

type WorkScheduleEditorProps = {
  initialSchedule?: WorkScheduleData
  onSave: (schedule: WorkScheduleData) => Promise<void>
}

export const WorkScheduleEditor = ({ initialSchedule, onSave }: WorkScheduleEditorProps) => {
  const [schedule, setSchedule] = useState<WorkScheduleData>(
    initialSchedule || {
      monday: { enabled: false, start: null, end: null },
      tuesday: { enabled: false, start: null, end: null },
      wednesday: { enabled: false, start: null, end: null },
      thursday: { enabled: false, start: null, end: null },
      friday: { enabled: false, start: null, end: null },
      saturday: { enabled: false, start: null, end: null },
      sunday: { enabled: false, start: null, end: null },
    }
  )
  const [saving, setSaving] = useState(false)

  // Toggle a day on/off
  const toggleDay = (day: DayOfWeek) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        // Set default times when enabling
        start: !prev[day].enabled ? '08:00' : prev[day].start,
        end: !prev[day].enabled ? '22:00' : prev[day].end,
      },
    }))
  }

  // Update start or end time for a day
  const updateTime = (day: DayOfWeek, field: 'start' | 'end', value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  // Handle save button click
  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(schedule)
      alert('Horario guardado exitosamente')
    } catch (error) {
      alert('Error al guardar el horario')
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Horario de Trabajo Semanal</h2>

      {DAYS.map(({ key, label }) => (
        <div key={key} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={schedule[key].enabled}
                onChange={() => toggleDay(key)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="font-medium text-lg">{label}</span>
            </label>
            {schedule[key].enabled && (
              <span className="text-xs text-gray-500">
                {schedule[key].start} - {schedule[key].end}
              </span>
            )}
          </div>

          {schedule[key].enabled && (
            <div className="flex gap-4 items-center ml-6">
              <div className="flex-1">
                <label className="text-sm text-gray-600 block mb-1">Hora de inicio</label>
                <select
                  value={schedule[key].start || ''}
                  onChange={(e) => updateTime(key, 'start', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-600 block mb-1">Hora de cierre</label>
                <select
                  value={schedule[key].end || ''}
                  onChange={(e) => updateTime(key, 'end', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
      >
        {saving ? 'Guardando...' : 'Guardar Horario'}
      </Button>
    </div>
  )
}
