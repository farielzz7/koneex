"use client"

import { Logo } from "./logo"
import { Menu, MessageCircle, MapPin, X, ChevronDown, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 focus:outline-none py-3">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-primary transition-colors focus:outline-none py-2">
                  Paquetes <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/paquetes" className="w-full cursor-pointer">Ver todos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/destacados" className="w-full cursor-pointer">Destacados</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/experiencias" className="w-full cursor-pointer">Experiencias</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/internacionales" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap">
                Internacionales
              </Link>
              <Link href="/clientes" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                Clientes
              </Link>
              <Link href="/cotizacion" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                Cotización
              </Link>
              <Link href="/grupos" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap">
                Grupos
              </Link>
            </nav>

            {/* CTA Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() =>
                  window.open(
                    "https://www.google.com/maps/search/?api=1&query=Calle+2+%23353+x+11+y+15,+Fracc.+José+María+Iturralde+(Las+Águilas).+Mérida,+Yucatán.+México",
                    "_blank",
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden xl:inline">Ubicación</span>
              </button>
              <button
                onClick={() => window.open("https://wa.me/5219993387710?text=Hola koneex, necesito información", "_blank")}
                className="flex items-center gap-2 px-5 py-2.5 text-sm bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-all font-medium shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Menu principal"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <Logo size="sm" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col p-6 space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-lg font-bold text-gray-900 mb-3">Paquetes</p>
                  <div className="pl-4 flex flex-col gap-3">
                    <Link
                      href="/paquetes"
                      className="text-base text-gray-600 hover:text-primary transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Ver todos
                    </Link>
                    <Link
                      href="/destacados"
                      className="text-base text-gray-600 hover:text-primary transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Destacados
                    </Link>
                    <Link
                      href="/experiencias"
                      className="text-base text-gray-600 hover:text-primary transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Experiencias
                    </Link>
                  </div>
                </div>

                <Link
                  href="/internacionales"
                  className="text-lg font-bold text-gray-900 hover:text-primary transition-colors pb-3 border-b border-gray-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Internacionales
                </Link>
                <Link
                  href="/clientes"
                  className="text-lg font-bold text-gray-900 hover:text-primary transition-colors pb-3 border-b border-gray-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Clientes
                </Link>
                <Link
                  href="/cotizacion"
                  className="text-lg font-bold text-gray-900 hover:text-primary transition-colors pb-3 border-b border-gray-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Cotización
                </Link>
                <Link
                  href="/grupos"
                  className="text-lg font-bold text-gray-900 hover:text-primary transition-colors pb-3 border-b border-gray-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Viajes en Grupo
                </Link>

                {/* CTA Buttons */}
                <div className="pt-6 space-y-3">
                  <button
                    onClick={() => {
                      window.open(
                        "https://www.google.com/maps/search/?api=1&query=Calle+2+%23353+x+11+y+15,+Fracc.+José+María+Iturralde+(Las+Águilas).+Mérida,+Yucatán.+México",
                        "_blank",
                      )
                      setShowMobileMenu(false)
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                  >
                    <MapPin className="w-5 h-5" />
                    Cómo llegar
                  </button>
                  <button
                    onClick={() => {
                      window.open("https://wa.me/5219993387710?text=Hola koneex, necesito información", "_blank")
                      setShowMobileMenu(false)
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#25D366] text-white rounded-xl hover:bg-[#20BA5A] transition-all font-semibold shadow-lg shadow-green-500/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                </div>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
