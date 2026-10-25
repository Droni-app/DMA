export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' })
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Bogota' })
}
