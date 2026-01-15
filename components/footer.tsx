"use client"

import { Logo } from "./logo"
import Link from "next/link"
import { Facebook, Instagram, Youtube, MapPin, MessageCircle, Phone } from "lucide-react"
import { BUSINESS_PHONE_FORMATTED, initiatePhoneCall } from "@/lib/whatsapp-helper"

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-8 md:mt-12 lg:mt-16">
      <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo size="md" />
            <p className="text-sm text-text-muted mt-3 md:mt-4 leading-relaxed">
              Tu compañero de confianza para crear experiencias de viaje inolvidables alrededor del mundo.
            </p>
            <div className="mt-3 md:mt-4 space-y-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Calle+2+%23353+x+11+y+15,+Fracc.+José+María+Iturralde+(Las+Águilas).+Mérida,+Yucatán.+México"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-text-muted hover:text-primary transition-colors group"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-primary" />
                <span className="leading-snug">
                  Calle 2 #353 x 11 y 15, Fracc. José María Iturralde (Las Águilas).
                  <br />
                  Mérida, Yucatán. México.
                </span>
              </a>
              <button
                onClick={initiatePhoneCall}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>Llamar: {BUSINESS_PHONE_FORMATTED}</span>
              </button>
              <a
                href="https://wa.me/5219993387710"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[#25D366] hover:text-[#20BA5A] transition-colors"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>WhatsApp: {BUSINESS_PHONE_FORMATTED}</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold mb-3 md:mb-4 text-base md:text-lg">Explora</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/paquetes" className="text-text-muted hover:text-primary transition-colors">
                  Paquetes
                </Link>
              </li>
              <li>
                <Link href="/experiencias" className="text-text-muted hover:text-primary transition-colors">
                  Experiencias
                </Link>
              </li>
              <li>
                <Link href="/planeacion" className="text-text-muted hover:text-primary transition-colors">
                  Planeación
                </Link>
              </li>
              <li>
                <Link href="/asesoramiento" className="text-text-muted hover:text-primary transition-colors">
                  Asesoramiento
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold mb-3 md:mb-4 text-base md:text-lg">Ayuda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-text-muted hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-text-muted hover:text-primary transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-text-muted hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="text-text-muted hover:text-primary transition-colors">
                  Cancelaciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold mb-3 md:mb-4 text-base md:text-lg">Síguenos</h3>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://www.facebook.com/Koneexagenciadeviajes/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/koneexviajes/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@koneexviajes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-border text-center text-xs md:text-sm text-text-muted">
          <p>2024 Koneex. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
