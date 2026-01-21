"use client"

import { useWizard } from "../WizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image as ImageIcon, Video, Star, Trash2, Link as LinkIcon, UploadCloud } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Step4Media() {
    const { data, updateData } = useWizard()
    const { media } = data
    const [urlInput, setUrlInput] = useState("")
    const [activeTab, setActiveTab] = useState("link")

    const handleAddUrl = (type: 'IMAGE' | 'VIDEO') => {
        if (!urlInput) return

        const newItem = {
            url: urlInput,
            type,
            is_cover: media.length === 0 // First one is cover by default
        }

        updateData('media', [...media, newItem])
        setUrlInput("")
    }

    const removeMedia = (index: number) => {
        const newMedia = media.filter((_, i) => i !== index)
        // If we removed the cover, make the first one cover (if exists)
        if (media[index].is_cover && newMedia.length > 0) {
            newMedia[0].is_cover = true
        }
        updateData('media', newMedia)
    }

    const setCover = (index: number) => {
        const newMedia = media.map((item, i) => ({
            ...item,
            is_cover: i === index
        }))
        updateData('media', newMedia)
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
                            <TabsTrigger value="link">Desde URL</TabsTrigger>
                            <TabsTrigger value="upload" disabled>Subir Archivo (Próximamente)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="link" className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="Pegar URL de la imagen o video (Youtube/Vimeo)..."
                                        className="pl-9"
                                    />
                                </div>
                                <Button onClick={() => handleAddUrl('IMAGE')} variant="secondary">
                                    <ImageIcon className="w-4 h-4 mr-2" /> Agregar Imagen
                                </Button>
                                <Button onClick={() => handleAddUrl('VIDEO')} variant="outline">
                                    <Video className="w-4 h-4 mr-2" /> Agregar Video
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="upload">
                            <div className="border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-not-allowed">
                                <UploadCloud className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p>Arrastra archivos aquí o haz clic para subir</p>
                                <p className="text-xs mt-1">(Requiere integración con Storage)</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            "group relative aspect-video bg-muted rounded-lg overflow-hidden border-2 transition-all",
                            item.is_cover ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/50"
                        )}
                    >
                        {item.type === 'IMAGE' ? (
                            <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                                <Video className="w-8 h-8" />
                            </div>
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                            <Button
                                size="sm"
                                variant="ghost"
                                className={cn("h-8 px-2 text-xs text-white hover:bg-white/20", item.is_cover && "text-yellow-400 font-bold")}
                                onClick={() => setCover(index)}
                            >
                                <Star className={cn("w-3 h-3 mr-1", item.is_cover && "fill-yellow-400")} />
                                {item.is_cover ? "Portada" : "Hacer Portada"}
                            </Button>

                            <Button
                                size="icon"
                                variant="destructive"
                                className="h-7 w-7"
                                onClick={() => removeMedia(index)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>

                        {item.is_cover && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                                PORTADA
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {media.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No hay elementos multimedia</p>
                </div>
            )}
        </div>
    )
}
