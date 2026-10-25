import type { CompletedLesson, Course, Lesson, Paginated } from '~/types/api'

// Reutiliza lo ya cargado al navegar entre lecciones; refresh() siempre vuelve a pedirlo
const cached = {
  getCachedData: (key: string, nuxtApp: any, ctx: { cause: string }) =>
    ctx.cause === 'refresh:manual' ? undefined : nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
}

// Curso + lecciones + avance. Las claves hacen que el layout y las páginas compartan los mismos datos.
export async function useCourse(slug: string) {
  const { user } = useAuth()
  const uid = user.value?.id ?? 'guest'
  // Abrir una lección inscrito ya la marca como vista en el backend; `viewed` lo refleja sin pedir de nuevo la lista
  // (va antes del await: después se pierde el contexto de Nuxt)
  const viewed = useState<string[]>(`viewed-${uid}`, () => [])

  const [
    { data: course, refresh },
    { data: lessonPage, refresh: refreshLessons },
    { data: completedPage, refresh: refreshCompletedLessons },
  ] = await Promise.all([
    useApi<Course>(`/learn/courses/${slug}`, { key: `course-${slug}-${uid}`, ...cached }),
    useApi<Paginated<Lesson>>(`/learn/courses/${slug}/lessons?per_page=200`, { key: `lessons-${slug}-${uid}`, ...cached }),
    useApi<Paginated<CompletedLesson>>('/learn/user/lessons?per_page=500', { key: `completed-${uid}`, immediate: !!user.value, ...cached }),
  ])

  const enrollment = computed(() => course.value?.enrollment ?? null)
  const role = computed(() => enrollment.value?.role ?? '')
  const canManage = computed(() => role.value === 'teacher' || role.value === 'admin')
  const lessons = computed(() => [...(lessonPage.value?.data ?? [])].sort((a, b) => a.order - b.order))

  const doneIds = computed(() => new Set([...(completedPage.value?.data ?? []).map(lesson => lesson.id), ...viewed.value]))
  const isDone = (lesson: Lesson) => doneIds.value.has(lesson.id)
  const doneCount = computed(() => lessons.value.filter(isDone).length)
  const percent = computed(() => (lessons.value.length ? Math.round((doneCount.value / lessons.value.length) * 100) : 0))
  const next = computed(() => lessons.value.find(l => !isDone(l)) ?? lessons.value[0])

  function markViewed(lesson: Lesson) {
    if (enrollment.value && !viewed.value.includes(lesson.id)) viewed.value.push(lesson.id)
  }

  async function enroll() {
    await apiFetch(`/learn/courses/${slug}/enrollments`, { method: 'POST' })
    await refresh()
  }

  return { course, lessons, enrollment, role, canManage, isDone, doneCount, percent, next, markViewed, enroll, refresh, refreshLessons, refreshCompletedLessons }
}
