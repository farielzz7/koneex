"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

interface AddToCartButtonProps {
  pkg: {
    id: string
    title: string
    price: number
    image: string
    destination: string
    duration: string
  }
}

export function AddToCartButton({ pkg }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: pkg.id,
      type: "package",
      title: pkg.title,
      price: pkg.price,
      image: pkg.image,
      destination: pkg.destination,
      duration: pkg.duration,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full h-12 bg-primary hover:bg-primary-hover text-lg transition-all"
      disabled={added}
    >
      {added ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Agregado al Carrito
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Agregar al Carrito
        </>
      )}
    </Button>
  )
}
