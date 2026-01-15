"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Plane, Search, Edit, Trash2, Power, X, Check, Loader2, FileDown } from "lucide-react"
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
import { toast } from "sonner"

interface Airline {
    id: string
    name: string
    iata_code: string | null
    is_active: boolean
}

export default function AirlinesPage() {
    const [airlines, setAirlines] = useState<Airline[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modal states
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
    const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: "",
        iataCode: "",
        isActive: true,
    })

    useEffect(() => {
        fetchAirlines()
    }, [])

    const fetchAirlines = async () => {
        try {
            const response = await fetch("/api/admin/airlines")
            if (response.ok) {
                const data = await response.json()
                setAirlines(data)
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (airline: Airline) => {
        setSelectedAirline(airline)
        setEditForm({
            name: airline.name,
            iataCode: airline.iata_code || "",
            isActive: airline.is_active,
        })
        setEditDialogOpen(true)
    }

    const handleDeleteClick = (airline: Airline) => {
        setSelectedAirline(airline)
        setDeleteDialogOpen(true)
    }

    const handleToggleClick = (airline: Airline) => {
        setSelectedAirline(airline)
        setToggleDialogOpen(true)
    }

    const handleEditSubmit = async () => {
        if (!selectedAirline) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/airlines/${selectedAirline.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editForm.name,
                    iataCode: editForm.iataCode || null,
                    isActive: editForm.isActive,
                }),
            })

            if (!response.ok) throw new Error("Error al actualizar")

            toast.success("Aerolínea actualizada", {
                description: `"${editForm.name}" ha sido actualizada correctamente.`,
            })

            setEditDialogOpen(false)
            fetchAirlines()
        } catch (err) {
            toast.error("Error", { description: "No se pudo actualizar la aerolínea." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedAirline) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/airlines/${selectedAirline.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Error al eliminar")

            toast.success("Aerolínea eliminada", {
                description: `"${selectedAirline.name}" ha sido eliminada.`,
            })

            setDeleteDialogOpen(false)
            fetchAirlines()
        } catch (err) {
            toast.error("Error", { description: "No se pudo eliminar la aerolínea." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleToggleConfirm = async () => {
        if (!selectedAirline) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/airlines/${selectedAirline.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !selectedAirline.is_active }),
            })

            if (!response.ok) throw new Error("Error al cambiar estado")

            const newStatus = !selectedAirline.is_active ? "activada" : "desactivada"
            toast.success(`Aerolínea ${newStatus}`, {
                description: `"${selectedAirline.name}" ha sido ${newStatus}.`,
            })

            setToggleDialogOpen(false)
            fetchAirlines()
        } catch (err) {
            toast.error("Error", { description: "No se pudo cambiar el estado." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredAirlines = airlines.filter((airline) =>
        airline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airline.iata_code?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-3xl font-bold">Aerolíneas</h1>
                    <p className="text-gray-600 mt-1">Gestiona todas las aerolíneas</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => exportToCSV(airlines, 'aerolineas')}
                        className="gap-2"
                        disabled={airlines.length === 0}
                    >
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Link href="/admin/airlines/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nueva Aerolínea
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar aerolíneas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todas las Aerolíneas ({filteredAirlines.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredAirlines.length === 0 ? (
                        <div className="text-center py-12">
                            <Plane className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? "No se encontraron aerolíneas" : "No hay aerolíneas registradas"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Intenta con otro término" : "Agrega aerolíneas para tus paquetes de viaje"}
                            </p>
                            {!searchTerm && (
                                <Link href="/admin/airlines/new">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar Aerolínea
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Nombre</th>
                                        <th className="text-left py-3 px-4">Código IATA</th>
                                        <th className="text-left py-3 px-4">Estado</th>
                                        <th className="text-right py-3 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAirlines.map((airline) => (
                                        <tr key={airline.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{airline.name}</td>
                                            <td className="py-3 px-4">
                                                {airline.iata_code ? (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-sm">
                                                        {airline.iata_code}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${airline.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {airline.is_active ? "Activa" : "Inactiva"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" title="Editar" onClick={() => handleEditClick(airline)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title={airline.is_active ? "Desactivar" : "Activar"}
                                                        onClick={() => handleToggleClick(airline)}
                                                        className={airline.is_active ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Eliminar"
                                                        onClick={() => handleDeleteClick(airline)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
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
                            Editar Aerolínea
                        </DialogTitle>
                        <DialogDescription>
                            Modifica los datos de la aerolínea.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                placeholder="Nombre de la aerolínea"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="iataCode">Código IATA</Label>
                            <Input
                                id="iataCode"
                                value={editForm.iataCode}
                                onChange={(e) => setEditForm({ ...editForm, iataCode: e.target.value.toUpperCase() })}
                                placeholder="Ej: AA, AM, VB"
                                maxLength={3}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isActive">Estado activo</Label>
                            <Switch
                                id="isActive"
                                checked={editForm.isActive}
                                onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
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
                            <Trash2 className="w-5 h-5" />
                            ¿Eliminar aerolínea?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>Estás a punto de eliminar <strong>"{selectedAirline?.name}"</strong>.</p>
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
                            <Power className={`w-5 h-5 ${selectedAirline?.is_active ? "text-orange-600" : "text-green-600"}`} />
                            {selectedAirline?.is_active ? "¿Desactivar aerolínea?" : "¿Activar aerolínea?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedAirline?.is_active
                                ? `"${selectedAirline?.name}" dejará de estar disponible.`
                                : `"${selectedAirline?.name}" estará disponible.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleConfirm}
                            disabled={isSubmitting}
                            className={selectedAirline?.is_active ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Power className="w-4 h-4 mr-2" />}
                            {selectedAirline?.is_active ? "Desactivar" : "Activar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
