// Configuración visual de las materias. El curso guarda materia y grado en `group`,
// por ejemplo "Matemáticas · 8" o "Matemáticas grado 8".

export const subjects = [
  { name: 'Matemáticas', icon: 'mdi mdi-calculator-variant-outline', cover: 'from-sky-500 to-indigo-600' },
  { name: 'Lenguaje', icon: 'mdi mdi-book-open-page-variant-outline', cover: 'from-rose-500 to-pink-600' },
  { name: 'Ciencias Naturales', icon: 'mdi mdi-leaf', cover: 'from-emerald-500 to-teal-600' },
  { name: 'Ciencias Sociales', icon: 'mdi mdi-earth', cover: 'from-amber-500 to-orange-600' },
  { name: 'Inglés', icon: 'mdi mdi-translate', cover: 'from-violet-500 to-purple-600' },
  { name: 'Física', icon: 'mdi mdi-atom', cover: 'from-cyan-500 to-blue-600' },
  { name: 'Química', icon: 'mdi mdi-flask-outline', cover: 'from-lime-500 to-green-600' },
  { name: 'Saber 11', icon: 'mdi mdi-school-outline', cover: 'from-slate-600 to-zinc-800' },
]

const fallback = { name: 'General', icon: 'mdi mdi-book-open-variant', cover: 'from-slate-500 to-slate-700' }

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// "Matemáticas · 8" → { subject: 'Matemáticas', grade: '8°' }
export function parseGroup(group: string | null) {
  const match = (group ?? '').match(/^(.*?)[\s·\-]*(?:grado\s*)?(\d+)\s*°?$/i)
  return {
    subject: (match ? match[1] : group)?.trim() || fallback.name,
    grade: match ? `${match[2]}°` : null,
  }
}

export function getSubject(name: string) {
  return subjects.find(s => normalize(s.name) === normalize(name)) ?? { ...fallback, name }
}
