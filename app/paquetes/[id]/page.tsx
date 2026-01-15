import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddToCartButton } from "@/components/add-to-cart-button"
import {
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  Check,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Shield,
  MessageCircle,
  Heart,
} from "lucide-react"
import Image from "next/image"
import { mockPackages } from "@/lib/mock-data"

export default function PackageDetailPage({ params }: { params: { id: string } }) {
  const pkg = mockPackages.find((p) => p.id === params.id) || mockPackages[0]

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero del paquete */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden mb-4">
              <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
              {pkg.featured && (
                <Badge className="absolute top-4 left-4 bg-secondary text-text font-semibold">Destacado</Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={pkg.image || "/placeholder.svg"}
                    alt={`Vista ${i}`}
                    fill
                    className="object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(pkg.rating) ? "fill-secondary text-secondary" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="font-semibold">{pkg.rating}</span>
              <span className="text-text-muted">({pkg.reviews} reseñas)</span>
            </div>

            <h1 className="text-4xl font-display font-bold mb-3 text-balance">{pkg.title}</h1>

            <div className="flex items-center gap-2 text-text-muted mb-6">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{pkg.destination}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {pkg.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 text-center border border-border">
                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{pkg.duration}</div>
                <div className="text-xs text-text-muted">Duración</div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center border border-border">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{pkg.groupSize}</div>
                <div className="text-xs text-text-muted">Grupo</div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center border border-border">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">Todo el año</div>
                <div className="text-xs text-text-muted">Disponibilidad</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-primary">${pkg.price}</span>
                <span className="text-text-muted">USD por persona</span>
              </div>

              <div className="space-y-3 mb-6">
                <AddToCartButton pkg={pkg} />

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 bg-transparent">
                    <Heart className="w-5 h-5 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" className="h-12 bg-[#25D366] text-white hover:bg-[#128C7E] border-0">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              <div className="text-sm text-text-muted text-center">Reserva ahora y paga después</div>
            </div>
          </div>
        </div>

        {/* Tabs de información */}
        <Tabs defaultValue="descripcion" className="mb-12">
          <TabsList className="w-full justify-start mb-8 bg-white border border-border">
            <TabsTrigger value="descripcion" className="text-base">
              Descripción
            </TabsTrigger>
            <TabsTrigger value="itinerario" className="text-base">
              Itinerario
            </TabsTrigger>
            <TabsTrigger value="incluye" className="text-base">
              Qué incluye
            </TabsTrigger>
            <TabsTrigger value="reseñas" className="text-base">
              Reseñas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="descripcion" className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-display font-bold mb-4">Descripción del viaje</h2>
            <div className="prose max-w-none text-text">
              <p className="text-lg leading-relaxed mb-4">
                Embárcate en una aventura inolvidable hacia {pkg.destination}. Este paquete exclusivo ha sido diseñado
                para ofrecerte una experiencia completa y memorable, combinando la comodidad del alojamiento de primera
                clase con emocionantes actividades que te permitirán explorar lo mejor de este increíble destino.
              </p>
              <p className="leading-relaxed mb-4">
                Durante {pkg.duration}, vivirás momentos únicos mientras descubres paisajes impresionantes, conoces la
                cultura local y te sumerges en experiencias auténticas. Nuestro equipo de expertos ha cuidado cada
                detalle para garantizar que tu viaje sea perfecto desde el primer hasta el último día.
              </p>
              <p className="leading-relaxed">
                Ya sea que viajes solo, en pareja, con familia o amigos, este paquete se adapta perfectamente a tus
                necesidades y garantiza recuerdos que durarán toda la vida.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="itinerario" className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-display font-bold mb-6">Itinerario detallado</h2>
            <div className="space-y-6">
              {[
                {
                  dia: 1,
                  titulo: "Llegada y Bienvenida",
                  desc: "Llegada al aeropuerto, traslado al hotel y cena de bienvenida",
                },
                { dia: 2, titulo: "Tour de la Ciudad", desc: "Visita guiada a los principales puntos turísticos" },
                {
                  dia: 3,
                  titulo: "Aventura y Naturaleza",
                  desc: "Excursión a parajes naturales y actividades al aire libre",
                },
                {
                  dia: 4,
                  titulo: "Experiencias Locales",
                  desc: "Inmersión en la cultura local, mercados y gastronomía",
                },
                { dia: 5, titulo: "Despedida", desc: "Último desayuno, tiempo libre y traslado al aeropuerto" },
              ].map((item) => (
                <div key={item.dia} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {item.dia}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-lg mb-1">
                      Día {item.dia}: {item.titulo}
                    </h3>
                    <p className="text-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="incluye" className="bg-white rounded-2xl p-8 border border-border">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Check className="w-6 h-6 text-accent" />
                  Incluido en el paquete
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: Plane, text: "Vuelos de ida y vuelta" },
                    { icon: Hotel, text: "Alojamiento en hoteles 4-5 estrellas" },
                    { icon: Utensils, text: "Desayunos y cenas incluidas" },
                    { icon: Camera, text: "Tours y excursiones guiadas" },
                    { icon: Shield, text: "Seguro de viaje completo" },
                    { icon: Users, text: "Guía profesional en español" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-display font-bold mb-4 text-text-muted">No incluido</h3>
                <ul className="space-y-3 text-text-muted">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Gastos personales y propinas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Actividades opcionales no mencionadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Comidas no especificadas en el itinerario</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Trámites de visa (disponibles con nosotros)</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reseñas" className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-display font-bold mb-6">Lo que dicen nuestros viajeros</h2>
            <div className="space-y-6">
              {[
                {
                  name: "María González",
                  rating: 5,
                  date: "Hace 2 semanas",
                  comment:
                    "Una experiencia absolutamente increíble. Todo estuvo perfectamente organizado y superó mis expectativas.",
                },
                {
                  name: "Carlos Rodríguez",
                  rating: 5,
                  date: "Hace 1 mes",
                  comment:
                    "El mejor viaje de mi vida. Los guías fueron excepcionales y las actividades muy bien planeadas.",
                },
                {
                  name: "Ana Martínez",
                  rating: 4,
                  date: "Hace 2 meses",
                  comment: "Muy buen paquete, todo como lo prometido. Recomendado para familias.",
                },
              ].map((review, i) => (
                <div key={i} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{review.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`w-4 h-4 ${j < review.rating ? "fill-secondary text-secondary" : "text-border"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-text-muted">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-muted">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
