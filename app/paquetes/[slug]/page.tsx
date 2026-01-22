"use client"

import { useEffect, useState } from "react"
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
    Loader2,
    X
} from "lucide-react"
import Image from "next/image"

interface PackageDetail {
    id: string
    slug: string
    title: string
    description: string
    shortDescription: string
    destination: string
    destinationData: any
    duration: string
    durationDays: number
    durationNights: number
    price: number
    currency: string
    rating: number
    reviews: number
    groupSize: string
    image: string
    images: string[]
    featured: boolean
    tags: string[]
    includes: string[]
    excludes: string[]
    itinerary: Array<{
        dia: number
        titulo: string
        desc: string
        activities: string[]
    }>
}

export default function PackageDetailPage({ params }: { params: { slug: string } }) {
    const [pkg, setPkg] = useState<PackageDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchPackage()
    }, [params.slug])

    const fetchPackage = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/packages/${params.slug}`)
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Paquete no encontrado')
                }
                throw new Error('Error al cargar el paquete')
            }
            const data = await response.json()
            setPkg(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !pkg) {
        return (
            <div className="min-h-screen bg-surface">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center border border-border">
                        <X className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h1 className="text-2xl font-bold mb-2">Paquete no encontrado</h1>
                        <p className="text-text-muted mb-6">{error}</p>
                        <Button asChild>
                            <a href="/paquetes">Ver todos los paquetes</a>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const defaultIncludes = pkg.includes.length > 0 ? pkg.includes : [
        "Vuelos de ida y vuelta",
        "Alojamiento en hoteles 4-5 estrellas",
        "Desayunos y cenas incluidas",
        "Tours y excursiones guiadas",
        "Seguro de viaje completo",
        "Guía profesional en español"
    ]

    const defaultExcludes = pkg.excludes.length > 0 ? pkg.excludes : [
        "Gastos personales y propinas",
        "Actividades opcionales no mencionadas",
        "Comidas no especificadas en el itinerario",
        "Trámites de visa (disponibles con nosotros)"
    ]

    return (
        <div className="min-h-screen bg-surface">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Hero del paquete */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div>
                        <div className="relative h-96 rounded-2xl overflow-hidden mb-4">
                            <Image
                                src={pkg.image}
                                alt={pkg.title}
                                fill
                                className="object-cover"
                                unoptimized={pkg.image.startsWith('http')}
                            />
                            {pkg.featured && (
                                <Badge className="absolute top-4 left-4 bg-secondary text-text font-semibold">Destacado</Badge>
                            )}
                        </div>

                        {pkg.images.length > 1 && (
                            <div className="grid grid-cols-3 gap-3">
                                {pkg.images.slice(1, 4).map((img, i) => (
                                    <div key={i} className="relative h-24 rounded-lg overflow-hidden">
                                        <Image
                                            src={img}
                                            alt={`Vista ${i + 1}`}
                                            fill
                                            className="object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                            unoptimized={img.startsWith('http')}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
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
                            <span className="font-semibold">{pkg.rating.toFixed(1)}</span>
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
                                <span className="text-4xl font-bold text-primary">${pkg.price.toLocaleString()}</span>
                                <span className="text-text-muted">{pkg.currency} por persona</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <AddToCartButton pkg={{
                                    id: pkg.id,
                                    title: pkg.title,
                                    price: pkg.price,
                                    image: pkg.image,
                                    destination: pkg.destination,
                                    duration: pkg.duration
                                }} />

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
                    </TabsList>

                    <TabsContent value="descripcion" className="bg-white rounded-2xl p-8 border border-border">
                        <h2 className="text-2xl font-display font-bold mb-4">Descripción del viaje</h2>
                        <div className="prose max-w-none text-text">
                            <p className="text-lg leading-relaxed whitespace-pre-line">
                                {pkg.description}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="itinerario" className="bg-white rounded-2xl p-8 border border-border">
                        <h2 className="text-2xl font-display font-bold mb-6">Itinerario detallado</h2>
                        <div className="space-y-6">
                            {pkg.itinerary.length > 0 ? (
                                pkg.itinerary.map((item) => (
                                    <div key={item.dia} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                            {item.dia}
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <h3 className="font-semibold text-lg mb-1">
                                                Día {item.dia}: {item.titulo}
                                            </h3>
                                            <p className="text-text-muted">{item.desc}</p>
                                            {item.activities && item.activities.length > 0 && (
                                                <ul className="mt-2 space-y-1">
                                                    {item.activities.map((activity, i) => (
                                                        <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                                                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                            {activity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-text-muted">
                                    Itinerario detallado disponible próximamente. Contáctanos para más información.
                                </p>
                            )}
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
                                    {defaultIncludes.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-display font-bold mb-4 text-text-muted">No incluido</h3>
                                <ul className="space-y-3 text-text-muted">
                                    {defaultExcludes.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="mt-1">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
