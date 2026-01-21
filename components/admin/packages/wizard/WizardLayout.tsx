"use client"

import { useWizard } from "./WizardContext"
import { cn } from "@/lib/utils"
import { Check, ArrowRight, Layout, Map, List, Image as ImageIcon, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const STEPS = [
    { id: 1, title: "General", icon: Layout },
    { id: 2, title: "Itinerario", icon: Map },
    { id: 3, title: "Incluye", icon: List },
    { id: 4, title: "Media", icon: ImageIcon },
    { id: 5, title: "Precios", icon: DollarSign },
    { id: 6, title: "Cupos", icon: Calendar },
]

export function WizardLayout({ children }: { children: React.ReactNode }) {
    const { currentStep, setStep } = useWizard()

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar Stepper */}
            <div className="w-64 border-r bg-muted/30 p-6 hidden md:block overflow-y-auto">
                <h2 className="font-bold text-lg mb-6 tracking-tight">Nuevo Paquete</h2>
                <div className="space-y-2">
                    {STEPS.map((step) => {
                        const isActive = currentStep === step.id
                        const isCompleted = currentStep > step.id
                        const Icon = step.icon

                        return (
                            <div
                                key={step.id}
                                onClick={() => setStep(step.id)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "hover:bg-muted text-muted-foreground",
                                    isCompleted && !isActive && "text-primary font-medium"
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border text-xs",
                                    isActive ? "bg-primary-foreground text-primary border-transparent" : "border-muted-foreground/30",
                                    isCompleted && !isActive && "bg-primary/10 border-primary text-primary"
                                )}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                                </div>
                                <div className="flex-1">
                                    <span className="block text-sm font-medium">{step.title}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-background">
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-background/80 backdrop-blur flex justify-between items-center px-8">
                    <Button
                        variant="ghost"
                        onClick={() => setStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                    >
                        Atrás
                    </Button>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => console.log('Save Draft')}>
                            Guardar Borrador
                        </Button>
                        <Button
                            onClick={() => setStep(Math.min(6, currentStep + 1))}
                            className="gap-2"
                        >
                            {currentStep === 6 ? 'Finalizar' : 'Siguiente'}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
