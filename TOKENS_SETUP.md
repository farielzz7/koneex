# Configuración Rápida de Tokens de Facebook/Instagram

## 🔑 Paso 1: Crear Facebook App (5 minutos)

1. Ve a [Facebook Developers](https://developers.facebook.com/apps)
2. Click **"Crear app"**
3. Tipo: **"Empresa"** o **"Ninguno"**
4. Nombre: `Travel Agency Testimonials`
5. Email de contacto: tu email
6. Click **"Crear app"**

## 🎯 Paso 2: Obtener Access Token

### Para INSTAGRAM:

1. En tu app, ve a **Herramientas** → **Graph API Explorer**
2. Selecciona tu app en el dropdown
3. Click **"Generate Access Token"**
4. Otorga permisos: `instagram_basic`, `pages_show_list`
5. **Copia el token** que aparece

### Extender el token (importante):

El token expira en 1 hora. Para hacerlo permanente:

```bash
https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=TU_APP_ID&client_secret=TU_APP_SECRET&fb_exchange_token=TU_TOKEN_CORTO
```

Reemplaza:
- `TU_APP_ID`: ID de tu app (en Settings → Basic)
- `TU_APP_SECRET`: App Secret (en Settings → Basic, click "Show")
- `TU_TOKEN_CORTO`: El token que copiaste antes

Pega esa URL en el navegador. Te dará un **token de larga duración** (60 días).

### Para FACEBOOK:

Mismo proceso, pero otorga permisos: `pages_read_engagement`

## ⚙️ Paso 3: Agregar a tu aplicación

Edita tu archivo `.env.local`:

```bash
# Instagram & Facebook Access Tokens
INSTAGRAM_ACCESS_TOKEN=tu_token_aqui
FACEBOOK_ACCESS_TOKEN=tu_token_aqui
```

## ✅ Paso 4: Reiniciar el servidor

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

¡Listo! Ahora funciona con URLs.

---

## 🚨 Notas importantes:

- **Tokens expiran cada 60 días** - necesitarás renovarlos
- **Posts deben ser públicos** para que funcione
- **No compartas los tokens** - son privados

## 🔄 Renovar tokens (cada 60 días):

Repite el proceso del Paso 2 para obtener un nuevo token.

---

## 📝 Alternativa: Token que nunca expira

Para un token permanente, necesitas crear una **Página de Facebook** y usar **Page Access Token**. 

¿Quieres que te explique cómo?
