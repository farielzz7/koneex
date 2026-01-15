"use client"

import { Header } from "@/components/header"
import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-3">Sin conexión</h1>
          <p className="text-text-muted mb-8">
            Parece que no tienes conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.
          </p>
          <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary-hover">
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  )
}
