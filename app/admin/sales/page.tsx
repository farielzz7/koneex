"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Plus, Calendar, TrendingUp, Clock, CheckCircle, FileText, ShoppingCart, CreditCard, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type SalesItem = {
    id: number
    type: 'quote' | 'booking'
    folio: string
    customer_name: string
    package_titles: string
    total_amount: number
    paid_amount?: number
    currency_code: string
    status: string
    created_at: string
    travel_date?: string
}

type Stats = {
    totalSales: number
    pendingPayments: number
    activeBookings: number
    quotesPending: number
}

export default function SalesDashboardPage() {
    const [items, setItems] = useState<SalesItem[]>([])
    const [stats, setStats] = useState<Stats>({ totalSales: 0, pendingPayments: 0, activeBookings: 0, quotesPending: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'quote' | 'booking'>('all')

    useEffect(() => {
        fetchSalesData()
    }, [])

    const fetchSalesData = async () => {
        try {
            // Fetch quotes
            const { data: quotes } = await supabase
                .from("quotes")
                .select(`
                    id,
                    quote_number,
                    total_amount,
                    currency_code,
                    status,
                    created_at,
                    customer:customers(full_name)
                `)
                .order("created_at", { ascending: false })

            // Fetch bookings
            const { data: bookings } = await supabase
                .from("bookings")
                .select(`
                    id,
                    booking_code,
                    total_amount,
                    paid_amount,
                    currency_code,
                    status,
                    created_at,
                    customer:customers(full_name)
                `)
                .order("created_at", { ascending: false })

            // Combine and format
            const quotesFormatted: SalesItem[] = (quotes || []).map((q: any) => ({
                id: q.id,
                type: 'quote' as const,
                folio: q.quote_number,
                customer_name: q.customer?.full_name || 'N/A',
                package_titles: 'Ver detalles',
                total_amount: q.total_amount,
                currency_code: q.currency_code,
                status: q.status,
                created_at: q.created_at
            }))

            const bookingsFormatted: SalesItem[] = (bookings || []).map((b: any) => ({
                id: b.id,
                type: 'booking' as const,
                folio: b.booking_code,
                customer_name: b.customer?.full_name || 'N/A',
                package_titles: 'Ver detalles',
                total_amount: b.total_amount,
                paid_amount: b.paid_amount || 0,
                currency_code: b.currency_code,
                status: b.status,
                created_at: b.created_at
            }))

            const combined = [...quotesFormatted, ...bookingsFormatted].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )

            setItems(combined)

            // Calculate stats
            const thisMonth = new Date().getMonth()
            const thisYear = new Date().getFullYear()

            const totalSales = bookingsFormatted
                .filter(b => {
                    const date = new Date(b.created_at)
                    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
                })
                .reduce((sum, b) => sum + (b.paid_amount || 0), 0)

            const pendingPayments = bookingsFormatted
                .filter(b => b.status === 'PENDING' || b.status === 'ON_HOLD')
                .reduce((sum, b) => sum + (b.total_amount - (b.paid_amount || 0)), 0)

            const activeBookings = bookingsFormatted.filter(b =>
                b.status === 'CONFIRMED' || b.status === 'PENDING'
            ).length

            const quotesPending = quotesFormatted.filter(q =>
                q.status === 'DRAFT' || q.status === 'SENT'
            ).length

            setStats({ totalSales, pendingPayments, activeBookings, quotesPending })
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredItems = filter === 'all' ? items : items.filter(i => i.type === filter)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
                    <p className="text-muted-foreground">Centro de control de ventas y reservas</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/sales/calendar">
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                            <Calendar className="w-4 h-4" />
                            Calendario
                        </button>
                    </Link>
                    <Link href="/admin/sales/new">
                        <button className="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                            <Plus className="w-4 h-4" />
                            Nueva Venta
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                    label="Ventas del Mes"
                    value={`$${stats.totalSales.toLocaleString()}`}
                    bgColor="bg-green-50"
                />
                <StatsCard
                    icon={<Clock className="w-5 h-5 text-orange-600" />}
                    label="Pagos Pendientes"
                    value={`$${stats.pendingPayments.toLocaleString()}`}
                    bgColor="bg-orange-50"
                />
                <StatsCard
                    icon={<CheckCircle className="w-5 h-5 text-blue-600" />}
                    label="Reservas Activas"
                    value={stats.activeBookings.toString()}
                    bgColor="bg-blue-50"
                />
                <StatsCard
                    icon={<FileText className="w-5 h-5 text-purple-600" />}
                    label="Cotizaciones Pendientes"
                    value={stats.quotesPending.toString()}
                    bgColor="bg-purple-50"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b">
                <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="Todos" count={items.length} />
                <FilterButton active={filter === 'quote'} onClick={() => setFilter('quote')} label="Cotizaciones" count={items.filter(i => i.type === 'quote').length} />
                <FilterButton active={filter === 'booking'} onClick={() => setFilter('booking')} label="Reservas" count={items.filter(i => i.type === 'booking').length} />
            </div>

            {/* Main Table */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground">Cargando...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No hay {filter === 'all' ? 'ventas' : filter === 'quote' ? 'cotizaciones' : 'reservas'} registradas</p>
                        <Link href="/admin/sales/new">
                            <button className="px-4 py-2 bg-primary text-white rounded-lg">
                                <Plus className="w-4 h-4 inline mr-2" />
                                Crear primera venta
                            </button>
                        </Link>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <TypeBadge type={item.type} />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.folio}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.customer_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">${item.total_amount.toLocaleString()} {item.currency_code}</div>
                                        {item.type === 'booking' && item.paid_amount !== undefined && (
                                            <div className="text-xs text-green-600">Pagado: ${item.paid_amount.toLocaleString()}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={item.status} type={item.type} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/sales/${item.type === 'quote' ? 'quotes' : 'bookings'}/${item.id}`}>
                                            <button className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                Ver
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

function StatsCard({ icon, label, value, bgColor }: { icon: React.ReactNode, label: string, value: string, bgColor: string }) {
    return (
        <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", bgColor)}>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
            </div>
        </div>
    )
}

function FilterButton({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-2 font-medium transition-colors border-b-2",
                active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-gray-900"
            )}
        >
            {label} <span className="ml-1 text-xs">({count})</span>
        </button>
    )
}

function TypeBadge({ type }: { type: 'quote' | 'booking' }) {
    return (
        <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
            type === 'quote' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
        )}>
            {type === 'quote' ? <FileText className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
            {type === 'quote' ? 'Cotización' : 'Reserva'}
        </span>
    )
}

function StatusBadge({ status, type }: { status: string, type: 'quote' | 'booking' }) {
    const styles: Record<string, string> = {
        // Quote statuses
        DRAFT: "bg-gray-100 text-gray-700",
        SENT: "bg-blue-100 text-blue-700",
        ACCEPTED: "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
        EXPIRED: "bg-orange-100 text-orange-700",
        // Booking statuses
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        COMPLETED: "bg-blue-100 text-blue-800",
        ON_HOLD: "bg-orange-100 text-orange-800",
    }

    const labels: Record<string, string> = {
        DRAFT: "Borrador",
        SENT: "Enviada",
        ACCEPTED: "Aceptada",
        REJECTED: "Rechazada",
        EXPIRED: "Expirada",
        PENDING: "Pendiente",
        CONFIRMED: "Confirmada",
        CANCELLED: "Cancelada",
        COMPLETED: "Completada",
        ON_HOLD: "En Espera",
    }

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status] || "bg-gray-100 text-gray-800")}>
            {labels[status] || status}
        </span>
    )
}
