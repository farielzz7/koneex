"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Building2,
    Mail,
    Phone,
    Globe,
    Loader2,
    X,
    Check,
    Info,
    MapPin,
    MoreHorizontal
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface Agency {
    id: number
    name: string
    legal_name: string | null
    rfc: string | null
    email: string | null
    phone: string | null
    website: string | null
    address_line1: string | null
    city_id: number | null
    city_name?: string
    country_name?: string
    status: string
    pricing_model: string
    user_count: number
    created_at: string
}

interface City {
    id: number
    name: string
    country_name?: string
}

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<Agency[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modal states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        legal_name: "",
        rfc: "",
        email: "",
        phone: "",
        website: "",
        address_line1: "",
        city_id: "null",
        pricing_model: "PUBLIC_ONLY",
        status: "ACTIVE"
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [agenciesRes, citiesRes] = await Promise.all([
                fetch("/api/admin/agencies"),
                fetch("/api/admin/geography/cities")
            ])
            const agenciesData = await agenciesRes.json()
            const citiesData = await citiesRes.json()
            setAgencies(agenciesData)
            setCities(citiesData)
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al cargar datos")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateClick = () => {
        setSelectedAgency(null)
        setFormData({
            name: "",
            legal_name: "",
            rfc: "",
            email: "",
            phone: "",
            website: "",
            address_line1: "",
            city_id: "null",
            pricing_model: "PUBLIC_ONLY",
            status: "ACTIVE"
        })
        setIsDialogOpen(true)
    }

    const handleEditClick = (agency: Agency) => {
        setSelectedAgency(agency)
        setFormData({
            name: agency.name,
            legal_name: agency.legal_name || "",
            rfc: agency.rfc || "",
            email: agency.email || "",
            phone: agency.phone || "",
            website: agency.website || "",
            address_line1: agency.address_line1 || "",
            city_id: agency.city_id?.toString() || "null",
            pricing_model: agency.pricing_model,
            status: agency.status
        })
        setIsDialogOpen(true)
    }

    const handleViewDetail = (agency: Agency) => {
        setSelectedAgency(agency)
        setIsDetailOpen(true)
    }

    const handleDeleteClick = (agency: Agency) => {
        setSelectedAgency(agency)
        setIsDeleteDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const url = selectedAgency
            ? `/api/admin/agencies/${selectedAgency.id}`
            : "/api/admin/agencies"

        const method = selectedAgency ? "PUT" : "POST"

        const payload = {
            ...formData,
            city_id: formData.city_id === "null" ? null : parseInt(formData.city_id)
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success(selectedAgency ? "Agencia actualizada" : "Agencia creada")
                setIsDialogOpen(false)
                fetchData()
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
        if (!selectedAgency) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/agencies/${selectedAgency.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                toast.success("Agencia eliminada")
                setIsDeleteDialogOpen(false)
                fetchData()
            } else {
                const data = await response.json()
                toast.error(data.error || "No se pudo eliminar la agencia")
            }
        } catch (error) {
            toast.error("Error al eliminar")
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredAgencies = agencies.filter((agency) =>
        agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agency.email && agency.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Cargando agencias...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agencias</h1>
                    <p className="text-gray-600 mt-1">Administra las agencias afiliadas y sus configuraciones</p>
                </div>
                <Button onClick={handleCreateClick} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Agencia
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b">
                    <CardTitle className="text-lg">Todas las Agencias ({filteredAgencies.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold border-b">
                                    <th className="text-left py-4 px-6">Agencia</th>
                                    <th className="text-left py-4 px-6">Ubicación</th>
                                    <th className="text-left py-4 px-6">Usuarios</th>
                                    <th className="text-left py-4 px-6">Estado</th>
                                    <th className="text-right py-4 px-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAgencies.map((agency) => (
                                    <tr key={agency.id} className="border-b last:border-0 hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{agency.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {agency.email || "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-600 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {agency.city_name ? `${agency.city_name}, ${agency.country_name}` : "-"}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-medium">{agency.user_count}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${agency.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {agency.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleViewDetail(agency)}>
                                                        <Info className="mr-2 h-4 w-4" /> Ver detalle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(agency)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDeleteClick(agency)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAgencies.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                            <p className="text-gray-500">No se encontraron agencias</p>
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
                <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedAgency ? "Editar Agencia" : "Nueva Agencia"}
                        </DialogTitle>
                        <DialogDescription>
                            Completa los datos de la agencia.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Comercial *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nombre de la agencia"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="legal_name">Razón Social</Label>
                                <Input
                                    id="legal_name"
                                    value={formData.legal_name}
                                    onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                                    placeholder="Nombre legal"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rfc">RFC</Label>
                                <Input
                                    id="rfc"
                                    value={formData.rfc}
                                    onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                                    placeholder="ABCD123456..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email de Contacto</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contacto@agencia.com"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="999..."
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input
                                id="address"
                                value={formData.address_line1}
                                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                                placeholder="Calle, número, colonia..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city_id">Ubicación (Ciudad)</Label>
                                <select
                                    id="city_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.city_id}
                                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                >
                                    <option value="null">Selecciona una ciudad</option>
                                    {cities.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.country_name})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pricing">Modelo de Precios</Label>
                                <select
                                    id="pricing"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.pricing_model}
                                    onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value })}
                                >
                                    <option value="PUBLIC_ONLY">Solo Público</option>
                                    <option value="NET_WITH_COMMISSION">Neto con Comisión</option>
                                    <option value="MARGIN_MARKUP">Margen/Marcado</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                <X className="w-4 h-4 mr-2" /> Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                {selectedAgency ? "Guardar Cambios" : "Crear Agencia"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detalle de la Agencia</DialogTitle>
                    </DialogHeader>
                    {selectedAgency && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedAgency.name}</h2>
                                    <p className="text-sm text-muted-foreground">{selectedAgency.legal_name || "Sin razón social"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-muted-foreground">ID:</p>
                                        <p className="font-semibold">{selectedAgency.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">RFC:</p>
                                        <p className="font-semibold">{selectedAgency.rfc || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Email:</p>
                                        <p className="font-semibold">{selectedAgency.email || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Teléfono:</p>
                                        <p className="font-semibold">{selectedAgency.phone || "-"}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-muted-foreground">Estado:</p>
                                        <p className={`font-semibold ${selectedAgency.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedAgency.status}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Modelo Precios:</p>
                                        <p className="font-semibold">{selectedAgency.pricing_model}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Ubicación:</p>
                                        <p className="font-semibold">{selectedAgency.city_name || "-"}, {selectedAgency.country_name || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Usuarios:</p>
                                        <p className="font-semibold">{selectedAgency.user_count}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-muted-foreground text-xs mb-1">Sitio Web:</p>
                                <a href={selectedAgency.website || "#"} target="_blank" className="text-primary hover:underline font-medium text-sm">
                                    {selectedAgency.website || "No definido"}
                                </a>
                            </div>

                            <div className="pt-2">
                                <p className="text-muted-foreground text-xs mb-1">Registro:</p>
                                <p className="text-sm font-medium">{new Date(selectedAgency.created_at).toLocaleString()}</p>
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
                            <Trash2 className="w-5 h-5" /> ¿Eliminar agencia?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar la agencia <strong>{selectedAgency?.name}</strong>.
                            Esta acción no se puede deshacer y fallará si hay usuarios o pedidos vinculados.
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
