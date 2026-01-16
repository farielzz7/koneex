"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit, Trash2, X, Check, Loader2, FileDown, Mail, Globe, Info, Building2, Phone, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { exportToCSV } from "@/lib/export-csv"
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

interface Provider {
    id: number
    name: string
    type: string
    contact_email: string | null
    contact_phone: string | null
    website: string | null
    status: string
    integration_mode: string
    base_url: string | null
    api_key_hint: string | null
}

export default function ProvidersPage() {
    const [providers, setProviders] = useState<Provider[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("ALL")

    // Modal states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        type: "WHOLESALER",
        contact_email: "",
        contact_phone: "",
        website: "",
        integration_mode: "MANUAL",
        base_url: "",
        api_key_hint: "",
        status: "ACTIVE"
    })

    useEffect(() => {
        fetchProviders()
    }, [])

    const fetchProviders = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/admin/providers")
            if (response.ok) {
                const data = await response.json()
                setProviders(data)
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al cargar proveedores")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateClick = () => {
        setSelectedProvider(null)
        setFormData({
            name: "",
            type: "WHOLESALER",
            contact_email: "",
            contact_phone: "",
            website: "",
            integration_mode: "MANUAL",
            base_url: "",
            api_key_hint: "",
            status: "ACTIVE"
        })
        setIsDialogOpen(true)
    }

    const handleEditClick = (provider: Provider) => {
        setSelectedProvider(provider)
        setFormData({
            name: provider.name,
            type: provider.type,
            contact_email: provider.contact_email || "",
            contact_phone: provider.contact_phone || "",
            website: provider.website || "",
            integration_mode: provider.integration_mode,
            base_url: provider.base_url || "",
            api_key_hint: provider.api_key_hint || "",
            status: provider.status
        })
        setIsDialogOpen(true)
    }

    const handleViewDetail = (provider: Provider) => {
        setSelectedProvider(provider)
        setIsDetailOpen(true)
    }

    const handleDeleteClick = (provider: Provider) => {
        setSelectedProvider(provider)
        setIsDeleteDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const url = selectedProvider
            ? `/api/admin/providers/${selectedProvider.id}`
            : "/api/admin/providers"

        const method = selectedProvider ? "PUT" : "POST"

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                toast.success(selectedProvider ? "Proveedor actualizado" : "Proveedor creado")
                setIsDialogOpen(false)
                fetchProviders()
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
        if (!selectedProvider) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/providers/${selectedProvider.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                toast.success("Proveedor eliminado")
                setIsDeleteDialogOpen(false)
                fetchProviders()
            } else {
                toast.error("No se pudo eliminar el proveedor")
            }
        } catch (error) {
            toast.error("Error al eliminar")
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredProviders = providers.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === "ALL" || p.type === typeFilter
        return matchesSearch && matchesType
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Cargando proveedores...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
                    <p className="text-gray-600 mt-1">Gestiona Mayoristas, Operadores y otros servicios</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportToCSV(providers, 'proveedores')} className="gap-2">
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Button onClick={handleCreateClick} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo Proveedor
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Buscar proveedor por nombre o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11"
                            />
                        </div>
                        <div>
                            <select
                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="ALL">Todos los tipos</option>
                                <option value="WHOLESALER">Mayorista</option>
                                <option value="OPERATOR">Operador</option>
                                <option value="HOTEL">Hotel</option>
                                <option value="AIRLINE">Aerolínea</option>
                                <option value="OTHER">Otro</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b">
                    <CardTitle className="text-lg">Listado de Proveedores ({filteredProviders.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold border-b">
                                    <th className="text-left py-4 px-6">Proveedor</th>
                                    <th className="text-left py-4 px-6">Tipo</th>
                                    <th className="text-left py-4 px-6">Integración</th>
                                    <th className="text-left py-4 px-6">Estado</th>
                                    <th className="text-right py-4 px-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProviders.map((p) => (
                                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{p.name}</div>
                                                    <div className="text-xs text-gray-500">{p.contact_email || "Sin email"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold uppercase">
                                                {p.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600">
                                                {p.integration_mode}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleViewDetail(p)}>
                                                    <Info className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleEditClick(p)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-full text-red-600 hover:text-red-700" onClick={() => handleDeleteClick(p)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProviders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-500">
                                            No se encontraron proveedores
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
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedProvider ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Comercial *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Proveedor *</Label>
                                <select
                                    id="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="WHOLESALER">Mayorista</option>
                                    <option value="OPERATOR">Operador</option>
                                    <option value="HOTEL">Hotel</option>
                                    <option value="AIRLINE">Aerolínea</option>
                                    <option value="OTHER">Otro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Contacto</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="website">Sitio Web / URL Portal</Label>
                                <Input
                                    id="website"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mode">Modo Integración</Label>
                                <select
                                    id="mode"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.integration_mode}
                                    onChange={(e) => setFormData({ ...formData, integration_mode: e.target.value })}
                                >
                                    <option value="MANUAL">Manual</option>
                                    <option value="CSV">CSV / Excel</option>
                                    <option value="API">API Conexión</option>
                                </select>
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
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="base_url">Base URL API (Opcional)</Label>
                                <Input
                                    id="base_url"
                                    value={formData.base_url}
                                    onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="key_hint">API Key Hint (Opcional)</Label>
                                <Input
                                    id="key_hint"
                                    value={formData.api_key_hint}
                                    onChange={(e) => setFormData({ ...formData, api_key_hint: e.target.value })}
                                    placeholder="E.g. X-API-KEY"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                {selectedProvider ? "Guardar Cambios" : "Crear Proveedor"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Ficha del Proveedor</DialogTitle>
                    </DialogHeader>
                    {selectedProvider && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                                    {selectedProvider.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedProvider.name}</h3>
                                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded uppercase">{selectedProvider.type}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/30">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-xs text-gray-500">Email Contacto</div>
                                        <div className="text-sm font-medium">{selectedProvider.contact_email || "No registrado"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/30">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-xs text-gray-500">Teléfono</div>
                                        <div className="text-sm font-medium">{selectedProvider.contact_phone || "No registrado"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/30">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-xs text-gray-500">Sitio Web</div>
                                        <div className="text-sm font-medium">
                                            {selectedProvider.website ? (
                                                <a href={selectedProvider.website} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                                                    {selectedProvider.website} <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : "No registrado"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Integración Técnica</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-500">Modo</div>
                                        <div className="font-medium">{selectedProvider.integration_mode}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Estado</div>
                                        <div className={`font-medium ${selectedProvider.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedProvider.status}
                                        </div>
                                    </div>
                                    {selectedProvider.base_url && (
                                        <div className="col-span-2">
                                            <div className="text-gray-500">Base URL</div>
                                            <div className="font-mono text-xs p-2 bg-gray-100 rounded mt-1 break-all">{selectedProvider.base_url}</div>
                                        </div>
                                    )}
                                </div>
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
                            <Trash2 className="w-5 h-5" /> ¿Eliminar proveedor?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar a <strong>{selectedProvider?.name}</strong>.
                            <br /><br />
                            ⚠️ <span className="font-semibold text-red-600">Atención:</span> Esto puede fallar si existen paquetes vinculados a este proveedor.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Sí, eliminar definitivamente"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
