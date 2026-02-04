"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, X, Loader2, Image as ImageIcon, DollarSign, MapPin, Plane, Hotel as HotelIcon, ExternalLink, Users, Calendar, Star } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type Destination = {
    id: number
    name: string
    country: string
    state: string
    city: string
}

type Airline = {
    id: string
    name: string
    iata_code: string | null
}

type Hotel = {
    id: string
    name: string
    stars: number | null
}

type Provider = {
    id: number
    name: string
    type: string
}

export default function NewPackagePage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [destinations, setDestinations] = useState<Destination[]>([])
    const [airlines, setAirlines] = useState<Airline[]>([])
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [providers, setProviders] = useState<Provider[]>([])
    const [loadingDestinations, setLoadingDestinations] = useState(true)
    const [loadingAirlines, setLoadingAirlines] = useState(false)
    const [loadingHotels, setLoadingHotels] = useState(false)
    const [loadingProviders, setLoadingProviders] = useState(true)

    const [form, setForm] = useState({
        destination_id: 0,
        title: "",
        package_category: "normal" as 'normal' | 'featured' | 'group_travel' | 'offer',
        description: "",
        short_description: "",
        price: 0,
        price_single: 0,
        price_double: 0,
        price_triple: 0,
        price_child: 0,
        children_allowed: true,
        currency_code: "MXN",
        duration_days: 1,
        duration_nights: 0,
        group_size: "",
        rating: 0,
        featured: false,
        tags: [] as string[],
        images: [] as string[],
        includes: [] as string[],
        excludes: [] as string[],
        status: "DRAFT" as 'DRAFT' | 'ACTIVE' | 'INACTIVE',
        is_offer: false,
        offer_discount: 0,
        offer_valid_until: "",
        available_dates: [] as string[],
        // Componentes del paquete
        provider_id: 0,
        includes_flight: false,
        airline_id: "",
        flight_origin: "",
        flight_destination: "",
        hotel_id: "",
        hotel_custom_name: "",
        transportation_included: false,
        meals_plan: "none" as 'none' | 'breakfast' | 'half' | 'full' | 'all_inclusive',
        tours_included: [] as string[],
    })

    const [newImageUrl, setNewImageUrl] = useState("")
    const [newTag, setNewTag] = useState("")
    const [newInclude, setNewInclude] = useState("")
    const [newExclude, setNewExclude] = useState("")
    const [newTour, setNewTour] = useState("")
    const [newDate, setNewDate] = useState("")

    // Hotel Modal State
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false)
    const [isAddingHotel, setIsAddingHotel] = useState(false)
    const [hotelForm, setHotelForm] = useState({
        name: "",
        stars: 5,
        is_active: true
    })

    useEffect(() => {
        fetchDestinations()
        fetchProviders()
        fetchHotels() // Fetch hotels initially too
    }, [])

    useEffect(() => {
        if (form.includes_flight) {
            fetchAirlines()
        }
    }, [form.includes_flight])

    useEffect(() => {
        if (form.destination_id > 0) {
            fetchHotels()
        }
    }, [form.destination_id])

    const fetchDestinations = async () => {
        try {
            const { data, error } = await supabase
                .from('destinations')
                .select('id, name, country, state, city')
                .order('name')

            if (error) {
                console.error('Error fetching destinations:', error)
                throw error
            }
            console.log('Destinations loaded:', data)
            setDestinations(data || [])
        } catch (error) {
            console.error('Error fetching destinations:', error)
            toast.error('Error al cargar destinos')
        } finally {
            setLoadingDestinations(false)
        }
    }

    const fetchAirlines = async () => {
        setLoadingAirlines(true)
        try {
            const { data, error } = await supabase
                .from('airlines')
                .select('id, name, iata_code')
                .eq('is_active', true)
                .order('name')

            if (error) {
                console.error('Error fetching airlines:', error)
                throw error
            }
            console.log('Airlines loaded:', data)
            setAirlines(data || [])
        } catch (error) {
            console.error('Error fetching airlines:', error)
            toast.error('Error al cargar aerolíneas')
        } finally {
            setLoadingAirlines(false)
        }
    }

    const fetchHotels = async () => {
        setLoadingHotels(true)
        try {
            const { data, error } = await supabase
                .from('hotels')
                .select('id, name, stars')
                .eq('is_active', true)
                .order('name')

            if (error) {
                console.error('Error fetching hotels:', error)
                throw error
            }
            console.log('Hotels loaded:', data)
            setHotels(data || [])
        } catch (error) {
            console.error('Error fetching hotels:', error)
            toast.error('Error al cargar hoteles')
        } finally {
            setLoadingHotels(false)
        }
    }

    const fetchProviders = async () => {
        setLoadingProviders(true)
        try {
            const { data, error } = await supabase
                .from('providers')
                .select('id, name, type')
                .eq('status', 'ACTIVE')
                .eq('type', 'WHOLESALER')
                .order('name')

            if (error) {
                console.error('Error fetching providers:', error)
                throw error
            }
            console.log('Providers loaded:', data)
            setProviders(data || [])
        } catch (error) {
            console.error('Error fetching providers:', error)
            toast.error('Error al cargar proveedores')
        } finally {
            setLoadingProviders(false)
        }
    }

    const handleTitleChange = (title: string) => {
        setForm({
            ...form,
            title
        })
    }

    const handleSave = async () => {
        if (!form.title.trim()) {
            toast.error("El título es requerido")
            return
        }
        if (!form.destination_id) {
            toast.error("Selecciona un destino")
            return
        }

        setSaving(true)
        try {
            const response = await fetch('/api/admin/packages', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Error al crear paquete")
            }

            const newPackage = await response.json()
            toast.success("Paquete creado correctamente")
            router.push(`/admin/packages/${newPackage.id}`)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al crear el paquete")
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    const addImage = () => {
        if (newImageUrl.trim()) {
            setForm({ ...form, images: [...form.images, newImageUrl.trim()] })
            setNewImageUrl("")
        }
    }

    const removeImage = (index: number) => {
        setForm({ ...form, images: form.images.filter((_, i) => i !== index) })
    }

    const addTag = () => {
        if (newTag.trim() && !form.tags.includes(newTag.trim())) {
            setForm({ ...form, tags: [...form.tags, newTag.trim()] })
            setNewTag("")
        }
    }

    const removeTag = (tag: string) => {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag) })
    }

    const addInclude = () => {
        if (newInclude.trim()) {
            setForm({ ...form, includes: [...form.includes, newInclude.trim()] })
            setNewInclude("")
        }
    }

    const removeInclude = (index: number) => {
        setForm({ ...form, includes: form.includes.filter((_, i) => i !== index) })
    }

    const addExclude = () => {
        if (newExclude.trim()) {
            setForm({ ...form, excludes: [...form.excludes, newExclude.trim()] })
            setNewExclude("")
        }
    }

    const removeExclude = (index: number) => {
        setForm({ ...form, excludes: form.excludes.filter((_, i) => i !== index) })
    }

    const addTour = () => {
        if (newTour.trim()) {
            setForm({ ...form, tours_included: [...form.tours_included, newTour.trim()] })
            setNewTour("")
        }
    }

    const removeTour = (index: number) => {
        setForm({ ...form, tours_included: form.tours_included.filter((_, i) => i !== index) })
    }

    const handleQuickAddHotel = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!hotelForm.name.trim()) {
            toast.error("El nombre del hotel es requerido")
            return
        }

        setIsAddingHotel(true)
        try {
            const { data, error } = await supabase
                .from('hotels')
                .insert([hotelForm])
                .select()
                .single()

            if (error) throw error

            toast.success("Hotel agregado correctamente")
            await fetchHotels()
            setForm({ ...form, hotel_id: data.id })
            setIsHotelModalOpen(false)
            setHotelForm({ name: "", stars: 5, is_active: true })
        } catch (error) {
            console.error("Error adding hotel:", error)
            toast.error("Error al agregar el hotel")
        } finally {
            setIsAddingHotel(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/packages">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Crear Nuevo Paquete</h1>
                        <p className="text-muted-foreground">Completa todos los detalles del paquete</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Crear Paquete
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Información Básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Información Básica
                                </div>
                                <Link href="/admin/destinations/new" target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    Nuevo Destino
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="destination">Destino *</Label>
                                {loadingDestinations ? (
                                    <div className="flex items-center gap-2 text-muted-foreground p-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Cargando destinos...
                                    </div>
                                ) : (
                                    <select
                                        id="destination"
                                        value={form.destination_id}
                                        onChange={(e) => setForm({ ...form, destination_id: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value={0}>Selecciona un destino ({destinations.length} disponibles)</option>
                                        {destinations.map(dest => (
                                            <option key={dest.id} value={dest.id}>
                                                {dest.name}, {dest.city}, {dest.state} - {dest.country}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="title">Título del Paquete *</Label>
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Ej: Cancún Todo Incluido 5 días"
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block">Categoría del Paquete</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {[
                                        { id: 'normal', label: 'Normal', icon: '🏷️' },
                                        { id: 'featured', label: 'Destacado', icon: '⭐' },
                                        { id: 'group_travel', label: 'Viaje Grupal', icon: '👥' },
                                        { id: 'offer', label: 'Oferta Especial', icon: '🔥' },
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setForm({ ...form, package_category: cat.id as any })}
                                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${form.package_category === cat.id
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                                }`}
                                        >
                                            <span className="text-xl mb-1">{cat.icon}</span>
                                            <span className="text-sm font-medium">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {form.package_category === 'offer' && (
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-4">
                                    <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                                        🔥 Configuración de Oferta
                                    </h4>

                                    <div>
                                        <Label htmlFor="offer_discount">Descuento (%)</Label>
                                        <Input
                                            id="offer_discount"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={form.offer_discount}
                                            onChange={(e) => setForm({ ...form, offer_discount: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="offer_valid_until">Válido hasta</Label>
                                        <Input
                                            id="offer_valid_until"
                                            type="date"
                                            value={form.offer_valid_until}
                                            onChange={(e) => setForm({ ...form, offer_valid_until: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Fechas Disponibles
                                </Label>
                                <div className="flex gap-2 mb-3">
                                    <Input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                if (newDate) {
                                                    setForm({ ...form, available_dates: [...form.available_dates, newDate].sort() })
                                                    setNewDate("")
                                                }
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (newDate) {
                                                setForm({ ...form, available_dates: [...form.available_dates, newDate].sort() })
                                                setNewDate("")
                                            }
                                        }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                {form.available_dates.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {form.available_dates.map((date, index) => (
                                            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border">
                                                <span className="text-sm font-medium">
                                                    {new Date(date).toLocaleDateString('es-MX', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newDates = form.available_dates.filter((_, i) => i !== index)
                                                        setForm({ ...form, available_dates: newDates })
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        No hay fechas seleccionadas. Si se deja vacío, se asume disponibilidad abierta.
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="short_description">Descripción Corta</Label>
                                <Input
                                    id="short_description"
                                    value={form.short_description}
                                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                                    placeholder="Resumen breve (150 caracteres)"
                                    maxLength={150}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Descripción Completa</Label>
                                <Textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Descripción detallada del paquete"
                                    rows={6}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="duration_days">Días</Label>
                                    <Input
                                        id="duration_days"
                                        type="number"
                                        min="1"
                                        value={form.duration_days}
                                        onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration_nights">Noches</Label>
                                    <Input
                                        id="duration_nights"
                                        type="number"
                                        min="0"
                                        value={form.duration_nights}
                                        onChange={(e) => setForm({ ...form, duration_nights: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="group_size">Tamaño de Grupo</Label>
                                <Input
                                    id="group_size"
                                    value={form.group_size}
                                    onChange={(e) => setForm({ ...form, group_size: e.target.value })}
                                    placeholder="Ej: 2-15 personas"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proveedor */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Proveedor
                                </div>
                                <Link href="/admin/providers/new" target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    Nuevo Proveedor
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="provider">Proveedor (Opcional)</Label>
                            {loadingProviders ? (
                                <div className="flex items-center gap-2 text-muted-foreground p-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Cargando proveedores...
                                </div>
                            ) : (
                                <select
                                    id="provider"
                                    value={form.provider_id}
                                    onChange={(e) => setForm({ ...form, provider_id: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value={0}>Sin proveedor ({providers.length} disponibles)</option>
                                    {providers.map(provider => (
                                        <option key={provider.id} value={provider.id}>
                                            {provider.name} ({provider.type})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vuelo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Plane className="w-5 h-5" />
                                    Información de Vuelo
                                </div>
                                {form.includes_flight && (
                                    <Link href="/admin/airlines/new" target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1">
                                        <Plus className="w-3 h-3" />
                                        Nueva Aerolínea
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.includes_flight}
                                    onChange={(e) => setForm({ ...form, includes_flight: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">✈️ Incluye Vuelo</span>
                            </label>

                            {form.includes_flight && (
                                <>
                                    <div>
                                        <Label htmlFor="airline">Aerolínea</Label>
                                        {loadingAirlines ? (
                                            <div className="flex items-center gap-2 text-muted-foreground p-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Cargando aerolíneas...
                                            </div>
                                        ) : (
                                            <select
                                                id="airline"
                                                value={form.airline_id}
                                                onChange={(e) => setForm({ ...form, airline_id: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Selecciona aerolínea ({airlines.length} disponibles)</option>
                                                {airlines.map(airline => (
                                                    <option key={airline.id} value={airline.id}>
                                                        {airline.name} {airline.iata_code ? `(${airline.iata_code})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="flight_origin">Origen</Label>
                                            <Input
                                                id="flight_origin"
                                                value={form.flight_origin}
                                                onChange={(e) => setForm({ ...form, flight_origin: e.target.value })}
                                                placeholder="Ciudad de origen"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="flight_destination">Destino</Label>
                                            <Input
                                                id="flight_destination"
                                                value={form.flight_destination}
                                                onChange={(e) => setForm({ ...form, flight_destination: e.target.value })}
                                                placeholder="Ciudad destino"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Hotel */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HotelIcon className="w-5 h-5" />
                                    Información de Hotel
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsHotelModalOpen(true)}
                                    className="gap-1 h-8"
                                >
                                    <Plus className="w-3 h-3" />
                                    Nuevo Hotel
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="hotel">Hotel</Label>
                                {loadingHotels ? (
                                    <div className="flex items-center gap-2 text-muted-foreground p-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Cargando hoteles...
                                    </div>
                                ) : (
                                    <select
                                        id="hotel"
                                        value={form.hotel_id}
                                        onChange={(e) => setForm({ ...form, hotel_id: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Selecciona hotel o escribe uno nuevo ({hotels.length} disponibles)</option>
                                        {hotels.map(hotel => (
                                            <option key={hotel.id} value={hotel.id}>
                                                {hotel.name} {hotel.stars ? `- ${"⭐".repeat(hotel.stars)}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {form.hotel_id === "" && (
                                <div>
                                    <Label htmlFor="hotel_custom_name">Nombre del Hotel (personalizado)</Label>
                                    <Input
                                        id="hotel_custom_name"
                                        value={form.hotel_custom_name}
                                        onChange={(e) => setForm({ ...form, hotel_custom_name: e.target.value })}
                                        placeholder="Escribe el nombre del hotel"
                                    />
                                </div>
                            )}

                            <div>
                                <Label htmlFor="meals_plan">Plan de Alimentos</Label>
                                <select
                                    id="meals_plan"
                                    value={form.meals_plan}
                                    onChange={(e) => setForm({ ...form, meals_plan: e.target.value as any })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="none">Sin alimentos</option>
                                    <option value="breakfast">Solo desayuno</option>
                                    <option value="half">Media pensión</option>
                                    <option value="full">Pensión completa</option>
                                    <option value="all_inclusive">Todo incluido</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transporte y Tours */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Servicios Adicionales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.transportation_included}
                                    onChange={(e) => setForm({ ...form, transportation_included: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">🚗 Incluye Transporte Terrestre</span>
                            </label>

                            <div>
                                <Label>Tours Incluidos</Label>
                                <div className="flex gap-2 mb-3">
                                    <Input
                                        value={newTour}
                                        onChange={(e) => setNewTour(e.target.value)}
                                        placeholder="Ej: Tour a Chichén Itzá"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTour())}
                                    />
                                    <Button onClick={addTour} size="sm" type="button">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <ul className="space-y-2">
                                    {form.tours_included.map((tour, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm">{tour}</span>
                                            <button
                                                onClick={() => removeTour(index)}
                                                className="text-red-500 hover:text-red-700"
                                                type="button"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Imágenes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Imágenes del Paquete
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                                />
                                <Button onClick={addImage} type="button">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {form.images.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Imagen ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            type="button"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded">
                                                Principal
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {form.images.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No hay imágenes agregadas
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Incluye / No Incluye */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">✅ Incluye</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={newInclude}
                                        onChange={(e) => setNewInclude(e.target.value)}
                                        placeholder="Ej: Vuelo redondo"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                                    />
                                    <Button onClick={addInclude} size="sm" type="button">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <ul className="space-y-2">
                                    {form.includes.map((item, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm">{item}</span>
                                            <button
                                                onClick={() => removeInclude(index)}
                                                className="text-red-500 hover:text-red-700"
                                                type="button"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">❌ No Incluye</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={newExclude}
                                        onChange={(e) => setNewExclude(e.target.value)}
                                        placeholder="Ej: Propinas"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclude())}
                                    />
                                    <Button onClick={addExclude} size="sm" type="button">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <ul className="space-y-2">
                                    {form.excludes.map((item, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm">{item}</span>
                                            <button
                                                onClick={() => removeExclude(index)}
                                                className="text-red-500 hover:text-red-700"
                                                type="button"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Columna Lateral */}
                <div className="space-y-6">
                    {/* Tarifas por Ocupación */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Tarifas por Ocupación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="currency">Moneda</Label>
                                <select
                                    id="currency"
                                    value={form.currency_code}
                                    onChange={(e) => setForm({ ...form, currency_code: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="MXN">MXN - Peso Mexicano</option>
                                    <option value="USD">USD - Dólar</option>
                                    <option value="EUR">EUR - Euro</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="price_single">🛏️ Sencilla (1 persona)</Label>
                                <Input
                                    id="price_single"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price_single}
                                    onChange={(e) => setForm({ ...form, price_single: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <Label htmlFor="price_double">🛏️🛏️ Doble (por persona)</Label>
                                <Input
                                    id="price_double"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price_double}
                                    onChange={(e) => setForm({ ...form, price_double: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <Label htmlFor="price_triple">🛏️🛏️🛏️ Triple (por persona)</Label>
                                <Input
                                    id="price_triple"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price_triple}
                                    onChange={(e) => setForm({ ...form, price_triple: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="pt-3 border-t space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.children_allowed}
                                        onChange={(e) => setForm({ ...form, children_allowed: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">👶 Acepta Menores</span>
                                </label>

                                {form.children_allowed && (
                                    <div>
                                        <Label htmlFor="price_child">Precio por Menor</Label>
                                        <Input
                                            id="price_child"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.price_child}
                                            onChange={(e) => setForm({ ...form, price_child: parseFloat(e.target.value) || 0 })}
                                            placeholder="0.00"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tarifa especial para menores
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 border-t">
                                <Label htmlFor="price">Precio Base (Desde...)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Usado para mostrar "desde $X" en listados
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estado */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {['DRAFT', 'ACTIVE', 'INACTIVE'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setForm({ ...form, status: s as any })}
                                    className={`w-full py-2 px-4 rounded-lg border-2 transition-colors ${form.status === s
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {s === 'DRAFT' && '🟡 Borrador'}
                                    {s === 'ACTIVE' && '🟢 Activo'}
                                    {s === 'INACTIVE' && '🔴 Inactivo'}
                                </button>
                            ))}

                            <div className="pt-4 border-t">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">⭐ Destacado</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Ej: playa"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button onClick={addTag} size="sm" type="button">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-500"
                                            type="button"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Quick Add Hotel Modal */}
            <Dialog open={isHotelModalOpen} onOpenChange={setIsHotelModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <HotelIcon className="w-5 h-5 text-primary" />
                            Agregar Nuevo Hotel
                        </DialogTitle>
                        <DialogDescription>
                            Ingresa los detalles básicos del hotel. Estará disponible inmediatamente.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleQuickAddHotel} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="hotel_name">Nombre del Hotel *</Label>
                            <Input
                                id="hotel_name"
                                value={hotelForm.name}
                                onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                                placeholder="Ej: Grand Oasis Cancún"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hotel_stars">Estrellas</Label>
                            <select
                                id="hotel_stars"
                                value={hotelForm.stars}
                                onChange={(e) => setHotelForm({ ...hotelForm, stars: parseInt(e.target.value) })}
                                className="w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value={1}>⭐ 1 Estrella</option>
                                <option value={2}>⭐⭐ 2 Estrellas</option>
                                <option value={3}>⭐⭐⭐ 3 Estrellas</option>
                                <option value={4}>⭐⭐⭐⭐ 4 Estrellas</option>
                                <option value={5}>⭐⭐⭐⭐⭐ 5 Estrellas</option>
                            </select>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsHotelModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isAddingHotel} className="gap-2">
                                {isAddingHotel ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Guardar Hotel
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
