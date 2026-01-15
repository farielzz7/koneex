"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewAirlinePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        iataCode: "",
        isActive: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch("/api/admin/airlines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/admin/airlines")
            } else {
                alert("Error al crear aerolínea")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al crear aerolínea")
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/airlines">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nueva Aerolínea</h1>
                    <p className="text-gray-600 mt-1">Registra una nueva aerolínea</p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Información de la Aerolínea</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre de la Aerolínea *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Aeroméxico"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="iataCode">Código IATA</Label>
                            <Input
                                id="iataCode"
                                value={formData.iataCode}
                                onChange={(e) => setFormData({ ...formData, iataCode: e.target.value.toUpperCase() })}
                                placeholder="Ej: AM (2 letras)"
                                maxLength={2}
                            />
                            <p className="text-sm text-gray-500">
                                Código de 2 letras de la IATA (opcional)
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
                            <Label htmlFor="isActive">Aerolínea activa</Label>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1">
                                Crear Aerolínea
                            </Button>
                            <Link href="/admin/airlines" className="flex-1">
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
