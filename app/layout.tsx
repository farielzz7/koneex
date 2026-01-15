import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "koneex - Agencia de Viajes",
  description: "Descubre destinos increíbles, vive experiencias únicas y planea el viaje de tus sueños con koneex",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "koneex",
  },
  icons: {
    icon: [
      {
        url: "/MATERIAL KO'NEEX.png",
      },
    ],
    apple: "/MATERIAL KO'NEEX.png",
  },
}

export const viewport = {
  themeColor: "#FF6B35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppFloatingButton />
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
