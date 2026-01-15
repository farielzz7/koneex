"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPromotionPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        type: "PERCENT" as "PERCENT" | "FIXED",
        value: "",
        currencyId: "",
        startsAt: "",
        endsAt: "",
        maxUses: "",
        isActive: false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch("/api/admin/promotions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    value: parseFloat(formData.value),
                    maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
                    startsAt: formData.startsAt || null,
                    endsAt: formData.endsAt || null,
                }),
            })

            if (response.ok) {
                router.push("/admin/promotions")
            } else {
                alert("Error al crear promoción")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al crear promoción")
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/promotions">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nueva Promoción</h1>
                    <p className="text-gray-600 mt-1">Crea un código promocional o descuento</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información de la Promoción</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Código Promocional</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="Ej: VERANO2026"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Descuento de Verano"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Descuento *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: "PERCENT" | "FIXED") => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERCENT">Porcentaje (%)</SelectItem>
                                        <SelectItem value="FIXED">Monto Fijo ($)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="value">Valor *</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    step="0.01"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    placeholder={formData.type === "PERCENT" ? "Ej: 15" : "Ej: 500"}
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    {formData.type === "PERCENT" ? "Porcentaje de descuento" : "Monto fijo en la moneda seleccionada"}
                                </p>
                            </div>
                        </div>

                        {formData.type === "FIXED" && (
                            <div className="space-y-2">
                                <Label htmlFor="currencyId">ID de Moneda</Label>
                                <Input
                                    id="currencyId"
                                    value={formData.currencyId}
                                    onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
                                    placeholder="ID de la moneda"
                                />
                                <p className="text-sm text-gray-500">
                                    Requerido para descuentos de monto fijo
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startsAt">Fecha de Inicio</Label>
                                <Input
                                    id="startsAt"
                                    type="datetime-local"
                                    value={formData.startsAt}
                                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endsAt">Fecha de Fin</Label>
                                <Input
                                    id="endsAt"
                                    type="datetime-local"
                                    value={formData.endsAt}
                                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxUses">Usos Máximos</Label>
                            <Input
                                id="maxUses"
                                type="number"
                                value={formData.maxUses}
                                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                placeholder="Dejar vacío para ilimitado"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="isActive">Promoción activa</Label>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1">
                                Crear Promoción
                            </Button>
                            <Link href="/admin/promotions" className="flex-1">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
