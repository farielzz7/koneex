"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { CheckoutRedirect } from "@/components/redirect-handler"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { isAuthenticated, setRedirectUrl } = useAuth()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const router = useRouter()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true)
      setRedirectUrl("/carrito")
    } else {
      // Proceder al pago
      router.push("/checkout")
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">Tu carrito está vacío</h1>
            <p className="text-text-muted mb-8">Explora nuestros increíbles paquetes y experiencias</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/paquetes">
                <Button className="bg-gradient-toucan hover:opacity-90 w-full sm:w-auto">Ver Paquetes</Button>
              </Link>
              <Link href="/experiencias">
                <Button variant="outline" className="bg-transparent w-full sm:w-auto">
                  Ver Experiencias
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2 text-gradient">Tu Carrito</h1>
          <p className="text-text-muted">Revisa tu selección y procede al pago</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 md:p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-bold text-lg mb-1 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-text-muted">{item.destination || item.location}</p>
                        <p className="text-sm text-text-muted">{item.duration}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-danger hover:text-danger hover:bg-danger/10 flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 bg-surface rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 hover:bg-primary/10"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 hover:bg-primary/10"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient">${item.price * item.quantity}</div>
                        <div className="text-xs text-text-muted">${item.price} por persona</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full bg-transparent text-danger hover:bg-danger/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vaciar carrito
            </Button>
          </div>

          <div className="lg:col-span-1">
            {showAuthPrompt && !isAuthenticated ? (
              <div className="sticky top-24">
                <CheckoutRedirect />
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 border border-border shadow-lg sticky top-24">
                <h2 className="text-xl font-display font-bold mb-6 text-gradient">Resumen del Pedido</h2>

                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Código de descuento</label>
                  <div className="flex gap-2">
                    <Input placeholder="Ingresa tu código" className="border-border focus:border-primary" />
                    <Button variant="outline" className="bg-transparent flex-shrink-0 hover:bg-primary/10">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Impuestos (10%)</span>
                    <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Descuento</span>
                    <span className="text-accent font-semibold">-$0</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gradient">${(total * 1.1).toFixed(2)}</div>
                    <div className="text-xs text-text-muted">USD</div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-gradient-toucan hover:opacity-90 text-lg mb-3 shadow-lg"
                >
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] border-0 shadow-md"
                >
                  Consultar por WhatsApp
                </Button>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-sm text-text-muted space-y-2">
                    <p className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Pago seguro con encriptación SSL</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Reserva ahora y paga después</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Cancelación flexible disponible</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
