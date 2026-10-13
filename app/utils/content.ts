import { marked } from 'marked'

// Contenido de lecciones y posts (por defecto viene en markdown)
export function renderContent(content: string | null, format = 'markdown') {
  if (!content) return ''
  return format === 'html' ? content : (marked.parse(content, { async: false }) as string)
}

// Minutos de lectura aproximados
export function readingTime(content: string | null) {
  return Math.max(1, Math.round((content ?? '').split(/\s+/).length / 200))
}

// Convierte enlaces de YouTube/Vimeo a su versión para incrustar
export function embedUrl(url: string | null) {
  if (!url) return null
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}
