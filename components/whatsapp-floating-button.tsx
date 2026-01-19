"use client"

import { MessageCircle, X } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true)
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const whatsappNumber = "9993387710"
  const defaultMessage = "Hola koneex, necesito información sobre viajes..."

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`
    window.open(url, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showTooltip && (
        <div className="bg-white rounded-lg shadow-2xl p-4 max-w-xs border-2 border-[#25D366] animate-bounce-slow">
          <button onClick={() => setShowTooltip(false)} className="absolute top-2 right-2">
            <X className="w-4 h-4 text-text-muted hover:text-text" />
          </button>
          <p className="text-sm font-bold mb-1 text-[#25D366]">¿Necesitas ayuda?</p>
          <p className="text-xs text-text-muted">Chatea ahora con un asesor de koneex</p>
        </div>
      )}

      <button
        onClick={openWhatsApp}
        className="w-20 h-20 rounded-full bg-[#25D366] shadow-2xl hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:scale-110 transition-all duration-300 flex items-center justify-center group pulse-animation"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  )
}
