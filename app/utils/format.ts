// La API devuelve booleanos como true/1/'1'
export function isTrue(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

// Progreso o nota (0–100) a número entero
export function toPercent(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(100, Math.max(0, Math.round(number))) : 0
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function userName(user?: { fullName: string | null; email: string } | null) {
  return user?.fullName || user?.email || 'Usuario'
}

export function initials(name?: string | null) {
  return (name || '?').split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase()
}

// Solo rutas internas, para no redirigir a otros sitios
export function safeRedirect(value: unknown, fallback = '/panel') {
  const path = String(value ?? '')
  return path.startsWith('/') && !path.startsWith('//') ? path : fallback
}

// Fecha ISO <-> valor de <input type="datetime-local">
export function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

export function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : null
}

export const roleLabels: Record<string, string> = { student: 'Estudiante', teacher: 'Docente', admin: 'Administrador' }
export const statusLabels: Record<string, string> = { pending: 'Pendiente', active: 'Activa', completed: 'Completada', canceled: 'Cancelada' }

// Estadísticas del banco de preguntas: aciertos (wons), fallos (losses) y dificultad (% de fallos)
export function questionStat(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

export function questionDifficulty(question: { wons?: unknown; losses?: unknown; difficulty?: unknown }) {
  if (question.difficulty != null && Number.isFinite(Number(question.difficulty))) return `${Number(question.difficulty).toFixed(1)}%`
  const attempts = questionStat(question.wons) + questionStat(question.losses)
  return attempts ? `${((questionStat(question.losses) / attempts) * 100).toFixed(1)}%` : '—'
}
