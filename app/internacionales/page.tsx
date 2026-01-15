"use client"

import { Header } from "@/components/header"
import { PackageCard } from "@/components/package-card"
import { Footer } from "@/components/footer"
import { internationalPackages } from "@/lib/mock-data"
import { Globe, Plane } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function InternacionalesPage() {
    const [selectedContinent, setSelectedContinent] = useState<string>("Todos")

    // Obtener continentes únicos
    const continents = ["Todos", ...new Set(internationalPackages.map((pkg) => pkg.continent))]

    // Filtrar paquetes por continente
    const filteredPackages =
        selectedContinent === "Todos"
            ? internationalPackages
            : internationalPackages.filter((pkg) => pkg.continent === selectedContinent)

    return (
        <div className="min-h-screen bg-surface">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Plane className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-white">Viajes al extranjero</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">
                            Destinos Internacionales
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 text-pretty">
                            Explora el mundo con nuestros paquetes diseñados para vivir las mejores experiencias en cada continente.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Filtros por continente */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold">Explora por Continente</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {continents.map((continent) => (
                            <button
                                key={continent}
                                onClick={() => setSelectedContinent(continent)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedContinent === continent
                                        ? "bg-primary text-white shadow-lg scale-105"
                                        : "bg-white border-2 border-gray-200 text-text hover:border-primary hover:shadow-md"
                                    }`}
                            >
                                {continent}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contador de resultados */}
                <p className="text-text-muted mb-6">
                    Mostrando {filteredPackages.length} paquete{filteredPackages.length !== 1 ? "s" : ""}
                    {selectedContinent !== "Todos" && ` en ${selectedContinent}`}
                </p>

                {/* Grid de paquetes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPackages.map((pkg, idx) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <PackageCard {...pkg} />
                        </motion.div>
                    ))}
                </div>

                {filteredPackages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-text-muted text-lg">No hay paquetes disponibles para este continente.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
