"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { PackageCard } from "@/components/package-card"
import { SimpleSearch } from "@/components/simple-search"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"

interface Package {
  id: string
  slug: string
  title: string
  description: string
  destination: string
  duration: string
  price: number
  currency: string
  rating: number
  reviews: number
  groupSize: string
  image: string
  images: string[]
  featured: boolean
  tags: string[]
}

export default function PaquetesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("popular")

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/packages')
      if (!response.ok) throw new Error('Error al cargar paquetes')
      const data = await response.json()
      setPackages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const sortedPackages = [...packages].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'popular':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-3">Explora Nuestros Paquetes</h1>
          <p className="text-lg text-text-muted">Encuentra el viaje perfecto para tu próxima aventura</p>
        </div>

        {/* Buscador Simple */}
        <div className="mb-8">
          <SimpleSearch />
        </div>

        {/* Ordenamiento */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-text-muted">
            {loading ? 'Cargando...' : `Mostrando ${packages.length} paquetes`}
          </p>

          <select
            className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Más populares</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchPackages}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && packages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">No hay paquetes disponibles en este momento</p>
          </div>
        )}

        {/* Grid de paquetes */}
        {!loading && !error && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPackages.map((pkg) => (
              <PackageCard key={pkg.slug} {...pkg} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
