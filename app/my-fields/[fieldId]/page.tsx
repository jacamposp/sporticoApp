'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { WorkScheduleEditor } from '@/components/WorkScheduleEditor'
import { FieldType, WorkScheduleData, fieldTypeDisplay } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

type Photo = { url: string; isCover?: boolean }

export default function FieldManagementPage({ params }: { params: Promise<{ fieldId: string }> }) {
  // Unwrap the params Promise
  const unwrappedParams = use(params)
  const fieldId = unwrappedParams.fieldId

  const [schedule, setSchedule] = useState<WorkScheduleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Basic info
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [type, setType] = useState<FieldType>('FIVE_VS_FIVE')
  const [pricePerHour, setPricePerHour] = useState<number | ''>('')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [autoConfirmBookings, setAutoConfirmBookings] = useState<boolean>(true)
  const [uploading, setUploading] = useState(false)

  // Amenidades (solo UI por ahora)
  const [amenities, setAmenities] = useState({
    floodlights: false,
    parking: false,
    restrooms: false,
    scoreboard: false,
  })

  // UI state
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetchFieldAndSchedule()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId])

  const fetchFieldAndSchedule = async () => {
    try {
      setLoading(true)

      const [fieldRes, scheduleRes] = await Promise.all([
        fetch(`/api/fields/${fieldId}`),
        fetch(`/api/fields/${fieldId}/work-schedule`),
      ])

      if (fieldRes.ok) {
        const field = await fieldRes.json()
        setName(field.name ?? '')
        setDescription(field.description ?? '')
        setAddress(field.address ?? '')
        setCity(field.city ?? '')
        setCountry(field.country ?? '')
        setType(field.fieldType ?? 'FIVE_VS_FIVE')
        setPricePerHour(typeof field.pricePerHour === 'number' ? field.pricePerHour : '')
        setPhotos(Array.isArray(field.photos) ? field.photos.map((p: any) => ({ url: p.url, isCover: p.isCover })) : [])
        setAutoConfirmBookings(typeof field.autoConfirmBookings === 'boolean' ? field.autoConfirmBookings : true)
      }

      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json()
        if (scheduleData && scheduleData.fieldId) {
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
          setSchedule(null)
        }
      }
    } catch (error) {
      console.error('Failed to fetch field/schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSchedule = async (newSchedule: WorkScheduleData) => {
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
    if (!response.ok) throw new Error('Failed to save schedule')
    setSchedule(newSchedule)
    setOpenScheduleDialog(false)
  }

  const dayRows = useMemo(() => {
    const days: Array<{ key: keyof WorkScheduleData; label: string }> = [
      { key: 'monday', label: 'Monday' },
      { key: 'tuesday', label: 'Tuesday' },
      { key: 'wednesday', label: 'Wednesday' },
      { key: 'thursday', label: 'Thursday' },
      { key: 'friday', label: 'Friday' },
      { key: 'saturday', label: 'Saturday' },
      { key: 'sunday', label: 'Sunday' },
    ]
    return days
  }, [])

  // URL-based photo addition removed; only local uploads are supported

  const onFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    try {
      setUploading(true)
      const uploads = Array.from(files).map(async (file) => {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/uploads', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        const url = Array.isArray(data.urls) ? data.urls[0] : undefined
        if (url) {
          setPhotos((prev) => {
            const hasCover = prev.some((p) => p.isCover)
            return [...prev, { url, isCover: hasCover ? false : prev.length === 0 }]
          })
        }
      })
      await Promise.all(uploads)
    } catch (e) {
      console.error(e)
      alert('No se pudo subir la imagen. Intenta nuevamente.')
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const toggleAmenity = (key: keyof typeof amenities) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveField = async () => {
    try {
      setSaving(true)
      const body = {
        name,
        description,
        address,
        city,
        country,
        pricePerHour: typeof pricePerHour === 'string' ? Number(pricePerHour) : pricePerHour,
        fieldType: type,
        photos,
        autoConfirmBookings,
      }

      const res = await fetch(`/api/fields/${fieldId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save field')
      await fetchFieldAndSchedule()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
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
    <div className="p-4 mb-24 max-w-2xl mx-auto">
      <div className="mb-2">
        <Button variant="ghost" onClick={() => router.back()} className="mb-2 text-blue-600 hover:text-blue-800 pl-0">
          ← Volver a mis canchas
        </Button>
        <h1 className="text-2xl font-bold">Editar Cancha</h1>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Información básica</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la cancha</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Grand Slam Tennis Court"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full min-h-28 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Descripción de la cancha, amenidades, etc."
            />
          </div>

          <div>
            <Label htmlFor="address">Ubicación</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ciudad" />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="País" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value as FieldType)}
              >
                <option value="FIVE_VS_FIVE">{fieldTypeDisplay['FIVE_VS_FIVE']}</option>
                <option value="SEVEN_VS_SEVEN">{fieldTypeDisplay['SEVEN_VS_SEVEN']}</option>
                <option value="ELEVEN_VS_ELEVEN">{fieldTypeDisplay['ELEVEN_VS_ELEVEN']}</option>
              </select>
            </div>
            <div>
              <Label htmlFor="price">Precio por hora</Label>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-2 py-2 rounded-md border bg-gray-50 text-sm">$</span>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={autoConfirmBookings}
                  onChange={(e) => setAutoConfirmBookings(e.target.checked)}
                />
                Confirmación automática de reservas
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Fotos</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {photos.map((p, idx) => (
            <div key={`${p.url}-${idx}`} className="relative h-28 w-40 shrink-0 rounded-md overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="Foto" className="h-full w-full object-cover" />
              {p.isCover ? (
                <span className="absolute left-2 top-2 inline-flex items-center rounded bg-green-600/90 px-2 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              ) : null}
              <button
                onClick={() => removePhoto(idx)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 text-xs"
                aria-label="Eliminar foto"
              >
                ×
              </button>
            </div>
          ))}

          <label
            htmlFor="photo-upload-input"
            className="h-28 w-40 shrink-0 rounded-md border border-dashed flex flex-col items-center justify-center text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            {uploading ? 'Subiendo…' : 'Subir fotos'}
            <input
              id="photo-upload-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onFilesSelected(e.target.files)}
            />
          </label>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Amenidades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            type="button"
            variant={amenities.floodlights ? 'default' : 'outline'}
            onClick={() => toggleAmenity('floodlights')}
            className="justify-start"
          >
            {amenities.floodlights ? '✅ ' : '⬜️ '}Focos / Iluminación
          </Button>
          <Button
            type="button"
            variant={amenities.parking ? 'default' : 'outline'}
            onClick={() => toggleAmenity('parking')}
            className="justify-start"
          >
            {amenities.parking ? '✅ ' : '⬜️ '}Estacionamiento
          </Button>
          <Button
            type="button"
            variant={amenities.restrooms ? 'default' : 'outline'}
            onClick={() => toggleAmenity('restrooms')}
            className="justify-start"
          >
            {amenities.restrooms ? '✅ ' : '⬜️ '}Baños
          </Button>
          <Button
            type="button"
            variant={amenities.scoreboard ? 'default' : 'outline'}
            onClick={() => toggleAmenity('scoreboard')}
            className="justify-start"
          >
            {amenities.scoreboard ? '✅ ' : '⬜️ '}Marcador
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Disponibilidad</h2>
        <div className="rounded-lg border">
          {dayRows.map(({ key, label }, idx) => {
            const s = schedule?.[key]
            const isLast = idx === dayRows.length - 1
            const value = s?.enabled ? `${s.start} - ${s.end}` : 'Cerrado'
            return (
              <button
                key={key}
                onClick={() => setOpenScheduleDialog(true)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left ${!isLast ? 'border-b' : ''}`}
              >
                <span className="text-sm">{label}</span>
                <span className={`text-sm ${s?.enabled ? '' : 'text-red-600'}`}>{value}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t mt-6 pt-3 pb-4">
        <div className="max-w-2xl mx-auto flex gap-3 px-4">
          <Button variant="outline" className="flex-1" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSaveField} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      <Dialog open={openScheduleDialog} onOpenChange={setOpenScheduleDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Gestionar horario</DialogTitle>
          </DialogHeader>
          <WorkScheduleEditor initialSchedule={schedule || undefined} onSave={saveSchedule} />
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
