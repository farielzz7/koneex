"use client"

import { motion } from "framer-motion"
import { Heart, Users, Award, TrendingUp } from "lucide-react"

export function AboutSection() {
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-surface">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-4xl mx-auto mb-8 md:mb-12 lg:mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 md:mb-4 px-2">
                        Conoce <span className="text-gradient">Ko'neex</span>
                    </h2>
                    <p className="text-base md:text-lg text-text-muted leading-relaxed px-2">
                        Desde 2004, haciendo realidad los sueños de viaje de miles de personas
                    </p>
                </motion.div>

                {/* Historia Breve */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto mb-8 md:mb-12 lg:mb-16 bg-white rounded-xl md:rounded-2xl p-6 md:p-10 lg:p-12 shadow-lg"
                >
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <div className="w-1 h-8 md:h-10 lg:h-12 bg-gradient-toucan rounded-full flex-shrink-0" />
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">Nuestra Historia</h3>
                    </div>
                    <div className="space-y-3 md:space-y-4 text-text-muted leading-relaxed text-sm md:text-base">
                        <p>
                            <strong className="text-primary">Ko'neex</strong> (que significa <em>"vámonos"</em> en maya) fue fundada el <strong>10 de agosto de 2004</strong> en el corazón de Mérida, Yucatán, con la visión de ofrecer servicios turísticos de calidad, transparentes y responsables.
                        </p>
                        <p>
                            Lo que comenzó como un pequeño proyecto familiar ha evolucionado en más de <strong>20 años de experiencia</strong>, implementando tecnología moderna y diversificando nuestro catálogo de destinos nacionales e internacionales.
                        </p>
                        <p>
                            Hoy, Ko'neex es reconocida por su <strong>excelencia en servicio</strong>, atendiendo tanto a clientes locales como nacionales, consolidándose como una agencia de confianza en un mercado altamente competitivo.
                        </p>
                    </div>
                </motion.div>

                {/* Misión y Visión */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-8 md:mb-12 lg:mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl md:rounded-2xl p-6 md:p-8 border border-primary/20"
                    >
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold">Misión</h3>
                        </div>
                        <p className="text-sm md:text-base text-text-muted leading-relaxed">
                            Brindar servicios turísticos de alta calidad, ofreciendo experiencias de viaje <strong>seguras, confiables y personalizadas</strong>, basadas en la transparencia, responsabilidad y atención cercana, con un equipo comprometido con la satisfacción total del cliente.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-accent/10 to-warning/10 rounded-xl md:rounded-2xl p-6 md:p-8 border border-accent/20"
                    >
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold">Visión</h3>
                        </div>
                        <p className="text-sm md:text-base text-text-muted leading-relaxed">
                            Ser una de las agencias de viajes <strong>líder a nivel regional y nacional</strong>, destacada por su excelencia en servicio, innovación tecnológica y desarrollo de circuitos turísticos propios, contribuyendo al turismo en el sureste mexicano.
                        </p>
                    </motion.div>
                </div>

                {/* Valores */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="text-center mb-6 md:mb-8 lg:mb-10">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Nuestros Valores</h3>
                        <p className="text-sm md:text-base text-text-muted px-4">Los principios que guían nuestro servicio</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 }}
                            className="bg-white rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                                <Award className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                            </div>
                            <h4 className="font-bold text-base md:text-lg mb-2">Responsabilidad</h4>
                            <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                                Actuamos con responsabilidad en cada asesoría, asegurando información clara y cumplimiento de acuerdos.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3 md:mb-4">
                                <Heart className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                            </div>
                            <h4 className="font-bold text-base md:text-lg mb-2">Compromiso</h4>
                            <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                                Atención personalizada y constante, escuchando necesidades y trabajando con dedicación.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-warning/10 flex items-center justify-center mb-3 md:mb-4">
                                <Users className="w-6 h-6 md:w-7 md:h-7 text-warning" />
                            </div>
                            <h4 className="font-bold text-base md:text-lg mb-2">Honestidad</h4>
                            <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                                Transparencia, comunicación clara e integridad que genera confianza y relaciones duraderas.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-3 md:mb-4">
                                <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-secondary" />
                            </div>
                            <h4 className="font-bold text-base md:text-lg mb-2">Calidad</h4>
                            <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                                Selección constante de proveedores confiables con altos estándares de servicio y seguridad.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stats Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 md:mt-12 lg:mt-16 bg-gradient-toucan rounded-xl md:rounded-2xl p-6 md:p-10 lg:p-12 text-white"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">20+</div>
                            <div className="text-xs md:text-sm lg:text-base opacity-90">Años de Experiencia</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">5000+</div>
                            <div className="text-xs md:text-sm lg:text-base opacity-90">Clientes Satisfechos</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">100%</div>
                            <div className="text-xs md:text-sm lg:text-base opacity-90">Servicio Personalizado</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">24/7</div>
                            <div className="text-xs md:text-sm lg:text-base opacity-90">Atención al Cliente</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
