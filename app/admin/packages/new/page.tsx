"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, Image as ImageIcon, Video, Settings, MapPin, Clock, ListChecks, DollarSign, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export default function NewPackagePage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [inclusions, setInclusions] = useState<string[]>([])
    const [newInclusion, setNewInclusion] = useState("")
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [newImageUrl, setNewImageUrl] = useState("")

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        slug: "",
        product_type: "CIRCUIT",
        short_description: "",
        description: "",
        duration_days: "0",
        duration_nights: "0",
        from_price: "0",
        currency_code: "USD",
        status: "DRAFT" as 'DRAFT' | 'PUBLISHED' | 'PAUSED',
    })

    const addInclusion = () => {
        if (newInclusion.trim()) {
            setInclusions([...inclusions, newInclusion.trim()])
            setNewInclusion("")
        }
    }

    const removeInclusion = (index: number) => {
        setInclusions(inclusions.filter((_, i) => i !== index))
    }

    const addImageUrl = () => {
        if (newImageUrl.trim()) {
            setImageUrls([...imageUrls, newImageUrl.trim()])
            setNewImageUrl("")
        }
    }

    const removeImageUrl = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        // Validación básica
        if (!formData.title || !formData.slug) {
            toast.error("El título y el slug son obligatorios")
            return
        }

        setIsSubmitting(true)

        try {
            // Preparar payload numérico seguro
            const durationDays = parseInt(formData.duration_days)
            const durationNights = parseInt(formData.duration_nights)
            const fromPrice = parseFloat(formData.from_price)

            const payload = {
                ...formData,
                duration_days: isNaN(durationDays) ? 0 : durationDays,
                duration_nights: isNaN(durationNights) ? 0 : durationNights,
                from_price: isNaN(fromPrice) ? 0 : fromPrice,
                includes: inclusions,
                media: imageUrls.map((url, index) => ({
                    url,
                    media_type: 'IMAGE',
                    is_cover: index === 0,
                    position: index
                })),
            }

            const response = await fetch("/api/admin/packages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success("¡Paquete creado exitosamente!")
                router.push("/admin/packages")
            } else {
                const error = await response.json()
                toast.error(`Error: ${error.error || "No se pudo crear el paquete"}`)
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error crítico al crear el paquete")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center gap-4">
                    <Link href="/admin/packages">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Nuevo Paquete de Viaje</h1>
                        <p className="text-muted-foreground">Configura todos los detalles de tu nueva oferta V3</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/packages">
                        <Button variant="ghost">Cancelar</Button>
                    </Link>
                    <Button onClick={() => handleSubmit()} disabled={isSubmitting || !formData.title}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Guardar Paquete
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            General
                        </TabsTrigger>
                        <TabsTrigger value="media" className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Multimedia
                        </TabsTrigger>
                        <TabsTrigger value="details" className="flex items-center gap-2">
                            <ListChecks className="w-4 h-4" />
                            Detalles
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="general">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid gap-6"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-primary" />
                                            Información Principal
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Título del Paquete *</Label>
                                                <Input
                                                    id="title"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="Ej: Europa Soñada"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="slug">Slug (URL) *</Label>
                                                <Input
                                                    id="slug"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    placeholder="europa-sonada"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subtitle">Subtítulo / Eslogan</Label>
                                            <Input
                                                id="subtitle"
                                                value={formData.subtitle}
                                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                placeholder="Madrid y París en un viaje inolvidable"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Descripción Detallada</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Describe la experiencia única que ofrece este viaje..."
                                                rows={6}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="product_type">Tipo de Producto</Label>
                                                <Select
                                                    value={formData.product_type}
                                                    onValueChange={(v) => setFormData({ ...formData, product_type: v })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CIRCUIT">Circuito</SelectItem>
                                                        <SelectItem value="HOTEL_PACKAGE">Paquete Hotel</SelectItem>
                                                        <SelectItem value="EXPERIENCE">Experiencia</SelectItem>
                                                        <SelectItem value="TRANSFER">Traslado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="days">Días</Label>
                                                <Input
                                                    id="days"
                                                    type="number"
                                                    value={formData.duration_days}
                                                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="nights">Noches</Label>
                                                <Input
                                                    id="nights"
                                                    type="number"
                                                    value={formData.duration_nights}
                                                    onChange={(e) => setFormData({ ...formData, duration_nights: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t">
                                            <Label>Estado Inicial</Label>
                                            <div className="flex gap-2">
                                                {['DRAFT', 'PUBLISHED'].map((s) => (
                                                    <Button
                                                        key={s}
                                                        type="button"
                                                        variant={formData.status === s ? "default" : "outline"}
                                                        onClick={() => setFormData({ ...formData, status: s as any })}
                                                    >
                                                        {s}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="media">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid gap-6"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-primary" />
                                            Galería de Imágenes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newImageUrl}
                                                onChange={(e) => setNewImageUrl(e.target.value)}
                                                placeholder="Pega aquí la URL de una imagen (jpg, png, webp)..."
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                                            />
                                            <Button type="button" variant="secondary" onClick={addImageUrl}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Añadir
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {imageUrls.map((url, index) => (
                                                <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border bg-muted">
                                                    <img src={url} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="rounded-full"
                                                            onClick={() => removeImageUrl(index)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            {imageUrls.length === 0 && (
                                                <div className="col-span-full py-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground gap-2">
                                                    <ImageIcon className="w-10 h-10 opacity-20" />
                                                    <p>No hay imágenes añadidas aún</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="details">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid gap-6"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <ListChecks className="w-5 h-5 text-primary" />
                                            ¿Qué incluye el viaje?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newInclusion}
                                                onChange={(e) => setNewInclusion(e.target.value)}
                                                placeholder="Ej: Traslados aeropuerto, Guía en español..."
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                                            />
                                            <Button type="button" variant="secondary" onClick={addInclusion}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Agregar
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {inclusions.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg border group">
                                                    <span className="text-sm font-medium">✓ {item}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeInclusion(index)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-primary" />
                                            Precio de Referencia
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="from_price">Precio Desde</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        id="from_price"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.from_price}
                                                        onChange={(e) => setFormData({ ...formData, from_price: e.target.value })}
                                                        placeholder="0.00"
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-4 bg-primary/5 p-3 rounded-lg border border-primary/10">
                                            💡 <strong>Nota:</strong> Estos precios son informativos para el catálogo. Los precios exactos de reserva se definen al crear las "Salidas" del paquete.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </form>
        </div>
    )
}
