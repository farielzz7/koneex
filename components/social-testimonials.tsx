"use client"

import { motion } from "framer-motion"
import { socialTestimonials } from "@/lib/mock-data"
import { Facebook, Instagram, Star, ThumbsUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export function SocialTestimonials() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialTestimonials.slice(0, 6).map((testimonial, idx) => (
                <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <Card className="p-6 hover:shadow-xl transition-shadow h-full flex flex-col">
                        {/* Header con avatar y nombre */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-toucan flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {testimonial.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-text truncate">{testimonial.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    {testimonial.platform === "facebook" ? (
                                        <Facebook className="w-4 h-4 text-blue-600" />
                                    ) : (
                                        <Instagram className="w-4 h-4 text-pink-600" />
                                    )}
                                    <span>{testimonial.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1 mb-3">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        {/* Texto del testimonio */}
                        <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">{testimonial.text}</p>

                        {/* Footer con likes */}
                        <div className="flex items-center gap-2 text-sm text-text-muted pt-3 border-t border-border">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{testimonial.likes} personas reaccionaron a esto</span>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
