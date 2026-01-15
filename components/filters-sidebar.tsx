"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FiltersSidebar({ onClose }: { onClose?: () => void }) {
  const [priceRange, setPriceRange] = useState([0, 5000])

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-border h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-lg">Filtros</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Rango de precio */}
      <div className="mb-6">
        <Label className="text-sm font-semibold mb-3 block">Precio (USD)</Label>
        <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={100} className="mb-2" />
        <div className="flex justify-between text-sm text-text-muted">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Tipo de viaje */}
      <div className="mb-6">
        <Label className="text-sm font-semibold mb-3 block">Tipo de Viaje</Label>
        <div className="space-y-3">
          {["Playa", "Montaña", "Ciudad", "Aventura", "Cultural", "Relajación"].map((tipo) => (
            <div key={tipo} className="flex items-center space-x-2">
              <Checkbox id={tipo} />
              <label htmlFor={tipo} className="text-sm cursor-pointer">
                {tipo}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Duración */}
      <div className="mb-6">
        <Label className="text-sm font-semibold mb-3 block">Duración</Label>
        <div className="space-y-3">
          {["1-3 días", "4-7 días", "8-14 días", "15+ días"].map((duracion) => (
            <div key={duracion} className="flex items-center space-x-2">
              <Checkbox id={duracion} />
              <label htmlFor={duracion} className="text-sm cursor-pointer">
                {duracion}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Incluye */}
      <div className="mb-6">
        <Label className="text-sm font-semibold mb-3 block">Incluye</Label>
        <div className="space-y-3">
          {["Vuelos", "Hotel", "Comidas", "Tours", "Seguro"].map((incluye) => (
            <div key={incluye} className="flex items-center space-x-2">
              <Checkbox id={incluye} />
              <label htmlFor={incluye} className="text-sm cursor-pointer">
                {incluye}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent">
          Limpiar
        </Button>
        <Button className="flex-1 bg-primary hover:bg-primary-hover">Aplicar</Button>
      </div>
    </div>
  )
}
