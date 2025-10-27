import { create } from 'zustand'

interface BookingState {
  // Booking info
  fieldId: string | null
  selectedDate: Date | null
  selectedTimeRange: { start: string; end: string } | null  // NEW: Track start/end as a range
  selectedHours: string[]
  quantityOfHours: number
  pricePerHour: number

  // Actions
  setFieldId: (id: string) => void
  setSelectedDate: (selectedDate: Date) => void
  setTimeRange: (start: string, end: string) => void  // NEW: Replace toggleHour
  clearTimeSelection: () => void  // NEW: Clear selected time
  setPricePerHour: (pricePerHour: number) => void
  getTotalPrice: () => number
  resetBooking: () => void
}

// Helper function to generate consecutive hours between start and end
const generateConsecutiveHours = (start: string, end: string): string[] => {
  const startHour = parseInt(start.split(':')[0])
  const endHour = parseInt(end.split(':')[0])
  const hours: string[] = []
  
  for (let hour = startHour; hour < endHour; hour++) {
    hours.push(`${hour.toString().padStart(2, '0')}:00`)
  }
  
  return hours
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial state
  fieldId: null,
  selectedDate: new Date(),
  selectedTimeRange: null,  // NEW
  selectedHours: [],
  quantityOfHours: 0,
  pricePerHour: 0,

  // Actions
  setFieldId: (id: string) => set({ fieldId: id }),
  
  // When date changes, clear the time selection
  setSelectedDate: (date: Date) => 
    set({ 
      selectedDate: date,
      selectedTimeRange: null,
      selectedHours: [],
      quantityOfHours: 0,
    }),
  
  // NEW: Set a time range and automatically generate consecutive hours
  setTimeRange: (start: string, end: string) => {
    const hours = generateConsecutiveHours(start, end)
    set({
      selectedTimeRange: { start, end },
      selectedHours: hours,
      quantityOfHours: hours.length,
    })
  },
  
  // NEW: Clear the current time selection
  clearTimeSelection: () => 
    set({
      selectedTimeRange: null,
      selectedHours: [],
      quantityOfHours: 0,
    }),
  
  setPricePerHour: (price: number) => set({ pricePerHour: price }),

  getTotalPrice: () => {
    const state = get()
    return state.pricePerHour * state.quantityOfHours
  },

  resetBooking: () =>
    set({
      fieldId: null,
      selectedDate: null,
      selectedTimeRange: null,
      selectedHours: [],
      quantityOfHours: 0,
      pricePerHour: 0,
    }),
}))