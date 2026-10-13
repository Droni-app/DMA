export function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}
