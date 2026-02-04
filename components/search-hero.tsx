"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface HeroBanner {
  id: string
  title: string
  image_url: string
  link_url: string | null
  is_active: boolean
}

export function SearchHero() {
  const [banner, setBanner] = useState<HeroBanner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveBanner()
  }, [])

  const fetchActiveBanner = async () => {
    try {
      const response = await fetch("/api/banners/active")
      const data = await response.json()
      setBanner(data.banner)
    } catch (error) {
      console.error("Error fetching active banner:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
          <div className="h-48 flex items-center justify-center">
            <p className="text-text-muted">Cargando...</p>
          </div>
        </div>
      </section>
    )
  }

  // If there's an active banner, show with optimized responsive text overlay
  if (banner) {
    return (
      <section className="relative overflow-hidden">
        {/* Banner background - optimized heights for mobile */}
        <div className="relative w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]">
          <Image
            src={banner.image_url || "/placeholder.svg"}
            alt={banner.title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Gradient overlay - stronger on mobile for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55" />
        </div>

        {/* Text overlay - fully responsive with mobile-first approach */}
        <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center space-y-3 sm:space-y-4">
              {/* Title - optimized font sizes */}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white drop-shadow-2xl leading-tight px-2">
                Descubre tu próxima
                <br className="xs:hidden" />
                <span className="xs:inline"> </span>
                <span className="inline-block text-yellow-300 drop-shadow-lg">aventura</span>
              </h1>

              {/* Description - scales down on mobile */}
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-lg px-4 leading-relaxed">
                Explora destinos increíbles, vive experiencias únicas y crea recuerdos inolvidables
              </p>

              {/* Popular tags - responsive visibility and sizing */}
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 md:mt-8 px-2">
                <span className="text-xs sm:text-sm text-white/90 font-medium self-center">Populares:</span>
                {[
                  { tag: "Playa", color: "border-primary hover:bg-primary" },
                  { tag: "Montaña", color: "border-accent hover:bg-accent", hideOnSmall: true },
                  { tag: "Europa", color: "border-danger hover:bg-danger" },
                  { tag: "Todo Incluido", color: "border-warning hover:bg-warning", hideOnSmall: true },
                  { tag: "Aventura", color: "border-secondary hover:bg-secondary" },
                ].map(({ tag, color, hideOnSmall }) => (
                  <button
                    key={tag}
                    className={`${hideOnSmall ? 'hidden xs:inline-block' : 'inline-block'} px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs sm:text-sm font-medium transition-all shadow-md border-2 ${color} hover:text-white hover:scale-105 active:scale-95`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Fallback: Show original content when no active banner
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
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 text-balance">
            Descubre tu próxima
            <span className="text-gradient"> aventura</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto text-pretty">
            Explora destinos increíbles, vive experiencias únicas y crea recuerdos inolvidables
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-8">
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
