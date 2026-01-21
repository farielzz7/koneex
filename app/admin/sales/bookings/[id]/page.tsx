"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Check, CreditCard, Download, Loader2, User, Calendar } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Define interfaces locally or import
interface Payment {
    id: number
    amount: number
    method: string
    status: string
    provider_reference: string
    created_at: string
}

interface Booking {
    id: number
    booking_code: string
    status: string
    total_amount: number
    paid_amount: number
    currency_code: string
    created_at: string
    customer: {
        full_name: string
        email: string
        phone: string
    }
    items: {
        title: string
        travel_date: string
        adults: number
        children: number
        subtotal: number
    }[]
    payments: Payment[]
}

export default function BookingDetailPage() {
    const params = useParams()
    const [booking, setBooking] = useState<Booking | null>(null)
    const [loading, setLoading] = useState(true)

    // Payment Modal State
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [paymentForm, setPaymentForm] = useState({
        amount: "",
        method: "TRANSFER",
        reference: "",
        notes: ""
    })
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`/api/admin/sales/bookings/${params.id}`)
                if (!res.ok) throw new Error("Error")
                const data = await res.json()
                setBooking(data)
            } catch (e) {
                toast.error("No se pudo cargar la reserva")
            } finally {
                setLoading(false)
            }
        }
        fetchBooking()
    }, [params.id])

    const handleRegisterPayment = async () => {
        setIsSubmittingPayment(true)
        try {
            const payload = {
                booking_id: booking?.id,
                amount: parseFloat(paymentForm.amount),
                method: paymentForm.method,
                provider_reference: paymentForm.reference,
                notes: paymentForm.notes
            }

            const res = await fetch(`/api/admin/sales/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Error")
            // const result = await res.json()

            toast.success("Pago registrado correctamente")
            setIsPaymentOpen(false)
            setPaymentForm({ amount: "", method: "TRANSFER", reference: "", notes: "" })

            // Refresh booking data
            const res2 = await fetch(`/api/admin/sales/bookings/${params.id}`)
            const updatedBooking = await res2.json()
            setBooking(updatedBooking)

        } catch (e) {
            toast.error("Error al registrar pago")
        } finally {
            setIsSubmittingPayment(false)
        }
    }

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
    if (!booking) return <div className="p-10 text-center">Reserva no encontrada</div>

    const pendingAmount = booking.total_amount - booking.paid_amount

    return (
        <div className="max-w-6xl mx-auto py-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold tracking-tight">{booking.booking_code || `Reserva #${booking.id}`}</h1>
                        <Badge className={
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                        }>
                            {booking.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Creada el {booking.created_at ? format(new Date(booking.created_at), "dd MMM yyyy HH:mm", { locale: es }) : '-'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    <Button variant="default">
                        Enviar Voucher
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                <div className="space-y-6">
                    {/* CUSTOMER INFO */}
                    <Card>
                        <CardHeader className="bg-muted/30 pb-3">
                            <CardTitle className="text-md flex items-center gap-2">
                                <User className="w-4 h-4" /> Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-3 gap-4">
                            {booking.customer ? (
                                <>
                                    <div>
                                        <Label className="text-muted-foreground text-xs">Nombre</Label>
                                        <div className="font-medium">{booking.customer.full_name}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-xs">Email</Label>
                                        <div className="font-medium">{booking.customer.email}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-xs">Teléfono</Label>
                                        <div className="font-medium">{booking.customer.phone}</div>
                                    </div>
                                </>
                            ) : <div>Cliente no disponible</div>}
                        </CardContent>
                    </Card>

                    {/* ITEMS */}
                    <Card>
                        <CardHeader className="bg-muted/30 pb-3">
                            <CardTitle className="text-md">Detalle del Viaje</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {booking.items && booking.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <div className="font-bold text-lg">{item.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Fecha de viaje: {item.travel_date ? format(new Date(item.travel_date), "dd MMMM yyyy", { locale: es }) : '-'}
                                        </div>
                                        <div className="text-sm mt-1">
                                            {item.adults} Adultos, {item.children} Niños
                                        </div>
                                    </div>
                                    <div className="text-right font-medium">
                                        ${item.subtotal?.toLocaleString()} {booking.currency_code}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* PAYMENTS HISTORY */}
                    <Card>
                        <CardHeader className="bg-muted/30 pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-md">Historial de Pagos</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {(!booking.payments || booking.payments.length === 0) ? (
                                <p className="text-muted-foreground text-center py-4">No hay pagos registrados.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-muted-foreground text-left border-b">
                                            <th className="pb-2">Fecha</th>
                                            <th className="pb-2">Método</th>
                                            <th className="pb-2">Referencia</th>
                                            <th className="pb-2 text-right">Monto</th>
                                            <th className="pb-2 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {booking.payments.map((pay) => (
                                            <tr key={pay.id}>
                                                <td className="py-3">{pay.created_at ? format(new Date(pay.created_at), "dd/MM/yyyy", { locale: es }) : '-'}</td>
                                                <td className="py-3">{pay.method}</td>
                                                <td className="py-3 font-mono text-xs">{pay.provider_reference}</td>
                                                <td className="py-3 text-right font-medium">${pay.amount.toLocaleString()}</td>
                                                <td className="py-3 text-right">
                                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                        {pay.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* SIDEBAR TOTALS */}
                <div className="space-y-6">
                    <Card className="border-2 border-primary/10 shadow-sm">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle>Estado de Cuenta</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Total del Viaje</span>
                                <span className="font-bold">${booking.total_amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Pagado</span>
                                <span>- ${booking.paid_amount.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Pendiente</span>
                                <span className={pendingAmount > 0 ? "text-red-600" : "text-green-600"}>
                                    ${pendingAmount.toLocaleString()} {booking.currency_code}
                                </span>
                            </div>

                            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full mt-4" size="lg" disabled={pendingAmount <= 0}>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Registrar Pago
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Monto</Label>
                                                <Input
                                                    type="number"
                                                    value={paymentForm.amount}
                                                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                                    placeholder={pendingAmount.toString()}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Método</Label>
                                                <Select
                                                    value={paymentForm.method}
                                                    onValueChange={(v) => setPaymentForm({ ...paymentForm, method: v })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="TRANSFER">Transferencia</SelectItem>
                                                        <SelectItem value="CARD">Tarjeta</SelectItem>
                                                        <SelectItem value="CASH">Efectivo</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Referencia (Comprobante)</Label>
                                            <Input
                                                value={paymentForm.reference}
                                                onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                                                placeholder="Ej. Folio de banco, ID Stripe..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Notas Internas</Label>
                                            <Textarea
                                                value={paymentForm.notes}
                                                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                                placeholder="Notas opcionales..."
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Cancelar</Button>
                                        <Button onClick={handleRegisterPayment} disabled={isSubmittingPayment || !paymentForm.amount}>
                                            {isSubmittingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Pago"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
