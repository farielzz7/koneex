"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Plus, Search, Image as ImageIcon, ExternalLink, Loader2, Trash2, Edit2, X, Upload } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Types
type Banner = {
    id: number
    title: string
    image_url: string
    link_url: string
    position: string
    is_active: boolean
    sort_order: number
}

type BannerFormData = {
    title: string
    link_url: string
    position: string
    is_active: boolean
    sort_order: number
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState<BannerFormData>({
        title: "",
        link_url: "",
        position: "HOME_HERO",
        is_active: true,
        sort_order: 0
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")

    useEffect(() => {
        loadBanners()
    }, [])

    useEffect(() => {
        // Create preview when image file changes
        if (imageFile) {
            const url = URL.createObjectURL(imageFile)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [imageFile])

    const loadBanners = async () => {
        try {
            const { data, error } = await supabase
                .from("banners")
                .select("*")
                .order("sort_order", { ascending: true })

            if (error) throw error
            setBanners(data || [])
        } catch (error) {
            console.error(error)
            toast.error("Error al cargar banners")
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Por favor selecciona una imagen")
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen no debe superar 5MB")
                return
            }
            setImageFile(file)
        }
    }

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `banners/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
            .from('media')
            .getPublicUrl(filePath)

        return data.publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title.trim()) {
            toast.error("El título es requerido")
            return
        }

        if (!editingBanner && !imageFile) {
            toast.error("Selecciona una imagen")
            return
        }

        setUploading(true)

        try {
            let imageUrl = editingBanner?.image_url || ""

            // Upload new image if provided
            if (imageFile) {
                imageUrl = await uploadImage(imageFile)
            }

            const bannerData = {
                ...formData,
                image_url: imageUrl
            }

            if (editingBanner) {
                // Update
                const { error } = await supabase
                    .from("banners")
                    .update(bannerData)
                    .eq("id", editingBanner.id)

                if (error) throw error
                toast.success("Banner actualizado correctamente")
            } else {
                // Create
                const { error } = await supabase
                    .from("banners")
                    .insert(bannerData)

                if (error) throw error
                toast.success("Banner creado correctamente")
            }

            loadBanners()
            handleCloseModal()
        } catch (error) {
            console.error(error)
            toast.error("Error al guardar el banner")
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este banner?")) return

        try {
            const { error } = await supabase
                .from("banners")
                .delete()
                .eq("id", id)

            if (error) throw error
            toast.success("Banner eliminado")
            loadBanners()
        } catch (error) {
            console.error(error)
            toast.error("Error al eliminar el banner")
        }
    }

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner)
        setFormData({
            title: banner.title,
            link_url: banner.link_url || "",
            position: banner.position,
            is_active: banner.is_active,
            sort_order: banner.sort_order
        })
        setPreviewUrl(banner.image_url)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingBanner(null)
        setFormData({
            title: "",
            link_url: "",
            position: "HOME_HERO",
            is_active: true,
            sort_order: 0
        })
        setImageFile(null)
        setPreviewUrl("")
    }

    const toggleActive = async (banner: Banner) => {
        try {
            const { error } = await supabase
                .from("banners")
                .update({ is_active: !banner.is_active })
                .eq("id", banner.id)

            if (error) throw error
            loadBanners()
        } catch (error) {
            console.error(error)
            toast.error("Error al cambiar estado")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Banners</h1>
                    <p className="text-sm text-gray-500">
                        Gestiona los banners promocionales del sitio web.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Banner
                </button>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : banners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">No hay banners</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-sm">
                            Comienza creando un banner para mostrar en la página principal.
                        </p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título / Enlace</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="relative w-24 h-12 bg-gray-100 rounded overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                                        {banner.link_url && (
                                            <div className="flex items-center gap-1 text-xs text-blue-600">
                                                <ExternalLink className="w-3 h-3" />
                                                {banner.link_url}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {banner.position}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {banner.sort_order}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleActive(banner)}
                                            className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer",
                                                banner.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                            )}
                                        >
                                            {banner.is_active ? 'Activo' : 'Inactivo'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(banner)}
                                                className="text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                {editingBanner ? 'Editar Banner' : 'Nuevo Banner'}
                            </h2>
                            <button onClick={handleCloseModal}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Imagen *</label>
                                <div className="border-2 border-dashed rounded-lg p-4">
                                    {previewUrl ? (
                                        <div className="relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null)
                                                    setPreviewUrl(editingBanner?.image_url || "")
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center cursor-pointer h-48">
                                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">Click para subir imagen</span>
                                            <span className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Título *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ej: Promoción Primavera 2024"
                                    required
                                />
                            </div>

                            {/* Link URL */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Enlace (URL)</label>
                                <input
                                    type="url"
                                    value={formData.link_url}
                                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="https://ejemplo.com/promo"
                                />
                            </div>

                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Posición</label>
                                <select
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="HOME_HERO">Home - Hero</option>
                                    <option value="HOME_PROMO">Home - Promo</option>
                                    <option value="FOOTER">Footer</option>
                                    <option value="SIDEBAR">Sidebar</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Orden de visualización</label>
                                <input
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="0"
                                />
                            </div>

                            {/* Active */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium">Banner activo</label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                                    disabled={uploading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                                    disabled={uploading}
                                >
                                    {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {uploading ? 'Guardando...' : (editingBanner ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
