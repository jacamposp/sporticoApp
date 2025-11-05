import { Star, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { FieldType, fieldTypeDisplay } from '@/lib/types'

export const MainInfo = ({ name, address, fieldType }: { name: string; address: string; fieldType: FieldType }) => {
  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold text-center">{name}</h1>
          <span className="text-sm text-gray-500">{address}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Star strokeWidth={2} />
          <span className="text-sm font-medium">4.5</span>
        </div>
        <Separator orientation="vertical" decorative className="bg-gray-400" style={{ height: '20px', width: '1px' }} />
        <div className="flex items-center gap-2">
          <Users strokeWidth={2} />
          <span className="text-sm font-medium">{fieldTypeDisplay[fieldType]}</span>
        </div>
      </div>
      <Separator orientation="horizontal" className="bg-gray-200" />
    </>
  )
}
