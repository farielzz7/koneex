"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingCart, Filter, FileDown } from "lucide-react"
import { exportToCSV } from "@/lib/export-csv"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
    id: number
    order_number: string
    status: string
    subtotal: number
    discount_total: number
    total: number
    created_at: string
    customer: {
        name: string
    } | null
    currency_code: string
    _count?: {
        items: number
    }
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("ALL")

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/admin/orders")
            if (response.ok) {
                const data = await response.json()
                setOrders(data)
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = statusFilter === "ALL"
        ? orders
        : orders.filter(order => order.status === statusFilter)

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            DRAFT: "bg-gray-100 text-gray-800",
            PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
            CONFIRMED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
            COMPLETED: "bg-blue-100 text-blue-800",
            REFUNDED: "bg-purple-100 text-purple-800",
        }
        return colors[status] || "bg-gray-100 text-gray-800"
    }

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            DRAFT: "Borrador",
            PENDING_PAYMENT: "Pendiente Pago",
            CONFIRMED: "Confirmada",
            CANCELLED: "Cancelada",
            COMPLETED: "Completada",
            REFUNDED: "Reembolsada",
        }
        return labels[status] || status
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64">Cargando...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Órdenes de Compra</h1>
                    <p className="text-gray-600 mt-1">Gestiona todas las órdenes de clientes</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => exportToCSV(orders, 'ordenes')}
                        className="gap-2"
                        disabled={orders.length === 0}
                    >
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </Button>
                    <Link href="/admin/orders/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nueva Orden
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-center">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todas las órdenes</SelectItem>
                                <SelectItem value="DRAFT">Borrador</SelectItem>
                                <SelectItem value="PENDING_PAYMENT">Pendientes</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmadas</SelectItem>
                                <SelectItem value="CANCELLED">Canceladas</SelectItem>
                                <SelectItem value="REFUNDED">Reembolsadas</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-600">
                            {filteredOrders.length} orden(es)
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todas las Órdenes ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No hay órdenes {statusFilter !== "ALL" && "con este estado"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Las órdenes aparecerán aquí
                            </p>
                            <Link href="/admin/orders/new">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Orden
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Folio</th>
                                        <th className="text-left py-3 px-4">Cliente</th>
                                        <th className="text-left py-3 px-4">Items</th>
                                        <th className="text-left py-3 px-4">Total</th>
                                        <th className="text-left py-3 px-4">Estado</th>
                                        <th className="text-left py-3 px-4">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-mono text-sm font-bold text-primary">
                                                {order.order_number}
                                            </td>
                                            <td className="py-3 px-4 font-medium">
                                                {order.customer?.name || "Cliente sin nombre"}
                                            </td>
                                            <td className="py-3 px-4">{order._count?.items || 0} items</td>
                                            <td className="py-3 px-4 font-semibold">
                                                {order.currency_code} ${order.total.toString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleString()}
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
