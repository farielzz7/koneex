"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Calendar, ShoppingCart, Tag, TrendingUp, DollarSign } from "lucide-react"

export default function AdminDashboard() {
    // Estos datos serán dinámicos una vez conectemos la BD
    const stats = [
        {
            title: "Total Paquetes",
            value: "0",
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Salidas Activas",
            value: "0",
            icon: Calendar,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Órdenes Pendientes",
            value: "0",
            icon: ShoppingCart,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
        {
            title: "Promociones Activas",
            value: "0",
            icon: Tag,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            title: "Ventas del Mes",
            value: "$0",
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
        },
        {
            title: "Tasa de Conversión",
            value: "0%",
            icon: TrendingUp,
            color: "text-pink-600",
            bgColor: "bg-pink-100",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Bienvenido al panel de administración de KONEEX
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
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
                                Actualizado hace un momento
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

            {/* Connection Status */}
            <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                    <CardTitle className="text-yellow-800">⚠️ Configuración Pendiente</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-yellow-700">
                        La base de datos aún no está conectada. Por favor configura el <code className="bg-yellow-100 px-2 py-1 rounded">DATABASE_URL</code> en tu archivo <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code> con tu connection string de Supabase.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
