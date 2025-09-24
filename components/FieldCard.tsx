import { Star, MapPin, Clock, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type FieldType = 'Exterior' | 'Interior'

interface FieldCardProps {
  id: number
  name: string
  image: string
  location: string
  rating: number
  reviewCount: number
  price: number
  type: FieldType
  capacity: string
  availability?: string
  //   onViewDetails: (id: string) => void;
}

export const FieldCard = ({
  id,
  name,
  image,
  location,
  rating,
  reviewCount,
  price,
  type,
  capacity,
  availability,
}: //   onViewDetails,
FieldCardProps) => {
  return (
    <Card
      key={id}
      className="group overflow-hidden min-w-[350px] max-w-[450px] border-none shadow-card hover:shadow-hover hover:rounded-lg transition-all duration-300 transform hover:-translate-y-1 bg-card-gradient"
    >
      <div className="rounded-t-lg relative overflow-hidden group-hover:rounded-t-lg transition-all duration-500">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-500"
        />
        <Badge
          variant={type === 'Exterior' ? 'default' : 'secondary'}
          className="absolute top-3 right-3 bg-white/90 text-foreground"
        >
          {type}
        </Badge>
      </div>

      <CardContent className="px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg leading-tight">{name}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 fill-warning text-warning mr-1" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground ml-1">({reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{capacity}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{availability}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">₡{price}</span>
            <span className="text-muted-foreground">/hora</span>
          </div>
          <Button
            // onClick={() => onViewDetails(id)}
            variant="default"
            className="bg-primary hover:bg-primary-hover shadow-soft"
          >
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
