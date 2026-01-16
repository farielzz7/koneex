"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClientPhotosCarousel } from "@/components/client-photos-carousel"
import { SocialPostsGrid } from "@/components/social-posts-grid"
import { Camera, Star, Heart, Users, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ClientesPage() {
    return (
        <div className="min-h-screen bg-surface">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Camera className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-white">Historias reales</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">
                            Nuestros Clientes Felices
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 text-pretty">
                            Descubre las experiencias de viajeros que han confiado en nosotros. Fotos auténticas y comentarios
                            reales de sus redes sociales.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <section className="bg-white border-b border-border py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-3xl font-bold text-primary mb-1">450+</p>
                            <p className="text-sm text-text-muted">Clientes Satisfechos</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Star className="w-8 h-8 text-warning" />
                            </div>
                            <p className="text-3xl font-bold text-warning mb-1">4.9/5</p>
                            <p className="text-sm text-text-muted">Calificación Promedio</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Heart className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-3xl font-bold text-red-500 mb-1">1,200+</p>
                            <p className="text-sm text-text-muted">Likes en Redes</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Camera className="w-8 h-8 text-accent" />
                            </div>
                            <p className="text-3xl font-bold text-accent mb-1">180+</p>
                            <p className="text-sm text-text-muted">Fotos Compartidas</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Carrusel de Fotos */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Camera className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl md:text-4xl font-display font-bold">Momentos Inolvidables</h2>
                        </div>
                        <p className="text-lg text-text-muted max-w-2xl mx-auto">
                            Fotos auténticas de nuestros clientes disfrutando sus viajes alrededor del mundo
                        </p>
                    </motion.div>

                    <ClientPhotosCarousel />
                </div>
            </section>

            {/* Posts de Redes Sociales */}
            <section className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <MessageCircle className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-display font-bold">
                            Lo Que Dicen en Redes Sociales
                        </h2>
                    </div>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Comentarios y opiniones reales compartidas en Facebook e Instagram
                    </p>
                </motion.div>

                <SocialPostsGrid />
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary to-secondary py-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para tu Próxima Aventura?</h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Únete a miles de viajeros satisfechos y crea tus propias historias increíbles
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/cotizacion"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Solicita tu Cotización
                            </a>
                            <a
                                href="/paquetes"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Ver Paquetes
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
