<template>
  <div v-if="lesson">
    <LessonVideo v-if="lesson.video" :src="lesson.video" :title="lesson.name" :group="course?.group" />

    <div class="mx-auto max-w-4xl px-4 pt-8 pb-24 sm:px-8">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-zinc-500">Lección {{ index + 1 }} de {{ lessons.length }}</p>
        <div class="flex flex-wrap gap-2">
          <DuiBadge v-if="!isTrue(lesson.active)" label="Oculta para estudiantes" color="warning" variant="soft" size="sm" />
          <DuiBadge v-if="done" label="Vista" color="success" variant="soft" size="sm" />
        </div>
      </div>
      <div class="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{{ lesson.name }}</h1>
        <div v-if="canManage" class="flex flex-wrap gap-2">
          <DuiAction :to="`/cursos/${slug}/lecciones/${lesson.slug}/entregas`" variant="outline" color="neutral">
            <i class="mdi mdi-inbox-arrow-down-outline mr-1" aria-hidden="true" /> Entregas
          </DuiAction>
          <DuiAction :to="`/cursos/${slug}/lecciones/${lesson.slug}/editar`" variant="outline" color="neutral">
            <i class="mdi mdi-pencil-outline mr-1" aria-hidden="true" /> Editar
          </DuiAction>
        </div>
      </div>
      <p v-if="lesson.description" class="mt-3 text-lg text-zinc-600 dark:text-zinc-400">{{ lesson.description }}</p>

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
          <div v-if="lesson.content" class="reading pt-6" v-html="renderContent(lesson.content, lesson.format)" />
          <p v-else class="pt-6 text-zinc-500">Esta lección no tiene contenido escrito.</p>
        </template>
        <template #actividad>
          <LessonActivity
            class="pt-6"
            :path="path"
            :activity="lesson.activity ?? ''"
            :format="lesson.format"
            :answer="lesson.myAnswer"
            :limit-date="lesson.limitDate"
            :readonly="!isStudent"
            @sent="saved"
          />
        </template>
        <template #quiz>
          <LessonQuiz
            class="pt-6"
            :path="path"
            :questions="questions"
            :quiz="lesson.myQuiz"
            :limit-date="lesson.limitDate"
            :readonly="!isStudent"
            @sent="saved"
          />
        </template>
      </DuiTabs>

      <nav class="mt-12 flex justify-between gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800" aria-label="Navegación entre lecciones">
        <DuiAction v-if="prev" :to="lessonUrl(prev.slug)" variant="outline" color="neutral">← Anterior</DuiAction>
        <span v-else />
        <DuiAction v-if="next" :to="lessonUrl(next.slug)" color="primary" class="min-w-0">
          <span class="truncate">Siguiente: {{ next.name }} →</span>
        </DuiAction>
        <DuiAction v-else :to="`/cursos/${slug}`" color="primary">Volver al curso</DuiAction>
      </nav>
    </div>

    <LessonQuestions :group="lesson.id" :lesson-name="lesson.name" />
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

const [{ course, lessons, enrollment, role, canManage, isDone, markViewed }, { data: lesson, refresh: refreshLesson }] = await Promise.all([
  useCourse(slug),
  useApi<LessonDetail>(path),
])
if (!lesson.value) throw createError({ statusCode: 404, statusMessage: 'Lección no encontrada', fatal: true })

// Abrir la lección con el token del estudiante ya la registra como vista
markViewed(lesson.value)

useSeo({
  title: `${lesson.value.name} · ${course.value?.name}`,
  description: lesson.value.description ?? course.value?.description?.slice(0, 160) ?? '',
  image: course.value?.picture,
  noindex: !isTrue(lesson.value.active),
})

const { user } = useAuth()
const toast = useToast()
const isStudent = computed(() => role.value === 'student')
const index = computed(() => lessons.value.findIndex(l => l.id === lesson.value?.id))
const prev = computed(() => lessons.value[index.value - 1])
const next = computed(() => lessons.value[index.value + 1])
const done = computed(() => !!lesson.value && isDone(lesson.value))

// La API puede devolver la pregunta directa o dentro de { question }
const questions = computed(() => (lesson.value?.quizQuestions ?? []).map(q => ('question' in q ? q.question : q)))

const tab = ref(String(route.query.tab ?? 'leccion'))
const tabs = computed(() => [
  { label: 'Lección', value: 'leccion', icon: 'mdi mdi-book-open-page-variant-outline' },
  ...(lesson.value?.activity ? [{ label: 'Actividad', value: 'actividad', icon: 'mdi mdi-pencil-outline' }] : []),
  ...(questions.value.length ? [{ label: 'Quiz', value: 'quiz', icon: 'mdi mdi-format-list-checks', badge: questions.value.length }] : []),
])

function lessonUrl(lessonSlug: string) {
  return `/cursos/${slug}/${lessonSlug}`
}

async function saved() {
  await refreshLesson()
  toast.success('¡Listo! Guardamos tu entrega.')
}
</script>
