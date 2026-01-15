"use client"

import { motion } from "framer-motion"
import { clientPhotos } from "@/lib/mock-data"
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function ClientsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % clientPhotos.length)
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + clientPhotos.length) % clientPhotos.length)
    }

    // Obtener 3 fotos para mostrar (la actual y 2 siguientes)
    const getVisiblePhotos = () => {
        const photos = []
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % clientPhotos.length
            photos.push(clientPhotos[index])
        }
        return photos
    }

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getVisiblePhotos().map((photo, idx) => (
                        <motion.div
                            key={`${photo.id}-${currentIndex}-${idx}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                        >
                            <Image
                                src={photo.image || "/placeholder.svg"}
                                alt={photo.alt}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <p className="font-semibold">{photo.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Controles de navegación */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={prev}
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {clientPhotos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-300"
                                }`}
                            aria-label={`Ir a foto ${idx + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
