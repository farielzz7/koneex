"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Plus,
    ShoppingCart,
    Filter,
    FileDown,
    Search,
    Info,
    Eye,
    User,
    Calendar,
    DollarSign,
    ShoppingBag,
    Loader2,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react"
import { exportToCSV } from "@/lib/export-csv"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Order {
    id: number
    order_number: string
    status: string
    subtotal: number
    discount_total: number
    tax_total: number
    total: number
    created_at: string
    currency_code: string
    customer: {
        id: string
        name: string
        email: string
    } | null
    _count?: {
        items: number
    }
}

interface OrderDetail extends Order {
    items: {
        id: number
        title: string
        quantity: number
        unit_price: number
        total_price: number
        item_type: string
        package?: {
            id: string
            title: string
            images: string[]
        }
    }[]
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <OrdersList />
        </Suspense>
    )
}

function OrdersList() {
    const searchParams = useSearchParams()
    const initialStatus = searchParams.get('status') || "ALL"

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState(initialStatus)

    // Update filter if URL changes
    useEffect(() => {
        const status = searchParams.get('status')
        if (status) {
            setStatusFilter(status)
        }
    }, [searchParams])

    // Detail Modal States
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/admin/orders")
            if (response.ok) {
                const data = await response.json()
                setOrders(data)
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al cargar las órdenes")
        } finally {
            setLoading(false)
        }
    }

    const fetchOrderDetail = async (id: number) => {
        try {
            setLoadingDetail(true)
            setIsDetailOpen(true)
            const response = await fetch(`/api/admin/orders/${id}`)
            if (response.ok) {
                const data = await response.json()
                setSelectedOrder(data)
            } else {
                toast.error("No se pudo cargar el detalle de la orden")
                setIsDetailOpen(false)
            }
        } catch (error) {
            console.error("Error fetching detail:", error)
            toast.error("Error al obtener detalles")
            setIsDetailOpen(false)
        } finally {
            setLoadingDetail(false)
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchLower) ||
            (order.customer?.name || "").toLowerCase().includes(searchLower) ||
            (order.customer?.email || "").toLowerCase().includes(searchLower)

        return matchesStatus && matchesSearch
    })

    const getStatusUI = (status: string) => {
        switch (status) {
            case "DRAFT":
                return { color: "bg-gray-100 text-gray-800", label: "Borrador", icon: <Clock className="w-3 h-3" /> }
            case "PENDING_PAYMENT":
                return { color: "bg-yellow-100 text-yellow-800", label: "Pendiente", icon: <AlertCircle className="w-3 h-3" /> }
            case "CONFIRMED":
                return { color: "bg-green-100 text-green-800", label: "Confirmada", icon: <CheckCircle2 className="w-3 h-3" /> }
            case "COMPLETED":
                return { color: "bg-blue-100 text-blue-800", label: "Completada", icon: <CheckCircle2 className="w-3 h-3" /> }
            case "CANCELLED":
                return { color: "bg-red-100 text-red-800", label: "Cancelada", icon: <XCircle className="w-3 h-3" /> }
            case "REFUNDED":
                return { color: "bg-purple-100 text-purple-800", label: "Reembolsada", icon: <DollarSign className="w-3 h-3" /> }
            default:
                return { color: "bg-gray-100 text-gray-800", label: status, icon: <Clock className="w-3 h-3" /> }
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-gray-500 font-medium font-outfit">Cargando órdenes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Órdenes de Compra
                    </h1>
                    <p className="text-gray-600 mt-1">Gestión centralizada de ventas y pagos</p>
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
                        <Button className="gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4" />
                            Nueva Orden
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="md:col-span-3 shadow-sm border-none bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por folio, cliente o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 border-none bg-transparent focus-visible:ring-0 text-sm"
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="border-none bg-transparent h-10 focus:ring-0 text-sm">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <SelectValue placeholder="Filtrar por estado" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos los estados</SelectItem>
                                <SelectItem value="DRAFT">Borrador</SelectItem>
                                <SelectItem value="PENDING_PAYMENT">Pendiente</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                                <SelectItem value="COMPLETED">Completada</SelectItem>
                                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                                <SelectItem value="REFUNDED">Reembolsada</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>

            {/* List Table */}
            <Card className="shadow-smooth border-none overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b py-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        Registros de Ventas ({filteredOrders.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-20 bg-white">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-outfit">
                                No hay órdenes aquí
                            </h3>
                            <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">
                                {searchTerm || statusFilter !== "ALL"
                                    ? "Prueba con otros filtros o términos de búsqueda."
                                    : "Comienza registrando una nueva venta desde el botón superior."}
                            </p>
                            {(searchTerm || statusFilter !== "ALL") && (
                                <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setStatusFilter("ALL"); }}>
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 text-[11px] uppercase text-gray-400 tracking-wider font-bold border-b">
                                        <th className="text-left py-4 px-6">Información de Orden</th>
                                        <th className="text-left py-4 px-6">Cliente</th>
                                        <th className="text-left py-4 px-6">Contenido</th>
                                        <th className="text-left py-4 px-6">Total</th>
                                        <th className="text-left py-4 px-6">Estado</th>
                                        <th className="text-right py-4 px-6 w-20">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => {
                                        const statusUI = getStatusUI(order.status)
                                        return (
                                            <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-all duration-200">
                                                <td className="py-4 px-6">
                                                    <div className="space-y-1">
                                                        <div className="font-mono text-sm font-bold text-primary flex items-center gap-1">
                                                            #{order.order_number}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(order.created_at).toLocaleDateString('es-MX', {
                                                                day: '2-digit', month: 'short', year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                                            {order.customer?.name?.[0] || 'C'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-sm text-gray-900 leading-tight">
                                                                {order.customer?.name || "Cliente Final"}
                                                            </div>
                                                            <div className="text-[11px] text-gray-500 mt-0.5">
                                                                {order.customer?.email || "sin@email.com"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100 uppercase">
                                                            {order._count?.items || 0} ITEMS
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-sm text-gray-900">
                                                        {order.currency_code} ${Number(order.total).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full border ${statusUI.color.replace('bg-', 'bg-opacity-20 border-').replace('text-', 'text-opacity-90 text-')}`}>
                                                        {statusUI.icon}
                                                        {statusUI.label.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-primary transition-colors"
                                                        onClick={() => fetchOrderDetail(order.id)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl font-outfit">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                            <ShoppingBag className="w-6 h-6 text-primary" />
                            Detalle de la Orden
                        </DialogTitle>
                        <DialogDescription>
                            {selectedOrder ? `Folio: #${selectedOrder.order_number}` : "Cargando detalles..."}
                        </DialogDescription>
                    </DialogHeader>

                    {loadingDetail ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm text-gray-500">Obteniendo información...</p>
                        </div>
                    ) : selectedOrder ? (
                        <div className="space-y-6">
                            {/* Order Summary Chips */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Total</div>
                                    <div className="text-lg font-bold text-primary">
                                        {selectedOrder.currency_code} ${Number(selectedOrder.total).toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Estado</div>
                                    <div className="text-sm font-bold flex items-center gap-1.5">
                                        {getStatusUI(selectedOrder.status).label}
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Items</div>
                                    <div className="text-sm font-bold">{selectedOrder.items.length} productos</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Fecha</div>
                                    <div className="text-sm font-bold">
                                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer Info */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2 text-gray-900 border-b pb-2">
                                        <User className="w-4 h-4 text-primary" />
                                        Información del Cliente
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 font-semibold text-gray-900 border-b pb-2 mb-2">
                                            {selectedOrder.customer?.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5" />
                                            {selectedOrder.customer?.email}
                                        </div>
                                        {/* Agregando más campos si existieran */}
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" />
                                            +52 (Data no disponible)
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2 text-gray-900 border-b pb-2">
                                        <Info className="w-4 h-4 text-primary" />
                                        Resumen de Compra
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span className="font-semibold">{selectedOrder.currency_code} ${Number(selectedOrder.subtotal).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-red-500">
                                            <span>Descuentos:</span>
                                            <span>-{selectedOrder.currency_code} ${Number(selectedOrder.discount_total).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 mt-2 font-bold text-gray-900 text-base">
                                            <span>Total Final:</span>
                                            <span>{selectedOrder.currency_code} ${Number(selectedOrder.total).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4 text-primary" />
                                    Items de la Orden
                                </h4>
                                <div className="border rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                <th className="text-left py-3 px-4">Producto</th>
                                                <th className="text-center py-3 px-4">Cant</th>
                                                <th className="text-right py-3 px-4">Precio</th>
                                                <th className="text-right py-3 px-4">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedOrder.items.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="font-semibold text-gray-900">{item.title}</div>
                                                        <div className="text-[10px] text-gray-500 uppercase">{item.item_type}</div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-medium">x{item.quantity}</td>
                                                    <td className="py-3 px-4 text-right font-medium text-gray-600">
                                                        ${Number(item.unit_price).toLocaleString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                                                        ${Number(item.total_price).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <DialogFooter className="border-t pt-4">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="rounded-xl">
                            Cerrar Detalle
                        </Button>
                        <Button className="rounded-xl gap-2">
                            <FileDown className="w-4 h-4" />
                            Generar Recibo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
