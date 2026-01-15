"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, Sparkles, Calendar, MapPin, Clock, DollarSign, Check, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const gruposTypes = [
  {
    title: "Grupos Sociales",
    description: "Viajes para amigos, clubes y organizaciones",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
    benefits: ["Descuentos grupales", "Coordinador dedicado", "Actividades grupales", "Transporte privado"],
    image: "/grupo-de-amigos-viajando-juntos-felices.jpg",
  },
  {
    title: "Viajes Familiares",
    description: "Experiencias perfectas para toda la familia",
    icon: Heart,
    color: "text-accent",
    bgColor: "bg-accent/10",
    benefits: [
      "Actividades para todas las edades",
      "Habitaciones familiares",
      "Menús infantiles",
      "Seguridad garantizada",
    ],
    image: "/familia-feliz-de-vacaciones-en-la-playa.jpg",
  },
]

const paquetesGrupo = [
  {
    id: 1,
    title: "Cancún - Grupo Social",
    destination: "Cancún, México",
    duration: "5 días / 4 noches",
    minPeople: 10,
    pricePerPerson: 599,
    includes: ["Hotel 4 estrellas", "Desayunos", "Tour en catamarán", "Traslados aeropuerto"],
    image: "/grupo-de-amigos-en-catamaran-en-cancun.jpg",
  },
  {
    id: 2,
    title: "Orlando - Viaje Familiar",
    destination: "Orlando, FL",
    duration: "7 días / 6 noches",
    minPeople: 6,
    pricePerPerson: 1299,
    includes: ["Hotel cerca de parques", "Tickets Disney", "Desayuno buffet", "Transporte Disney"],
    image: "/familia-en-disney-world-orlando.jpg",
  },
]

export default function GruposPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary text-white" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              Viajes Grupales
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Viaja en <span className="text-primary">Grupo</span> y Ahorra
            </h1>
            <p className="text-xl text-text-muted mb-8 leading-relaxed">
              Descuentos especiales, coordinación profesional y experiencias diseñadas para grupos sociales y familias
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cotizacion">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-semibold">
                  <Users className="w-5 h-5 mr-2" />
                  Solicitar Cotización Grupal
                </Button>
              </Link>
              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold"
                onClick={() =>
                  window.open(
                    "https://wa.me/1234567890?text=Hola koneex, quiero información sobre viajes en grupo",
                    "_blank",
                  )
                }
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Directo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Grupos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tipos de Viajes Grupales</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Experiencias personalizadas para cada tipo de grupo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {gruposTypes.map((tipo) => (
              <Card key={tipo.title} className="border-2 hover:border-primary transition-all group">
                <CardHeader className={`${tipo.bgColor} border-b`}>
                  <div
                    className={`w-16 h-16 ${tipo.bgColor} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <tipo.icon className={`w-8 h-8 ${tipo.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{tipo.title}</CardTitle>
                  <CardDescription className="text-base">{tipo.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                    <Image src={tipo.image || "/placeholder.svg"} alt={tipo.title} fill className="object-cover" />
                  </div>
                  <ul className="space-y-3">
                    {tipo.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <Check className={`w-5 h-5 ${tipo.color} flex-shrink-0 mt-0.5`} />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Paquetes Destacados */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Paquetes Grupales Destacados</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Ofertas especiales con descuentos por cantidad de personas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {paquetesGrupo.map((paquete) => (
              <Card key={paquete.id} className="border-2 overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={paquete.image || "/placeholder.svg"}
                    alt={paquete.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-white">
                    Mínimo {paquete.minPeople} personas
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{paquete.title}</CardTitle>
                  <div className="space-y-2 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {paquete.destination}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {paquete.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {paquete.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-primary">${paquete.pricePerPerson}</span>
                      <span className="text-sm text-text-muted ml-1">/ persona</span>
                    </div>
                  </div>
                  <Link href="/cotizacion">
                    <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                      Cotizar para mi Grupo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Beneficios de Viajar en Grupo con koneex
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: DollarSign,
                  title: "Descuentos Progresivos",
                  description: "Entre más personas, mayor descuento. Hasta 25% off en grupos grandes",
                },
                {
                  icon: Users,
                  title: "Coordinador Dedicado",
                  description: "Un experto viajero gestiona todos los detalles de tu grupo",
                },
                {
                  icon: Calendar,
                  title: "Flexibilidad de Pago",
                  description: "Planes de pago adaptados a las necesidades del grupo",
                },
                {
                  icon: Sparkles,
                  title: "Experiencias Exclusivas",
                  description: "Tours y actividades privadas diseñadas para tu grupo",
                },
              ].map((benefit) => (
                <Card key={benefit.title} className="border-2 hover:border-primary transition-all p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-sm text-text-muted">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-[#25D366] to-[#128C7E]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para Organizar tu Viaje Grupal?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Habla directamente con un asesor por WhatsApp y obtén respuesta inmediata
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#25D366] hover:bg-gray-100 font-bold"
              onClick={() =>
                window.open("https://wa.me/1234567890?text=Hola koneex, quiero cotizar un viaje grupal", "_blank")
              }
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Cotizar por WhatsApp
            </Button>
            <Link href="/cotizacion">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 bg-transparent font-semibold"
              >
                Formulario en Línea
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
