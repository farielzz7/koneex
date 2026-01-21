"use client"

import { useWizard } from "../WizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Step2Itinerary() {
    const { data, updateData } = useWizard()
    const { itinerary } = data
    const [expandedDay, setExpandedDay] = useState<number | null>(1)

    // Helper to add a new day
    const addDay = () => {
        const nextDayNum = itinerary.length + 1
        const newDay = {
            day_number: nextDayNum,
            title: `Día ${nextDayNum}`,
            items: []
        }
        updateData('itinerary', [...itinerary, newDay])
        setExpandedDay(nextDayNum)
    }

    // Helper to remove a day
    const removeDay = (index: number) => {
        const newItinerary = itinerary.filter((_, i) => i !== index)
        // Re-number days
        const renumbered = newItinerary.map((d, i) => ({ ...d, day_number: i + 1 }))
        updateData('itinerary', renumbered)
    }

    // Helper to update day title
    const updateDayTitle = (index: number, title: string) => {
        const newItinerary = [...itinerary]
        newItinerary[index].title = title
        updateData('itinerary', newItinerary)
    }

    // Activity Helpers
    const addActivity = (dayIndex: number) => {
        const newItinerary = [...itinerary]
        newItinerary[dayIndex].items.push({
            time: "",
            title: "",
            description: ""
        })
        updateData('itinerary', newItinerary)
    }

    const updateActivity = (dayIndex: number, axIndex: number, field: string, value: string) => {
        const newItinerary = [...itinerary]
        newItinerary[dayIndex].items[axIndex] = {
            ...newItinerary[dayIndex].items[axIndex],
            [field]: value
        }
        updateData('itinerary', newItinerary)
    }

    const removeActivity = (dayIndex: number, axIndex: number) => {
        const newItinerary = [...itinerary]
        newItinerary[dayIndex].items = newItinerary[dayIndex].items.filter((_, i) => i !== axIndex)
        updateData('itinerary', newItinerary)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Itinerario Detallado</h2>
                    <p className="text-muted-foreground">Describe qué harán los clientes día a día.</p>
                </div>
                <Button onClick={addDay} className="gap-2">
                    <Plus className="w-4 h-4" /> Agregar Día
                </Button>
            </div>

            <div className="space-y-4">
                {itinerary.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
                        <p className="text-muted-foreground mb-4">No has agregado días al itinerario.</p>
                        <Button variant="secondary" onClick={addDay}>Comenzar Itinerario</Button>
                    </div>
                )}

                {itinerary.map((day, dayIndex) => (
                    <Card key={dayIndex} className="border transition-all hover:border-primary/50">
                        <div
                            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30"
                            onClick={() => setExpandedDay(expandedDay === day.day_number ? null : day.day_number)}
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                {day.day_number}
                            </div>
                            <div className="flex-1 font-semibold text-lg">
                                {day.title}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => { e.stopPropagation(); removeDay(dayIndex); }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            {expandedDay === day.day_number ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>

                        {expandedDay === day.day_number && (
                            <CardContent className="pt-0 pb-6 pl-14 pr-6 animate-in slide-in-from-top-2">
                                <div className="mb-4">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Título del Día</Label>
                                    <Input
                                        value={day.title}
                                        onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
                                        placeholder="Ej: Llegada y Check-in"
                                        className="mt-1 font-medium"
                                    />
                                </div>

                                <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                                    {day.items.map((item, axIndex) => (
                                        <div key={axIndex} className="relative group bg-muted/30 p-3 rounded-md border border-transparent hover:border-border hover:bg-background transition-all">
                                            <div className="grid grid-cols-[100px_1fr_auto] gap-3 items-start">
                                                <div className="relative">
                                                    <Clock className="w-3 h-3 absolute top-3 left-2 text-muted-foreground" />
                                                    <Input
                                                        value={item.time}
                                                        onChange={(e) => updateActivity(dayIndex, axIndex, 'time', e.target.value)}
                                                        placeholder="08:00 AM"
                                                        className="pl-7 h-9 text-xs"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => updateActivity(dayIndex, axIndex, 'title', e.target.value)}
                                                        placeholder="Actividad..."
                                                        className="h-9 font-medium"
                                                    />
                                                    <Textarea
                                                        value={item.description}
                                                        onChange={(e) => updateActivity(dayIndex, axIndex, 'description', e.target.value)}
                                                        placeholder="Detalles de la actividad"
                                                        rows={2}
                                                        className="text-sm min-h-[60px]"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeActivity(dayIndex, axIndex)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" size="sm" onClick={() => addActivity(dayIndex)} className="w-full border-dashed text-muted-foreground hover:text-primary">
                                        <Plus className="w-4 h-4 mr-2" /> Agregar Actividad
                                    </Button>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
