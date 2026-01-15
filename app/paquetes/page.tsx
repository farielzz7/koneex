import { Header } from "@/components/header"
import { PackageCard } from "@/components/package-card"
import { SimpleSearch } from "@/components/simple-search"
import { Footer } from "@/components/footer"
import { mockPackages } from "@/lib/mock-data"

export default function PaquetesPage() {
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
          <p className="text-text-muted">Mostrando {mockPackages.length} paquetes</p>

          <select className="px-4 py-2 rounded-lg border border-border bg-white text-sm">
            <option>Más populares</option>
            <option>Precio: menor a mayor</option>
            <option>Precio: mayor a menor</option>
            <option>Mejor valorados</option>
            <option>Más recientes</option>
          </select>
        </div>

        {/* Grid de paquetes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockPackages.map((pkg) => (
            <PackageCard key={pkg.id} {...pkg} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
