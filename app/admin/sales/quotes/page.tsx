"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Plus, Search, FileText, Loader2, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type Quote = {
    id: number
    quote_number: string
    customer: { full_name: string } | null
    total_amount: number
    currency_code: string
    status: string
    created_at: string
    valid_until: string | null
}

export default function QuotesListPage() {
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const { data, error } = await supabase
                    .from("quotes")
                    .select("*, customer:customers(full_name)")
                    .order("created_at", { ascending: false })

                if (error) throw error
                // Force cast to match our localized type if Supabase types are strict/mismatched
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setQuotes((data as any) || [])
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchQuotes()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Cotizaciones</h1>
                    <p className="text-sm text-gray-500">Historial de cotizaciones generadas.</p>
                </div>
                <Link href="/admin/sales/quotes/new" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    Nueva Cotización
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                ) : quotes.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No hay cotizaciones registradas.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {quotes.map((q) => (
                                <tr key={q.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{q.quote_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{q.customer?.full_name || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        ${q.total_amount.toLocaleString()} <span className="text-xs font-normal text-gray-500">{q.currency_code}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={q.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(q.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link href={`/admin/sales/quotes/${q.id}`} className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1">
                                            Ver <ExternalLink className="w-3 h-3" />
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

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        DRAFT: "bg-gray-100 text-gray-700",
        SENT: "bg-blue-100 text-blue-700",
        ACCEPTED: "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
        EXPIRED: "bg-orange-100 text-orange-700",
    }
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status] || "bg-gray-100 text-gray-800")}>
            {status}
        </span>
    )
}
