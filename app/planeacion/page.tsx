"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, Plane, Hotel, MapPin, DollarSign, Plus, Trash2, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function PlaneacionPage() {
  const [activities, setActivities] = useState<string[]>([""])

  const addActivity = () => {
    setActivities([...activities, ""])
  }

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Planea tu <span className="text-gradient">Viaje Perfecto</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Cuéntanos tus ideas y nuestros expertos crearán un itinerario personalizado para ti
            </p>
          </div>

          {/* Formulario de planeación */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm mb-8">
            <h2 className="text-2xl font-display font-bold mb-6">Detalles de tu Viaje</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="destino" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Destino deseado
                </Label>
                <Input id="destino" placeholder="ej. París, Tokio, Cancún..." />
              </div>

              <div>
                <Label htmlFor="presupuesto" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Presupuesto (USD)
                </Label>
                <Input id="presupuesto" type="number" placeholder="ej. 3000" />
              </div>

              <div>
                <Label htmlFor="fechaInicio" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de inicio
                </Label>
                <Input id="fechaInicio" type="date" />
              </div>

              <div>
                <Label htmlFor="fechaFin" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de regreso
                </Label>
                <Input id="fechaFin" type="date" />
              </div>

              <div>
                <Label htmlFor="viajeros" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Número de viajeros
                </Label>
                <Input id="viajeros" type="number" placeholder="2" defaultValue="2" min="1" />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Tipo de alojamiento</Label>
                <select className="w-full px-4 py-2 rounded-lg border border-border">
                  <option>Hotel 3 estrellas</option>
                  <option>Hotel 4 estrellas</option>
                  <option selected>Hotel 5 estrellas</option>
                  <option>Resort todo incluido</option>
                  <option>Airbnb / Apartamento</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Intereses y preferencias</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Playa",
                  "Aventura",
                  "Cultural",
                  "Gastronómico",
                  "Naturaleza",
                  "Deportes",
                  "Compras",
                  "Vida nocturna",
                  "Relajación",
                ].map((interes) => (
                  <Badge
                    key={interes}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors px-4 py-2"
                  >
                    {interes}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Actividades que deseas incluir</Label>
              <div className="space-y-3">
                {activities.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Input placeholder="ej. Visita al museo, Tour en bicicleta..." className="flex-1" />
                    {activities.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeActivity(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={addActivity} className="mt-3 bg-transparent" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agregar actividad
              </Button>
            </div>

            <div className="mb-6">
              <Label htmlFor="comentarios" className="text-sm font-medium mb-2 block">
                Comentarios adicionales
              </Label>
              <Textarea
                id="comentarios"
                placeholder="Cuéntanos más sobre tu viaje ideal, necesidades especiales, restricciones..."
                rows={4}
              />
            </div>

            <Button className="w-full h-12 bg-primary hover:bg-primary-hover text-lg">
              <Check className="w-5 h-5 mr-2" />
              Solicitar Itinerario Personalizado
            </Button>
          </div>

          {/* Características del servicio */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Plane,
                title: "Itinerario completo",
                desc: "Recibe un plan día a día con todas las actividades",
              },
              {
                icon: Hotel,
                title: "Mejores opciones",
                desc: "Selección de hoteles y servicios de calidad",
              },
              {
                icon: Users,
                title: "Asesoría experta",
                desc: "Consulta con nuestros especialistas en viajes",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center border border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
