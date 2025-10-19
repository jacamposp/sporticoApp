import { create } from 'zustand'

interface BookingState {
  // Booking info
  fieldId: string | null
  selectedDate: Date | null
  selectedHours: string[]
  quantityOfHours: number
  pricePerHour: number

  // Actions
  setFieldId: (id: string) => void
  setSelectedDate: (selectedDate: Date) => void
  setQuantityOfHours: (quantityOfHours: number) => void
  setPricePerHour: (pricePerHour: number) => void
  toggleHour: (hour: string) => void
  getTotalPrice: () => number
  resetBooking: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial state
  fieldId: null,
  selectedDate: new Date(),
  selectedHours: [],
  quantityOfHours: 0,
  pricePerHour: 0,

  // Actions
  setFieldId: (id: string) => set({ fieldId: id }),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  setQuantityOfHours: (hours: number) => set({ quantityOfHours: hours }),
  setPricePerHour: (price: number) => set({ pricePerHour: price }),

  toggleHour: (hour) =>
    set((state) => {
      const newHours = state.selectedHours.includes(hour)
        ? state.selectedHours.filter((h) => h !== hour)
        : [...state.selectedHours, hour]
      return {
        selectedHours: newHours,
        quantityOfHours: newHours.length,
      }
    }),

  getTotalPrice: () => {
    const state = get()
    return state.pricePerHour * state.quantityOfHours
  },

  resetBooking: () =>
    set({
      fieldId: null,
      selectedDate: null,
      selectedHours: [],
      quantityOfHours: 0,
      pricePerHour: 0,
    }),
}))
