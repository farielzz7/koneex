"use client"

import { useWizard } from "../WizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export function Step3Inclusions() {
    const { data, updateData } = useWizard()
    const { inclusions, exclusions } = data

    // State for new items inputs
    const [newInc, setNewInc] = useState("")
    const [newExc, setNewExc] = useState("")

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

    const handleKeyDownInc = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addInclusion()
        }
    }

    const handleKeyDownExc = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addExclusion()
        }
    }

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Incluye / No Incluye</h2>
                <p className="text-muted-foreground">Define claramente qué está cubierto por el precio.</p>
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
                            onKeyDown={handleKeyDownInc}
                            placeholder="Ej: Vuelo redondo"
                            className="flex-1"
                        />
                        <Button onClick={addInclusion} size="icon" variant="secondary">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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
                            onKeyDown={handleKeyDownExc}
                            placeholder="Ej: Propinas y gastos personales"
                            className="flex-1"
                        />
                        <Button onClick={addExclusion} size="icon" variant="secondary">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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
        </div>
    )
}
