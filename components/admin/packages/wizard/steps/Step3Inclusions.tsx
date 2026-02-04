"use client"

import { useWizard } from "../WizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, Plus, Trash2, Tag as TagIcon, MapPin } from "lucide-react"
import { useState } from "react"

export function Step3Inclusions() {
    const { data, updateData } = useWizard()
    const { inclusions, exclusions, tags, tours_included } = data

    // State for new items inputs
    const [newInc, setNewInc] = useState("")
    const [newExc, setNewExc] = useState("")
    const [newTag, setNewTag] = useState("")
    const [newTour, setNewTour] = useState("")

    const addInclusion = () => {
        if (!newInc.trim()) return
        updateData('inclusions', [...inclusions, newInc.trim()])
        setNewInc("")
    }

    const removeInclusion = (index: number) => {
        updateData('inclusions', inclusions.filter((_, i) => i !== index))
    }

    const addExclusion = () => {
        if (!newExc.trim()) return
        updateData('exclusions', [...exclusions, newExc.trim()])
        setNewExc("")
    }

    const removeExclusion = (index: number) => {
        updateData('exclusions', exclusions.filter((_, i) => i !== index))
    }

    const addTag = () => {
        if (!newTag.trim() || tags.includes(newTag.trim())) return
        updateData('tags', [...tags, newTag.trim()])
        setNewTag("")
    }

    const removeTag = (tag: string) => {
        updateData('tags', tags.filter(t => t !== tag))
    }

    const addTour = () => {
        if (!newTour.trim()) return
        updateData('tours_included', [...tours_included, newTour.trim()])
        setNewTour("")
    }

    const removeTour = (index: number) => {
        updateData('tours_included', tours_included.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Inclusiones y Características</h2>
                <p className="text-muted-foreground">Define claramente qué está cubierto y las características del paquete.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-700 font-semibold text-lg border-b pb-2">
                        <Check className="w-5 h-5" />
                        <h3>Qué Incluye</h3>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={newInc}
                            onChange={(e) => setNewInc(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                            placeholder="Ej: Vuelo redondo"
                            className="flex-1"
                        />
                        <Button onClick={addInclusion} size="icon" variant="secondary">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {inclusions.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-green-50 text-green-900 rounded-md border border-green-100 group">
                                <span className="text-sm">{item}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-green-700 hover:text-red-600 opacity-60 group-hover:opacity-100"
                                    onClick={() => removeInclusion(i)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                        {inclusions.length === 0 && (
                            <p className="text-sm text-gray-400 italic text-center py-4">No hay inclusiones agregadas</p>
                        )}
                    </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-red-700 font-semibold text-lg border-b pb-2">
                        <X className="w-5 h-5" />
                        <h3>Qué NO Incluye</h3>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={newExc}
                            onChange={(e) => setNewExc(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclusion())}
                            placeholder="Ej: Propinas y gastos personales"
                            className="flex-1"
                        />
                        <Button onClick={addExclusion} size="icon" variant="secondary">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {exclusions.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-red-50 text-red-900 rounded-md border border-red-100 group">
                                <span className="text-sm">{item}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-700 hover:text-red-600 opacity-60 group-hover:opacity-100"
                                    onClick={() => removeExclusion(i)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                        {exclusions.length === 0 && (
                            <p className="text-sm text-gray-400 italic text-center py-4">No hay exclusiones agregadas</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tours Included */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg border-b pb-2">
                    <MapPin className="w-5 h-5" />
                    <h3>Tours y Actividades Incluidas</h3>
                </div>

                <div className="flex gap-2">
                    <Input
                        value={newTour}
                        onChange={(e) => setNewTour(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTour())}
                        placeholder="Ej: City Tour por Cancún"
                        className="flex-1"
                    />
                    <Button onClick={addTour} size="icon" variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {tours_included.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-blue-50 text-blue-900 rounded-md border border-blue-100 group">
                            <span className="text-sm">{item}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-blue-700 hover:text-red-600 opacity-60 group-hover:opacity-100"
                                onClick={() => removeTour(i)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                    {tours_included.length === 0 && (
                        <p className="text-sm text-gray-400 italic text-center py-4">No hay tours agregados</p>
                    )}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-700 font-semibold text-lg border-b pb-2">
                    <TagIcon className="w-5 h-5" />
                    <h3>Etiquetas (Tags)</h3>
                </div>

                <div className="flex gap-2">
                    <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Ej: playa, aventura, romántico"
                        className="flex-1"
                    />
                    <Button onClick={addTag} size="icon" variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <div key={index} className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-900 rounded-full border border-purple-200 text-sm">
                                <span>{tag}</span>
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="text-purple-500 hover:text-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic text-center py-2">No hay tags agregados</p>
                )}
            </div>
        </div>
    )
}
