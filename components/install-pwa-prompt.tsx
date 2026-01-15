"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-24 md:max-w-sm bg-white rounded-lg shadow-2xl p-4 border border-border z-40 animate-slide-up">
      <button onClick={() => setShowPrompt(false)} className="absolute top-2 right-2">
        <X className="w-4 h-4 text-text-muted" />
      </button>

      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold mb-1">Instala TucánViajes</h3>
          <p className="text-sm text-text-muted mb-3">Accede más rápido desde tu pantalla de inicio</p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm" className="bg-primary hover:bg-primary-hover">
              Instalar
            </Button>
            <Button onClick={() => setShowPrompt(false)} variant="outline" size="sm" className="bg-transparent">
              Ahora no
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
