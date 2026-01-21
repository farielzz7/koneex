"use client"

import { useState } from "react"
import { Instagram, Facebook, Loader2, ExternalLink, Trash2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

type SocialPost = {
    platform: 'instagram' | 'facebook'
    original_url: string
    html: string
    author_name: string
    author_url?: string
    thumbnail_url?: string
}

export default function SocialTestimonialsPage() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<SocialPost | null>(null)
    const [savedPosts, setSavedPosts] = useState<any[]>([])

    const fetchOEmbed = async () => {
        if (!url.trim()) {
            toast.error("Ingresa una URL válida")
            return
        }

        if (!url.includes('instagram.com') && !url.includes('facebook.com')) {
            toast.error("La URL debe ser de Instagram o Facebook")
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`/api/social/oembed?url=${encodeURIComponent(url)}`)

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Error al obtener el post')
            }

            const data = await response.json()
            setPreview(data)
            toast.success("Post cargado correctamente")
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Error al cargar el post")
        } finally {
            setLoading(false)
        }
    }

    const saveTestimonial = async () => {
        if (!preview) return

        try {
            const { error } = await supabase
                .from('testimonials')
                .insert({
                    author_name: preview.author_name,
                    author_role: preview.platform === 'instagram' ? 'Instagram' : 'Facebook',
                    content: preview.html,
                    image_url: preview.thumbnail_url,
                    is_active: true,
                    rating: 5
                })

            if (error) throw error

            toast.success("Testimonio guardado")
            setPreview(null)
            setUrl("")
            loadSavedPosts()
        } catch (error) {
            console.error(error)
            toast.error("Error al guardar testimonio")
        }
    }

    const loadSavedPosts = async () => {
        const { data } = await supabase
            .from('testimonials')
            .select('*')
            .or('author_role.eq.Instagram,author_role.eq.Facebook')
            .order('created_at', { ascending: false })

        if (data) setSavedPosts(data)
    }

    const deletePost = async (id: number) => {
        if (!confirm('¿Eliminar este testimonio?')) return

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error("Error al eliminar")
        } else {
            toast.success("Testimonio eliminado")
            loadSavedPosts()
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Testimonios de Redes Sociales</h1>
                <p className="text-sm text-muted-foreground">
                    Importa posts de Instagram y Facebook como testimonios
                </p>
            </div>

            {/* Input para URL */}
            <div className="bg-white border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Importar Post</h2>
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.instagram.com/p/ABC123/ o https://www.facebook.com/..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            onKeyDown={(e) => e.key === 'Enter' && fetchOEmbed()}
                        />
                        <div className="absolute right-3 top-2.5 flex gap-1">
                            <Instagram className="w-5 h-5 text-pink-500" />
                            <Facebook className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <button
                        onClick={fetchOEmbed}
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cargando...
                            </>
                        ) : (
                            'Cargar Post'
                        )}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    💡 Pega la URL del post de Instagram o Facebook que quieras usar como testimonio
                </p>
            </div>

            {/* Preview del post */}
            {preview && (
                <div className="bg-white border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Vista Previa</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={saveTestimonial}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Guardar Testimonio
                            </button>
                            <button
                                onClick={() => setPreview(null)}
                                className="px-4 py-2 border rounded-lg hover:bg-muted"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Vista del Post:</h3>
                            <div
                                className="border rounded-lg p-4 overflow-auto max-h-[500px]"
                                dangerouslySetInnerHTML={{ __html: preview.html }}
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Detalles:</h3>
                            <dl className="space-y-2 text-sm">
                                <div>
                                    <dt className="font-medium text-muted-foreground">Plataforma:</dt>
                                    <dd className="flex items-center gap-2">
                                        {preview.platform === 'instagram' ? (
                                            <>
                                                <Instagram className="w-4 h-4 text-pink-500" />
                                                Instagram
                                            </>
                                        ) : (
                                            <>
                                                <Facebook className="w-4 h-4 text-blue-600" />
                                                Facebook
                                            </>
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-muted-foreground">Autor:</dt>
                                    <dd>{preview.author_name}</dd>
                                </div>
                                {preview.author_url && (
                                    <div>
                                        <dt className="font-medium text-muted-foreground">Perfil:</dt>
                                        <dd>
                                            <a
                                                href={preview.author_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline flex items-center gap-1"
                                            >
                                                Ver perfil
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="font-medium text-muted-foreground">URL Original:</dt>
                                    <dd className="truncate">
                                        <a
                                            href={preview.original_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-xs"
                                        >
                                            {preview.original_url}
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de posts guardados */}
            <div className="bg-white border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Testimonios Guardados</h2>
                    <button
                        onClick={loadSavedPosts}
                        className="text-sm text-primary hover:underline"
                    >
                        Recargar
                    </button>
                </div>

                {savedPosts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No hay testimonios de redes sociales guardados
                    </p>
                ) : (
                    <div className="grid gap-4">
                        {savedPosts.map((post) => (
                            <div key={post.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {post.author_role === 'Instagram' ? (
                                                <Instagram className="w-4 h-4 text-pink-500" />
                                            ) : (
                                                <Facebook className="w-4 h-4 text-blue-600" />
                                            )}
                                            <span className="font-medium">{post.author_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                • {post.author_role}
                                            </span>
                                        </div>
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: post.content?.substring(0, 200) || '' }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
