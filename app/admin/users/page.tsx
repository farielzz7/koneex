"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit, Trash2, User as UserIcon, Shield, Mail, Calendar, Loader2, X, Check, FileDown, Info } from "lucide-react"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export-csv"

interface User {
    id: number
    email: string
    name: string
    role: string
    registered_at: string
    phone: string | null
    status: string
    agency_id: number | null
    agencies?: { name: string }
}

interface Agency {
    id: number
    name: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [agencies, setAgencies] = useState<Agency[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modal states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
        phone: "",
        agency_id: "null",
        status: "ACTIVE"
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [usersRes, agenciesRes] = await Promise.all([
                fetch("/api/admin/users"),
                fetch("/api/admin/agencies")
            ])
            const usersData = await usersRes.json()
            const agenciesData = await agenciesRes.json()
            setUsers(usersData)
            setAgencies(agenciesData)
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al cargar datos")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateClick = () => {
        setSelectedUser(null)
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "CUSTOMER",
            phone: "",
            agency_id: "null",
            status: "ACTIVE"
        })
        setIsDialogOpen(true)
    }

    const handleEditClick = (user: User) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            phone: user.phone || "",
            agency_id: user.agency_id?.toString() || "null",
            status: user.status
        })
        setIsDialogOpen(true)
    }

    const handleViewDetail = (user: User) => {
        setSelectedUser(user)
        setIsDetailOpen(true)
    }

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user)
        setIsDeleteDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const url = selectedUser
            ? `/api/admin/users/${selectedUser.id}`
            : "/api/admin/users"

        const method = selectedUser ? "PUT" : "POST"

        const payload = {
            ...formData,
            agency_id: formData.agency_id === "null" ? null : parseInt(formData.agency_id)
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success(selectedUser ? "Usuario actualizado" : "Usuario creado")
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
        if (!selectedUser) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                toast.success("Usuario eliminado")
                setIsDeleteDialogOpen(false)
                fetchData()
            } else {
                toast.error("No se pudo eliminar el usuario")
            }
        } catch (error) {
            toast.error("Error al eliminar")
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRoleBadge = (role: string) => {
        const styles: Record<string, string> = {
            ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
            AGENCY_ADMIN: "bg-indigo-100 text-indigo-800 border-indigo-200",
            AGENT: "bg-blue-100 text-blue-800 border-blue-200",
            SUPPORT: "bg-teal-100 text-teal-800 border-teal-200",
            CUSTOMER: "bg-gray-100 text-gray-800 border-gray-200",
        }
        return styles[role] || styles.CUSTOMER
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Cargando usuarios...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-gray-600 mt-1">Administra accesos, roles y agencias del sistema</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportToCSV(users, 'usuarios')} className="gap-2">
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Button onClick={handleCreateClick} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo Usuario
                    </Button>
                </div>
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
                    <CardTitle className="text-lg">Todos los Usuarios ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold border-b">
                                    <th className="text-left py-4 px-6">Información</th>
                                    <th className="text-left py-4 px-6">Agencia</th>
                                    <th className="text-left py-4 px-6">Rol</th>
                                    <th className="text-left py-4 px-6">Estado</th>
                                    <th className="text-right py-4 px-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700 font-medium">
                                                {user.agencies?.name || "Sin Agencia"}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full text-gray-500 hover:text-primary"
                                                    onClick={() => handleViewDetail(user)}
                                                >
                                                    <Info className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full text-gray-500 hover:text-primary"
                                                    onClick={() => handleEditClick(user)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full text-gray-500 hover:text-red-600"
                                                    onClick={() => handleDeleteClick(user)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <UserIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                            <p className="text-gray-500">No se encontraron usuarios</p>
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedUser ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                            {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser ? "Modifica los datos del usuario seleccionado." : "Registra un nuevo usuario en el sistema."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="juan@ejemplo.com"
                                    required
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
                                    placeholder="55..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Rol</Label>
                                <select
                                    id="role"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="ADMIN">Administrador</option>
                                    <option value="AGENCY_ADMIN">Admin Agencia</option>
                                    <option value="AGENT">Agente</option>
                                    <option value="SUPPORT">Soporte</option>
                                    <option value="CUSTOMER">Cliente</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="agency_id">Agencia</Label>
                                <select
                                    id="agency_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.agency_id}
                                    onChange={(e) => setFormData({ ...formData, agency_id: e.target.value })}
                                >
                                    <option value="null">Sin Agencia</option>
                                    {agencies.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
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
                                    <option value="BLOCKED">Bloqueado</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {selectedUser ? "Nueva Contraseña (opcional)" : "Contraseña *"}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder={selectedUser ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                                required={!selectedUser}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                <X className="w-4 h-4 mr-2" /> Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                {selectedUser ? "Guardar Cambios" : "Crear Usuario"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalle del Usuario</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-y-3 text-sm border p-4 rounded-lg bg-gray-50/50">
                                <span className="text-muted-foreground">ID:</span>
                                <span className="font-semibold">{selectedUser.id}</span>

                                <span className="text-muted-foreground">Nombre:</span>
                                <span className="font-semibold">{selectedUser.name}</span>

                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-semibold">{selectedUser.email}</span>

                                <span className="text-muted-foreground">Teléfono:</span>
                                <span className="font-semibold">{selectedUser.phone || "-"}</span>

                                <span className="text-muted-foreground">Rol:</span>
                                <span className="font-semibold">{selectedUser.role}</span>

                                <span className="text-muted-foreground">Agencia:</span>
                                <span className="font-semibold">{selectedUser.agencies?.name || "Sin Agencia"}</span>

                                <span className="text-muted-foreground">Estado:</span>
                                <span className="font-semibold">{selectedUser.status}</span>

                                <span className="text-muted-foreground">Fecha registro:</span>
                                <span className="font-semibold">{new Date(selectedUser.registered_at).toLocaleString()}</span>
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
                            <Trash2 className="w-5 h-5" /> ¿Eliminar usuario?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar al usuario <strong>{selectedUser?.name}</strong>. Esta acción eliminará su acceso al sistema y no se puede deshacer.
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
