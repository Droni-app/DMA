<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:px-8">
    <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
      <NuxtLink :to="`/cursos/${slug}`" class="hover:underline">{{ course?.name }}</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink :to="`/cursos/${slug}/${lesson?.slug}`" class="hover:underline">{{ lesson?.name }}</NuxtLink>
      <span class="mx-2">/</span>
      <span>Editar</span>
    </nav>

    <h1 class="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">Editar lección</h1>
    <p class="mt-2 text-zinc-600 dark:text-zinc-400">Actualiza el contenido y la configuración de esta lección.</p>

    <DuiForm class="mt-8 space-y-5" :loading="saving" @submit="updateLesson">
      <DuiLabel title="Título" required>
        <DuiInput v-model="form.name" placeholder="Título de la lección" required block />
      </DuiLabel>

      <DuiLabel title="Orden en el listado" required>
        <DuiInput v-model.number="form.order" type="number" min="1" step="1" required block />
      </DuiLabel>

      <DuiLabel title="Resumen">
        <DuiTextarea v-model="form.description" rows="2" placeholder="Descripción breve de la lección" block />
      </DuiLabel>

      <DuiLabel title="Formato del contenido">
        <DuiSelect v-model="form.format" :options="formatOptions" block />
      </DuiLabel>

      <RichContentEditor v-model="form.content" :format="form.format" label="Contenido" placeholder="Escribe el contenido de la lección" />

      <RichContentEditor v-model="form.activity" :format="form.format" label="Actividad" placeholder="Instrucciones para la actividad (opcional)" :rows="5" />

      <DuiLabel title="URL del video">
        <DuiInput v-model="form.video" type="url" placeholder="https://…" block />
      </DuiLabel>

      <DuiLabel title="Fecha límite (opcional)" help-text="Aplica a la actividad y al cuestionario.">
        <DuiInput v-model="form.limitDate" type="datetime-local" block />
      </DuiLabel>

      <DuiSwitch v-model="form.active" label="Lección visible" description="Si está desactivada, no estará visible para estudiantes." />

      <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>

      <div class="flex flex-wrap gap-3">
        <DuiButton type="submit" color="primary" :loading="saving">Guardar cambios</DuiButton>
        <DuiAction :to="`/cursos/${slug}/${lesson?.slug}`" variant="outline" color="neutral">Cancelar</DuiAction>
        <DuiButton v-if="isAdmin" type="button" variant="ghost" color="danger" class="sm:ml-auto" :loading="deleting" @click="deleteLesson">
          <i class="mdi mdi-delete-outline mr-1" aria-hidden="true" /> Eliminar lección
        </DuiButton>
      </div>
    </DuiForm>

    <section class="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Preguntas del cuestionario</h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Elige preguntas del banco del curso para incluirlas en esta lección.</p>
        </div>
        <DuiAction :to="`/cursos/${slug}/preguntas`" variant="outline" color="neutral">
          Administrar banco
        </DuiAction>
      </div>

      <DuiAlert v-if="questionError" color="danger" variant="outline" class="mt-5">{{ questionError }}</DuiAlert>

      <div v-if="questionLinks.length" class="mt-5 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table class="w-full min-w-[640px] divide-y divide-zinc-200 text-left dark:divide-zinc-800">
          <thead class="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Pregunta</th>
              <th scope="col" class="px-4 py-3 text-right font-semibold">Aciertos</th>
              <th scope="col" class="px-4 py-3 text-right font-semibold">Fallos</th>
              <th scope="col" class="px-4 py-3 text-right font-semibold">Dificultad</th>
              <th scope="col" class="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr v-for="link in questionLinks" :key="link.id" class="align-top">
              <td class="px-4 py-4">
                <div class="reading text-base" v-html="renderContent(link.question.name, 'html')" />
              </td>
              <td class="px-4 py-4 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{{ questionStat(link.question.wons) }}</td>
              <td class="px-4 py-4 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{{ questionStat(link.question.losses) }}</td>
              <td class="px-4 py-4 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{{ questionDifficulty(link.question) }}</td>
              <td class="px-4 py-4">
                <div class="flex justify-end">
                  <DuiButton
                    variant="outline"
                    color="danger"
                    size="sm"
                    :loading="unlinkingId === link.id"
                    @click="unlinkQuestion(link)"
                  >
                    <i class="mdi mdi-link-off mr-1" aria-hidden="true" /> Quitar
                  </DuiButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-else-if="!questionError" class="mt-5" icon="mdi mdi-help-circle-outline" title="Esta lección aún no tiene preguntas" />

      <DuiForm v-if="!questionError && availableQuestions.length" class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end" :loading="linking" @submit="linkQuestion">
        <DuiLabel title="Pregunta del banco" class="flex-1">
          <DuiSelect
            v-model="selectedQuestionId"
            :options="[
              { label: 'Selecciona una pregunta', value: '' },
              ...availableQuestions.map(question => ({ label: question.name, value: question.id })),
            ]"
            block
          />
        </DuiLabel>
        <DuiButton type="submit" color="primary" :loading="linking" :disabled="!selectedQuestionId">
          <i class="mdi mdi-link-plus mr-1" aria-hidden="true" /> Asignar pregunta
        </DuiButton>
      </DuiForm>
      <p v-else-if="!questionError" class="mt-4 text-sm text-zinc-500">
        {{ questionBank?.data.length ? 'Todas las preguntas del banco ya están asignadas.' : 'No hay preguntas disponibles en el banco para asignar.' }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { LessonDetail, LessonQuestionLink, Paginated, Question } from '~/types/api'

definePageMeta({ layout: 'course' })

const route = useRoute()
const slug = String(route.params.slug)
const lessonSlug = String(route.params.lesson)
const { course, role, canManage, refreshLessons } = await useCourse(slug)
const { data: lesson } = await useApi<LessonDetail>(`/learn/courses/${slug}/lessons/${lessonSlug}`)

if (!course.value) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })
if (!lesson.value) throw createError({ statusCode: 404, statusMessage: 'Lección no encontrada', fatal: true })
if (!canManage.value) {
  throw createError({ statusCode: 403, statusMessage: 'No tienes permiso para editar lecciones en este curso', fatal: true })
}
const lessonPath = `/learn/courses/${slug}/lessons/${lessonSlug}`
const [
  { data: questionLinkData, refresh: refreshQuestionLinks, error: questionLinksRequestError },
  { data: questionBank, error: questionBankRequestError },
] = await Promise.all([
  useApi<LessonQuestionLink[]>(`${lessonPath}/exam-questions`),
  useApi<Paginated<Question>>(`/learn/courses/${slug}/questions?per_page=100`),
])

