"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewHotelPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        cityId: "",
        stars: 3,
        isActive: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch("/api/admin/hotels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/admin/hotels")
            } else {
                alert("Error al crear hotel")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al crear hotel")
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/hotels">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nuevo Hotel</h1>
                    <p className="text-gray-600 mt-1">Registra un nuevo hotel</p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Información del Hotel</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Hotel *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Hotel Riu Cancún"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stars">Estrellas</Label>
                            <Select
                                value={formData.stars.toString()}
                                onValueChange={(value) => setFormData({ ...formData, stars: parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">⭐ 1 Estrella</SelectItem>
                                    <SelectItem value="2">⭐⭐ 2 Estrellas</SelectItem>
                                    <SelectItem value="3">⭐⭐⭐ 3 Estrellas</SelectItem>
                                    <SelectItem value="4">⭐⭐⭐⭐ 4 Estrellas</SelectItem>
                                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Estrellas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cityId">Ciudad *</Label>
                            <Input
                                id="cityId"
                                value={formData.cityId}
                                onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                                placeholder="ID de la ciudad (temporal)"
                                required
                            />
                            <p className="text-sm text-gray-500">
                                Nota: Primero debes crear ciudades en la sección de Geografía
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="isActive">Hotel activo</Label>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1">
                                Crear Hotel
                            </Button>
                            <Link href="/admin/hotels" className="flex-1">
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
