"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    MapPin,
    Globe,
    X,
    Check,
    Loader2,
    Info,
    MoreHorizontal
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Country {
    id: number
    name: string
    iso2: string | null
    created_at: string
}

interface City {
    id: number
    country_id: number
    name: string
    state: string | null
    latitude: number | null
    longitude: number | null
    country_name?: string // From join
    created_at: string
}

export default function GeographyPage() {
    const [activeTab, setActiveTab] = useState("countries")
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Data states
    const [countries, setCountries] = useState<Country[]>([])
    const [cities, setCities] = useState<City[]>([])

    // Search
    const [countrySearch, setCountrySearch] = useState("")
    const [citySearch, setCitySearch] = useState("")

    // Modals
    const [countryModalOpen, setCountryModalOpen] = useState(false)
    const [cityModalOpen, setCityModalOpen] = useState(false)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [deleteCountryAlertOpen, setDeleteCountryAlertOpen] = useState(false)
    const [deleteCityAlertOpen, setDeleteCityAlertOpen] = useState(false)

    // Selection for Edit/Delete/Detail
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const [viewDetail, setViewDetail] = useState<{ type: 'country' | 'city', data: any } | null>(null)

    // Form states
    const [countryForm, setCountryForm] = useState({ name: "", iso2: "" })
    const [cityForm, setCityForm] = useState({
        name: "",
        country_id: "",
        state: "",
        latitude: "",
        longitude: ""
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [countriesRes, citiesRes] = await Promise.all([
                fetch("/api/admin/geography/countries"),
                fetch("/api/admin/geography/cities")
            ])
            const countriesData = await countriesRes.json()
            const citiesData = await citiesRes.json()
            setCountries(countriesData)
            setCities(citiesData)
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Error al cargar datos geográficos")
        } finally {
            setLoading(false)
        }
    }

    // --- Country Actions ---

    const openCreateCountry = () => {
        setSelectedCountry(null)
        setCountryForm({ name: "", iso2: "" })
        setCountryModalOpen(true)
    }

    const openEditCountry = (country: Country) => {
        setSelectedCountry(country)
        setCountryForm({ name: country.name, iso2: country.iso2 || "" })
        setCountryModalOpen(true)
    }

    const handleCountrySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const method = selectedCountry ? "PUT" : "POST"
        const url = selectedCountry
            ? `/api/admin/geography/countries/${selectedCountry.id}`
            : "/api/admin/geography/countries"

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(countryForm),
            })
            if (response.ok) {
                toast.success(selectedCountry ? "País actualizado" : "País creado")
                setCountryModalOpen(false)
                fetchData()
            } else {
                throw new Error("Error en la operación")
            }
        } catch (error) {
            toast.error("Error al procesar el país")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteCountry = async () => {
        if (!selectedCountry) return
        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/admin/geography/countries/${selectedCountry.id}`, {
                method: "DELETE"
            })
            if (response.ok) {
                toast.success("País eliminado")
                setDeleteCountryAlertOpen(false)
                fetchData()
            } else {
                const data = await response.json()
                toast.error(data.error || "No se pudo eliminar el país")
            }
        } catch (error) {
            toast.error("Error al eliminar país")
        } finally {
            setIsSubmitting(false)
        }
    }

    // --- City Actions ---

    const openCreateCity = () => {
        setSelectedCity(null)
        setCityForm({ name: "", country_id: "", state: "", latitude: "", longitude: "" })
        setCityModalOpen(true)
    }

    const openEditCity = (city: City) => {
        setSelectedCity(city)
        setCityForm({
            name: city.name,
            country_id: city.country_id.toString(),
            state: city.state || "",
            latitude: city.latitude?.toString() || "",
            longitude: city.longitude?.toString() || ""
        })
        setCityModalOpen(true)
    }

    const handleCitySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const method = selectedCity ? "PUT" : "POST"
        const url = selectedCity
            ? `/api/admin/geography/cities/${selectedCity.id}`
            : "/api/admin/geography/cities"

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...cityForm,
                    country_id: parseInt(cityForm.country_id),
                    latitude: cityForm.latitude ? parseFloat(cityForm.latitude) : null,
                    longitude: cityForm.longitude ? parseFloat(cityForm.longitude) : null
                }),
            })
            if (response.ok) {
                toast.success(selectedCity ? "Ciudad actualizada" : "Ciudad creada")
                setCityModalOpen(false)
                fetchData()
            } else {
                const data = await response.json()
                toast.error(data.error || "Error en la operación")
            }
        } catch (error) {
            toast.error("Error al procesar la ciudad")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteCity = async () => {
        if (!selectedCity) return
        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/admin/geography/cities/${selectedCity.id}`, {
                method: "DELETE"
            })
            if (response.ok) {
                toast.success("Ciudad eliminada")
                setDeleteCityAlertOpen(false)
                fetchData()
            } else {
                const data = await response.json()
                toast.error(data.error || "No se pudo eliminar la ciudad")
            }
        } catch (error) {
            toast.error("Error al eliminar ciudad")
        } finally {
            setIsSubmitting(false)
        }
    }

    // --- Detail View ---

    const handleViewDetail = (type: 'country' | 'city', data: any) => {
        setViewDetail({ type, data })
        setDetailModalOpen(true)
    }

    // --- Filters ---

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.iso2?.toLowerCase().includes(countrySearch.toLowerCase())
    )

    const filteredCities = cities.filter(c =>
        c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.state?.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.country_name?.toLowerCase().includes(citySearch.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-gray-500">Cargando datos geográficos...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Geografía</h1>
                    <p className="text-gray-600 mt-1">Administra los destinos y ubicaciones del catálogo</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={openCreateCountry} className="gap-2">
                        <Globe className="w-4 h-4" />
                        Nuevo País
                    </Button>
                    <Button onClick={openCreateCity} variant="outline" className="gap-2">
                        <MapPin className="w-4 h-4" />
                        Nueva Ciudad
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="countries">Países ({countries.length})</TabsTrigger>
                    <TabsTrigger value="cities">Ciudades ({cities.length})</TabsTrigger>
                </TabsList>

                {/* PAÍSES */}
                <TabsContent value="countries" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Países</CardTitle>
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar países..."
                                        value={countrySearch}
                                        onChange={(e) => setCountrySearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 border-b">
                                            <th className="h-10 px-4 text-left font-medium">Nombre</th>
                                            <th className="h-10 px-4 text-left font-medium">ISO2</th>
                                            <th className="h-10 px-4 text-right font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCountries.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="h-24 text-center">No se encontraron países.</td>
                                            </tr>
                                        ) : (
                                            filteredCountries.map((country) => (
                                                <tr key={country.id} className="border-b hover:bg-muted/30">
                                                    <td className="p-4 font-medium">{country.name}</td>
                                                    <td className="p-4">{country.iso2 || "-"}</td>
                                                    <td className="p-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleViewDetail('country', country)}>
                                                                    <Info className="mr-2 h-4 w-4" /> Ver detalle
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEditCountry(country)}>
                                                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => {
                                                                        setSelectedCountry(country)
                                                                        setDeleteCountryAlertOpen(true)
                                                                    }}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CIUDADES */}
                <TabsContent value="cities" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Ciudades</CardTitle>
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar ciudades..."
                                        value={citySearch}
                                        onChange={(e) => setCitySearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 border-b">
                                            <th className="h-10 px-4 text-left font-medium">Nombre</th>
                                            <th className="h-10 px-4 text-left font-medium">Estado/Provincia</th>
                                            <th className="h-10 px-4 text-left font-medium">País</th>
                                            <th className="h-10 px-4 text-right font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCities.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="h-24 text-center">No se encontraron ciudades.</td>
                                            </tr>
                                        ) : (
                                            filteredCities.map((city) => (
                                                <tr key={city.id} className="border-b hover:bg-muted/30">
                                                    <td className="p-4 font-medium">{city.name}</td>
                                                    <td className="p-4">{city.state || "-"}</td>
                                                    <td className="p-4">{city.country_name || city.country_id}</td>
                                                    <td className="p-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleViewDetail('city', city)}>
                                                                    <Info className="mr-2 h-4 w-4" /> Ver detalle
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEditCity(city)}>
                                                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => {
                                                                        setSelectedCity(city)
                                                                        setDeleteCityAlertOpen(true)
                                                                    }}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* --- Modals and Dialogs --- */}

            {/* Country Modal */}
            <Dialog open={countryModalOpen} onOpenChange={setCountryModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedCountry ? "Editar País" : "Nuevo País"}</DialogTitle>
                        <DialogDescription>Completa la información del país.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCountrySubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={countryForm.name}
                                onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })}
                                placeholder="Ej: México"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="iso2">Código ISO2</Label>
                            <Input
                                id="iso2"
                                value={countryForm.iso2}
                                onChange={(e) => setCountryForm({ ...countryForm, iso2: e.target.value.toUpperCase() })}
                                placeholder="Ej: MX"
                                maxLength={2}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCountryModalOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {selectedCountry ? "Guardar Cambios" : "Crear País"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* City Modal */}
            <Dialog open={cityModalOpen} onOpenChange={setCityModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{selectedCity ? "Editar Ciudad" : "Nueva Ciudad"}</DialogTitle>
                        <DialogDescription>Completa la información de la ciudad.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCitySubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cityName">Nombre *</Label>
                                <Input
                                    id="cityName"
                                    value={cityForm.name}
                                    onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                                    placeholder="Ej: Mérida"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">Estado/Provincia</Label>
                                <Input
                                    id="state"
                                    value={cityForm.state}
                                    onChange={(e) => setCityForm({ ...cityForm, state: e.target.value })}
                                    placeholder="Ej: Yucatán"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country_id">País *</Label>
                            <select
                                id="country_id"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={cityForm.country_id}
                                onChange={(e) => setCityForm({ ...cityForm, country_id: e.target.value })}
                                required
                            >
                                <option value="">Selecciona un país</option>
                                {countries.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lat">Latitud</Label>
                                <Input
                                    id="lat"
                                    type="number"
                                    step="any"
                                    value={cityForm.latitude}
                                    onChange={(e) => setCityForm({ ...cityForm, latitude: e.target.value })}
                                    placeholder="0.0000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lng">Longitud</Label>
                                <Input
                                    id="lng"
                                    type="number"
                                    step="any"
                                    value={cityForm.longitude}
                                    onChange={(e) => setCityForm({ ...cityForm, longitude: e.target.value })}
                                    placeholder="0.0000"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCityModalOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {selectedCity ? "Guardar Cambios" : "Crear Ciudad"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail Modal */}
            <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalle de {viewDetail?.type === 'country' ? 'País' : 'Ciudad'}</DialogTitle>
                    </DialogHeader>
                    {viewDetail && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <span className="text-muted-foreground">ID:</span>
                                <span className="font-medium">{viewDetail.data.id}</span>

                                <span className="text-muted-foreground">Nombre:</span>
                                <span className="font-medium">{viewDetail.data.name}</span>

                                {viewDetail.type === 'country' ? (
                                    <>
                                        <span className="text-muted-foreground">ISO2:</span>
                                        <span className="font-medium">{viewDetail.data.iso2 || "-"}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-muted-foreground">Estado:</span>
                                        <span className="font-medium">{viewDetail.data.state || "-"}</span>
                                        <span className="text-muted-foreground">País:</span>
                                        <span className="font-medium">{viewDetail.data.country_name || viewDetail.data.country_id}</span>
                                        <span className="text-muted-foreground">Latitud:</span>
                                        <span className="font-medium">{viewDetail.data.latitude || "-"}</span>
                                        <span className="text-muted-foreground">Longitud:</span>
                                        <span className="font-medium">{viewDetail.data.longitude || "-"}</span>
                                    </>
                                )}

                                <span className="text-muted-foreground">Creado el:</span>
                                <span className="font-medium">{new Date(viewDetail.data.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailModalOpen(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alerts */}
            <AlertDialog open={deleteCountryAlertOpen} onOpenChange={setDeleteCountryAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente el país <strong>{selectedCountry?.name}</strong>.
                            Solo se puede realizar si no tiene ciudades asociadas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCountry} className="bg-red-600 hover:bg-red-700">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteCityAlertOpen} onOpenChange={setDeleteCityAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente la ciudad <strong>{selectedCity?.name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCity} className="bg-red-600 hover:bg-red-700">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
