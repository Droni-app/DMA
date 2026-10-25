<template>
  <div v-if="lesson">
    <LessonVideo v-if="lesson.video" :src="lesson.video" :title="lesson.name" :group="course?.group" />

    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-zinc-500">Lección {{ index + 1 }} de {{ lessons.length }}</p>
        <DuiBadge v-if="done" label="Completada" color="success" variant="soft" size="sm" />
      </div>
      <div class="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{{ lesson.name }}</h1>
        <DuiAction
          v-if="canManageLessons"
          :to="`/cursos/${slug}/lecciones/${lesson.slug}/editar`"
          variant="outline"
          color="neutral"
        >
          <i class="mdi mdi-pencil-outline mr-1" aria-hidden="true" /> Editar lección
        </DuiAction>
      </div>

      <DuiAlert v-if="!user" color="neutral" variant="outline" class="mt-6">
        <NuxtLink :to="{ path: '/registro', query: { redirect: route.path } }" class="font-semibold underline">Crea tu cuenta gratis</NuxtLink>
        o <NuxtLink :to="{ path: '/login', query: { redirect: route.path } }" class="font-semibold underline">ingresa</NuxtLink>
        para guardar tu avance y enviar actividades.
      </DuiAlert>
      <DuiAlert v-else-if="!enrollment" color="warning" variant="outline" class="mt-6">
        Aún no estás inscrito en este curso, así que tu avance no se guardará.
        <NuxtLink :to="`/cursos/${slug}`" class="font-semibold underline">Inscríbete gratis</NuxtLink>
      </DuiAlert>

      <DuiTabs v-model="tab" :tabs="tabs" class="mt-6" aria-label="Contenido de la lección">
        <template #leccion>
          <div class="reading pt-6" v-html="renderContent(lesson.content, lesson.format)" />
        </template>
        <template #actividad>
          <LessonActivity class="pt-6" :path="path" :activity="lesson.activity ?? ''" :format="lesson.format" :answer="lesson.myAnswer" :readonly="!enrollment" @sent="saved" />
        </template>
        <template #quiz>
          <LessonQuiz class="pt-6" :path="path" :questions="questions" :quiz="lesson.myQuiz" :readonly="!enrollment" @sent="saved" />
        </template>
      </DuiTabs>

      <!-- Lecciones sin actividad ni quiz se completan con un clic -->
      <div v-if="enrollment && !lesson.activity && !questions.length" class="mt-12 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <p class="flex-1 text-zinc-600 dark:text-zinc-400">
            {{ done ? '¡Bien hecho! Ya completaste esta lección.' : '¿Terminaste? Márcala como completada para registrar tu avance.' }}
          </p>
          <DuiButton v-if="!done" color="success" :loading="marking" @click="markDone">
            <i class="mdi mdi-check mr-1" aria-hidden="true" /> Marcar como completada
          </DuiButton>
        </div>
      </div>

      <nav class="mt-6 flex justify-between gap-3" aria-label="Navegación entre lecciones">
        <DuiAction v-if="prev" :to="lessonUrl(prev.slug)" variant="outline" color="neutral">← Anterior</DuiAction>
        <span v-else />
        <DuiAction v-if="next" :to="lessonUrl(next.slug)" color="primary">Siguiente: {{ next.name }} →</DuiAction>
        <DuiAction v-else :to="`/cursos/${slug}`" color="primary">Volver al curso</DuiAction>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { LessonDetail } from '~/types/api'

// key: la página se monta de nuevo en cada lección (el layout con el sidebar se mantiene)
definePageMeta({ layout: 'course', key: route => route.fullPath })

const route = useRoute()
const slug = String(route.params.slug)
const path = `/learn/courses/${slug}/lessons/${route.params.lesson}`

const [{ course, lessons, enrollment, isDone, refresh: refreshCourse, refreshCompletedLessons }, { data: lesson, refresh: refreshLesson }] = await Promise.all([
  useCourse(slug),
  useApi<LessonDetail>(path),
])
if (!lesson.value) throw createError({ statusCode: 404, statusMessage: 'Lección no encontrada', fatal: true })

useSeo({
  title: `${lesson.value.name} · ${course.value?.name}`,
  description: lesson.value.description ?? course.value?.description?.slice(0, 160) ?? '',
})

const { user } = useAuth()
const toast = useToast()
const canManageLessons = computed(() => ['teacher', 'admin'].includes(enrollment.value?.role ?? ''))
const index = computed(() => lessons.value.findIndex(l => l.id === lesson.value?.id))
const prev = computed(() => lessons.value[index.value - 1])
const next = computed(() => lessons.value[index.value + 1])
const done = computed(() => !!lesson.value && isDone(lesson.value))

// La API puede devolver la pregunta directa o dentro de { question }
const questions = computed(() => (lesson.value?.quizQuestions ?? []).map(q => ('question' in q ? q.question : q)))

const tab = ref('leccion')
const tabs = computed(() => [
  { label: 'Lección', value: 'leccion' },
  ...(lesson.value?.activity ? [{ label: 'Actividad', value: 'actividad' }] : []),
  ...(questions.value.length ? [{ label: 'Quiz', value: 'quiz' }] : []),
])

function lessonUrl(lessonSlug: string) {
  return `/cursos/${slug}/${lessonSlug}`
}

// Después de enviar algo se actualizan la lección y el avance del curso
async function saved() {
  await Promise.all([refreshLesson(), refreshCourse()])
  toast.success('¡Listo! Guardamos tu avance.')
}

const marking = ref(false)
async function markDone() {
  marking.value = true
  try {
    lesson.value = await apiFetch<LessonDetail>(path)
    await Promise.all([refreshCompletedLessons(), refreshCourse()])
    toast.success('Lección marcada como vista y avance actualizado.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos registrar la lección como vista.'))
  } finally {
    marking.value = false
  }
}
</script>
