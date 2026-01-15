"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function GeographyPage() {
    const [activeTab, setActiveTab] = useState("countries")

    // Countries
    const [newCountry, setNewCountry] = useState({ name: "", iso2: "" })

    // States
    const [newState, setNewState] = useState({ name: "", countryId: "" })

    // Cities
    const [newCity, setNewCity] = useState({ name: "", stateId: "" })

    const handleCreateCountry = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/admin/geography/countries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCountry),
            })
            if (response.ok) {
                alert("País creado exitosamente")
                setNewCountry({ name: "", iso2: "" })
            }
        } catch (error) {
            console.error(error)
            alert("Error al crear país")
        }
    }

    const handleCreateState = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/admin/geography/states", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newState),
            })
            if (response.ok) {
                alert("Estado creado exitosamente")
                setNewState({ name: "", countryId: "" })
            }
        } catch (error) {
            console.error(error)
            alert("Error al crear estado")
        }
    }

    const handleCreateCity = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/admin/geography/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCity),
            })
            if (response.ok) {
                alert("Ciudad creada exitosamente")
                setNewCity({ name: "", stateId: "" })
            }
        } catch (error) {
            console.error(error)
            alert("Error al crear ciudad")
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Geografía</h1>
                <p className="text-gray-600 mt-1">Gestiona países, estados y ciudades</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="countries">Países</TabsTrigger>
                    <TabsTrigger value="states">Estados</TabsTrigger>
                    <TabsTrigger value="cities">Ciudades</TabsTrigger>
                </TabsList>

                {/* PAÍSES */}
                <TabsContent value="countries">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Nuevo País</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateCountry} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="countryName">Nombre del País *</Label>
                                        <Input
                                            id="countryName"
                                            value={newCountry.name}
                                            onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                                            placeholder="Ej: México"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="iso2">Código ISO2 (opcional)</Label>
                                        <Input
                                            id="iso2"
                                            value={newCountry.iso2}
                                            onChange={(e) => setNewCountry({ ...newCountry, iso2: e.target.value.toUpperCase() })}
                                            placeholder="Ej: MX"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear País
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ESTADOS */}
                <TabsContent value="states">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Nuevo Estado/Provincia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateState} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stateName">Nombre del Estado *</Label>
                                    <Input
                                        id="stateName"
                                        value={newState.name}
                                        onChange={(e) => setNewState({ ...newState, name: e.target.value })}
                                        placeholder="Ej: Yucatán"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="countryId">ID del País *</Label>
                                    <Input
                                        id="countryId"
                                        value={newState.countryId}
                                        onChange={(e) => setNewState({ ...newState, countryId: e.target.value })}
                                        placeholder="ID del país"
                                        required
                                    />
                                    <p className="text-sm text-gray-500">
                                        Primero crea un país para poder asignar estados
                                    </p>
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Estado
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CIUDADES */}
                <TabsContent value="cities">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Nueva Ciudad</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateCity} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cityName">Nombre de la Ciudad *</Label>
                                    <Input
                                        id="cityName"
                                        value={newCity.name}
                                        onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                                        placeholder="Ej: Mérida"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stateId">ID del Estado *</Label>
                                    <Input
                                        id="stateId"
                                        value={newCity.stateId}
                                        onChange={(e) => setNewCity({ ...newCity, stateId: e.target.value })}
                                        placeholder="ID del estado"
                                        required
                                    />
                                    <p className="text-sm text-gray-500">
                                        Primero crea un estado para poder asignar ciudades
                                    </p>
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Ciudad
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-blue-900">💡 Orden de creación:</h3>
                        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                            <li>Primero crea un <strong>País</strong> (ej: México)</li>
                            <li>Luego crea <strong>Estados</strong> asociados a ese país (ej: Yucatán)</li>
                            <li>Finalmente crea <strong>Ciudades</strong> asociadas a los estados (ej: Mérida)</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
