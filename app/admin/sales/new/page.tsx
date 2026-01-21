"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import {
    Search,
    X,
    Plus,
    Minus,
    Calendar as CalendarIcon,
    Users,
    Loader2,
    ArrowRight,
    CreditCard,
    FileText,
    Package as PackageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Customer = {
    id: number
    full_name: string
    email: string
    phone?: string
}

type Package = {
    id: number
    title: string
    slug: string
    status: string
    duration?: number
}

type SaleItem = {
    package_id: number
    package_title: string
    travel_date: string
    adults: number
    children: number
    unit_price: number
}

type SaleType = 'booking' | 'quote'

export default function NewSalePage() {
    const router = useRouter()

    // Customer
    const [customerSearch, setCustomerSearch] = useState("")
    const [customerResults, setCustomerResults] = useState<Customer[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [loadingCustomers, setLoadingCustomers] = useState(false)

    // Packages
    const [packageSearch, setPackageSearch] = useState("")
    const [packageResults, setPackageResults] = useState<Package[]>([])
    const [showPackageModal, setShowPackageModal] = useState(false)
    const [loadingPackages, setLoadingPackages] = useState(false)

    // Cart
    const [items, setItems] = useState<SaleItem[]>([])

    // Sale Config
    const [saleType, setSaleType] = useState<SaleType>('booking')
    const [paymentType, setPaymentType] = useState<'full' | 'partial' | 'later'>('later')
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER' | 'CHECK' | 'MERCADOPAGO'>('CASH')
    const [partialAmount, setPartialAmount] = useState("")

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Customer Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (customerSearch.length > 2) {
                setLoadingCustomers(true)
                try {
                    const { data } = await supabase
                        .from("customers")
                        .select("id, full_name, email, phone")
                        .or(`full_name.ilike.%${customerSearch}%,email.ilike.%${customerSearch}%`)
                        .limit(10)
                    setCustomerResults((data as any) || [])
                } catch (e) {
                    console.error(e)
                } finally {
                    setLoadingCustomers(false)
                }
            } else {
                setCustomerResults([])
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [customerSearch])

    // Package Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (packageSearch.length > 2) {
                setLoadingPackages(true)
                try {
                    const { data } = await supabase
                        .from("packages")
                        .select("id, title, slug, status, duration")
                        .ilike('title', `%${packageSearch}%`)
                        .limit(20)
                    setPackageResults((data as any) || [])
                } catch (e) {
                    console.error(e)
                } finally {
                    setLoadingPackages(false)
                }
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [packageSearch])

    const addPackage = (pkg: Package) => {
        setItems([...items, {
            package_id: pkg.id,
            package_title: pkg.title,
            travel_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
            adults: 2,
            children: 0,
            unit_price: 15000 // Default, TODO: fetch real price
        }])
        setShowPackageModal(false)
        setPackageSearch("")
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: keyof SaleItem, value: any) => {
        const updated = [...items]
        updated[index] = { ...updated[index], [field]: value }
        setItems(updated)
    }

    const calculateTotal = () => {
        return items.reduce((sum, item) =>
            sum + (item.unit_price * (item.adults + item.children * 0.7)),
            0)
    }

    const handleSubmit = async () => {
        if (!selectedCustomer) {
            toast.error("Selecciona un cliente")
            return
        }
        if (items.length === 0) {
            toast.error("Agrega al menos un paquete")
            return
        }

        setIsSubmitting(true)

        try {
            const total = calculateTotal()

            if (saleType === 'quote') {
                // Create Quote
                const res = await fetch("/api/admin/sales/quotes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customer_id: selectedCustomer.id,
                        currency_code: 'MXN',
                        total_amount: total,
                        items: items.map(item => ({
                            ...item,
                            quantity: 1,
                            subtotal: item.unit_price * (item.adults + item.children * 0.7)
                        })),
                        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        notes: ""
                    })
                })

                if (!res.ok) throw new Error("Error")
                const quote = await res.json()
                toast.success("Cotización creada correctamente")
                router.push(`/admin/sales/quotes/${quote.id}`)
            } else {
                // Create Booking Directly
                const res = await fetch("/api/admin/sales/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customer_id: selectedCustomer.id,
                        currency_code: 'MXN',
                        total_amount: total,
                        items: items.map(item => ({
                            ...item,
                            quantity: 1,
                            subtotal: item.unit_price * (item.adults + item.children * 0.7)
                        })),
                    })
                })

                if (!res.ok) throw new Error("Error")
                const booking = await res.json()

                // Register payment if needed
                if (paymentType === 'full') {
                    await fetch("/api/admin/sales/payments", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            booking_id: booking.id,
                            amount: total,
                            method: paymentMethod,
                            notes: `Pago completo - ${paymentMethod}`
                        })
                    })
                } else if (paymentType === 'partial' && partialAmount) {
                    await fetch("/api/admin/sales/payments", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            booking_id: booking.id,
                            amount: parseFloat(partialAmount),
                            method: paymentMethod,
                            notes: `Anticipo - ${paymentMethod}`
                        })
                    })
                }

                toast.success("Reserva creada correctamente")
                router.push(`/admin/sales/bookings/${booking.id}`)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error al crear la venta")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Nueva Venta</h1>
                    <p className="text-muted-foreground">Crea una reserva o cotización</p>
                </div>
                <Link href="/admin/sales">
                    <button className="px-4 py-2 border rounded-lg hover:bg-muted">
                        Cancelar
                    </button>
                </Link>
            </div>

            <div className="grid md:grid-cols-[1fr_380px] gap-6">
                {/* Main Form */}
                <div className="space-y-6">
                    {/* Sale Type Toggle */}
                    <div className="bg-white border rounded-xl p-6">
                        <h3 className="font-semibold mb-3">Tipo de Venta</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSaleType('booking')}
                                className={cn(
                                    "p-4 border-2 rounded-lg transition-all",
                                    saleType === 'booking'
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <CreditCard className={cn("w-6 h-6 mx-auto mb-2", saleType === 'booking' ? "text-primary" : "text-muted-foreground")} />
                                <div className="font-medium">Reserva Directa</div>
                                <div className="text-xs text-muted-foreground">Confirmación inmediata</div>
                            </button>
                            <button
                                onClick={() => setSaleType('quote')}
                                className={cn(
                                    "p-4 border-2 rounded-lg transition-all",
                                    saleType === 'quote'
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <FileText className={cn("w-6 h-6 mx-auto mb-2", saleType === 'quote' ? "text-primary" : "text-muted-foreground")} />
                                <div className="font-medium">Cotización</div>
                                <div className="text-xs text-muted-foreground">Para aprobación</div>
                            </button>
                        </div>
                    </div>

                    {/* Customer Selection */}
                    <div className="bg-white border rounded-xl p-6">
                        <h3 className="font-semibold mb-3">Cliente</h3>
                        {!selectedCustomer ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o email..."
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={customerSearch}
                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                    />
                                    {loadingCustomers && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-muted-foreground" />}
                                </div>

                                {customerResults.length > 0 && (
                                    <div className="border rounded-lg divide-y max-h-[200px] overflow-y-auto">
                                        {customerResults.map(c => (
                                            <div
                                                key={c.id}
                                                className="p-3 hover:bg-muted cursor-pointer"
                                                onClick={() => {
                                                    setSelectedCustomer(c)
                                                    setCustomerSearch("")
                                                    setCustomerResults([])
                                                }}
                                            >
                                                <div className="font-medium">{c.full_name}</div>
                                                <div className="text-sm text-muted-foreground">{c.email}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div>
                                    <div className="font-medium text-blue-900">{selectedCustomer.full_name}</div>
                                    <div className="text-sm text-blue-700">{selectedCustomer.email}</div>
                                </div>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="text-blue-700 hover:text-blue-900"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Packages */}
                    <div className="bg-white border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Paquetes</h3>
                            <button
                                onClick={() => setShowPackageModal(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                <PackageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground text-sm">No hay paquetes agregados</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="font-medium">{item.package_title}</div>
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="text-xs text-muted-foreground">Fecha</label>
                                                <input
                                                    type="date"
                                                    value={item.travel_date}
                                                    onChange={(e) => updateItem(index, 'travel_date', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Adultos</label>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => updateItem(index, 'adults', Math.max(1, item.adults - 1))}
                                                        className="p-1 border rounded"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.adults}
                                                        onChange={(e) => updateItem(index, 'adults', parseInt(e.target.value) || 1)}
                                                        className="w-full px-2 py-1 text-sm border rounded text-center"
                                                    />
                                                    <button
                                                        onClick={() => updateItem(index, 'adults', item.adults + 1)}
                                                        className="p-1 border rounded"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Niños</label>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => updateItem(index, 'children', Math.max(0, item.children - 1))}
                                                        className="p-1 border rounded"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.children}
                                                        onChange={(e) => updateItem(index, 'children', parseInt(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 text-sm border rounded text-center"
                                                    />
                                                    <button
                                                        onClick={() => updateItem(index, 'children', item.children + 1)}
                                                        className="p-1 border rounded"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <span className="text-sm text-muted-foreground">Subtotal</span>
                                            <span className="font-bold">${(item.unit_price * (item.adults + item.children * 0.7)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Options (only for bookings) */}
                    {saleType === 'booking' && (
                        <div className="bg-white border rounded-xl p-6">
                            <h3 className="font-semibold mb-3">Pago</h3>

                            {/* Payment Method */}
                            <div className="mb-4">
                                <label className="text-sm font-medium mb-2 block">Método de Pago</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setPaymentMethod('CASH')}
                                        className={cn(
                                            "p-3 border-2 rounded-lg text-sm font-medium transition-all",
                                            paymentMethod === 'CASH'
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        💵 Efectivo
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('CARD')}
                                        className={cn(
                                            "p-3 border-2 rounded-lg text-sm font-medium transition-all",
                                            paymentMethod === 'CARD'
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        💳 Tarjeta
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('TRANSFER')}
                                        className={cn(
                                            "p-3 border-2 rounded-lg text-sm font-medium transition-all",
                                            paymentMethod === 'TRANSFER'
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        🏦 Transferencia
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('CHECK')}
                                        className={cn(
                                            "p-3 border-2 rounded-lg text-sm font-medium transition-all",
                                            paymentMethod === 'CHECK'
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        📄 Cheque
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('MERCADOPAGO')}
                                        className={cn(
                                            "p-3 border-2 rounded-lg text-sm font-medium transition-all col-span-2",
                                            paymentMethod === 'MERCADOPAGO'
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        💎 Mercado Pago
                                    </button>
                                </div>
                            </div>

                            {/* Payment Amount */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium block">Monto</label>
                                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                                    <input
                                        type="radio"
                                        checked={paymentType === 'full'}
                                        onChange={() => setPaymentType('full')}
                                        className="w-4 h-4"
                                    />
                                    <span>Pago completo (${calculateTotal().toLocaleString()})</span>
                                </label>
                                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                                    <input
                                        type="radio"
                                        checked={paymentType === 'partial'}
                                        onChange={() => setPaymentType('partial')}
                                        className="w-4 h-4"
                                    />
                                    <span>Anticipo</span>
                                </label>
                                {paymentType === 'partial' && (
                                    <input
                                        type="number"
                                        placeholder="Monto del anticipo"
                                        value={partialAmount}
                                        onChange={(e) => setPartialAmount(e.target.value)}
                                        className="w-full ml-6 px-3 py-2 border rounded-lg"
                                    />
                                )}
                                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                                    <input
                                        type="radio"
                                        checked={paymentType === 'later'}
                                        onChange={() => setPaymentType('later')}
                                        className="w-4 h-4"
                                    />
                                    <span>Pagar después</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Sidebar */}
                <div className="bg-white border rounded-xl p-6 h-fit sticky top-6 space-y-4">
                    <h3 className="font-bold text-lg">Resumen</h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Paquetes</span>
                            <span className="font-medium">{items.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total pasajeros</span>
                            <span className="font-medium">
                                {items.reduce((sum, item) => sum + item.adults + item.children, 0)}
                            </span>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-2xl font-bold">${calculateTotal().toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">MXN</div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedCustomer || items.length === 0 || isSubmitting}
                        className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                {saleType === 'quote' ? 'Generar Cotización' : 'Crear Reserva'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Package Modal */}
            {showPackageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[600px] overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="font-bold text-lg">Seleccionar Paquete</h3>
                            <button onClick={() => setShowPackageModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Buscar paquete..."
                                    className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={packageSearch}
                                    onChange={(e) => setPackageSearch(e.target.value)}
                                    autoFocus
                                />
                                {loadingPackages && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin" />}
                            </div>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {packageResults.map(pkg => (
                                    <div
                                        key={pkg.id}
                                        onClick={() => addPackage(pkg)}
                                        className="p-4 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                                    >
                                        <div className="font-medium">{pkg.title}</div>
                                        <div className="text-sm text-muted-foreground">{pkg.slug}</div>
                                    </div>
                                ))}
                                {packageSearch.length > 2 && packageResults.length === 0 && !loadingPackages && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No se encontraron paquetes
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
