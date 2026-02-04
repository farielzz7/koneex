"use client"

import { useWizard } from "../WizardContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Plane, Hotel as HotelIcon, Users, MapPin, ExternalLink } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

type Destination = {
    id: number
    name: string
    country: string
    state: string
    city: string
}

type Provider = {
    id: number
    name: string
    type: string
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

export function Step1General() {
    const { data, updateData } = useWizard()
    const { general } = data

    const [destinations, setDestinations] = useState<Destination[]>([])
    const [providers, setProviders] = useState<Provider[]>([])
    const [airlines, setAirlines] = useState<Airline[]>([])
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [loadingDestinations, setLoadingDestinations] = useState(true)
    const [loadingProviders, setLoadingProviders] = useState(true)
    const [loadingAirlines, setLoadingAirlines] = useState(false)
    const [loadingHotels, setLoadingHotels] = useState(false)

    useEffect(() => {
        fetchDestinations()
        fetchProviders()
        fetchHotels()
    }, [])

    useEffect(() => {
        if (general.includes_flight) {
            fetchAirlines()
        }
    }, [general.includes_flight])

    const fetchDestinations = async () => {
        try {
            const { data, error } = await supabase
                .from('destinations')
                .select('id, name, country, state, city')
                .order('name')
            if (error) throw error
            setDestinations(data || [])
        } catch (error) {
            console.error('Error fetching destinations:', error)
        } finally {
            setLoadingDestinations(false)
        }
    }

    const fetchProviders = async () => {
        try {
            const { data, error } = await supabase
                .from('providers')
                .select('id, name, type')
                .eq('status', 'ACTIVE')
                .order('name')
            if (error) throw error
            setProviders(data || [])
        } catch (error) {
            console.error('Error fetching providers:', error)
        } finally {
            setLoadingProviders(false)
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
            if (error) throw error
            setAirlines(data || [])
        } catch (error) {
            console.error('Error fetching airlines:', error)
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
            if (error) throw error
            setHotels(data || [])
        } catch (error) {
            console.error('Error fetching hotels:', error)
        } finally {
            setLoadingHotels(false)
        }
    }

    // Slug auto-generation
    useEffect(() => {
        if (general.title && !general.slug) {
            const slug = general.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            updateData('general', { ...general, slug: slug })
        }
    }, [general.title])

    const handleChange = (field: keyof typeof general, value: any) => {
        updateData('general', { ...general, [field]: value })
    }

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Información General</h2>
                <p className="text-muted-foreground">Define los datos básicos de este paquete turístico.</p>
            </div>

            {/* Basic Info */}
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
                                value={general.destination_id}
                                onChange={(e) => handleChange('destination_id', parseInt(e.target.value))}
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
                            value={general.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Ej: Cancún Todo Incluido 5 días"
                        />
                    </div>

                    <div>
                        <Label>Slug (URL) <span className="text-muted-foreground font-normal text-xs">- Se genera automático</span></Label>
                        <div className="flex items-center rounded-md border bg-muted/50 px-3 h-10 text-sm text-muted-foreground">
                            domain.com/viajes/
                            <input
                                value={general.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                className="bg-transparent border-none focus:outline-none flex-1 ml-1 text-foreground"
                            />
                        </div>
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
                                    onClick={() => handleChange('package_category', cat.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${general.package_category === cat.id
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <span className="text-xl mb-1">{cat.icon}</span>
                                    <span className="text-sm font-medium">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {general.package_category === 'offer' && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-4">
                            <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                                🔥 Configuración de Oferta
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="offer_discount">Descuento (%)</Label>
                                    <Input
                                        id="offer_discount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={general.offer_discount}
                                        onChange={(e) => handleChange('offer_discount', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="offer_valid_until">Válido hasta</Label>
                                    <Input
                                        id="offer_valid_until"
                                        type="date"
                                        value={general.offer_valid_until}
                                        onChange={(e) => handleChange('offer_valid_until', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="short_description">Descripción Corta</Label>
                        <Input
                            id="short_description"
                            value={general.short_description}
                            onChange={(e) => handleChange('short_description', e.target.value)}
                            placeholder="Resumen breve (150 caracteres)"
                            maxLength={150}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción Completa</Label>
                        <Textarea
                            id="description"
                            value={general.description}
                            onChange={(e) => handleChange('description', e.target.value)}
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
                                value={general.duration_days}
                                onChange={(e) => handleChange('duration_days', parseInt(e.target.value) || 1)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="duration_nights">Noches</Label>
                            <Input
                                id="duration_nights"
                                type="number"
                                min="0"
                                value={general.duration_nights}
                                onChange={(e) => handleChange('duration_nights', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3 text-sm">Fecha de Salida</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="start_date">Fecha de Inicio del Viaje</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={general.start_date}
                                    onChange={(e) => handleChange('start_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="end_date">Fecha de Fin del Viaje</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={general.end_date}
                                    onChange={(e) => handleChange('end_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Define las fechas específicas para esta salida del paquete
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="group_size">Tamaño de Grupo</Label>
                        <Input
                            id="group_size"
                            value={general.group_size}
                            onChange={(e) => handleChange('group_size', e.target.value)}
                            placeholder="Ej: 2-15 personas"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Provider */}
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
                    <Label htmlFor=" provider">Proveedor (Opcional)</Label>
                    {loadingProviders ? (
                        <div className="flex items-center gap-2 text-muted-foreground p-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cargando proveedores...
                        </div>
                    ) : (
                        <select
                            id="provider"
                            value={general.provider_id}
                            onChange={(e) => handleChange('provider_id', parseInt(e.target.value))}
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

            {/* Flight */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plane className="w-5 h-5" />
                        Información de Vuelo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={general.includes_flight}
                            onChange={(e) => handleChange('includes_flight', e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">✈️ Incluye Vuelo</span>
                    </label>

                    {general.includes_flight && (
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
                                        value={general.airline_id}
                                        onChange={(e) => handleChange('airline_id', e.target.value)}
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
                                        value={general.flight_origin}
                                        onChange={(e) => handleChange('flight_origin', e.target.value)}
                                        placeholder="Ciudad de origen"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="flight_destination">Destino</Label>
                                    <Input
                                        id="flight_destination"
                                        value={general.flight_destination}
                                        onChange={(e) => handleChange('flight_destination', e.target.value)}
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
                    <CardTitle className="flex items-center gap-2">
                        <HotelIcon className="w-5 h-5" />
                        Información de Hotel
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
                                value={general.hotel_id}
                                onChange={(e) => handleChange('hotel_id', e.target.value)}
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

                    {general.hotel_id === "" && (
                        <div>
                            <Label htmlFor="hotel_custom_name">Nombre del Hotel (personalizado)</Label>
                            <Input
                                id="hotel_custom_name"
                                value={general.hotel_custom_name}
                                onChange={(e) => handleChange('hotel_custom_name', e.target.value)}
                                placeholder="Escribe el nombre del hotel"
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="meals_plan">Plan de Alimentos</Label>
                        <select
                            id="meals_plan"
                            value={general.meals_plan}
                            onChange={(e) => handleChange('meals_plan', e.target.value as any)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="none">Sin alimentos</option>
                            <option value="breakfast">Solo desayuno</option>
                            <option value="half">Media pensión</option>
                            <option value="full">Pensión completa</option>
                            <option value="all_inclusive">Todo incluido</option>
                        </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={general.transportation_included}
                            onChange={(e) => handleChange('transportation_included', e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">🚗 Incluye Transporte</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={general.children_allowed}
                            onChange={(e) => handleChange('children_allowed', e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">👶 Permite Menores</span>
                    </label>
                </CardContent>
            </Card>
        </div>
    )
}
