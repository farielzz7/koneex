import { Header } from "@/components/header"
import { ExperienceCard } from "@/components/experience-card"
import { mockExperiences } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExperienciasPage() {
  const categories = ["Todas", "Aventura", "Gastronómico", "Naturaleza", "Cultural", "Deportes"]

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Vive Experiencias <span className="text-gradient">Únicas</span>
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Actividades inolvidables que harán de tu viaje una aventura extraordinaria
          </p>
        </div>

        <Tabs defaultValue="Todas" className="mb-8">
          <TabsList className="w-full justify-center mb-8 flex-wrap h-auto bg-white border border-border p-2">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-base px-6">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} {...exp} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
