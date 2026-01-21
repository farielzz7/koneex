"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Search, ShoppingCart, Loader2, ExternalLink, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type Booking = {
    id: number
    booking_code: string
    customer: { full_name: string } | null
    total_amount: number
    paid_amount: number
    currency_code: string
    status: string
    created_at: string
}

export default function BookingsListPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data, error } = await supabase
                    .from("bookings")
                    .select("*, customer:customers(full_name)")
                    .order("created_at", { ascending: false })

                if (error) throw error
                setBookings(data || [])
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBookings()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reservas</h1>
                    <p className="text-sm text-gray-500">Gestión de reservas y seguimiento.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/sales/quotes/new">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                            <Plus className="w-4 h-4" />
                            Nueva Reserva (desde Cotización)
                        </button>
                    </Link>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                ) : bookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No hay reservas registradas.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total / Pagado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{b.booking_code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{b.customer?.full_name || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium">${b.total_amount.toLocaleString()} {b.currency_code}</div>
                                        <div className="text-xs text-green-600">Pagado: ${b.paid_amount?.toLocaleString() || 0}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <BookingStatusBadge status={b.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(b.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link href={`/admin/sales/bookings/${b.id}`} className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1">
                                            Ver <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div >
    )
}

function BookingStatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800", // Case sensitive fix maybe needed
        CANCELLED: "bg-red-100 text-red-800",
        COMPLETED: "bg-blue-100 text-blue-800",
        ON_HOLD: "bg-orange-100 text-orange-800",
    }
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status] || "bg-gray-100 text-gray-800")}>
            {status}
        </span>
    )
}
