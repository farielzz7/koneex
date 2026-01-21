"use client"

import { useWizard } from "../WizardContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step1General() {
    const { data, updateData } = useWizard()
    const { general } = data

    // Mock destinations - In real app, fetch from API
    const destinations = [
        { id: "1", name: "Cancun" },
        { id: "2", name: "Paris" },
        { id: "3", name: "Japon" }
    ]

    // Slug auto-generation
    useEffect(() => {
        if (general.title && !general.slug) {
            const slug = general.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            updateData('general', { ...general, slug: slug })
        }
    }, [general.title])

    const handleChange = (field: keyof typeof general, value: any) => {
        updateData('general', { ...general, [field]: value })
    }

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Información General</h2>
                <p className="text-muted-foreground">Define los datos básicos de este paquete turístico.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Identidad del Paquete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Título del Viaje</Label>
                        <Input
                            value={general.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Ej: Aventura Maya 2026"
                            className="text-lg font-medium"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Slug (URL) <span className="text-muted-foreground font-normal text-xs">- Se genera automático</span></Label>
                        <div className="flex items-center rounded-md border bg-muted/50 px-3 h-10 text-sm text-muted-foreground">
                            domain.com/viajes/
                            <input
                                value={general.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                className="bg-transparent border-none focus:outline-none flex-1 ml-1 text-foreground"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Destino Principal</Label>
                            <Select
                                value={general.destination_id}
                                onValueChange={(v) => handleChange('destination_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {destinations.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Duración y Descripción</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                        <div className="space-y-2">
                            <Label>Días</Label>
                            <Input
                                type="number"
                                min={1}
                                value={general.duration_days}
                                onChange={(e) => handleChange('duration_days', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Noches</Label>
                            <Input
                                type="number"
                                min={0}
                                value={general.duration_nights}
                                onChange={(e) => handleChange('duration_nights', parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción Corta (Marketing)</Label>
                        <Textarea
                            placeholder="Un resumen atractivo para la tarjeta del producto..."
                            rows={2}
                            value={general.description} // Using description for now, simpler
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
