'use client'

import { use, useEffect, useState } from 'react'
import { WorkScheduleEditor } from '@/components/WorkScheduleEditor'
import { WorkScheduleData } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function FieldManagementPage({ params }: { params: Promise<{ fieldId: string }> }) {
  // Unwrap the params Promise
  const unwrappedParams = use(params)
  const fieldId = unwrappedParams.fieldId

  const [schedule, setSchedule] = useState<WorkScheduleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fieldName, setFieldName] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    fetchScheduleAndField()
  }, [fieldId])

  const fetchScheduleAndField = async () => {
    try {
      setLoading(true)

      // Fetch work schedule
      const scheduleResponse = await fetch(`/api/fields/${fieldId}/work-schedule`)
      const scheduleData = await scheduleResponse.json()

      if (scheduleData && scheduleData.id) {
        // Transform database format to component format
        const transformed: WorkScheduleData = {
          monday: {
            enabled: scheduleData.mondayEnabled,
            start: scheduleData.mondayStart,
            end: scheduleData.mondayEnd,
          },
          tuesday: {
            enabled: scheduleData.tuesdayEnabled,
            start: scheduleData.tuesdayStart,
            end: scheduleData.tuesdayEnd,
          },
          wednesday: {
            enabled: scheduleData.wednesdayEnabled,
            start: scheduleData.wednesdayStart,
            end: scheduleData.wednesdayEnd,
          },
          thursday: {
            enabled: scheduleData.thursdayEnabled,
            start: scheduleData.thursdayStart,
            end: scheduleData.thursdayEnd,
          },
          friday: {
            enabled: scheduleData.fridayEnabled,
            start: scheduleData.fridayStart,
            end: scheduleData.fridayEnd,
          },
          saturday: {
            enabled: scheduleData.saturdayEnabled,
            start: scheduleData.saturdayStart,
            end: scheduleData.saturdayEnd,
          },
          sunday: {
            enabled: scheduleData.sundayEnabled,
            start: scheduleData.sundayStart,
            end: scheduleData.sundayEnd,
          },
        }
        setSchedule(transformed)
      } else {
        // No schedule exists yet, set to null (will use defaults in editor)
        setSchedule(null)
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (newSchedule: WorkScheduleData) => {
    // Transform component format to database format
    const dbFormat = {
      mondayEnabled: newSchedule.monday.enabled,
      mondayStart: newSchedule.monday.start,
      mondayEnd: newSchedule.monday.end,
      tuesdayEnabled: newSchedule.tuesday.enabled,
      tuesdayStart: newSchedule.tuesday.start,
      tuesdayEnd: newSchedule.tuesday.end,
      wednesdayEnabled: newSchedule.wednesday.enabled,
      wednesdayStart: newSchedule.wednesday.start,
      wednesdayEnd: newSchedule.wednesday.end,
      thursdayEnabled: newSchedule.thursday.enabled,
      thursdayStart: newSchedule.thursday.start,
      thursdayEnd: newSchedule.thursday.end,
      fridayEnabled: newSchedule.friday.enabled,
      fridayStart: newSchedule.friday.start,
      fridayEnd: newSchedule.friday.end,
      saturdayEnabled: newSchedule.saturday.enabled,
      saturdayStart: newSchedule.saturday.start,
      saturdayEnd: newSchedule.saturday.end,
      sundayEnabled: newSchedule.sunday.enabled,
      sundayStart: newSchedule.sunday.start,
      sundayEnd: newSchedule.sunday.end,
    }

    const response = await fetch(`/api/fields/${fieldId}/work-schedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbFormat),
    })

    if (!response.ok) {
      throw new Error('Failed to save schedule')
    }

    // Refresh the schedule data
    await fetchScheduleAndField()
  }

  if (loading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 mb-20 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-2 text-blue-600 hover:text-blue-800 pl-0">
            ← Volver a mis canchas
          </Button>
          <h1 className="text-2xl font-bold">Gestionar Horario</h1>
          <p className="text-gray-600 text-sm mt-1">Configura los días y horarios en que tu cancha está disponible</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Marca los días que tu cancha está abierta y define el horario de apertura y cierre.
          Los usuarios solo podrán reservar dentro de estos horarios.
        </p>
      </div>

      <WorkScheduleEditor initialSchedule={schedule || undefined} onSave={handleSave} />
    </div>
  )
}
