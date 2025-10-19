export type Filters = {
  location: string
  date: string
  time: string
  mode: string
}

export type FieldType = 'FIVE_VS_FIVE' | 'SEVEN_VS_SEVEN' | 'ELEVEN_VS_ELEVEN'

// Helper para mostrar los tipos de campo de forma legible
export const fieldTypeDisplay: Record<FieldType, string> = {
  FIVE_VS_FIVE: '5vs5',
  SEVEN_VS_SEVEN: '7vs7',
  ELEVEN_VS_ELEVEN: '11vs11',
}
