import { CarFront, ShowerHead, Wifi } from 'lucide-react'
// TODO: Add amenities map
const amenitiesexample = [
  {
    icon: CarFront,
    name: 'Estacionamiento',
  },
  {
    icon: ShowerHead,
    name: 'Baños',
  },
  {
    icon: Wifi,
    name: 'Wifi',
  },
]
export const Amenities = () => {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-2">Amenidades de la cancha</h2>
        <div className="grid grid-cols-2 gap-2">
          {amenitiesexample.map((amenity) => {
            return (
              <div key={amenity.name} className="flex items-center gap-2 rounded-xl border border-gray-400 p-2 w-full">
                <amenity.icon strokeWidth={2} />
                <span className="text-sm font-medium">{amenity.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
