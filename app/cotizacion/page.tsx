"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Plane, Sparkles, MessageCircle, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formatQuoteMessage, type QuoteFormData } from "@/lib/whatsapp-helper"
import { openWhatsApp } from "@/lib/whatsapp-helper"

export default function CotizacionPage() {
  const [formData, setFormData] = useState<QuoteFormData>({
    nombre: "",
    telefono: "",
    destino: "",
    fechaInicio: "",
    fechaFin: "",
    adultos: 2,
    menores: 0,
    edadesMenores: [],
    comentarios: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = formatQuoteMessage(formData)
    openWhatsApp(message)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-accent/5">
      <Header />

      <div className="bg-gradient-toucan py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Cotización vía WhatsApp</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">Solicita tu Cotización</h1>
            <p className="text-lg md:text-xl text-white/90 text-pretty">
              Completa el formulario y envíalo directo a nuestro WhatsApp
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 pb-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-2xl border-4 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-warning/10 to-accent/10 border-b-2">
              <CardTitle className="text-2xl md:text-3xl">Información del Viaje</CardTitle>
              <CardDescription className="text-base">Cuéntanos sobre tu próxima aventura</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre y Teléfono */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="flex items-center gap-2 text-base font-semibold">
                      <Users className="w-5 h-5 text-primary" />
                      Nombre completo *
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="border-2 focus:border-primary h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-base font-semibold">
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
                </div>

                {/* Destino */}
                <div className="space-y-2">
                  <Label htmlFor="destino" className="flex items-center gap-2 text-base font-semibold">
                    <MapPin className="w-5 h-5 text-danger" />
                    ¿A dónde quieres viajar? *
                  </Label>
                  <Input
                    id="destino"
                    name="destino"
                    type="text"
                    placeholder="Ej: Cancún, Playa del Carmen, Europa..."
                    value={formData.destino}
                    onChange={handleChange}
                    required
                    className="border-2 focus:border-primary h-12 text-base"
                  />
                </div>

                {/* Fechas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio" className="flex items-center gap-2 text-base font-semibold">
                      <Calendar className="w-5 h-5 text-accent" />
                      Fecha de inicio
                    </Label>
                    <Input
                      id="fechaInicio"
                      name="fechaInicio"
                      type="date"
                      value={formData.fechaInicio}
                      onChange={handleChange}
                      className="border-2 focus:border-primary h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaFin" className="text-base font-semibold">
                      Fecha de regreso
                    </Label>
                    <Input
                      id="fechaFin"
                      name="fechaFin"
                      type="date"
                      value={formData.fechaFin}
                      onChange={handleChange}
                      className="border-2 focus:border-primary h-12 text-base"
                    />
                  </div>
                </div>

                {/* Viajeros */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="adultos" className="text-base font-semibold">
                      Adultos
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, adultos: Math.max(1, prev.adultos - 1) }))
                        }
                        className="border-2 h-12 w-12 text-lg hover:bg-primary hover:text-white"
                      >
                        -
                      </Button>
                      <Input
                        id="adultos"
                        name="adultos"
                        type="number"
                        value={formData.adultos}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, adultos: Math.max(1, Number.parseInt(e.target.value) || 1) }))
                        }
                        className="text-center border-2 focus:border-primary h-12 text-lg font-semibold"
                        min="1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, adultos: prev.adultos + 1 }))
                        }
                        className="border-2 h-12 w-12 text-lg hover:bg-primary hover:text-white"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="menores" className="text-base font-semibold">
                      Menores (2-12 años)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newMenores = Math.max(0, (formData.menores || 0) - 1)
                          setFormData((prev) => ({
                            ...prev,
                            menores: newMenores,
                            edadesMenores: prev.edadesMenores?.slice(0, newMenores) || []
                          }))
                        }}
                        className="border-2 h-12 w-12 text-lg hover:bg-primary hover:text-white"
                      >
                        -
                      </Button>
                      <Input
                        id="menores"
                        name="menores"
                        type="number"
                        value={formData.menores || 0}
                        onChange={(e) => {
                          const newMenores = Math.max(0, Number.parseInt(e.target.value) || 0)
                          setFormData((prev) => ({
                            ...prev,
                            menores: newMenores,
                            edadesMenores: Array(newMenores).fill(undefined).map((_, i) => prev.edadesMenores?.[i])
                          }))
                        }}
                        className="text-center border-2 focus:border-primary h-12 text-lg font-semibold"
                        min="0"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newMenores = (formData.menores || 0) + 1
                          setFormData((prev) => ({
                            ...prev,
                            menores: newMenores,
                            edadesMenores: [...(prev.edadesMenores || []), undefined as any]
                          }))
                        }}
                        className="border-2 h-12 w-12 text-lg hover:bg-primary hover:text-white"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Edades de Menores */}
                {formData.menores && formData.menores > 0 && (
                  <div className="space-y-4 bg-accent/10 rounded-lg p-4 border-2 border-accent/20">
                    <Label className="text-base font-semibold text-accent">
                      Edad de cada menor (2-12 años) *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Array.from({ length: formData.menores }, (_, index) => (
                        <div key={index} className="space-y-1">
                          <Label htmlFor={`edad-${index}`} className="text-sm">
                            Menor {index + 1}
                          </Label>
                          <Input
                            id={`edad-${index}`}
                            type="number"
                            min="2"
                            max="12"
                            value={formData.edadesMenores?.[index] || ""}
                            placeholder="Edad"
                            onChange={(e) => {
                              const newEdades = [...(formData.edadesMenores || [])]
                              const value = Number.parseInt(e.target.value)

                              if (e.target.value === "") {
                                newEdades[index] = undefined as any
                                setFormData((prev) => ({ ...prev, edadesMenores: newEdades }))
                                return
                              }

                              // Validar rango 2-12
                              if (value < 2) {
                                alert("La edad mínima es 2 años")
                                newEdades[index] = undefined as any
                              } else if (value > 12) {
                                alert("La edad máxima es 12 años. Para mayores de 12, agrégalos como adultos.")
                                newEdades[index] = undefined as any
                              } else {
                                newEdades[index] = value
                              }

                              setFormData((prev) => ({ ...prev, edadesMenores: newEdades }))
                            }}
                            onBlur={(e) => {
                              // Validar al salir del campo que no esté vacío
                              if (e.target.value === "") {
                                alert("Por favor ingresa la edad del menor")
                              }
                            }}
                            className="text-center border-2 focus:border-accent h-10 font-semibold"
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-text-muted">
                      💡 Si algún menor tiene más de 12 años, agrégalo como adulto
                    </p>
                  </div>
                )}

                {/* Comentarios adicionales */}
                <div className="space-y-2">
                  <Label htmlFor="comentarios" className="text-base font-semibold">
                    Comentarios o preferencias (opcional)
                  </Label>
                  <Textarea
                    id="comentarios"
                    name="comentarios"
                    placeholder="Ej: Prefiero hotel todo incluido, necesito tours adicionales, etc."
                    value={formData.comentarios}
                    onChange={handleChange}
                    className="border-2 focus:border-primary min-h-24 text-base"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-lg h-16 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Enviar por WhatsApp
                </Button>

                <p className="text-sm text-center text-text-muted">
                  Al enviar, se abrirá WhatsApp con tu información lista para enviarnos
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="text-center p-6 border-2 hover:border-primary transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Respuesta Inmediata</h3>
              <p className="text-sm text-text-muted">Te atendemos por WhatsApp al instante</p>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-warning transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-warning to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Mejor Precio</h3>
              <p className="text-sm text-text-muted">Garantía de mejor tarifa</p>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-accent transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-danger rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Asesoría Experta</h3>
              <p className="text-sm text-text-muted">Atención personalizada 24/7</p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
