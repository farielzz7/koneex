"use client"

import { useState } from "react"
import { Search, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/date-range-picker"

export function SearchHero() {
  const [searchType, setSearchType] = useState<"destino" | "experiencia">("destino")

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-danger/15 via-primary/15 to-warning/15 py-12 md:py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-danger blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-warning blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-44 h-44 rounded-full bg-primary blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 text-balance">
            Descubre tu próxima
            <span className="text-gradient"> aventura</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto text-pretty">
            Explora destinos increíbles, vive experiencias únicas y crea recuerdos inolvidables
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={searchType === "destino" ? "default" : "outline"}
            onClick={() => setSearchType("destino")}
            className={
              searchType === "destino" ? "rounded-full bg-gradient-toucan hover:opacity-90" : "rounded-full border-2"
            }
          >
            <MapPin className="w-4 h-4 mr-2" />
            Buscar Destino
          </Button>
          <Button
            variant={searchType === "experiencia" ? "default" : "outline"}
            onClick={() => setSearchType("experiencia")}
            className={
              searchType === "experiencia"
                ? "rounded-full bg-gradient-toucan hover:opacity-90"
                : "rounded-full border-2"
            }
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar Experiencia
          </Button>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-4 md:p-6 border-4 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="text-sm font-semibold text-text mb-2 block">
                {searchType === "destino" ? "Destino" : "Experiencia"}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  placeholder={searchType === "destino" ? "ej. Cancún, París" : "ej. Buceo, Safari"}
                  className="pl-10 border-2 h-11"
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <label className="text-sm font-semibold text-text mb-2 block">Fechas de viaje</label>
              <DateRangePicker />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-text mb-2 block">Viajeros</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                <Input type="number" placeholder="2" min="1" className="pl-10 border-2 h-11" />
              </div>
            </div>

            <div className="md:col-span-2 flex items-end">
              <Button className="w-full h-11 bg-gradient-toucan hover:opacity-90 font-semibold">
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <span className="text-sm text-text-muted font-medium">Populares:</span>
          {[
            { tag: "Playa", color: "border-primary hover:bg-primary hover:text-white" },
            { tag: "Montaña", color: "border-accent hover:bg-accent hover:text-white" },
            { tag: "Europa", color: "border-danger hover:bg-danger hover:text-white" },
            { tag: "Todo Incluido", color: "border-warning hover:bg-warning hover:text-white" },
            { tag: "Aventura", color: "border-secondary hover:bg-secondary hover:text-white" },
          ].map(({ tag, color }) => (
            <button
              key={tag}
              className={`px-4 py-1.5 rounded-full bg-white text-sm font-medium transition-all shadow-sm border-2 ${color}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
