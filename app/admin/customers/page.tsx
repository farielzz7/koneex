"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit, User as UserIcon, FileDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { exportToCSV } from "@/lib/export-csv"

interface Customer {
    id: string
    phone: string | null
    createdAt: string
    user: {
        name: string
        email: string
    } | null
    _count?: {
        orders: number
    }
}

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/admin/customers")
            if (response.ok) {
                const data = await response.json()
                setCustomers(data)
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredCustomers = customers.filter((customer) =>
        customer.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    )

    if (loading) {
        return <div className="flex items-center justify-center h-64">Cargando...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Clientes</h1>
                    <p className="text-gray-600 mt-1">Gestiona todos los clientes registrados</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => exportToCSV(customers, 'clientes')}
                        className="gap-2"
                        disabled={customers.length === 0}
                    >
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Link href="/admin/customers/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nuevo Cliente
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre, email o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todos los Clientes ({filteredCustomers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-12">
                            <UserIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? "No se encontraron clientes" : "No hay clientes"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Intenta con otro término" : "Registra tu primer cliente"}
                            </p>
                            {!searchTerm && (
                                <Link href="/admin/customers/new">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Registrar Cliente
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
                                        <th className="text-left py-3 px-4">Email</th>
                                        <th className="text-left py-3 px-4">Teléfono</th>
                                        <th className="text-left py-3 px-4">Compras</th>
                                        <th className="text-left py-3 px-4">Registro</th>
                                        <th className="text-right py-3 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">
                                                {customer.user?.name || "Sin nombre"}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {customer.user?.email || "Sin email"}
                                            </td>
                                            <td className="py-3 px-4">{customer.phone || "—"}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    {customer._count?.orders || 0} órdenes
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/customers/${customer.id}`}>
                                                        <Button variant="ghost" size="sm" title="Ver detalles">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
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
        </div>
    )
}
