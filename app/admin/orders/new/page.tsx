"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    ArrowLeft,
    Plus,
    Trash2,
    ShoppingCart,
    Calendar,
    Users,
    DollarSign,
    Info,
    Loader2,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Customer {
    id: string
    user?: { name: string; email: string }
    full_name?: string
}

interface Currency {
    code: string
    name: string
    symbol: string
}

interface OccupancyType {
    code: string
    name: string
    description: string
}

interface Package {
    id: number
    title: string
}

interface PackageAvailability {
    id: number
    travel_date: string
    status: string
}

interface PackagePrice {
    occupancy_code: string
    currency_code: string
    price_amount: number
}

interface PackageDetail extends Package {
    availability: PackageAvailability[]
    prices: PackagePrice[]
}

interface CartItem {
    packageId: number
    packageTitle: string
    departureId: number | null
    departureDate: string | null
    occupancyCode: string
    quantity: number
    price: number
    paxAdults: number
    paxChildren: number
    paxInfants: number
}

export default function NewOrderPage() {
    const router = useRouter()

    // Core Data
    const [customers, setCustomers] = useState<Customer[]>([])
    const [packages, setPackages] = useState<Package[]>([])
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [occupancyTypes, setOccupancyTypes] = useState<OccupancyType[]>([])

    // UI State
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [loadingPackage, setLoadingPackage] = useState(false)

    // Cart and Form State
    const [cart, setCart] = useState<CartItem[]>([])
    const [orderCurrency, setOrderCurrency] = useState("MXN")

    const [formData, setFormData] = useState({
        customerId: "",
        paymentMethod: "transfer",
        status: "PENDING_PAYMENT",
        notes: "",
    })

    // Item Selection State
    const [selectedPackageId, setSelectedPackageId] = useState<string>("")
    const [packageDetail, setPackageDetail] = useState<PackageDetail | null>(null)
    const [selectedDepartureId, setSelectedDepartureId] = useState<string>("")
    const [selectedOccupancy, setSelectedOccupancy] = useState<string>("DBL")
    const [pax, setPax] = useState({
        adults: 2,
        children: 0,
        infants: 0
    })
    const [itemPrice, setItemPrice] = useState<string>("")
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [custRes, pkgRes, curRes, occRes] = await Promise.all([
                    fetch("/api/admin/customers"),
                    fetch("/api/admin/packages"),
                    fetch("/api/admin/currencies"),
                    fetch("/api/admin/occupancy-types")
                ])

                if (custRes.ok) setCustomers(await custRes.json())
                if (pkgRes.ok) setPackages(await pkgRes.json())
                if (curRes.ok) setCurrencies(await curRes.json())
                if (occRes.ok) setOccupancyTypes(await occRes.json())
            } catch (error) {
                console.error("Error loading data:", error)
                toast.error("Error al cargar datos base")
            } finally {
                setLoading(false)
            }
        }

        loadInitialData()
    }, [])

    // Fetch Package Particulars (Dates & Prices)
    useEffect(() => {
        if (!selectedPackageId) {
            setPackageDetail(null)
            return
        }

        const fetchDetails = async () => {
            setLoadingPackage(true)
            try {
                const res = await fetch(`/api/admin/packages/${selectedPackageId}`)
                if (res.ok) {
                    const data = await res.json()
                    setPackageDetail(data)

                    // Auto-select first available date if any
                    if (data.availability && data.availability.length > 0) {
                        setSelectedDepartureId(data.availability[0].id.toString())
                    } else {
                        setSelectedDepartureId("")
                    }
                }
            } catch (error) {
                console.error("Error fetching package details:", error)
                toast.error("No se pudieron cargar opciones del paquete")
            } finally {
                setLoadingPackage(false)
            }
        }

        fetchDetails()
    }, [selectedPackageId])

    // Update Price when Package, Occupancy or Currency changes
    useEffect(() => {
        if (!packageDetail) return

        const priceObj = packageDetail.prices.find(
            p => p.occupancy_code === selectedOccupancy && p.currency_code === orderCurrency
        )

        if (priceObj) {
            setItemPrice(priceObj.price_amount.toString())
        } else {
            // Fallback to 0 or manual
            setItemPrice("")
        }
    }, [packageDetail, selectedOccupancy, orderCurrency])

    const addToCart = () => {
        if (!selectedPackageId) {
            toast.error("Selecciona un paquete")
            return
        }

        const pkg = packages.find(p => p.id === parseInt(selectedPackageId))
        const dep = packageDetail?.availability.find(a => a.id === parseInt(selectedDepartureId))

        if (!itemPrice || parseFloat(itemPrice) <= 0) {
            toast.error("El precio debe ser mayor a 0")
            return
        }

        const newItem: CartItem = {
            packageId: parseInt(selectedPackageId),
            packageTitle: pkg?.title || "Paquete",
            departureId: dep ? dep.id : null,
            departureDate: dep ? dep.travel_date : null,
            occupancyCode: selectedOccupancy,
            quantity: quantity,
            price: parseFloat(itemPrice),
            paxAdults: pax.adults,
            paxChildren: pax.children,
            paxInfants: pax.infants
        }

        setCart([...cart, newItem])
        toast.success("Agregado al carrito")

        // Reset Item State
        setSelectedPackageId("")
        setPackageDetail(null)
        setItemPrice("")
        setQuantity(1)
        setPax({ adults: 2, children: 0, infants: 0 })
    }

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index))
    }

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.customerId) {
            toast.error("Selecciona un cliente")
            return
        }

        if (cart.length === 0) {
            toast.error("El carrito está vacío")
            return
        }

        setSubmitting(true)
        try {
            const total = calculateTotal()

            const response = await fetch("/api/admin/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: formData.customerId,
                    currencyCode: orderCurrency,
                    status: formData.status,
                    paymentMethod: formData.paymentMethod,
                    notes: formData.notes,
                    items: cart.map(item => ({
                        packageId: item.packageId,
                        departureId: item.departureId,
                        title: `${item.packageTitle} (${item.occupancyCode})`,
                        quantity: item.quantity,
                        unitPrice: item.price,
                        paxAdults: item.paxAdults,
                        paxChildren: item.paxChildren,
                        paxInfants: item.paxInfants,
                        details: {
                            occupancy_code: item.occupancyCode,
                            departure_date: item.departureDate
                        }
                    })),
                    subtotal: total,
                    discountTotal: 0,
                    total: total,
                }),
            })

            if (response.ok) {
                toast.success("Orden creada con éxito")
                router.push("/admin/orders")
            } else {
                const error = await response.json()
                toast.error(error.error || "Error al crear orden")
            }
        } catch (error) {
            console.error("Error submitting order:", error)
            toast.error("Error de red al crear orden")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 font-medium italic">Preparando el despacho...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Nueva Orden de Compra</h1>
                        <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                            <ShoppingCart className="w-4 h-4" /> Registro manual de venta para clientes
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Label className="text-sm font-bold text-gray-400">MONEDA:</Label>
                    <Select value={orderCurrency} onValueChange={setOrderCurrency}>
                        <SelectTrigger className="w-32 font-bold text-primary border-primary/20 bg-primary/5">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => (
                                <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Form Area */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Customer Selection */}
                    <Card className="border-none shadow-smooth overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Información del Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-400">Seleccionar Cliente *</Label>
                                    <Select
                                        value={formData.customerId}
                                        onValueChange={(val) => setFormData({ ...formData, customerId: val })}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Busca o selecciona un cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.full_name || c.user?.name || "Sin nombre"} ({c.user?.email || "Sin email"})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-gray-400">
                                        ¿No está? <Link href="/admin/customers/new" className="text-primary hover:underline">Registrar nuevo cliente</Link>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-400">Método de Pago</Label>
                                    <Select value={formData.paymentMethod} onValueChange={(val) => setFormData({ ...formData, paymentMethod: val })}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="transfer">🔄 Transferencia Bancaria</SelectItem>
                                            <SelectItem value="card">💳 Tarjeta (Stripe/MP)</SelectItem>
                                            <SelectItem value="cash">💵 Efectivo / Depósito</SelectItem>
                                            <SelectItem value="paypal">🅿️ PayPal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Package Selector (WIZARD-LIKE) */}
                    <Card className="border-none shadow-smooth overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
                        <CardHeader className="bg-primary/5 border-b border-primary/10">
                            <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                <Plus className="w-5 h-5" />
                                Configurar Item de Viaje
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">

                            {/* Step 1: Package selection */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase text-gray-400">1. Seleccionar Paquete</Label>
                                <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                                    <SelectTrigger className="h-12 text-base">
                                        <SelectValue placeholder="Elige un paquete del catálogo..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-96">
                                        {packages.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedPackageId && (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                                    {loadingPackage ? (
                                        <div className="flex items-center justify-center p-8 bg-white/50 rounded-xl border border-dashed">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                                            <span className="text-sm text-gray-500 font-medium">Buscando fechas y precios...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Step 2: Date */}
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3" /> 2. Fecha de Salida
                                                    </Label>
                                                    <Select value={selectedDepartureId} onValueChange={setSelectedDepartureId}>
                                                        <SelectTrigger className="h-11 bg-white">
                                                            <SelectValue placeholder="Selecciona una fecha" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {packageDetail?.availability.length === 0 ? (
                                                                <SelectItem value="none" disabled>No hay fechas disponibles</SelectItem>
                                                            ) : (
                                                                packageDetail?.availability.map(a => (
                                                                    <SelectItem key={a.id} value={a.id.toString()}>
                                                                        {new Date(a.travel_date).toLocaleDateString('es-MX', {
                                                                            weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
                                                                        })}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Step 3: Occupancy */}
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5">
                                                        <Info className="w-3 h-3" /> 3. Tipo de Ocupación
                                                    </Label>
                                                    <Select value={selectedOccupancy} onValueChange={setSelectedOccupancy}>
                                                        <SelectTrigger className="h-11 bg-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {occupancyTypes.map(o => (
                                                                <SelectItem key={o.code} value={o.code}>{o.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Pax Numbers */}
                                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100/50 rounded-xl border">
                                                <div className="space-y-2 text-center">
                                                    <Label className="text-[10px] font-bold uppercase text-gray-500">Adultos</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={pax.adults}
                                                        onChange={(e) => setPax({ ...pax, adults: parseInt(e.target.value) || 0 })}
                                                        className="text-center font-bold h-10"
                                                    />
                                                </div>
                                                <div className="space-y-2 text-center">
                                                    <Label className="text-[10px] font-bold uppercase text-gray-500">Niños</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={pax.children}
                                                        onChange={(e) => setPax({ ...pax, children: parseInt(e.target.value) || 0 })}
                                                        className="text-center font-bold h-10"
                                                    />
                                                </div>
                                                <div className="space-y-2 text-center">
                                                    <Label className="text-[10px] font-bold uppercase text-gray-500">Infantes</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={pax.infants}
                                                        onChange={(e) => setPax({ ...pax, infants: parseInt(e.target.value) || 0 })}
                                                        className="text-center font-bold h-10"
                                                    />
                                                </div>
                                            </div>

                                            {/* Price Adjustment */}
                                            <div className="flex flex-col md:flex-row items-end gap-6 pt-2">
                                                <div className="flex-1 w-full space-y-3">
                                                    <Label className="text-xs font-bold uppercase text-gray-400">Precio Sugerido P/P</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                                        <Input
                                                            type="number"
                                                            value={itemPrice}
                                                            onChange={(e) => setItemPrice(e.target.value)}
                                                            className="pl-7 h-11 text-lg font-bold text-primary"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-32 space-y-3">
                                                    <Label className="text-xs font-bold uppercase text-gray-400">Cantidad</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                        className="h-11 text-center font-bold"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={addToCart}
                                                    className="h-11 px-8 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                                >
                                                    <Plus className="w-4 h-4" /> Agregar Item
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-gray-400">Notas Adicionales</Label>
                        <Input
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Ej: El cliente requiere habitación cerca del elevador..."
                            className="bg-white"
                        />
                    </div>
                </div>

                {/* Shopping Cart Sidebar */}
                <div className="lg:col-span-4">
                    <Card className="sticky top-6 border-none shadow-premium bg-white overflow-hidden">
                        <CardHeader className="bg-gray-900 text-white">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" /> Resumen de Orden
                                </span>
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                                    {cart.length} Items
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {cart.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed">
                                        <ShoppingCart className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="text-sm text-gray-400 italic">El carrito está vacío</p>
                                </div>
                            ) : (
                                <div className="divide-y max-h-[500px] overflow-y-auto">
                                    {cart.map((item, index) => (
                                        <div key={index} className="p-4 bg-gray-50/30 hover:bg-gray-50 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-900">{item.packageTitle}</h4>
                                                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {item.departureDate ? new Date(item.departureDate).toLocaleDateString() : 'Fecha por confirmar'}
                                                        <span className="mx-1">•</span>
                                                        <Info className="w-3 h-3" /> {item.occupancyCode}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(index)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Users className="w-3 h-3" />
                                                    {item.paxAdults}A {item.paxChildren > 0 && `| ${item.paxChildren}N`}
                                                    <span className="bg-gray-200 px-1.5 rounded ml-1 text-[10px] font-bold">x{item.quantity}</span>
                                                </div>
                                                <span className="font-bold text-primary">
                                                    {orderCurrency} ${(item.price * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Totals Section */}
                            <div className="p-6 bg-gray-50 border-t space-y-4">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">{orderCurrency} ${calculateTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>IVA (Incluido):</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="text-lg font-bold text-gray-900">Total:</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-primary">
                                            {orderCurrency} ${calculateTotal().toLocaleString()}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                            Pago vía: {formData.paymentMethod}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-12 text-base font-bold gap-2 mt-2 bg-gray-900 hover:bg-black rounded-xl"
                                    disabled={submitting || cart.length === 0}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" /> Confirmar Orden
                                        </>
                                    )}
                                </Button>
                                <Link href="/admin/orders" className="block text-center text-xs text-gray-400 hover:text-primary transition-colors">
                                    Cancelar y volver al listado
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </form>
        </div>
    )
}
