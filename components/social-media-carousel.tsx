"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Facebook, Instagram, Star, Heart, MessageCircle as MessageIcon, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

// Estructura combinada de posts de clientes con fotos y comentarios
interface ClientPost {
    id: string
    clientName: string
    clientAvatar?: string
    platform: "facebook" | "instagram"
    image: string
    location: string
    rating: number
    text: string
    likes: number
    comments: number
    date: string
}

const clientPosts: ClientPost[] = [
    {
        id: "post-1",
        clientName: "María González",
        clientAvatar: "/avatar-maria.jpg",
        platform: "facebook",
        image: "/client-photo-beach-happy.jpg",
        location: "Cancún, México",
        rating: 5,
        text: "¡Increíble experiencia! Koneex nos organizó el viaje perfecto a Cancún. Todo salió impecable, desde el vuelo hasta el hotel. Super recomendados 🌴✨",
        likes: 24,
        comments: 3,
        date: "Hace 2 semanas",
    },
    {
        id: "post-2",
        clientName: "Carlos Ramírez",
        clientAvatar: "/avatar-carlos.jpg",
        platform: "instagram",
        image: "/client-photo-eiffel-tower.jpg",
        location: "París, Francia",
        rating: 5,
        text: "Gracias a Koneex cumplí mi sueño de conocer París. La atención fue excepcional y los precios muy accesibles. Ya estoy planeando mi próximo viaje con ellos 🗼❤️",
        likes: 38,
        comments: 5,
        date: "Hace 1 mes",
    },
    {
        id: "post-3",
        clientName: "Ana López",
        clientAvatar: "/avatar-ana.jpg",
        platform: "facebook",
        image: "/client-photo-safari.jpg",
        location: "Tanzania, África",
        rating: 5,
        text: "El mejor servicio de agencia de viajes que he usado. Nos ayudaron con todo el trámite de visa y nos consiguieron un paquete todo incluido increíble. El safari fue una experiencia única! 🦁🐘",
        likes: 42,
        comments: 6,
        date: "Hace 3 semanas",
    },
    {
        id: "post-4",
        clientName: "Roberto Méndez",
        clientAvatar: "/avatar-roberto.jpg",
        platform: "instagram",
        image: "/client-photo-temple.jpg",
        location: "Kioto, Japón",
        rating: 5,
        text: "Contraté un tour por Asia con Koneex y fue la mejor decisión. Todo perfectamente organizado, guías excepcionales. La cultura japonesa me fascinó! Volveré a viajar con ellos sin dudarlo! 🌸⛩️",
        likes: 52,
        comments: 8,
        date: "Hace 5 días",
    },
    {
        id: "post-5",
        clientName: "Laura Sánchez",
        clientAvatar: "/avatar-laura.jpg",
        platform: "facebook",
        image: "/client-photo-group.jpg",
        location: "Barcelona, España",
        rating: 5,
        text: "Excelente atención al cliente, respondieron todas mis dudas por WhatsApp súper rápido. El viaje a Barcelona con mis amigas fue de ensueño. ¡Gracias Koneex! 🇪🇸😍",
        likes: 31,
        comments: 4,
        date: "Hace 1 semana",
    },
    {
        id: "post-6",
        clientName: "Jorge Martínez",
        clientAvatar: "/avatar-jorge.jpg",
        platform: "instagram",
        image: "/client-photo-mountains.jpg",
        location: "Machu Picchu, Perú",
        rating: 5,
        text: "Cumplí mi sueño de conocer Machu Picchu! El equipo de Koneex fue increíble, nos ayudaron con todo. La experiencia fue mucho mejor de lo que esperaba. Totalmente recomendados! 🏔️✨",
        likes: 67,
        comments: 9,
        date: "Hace 4 días",
    },
]

export function SocialMediaCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => {
            let newIndex = prevIndex + newDirection
            if (newIndex < 0) newIndex = clientPosts.length - 1
            if (newIndex >= clientPosts.length) newIndex = 0
            return newIndex
        })
    }

    const currentPost = clientPosts[currentIndex]

    return (
        <div className="relative w-full max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x)

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1)
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1)
                            }
                        }}
                        className="w-full"
                    >
                        <Card className="overflow-hidden border-2">
                            <div className="grid md:grid-cols-2">
                                {/* Imagen */}
                                <div className="relative aspect-square md:aspect-auto">
                                    <Image
                                        src={currentPost.image || "/placeholder.svg"}
                                        alt={currentPost.location}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold">{currentPost.location}</span>
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-6 md:p-8 flex flex-col">
                                    {/* Header con usuario y plataforma */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-toucan flex items-center justify-center text-white font-bold text-lg">
                                                {currentPost.clientName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{currentPost.clientName}</h3>
                                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                                    {currentPost.platform === "facebook" ? (
                                                        <Facebook className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <Instagram className="w-4 h-4 text-pink-600" />
                                                    )}
                                                    <span>{currentPost.date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-1">
                                            {Array.from({ length: currentPost.rating }).map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Texto del comentario */}
                                    <div className="flex-1">
                                        <p className="text-text-muted leading-relaxed mb-6">{currentPost.text}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <Heart className="w-5 h-5 text-red-500" />
                                            <span className="font-semibold">{currentPost.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <MessageIcon className="w-5 h-5 text-primary" />
                                            <span className="font-semibold">{currentPost.comments}</span>
                                        </div>
                                    </div>

                                    {/* Powered by */}
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <p className="text-xs text-text-muted text-center">
                                            ✨ Viaje organizado por <span className="font-bold text-primary">Koneex</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controles de navegación */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={() => paginate(-1)}
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors border-2 border-primary/20"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {clientPosts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1)
                                setCurrentIndex(idx)
                            }}
                            className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-300"
                                }`}
                            aria-label={`Ir a post ${idx + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => paginate(1)}
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors border-2 border-primary/20"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Info adicional */}
            <div className="text-center mt-6">
                <p className="text-sm text-text-muted">
                    Post {currentIndex + 1} de {clientPosts.length}
                </p>
            </div>
        </div>
    )
}
