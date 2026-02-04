"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BannerFormModal } from "@/components/admin/banners/BannerFormModal"
import { ConfirmToggleModal } from "@/components/admin/banners/ConfirmToggleModal"

interface HeroBanner {
    id: string
    title: string
    image_url: string
    link_url: string | null
    is_active: boolean
    position: string
    display_order: number
    created_at: string
}

export default function BannersPage() {
    const [banners, setBanners] = useState<HeroBanner[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [selectedBanner, setSelectedBanner] = useState<HeroBanner | null>(null)

    useEffect(() => {
        fetchBanners()
    }, [])

    const fetchBanners = async () => {
        try {
            const response = await fetch("/api/admin/banners")
            const data = await response.json()
            if (response.ok) {
                setBanners(data.banners || [])
            }
        } catch (error) {
            console.error("Error fetching banners:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este banner?")) {
            return
        }

        try {
            const response = await fetch(`/api/admin/banners/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                fetchBanners()
            } else {
                alert("Error al eliminar el banner")
            }
        } catch (error) {
            console.error("Error deleting banner:", error)
            alert("Error al eliminar el banner")
        }
    }

    const handleToggleClick = (banner: HeroBanner) => {
        setSelectedBanner(banner)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmToggle = async () => {
        if (!selectedBanner) return

        try {
            const response = await fetch(`/api/admin/banners/${selectedBanner.id}/activate`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_active: !selectedBanner.is_active }),
            })

            if (response.ok) {
                fetchBanners()
                setIsConfirmModalOpen(false)
                setSelectedBanner(null)
            } else {
                alert("Error al cambiar el estado del banner")
            }
        } catch (error) {
            console.error("Error toggling banner:", error)
            alert("Error al cambiar el estado del banner")
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-text-muted">Cargando banners...</p>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text mb-2">Banners Hero</h1>
                    <p className="text-text-muted">Gestiona los banners de la página principal</p>
                </div>
                <Button onClick={() => setIsFormModalOpen(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Banner
                </Button>
            </div>

            {banners.length === 0 ? (
                <div className="bg-surface-alt rounded-lg border border-border p-12 text-center">
                    <h3 className="text-lg font-semibold mb-2">No hay banners</h3>
                    <p className="text-text-muted mb-6">Crea tu primer banner para la página principal</p>
                    <Button onClick={() => setIsFormModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Banner
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-surface border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Título</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Enlace</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Posición</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-text">Orden</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-text">Estado</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-text">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-surface/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-text">{banner.title}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {banner.link_url ? (
                                            <a
                                                href={banner.link_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-sm truncate max-w-xs block"
                                            >
                                                {banner.link_url}
                                            </a>
                                        ) : (
                                            <span className="text-text-muted text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-text">
                                            {banner.position === "home-hero"
                                                ? "Home - Hero"
                                                : banner.position === "home-secondary"
                                                    ? "Home - Secundario"
                                                    : banner.position === "packages"
                                                        ? "Paquetes"
                                                        : banner.position === "about"
                                                            ? "Nosotros"
                                                            : banner.position || "-"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface text-sm font-semibold text-text">
                                            {banner.display_order || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {banner.is_active ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleClick(banner)}
                                                className={
                                                    banner.is_active
                                                        ? "border-orange-500 text-orange-600 hover:bg-orange-50"
                                                        : "border-green-500 text-green-600 hover:bg-green-50"
                                                }
                                            >
                                                {banner.is_active ? (
                                                    <>
                                                        <PowerOff className="w-4 h-4 mr-2" />
                                                        Desactivar
                                                    </>
                                                ) : (
                                                    <>
                                                        <Power className="w-4 h-4 mr-2" />
                                                        Activar
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(banner.id)}
                                                className="border-red-500 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Eliminar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <BannerFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSuccess={() => {
                    fetchBanners()
                    setIsFormModalOpen(false)
                }}
            />

            <ConfirmToggleModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false)
                    setSelectedBanner(null)
                }}
                onConfirm={handleConfirmToggle}
                banner={selectedBanner}
            />
        </div>
    )
}
