"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import Image from "next/image"

const clientPhotos = [
    {
        id: "1",
        image: "/client-photo-beach-happy.jpg",
        location: "Cancún, México",
        clientName: "María y familia",
    },
    {
        id: "2",
        image: "/client-photo-eiffel-tower.jpg",
        location: "París, Francia",
        clientName: "Carlos R.",
    },
    {
        id: "3",
        image: "/client-photo-safari.jpg",
        location: "Tanzania, África",
        clientName: "Ana López",
    },
    {
        id: "4",
        image: "/client-photo-temple.jpg",
        location: "Kioto, Japón",
        clientName: "Roberto M.",
    },
    {
        id: "5",
        image: "/client-photo-group.jpg",
        location: "Barcelona, España",
        clientName: "Laura y amigas",
    },
    {
        id: "6",
        image: "/client-photo-mountains.jpg",
        location: "Machu Picchu, Perú",
        clientName: "Jorge Martínez",
    },
]

export function ClientPhotosCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % clientPhotos.length)
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + clientPhotos.length) % clientPhotos.length)
    }

    // Obtener 3 fotos para mostrar
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getVisiblePhotos().map((photo, idx) => (
                        <motion.div
                            key={`${photo.id}-${currentIndex}-${idx}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all"
                        >
                            <Image
                                src={photo.image || "/placeholder.svg"}
                                alt={photo.location}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* Location badge */}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-text">{photo.location}</span>
                            </div>

                            {/* Client name at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <p className="text-white font-bold text-lg drop-shadow-lg">{photo.clientName}</p>
                                <p className="text-white/90 text-sm drop-shadow-md">Cliente Koneex</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Controles de navegación */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={prev}
                    className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all border-2 border-primary/20 hover:scale-110"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {clientPhotos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2.5 rounded-full transition-all ${idx === currentIndex ? "w-10 bg-primary" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Ir a foto ${idx + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all border-2 border-primary/20 hover:scale-110"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
