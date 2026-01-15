/**
 * WhatsApp Integration Helper
 * Utilidades para enviar mensajes formateados a WhatsApp
 */

// Número de WhatsApp del negocio (sin espacios ni guiones)
export const BUSINESS_WHATSAPP = "5219993387710"

// Número de teléfono fijo del negocio
export const BUSINESS_PHONE = "9993387710"
export const BUSINESS_PHONE_FORMATTED = "999 338 7710"

// Dirección del negocio
export const BUSINESS_ADDRESS = {
  street: "Calle 2 #353 x 11 y 15",
  neighborhood: "Fracc. José María Iturralde (Las Águilas)",
  city: "Mérida",
  state: "Yucatán",
  country: "México",
  full: "Calle 2 #353 x 11 y 15, Fracc. José María Iturralde (Las Águilas). Mérida, Yucatán. México.",
}

// Generar enlace de Google Maps
export const getGoogleMapsLink = () => {
  const address = encodeURIComponent(BUSINESS_ADDRESS.full)
  return `https://www.google.com/maps/search/?api=1&query=${address}`
}

/**
 * Genera un enlace tel: para llamadas telefónicas
 * @returns URL para iniciar una llamada
 */
export const getPhoneCallLink = (): string => {
  return `tel:${BUSINESS_PHONE}`
}

/**
 * Inicia una llamada telefónica
 */
export const initiatePhoneCall = (): void => {
  window.location.href = getPhoneCallLink()
}

/**
 * Genera un enlace de WhatsApp con un mensaje pre-formateado
 * @param message El mensaje a enviar
 * @returns URL para abrir WhatsApp
 */
export const getWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodedMessage}`
}

/**
 * Abre WhatsApp con un mensaje
 * @param message El mensaje a enviar
 */
export const openWhatsApp = (message: string): void => {
  window.open(getWhatsAppLink(message), "_blank")
}

// Interfaz para datos de cotización
export interface QuoteFormData {
  nombre: string
  telefono: string
  destino: string
  fechaInicio?: string
  fechaFin?: string
  adultos: number
  menores?: number
  edadesMenores?: (number | undefined)[]
  comentarios?: string
}

/**
 * Formatea los datos de cotización para WhatsApp
 */
export const formatQuoteMessage = (data: QuoteFormData): string => {
  let message = `🌴 *NUEVA COTIZACIÓN - KONEEX*\n\n`
  message += `👤 *Nombre:* ${data.nombre}\n`
  message += `📱 *Teléfono:* ${data.telefono}\n`
  message += `📍 *Destino:* ${data.destino}\n`

  if (data.fechaInicio && data.fechaFin) {
    message += `📅 *Fechas:* ${data.fechaInicio} al ${data.fechaFin}\n`
  }

  message += `👥 *Viajeros:* ${data.adultos} adulto(s)`
  if (data.menores && data.menores > 0) {
    message += ` y ${data.menores} menor(es)`
    if (data.edadesMenores && data.edadesMenores.length > 0) {
      const edadesValidas = data.edadesMenores.filter(edad => edad !== undefined) as number[]
      if (edadesValidas.length > 0) {
        message += ` (edades: ${edadesValidas.join(", ")} años)`
      }
    }
  }
  message += `\n`

  if (data.comentarios) {
    message += `\n💬 *Comentarios:*\n${data.comentarios}\n`
  }

  message += `\n✨ Por favor envíenme información y cotización.`

  return message
}

// Interfaz para solicitud de asesoramiento
export interface AdviceFormData {
  nombre: string
  telefono: string
  email?: string
  consulta: string
}

/**
 * Formatea los datos de asesoramiento para WhatsApp
 */
export const formatAdviceMessage = (data: AdviceFormData): string => {
  let message = `🎯 *SOLICITUD DE ASESORAMIENTO - KONEEX*\n\n`
  message += `👤 *Nombre:* ${data.nombre}\n`
  message += `📱 *Teléfono:* ${data.telefono}\n`

  if (data.email) {
    message += `📧 *Email:* ${data.email}\n`
  }

  message += `\n💭 *Consulta:*\n${data.consulta}\n`
  message += `\n✨ Necesito asesoramiento personalizado.`

  return message
}

// Interfaz para trámite de visa
export interface VisaFormData {
  nombre: string
  telefono: string
  email?: string
  destino: string
  tipoVisa?: string
  comentarios?: string
}

/**
 * Formatea los datos de trámite de visa para WhatsApp
 */
export const formatVisaMessage = (data: VisaFormData): string => {
  let message = `🛂 *TRÁMITE DE VISA - KONEEX*\n\n`
  message += `👤 *Nombre:* ${data.nombre}\n`
  message += `📱 *Teléfono:* ${data.telefono}\n`

  if (data.email) {
    message += `📧 *Email:* ${data.email}\n`
  }

  message += `🌎 *País destino:* ${data.destino}\n`

  if (data.tipoVisa) {
    message += `📋 *Tipo de visa:* ${data.tipoVisa}\n`
  }

  if (data.comentarios) {
    message += `\n💬 *Comentarios:*\n${data.comentarios}\n`
  }

  message += `\n✨ Necesito ayuda con el trámite de visa.`

  return message
}

// Interfaz para consulta de paquete
export interface PackageInquiryData {
  nombre: string
  telefono?: string
  paquete: string
  precio?: string
}

/**
 * Formatea consulta de paquete para WhatsApp
 */
export const formatPackageInquiry = (data: PackageInquiryData): string => {
  let message = `✈️ *CONSULTA DE PAQUETE - KONEEX*\n\n`
  message += `👤 *Nombre:* ${data.nombre}\n`

  if (data.telefono) {
    message += `📱 *Teléfono:* ${data.telefono}\n`
  }

  message += `🎫 *Paquete:* ${data.paquete}\n`

  if (data.precio) {
    message += `💰 *Precio:* ${data.precio}\n`
  }

  message += `\n✨ Me interesa este paquete, quisiera más información.`

  return message
}
