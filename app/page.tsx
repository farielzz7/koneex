"use client"

import { Header } from "@/components/header"
import { SearchHero } from "@/components/search-hero"
import { PackageCard } from "@/components/package-card"
import { OffersCarousel } from "@/components/offers-carousel"
import { ExperiencesCarousel } from "@/components/experiences-carousel"

import { Footer } from "@/components/footer"
import { AboutSection } from "@/components/about-section"
import {
  megaTravelOffers,
  mockPackages,
  mockExperiences,
  popularDestinations,
  internationalPackages,
} from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Sparkles, Compass, MessageCircle, FileText, MapPin, TrendingUp, Shield, CreditCard, Phone, Camera, Globe } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { BUSINESS_PHONE_FORMATTED, initiatePhoneCall } from "@/lib/whatsapp-helper"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <SearchHero />
      <AboutSection />

      <section className="bg-gradient-to-br from-primary/10 via-accent/10 to-warning/10 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Bienvenido a <span className="text-gradient">koneex</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted mb-6 leading-relaxed">
              Tu agencia de viajes de confianza. Hacemos realidad tus sueños de viajar con paquetes personalizados, atención excepcional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-lg px-8 py-6 h-auto"
                  onClick={() =>
                    window.open(
                      "https://wa.me/5219993387710?text=Hola koneex, quiero información sobre paquetes de viaje",
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  WhatsApp
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-600 font-semibold text-lg px-8 py-6 h-auto"
                  onClick={initiatePhoneCall}
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Llamar: {BUSINESS_PHONE_FORMATTED}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-toucan rounded-full" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient">Mega Travel Ofertas</h2>
          </div>
          <p className="text-text-muted text-lg">Las mejores ofertas del mes con descuentos increíbles</p>
        </motion.div>

        <OffersCarousel offers={megaTravelOffers} />
      </section>

      <section className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item}>
            <Link href="/experiencias">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-border"
              >
                <motion.div
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="font-semibold text-sm">Experiencias</h3>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/planeacion">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-border"
              >
                <motion.div
                  className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Compass className="w-6 h-6 text-accent" />
                </motion.div>
                <h3 className="font-semibold text-sm">Planeación</h3>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/asesoramiento">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-border"
              >
                <motion.div
                  className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <MessageCircle className="w-6 h-6 text-secondary" />
                </motion.div>
                <h3 className="font-semibold text-sm">Asesoramiento</h3>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/clientes">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-border"
              >
                <motion.div
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Camera className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="font-semibold text-sm">Clientes</h3>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-display font-bold">Destinos Más Visitados</h2>
          </div>
          <p className="text-text-muted text-lg">Los favoritos de nuestros viajeros</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/paquetes?destino=${dest.name}`}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="relative h-40 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all"
                >
                  <Image
                    src={dest.image || "/placeholder.svg"}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="font-bold text-sm">{dest.name}</p>
                    <p className="text-xs opacity-90">{dest.country}</p>
                    <p className="text-xs mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {dest.trips} viajes
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-toucan rounded-full" />
                <h2 className="text-3xl md:text-4xl font-display font-bold">Experiencias Únicas</h2>
              </div>
              <p className="text-text-muted text-lg">Vive momentos inolvidables</p>
            </div>
            <Link href="/experiencias">
              <Button variant="outline">Ver todas</Button>
            </Link>
          </div>
        </motion.div>

        <ExperiencesCarousel experiences={mockExperiences} />
      </section>

      {/* Paquetes Destacados */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-display font-bold mb-2 text-gradient">Paquetes Destacados</h2>
            <p className="text-text-muted">Los destinos más populares elegidos por viajeros como tú</p>
          </div>
          <Link href="/paquetes">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">Ver todos</Button>
            </motion.div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPackages
            .filter((p) => p.featured)
            .map((pkg) => (
              <PackageCard key={pkg.id} {...pkg} />
            ))}
        </div>
      </section>

      <section className="bg-white py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">¿Por qué elegir koneex?</h2>
              <p className="text-lg text-text-muted">Somos tu mejor opción para vivir experiencias inolvidables</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">15+ Años de Experiencia</h3>
                <p className="text-text-muted text-sm">
                  Confianza y profesionalismo respaldado por miles de viajeros satisfechos
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Atención</h3>
                <p className="text-text-muted text-sm">Estamos contigo en cada momento de tu viaje vía WhatsApp</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-10 h-10 text-warning" />
                </div>
                <h3 className="font-bold text-lg mb-2">Facilidades de Pago</h3>
                <p className="text-text-muted text-sm">Múltiples opciones: tarjeta, transferencia, efectivo y más</p>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Paquetes Internacionales */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Globe className="w-10 h-10 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold">Destinos Internacionales</h2>
            </div>
            <p className="text-lg text-text-muted mb-6">Explora el mundo con nuestros paquetes premium</p>
            <Link href="/internacionales">
              <Button size="lg" variant="outline" className="bg-white">
                Ver Todos los Destinos
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalPackages
              .filter((pkg) => pkg.featured)
              .map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <PackageCard {...pkg} />
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#25D366] to-[#128C7E]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto">
              <MessageCircle className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para tu próxima aventura?</h2>
              <p className="text-xl text-white/90 mb-8">
                Contáctanos ahora por WhatsApp y recibe atención personalizada inmediata. Nuestros expertos están listos
                para ayudarte a planear el viaje perfecto.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-white text-[#25D366] hover:bg-gray-100 font-bold text-lg px-8 py-6 h-auto"
                    onClick={() =>
                      window.open("https://wa.me/5219993387710?text=Hola koneex, quiero cotizar un viaje", "_blank")
                    }
                  >
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Cotizar por WhatsApp
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg px-8 py-6 h-auto"
                    onClick={initiatePhoneCall}
                  >
                    <Phone className="w-6 h-6 mr-2" />
                    Llamar: {BUSINESS_PHONE_FORMATTED}
                  </Button>
                </motion.div>
                <Link href="/cotizacion">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white/10 bg-transparent font-semibold text-lg px-8 py-6 h-auto"
                    >
                      Cotizar en Línea
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      <Footer />
    </div>
  )
}
