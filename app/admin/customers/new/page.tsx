"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Check, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const ESTADOS_MEXICO = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
    "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato",
    "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos",
    "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
    "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas",
    "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas", "CDMX"
]

export default function NewCustomerPage() {
    const router = useRouter()
    const [isInternational, setIsInternational] = useState(false)
    const [searchState, setSearchState] = useState("")
    const [showStateList, setShowStateList] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        state: "",
        customState: "",
    })

    const filteredStates = ESTADOS_MEXICO.filter(estado =>
        estado.toLowerCase().includes(searchState.toLowerCase())
    )

    const handleStateSelect = (value: string) => {
        if (value === "INTERNACIONAL") {
            setIsInternational(true)
            setFormData({ ...formData, state: "Internacional", customState: "" })
        } else {
            setIsInternational(false)
            setFormData({ ...formData, state: value, customState: "" })
        }
        setShowStateList(false)
        setSearchState("")
    }

    const clearState = () => {
        setFormData({ ...formData, state: "", customState: "" })
        setIsInternational(false)
        setSearchState("")
        setShowStateList(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const finalState = isInternational ? formData.customState : formData.state

        if (!finalState) {
            alert("Por favor selecciona o escribe el estado")
            return
        }

        try {
            const response = await fetch("/api/admin/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    state: finalState,
                }),
            })

            if (response.ok) {
                router.push("/admin/customers")
            } else {
                const error = await response.json()
                alert(error.error || "Error al registrar cliente")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al registrar cliente")
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/customers">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
                    <p className="text-gray-600 mt-1">Registra un nuevo cliente</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Juan Pérez García"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="ejemplo@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="999 123 4567"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">Estado *</Label>

                            {formData.state && !showStateList ? (
                                // Show selected state with option to change
                                <div className="flex gap-2">
                                    <div className="flex-1 px-4 py-2 border rounded-md bg-gray-50 flex items-center justify-between">
                                        <span className="font-medium">{formData.state}</span>
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearState}
                                        size="icon"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                // Show searchable dropdown
                                <div className="relative">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="state"
                                            value={searchState}
                                            onChange={(e) => {
                                                setSearchState(e.target.value)
                                                setShowStateList(true)
                                            }}
                                            onFocus={() => setShowStateList(true)}
                                            placeholder="Buscar estado o país..."
                                            className="pl-10"
                                            autoComplete="off"
                                        />
                                    </div>

                                    {showStateList && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                            {filteredStates.length > 0 ? (
                                                <>
                                                    {filteredStates.map((estado) => (
                                                        <button
                                                            key={estado}
                                                            type="button"
                                                            onClick={() => handleStateSelect(estado)}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                                        >
                                                            {estado}
                                                        </button>
                                                    ))}
                                                    <div className="border-t">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStateSelect("INTERNACIONAL")}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold text-primary"
                                                        >
                                                            🌍 Internacional
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="px-4 py-8 text-center text-gray-500">
                                                    <p>No se encontraron estados</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStateSelect("INTERNACIONAL")}
                                                        className="mt-2 text-primary hover:underline font-medium"
                                                    >
                                                        Seleccionar Internacional
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            <p className="text-sm text-gray-500">
                                {formData.state ? "Click en ✕ para cambiar" : "Escribe para buscar rápidamente"}
                            </p>
                        </div>

                        {isInternational && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="customState">País/Estado Internacional *</Label>
                                <Input
                                    id="customState"
                                    value={formData.customState}
                                    onChange={(e) => setFormData({ ...formData, customState: e.target.value })}
                                    placeholder="Ej: Estados Unidos, España, Colombia..."
                                    required={isInternational}
                                />
                                <p className="text-sm text-gray-500">
                                    Escribe el país o estado del cliente internacional
                                </p>
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                ℹ️ No se requiere contraseña. Este es un registro simple de cliente.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1">
                                Registrar Cliente
                            </Button>
                            <Link href="/admin/customers" className="flex-1">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Click outside to close dropdown */}
            {showStateList && !formData.state && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStateList(false)}
                />
            )}
        </div>
    )
}