useSeo({ title: `Editar ${lesson.value.name} · ${course.value.name}`, description: 'Editar una lección del curso.', noindex: true })

const toast = useToast()
const isAdmin = role.value === 'admin'
const saving = ref(false)
const deleting = ref(false)
const error = ref('')
const linking = ref(false)
const unlinkingId = ref('')
const selectedQuestionId = ref('')
const questionActionError = ref('')
const formatOptions = [
  { label: 'Texto', value: 'text' },
  { label: 'HTML', value: 'html' },
  { label: 'Markdown', value: 'markdown' },
]
const form = reactive({
  name: lesson.value.name,
  description: lesson.value.description ?? '',
  format: lesson.value.format,
  content: lesson.value.content ?? '',
  activity: lesson.value.activity ?? '',
  video: lesson.value.video ?? '',
  order: lesson.value.order,
  active: isTrue(lesson.value.active),
  limitDate: toDateTimeLocal(lesson.value.limitDate),
})
const questionLinks = computed(() => questionLinkData.value ?? [])
const linkedQuestionIds = computed(() => new Set(questionLinks.value.map(link => link.questionId)))
const availableQuestions = computed(() => (questionBank.value?.data ?? []).filter(question => !linkedQuestionIds.value.has(question.id)))
const questionError = computed(() => questionActionError.value
  || (questionLinksRequestError.value ? apiError(questionLinksRequestError.value, 'No pudimos cargar las preguntas de esta lección.') : '')
  || (questionBankRequestError.value ? apiError(questionBankRequestError.value, 'No pudimos cargar el banco de preguntas.') : ''))

async function linkQuestion() {
  if (!selectedQuestionId.value) return
  linking.value = true
  questionActionError.value = ''

  try {
    await apiFetch(`${lessonPath}/exam-questions`, {
      method: 'POST',
      body: { question_id: selectedQuestionId.value },
    })
    await refreshQuestionLinks()
    selectedQuestionId.value = ''
    toast.success('La pregunta fue asignada a la lección.')
  } catch (e) {
    questionActionError.value = apiError(e, 'No pudimos asignar la pregunta.')
  } finally {
    linking.value = false
  }
}

async function unlinkQuestion(link: LessonQuestionLink) {
  unlinkingId.value = link.id
  questionActionError.value = ''

  try {
    await apiFetch(`${lessonPath}/exam-questions/${link.id}`, { method: 'DELETE' })
    await refreshQuestionLinks()
    toast.success('La pregunta fue quitada de la lección.')
  } catch (e) {
    questionActionError.value = apiError(e, 'No pudimos quitar la pregunta.')
  } finally {
    unlinkingId.value = ''
  }
}

async function updateLesson() {
  saving.value = true
  error.value = ''

  try {
    await apiFetch(`/learn/courses/${slug}/lessons/${lessonSlug}`, {
      method: 'PUT',
      body: {
        name: form.name,
        description: form.description || null,
        format: form.format,
        content: form.content || null,
        activity: form.activity || null,
        video: form.video || null,
        order: form.order,
        active: form.active,
        limit_date: fromDateTimeLocal(form.limitDate),
      },
    })
    await refreshLessons()
    toast.success('Los cambios se guardaron.')
    await navigateTo(`/cursos/${slug}`)
  } catch (e) {
    error.value = apiError(e, 'No pudimos guardar los cambios. Intenta de nuevo.')
  } finally {
    saving.value = false
  }
}

async function deleteLesson() {
  if (!window.confirm(`¿Eliminar la lección «${lesson.value?.name}»? Se perderán sus entregas y no se puede deshacer.`)) return
  deleting.value = true
  try {
    await apiFetch(lessonPath, { method: 'DELETE' })
    await refreshLessons()
    toast.success('La lección fue eliminada.')
    await navigateTo(`/cursos/${slug}`)
  } catch (e) {
    toast.error(apiError(e, 'No pudimos eliminar la lección.'))
  } finally {
    deleting.value = false
  }
}
</script>
