"use client"

import { useWizard } from "../WizardContext"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function Step6Availability() {
    const { data, updateData } = useWizard()
    const { availability } = data
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    const addDate = () => {
        if (!selectedDate) return

        // Check if already exists
        const exists = availability.some(a =>
            new Date(a.date).toDateString() === selectedDate.toDateString()
        )
        if (exists) return

        const newDateItem = {
            date: selectedDate,
            capacity: 20, // Default capacity
            status: 'OPEN' as const
        }

        updateData('availability', [...availability, newDateItem])
    }

    const removeDate = (index: number) => {
        const newAvail = availability.filter((_, i) => i !== index)
        updateData('availability', newAvail)
    }

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Fechas de Salida</h2>
                <p className="text-muted-foreground">Selecciona las fechas de salida confirmadas para este paquete.</p>
            </div>

            <div className="grid md:grid-cols-[300px_1fr] gap-8">
                <div>
                    <Card>
                        <CardContent className="p-4">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border mx-auto"
                            />
                            <Button className="w-full mt-4" onClick={addDate} disabled={!selectedDate}>
                                <Plus className="w-4 h-4 mr-2" /> Agregar Fecha
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Salidas Programadas ({availability.length})</h3>

                    {availability.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                            <p className="text-muted-foreground">Selecciona una fecha en el calendario para agregarla.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {availability.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((item, index) => (
                                <Card key={index} className="overflow-hidden group">
                                    <div className="flex items-center justify-between p-4 bg-background border rounded-lg hover:shadow-md transition-all">
                                        <div>
                                            <div className="text-lg font-bold capitalize">
                                                {format(new Date(item.date), 'dd MMM yyyy', { locale: es })}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Cupo: {item.capacity} pasajeros
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {item.status}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeDate(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
