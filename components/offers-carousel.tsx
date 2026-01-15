"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Tag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface Offer {
  id: string
  title: string
  destination: string
  image: string
  originalPrice: number
  price: number
  discount: number
  duration: string
  rating: number
  reviews: number
  tags: string[]
  includes: string[]
}

interface OffersCarouselProps {
  offers: Offer[]
}

export function OffersCarousel({ offers }: OffersCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideTo = (index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const nextSlide = () => {
    const next = (current + 1) % offers.length
    slideTo(next)
  }

  const prevSlide = () => {
    const prev = (current - 1 + offers.length) % offers.length
    slideTo(prev)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [current])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 p-1">
      <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={offers[current].image || "/placeholder.svg"}
                alt={offers[current].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
                <div className="absolute top-4 right-4 bg-danger text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  {offers[current].discount}% OFF
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="inline-block bg-warning text-black px-3 py-1 rounded-full text-sm font-bold mb-3">
                    <Tag className="w-4 h-4 inline mr-1" />
                    MEGA OFERTA
                  </div>
                  <h3 className="text-3xl md:text-5xl font-display font-bold mb-2">{offers[current].title}</h3>
                  <p className="text-xl mb-4 opacity-90">{offers[current].destination}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-warning text-warning" />
                    <span className="font-bold">{offers[current].rating}</span>
                    <span className="opacity-75">({offers[current].reviews} reseñas)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {offers[current].tags.map((tag) => (
                      <span key={tag} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end gap-4 mb-6">
                    <div>
                      <p className="text-sm line-through opacity-60">${offers[current].originalPrice}</p>
                      <p className="text-4xl md:text-5xl font-bold">${offers[current].price}</p>
                    </div>
                    <p className="text-lg mb-2 opacity-90">{offers[current].duration}</p>
                  </div>

                  <Link href={`/paquetes/${offers[current].id}`}>
                    <Button size="lg" className="bg-gradient-toucan hover:opacity-90 text-white font-bold">
                      Ver Oferta
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg z-10"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg z-10"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => slideTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
