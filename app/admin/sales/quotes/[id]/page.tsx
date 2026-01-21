"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, User, FileText, CheckCircle, XCircle, Clock, Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Types matching DB
type QuoteItem = {
    id: number
    title: string
    unit_price: number
    quantity: number
    adults: number
    children: number
    travel_date: string | null
    subtotal: number
}

type Quote = {
    id: number
    quote_number: string
    status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
    total_amount: number
    currency_code: string
    valid_until: string | null
    notes: string | null
    created_at: string
    customer: {
        id: number
        full_name: string
        email: string
        phone: string
    }
    items: QuoteItem[]
}

export default function QuoteDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [quote, setQuote] = useState<Quote | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isConverting, setIsConverting] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchQuote()
        }
    }, [params.id])

    const fetchQuote = async () => {
        try {
            const res = await fetch(`/api/admin/sales/quotes/${params.id}`)
            if (!res.ok) throw new Error("Error loading quote")
            const data = await res.json()
            setQuote(data)
        } catch (error) {
            toast.error("Error al cargar la cotización")
        } finally {
            setIsLoading(false)
        }
    }

    const handleConvertToBooking = async () => {
        if (!confirm("¿Convertir esta cotización en una reserva confirmada?")) return

        setIsConverting(true)
        try {
            // We'll assume a dedicated endpoint or generic bookings endpoint
            const res = await fetch("/api/admin/sales/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quote_id: quote?.id,
                    customer_id: quote?.customer.id,
                    // Copy other fields if needed, but backend should handle from quote_id
                })
            })

            if (!res.ok) throw new Error("Error converting")

            const booking = await res.json()
            toast.success("Reserva creada correctamente")
            router.push(`/admin/sales/bookings/${booking.id}`)
        } catch (error) {
            console.error(error)
            toast.error("Error al crear la reserva")
        } finally {
            setIsConverting(false)
        }
    }

    if (isLoading) return <div className="p-8">Cargando...</div>
    if (!quote) return <div className="p-8">Cotización no encontrada</div>

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/sales"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {quote.quote_number}
                            </h1>
                            <StatusBadge status={quote.status} />
                        </div>
                        <p className="text-sm text-gray-500">
                            Creado el {new Date(quote.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FileText className="w-4 h-4" />
                        PDF
                    </button>
                    {quote.status !== 'ACCEPTED' && (
                        <button
                            onClick={handleConvertToBooking}
                            disabled={isConverting}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {isConverting ? "Procesando..." : "Convertir a Reserva"}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Detalles del Viaje</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {quote.items.map((item) => (
                                <div key={item.id} className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-lg">{item.title}</h4>
                                            {item.travel_date && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(item.travel_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            ${item.subtotal.toLocaleString()} {quote.currency_code}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg inline-block">
                                        {item.adults} Adultos, {item.children} Menores
                                        <span className="mx-2">•</span>
                                        ${item.unit_price.toLocaleString()} c/u
                                    </div>
                                </div>
                            ))}

                            {/* Totals */}
                            <div className="p-6 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ${quote.total_amount.toLocaleString()} <span className="text-sm text-gray-500 font-normal">{quote.currency_code}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {quote.notes && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Notas</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{quote.notes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            Cliente
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-500">Nombre</div>
                                <div className="font-medium text-gray-900">{quote.customer.full_name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Email</div>
                                <div className="text-sm text-gray-900">{quote.customer.email}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Teléfono</div>
                                <div className="text-sm text-gray-900">{quote.customer.phone}</div>
                            </div>
                        </div>
                    </div>

                    {/* Validity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Validez
                        </h3>
                        {quote.valid_until ? (
                            <div>
                                <div className="text-sm text-gray-500">Válida hasta</div>
                                <div className="font-medium text-gray-900">
                                    {new Date(quote.valid_until).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Sin fecha de expiración</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        DRAFT: "bg-gray-100 text-gray-700",
        SENT: "bg-blue-100 text-blue-700",
        ACCEPTED: "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
        EXPIRED: "bg-orange-100 text-orange-700",
    }

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status as keyof typeof styles])}>
            {status}
        </span>
    )
}
