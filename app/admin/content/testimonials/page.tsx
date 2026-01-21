"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Plus, MessageSquare, Star, Loader2, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Types
type Testimonial = {
    id: number
    author_name: string
    author_role: string
    content: string
    image_url: string | null
    rating: number
    is_active: boolean
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadTestimonials()
    }, [])

    const loadTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from("testimonials")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setTestimonials(data || [])
        } catch (error) {
            console.error(error)
            toast.error("Error al cargar testimonios")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Testimonios</h1>
                    <p className="text-sm text-gray-500">
                        Gestiona las opiniones de clientes que se muestran en el sitio.
                    </p>
                </div>
                <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Testimonio
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">No hay testimonios</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Agrega testimonios para generar confianza.
                        </p>
                    </div>
                ) : (
                    testimonials.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                        {item.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.image_url} alt={item.author_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                                                {item.author_name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">{item.author_name}</h3>
                                        {item.author_role && <p className="text-xs text-gray-500">{item.author_role}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <Edit2 className="w-4 h-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-1 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "w-4 h-4",
                                                i < (item.rating || 5) ? "text-yellow-400 fill-current" : "text-gray-200"
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3 italic">
                                    &ldquo;{item.content}&rdquo;
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className={cn(
                                    "text-xs font-medium px-2 py-1 rounded-full",
                                    item.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                                )}>
                                    {item.is_active ? 'Visible' : 'Oculto'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
