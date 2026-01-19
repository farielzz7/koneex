"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Calendar, ShoppingCart, Tag, TrendingUp, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminDashboard() {
    const { user } = useAuth()
    const [counts, setCounts] = useState({
        users: 0,
        packages: 0,
        orders: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                // Parallel fetching for performance
                const [users, packages, orders] = await Promise.all([
                    supabase.from('users').select('*', { count: 'exact', head: true }).not('status', 'eq', 'BLOCKED'), // active users
                    supabase.from('packages').select('*', { count: 'exact', head: true }),
                    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'PENDING_PAYMENT') // pending orders
                ])

                setCounts({
                    users: users.count || 0,
                    packages: packages.count || 0,
                    orders: orders.count || 0
                })
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const stats = [
        {
            title: "Total Usuarios",
            value: loading ? "..." : counts.users.toString(),
            icon: Package, // Using Package icon for now as placeholder or change to UserIcon if available
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Paquetes Activos",
            value: loading ? "..." : counts.packages.toString(),
            icon: Calendar,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Órdenes Pendientes",
            value: loading ? "..." : counts.orders.toString(),
            icon: ShoppingCart,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
        // ... keeping other static stats for now or removing if irrelevant
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Bienvenido de nuevo, <span className="font-semibold text-primary">{user?.name}</span>. Panel de administración.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.slice(0, 3).map((stat) => (
                    <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Actualizado en tiempo real
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                        <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Crear Paquete</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                        <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Nueva Salida</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                        <Tag className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Crear Promoción</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                        <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Ver Órdenes</p>
                    </button>
                </CardContent>
            </Card>
        </div>
    )
}
