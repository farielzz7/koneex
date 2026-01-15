"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Search, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Departure {
    id: string
    startDate: string
    endDate: string
    basePrice: number
    capacity: number | null
    isActive: boolean
    package: {
        title: string
    }
    currency: {
        code: string
    }
}

export default function DeparturesPage() {
    const [departures, setDepartures] = useState<Departure[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchDepartures()
    }, [])

    const fetchDepartures = async () => {
        try {
            const response = await fetch("/api/admin/departures")
            if (response.ok) {
                const data = await response.json()
                setDepartures(data)
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredDepartures = departures.filter((dep) =>
        dep.package.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const isPast = (endDate: string) => {
        return new Date(endDate) < new Date()
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64">Cargando...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Salidas</h1>
                    <p className="text-gray-600 mt-1">Gestiona las fechas y precios de los paquetes</p>
                </div>
                <Link href="/admin/departures/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nueva Salida
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por paquete..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todas las Salidas ({filteredDepartures.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredDepartures.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? "No se encontraron salidas" : "No hay salidas programadas"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Intenta con otro término" : "Crea salidas asignando fechas y precios a los paquetes"}
                            </p>
                            {!searchTerm && (
                                <Link href="/admin/departures/new">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Salida
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Paquete</th>
                                        <th className="text-left py-3 px-4">Fecha Inicio</th>
                                        <th className="text-left py-3 px-4">Fecha Fin</th>
                                        <th className="text-left py-3 px-4">Precio</th>
                                        <th className="text-left py-3 px-4">Capacidad</th>
                                        <th className="text-left py-3 px-4">Estado</th>
                                        <th className="text-right py-3 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDepartures.map((departure) => (
                                        <tr key={departure.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{departure.package.title}</td>
                                            <td className="py-3 px-4">
                                                {new Date(departure.startDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={isPast(departure.endDate) ? "text-red-600" : ""}>
                                                    {new Date(departure.endDate).toLocaleDateString()}
                                                    {isPast(departure.endDate) && " ⚠️"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-semibold text-green-600">
                                                    {departure.currency.code} ${departure.basePrice.toString()}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {departure.capacity ? (
                                                    <span>{departure.capacity} personas</span>
                                                ) : (
                                                    <span className="text-gray-400">Ilimitado</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${departure.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {departure.isActive ? "Activa" : "Inactiva"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" title="Editar">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" title="Eliminar">
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
