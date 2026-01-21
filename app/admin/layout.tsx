"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
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
    FileText,
    CreditCard,
    Briefcase,
    Image,
    MessageSquare,
    Users,
    Settings,
    Loader2,
    LogOut,
    Plus,
} from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const navigation = [
    {
        title: "Principal",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ]
    },
    {
        title: "Ventas",
        items: [
            { name: "Dashboard", href: "/admin/sales", icon: LayoutDashboard },
            { name: "Calendario", href: "/admin/sales/calendar", icon: Calendar },
            { name: "Nueva Venta", href: "/admin/sales/new", icon: Plus },
        ]
    },
    {
        title: "Catálogo",
        items: [
            { name: "Destinos", href: "/admin/geography", icon: Globe },
            { name: "Paquetes", href: "/admin/packages", icon: Package },
            { name: "Salidas", href: "/admin/departures", icon: Calendar },
            { name: "Servicios", href: "/admin/services", icon: Briefcase },
            { name: "Hoteles", href: "/admin/hotels", icon: Hotel },
            { name: "Aerolíneas", href: "/admin/airlines", icon: Plane },
            { name: "Proveedores", href: "/admin/providers", icon: Building2 },
            { name: "Promociones", href: "/admin/promotions", icon: Tag },
        ]
    },
    {
        title: "Clientes",
        items: [
            { name: "Clientes", href: "/admin/customers", icon: User },
        ]
    },
    {
        title: "Contenido",
        items: [
            { name: "Banners", href: "/admin/content/banners", icon: Image },
            { name: "Testimonios", href: "/admin/content/testimonials", icon: MessageSquare },
            { name: "Redes Sociales", href: "/admin/content/social-testimonials", icon: MessageSquare },
        ]
    },
    {
        title: "Configuración",
        items: [
            { name: "Usuarios", href: "/admin/users", icon: Users },
            { name: "Ajustes", href: "/admin/settings", icon: Settings },
        ]
    }
]


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, isAuthenticated, isLoading, setRedirectUrl, logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                setRedirectUrl(pathname)
                router.push("/login")
            } else if (user?.role !== "ADMIN") {
                logout()
                router.push("/login")
            }
        }
    }, [isLoading, isAuthenticated, user, router, pathname, setRedirectUrl, logout])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4">
                <h1 className="text-lg font-bold text-primary">KONEEX Admin</h1>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Toggle Menu"
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
                    <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                        {navigation.map((group) => (
                            <div key={group.title}>
                                <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {group.title}
                                </h3>
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
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
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            {user?.avatar && (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                logout()
                                router.push("/login")
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            Cerrar Sesión
                        </button>
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
                            className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[100] shadow-2xl lg:hidden"
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
                                <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                                    {navigation.map((group) => (
                                        <div key={group.title}>
                                            <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {group.title}
                                            </h3>
                                            <div className="space-y-1">
                                                {group.items.map((item) => {
                                                    const isActive = pathname === item.href
                                                    return (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            onClick={(e) => {
                                                                if (sidebarOpen) setSidebarOpen(false)
                                                            }}
                                                            className={cn(
                                                                "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
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
                                            </div>
                                        </div>
                                    ))}
                                </nav>

                                {/* Footer */}
                                <div className="p-4 border-t border-gray-200 space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        {user?.avatar && (
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 break-words">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 break-all">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout()
                                            router.push("/login")
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Cerrar Sesión
                                    </button>
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
