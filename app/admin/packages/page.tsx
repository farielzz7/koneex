"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit, Trash2, Power, Package, X, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { exportToCSV } from "@/lib/export-csv"
import { FileDown } from "lucide-react"

interface PackageData {
    id: number
    title: string
    subtitle: string | null
    description: string | null
    product_type: string
    status: 'DRAFT' | 'PUBLISHED' | 'PAUSED'
    created_at: string
    _count?: {
        departures: number
    }
}

export default function PackagesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [packages, setPackages] = useState<PackageData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Modal states
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit form state
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        status: "DRAFT" as 'DRAFT' | 'PUBLISHED' | 'PAUSED',
    })

    useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/admin/packages")
            if (!response.ok) throw new Error("Error al cargar paquetes")
            const data = await response.json()
            setPackages(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido")
        } finally {
            setLoading(false)
        }
    }

    // Open edit dialog
    const handleEditClick = (pkg: PackageData) => {
        setSelectedPackage(pkg)
        setEditForm({
            title: pkg.title,
            description: pkg.description || "",
            status: pkg.status,
        })
        setEditDialogOpen(true)
    }

    // Open delete dialog
    const handleDeleteClick = (pkg: PackageData) => {
        setSelectedPackage(pkg)
        setDeleteDialogOpen(true)
    }

    // Open toggle dialog
    const handleToggleClick = (pkg: PackageData) => {
        setSelectedPackage(pkg)
        setToggleDialogOpen(true)
    }

    // Submit edit
    const handleEditSubmit = async () => {
        if (!selectedPackage) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/packages/${selectedPackage.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editForm.title,
                    description: editForm.description || null,
                    status: editForm.status,
                }),
            })

            if (!response.ok) throw new Error("Error al actualizar")

            toast.success("Paquete actualizado", {
                description: `"${editForm.title}" ha sido actualizado correctamente.`,
            })

            setEditDialogOpen(false)
            fetchPackages()
        } catch (err) {
            toast.error("Error", {
                description: "No se pudo actualizar el paquete.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Submit delete
    const handleDeleteConfirm = async () => {
        if (!selectedPackage) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/packages/${selectedPackage.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Error al eliminar")

            toast.success("Paquete eliminado", {
                description: `"${selectedPackage.title}" ha sido eliminado.`,
            })

            setDeleteDialogOpen(false)
            fetchPackages()
        } catch (err) {
            toast.error("Error", {
                description: "No se pudo eliminar el paquete. Puede tener salidas asociadas.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Submit toggle status
    const handleToggleConfirm = async () => {
        if (!selectedPackage) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/packages/${selectedPackage.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: selectedPackage.status === 'PUBLISHED' ? 'PAUSED' : 'PUBLISHED',
                }),
            })

            if (!response.ok) throw new Error("Error al cambiar estado")

            const newStatus = selectedPackage.status === 'PUBLISHED' ? "pausado" : "publicado"
            toast.success(`Paquete ${newStatus}`, {
                description: `"${selectedPackage.title}" ha sido ${newStatus}.`,
            })

            setToggleDialogOpen(false)
            fetchPackages()
        } catch (err) {
            toast.error("Error", {
                description: "No se pudo cambiar el estado del paquete.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredPackages = packages.filter((pkg) =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-3 text-gray-600">Cargando paquetes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Paquetes</h1>
                    <p className="text-gray-600 mt-1">Gestiona todos los paquetes de viaje</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => exportToCSV(packages, 'paquetes')}
                        className="gap-2"
                        disabled={packages.length === 0}
                    >
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Link href="/admin/packages/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nuevo Paquete
                        </Button>
                    </Link>
                </div>
            </div>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-red-800">⚠️ {error}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar paquetes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todos los Paquetes ({filteredPackages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredPackages.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? "No se encontraron paquetes" : "No hay paquetes"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? "Intenta con otro término de búsqueda"
                                    : "Comienza creando tu primer paquete de viaje"}
                            </p>
                            {!searchTerm && (
                                <Link href="/admin/packages/new">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Primer Paquete
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Título</th>
                                        <th className="text-left py-3 px-4">Tipo</th>
                                        <th className="text-left py-3 px-4">Estado</th>
                                        <th className="text-left py-3 px-4">Salidas</th>
                                        <th className="text-right py-3 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPackages.map((pkg) => (
                                        <tr key={pkg.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">
                                                <div>{pkg.title}</div>
                                                <div className="text-xs text-gray-500 font-normal">{pkg.subtitle}</div>
                                            </td>
                                            <td className="py-3 px-4 text-xs font-semibold">{pkg.product_type}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${pkg.status === 'PUBLISHED'
                                                        ? "bg-green-100 text-green-800"
                                                        : pkg.status === 'DRAFT'
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {pkg.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{pkg._count?.departures || 0}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/admin/packages/${pkg.id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            title="Editar Completo"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title={pkg.status === 'PUBLISHED' ? "Pausar" : "Publicar"}
                                                        onClick={() => handleToggleClick(pkg)}
                                                        className={pkg.status === 'PUBLISHED' ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Eliminar"
                                                        onClick={() => handleDeleteClick(pkg)}
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="w-5 h-5 text-primary" />
                            Editar Paquete
                        </DialogTitle>
                        <DialogDescription>
                            Modifica los datos del paquete. Los cambios se guardarán inmediatamente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                placeholder="Nombre del paquete"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                placeholder="Descripción del paquete"
                                rows={3}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Estado del Catálogo</Label>
                            <div className="flex gap-2">
                                {['DRAFT', 'PUBLISHED', 'PAUSED'].map((s) => (
                                    <Button
                                        key={s}
                                        variant={editForm.status === s ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setEditForm({ ...editForm, status: s as any })}
                                        className="text-xs"
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button onClick={handleEditSubmit} disabled={isSubmitting || !editForm.title}>
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4 mr-2" />
                            )}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="w-5 h-5" />
                            ¿Eliminar paquete?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>
                                Estás a punto de eliminar el paquete <strong>"{selectedPackage?.title}"</strong>.
                            </p>
                            <p className="text-red-600 font-medium">
                                ⚠️ Esta acción no se puede deshacer.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4 mr-2" />
                            )}
                            Sí, Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Toggle Status Dialog */}
            <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Power className={`w-5 h-5 ${selectedPackage?.status === 'PUBLISHED' ? "text-orange-600" : "text-green-600"}`} />
                            {selectedPackage?.status === 'PUBLISHED' ? "¿Desactivar paquete?" : "¿Activar paquete?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedPackage?.status === 'PUBLISHED' ? (
                                <p>
                                    El paquete <strong>"{selectedPackage?.title}"</strong> dejará de estar disponible para los clientes.
                                </p>
                            ) : (
                                <p>
                                    El paquete <strong>"{selectedPackage?.title}"</strong> estará disponible para los clientes.
                                </p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleConfirm}
                            disabled={isSubmitting}
                            className={selectedPackage?.status === 'PUBLISHED' ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Power className="w-4 h-4 mr-2" />
                            )}
                            {selectedPackage?.status === 'PUBLISHED' ? "Desactivar" : "Activar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
