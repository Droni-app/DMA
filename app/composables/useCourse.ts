import type { Course, Lesson, Paginated } from '~/types/api'

// Curso + lecciones + avance. Las claves de useFetch hacen que el layout y las páginas
// compartan los mismos datos sin repetir peticiones.
export async function useCourse(slug: string) {
  const [{ data: course, refresh }, { data: lessonPage }] = await Promise.all([
    useApi<Course>(`/learn/courses/${slug}`, { key: `course-${slug}` }),
    useApi<Paginated<Lesson>>(`/learn/courses/${slug}/lessons?per_page=100`, { key: `lessons-${slug}` }),
  ])

  const lessons = computed(() => [...(lessonPage.value?.data ?? [])].sort((a, b) => a.order - b.order))
  const enrollment = computed(() => course.value?.enrollment ?? null)

  // Una lección cuenta como completada cuando tiene una respuesta o un quiz enviado
  const doneIds = computed(() => new Set([
    ...(enrollment.value?.lessonAnswers ?? []).map(a => a.lessonId),
    ...(enrollment.value?.quizzes ?? []).map(q => q.lessonId),
  ]))
  const isDone = (lesson: Lesson) => doneIds.value.has(lesson.id)
  const doneCount = computed(() => lessons.value.filter(isDone).length)
  const percent = computed(() => (lessons.value.length ? Math.round((doneCount.value / lessons.value.length) * 100) : 0))
  const next = computed(() => lessons.value.find(l => !isDone(l)) ?? lessons.value[0])

  async function enroll() {
    await apiFetch(`/learn/courses/${slug}/enrollments`, { method: 'POST' })
    await refresh()
  }

  return { course, lessons, enrollment, isDone, doneCount, percent, next, enroll, refresh }
}
