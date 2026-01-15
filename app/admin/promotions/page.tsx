"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Tag, Search, Edit, Trash2, Power, X, Check, Loader2, FileDown } from "lucide-react"
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

interface Promotion {
    id: string
    code: string | null
    name: string
    type: "PERCENTAGE" | "FIXED" | "BUNDLE"
    value: number
    is_active: boolean
    starts_at: string | null
    ends_at: string | null
    max_uses: number | null
    current_uses: number
    currency_id: string | null
    currency?: { code: string } | null
    currencies?: { code: string } | null
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modal states
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit form state
    const [editForm, setEditForm] = useState({
        code: "",
        name: "",
        type: "PERCENTAGE" as "PERCENTAGE" | "FIXED" | "BUNDLE",
        value: "",
        maxUses: "",
        isActive: false,
    })

    useEffect(() => {
        fetchPromotions()
    }, [])

    const fetchPromotions = async () => {
        try {
            const response = await fetch("/api/admin/promotions")
            if (response.ok) {
                const data = await response.json()
                setPromotions(data)
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (promo: Promotion) => {
        setSelectedPromotion(promo)
        setEditForm({
            code: promo.code || "",
            name: promo.name,
            type: promo.type,
            value: promo.value.toString(),
            maxUses: promo.max_uses?.toString() || "",
            isActive: promo.is_active,
        })
        setEditDialogOpen(true)
    }

    const handleDeleteClick = (promo: Promotion) => {
        setSelectedPromotion(promo)
        setDeleteDialogOpen(true)
    }

    const handleToggleClick = (promo: Promotion) => {
        setSelectedPromotion(promo)
        setToggleDialogOpen(true)
    }

    const handleEditSubmit = async () => {
        if (!selectedPromotion) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/promotions/${selectedPromotion.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: editForm.code || null,
                    name: editForm.name,
                    type: editForm.type,
                    value: parseFloat(editForm.value),
                    maxUses: editForm.maxUses ? parseInt(editForm.maxUses) : null,
                    isActive: editForm.isActive,
                    currencyId: selectedPromotion.currency_id,
                    startsAt: selectedPromotion.starts_at,
                    endsAt: selectedPromotion.ends_at,
                }),
            })

            if (!response.ok) throw new Error("Error al actualizar")

            toast.success("Promoción actualizada", {
                description: `"${editForm.name}" ha sido actualizada correctamente.`,
            })

            setEditDialogOpen(false)
            fetchPromotions()
        } catch (err) {
            toast.error("Error", { description: "No se pudo actualizar la promoción." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedPromotion) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/promotions/${selectedPromotion.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Error al eliminar")

            toast.success("Promoción eliminada", {
                description: `"${selectedPromotion.name}" ha sido eliminada.`,
            })

            setDeleteDialogOpen(false)
            fetchPromotions()
        } catch (err) {
            toast.error("Error", { description: "No se pudo eliminar la promoción." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleToggleConfirm = async () => {
        if (!selectedPromotion) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/promotions/${selectedPromotion.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !selectedPromotion.is_active }),
            })

            if (!response.ok) throw new Error("Error al cambiar estado")

            const newStatus = !selectedPromotion.is_active ? "activada" : "desactivada"
            toast.success(`Promoción ${newStatus}`, {
                description: `"${selectedPromotion.name}" ha sido ${newStatus}.`,
            })

            setToggleDialogOpen(false)
            fetchPromotions()
        } catch (err) {
            toast.error("Error", { description: "No se pudo cambiar el estado." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredPromotions = promotions.filter((promo) =>
        promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const isExpired = (endsAt: string | null) => {
        if (!endsAt) return false
        return new Date(endsAt) < new Date()
    }

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
                    <h1 className="text-3xl font-bold">Promociones</h1>
                    <p className="text-gray-600 mt-1">Gestiona códigos promocionales y descuentos</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => exportToCSV(promotions, 'promociones')}
                        className="gap-2"
                        disabled={promotions.length === 0}
                    >
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Link href="/admin/promotions/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nueva Promoción
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar promociones por nombre o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todas las Promociones ({filteredPromotions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredPromotions.length === 0 ? (
                        <div className="text-center py-12">
                            <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? "No se encontraron promociones" : "No hay promociones"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Intenta con otro término" : "Crea promociones para aumentar tus ventas"}
                            </p>
                            {!searchTerm && (
                                <Link href="/admin/promotions/new">
                                    <Button><Plus className="w-4 h-4 mr-2" />Crear Promoción</Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Código</th>
                                        <th className="text-left py-3 px-4">Nombre</th>
                                        <th className="text-left py-3 px-4">Descuento</th>
                                        <th className="text-left py-3 px-4">Usos</th>
                                        <th className="text-left py-3 px-4">Vigencia</th>
                                        <th className="text-left py-3 px-4">Estado</th>
                                        <th className="text-right py-3 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPromotions.map((promo) => (
                                        <tr key={promo.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                {promo.code ? (
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-mono text-sm font-bold">
                                                        {promo.code}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Sin código</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-medium">{promo.name}</td>
                                            <td className="py-3 px-4">
                                                <span className="font-semibold text-green-600">
                                                    {promo.type === "PERCENTAGE"
                                                        ? `${promo.value}%`
                                                        : `${promo.currency?.code || promo.currencies?.code || ''} $${promo.value}`
                                                    }
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm">
                                                    {promo.current_uses} / {promo.max_uses || '∞'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {promo.ends_at ? (
                                                    <span className={isExpired(promo.ends_at) ? "text-red-600" : "text-gray-600"}>
                                                        {isExpired(promo.ends_at) ? "⚠️ Expirada" : `Hasta ${new Date(promo.ends_at).toLocaleDateString()}`}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Sin límite</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${promo.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                                    {promo.is_active ? "Activa" : "Inactiva"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" title="Editar" onClick={() => handleEditClick(promo)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title={promo.is_active ? "Desactivar" : "Activar"}
                                                        onClick={() => handleToggleClick(promo)}
                                                        className={promo.is_active ? "text-orange-600" : "text-green-600"}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" title="Eliminar" onClick={() => handleDeleteClick(promo)} className="text-red-600">
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
                            Editar Promoción
                        </DialogTitle>
                        <DialogDescription>Modifica los datos de la promoción.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Código</Label>
                                <Input
                                    id="code"
                                    value={editForm.code}
                                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                                    placeholder="Ej: VERANO20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo</Label>
                                <Select value={editForm.type} onValueChange={(value: "PERCENTAGE" | "FIXED" | "BUNDLE") => setEditForm({ ...editForm, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERCENTAGE">Porcentaje (%)</SelectItem>
                                        <SelectItem value="FIXED">Monto fijo ($)</SelectItem>
                                        <SelectItem value="BUNDLE">Paquete</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                placeholder="Nombre de la promoción"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="value">Valor</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    value={editForm.value}
                                    onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                    placeholder={editForm.type === "PERCENTAGE" ? "10" : "100"}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxUses">Usos máximos</Label>
                                <Input
                                    id="maxUses"
                                    type="number"
                                    value={editForm.maxUses}
                                    onChange={(e) => setEditForm({ ...editForm, maxUses: e.target.value })}
                                    placeholder="Sin límite"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isActive">Estado activo</Label>
                            <Switch id="isActive" checked={editForm.isActive} onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}><X className="w-4 h-4 mr-2" />Cancelar</Button>
                        <Button onClick={handleEditSubmit} disabled={isSubmitting || !editForm.name || !editForm.value}>
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
                            <Trash2 className="w-5 h-5" />¿Eliminar promoción?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>Estás a punto de eliminar <strong>"{selectedPromotion?.name}"</strong>.</p>
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
                            <Power className={`w-5 h-5 ${selectedPromotion?.is_active ? "text-orange-600" : "text-green-600"}`} />
                            {selectedPromotion?.is_active ? "¿Desactivar promoción?" : "¿Activar promoción?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedPromotion?.is_active
                                ? `La promoción "${selectedPromotion?.name}" dejará de estar disponible para los clientes.`
                                : `La promoción "${selectedPromotion?.name}" estará disponible para los clientes.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleConfirm}
                            disabled={isSubmitting}
                            className={selectedPromotion?.is_active ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Power className="w-4 h-4 mr-2" />}
                            {selectedPromotion?.is_active ? "Desactivar" : "Activar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
