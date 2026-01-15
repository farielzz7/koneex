"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Hotel as HotelIcon, Search, Edit, Trash2, Power, X, Check, Loader2, Star, FileDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { exportToCSV } from "@/lib/export-csv"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Hotel {
    id: string
    name: string
    stars: number | null
    is_active: boolean
    city_id: string
    city?: {
        name: string
    }
    cities?: {
        name: string
    }
}

interface City {
    id: string
    name: string
}

export default function HotelsPage() {
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modal states
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: "",
        cityId: "",
        stars: "",
        isActive: true,
    })

    useEffect(() => {
        fetchHotels()
        fetchCities()
    }, [])

    const fetchHotels = async () => {
        try {
            const response = await fetch("/api/admin/hotels")
            if (response.ok) {
                const data = await response.json()
                setHotels(data)
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCities = async () => {
        try {
            const response = await fetch("/api/admin/geography/cities")
            if (response.ok) {
                const data = await response.json()
                setCities(data)
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    const handleEditClick = (hotel: Hotel) => {
        setSelectedHotel(hotel)
        setEditForm({
            name: hotel.name,
            cityId: hotel.city_id,
            stars: hotel.stars?.toString() || "",
            isActive: hotel.is_active,
        })
        setEditDialogOpen(true)
    }

    const handleDeleteClick = (hotel: Hotel) => {
        setSelectedHotel(hotel)
        setDeleteDialogOpen(true)
    }

    const handleToggleClick = (hotel: Hotel) => {
        setSelectedHotel(hotel)
        setToggleDialogOpen(true)
    }

    const handleEditSubmit = async () => {
        if (!selectedHotel) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/hotels/${selectedHotel.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editForm.name,
                    cityId: editForm.cityId,
                    stars: editForm.stars ? parseInt(editForm.stars) : null,
                    isActive: editForm.isActive,
                }),
            })

            if (!response.ok) throw new Error("Error al actualizar")

            toast.success("Hotel actualizado", {
                description: `"${editForm.name}" ha sido actualizado correctamente.`,
            })

            setEditDialogOpen(false)
            fetchHotels()
        } catch (err) {
            toast.error("Error", { description: "No se pudo actualizar el hotel." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedHotel) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/hotels/${selectedHotel.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Error al eliminar")

            toast.success("Hotel eliminado", {
                description: `"${selectedHotel.name}" ha sido eliminado.`,
            })

            setDeleteDialogOpen(false)
            fetchHotels()
        } catch (err) {
            toast.error("Error", { description: "No se pudo eliminar el hotel." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleToggleConfirm = async () => {
        if (!selectedHotel) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/hotels/${selectedHotel.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !selectedHotel.is_active }),
            })

            if (!response.ok) throw new Error("Error al cambiar estado")

            const newStatus = !selectedHotel.is_active ? "activado" : "desactivado"
            toast.success(`Hotel ${newStatus}`, {
                description: `"${selectedHotel.name}" ha sido ${newStatus}.`,
            })

            setToggleDialogOpen(false)
            fetchHotels()
        } catch (err) {
            toast.error("Error", { description: "No se pudo cambiar el estado." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredHotels = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-3 text-gray-600">Cargando...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Hoteles</h1>
                    <p className="text-gray-600 mt-1">Gestiona todos los hoteles</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => exportToCSV(hotels, 'hoteles')}
                        className="gap-2"
                        disabled={hotels.length === 0}
                    >
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Link href="/admin/hotels/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nuevo Hotel
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar hoteles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todos los Hoteles ({filteredHotels.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredHotels.length === 0 ? (
                        <div className="text-center py-12">
                            <HotelIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? "No se encontraron hoteles" : "No hay hoteles registrados"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Intenta con otro término" : "Comienza agregando hoteles"}
                            </p>
                            {!searchTerm && (
                                <Link href="/admin/hotels/new">
                                    <Button><Plus className="w-4 h-4 mr-2" />Agregar Hotel</Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Nombre</th>
                                        <th className="text-left py-3 px-4">Ciudad</th>
                                        <th className="text-left py-3 px-4">Estrellas</th>
                                        <th className="text-left py-3 px-4">Estado</th>
                                        <th className="text-right py-3 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHotels.map((hotel) => (
                                        <tr key={hotel.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{hotel.name}</td>
                                            <td className="py-3 px-4 text-gray-600">{hotel.city?.name || hotel.cities?.name || "—"}</td>
                                            <td className="py-3 px-4">
                                                {hotel.stars ? "⭐".repeat(hotel.stars) : "—"}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${hotel.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                                    {hotel.is_active ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" title="Editar" onClick={() => handleEditClick(hotel)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title={hotel.is_active ? "Desactivar" : "Activar"}
                                                        onClick={() => handleToggleClick(hotel)}
                                                        className={hotel.is_active ? "text-orange-600" : "text-green-600"}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" title="Eliminar" onClick={() => handleDeleteClick(hotel)} className="text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="w-5 h-5 text-primary" />
                            Editar Hotel
                        </DialogTitle>
                        <DialogDescription>Modifica los datos del hotel.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                placeholder="Nombre del hotel"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Select value={editForm.cityId} onValueChange={(value) => setEditForm({ ...editForm, cityId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una ciudad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stars">Estrellas</Label>
                            <Select value={editForm.stars} onValueChange={(value) => setEditForm({ ...editForm, stars: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona estrellas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">⭐ 1 estrella</SelectItem>
                                    <SelectItem value="2">⭐⭐ 2 estrellas</SelectItem>
                                    <SelectItem value="3">⭐⭐⭐ 3 estrellas</SelectItem>
                                    <SelectItem value="4">⭐⭐⭐⭐ 4 estrellas</SelectItem>
                                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 estrellas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isActive">Estado activo</Label>
                            <Switch id="isActive" checked={editForm.isActive} onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}><X className="w-4 h-4 mr-2" />Cancelar</Button>
                        <Button onClick={handleEditSubmit} disabled={isSubmitting || !editForm.name}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="w-5 h-5" />¿Eliminar hotel?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>Estás a punto de eliminar <strong>"{selectedHotel?.name}"</strong>.</p>
                            <p className="text-red-600 font-medium">⚠️ Esta acción no se puede deshacer.</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Toggle Dialog */}
            <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Power className={`w-5 h-5 ${selectedHotel?.is_active ? "text-orange-600" : "text-green-600"}`} />
                            {selectedHotel?.is_active ? "¿Desactivar hotel?" : "¿Activar hotel?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedHotel?.is_active
                                ? `"${selectedHotel?.name}" dejará de estar disponible.`
                                : `"${selectedHotel?.name}" estará disponible.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleConfirm}
                            disabled={isSubmitting}
                            className={selectedHotel?.is_active ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Power className="w-4 h-4 mr-2" />}
                            {selectedHotel?.is_active ? "Desactivar" : "Activar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
