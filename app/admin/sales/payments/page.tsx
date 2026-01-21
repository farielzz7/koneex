"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { CreditCard, Search, Loader2, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Payment = {
    id: number
    amount: number
    currency_code: string
    method: string
    status: string
    provider_reference: string | null
    created_at: string
    booking: {
        id: number
        booking_code: string
        customer: { full_name: string } | null
    } | null
}

export default function PaymentsListPage() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const { data, error } = await supabase
                    .from("payments")
                    .select("*, booking:bookings(id, booking_code, customer:customers(full_name))")
                    .order("created_at", { ascending: false })

                if (error) throw error
                setPayments(data || [])
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPayments()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Pagos</h1>
                    <p className="text-sm text-gray-500">Registro de todos los pagos recibidos.</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                ) : payments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No hay pagos registrados.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserva / Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(p.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        ${p.amount.toLocaleString()} {p.currency_code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {p.method}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {p.booking ? (
                                            <Link href={`/admin/sales/bookings/${p.booking.id}`} className="group flex flex-col">
                                                <span className="text-primary font-medium group-hover:underline flex items-center gap-1">
                                                    {p.booking.booking_code} <ArrowUpRight className="w-3 h-3" />
                                                </span>
                                                <span className="text-xs text-gray-500">{p.booking.customer?.full_name}</span>
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400">Sin Reserva</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            p.status === 'PAID' ? "bg-green-100 text-green-800" :
                                                p.status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-gray-100 text-gray-800"
                                        )}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-500 font-mono">
                                        {p.provider_reference || "-"}
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
