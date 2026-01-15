"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Calendar, Heart, ShoppingBag, FileText, Settings, Camera, Star, Clock } from "lucide-react"
import Image from "next/image"
import { mockPackages } from "@/lib/mock-data"

export default function PerfilPage() {
  const { user } = useAuth()

  const favoritos = mockPackages.slice(0, 3)
  const reservas = [
    {
      id: "1",
      package: mockPackages[0],
      fecha: "15 de Junio, 2024",
      estado: "Confirmado",
      personas: 2,
    },
    {
      id: "2",
      package: mockPackages[1],
      fecha: "22 de Agosto, 2024",
      estado: "Pendiente",
      personas: 2,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-white text-primary text-3xl font-bold">
                    {user?.name?.substring(0, 2).toUpperCase() || "MG"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 text-primary" />
                </button>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-display font-bold mb-2">{user?.name || "Usuario"}</h1>
                <p className="text-white/90 mb-4">Viajera apasionada desde 2020</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Ciudad de México</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>12 viajes realizados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>Viajero Premium</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="bg-white text-primary hover:bg-white/90 border-0">
                <Settings className="w-4 h-4 mr-2" />
                Editar perfil
              </Button>
            </div>
          </div>

          <Tabs defaultValue="informacion" className="mb-8">
            <TabsList className="w-full justify-start mb-8 bg-white border border-border flex-wrap h-auto p-2">
              <TabsTrigger value="informacion" className="text-base">
                <User className="w-4 h-4 mr-2" />
                Información
              </TabsTrigger>
              <TabsTrigger value="reservas" className="text-base">
                <Calendar className="w-4 h-4 mr-2" />
                Mis Reservas
              </TabsTrigger>
              <TabsTrigger value="favoritos" className="text-base">
                <Heart className="w-4 h-4 mr-2" />
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="destacados" className="text-base">
                <Star className="w-4 h-4 mr-2" />
                Destacados
              </TabsTrigger>
              <TabsTrigger value="documentos" className="text-base">
                <FileText className="w-4 h-4 mr-2" />
                Documentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="informacion">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-border">
                  <h2 className="text-xl font-display font-bold mb-6">Información Personal</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nombre" className="text-sm font-medium mb-2 block">
                        Nombre completo
                      </Label>
                      <Input id="nombre" defaultValue={user?.name || ""} />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                        Correo electrónico
                      </Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} />
                    </div>
                    <div>
                      <Label htmlFor="telefono" className="text-sm font-medium mb-2 block">
                        Teléfono
                      </Label>
                      <Input id="telefono" type="tel" defaultValue="+52 55 1234 5678" />
                    </div>
                    <div>
                      <Label htmlFor="fecha" className="text-sm font-medium mb-2 block">
                        Fecha de nacimiento
                      </Label>
                      <Input id="fecha" type="date" defaultValue="1990-05-15" />
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-toucan hover:opacity-90">Guardar cambios</Button>
                </div>

                <div className="bg-white rounded-xl p-6 border border-border">
                  <h2 className="text-xl font-display font-bold mb-6">Preferencias de Viaje</h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Tipos de viaje favoritos</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Playa", "Montaña", "Aventura", "Cultural", "Gastronómico", "Relajación"].map((tipo) => (
                          <Badge
                            key={tipo}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                          >
                            {tipo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="presupuesto" className="text-sm font-medium mb-2 block">
                        Presupuesto promedio (USD)
                      </Label>
                      <select id="presupuesto" className="w-full px-4 py-2 rounded-lg border border-border">
                        <option>$500 - $1000</option>
                        <option>$1000 - $2000</option>
                        <option>$2000 - $5000</option>
                        <option>$5000+</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="duracion" className="text-sm font-medium mb-2 block">
                        Duración preferida
                      </Label>
                      <select id="duracion" className="w-full px-4 py-2 rounded-lg border border-border">
                        <option>1-3 días</option>
                        <option>4-7 días</option>
                        <option>8-14 días</option>
                        <option>15+ días</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-border md:col-span-2">
                  <h2 className="text-xl font-display font-bold mb-6">Estadísticas de Viajes</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-1">12</div>
                      <div className="text-sm text-text-muted">Viajes realizados</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                        <MapPin className="w-8 h-8 text-secondary" />
                      </div>
                      <div className="text-3xl font-bold text-secondary mb-1">18</div>
                      <div className="text-sm text-text-muted">Países visitados</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-8 h-8 text-accent" />
                      </div>
                      <div className="text-3xl font-bold text-accent mb-1">24</div>
                      <div className="text-sm text-text-muted">Favoritos</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Star className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-1">4.9</div>
                      <div className="text-sm text-text-muted">Calificación</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reservas">
              <div className="space-y-4">
                {reservas.map((reserva) => (
                  <div key={reserva.id} className="bg-white rounded-xl p-6 border border-border">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={reserva.package.image || "/placeholder.svg"}
                          alt={reserva.package.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-display font-bold mb-1">{reserva.package.title}</h3>
                            <p className="text-text-muted">{reserva.package.destination}</p>
                          </div>
                          <Badge className={reserva.estado === "Confirmado" ? "bg-accent" : "bg-secondary"}>
                            {reserva.estado}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>{reserva.fecha}</span>
                          </div>
                          <div className="flex items-center gap-2 text-text-muted">
                            <User className="w-4 h-4" />
                            <span>{reserva.personas} personas</span>
                          </div>
                          <div className="flex items-center gap-2 text-text-muted">
                            <Clock className="w-4 h-4" />
                            <span>{reserva.package.duration}</span>
                          </div>
                          <div className="font-semibold text-primary">
                            ${reserva.package.price * reserva.personas} USD
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            Ver detalles
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            Descargar voucher
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#25D366] text-white hover:bg-[#128C7E] border-0"
                          >
                            Contactar soporte
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favoritos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritos.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-border">
                    <div className="relative h-48">
                      <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center">
                        <Heart className="w-5 h-5 fill-primary text-primary" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-bold mb-2">{pkg.title}</h3>
                      <p className="text-sm text-text-muted mb-3">{pkg.destination}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">${pkg.price}</span>
                        <Button size="sm" className="bg-gradient-toucan hover:opacity-90">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="destacados">
              <div className="bg-white rounded-xl p-8 border border-border">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-10 h-10 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">Recomendaciones Personalizadas</h2>
                  <p className="text-text-muted">Basadas en tus preferencias y viajes anteriores</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {mockPackages.slice(0, 3).map((pkg) => (
                    <div key={pkg.id} className="border border-border rounded-lg p-4">
                      <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                        <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
                        <Badge className="absolute top-2 left-2 bg-secondary">Recomendado</Badge>
                      </div>
                      <h3 className="font-bold mb-2">{pkg.title}</h3>
                      <p className="text-sm text-text-muted mb-3">95% de coincidencia con tus gustos</p>
                      <Button className="w-full bg-gradient-toucan hover:opacity-90" size="sm">
                        Explorar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentos">
              <div className="bg-white rounded-xl p-6 border border-border">
                <h2 className="text-xl font-display font-bold mb-6">Documentos de Viaje</h2>
                <div className="space-y-4">
                  {[
                    { nombre: "Pasaporte", vencimiento: "15/05/2028", estado: "Válido" },
                    { nombre: "Visa Schengen", vencimiento: "20/12/2024", estado: "Válido" },
                    { nombre: "Certificado de Vacunación", vencimiento: "-", estado: "Actualizado" },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{doc.nombre}</div>
                          <div className="text-sm text-text-muted">Vence: {doc.vencimiento}</div>
                        </div>
                      </div>
                      <Badge className="bg-accent">{doc.estado}</Badge>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full bg-transparent mt-4">
                    <FileText className="w-4 h-4 mr-2" />
                    Agregar documento
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
