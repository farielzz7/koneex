"use client"

import { Star, MapPin, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"

interface ExperienceCardProps {
  id: string
  title: string
  location: string
  image: string
  price: number
  duration: string
  rating: number
  reviews: number
  category: string
}

export function ExperienceCard({
  id,
  title,
  location,
  image,
  price,
  duration,
  rating,
  reviews,
  category,
}: ExperienceCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id,
      type: "experience",
      title,
      price,
      image,
      location,
      duration,
    })
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-accent text-white font-semibold">{category}</Badge>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-secondary text-secondary" />
          <span className="font-semibold text-sm">{rating}</span>
          <span className="text-xs text-text-muted">({reviews})</span>
        </div>

        <h3 className="font-display font-bold text-base mb-2 line-clamp-2 text-balance">{title}</h3>

        <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-xs text-text-muted">Desde</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">${price}</span>
            </div>
          </div>
          <Button size="sm" onClick={handleAddToCart} className="bg-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  )
}
