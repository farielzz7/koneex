"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Hotel as HotelIcon, Search, Edit, Trash2, Power, X, Check, Loader2, Star, FileDown, Mail, Globe, Info } from "lucide-react"
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
    id: number
    name: string
    type: string
    contact_email: string | null
    contact_phone: string | null
    website: string | null
    status: string
}

export default function HotelsPage() {
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modal states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        contact_email: "",
        contact_phone: "",
        website: "",
        status: "ACTIVE"
    })

    useEffect(() => {
        fetchHotels()
    }, [])

    const fetchHotels = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/admin/providers?type=HOTEL")
            if (response.ok) {
                const data = await response.json()
                setHotels(data)
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al cargar hoteles")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateClick = () => {
        setSelectedHotel(null)
        setFormData({
            name: "",
            contact_email: "",
            contact_phone: "",
            website: "",
            status: "ACTIVE"
        })
        setIsDialogOpen(true)
    }

    const handleEditClick = (hotel: Hotel) => {
        setSelectedHotel(hotel)
        setFormData({
            name: hotel.name,
            contact_email: hotel.contact_email || "",
            contact_phone: hotel.contact_phone || "",
            website: hotel.website || "",
            status: hotel.status
        })
        setIsDialogOpen(true)
    }

    const handleViewDetail = (hotel: Hotel) => {
        setSelectedHotel(hotel)
        setIsDetailOpen(true)
    }

    const handleDeleteClick = (hotel: Hotel) => {
        setSelectedHotel(hotel)
        setIsDeleteDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const url = selectedHotel
            ? `/api/admin/providers/${selectedHotel.id}`
            : "/api/admin/providers"

        const method = selectedHotel ? "PUT" : "POST"

        const payload = {
            ...formData,
            type: "HOTEL"
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success(selectedHotel ? "Hotel actualizado" : "Hotel creado")
                setIsDialogOpen(false)
                fetchHotels()
            } else {
                const error = await response.json()
                toast.error(error.error || "Error en la operación")
            }
        } catch (error) {
            toast.error("Error crítico")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedHotel) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/providers/${selectedHotel.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                toast.success("Hotel eliminado")
                setIsDeleteDialogOpen(false)
                fetchHotels()
            } else {
                toast.error("No se pudo eliminar el hotel")
            }
        } catch (error) {
            toast.error("Error al eliminar")
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredHotels = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Cargando hoteles...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hoteles</h1>
                    <p className="text-gray-600 mt-1">Gestiona los hoteles disponibles para paquetes</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportToCSV(hotels, 'hoteles')} className="gap-2">
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Button onClick={handleCreateClick} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo Hotel
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar hotel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b">
                    <CardTitle className="text-lg">Todos los Hoteles ({filteredHotels.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold border-b">
                                    <th className="text-left py-4 px-6">Información</th>
                                    <th className="text-left py-4 px-6">Contacto</th>
                                    <th className="text-left py-4 px-6">Estado</th>
                                    <th className="text-right py-4 px-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHotels.map((hotel) => (
                                    <tr key={hotel.id} className="border-b last:border-0 hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                    <HotelIcon className="w-5 h-5" />
                                                </div>
                                                <div className="font-semibold text-gray-900">{hotel.name}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-500">
                                                <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {hotel.contact_email || "-"}</div>
                                                <div className="flex items-center gap-1 mt-1"><Globe className="w-3 h-3" /> {hotel.website || "-"}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${hotel.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {hotel.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleViewDetail(hotel)}>
                                                    <Info className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleEditClick(hotel)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-full text-red-600 hover:text-red-700" onClick={() => handleDeleteClick(hotel)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredHotels.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-500">
                                            No se encontraron hoteles
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedHotel ? "Editar Hotel" : "Nuevo Hotel"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Hotel *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email de Contacto</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono de Contacto</Label>
                            <Input
                                id="phone"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Sitio Web</Label>
                            <Input
                                id="website"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <select
                                id="status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="ACTIVE">Activo</option>
                                <option value="INACTIVE">Inactivo</option>
                            </select>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                {selectedHotel ? "Guardar" : "Crear"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalle del Hotel</DialogTitle>
                    </DialogHeader>
                    {selectedHotel && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-y-3 text-sm border p-4 rounded-lg bg-gray-50/50">
                                <span className="text-muted-foreground">ID:</span>
                                <span className="font-semibold">{selectedHotel.id}</span>

                                <span className="text-muted-foreground">Nombre:</span>
                                <span className="font-semibold">{selectedHotel.name}</span>

                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-semibold">{selectedHotel.contact_email || "-"}</span>

                                <span className="text-muted-foreground">Teléfono:</span>
                                <span className="font-semibold">{selectedHotel.contact_phone || "-"}</span>

                                <span className="text-muted-foreground">Website:</span>
                                <span className="font-semibold truncate">
                                    {selectedHotel.website ? (
                                        <a href={selectedHotel.website} target="_blank" className="text-primary hover:underline">{selectedHotel.website}</a>
                                    ) : "-"}
                                </span>

                                <span className="text-muted-foreground">Estado:</span>
                                <span className={`font-semibold ${selectedHotel.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>{selectedHotel.status}</span>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> ¿Eliminar hotel?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar a <strong>{selectedHotel?.name}</strong>. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Sí, eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
