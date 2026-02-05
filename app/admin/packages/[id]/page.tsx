"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Save, Plus, X, Loader2, Image as ImageIcon, DollarSign, FileDown, Eye } from "lucide-react"
// import { PDFDownloadLink } from "@react-pdf/renderer" // Removed direct import
// import { PackagePDF } from "@/components/admin/packages/PackagePDF" // Removed direct import
import { toast } from "sonner"
import Link from "next/link"

const PackagePDFPreview = dynamic(
    () => import("@/components/admin/packages/PackagePDFPreview"),
    {
        ssr: false,
        loading: () => <div className="flex items-center justify-center h-[500px]"><Loader2 className="w-8 h-8 animate-spin" /></div>,
    }
)

const PackagePDFExport = dynamic(
    () => import("@/components/admin/packages/PackagePDFExport"),
    {
        ssr: false,
        loading: () => <Button variant="outline" disabled className="gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Preparando PDF...</Button>,
    }
)



export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [form, setForm] = useState({
        title: "",
        description: "",
        short_description: "",
        price: 0,
        price_single: 0,
        price_double: 0,
        price_triple: 0,
        price_child: 0,
        children_allowed: true,
        currency_code: "MXN",
        duration_days: 1,
        duration_nights: 0,
        group_size: "",
        rating: 0,
        featured: false,
        tags: [] as string[],
        images: [] as string[],
        includes: [] as string[],
        excludes: [] as string[],
        status: "DRAFT" as 'DRAFT' | 'ACTIVE' | 'INACTIVE',
        destination: "",
    })


    const [newImageUrl, setNewImageUrl] = useState("")
    const [newTag, setNewTag] = useState("")
    const [newInclude, setNewInclude] = useState("")
    const [newExclude, setNewExclude] = useState("")
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        fetchPackage()
    }, [resolvedParams.id])

    const fetchPackage = async () => {
        try {
            const response = await fetch(`/api/admin/packages/${resolvedParams.id}`)
            if (!response.ok) throw new Error("Paquete no encontrado")
            const data = await response.json()
            setForm({
                title: data.title || "",
                description: data.description || "",
                short_description: data.short_description || "",
                price: data.price || 0,
                price_single: data.price_single || data.price || 0,
                price_double: data.price_double || data.price || 0,
                price_triple: data.price_triple || data.price || 0,
                price_child: data.price_child || 0,
                children_allowed: data.children_allowed !== false,
                currency_code: data.currency_code || "MXN",
                duration_days: data.duration_days || 1,
                duration_nights: data.duration_nights || 0,
                group_size: data.group_size || "",
                rating: data.rating || 0,
                featured: data.featured || false,
                tags: data.tags || [],
                images: data.images || [],
                includes: data.includes || [],
                excludes: data.excludes || [],
                status: data.status || "DRAFT",
                destination: data.destination?.name || "",
            })
        } catch (error) {
            toast.error("Error al cargar el paquete")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!form.title.trim()) {
            toast.error("El título es requerido")
            return
        }

        setSaving(true)
        try {
            const response = await fetch(`/api/admin/packages/${resolvedParams.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!response.ok) throw new Error("Error al guardar")

            toast.success("Paquete actualizado correctamente")
            router.push("/admin/packages")
        } catch (error) {
            toast.error("Error al guardar el paquete")
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    const addImage = () => {
        if (newImageUrl.trim()) {
            setForm({ ...form, images: [...form.images, newImageUrl.trim()] })
            setNewImageUrl("")
        }
    }

    const removeImage = (index: number) => {
        setForm({ ...form, images: form.images.filter((_, i) => i !== index) })
    }

    const addTag = () => {
        if (newTag.trim() && !form.tags.includes(newTag.trim())) {
            setForm({ ...form, tags: [...form.tags, newTag.trim()] })
            setNewTag("")
        }
    }

    const removeTag = (tag: string) => {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag) })
    }

    const addInclude = () => {
        if (newInclude.trim()) {
            setForm({ ...form, includes: [...form.includes, newInclude.trim()] })
            setNewInclude("")
        }
    }

    const removeInclude = (index: number) => {
        setForm({ ...form, includes: form.includes.filter((_, i) => i !== index) })
    }

    const addExclude = () => {
        if (newExclude.trim()) {
            setForm({ ...form, excludes: [...form.excludes, newExclude.trim()] })
            setNewExclude("")
        }
    }

    const removeExclude = (index: number) => {
        setForm({ ...form, excludes: form.excludes.filter((_, i) => i !== index) })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/packages">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Editar Paquete</h1>
                        <p className="text-muted-foreground">Modifica toda la información del paquete</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {isClient && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setShowPreview(true)}
                                className="gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Vista Previa PDF
                            </Button>

                            <PackagePDFExport
                                data={form}
                                fileName={`${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proposal.pdf`}
                            />
                        </>
                    )}
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle>Vista Previa del PDF</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full h-full overflow-hidden">
                        <PackagePDFPreview data={form} />
                    </div>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Información Básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Nombre del paquete"
                                />
                            </div>

                            <div>
                                <Label htmlFor="short_description">Descripción Corta</Label>
                                <Input
                                    id="short_description"
                                    value={form.short_description}
                                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                                    placeholder="Resumen breve (150 caracteres)"
                                    maxLength={150}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Descripción Completa</Label>
                                <Textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Descripción detallada del paquete"
                                    rows={6}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="duration_days">Días</Label>
                                    <Input
                                        id="duration_days"
                                        type="number"
                                        min="1"
                                        value={form.duration_days}
                                        onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration_nights">Noches</Label>
                                    <Input
                                        id="duration_nights"
                                        type="number"
                                        min="0"
                                        value={form.duration_nights}
                                        onChange={(e) => setForm({ ...form, duration_nights: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="group_size">Tamaño de Grupo</Label>
                                <Input
                                    id="group_size"
                                    value={form.group_size}
                                    onChange={(e) => setForm({ ...form, group_size: e.target.value })}
                                    placeholder="Ej: 2-15 personas"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Imágenes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Imágenes del Paquete
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    onKeyDown={(e) => e.key === 'Enter' && addImage()}
                                />
                                <Button onClick={addImage} type="button">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {form.images.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Imagen ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded">
                                                Principal
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {form.images.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No hay imágenes agregadas
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Incluye / No Incluye */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">✅ Incluye</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={newInclude}
                                        onChange={(e) => setNewInclude(e.target.value)}
                                        placeholder="Ej: Vuelo redondo"
                                        onKeyDown={(e) => e.key === 'Enter' && addInclude()}
                                    />
                                    <Button onClick={addInclude} size="sm">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <ul className="space-y-2">
                                    {form.includes.map((item, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm">{item}</span>
                                            <button
                                                onClick={() => removeInclude(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">❌ No Incluye</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={newExclude}
                                        onChange={(e) => setNewExclude(e.target.value)}
                                        placeholder="Ej: Propinas"
                                        onKeyDown={(e) => e.key === 'Enter' && addExclude()}
                                    />
                                    <Button onClick={addExclude} size="sm">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <ul className="space-y-2">
                                    {form.excludes.map((item, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm">{item}</span>
                                            <button
                                                onClick={() => removeExclude(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Columna Lateral */}
                <div className="space-y-6">
                    {/* Tarifas por Ocupación */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Tarifas por Ocupación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="currency">Moneda</Label>
                                <select
                                    id="currency"
                                    value={form.currency_code}
                                    onChange={(e) => setForm({ ...form, currency_code: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="MXN">MXN - Peso Mexicano</option>
                                    <option value="USD">USD - Dólar</option>
                                    <option value="EUR">EUR - Euro</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="price_single">🛏️ Sencilla (1 persona)</Label>
                                <Input
                                    id="price_single"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price_single}
                                    onChange={(e) => setForm({ ...form, price_single: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <Label htmlFor="price_double">🛏️🛏️ Doble (por persona)</Label>
                                <Input
                                    id="price_double"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price_double}
                                    onChange={(e) => setForm({ ...form, price_double: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <Label htmlFor="price_triple">🛏️🛏️🛏️ Triple (por persona)</Label>
                                <Input
                                    id="price_triple"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price_triple}
                                    onChange={(e) => setForm({ ...form, price_triple: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="pt-3 border-t space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.children_allowed}
                                        onChange={(e) => setForm({ ...form, children_allowed: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">👶 Acepta Menores</span>
                                </label>

                                {form.children_allowed && (
                                    <div>
                                        <Label htmlFor="price_child">Precio por Menor</Label>
                                        <Input
                                            id="price_child"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.price_child}
                                            onChange={(e) => setForm({ ...form, price_child: parseFloat(e.target.value) || 0 })}
                                            placeholder="0.00"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tarifa especial para menores
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 border-t">
                                <Label htmlFor="price">Precio Base (Desde...)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Usado para mostrar "desde $X" en listados
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estado */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {['DRAFT', 'ACTIVE', 'INACTIVE'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setForm({ ...form, status: s as any })}
                                    className={`w-full py-2 px-4 rounded-lg border-2 transition-colors ${form.status === s
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {s === 'DRAFT' && '🟡 Borrador'}
                                    {s === 'ACTIVE' && '🟢 Activo'}
                                    {s === 'INACTIVE' && '🔴 Inactivo'}
                                </button>
                            ))}

                            <div className="pt-4 border-t">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">⭐ Destacado</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Ej: playa"
                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                />
                                <Button onClick={addTag} size="sm">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
