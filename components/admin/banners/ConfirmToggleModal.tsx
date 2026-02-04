"use client"

import { AlertTriangle, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmToggleModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    banner: {
        id: string
        title: string
        is_active: boolean
    } | null
}

export function ConfirmToggleModal({ isOpen, onClose, onConfirm, banner }: ConfirmToggleModalProps) {
    if (!isOpen || !banner) return null

    const isActivating = !banner.is_active

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div
                            className={`flex items-center justify-center w-12 h-12 rounded-full ${isActivating ? "bg-green-100" : "bg-orange-100"
                                }`}
                        >
                            {isActivating ? (
                                <Power className="w-6 h-6 text-green-600" />
                            ) : (
                                <PowerOff className="w-6 h-6 text-orange-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text">
                                {isActivating ? "Activar Banner" : "Desactivar Banner"}
                            </h2>
                            <p className="text-sm text-text-muted">{banner.title}</p>
                        </div>
                    </div>

                    <div className="bg-surface rounded-lg p-4 mb-6">
                        {isActivating ? (
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-text mb-1">
                                        Al activar este banner, se desactivará automáticamente cualquier otro banner activo.
                                    </p>
                                    <p className="text-text-muted">Solo puede haber un banner activo a la vez.</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-text-muted">
                                El banner dejará de mostrarse en la página principal. Podrás activarlo nuevamente cuando lo
                                necesites.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={onConfirm}
                            className={
                                isActivating
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-orange-600 hover:bg-orange-700 text-white"
                            }
                        >
                            {isActivating ? (
                                <>
                                    <Power className="w-4 h-4 mr-2" />
                                    Activar
                                </>
                            ) : (
                                <>
                                    <PowerOff className="w-4 h-4 mr-2" />
                                    Desactivar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
