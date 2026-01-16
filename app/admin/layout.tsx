"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    Calendar,
    Hotel,
    Plane,
    ShoppingCart,
    Tag,
    Globe,
    User,
    Menu,
    X,
    Building2,
} from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },

    { name: "Paquetes", href: "/admin/packages", icon: Package },
    { name: "Salidas", href: "/admin/departures", icon: Calendar },
    { name: "Hoteles", href: "/admin/hotels", icon: Hotel },
    { name: "Aerolíneas", href: "/admin/airlines", icon: Plane },
    { name: "Proveedores", href: "/admin/providers", icon: Building2 },
    { name: "Clientes", href: "/admin/customers", icon: User },
    { name: "Órdenes", href: "/admin/orders", icon: ShoppingCart },
    { name: "Promociones", href: "/admin/promotions", icon: Tag },
    { name: "Geografía", href: "/admin/geography", icon: Globe },
    { name: "Usuarios", href: "/admin/users", icon: User },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
                <h1 className="text-lg font-bold text-primary">KONEEX Admin</h1>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-primary">KONEEX Admin</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            Panel de Administración v1.0
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl lg:hidden"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                                    <h1 className="text-lg font-bold text-primary">KONEEX Admin</h1>
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                                    isActive
                                                        ? "bg-primary text-white"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                )}
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {item.name}
                                            </Link>
                                        )
                                    })}
                                </nav>

                                {/* Footer */}
                                <div className="p-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 text-center">
                                        Panel de Administración v1.0
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="lg:pl-64 pt-16 lg:pt-0">
                <main className="p-4 md:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    )
}
