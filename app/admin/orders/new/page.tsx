"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Trash2, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Customer {
    id: string
    user: { name: string; email: string } | null
}

interface Package {
    id: string
    title: string
    priceFrom?: number
    priceTo?: number
}

interface CartItem {
    packageId: string
    packageTitle: string
    quantity: number
    price: string
}

export default function NewOrderPage() {
    const router = useRouter()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [packages, setPackages] = useState<Package[]>([])
    const [cart, setCart] = useState<CartItem[]>([])

    const [formData, setFormData] = useState({
        customerId: "",
        paymentMethod: "transfer" as "transfer" | "card" | "cash" | "paypal",
        status: "PENDING" as "PENDING" | "PAID" | "CANCELLED" | "REFUNDED",
        notes: "",
    })

    const [selectedPackage, setSelectedPackage] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [price, setPrice] = useState("")

    useEffect(() => {
        fetchCustomers()
        fetchPackages()
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
        }
    }

    const fetchPackages = async () => {
        try {
            const response = await fetch("/api/admin/packages")
            if (response.ok) {
                const data = await response.json()
                setPackages(data)
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    const addToCart = () => {
        if (!selectedPackage || !price) {
            alert("Selecciona un paquete y define el precio")
            return
        }

        const pkg = packages.find(p => p.id === selectedPackage)
        if (!pkg) return

        setCart([...cart, {
            packageId: selectedPackage,
            packageTitle: pkg.title,
            quantity,
            price,
        }])

        // Reset
        setSelectedPackage("")
        setQuantity(1)
        setPrice("")
    }

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index))
    }

    const calculateTotal = () => {
        return cart.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity)
        }, 0)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (cart.length === 0) {
            alert("Agrega al menos un paquete al carrito")
            return
        }

        try {
            const total = calculateTotal()

            const response = await fetch("/api/admin/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: formData.customerId,
                    currencyId: "temp-mxn-id", // Temporal
                    status: formData.status,
                    paymentMethod: formData.paymentMethod,
                    notes: formData.notes,
                    items: cart.map(item => ({
                        departureId: "temp-departure-id", // Temporal
                        quantity: item.quantity,
                        unitPrice: parseFloat(item.price),
                    })),
                    subtotal: total,
                    discount: 0,
                    total: total,
                }),
            })

            if (response.ok) {
                router.push("/admin/orders")
            } else {
                const error = await response.json()
                alert(error.error || "Error al crear orden")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al crear orden")
        }
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nueva Orden de Compra</h1>
                    <p className="text-gray-600 mt-1">Registra una venta de paquetes</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
                {/* Left Column - Order Form */}
                <div className="col-span-2 space-y-6">
                    {/* Cliente y Estado */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerId">Cliente *</Label>
                                <Select
                                    value={formData.customerId}
                                    onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id}>
                                                {customer.user?.name || "Sin nombre"} - {customer.user?.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-gray-500">
                                    ¿No está registrado? <Link href="/admin/customers/new" className="text-primary hover:underline">Crear cliente</Link>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod">Forma de Pago</Label>
                                    <Select
                                        value={formData.paymentMethod}
                                        onValueChange={(value: any) => setFormData({ ...formData, paymentMethod: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bank_deposit">🏦 Depósito Bancario</SelectItem>
                                            <SelectItem value="mercado_pago">💳 Mercado Pago</SelectItem>
                                            <SelectItem value="cash">💵 Efectivo</SelectItem>
                                            <SelectItem value="transfer">🔄 Transferencia</SelectItem>
                                            <SelectItem value="credit">💳 Crédito</SelectItem>
                                            <SelectItem value="debit">💳 Débito</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Estado del Pago</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">⏳ Pendiente</SelectItem>
                                            <SelectItem value="PAID">✅ Pagada</SelectItem>
                                            <SelectItem value="CANCELLED">❌ Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas (opcional)</Label>
                                <Input
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Comentarios adicionales sobre la orden..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agregar Paquetes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Agregar Paquetes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-2">
                                    <Label>Paquete</Label>
                                    <Select
                                        value={selectedPackage}
                                        onValueChange={(value) => {
                                            setSelectedPackage(value)
                                            const pkg = packages.find(p => p.id === value)
                                            if (pkg && pkg.priceFrom) {
                                                setPrice(pkg.priceFrom.toString())
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {packages.map((pkg) => (
                                                <SelectItem key={pkg.id} value={pkg.id}>
                                                    {pkg.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Cantidad</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Precio Unitario</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <Button type="button" onClick={addToCart} className="w-full" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar al Carrito
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Cart */}
                <div className="col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                Carrito ({cart.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    Carrito vacío
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {cart.map((item, index) => (
                                            <div key={index} className="border rounded-lg p-3 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{item.packageTitle}</p>
                                                        <p className="text-xs text-gray-600">
                                                            Cantidad: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFromCart(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">${item.price} × {item.quantity}</span>
                                                    <span className="font-semibold">
                                                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span>${calculateTotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Descuento:</span>
                                            <span>-$0.00</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                                            <span>Total:</span>
                                            <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" size="lg">
                                        Crear Orden
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </form>

            <div className="col-span-full">
                <Link href="/admin/orders">
                    <Button type="button" variant="outline" className="w-full">
                        Cancelar
                    </Button>
                </Link>
            </div>
        </div>
    )
}
