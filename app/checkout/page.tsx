"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { CreditCard, Lock, CheckCircle2, Building2, Banknote } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer" | "cash">("card")
  const [orderNumber, setOrderNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generar número de orden
    const orderNum = `ORD-${Date.now().toString().slice(-8)}`
    setOrderNumber(orderNum)
    setStep(3)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-display font-bold mb-2 text-gradient">Checkout</h1>
              <p className="text-text-muted">Completa tu reserva en unos simples pasos</p>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center justify-center mb-8 gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s ? "bg-gradient-toucan text-white shadow-lg" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s === 3 && step === 3 ? <CheckCircle2 className="w-6 h-6" /> : s}
                  </div>
                  {s < 3 && <div className={`w-16 h-1 ${step > s ? "bg-gradient-toucan" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            {step === 3 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 text-center border border-border"
              >
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gradient">Reserva Confirmada</h2>
                <p className="text-text-muted mb-2">Tu orden ha sido procesada exitosamente</p>
                <p className="text-2xl font-bold text-primary mb-6">Orden #{orderNumber}</p>
                <div className="bg-surface rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                  <p className="text-sm text-text-muted mb-2">Detalles enviados a:</p>
                  <p className="font-semibold">{user?.email}</p>
                  <p className="text-sm text-text-muted mt-4">Método de pago:</p>
                  <p className="font-semibold capitalize">
                    {paymentMethod === "card"
                      ? "Tarjeta de Crédito/Débito"
                      : paymentMethod === "transfer"
                        ? "Transferencia Bancaria"
                        : "Efectivo"}
                  </p>
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button
                    className="bg-gradient-toucan hover:opacity-90"
                    onClick={() => (window.location.href = "/perfil")}
                  >
                    Ver Mis Reservas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const message = `Hola, tengo la orden ${orderNumber} y necesito más información`
                      window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, "_blank")
                    }}
                  >
                    Contactar por WhatsApp
                  </Button>
                  <Button variant="ghost" onClick={() => (window.location.href = "/")}>
                    Volver al Inicio
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-border">
                    {step === 1 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-gradient">Información del Viajero</h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="nombre">Nombre completo</Label>
                            <Input id="nombre" defaultValue={user?.name} required className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input id="email" type="email" defaultValue={user?.email} required className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" type="tel" required className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="pais">País</Label>
                            <Input id="pais" required className="mt-1" />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setStep(2)}
                          className="w-full bg-gradient-toucan hover:opacity-90"
                        >
                          Continuar al Pago
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gradient">
                          <Lock className="w-6 h-6" />
                          Información de Pago
                        </h2>

                        <div className="mb-6">
                          <Label className="mb-3 block">Selecciona tu método de pago</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("card")}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                paymentMethod === "card"
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <CreditCard className="w-6 h-6 mx-auto mb-2 text-primary" />
                              <p className="text-xs font-semibold">Tarjeta</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("transfer")}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                paymentMethod === "transfer"
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <Building2 className="w-6 h-6 mx-auto mb-2 text-primary" />
                              <p className="text-xs font-semibold">Transferencia</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("cash")}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                paymentMethod === "cash"
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <Banknote className="w-6 h-6 mx-auto mb-2 text-primary" />
                              <p className="text-xs font-semibold">Efectivo</p>
                            </button>
                          </div>
                        </div>

                        {paymentMethod === "card" && (
                          <div className="space-y-4 mb-6">
                            <div>
                              <Label htmlFor="cardNumber">Número de tarjeta</Label>
                              <div className="relative">
                                <Input
                                  id="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  required
                                  className="mt-1 pl-10"
                                />
                                <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiry">Vencimiento</Label>
                                <Input id="expiry" placeholder="MM/AA" required className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" placeholder="123" required className="mt-1" />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                              <Input id="cardName" required className="mt-1" />
                            </div>
                          </div>
                        )}

                        {paymentMethod === "transfer" && (
                          <div className="bg-surface rounded-lg p-4 mb-6">
                            <h3 className="font-bold mb-3">Datos bancarios</h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold">Banco:</span> Bancomer
                              </p>
                              <p>
                                <span className="font-semibold">Cuenta:</span> 1234567890
                              </p>
                              <p>
                                <span className="font-semibold">CLABE:</span> 012345678901234567
                              </p>
                              <p>
                                <span className="font-semibold">Beneficiario:</span> Koneex Agencia de Viajes SA de CV
                              </p>
                            </div>
                            <p className="text-xs text-text-muted mt-3">
                              Envía tu comprobante de pago por WhatsApp con tu número de orden
                            </p>
                          </div>
                        )}

                        {paymentMethod === "cash" && (
                          <div className="bg-surface rounded-lg p-4 mb-6">
                            <h3 className="font-bold mb-3">Pago en efectivo</h3>
                            <p className="text-sm text-text-muted mb-3">
                              Visita nuestra oficina o realiza el pago en cualquiera de nuestros puntos autorizados
                            </p>
                            <div className="text-sm">
                              <p className="font-semibold mb-1">Dirección:</p>
                              <p>Av. Principal #123, Col. Centro</p>
                              <p className="mt-2">
                                <span className="font-semibold">Horario:</span> Lun-Vie 9:00-18:00
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                            Volver
                          </Button>
                          <Button type="submit" className="flex-1 bg-gradient-toucan hover:opacity-90">
                            Confirmar Pedido
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl p-6 border border-border shadow-lg sticky top-24">
                    <h3 className="font-bold text-lg mb-4 text-gradient">Resumen del Pedido</h3>
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
                            <p className="text-xs text-text-muted">
                              {item.quantity}x ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-text-muted">Subtotal</span>
                        <span className="font-semibold">${total}</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-text-muted">Impuestos</span>
                        <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mt-4 pt-4 border-t">
                        <span className="font-bold">Total</span>
                        <span className="text-2xl font-bold text-gradient">${(total * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
