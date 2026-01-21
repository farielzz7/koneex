"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewPackagePage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        product_type: "CIRCUIT",
        duration_days: "5",
        duration_nights: "4",
    })

    // Auto-generate slug and nights
    useEffect(() => {
        const slug = formData.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

        setFormData(prev => ({ ...prev, slug }))
    }, [formData.title])

    useEffect(() => {
        const days = parseInt(formData.duration_days) || 0
        if (days > 0) {
            setFormData(prev => ({ ...prev, duration_nights: (days - 1).toString() }))
        }
    }, [formData.duration_days])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.slug) {
            toast.error("El título y el slug son obligatorios")
            return
        }

        setIsSubmitting(true)

        try {
            const payload = {
                ...formData,
                duration_days: parseInt(formData.duration_days) || 0,
                duration_nights: parseInt(formData.duration_nights) || 0,
                status: 'DRAFT',
                // Default values for other fields
                currency_code: 'USD',
                from_price: 0
            }

            const response = await fetch("/api/admin/packages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const newPkg = await response.json()
                toast.success("¡Borrador creado! Redirigiendo al editor completo...")
                router.push(`/admin/packages/${newPkg.id}`)
            } else {
                const error = await response.json()
                toast.error(`Error: ${error.error || "No se pudo crear"}`)
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al conectar con el servidor")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Paquete</h1>
                <p className="text-muted-foreground mt-2">
                    Comienza con los datos básicos. Luego podrás definir el itinerario detallado, precios y galería.
                </p>
            </div>

            <Card className="border-2">
                <CardHeader>
                    <CardTitle>Información Inicial</CardTitle>
                    <CardDescription>Estos datos crearán el borrador del paquete.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título del Viaje *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ej: Gran Tour de Europa"
                                autoFocus
                                required
                                className="text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-xs text-muted-foreground">URL Amigable (Slug)</Label>
                            <div className="flex items-center bg-muted px-3 rounded-md border text-muted-foreground text-sm h-10">
                                <span className="whitespace-nowrap">/viajes/</span>
                                <input
                                    className="bg-transparent border-none focus:outline-none w-full ml-1 text-foreground"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="days">Días</Label>
                                <Input
                                    id="days"
                                    type="number"
                                    min="1"
                                    value={formData.duration_days}
                                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nights">Noches</Label>
                                <Input
                                    id="nights"
                                    type="number"
                                    min="0"
                                    value={formData.duration_nights}
                                    onChange={(e) => setFormData({ ...formData, duration_nights: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Producto</Label>
                            <Select
                                value={formData.product_type}
                                onValueChange={(v) => setFormData({ ...formData, product_type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CIRCUIT">Circuito (Varios destinos)</SelectItem>
                                    <SelectItem value="HOTEL_PACKAGE">Paquete de Hotel</SelectItem>
                                    <SelectItem value="EXPERIENCE">Experiencia / Actividad</SelectItem>
                                    <SelectItem value="TRANSFER">Traslado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Link href="/admin/packages" className="flex-1">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" className="flex-1" disabled={isSubmitting || !formData.title}>
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="w-4 h-4 mr-2" />
                                )}
                                Crear y Editar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
