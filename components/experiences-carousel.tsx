"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, Star, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface Experience {
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

interface ExperiencesCarouselProps {
  experiences: Experience[]
}

export function ExperiencesCarousel({ experiences }: ExperiencesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-[300px]"
          >
            <Link href={`/experiencias/${exp.id}`}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-border"
              >
                <div className="relative h-48">
                  <Image src={exp.image || "/placeholder.svg"} alt={exp.title} fill className="object-cover" />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold">
                    ${exp.price}
                  </div>
                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                    {exp.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{exp.title}</h3>
                  <p className="text-sm text-text-muted mb-3">{exp.location}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-semibold">{exp.rating}</span>
                      <span className="text-text-muted">({exp.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-text-muted">
                      <Clock className="w-4 h-4" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-surface transition-all z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-surface transition-all z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
