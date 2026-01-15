"use client"

import type React from "react"

import { Star, MapPin, Clock, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { motion } from "framer-motion"
import { useState } from "react"

interface PackageCardProps {
  id: string
  title: string
  destination: string
  image: string
  price: number
  duration: string
  rating: number
  reviews: number
  groupSize: string
  featured?: boolean
  tags?: string[]
}

export function PackageCard({
  id,
  title,
  destination,
  image,
  price,
  duration,
  rating,
  reviews,
  groupSize,
  featured = false,
  tags = [],
}: PackageCardProps) {
  const { addItem } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id,
      type: "package",
      title,
      price,
      image,
      destination,
      duration,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 border border-border"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {featured && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <Badge className="absolute top-3 left-3 bg-gradient-toucan text-white font-semibold">Destacado</Badge>
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
        >
          <motion.div animate={isFavorite ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-danger text-danger" : "text-text-muted"}`} />
          </motion.div>
        </motion.button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="font-semibold text-sm">{rating}</span>
          <span className="text-xs text-text-muted">({reviews} reseñas)</span>
        </div>

        <h3 className="font-display font-bold text-lg mb-2 line-clamp-2 text-balance">{title}</h3>

        <div className="flex items-center gap-1 text-sm text-text-muted mb-3">
          <MapPin className="w-4 h-4" />
          <span>{destination}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{groupSize}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Badge variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-sm text-text-muted">Desde</span>
            <div className="flex items-baseline gap-1">
              <motion.span
                className="text-2xl font-bold text-gradient"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                ${price}
              </motion.span>
              <span className="text-sm text-text-muted">USD</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/paquetes/${id}`}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Ver
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" onClick={handleAddToCart} className="bg-gradient-toucan hover:opacity-90">
                Agregar
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
