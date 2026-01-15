"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Calendar, Users } from "lucide-react"

export function SimpleSearch() {
    const [searchData, setSearchData] = useState({
        destination: "",
        startDate: "",
        endDate: "",
        travelers: 2,
    })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí iría la lógica de búsqueda
        console.log("Buscando:", searchData)
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Busca tu viaje ideal</h2>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Destino */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Destino
                        </label>
                        <Input
                            type="text"
                            placeholder="¿A dónde quieres ir?"
                            value={searchData.destination}
                            onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                            className="h-12 border-2"
                        />
                    </div>

                    {/* Fecha inicio */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Fecha de inicio
                        </label>
                        <Input
                            type="date"
                            value={searchData.startDate}
                            onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                            className="h-12 border-2"
                        />
                    </div>

                    {/* Fecha fin */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Fecha de regreso
                        </label>
                        <Input
                            type="date"
                            value={searchData.endDate}
                            onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                            className="h-12 border-2"
                        />
                    </div>

                    {/* Viajeros */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            Viajeros
                        </label>
                        <Input
                            type="number"
                            min="1"
                            value={searchData.travelers}
                            onChange={(e) => setSearchData({ ...searchData, travelers: parseInt(e.target.value) || 1 })}
                            className="h-12 border-2"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white font-bold text-lg px-12 h-12"
                >
                    <Search className="w-5 h-5 mr-2" />
                    Buscar Paquetes
                </Button>
            </form>
        </div>
    )
}
