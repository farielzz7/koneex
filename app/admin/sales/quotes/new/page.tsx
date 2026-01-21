"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Search, Plus, User, FileText, Calendar, Loader2, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function NewQuotePage() {
    const router = useRouter()

    // Stage 1: Customer Selection
    const [customerSearch, setCustomerSearch] = useState("")
    const [customerResults, setCustomerResults] = useState<any[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [loadingCustomers, setLoadingCustomers] = useState(false)

    // Stage 2: Items
    const [items, setItems] = useState<any[]>([])

    // Package Search
    const [packageSearch, setPackageSearch] = useState("")
    const [packageResults, setPackageResults] = useState<any[]>([])
    const [showPackageSearch, setShowPackageSearch] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Debounce Customer Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (customerSearch.length > 2) {
                setLoadingCustomers(true)
                try {
                    const res = await fetch(`/api/admin/sales/customers/search?q=${customerSearch}`)
                    const data = await res.json()
                    setCustomerResults(Array.isArray(data) ? data : [])
                } catch (e) { console.error(e) }
                setLoadingCustomers(false)
            } else {
                setCustomerResults([])
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [customerSearch])

    // Debounce Package Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (packageSearch.length > 2) {
                try {
                    const res = await fetch(`/api/admin/sales/packages/search?q=${packageSearch}`)
                    const data = await res.json()
                    setPackageResults(Array.isArray(data) ? data : [])
                } catch (e) { console.error(e) }
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [packageSearch])

    const handleAddCustomer = (c: any) => {
        setSelectedCustomer(c)
        setCustomerSearch("")
        setCustomerResults([])
    }

    const addItem = (pkg: any) => {
        setItems([...items, {
            package_id: pkg.id,
            title: pkg.title,
            travel_date: new Date().toISOString(),
            adults: 2,
            children: 0,
            unit_price: 15000, // TODO: Fetch real BASE price or use Wizard Data from DB
            quantity: 1
        }])
        setShowPackageSearch(false)
        setPackageSearch("")
    }

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const handleGenerateQuote = async () => {
        if (!selectedCustomer || items.length === 0) return
        setIsSubmitting(true)

        try {
            const total = items.reduce((acc, item) => acc + (item.unit_price * (item.adults + item.children) * item.quantity), 0)

            const payload = {
                customer_id: selectedCustomer.id,
                currency_code: 'MXN', // Default or selector
                total_amount: total,
                items: items,
                valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
                notes: ""
            }

            const res = await fetch("/api/admin/sales/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                const quote = await res.json()
                toast.success("Cotización generada correctamente")
                // In a real app we'd redirect to the ID
                router.push("/admin/sales")
            } else {
                toast.error("Error al generar cotización")
            }
        } catch (error) {
            toast.error("Error de conexión")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nueva Cotización</h1>
                <p className="text-muted-foreground">Crea una propuesta formal para un cliente.</p>
            </div>

            <div className="grid md:grid-cols-[1fr_350px] gap-8">
                <div className="space-y-6">
                    {/* CUSTOMER SECTION */}
                    <Card>
                        <CardHeader className="pb-3 border-b bg-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {!selectedCustomer ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar por nombre o email..."
                                            className="pl-9"
                                            value={customerSearch}
                                            onChange={(e) => setCustomerSearch(e.target.value)}
                                        />
                                        {loadingCustomers && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-muted-foreground" />}
                                    </div>

                                    {customerResults.length > 0 && (
                                        <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
                                            {customerResults.map(c => (
                                                <div
                                                    key={c.id}
                                                    className="p-3 hover:bg-muted cursor-pointer flex justify-between items-center"
                                                    onClick={() => handleAddCustomer(c)}
                                                >
                                                    <div>
                                                        <div className="font-medium">{c.full_name || c.name}</div>
                                                        <div className="text-xs text-muted-foreground">{c.email}</div>
                                                    </div>
                                                    <Button size="sm" variant="ghost">Seleccionar</Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {customerSearch.length > 2 && customerResults.length === 0 && !loadingCustomers && (
                                        <div className="text-center text-sm text-muted-foreground py-2">
                                            No se encontraron clientes.
                                            <Button variant="link" className="h-auto p-0 ml-1">Crear nuevo</Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                            {(selectedCustomer.full_name || selectedCustomer.name || "C").charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-blue-900">{selectedCustomer.full_name || selectedCustomer.name}</div>
                                            <div className="text-sm text-blue-700">{selectedCustomer.email}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>Cambiar</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ITEMS SECTION */}
                    <Card>
                        <CardHeader className="pb-3 border-b bg-muted/20">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                Ítems de la Cotización
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                    No hay ítems agregados. Agrega un paquete o servicio.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {items.map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 border rounded-lg bg-card relative group">
                                            <div className="flex-1 space-y-2">
                                                <div className="font-medium text-lg">{item.title}</div>
                                                <div className="flex gap-4">
                                                    <div className="grid gap-1">
                                                        <Label className="text-xs text-muted-foreground">Fecha Viaje</Label>
                                                        <div className="flex items-center text-sm border rounded px-2 py-1 bg-muted/50">
                                                            <Calendar className="w-3 h-3 mr-2" />
                                                            {new Date().toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-1">
                                                        <Label className="text-xs text-muted-foreground">Pax</Label>
                                                        <div className="flex items-center text-sm border rounded px-2 py-1 bg-muted/50 w-24">
                                                            {item.adults} Adultos
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold">${item.unit_price.toLocaleString()}</div>
                                                <div className="text-xs text-muted-foreground">por persona</div>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveItem(i)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t relative">
                                {!showPackageSearch ? (
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => setShowPackageSearch(true)}>
                                        <Plus className="w-4 h-4 mr-2" /> Agregar Paquete al Presupuesto
                                    </Button>
                                ) : (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Buscar paquete..."
                                                className="pl-9"
                                                value={packageSearch}
                                                onChange={(e) => setPackageSearch(e.target.value)}
                                                autoFocus
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-1 top-1 h-8 px-2"
                                                onClick={() => { setShowPackageSearch(false); setPackageSearch(""); }}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                        {packageResults.length > 0 && (
                                            <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto bg-popover text-popover-foreground shadow-md absolute w-full z-10">
                                                {packageResults.map(pkg => (
                                                    <div
                                                        key={pkg.id}
                                                        className="p-3 hover:bg-muted cursor-pointer"
                                                        onClick={() => addItem(pkg)}
                                                    >
                                                        <div className="font-medium">{pkg.title}</div>
                                                        <div className="text-xs text-muted-foreground">{pkg.slug}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* SUMMARY SIDEBAR */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${items.reduce((acc, item) => acc + (item.unit_price * (item.adults + item.children) * item.quantity), 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Impuestos</span>
                                <span>$0.00</span>
                            </div>
                            <Separator />
                            <div className="pt-2 flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>${items.reduce((acc, item) => acc + (item.unit_price * (item.adults + item.children) * item.quantity), 0).toLocaleString()}</span>
                            </div>

                            <Button
                                className="w-full"
                                size="lg"
                                disabled={items.length === 0 || !selectedCustomer || isSubmitting}
                                onClick={handleGenerateQuote}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generando...
                                    </>
                                ) : (
                                    "Generar Cotización"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
