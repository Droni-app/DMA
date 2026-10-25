<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-8">
    <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
      <NuxtLink :to="`/cursos/${slug}`" class="hover:underline">{{ course?.name }}</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink :to="`/cursos/${slug}/${lessonSlug}`" class="hover:underline">{{ lesson?.name }}</NuxtLink>
      <span class="mx-2">/</span>
      <span>Entregas</span>
    </nav>

    <h1 class="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">Entregas</h1>
    <p class="mt-2 text-zinc-600 dark:text-zinc-400">Califica las actividades y revisa los intentos del cuestionario de esta lección.</p>

    <DuiTabs v-model="tab" :tabs="tabs" class="mt-6" aria-label="Tipo de entrega">
      <!-- Actividades -->
      <template #actividades>
        <div class="pt-6">
          <EmptyState v-if="!lesson?.activity" icon="mdi mdi-pencil-off-outline" title="Esta lección no tiene actividad" text="Agrega un enunciado de actividad al editar la lección para recibir entregas." />
          <template v-else>
            <DuiAlert v-if="answersError" color="danger" variant="outline">{{ apiError(answersError) }}</DuiAlert>
            <ul v-if="answers?.data.length" class="space-y-4">
              <li v-for="item in answers.data" :key="item.id" class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-zinc-900 dark:text-white">{{ userName(item.user) }}</p>
                    <p v-if="item.createdAt" class="text-sm text-zinc-500">{{ formatDateTime(item.createdAt) }}</p>
                  </div>
                  <DuiBadge
                    :label="item.result != null ? `${toPercent(item.result)}/100` : 'Sin calificar'"
                    :color="item.result != null ? 'success' : 'warning'"
                    variant="soft"
                  />
                </div>
                <p class="mt-3 whitespace-pre-line text-zinc-700 dark:text-zinc-300">{{ item.answer }}</p>
                <a v-if="item.attachment" :href="item.attachment" target="_blank" rel="noopener" class="mt-2 inline-flex items-center gap-1 text-sm font-medium underline">
                  <i class="mdi mdi-paperclip" aria-hidden="true" /> Archivo adjunto
                </a>
                <p v-if="item.feedback" class="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  <strong>Retroalimentación:</strong> {{ item.feedback }}
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <DuiButton size="sm" color="primary" variant="outline" @click="openGrade(item)">
                    <i class="mdi mdi-star-check-outline mr-1" aria-hidden="true" /> {{ item.result != null ? 'Cambiar nota' : 'Calificar' }}
                  </DuiButton>
                  <DuiButton v-if="isAdmin" size="sm" color="danger" variant="ghost" @click="remove('answers', item.id)">
                    <i class="mdi mdi-delete-outline mr-1" aria-hidden="true" /> Eliminar
                  </DuiButton>
                </div>
              </li>
            </ul>
            <EmptyState v-else-if="!answersError" icon="mdi mdi-inbox-outline" title="Aún no hay entregas" />
            <DuiPagination v-if="(answers?.meta.lastPage ?? 1) > 1" v-model="answersPage" :total="answers!.meta.total" :per-page="answers!.meta.perPage" class="mt-6 justify-center" />
          </template>
        </div>
      </template>

      <!-- Cuestionario -->
      <template #quiz>
        <div class="pt-6">
          <DuiAlert v-if="quizzesError" color="danger" variant="outline">{{ apiError(quizzesError) }}</DuiAlert>
          <div v-if="quizzes?.data.length" class="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table class="w-full min-w-[560px] divide-y divide-zinc-200 text-left dark:divide-zinc-800">
              <thead class="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th scope="col" class="px-4 py-3 font-semibold">Estudiante</th>
                  <th scope="col" class="px-4 py-3 font-semibold">Fecha</th>
                  <th scope="col" class="px-4 py-3 text-right font-semibold">Nota</th>
                  <th scope="col" class="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr v-for="item in quizzes.data" :key="item.id">
                  <td class="px-4 py-3 font-medium text-zinc-900 dark:text-white">{{ userName(item.user) }}</td>
                  <td class="px-4 py-3 text-sm text-zinc-500">{{ item.createdAt ? formatDateTime(item.createdAt) : '—' }}</td>
                  <td class="px-4 py-3 text-right font-semibold tabular-nums">{{ item.results != null ? `${toPercent(item.results)}%` : '—' }}</td>
                  <td class="px-4 py-3">
                    <div class="flex justify-end gap-2">
                      <DuiButton size="sm" variant="outline" color="neutral" @click="openQuiz(item)">Corregir</DuiButton>
                      <DuiButton v-if="isAdmin" size="sm" variant="ghost" color="danger" :title="'Eliminar intento'" @click="remove('quizzes', item.id)">
                        <i class="mdi mdi-delete-outline" aria-hidden="true" />
                      </DuiButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <EmptyState v-else-if="!quizzesError" icon="mdi mdi-format-list-checks" title="Aún no hay intentos del cuestionario" />
          <DuiPagination v-if="(quizzes?.meta.lastPage ?? 1) > 1" v-model="quizzesPage" :total="quizzes!.meta.total" :per-page="quizzes!.meta.perPage" class="mt-6 justify-center" />
        </div>
      </template>
    </DuiTabs>

    <ClientOnly>
      <DuiModal v-model="gradeOpen" :title="grading.kind === 'answers' ? 'Calificar actividad' : 'Corregir intento'" :description="grading.student">
        <DuiForm :loading="saving" @submit="saveGrade">
          <DuiLabel title="Nota (0 a 100)">
            <DuiInput v-model.number="grading.result" type="number" min="0" max="100" step="1" block />
          </DuiLabel>
          <DuiLabel v-if="grading.kind === 'answers'" title="Retroalimentación">
            <DuiTextarea v-model="grading.feedback" rows="4" placeholder="¿Qué hizo bien? ¿Qué puede mejorar?" block />
          </DuiLabel>
          <template #footer>
            <DuiButton type="submit" color="primary" block :loading="saving">Guardar</DuiButton>
          </template>
        </DuiForm>
      </DuiModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Lesson, LessonAnswer, LessonQuiz, Paginated } from '~/types/api'

