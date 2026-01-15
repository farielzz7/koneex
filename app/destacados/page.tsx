import { Header } from "@/components/header"
import { PackageCard } from "@/components/package-card"
import { Footer } from "@/components/footer"
import { mockPackages } from "@/lib/mock-data"
import { Star, Award } from "lucide-react"
import { motion } from "framer-motion"

export default function DestacadosPage() {
    // Filtrar solo paquetes destacados
    const featuredPackages = mockPackages.filter((pkg) => pkg.featured)

    return (
        <div className="min-h-screen bg-surface">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-warning to-primary py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Award className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-white">Selección Premium</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">Paquetes Destacados</h1>
                        <p className="text-lg md:text-xl text-white/90 text-pretty">
                            Los mejores destinos seleccionados especialmente para ti. Calidad, servicio y experiencias inolvidables.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Star className="w-8 h-8 text-warning" />
                        <h2 className="text-3xl font-bold">Nuestras Mejores Ofertas</h2>
                    </div>
                    <p className="text-text-muted text-lg">
                        Estos paquetes han sido cuidadosamente seleccionados por su excelente relación calidad-precio y las
                        increíbles experiencias que ofrecen.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredPackages.map((pkg) => (
                        <PackageCard key={pkg.id} {...pkg} />
                    ))}
                </div>

                {featuredPackages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-text-muted text-lg">No hay paquetes destacados disponibles en este momento.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
