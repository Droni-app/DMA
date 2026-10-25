import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

const contentTags = [
  'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code', 'col', 'colgroup', 'dd', 'del',
  'div', 'dl', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li',
  'ol', 'p', 'pre', 's', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot',
  'th', 'thead', 'tr', 'u', 'ul',
]
const contentAttributes = ['alt', 'colspan', 'height', 'href', 'rowspan', 'scope', 'src', 'title', 'width']
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function sanitizeContent(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: contentTags,
    ALLOWED_ATTR: contentAttributes,
    ALLOW_DATA_ATTR: false,
  })
}

// Contenido de lecciones y posts (por defecto viene en markdown)
export function renderContent(content: string | null, format = 'markdown') {
  if (!content) return ''
  let html: string
  if (format === 'html') {
    html = content
  } else if (format === 'text') {
    const escaped = content.replace(/[&<>"']/g, character => htmlEntities[character] ?? character)
    html = `<p>${escaped.replace(/\r?\n/g, '<br>')}</p>`
  } else {
    html = marked.parse(content, { async: false }) as string
  }
  return sanitizeContent(html)
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
