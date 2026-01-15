"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"

export function RedirectToLogin({ message = "Inicia sesión para continuar" }: { message?: string }) {
  const { setRedirectUrl } = useAuth()
  const router = useRouter()

  const handleRedirect = () => {
    const currentPath = window.location.pathname
    setRedirectUrl(currentPath)
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 border border-border text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">{message}</h3>
      <p className="text-text-muted mb-6">Regístrate o inicia sesión para acceder a esta función</p>
      <div className="flex gap-3 justify-center">
        <Button onClick={handleRedirect} className="bg-gradient-toucan hover:opacity-90">
          Iniciar Sesión
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const currentPath = window.location.pathname
            setRedirectUrl(currentPath)
            router.push(`/registro?redirect=${encodeURIComponent(currentPath)}`)
          }}
        >
          Registrarse
        </Button>
      </div>
    </motion.div>
  )
}

export function CheckoutRedirect() {
  return <RedirectToLogin message="Inicia sesión para completar tu compra" />
}
