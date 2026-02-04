"use client"

import { useWizard } from "../WizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image as ImageIcon, Video, Star, Trash2, Link as LinkIcon, UploadCloud, Plus } from "lucide-react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

export function Step4Media() {
    const { data, updateData } = useWizard()
    const { media, images } = data
    const [urlInput, setUrlInput] = useState("")
    const [activeTab, setActiveTab] = useState("upload")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAddUrl = (type: 'IMAGE' | 'VIDEO') => {
        if (!urlInput) return

        const newImage = urlInput.trim()
        updateData('images', [...images, newImage])
        setUrlInput("")
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        // Convert files to base64 or upload to storage
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const reader = new FileReader()

            reader.onloadend = () => {
                const base64 = reader.result as string
                updateData('images', [...images, base64])
            }

            reader.readAsDataURL(file)
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removeImage = (index: number) => {
        updateData('images', images.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Galería Multimedia</h2>
                <p className="text-muted-foreground">Agrega fotos y videos para hacer atractivo el paquete.</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="upload">Subir Archivo</TabsTrigger>
                            <TabsTrigger value="link">Desde URL</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="space-y-4">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                <UploadCloud className="w-10 h-10 mx-auto mb-2" />
                                <p className="font-medium">Arrastra archivos aquí o haz clic para subir</p>
                                <p className="text-xs mt-1">JPG, PNG, GIF (máx. 5MB)</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </TabsContent>

                        <TabsContent value="link" className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="Pegar URL de la imagen o video (Youtube/Vimeo)..."
                                        className="pl-9"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl('IMAGE'))}
                                    />
                                </div>
                                <Button onClick={() => handleAddUrl('IMAGE')} variant="secondary">
                                    <Plus className="w-4 h-4 mr-2" /> Agregar
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div
                        key={index}
                        className="group relative aspect-video bg-muted rounded-lg overflow-hidden border-2 border-transparent hover:border-muted-foreground/50 transition-all"
                    >
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback for broken images
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen%3C/text%3E%3C/svg%3E'
                            }}
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                            <div className="text-white text-xs">
                                {index === 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span>Portada</span>
                                    </div>
                                )}
                            </div>

                            <Button
                                size="icon"
                                variant="destructive"
                                className="h-7 w-7"
                                onClick={() => removeImage(index)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>

                        {index === 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                                PORTADA
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No hay imágenes agregadas</p>
                </div>
            )}
        </div>
    )
}
