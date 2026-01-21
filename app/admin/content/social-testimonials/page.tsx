"use client"

import { useState } from "react"
import { Instagram, Facebook, Loader2, Trash2, CheckCircle, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export default function SocialTestimonialsPage() {
    const [imageUrl, setImageUrl] = useState("")
    const [postUrl, setPostUrl] = useState("")
    const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram')
    const [authorName, setAuthorName] = useState("")
    const [savedPosts, setSavedPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const saveTestimonial = async () => {
        if (!imageUrl.trim() || !authorName.trim()) {
            toast.error("Completa URL de imagen y nombre del autor")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase
                .from('testimonials')
                .insert({
                    author_name: authorName,
                    author_role: platform === 'instagram' ? 'Instagram' : 'Facebook',
                    image_url: imageUrl,
                    content: postUrl || null, // Guardamos la URL del post en content
                    is_active: true,
                    rating: 5
                })

            if (error) throw error

            toast.success("Testimonio guardado")
            setImageUrl("")
            setPostUrl("")
            setAuthorName("")
            loadSavedPosts()
        } catch (error) {
            console.error(error)
            toast.error("Error al guardar testimonio")
        } finally {
            setLoading(false)
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
                    Agrega posts de Instagram y Facebook pegando las URLs
                </p>
            </div>

            {/* Formulario simple */}
            <div className="bg-white border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Nuevo Testimonio</h2>

                <div className="space-y-4">
                    {/* Plataforma */}
                    <div>
                        <label className="text-sm font-medium block mb-2">Plataforma *</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setPlatform('instagram')}
                                className={`flex-1 py-3 px-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${platform === 'instagram'
                                        ? 'border-pink-500 bg-pink-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Instagram className="w-5 h-5 text-pink-500" />
                                <span className="font-medium">Instagram</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPlatform('facebook')}
                                className={`flex-1 py-3 px-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${platform === 'facebook'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Facebook className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">Facebook</span>
                            </button>
                        </div>
                    </div>

                    {/* URL de la imagen */}
                    <div>
                        <label className="text-sm font-medium block mb-1">URL de la Imagen *</label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://scontent.fbcdn.net/..."
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            💡 Click derecho en la imagen → "Copiar dirección de imagen"
                        </p>
                    </div>

                    {/* URL del post (opcional) */}
                    <div>
                        <label className="text-sm font-medium block mb-1">URL del Post (opcional)</label>
                        <input
                            type="url"
                            value={postUrl}
                            onChange={(e) => setPostUrl(e.target.value)}
                            placeholder="https://www.instagram.com/p/... o https://www.facebook.com/..."
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Nombre del autor */}
                    <div>
                        <label className="text-sm font-medium block mb-1">Nombre del Autor *</label>
                        <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="@usuario o Nombre Completo"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Vista previa */}
                    {imageUrl && (
                        <div>
                            <label className="text-sm font-medium block mb-2">Vista Previa:</label>
                            <div className="border rounded-lg p-4 bg-gray-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="max-w-full h-auto rounded"
                                    onError={() => toast.error("URL de imagen inválida")}
                                />
                            </div>
                        </div>
                    )}

                    {/* Botón guardar */}
                    <button
                        onClick={saveTestimonial}
                        disabled={loading || !imageUrl.trim() || !authorName.trim()}
                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Guardar Testimonio
                            </>
                        )}
                    </button>
                </div>
            </div>

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
                                <div className="flex items-start gap-4">
                                    {/* Imagen */}
                                    {post.image_url && (
                                        <div className="w-24 h-24 flex-shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={post.image_url}
                                                alt={post.author_name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
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
                                        {post.content && (
                                            <a
                                                href={post.content}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <LinkIcon className="w-3 h-3" />
                                                Ver post original
                                            </a>
                                        )}
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Botón eliminar */}
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
