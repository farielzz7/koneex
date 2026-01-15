"use client"

import { motion } from "framer-motion"
import { Facebook, Instagram, Star, ThumbsUp, MessageCircle as CommentIcon, Share2 } from "lucide-react"
import { Card } from "@/components/ui/card"

const socialPosts = [
    {
        id: "1",
        platform: "facebook",
        clientName: "María González",
        clientAvatar: "/avatar-maria.jpg",
        date: "Hace 2 semanas",
        rating: 5,
        text: "¡Increíble experiencia! Koneex nos organizó el viaje perfecto a Cancún. Todo salió impecable, desde el vuelo hasta el hotel. El servicio al cliente fue excepcional, siempre atentos a cualquier necesidad. Super recomendados 🌴✨",
        likes: 245,
        comments: 34,
        shares: 12,
    },
    {
        id: "2",
        platform: "instagram",
        clientName: "Carlos Ramírez",
        clientAvatar: "/avatar-carlos.jpg",
        date: "Hace 1 mes",
        rating: 5,
        text: "Gracias a Koneex cumplí mi sueño de conocer París. La atención fue excepcional y los precios muy accesibles. Ya estoy planeando mi próximo viaje con ellos 🗼❤️ #ViajesKoneex #Paris",
        likes: 389,
        comments: 52,
        shares: 18,
    },
    {
        id: "3",
        platform: "facebook",
        clientName: "Ana López",
        clientAvatar: "/avatar-ana.jpg",
        date: "Hace 3 semanas",
        rating: 5,
        text: "El mejor servicio de agencia de viajes que he usado. Nos ayudaron con todo el trámite de visa y nos consiguieron un paquete todo incluido increíble. El safari en Tanzania fue una experiencia única! 100% recomendados! 🦁🐘",
        likes: 427,
        comments: 68,
        shares: 25,
    },
    {
        id: "4",
        platform: "instagram",
        clientName: "Roberto Méndez",
        clientAvatar: "/avatar-roberto.jpg",
        date: "Hace 5 días",
        rating: 5,
        text: "Contraté un tour por Asia con Koneex y fue la mejor decisión. Todo perfectamente organizado, guías excepcionales. La cultura japonesa me fascinó! Volveré a viajar con ellos sin dudarlo! 🌸⛩️ #JaponViaje #Koneex",
        likes: 523,
        comments: 89,
        shares: 31,
    },
    {
        id: "5",
        platform: "facebook",
        clientName: "Laura Sánchez",
        clientAvatar: "/avatar-laura.jpg",
        date: "Hace 1 semana",
        rating: 5,
        text: "Excelente atención al cliente, respondieron todas mis dudas por WhatsApp súper rápido. El viaje a Barcelona con mis amigas fue de ensueño. La organización fue perfecta. ¡Gracias Koneex! 🇪🇸😍",
        likes: 314,
        comments: 41,
        shares: 15,
    },
    {
        id: "6",
        platform: "instagram",
        clientName: "Jorge Martínez",
        clientAvatar: "/avatar-jorge.jpg",
        date: "Hace 4 días",
        rating: 5,
        text: "Cumplí mi sueño de conocer Machu Picchu! El equipo de Koneex fue increíble, nos ayudaron con todo. La experiencia fue mucho mejor de lo que esperaba. Totalmente recomendados! 🏔️✨ #MachuPicchu #Peru",
        likes: 678,
        comments: 97,
        shares: 42,
    },
]

export function SocialPostsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialPosts.map((post, idx) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <Card className="p-6 hover:shadow-2xl transition-all h-full flex flex-col bg-white border-2">
                        {/* Header con info del usuario */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-toucan flex items-center justify-center text-white font-bold text-lg">
                                    {post.clientName.charAt(0)}
                                </div>

                                <div>
                                    <h4 className="font-bold text-text">{post.clientName}</h4>
                                    <div className="flex items-center gap-2 text-sm text-text-muted">
                                        {post.platform === "facebook" ? (
                                            <Facebook className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Instagram className="w-4 h-4 text-pink-600" />
                                        )}
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-0.5">
                                {Array.from({ length: post.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                        </div>

                        {/* Contenido del post */}
                        <div className="flex-1 mb-4">
                            <p className="text-text-muted leading-relaxed text-sm">{post.text}</p>
                        </div>

                        {/* Stats de engagement */}
                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between text-sm text-text-muted">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span className="font-semibold">{post.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                                        <CommentIcon className="w-4 h-4" />
                                        <span className="font-semibold">{post.comments}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 hover:text-accent transition-colors cursor-pointer">
                                        <Share2 className="w-4 h-4" />
                                        <span className="font-semibold">{post.shares}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Badge de Koneex */}
                        <div className="mt-4 pt-3 border-t border-border">
                            <p className="text-xs text-center text-text-muted">
                                ✨ Viaje organizado por <span className="font-bold text-primary">Koneex</span>
                            </p>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
