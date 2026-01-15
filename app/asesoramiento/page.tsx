"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, User, Mail, Phone, Sparkles } from "lucide-react"
import { useState } from "react"
import { formatAdviceMessage, type AdviceFormData, openWhatsApp } from "@/lib/whatsapp-helper"

export default function AsesoramientoPage() {
  const [formData, setFormData] = useState<AdviceFormData>({
    nombre: "",
    telefono: "",
    email: "",
    consulta: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = formatAdviceMessage(formData)
    openWhatsApp(message)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-accent/5">
      <Header />

      <div className="bg-gradient-to-r from-primary to-secondary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Asesoramiento gratuito</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">
              Asesoramiento Personalizado
            </h1>
            <p className="text-lg md:text-xl text-white/90 text-pretty">
              Nuestros expertos están listos para ayudarte a planear el viaje perfecto
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 pb-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-2xl border-4 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b-2">
              <CardTitle className="text-2xl md:text-3xl">Solicita Asesoramiento</CardTitle>
              <CardDescription className="text-base">
                Cuéntanos tus dudas y te ayudaremos de inmediato por WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="flex items-center gap-2 text-base font-semibold">
                    <User className="w-5 h-5 text-primary" />
                    Nombre completo *
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="border-2 focus:border-primary h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="flex items-center gap-2 text-base font-semibold">
                    <Phone className="w-5 h-5 text-accent" />
                    Teléfono / WhatsApp *
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="Ej: 999 123 4567"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="border-2 focus:border-primary h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base font-semibold">
                    <Mail className="w-5 h-5 text-secondary" />
                    Email (opcional)
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-2 focus:border-primary h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consulta" className="text-base font-semibold">
                    ¿En qué podemos ayudarte? *
                  </Label>
                  <Textarea
                    id="consulta"
                    name="consulta"
                    placeholder="Cuéntanos tu consulta o el tipo de viaje que buscas..."
                    value={formData.consulta}
                    onChange={handleChange}
                    required
                    className="border-2 focus:border-primary min-h-32 text-base"
                  />
                </div>

                <div className="bg-accent/10 border-2 border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-center">
                    <strong>💡 Sugerencias de consulta:</strong> Destinos recomendados, mejor temporada para viajar,
                    presupuestos, requisitos de visa, paquetes todo incluido, viajes en grupo, etc.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-lg h-16 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Consultar por WhatsApp
                </Button>

                <p className="text-sm text-center text-text-muted">
                  Al enviar, se abrirá WhatsApp con tu consulta lista para enviarnos
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="text-center p-6 border-2 hover:border-accent transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Atención</h3>
              <p className="text-sm text-text-muted">Disponibles por WhatsApp en todo momento</p>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-primary transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Expertos en Viajes</h3>
              <p className="text-sm text-text-muted">15+ años de experiencia</p>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-secondary transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-warning rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Sin Costo</h3>
              <p className="text-sm text-text-muted">Asesoramiento 100% gratuito</p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