definePageMeta({ layout: 'course' })

const route = useRoute()
const slug = String(route.params.slug)
const lessonSlug = String(route.params.lesson)
const lessonPath = `/learn/courses/${slug}/lessons/${lessonSlug}`
const { course, lessons, role, canManage } = await useCourse(slug)
if (!course.value) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })
if (!canManage.value) throw createError({ statusCode: 403, statusMessage: 'Solo los docentes del curso pueden ver las entregas', fatal: true })

const lesson = computed<Lesson | undefined>(() => lessons.value.find(l => l.slug === lessonSlug))
if (!lesson.value) throw createError({ statusCode: 404, statusMessage: 'Lección no encontrada', fatal: true })

useSeo({ title: `Entregas · ${lesson.value.name}`, description: 'Entregas de la lección.', noindex: true })

const isAdmin = role.value === 'admin'
const toast = useToast()
const answersPage = ref(1)
const quizzesPage = ref(1)
const [
  { data: answers, error: answersError, refresh: refreshAnswers },
  { data: quizzes, error: quizzesError, refresh: refreshQuizzes },
] = await Promise.all([
  useApi<Paginated<LessonAnswer>>(() => `${lessonPath}/answers?per_page=20&page=${answersPage.value}`),
  useApi<Paginated<LessonQuiz>>(() => `${lessonPath}/quizzes?per_page=20&page=${quizzesPage.value}`),
])

const tab = ref(lesson.value.activity ? 'actividades' : 'quiz')
const tabs = computed(() => [
  { label: 'Actividades', value: 'actividades', badge: answers.value?.meta.total || undefined },
  { label: 'Cuestionario', value: 'quiz', badge: quizzes.value?.meta.total || undefined },
])

const gradeOpen = ref(false)
const saving = ref(false)
const grading = reactive({ kind: 'answers' as 'answers' | 'quizzes', id: '', student: '', result: '' as number | '', feedback: '' })

function openGrade(item: LessonAnswer) {
  Object.assign(grading, { kind: 'answers', id: item.id, student: userName(item.user), result: item.result != null ? toPercent(item.result) : '', feedback: item.feedback ?? '' })
  gradeOpen.value = true
}

function openQuiz(item: LessonQuiz) {
  Object.assign(grading, { kind: 'quizzes', id: item.id, student: userName(item.user), result: item.results != null ? toPercent(item.results) : '', feedback: '' })
  gradeOpen.value = true
}

async function saveGrade() {
  saving.value = true
  const result = grading.result === '' ? null : Math.min(100, Math.max(0, Number(grading.result)))
  try {
    await apiFetch(`${lessonPath}/${grading.kind}/${grading.id}`, {
      method: 'PUT',
      body: grading.kind === 'answers'
        ? { feedback: grading.feedback || null, result }
        : { status: 'completed', results: result },
    })
    await (grading.kind === 'answers' ? refreshAnswers() : refreshQuizzes())
    gradeOpen.value = false
    toast.success('La calificación se guardó.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos guardar la calificación.'))
  } finally {
    saving.value = false
  }
}

async function remove(kind: 'answers' | 'quizzes', id: string) {
  if (!window.confirm('¿Eliminar esta entrega? El estudiante podrá enviarla de nuevo.')) return
  try {
    await apiFetch(`${lessonPath}/${kind}/${id}`, { method: 'DELETE' })
    await (kind === 'answers' ? refreshAnswers() : refreshQuizzes())
    toast.success('La entrega fue eliminada.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos eliminar la entrega.'))
  }
}
</script>
