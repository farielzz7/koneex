"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Package {
    id: string
    title: string
}

export default function NewDeparturePage() {
    const router = useRouter()
    const [packages, setPackages] = useState<Package[]>([])

    const [formData, setFormData] = useState({
        packageId: "",
        startDate: "",
        endDate: "",
        basePrice: "",
        capacity: "",
        currencyId: "",
        isActive: true,
    })

    useEffect(() => {
        fetchPackages()
    }, [])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch("/api/admin/departures", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    basePrice: parseFloat(formData.basePrice),
                    capacity: formData.capacity ? parseInt(formData.capacity) : null,
                }),
            })

            if (response.ok) {
                router.push("/admin/departures")
            } else {
                const error = await response.json()
                alert(error.error || "Error al crear salida")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Error al crear salida")
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/departures">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nueva Salida</h1>
                    <p className="text-gray-600 mt-1">Programa una nueva fecha para un paquete</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información de la Salida</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="packageId">Paquete *</Label>
                            <Select
                                value={formData.packageId}
                                onValueChange={(value) => setFormData({ ...formData, packageId: value })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un paquete" />
                                </SelectTrigger>
                                <SelectContent>
                                    {packages.map((pkg) => (
                                        <SelectItem key={pkg.id} value={pkg.id}>
                                            {pkg.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-gray-500">
                                ¿No existe el paquete? <Link href="/admin/packages/new" className="text-primary hover:underline">Créalo primero</Link>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">Fecha de Fin *</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="basePrice">Precio Base *</Label>
                                <Input
                                    id="basePrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                    placeholder="9999.00"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currencyId">ID de Moneda *</Label>
                                <Input
                                    id="currencyId"
                                    value={formData.currencyId}
                                    onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
                                    placeholder="ID de la moneda (MXN, USD)"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacidad (opcional)</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                placeholder="Número máximo de personas (dejar vacío para ilimitado)"
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
                            <Label htmlFor="isActive">Salida activa (visible para clientes)</Label>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Nota:</strong> Una vez configurada la base de datos, podrás asignar hoteles y aerolíneas específicas a cada salida.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1">
                                Crear Salida
                            </Button>
                            <Link href="/admin/departures" className="flex-1">
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
