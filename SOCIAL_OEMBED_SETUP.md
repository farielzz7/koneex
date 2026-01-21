# Configuración de oEmbed para Redes Sociales

## 📱 Cómo funciona

Esta implementación permite importar posts de **Instagram** y **Facebook** como testimonios usando la API oEmbed de Facebook/Meta.

## 🔑 Configuración Requerida

### 1. Crear Facebook App

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Click en **"My Apps"** → **"Create App"**
3. Selecciona **"Business"** como tipo de app
4. Completa los detalles:
   - **App Name**: "Travel Agency Testimonials"
   - **App Contact Email**: tu email
   - Click **"Create App"**

### 2. Obtener Access Tokens

#### Para Instagram:
1. En tu Facebook App, ve a **Settings** → **Basic**
2. Copia tu **App ID** y **App Secret**
3. Genera un token de acceso:
   - Ve a **Tools** → **Graph API Explorer**
   - Selecciona tu app
   - Genera un **User Access Token** con permisos: `instagram_basic`, `pages_show_list`
4. Extiende el token para que no expire:
   ```bash
   https://graph.facebook.com/v18.0/oauth/access_token?
   grant_type=fb_exchange_token&
   client_id={APP_ID}&
   client_secret={APP_SECRET}&
   fb_exchange_token={SHORT_LIVED_TOKEN}
   ```

#### Para Facebook:
- Usa el mismo proceso pero con permisos: `pages_read_engagement`, `pages_show_list`

### 3. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```bash
# Instagram oEmbed
INSTAGRAM_ACCESS_TOKEN=tu_instagram_token_aqui

# Facebook oEmbed  
FACEBOOK_ACCESS_TOKEN=tu_facebook_token_aqui
```

## 🚀 Uso

### Desde el Admin Panel

1. Ve a `/admin/content/social-testimonials`
2. Pega la URL del post de Instagram o Facebook:
   - **Instagram**: `https://www.instagram.com/p/ABC123/`
   - **Facebook**: `https://www.facebook.com/username/posts/123456`
3. Click en **"Cargar Post"**
4. Revisa la vista previa
5. Click en **"Guardar Testimonio"**

### Desde el API

```typescript
// Fetch oEmbed data
const response = await fetch('/api/social/oembed?url=' + encodeURIComponent(postUrl))
const data = await response.json()

console.log(data)
// {
//   platform: 'instagram',
//   html: '<blockquote class="instagram-media">...</blockquote>',
//   author_name: '@username',
//   author_url: 'https://www.instagram.com/username',
//   thumbnail_url: 'https://...',
//   ...
// }
```

## ⚠️ Limitaciones

### Instagram
- ✅ Posts públicos
- ✅ Reels públicos  
- ❌ Stories (no soportado por oEmbed)
- ❌ Posts privados

### Facebook
- ✅ Posts públicos de páginas
- ✅ Posts públicos de perfiles
- ❌ Posts privados
- ❌ Posts en grupos privados

## 🔧 Troubleshooting

### Error: "Invalid OAuth access token"
- Verifica que el token esté configurado correctamente en `.env.local`
- Asegúrate de que el token no haya expirado
- Regenera el token si es necesario

### Error: "URL must be public"
- El post debe ser público
- Para Instagram: el perfil debe ser público
- Para Facebook: verifica la configuración de privacidad del post

### El embed no se muestra
- Instagram y Facebook requieren cargar sus scripts de embed
- Agrega estos scripts en tu layout principal:

```html
<!-- Instagram Embed -->
<script async src="https://www.instagram.com/embed.js"></script>

<!-- Facebook Embed -->
<script async defer crossorigin="anonymous" 
  src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0">
</script>
```

## 📝 Alternativa: URLs Públicas (Sin Tokens)

Si no quieres configurar tokens, puedes usar **URLs públicas directas**:

### Instagram (sin token):
```
https://api.instagram.com/oembed?url=https://www.instagram.com/p/POST_ID/
```

### Facebook (sin token):
```  
https://www.facebook.com/plugins/post/oembed.json/?url=https://www.facebook.com/PAGE/posts/POST_ID
```

⚠️ **Nota**: Sin tokens, hay límites de rate más estrictos.

## 🎨 Personalizar el Embed

Los embeds vienen con estilos predeterminados de Instagram/Facebook. Puedes personalizarlos con CSS:

```css
/* Ocultar botones de follow */
.instagram-media .instagram-follow { display: none !important; }

/* Ajustar tamaño máximo */
.instagram-media { max-width: 500px !important; margin: 0 auto !important; }
```

## 🔐 Seguridad

- ✅ Los tokens nunca se exponen al cliente (solo en el servidor)
- ✅ Las URLs se validan antes de hacer requests
- ✅ Los embeds HTML son sanitizados por Instagram/Facebook
- ⚠️ No expongas los tokens en el código del cliente

## 📚 Referencias

- [Instagram oEmbed Documentation](https://developers.facebook.com/docs/instagram/oembed/)
- [Facebook oEmbed Documentation](https://developers.facebook.com/docs/plugins/oembed)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
