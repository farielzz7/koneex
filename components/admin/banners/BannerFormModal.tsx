"use client"

import { useState, useEffect, useRef } from "react"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface BannerFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    banner?: {
        id: string
        title: string
        image_url: string
        link_url: string | null
        is_active: boolean
        position?: string
        display_order?: number
    } | null
}

export function BannerFormModal({ isOpen, onClose, onSuccess, banner }: BannerFormModalProps) {
    const [title, setTitle] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (banner) {
            setTitle(banner.title)
            setImagePreview(banner.image_url)
        } else {
            setTitle("")
            setImageFile(null)
            setImagePreview("")
        }
    }, [banner, isOpen])

    const processFile = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            processFile(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            processFile(file)
        }
    }

    const handleUploadAreaClick = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("link_url", "")
            formData.append("position", "home-hero")
            formData.append("display_order", "0")

            if (imageFile) {
                formData.append("image", imageFile)
            }

            const url = banner ? `/api/admin/banners/${banner.id}` : "/api/admin/banners"
            const method = banner ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                body: formData,
            })

            if (response.ok) {
                onSuccess()
            } else {
                const data = await response.json()
                alert(data.error || "Error al guardar el banner")
            }
        } catch (error) {
            console.error("Error saving banner:", error)
            alert("Error al guardar el banner")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">{banner ? "Editar Banner" : "Crear Banner"}</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Título *</label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ej. Promoción Verano 2026"
                            required
                            className="w-full"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Imagen {!banner && "*"}
                        </label>
                        <div
                            onClick={handleUploadAreaClick}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:bg-gray-50"
                                }`}
                        >
                            {imagePreview ? (
                                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                                    <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                                </div>
                            ) : (
                                <Upload className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="banner-image"
                                required={!banner}
                            />
                            <p className="text-sm text-text-muted mb-2">
                                {imagePreview ? "Haz clic para cambiar la imagen" : "Haz clic o arrastra una imagen aquí"}
                            </p>
                            <p className="text-xs text-text-muted">
                                Formatos: JPG, PNG, GIF (Máx. 5MB)
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !title || (!banner && !imageFile)}>
                            {loading ? "Guardando..." : banner ? "Actualizar Banner" : "Crear Banner"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
