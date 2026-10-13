<template>
  <div v-if="course && lesson" class="grid gap-8 lg:grid-cols-[1fr_280px]">
    <div class="min-w-0">
      <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
        <NuxtLink to="/panel/cursos" class="hover:underline">Mis cursos</NuxtLink>
        <span class="mx-2">/</span>
        <span>{{ course.name }}</span>
      </nav>
      <p class="mt-4 text-sm font-medium text-zinc-500">Lección {{ lesson.order }} de {{ course.lessons.length }}</p>
      <h1 class="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">{{ lesson.name }}</h1>

      <DuiTabs v-model="tab" :tabs="tabs" class="mt-6" aria-label="Contenido de la lección">
        <template #leccion>
          <div class="pt-6">
            <div v-if="lesson.format === 'video'" class="mb-8 grid aspect-video place-items-center rounded-xl bg-zinc-900 text-white">
              <i class="mdi mdi-play-circle-outline text-6xl opacity-80" aria-hidden="true" />
            </div>
            <div class="reading" v-html="lesson.content" />
          </div>
        </template>
        <template #quiz>
          <div class="pt-6">
            <LessonQuiz />
          </div>
        </template>
      </DuiTabs>

      <div class="mt-12 flex justify-between gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <DuiAction v-if="prev" :to="lessonUrl(prev.slug)" variant="outline" color="neutral">← Anterior</DuiAction>
        <span v-else />
        <DuiAction v-if="next" :to="lessonUrl(next.slug)" color="primary">Siguiente →</DuiAction>
        <DuiAction v-else to="/panel/cursos" color="success">Terminar curso</DuiAction>
      </div>
    </div>

    <aside>
      <div class="rounded-xl border border-zinc-200 bg-white p-4 lg:sticky lg:top-24 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 class="px-2 text-sm font-semibold text-zinc-900 dark:text-white">Lecciones</h2>
        <ol class="mt-3 space-y-1">
          <li v-for="item in course.lessons" :key="item.id">
            <NuxtLink
              :to="lessonUrl(item.slug)"
              class="flex items-center gap-3 rounded-lg px-2 py-2 text-sm"
              :class="item.id === lesson.id
                ? 'bg-slate-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'"
            >
              <i :class="item.order < lesson.order ? 'mdi mdi-check-circle text-emerald-500' : 'mdi mdi-circle-outline'" aria-hidden="true" />
              {{ item.name }}
            </NuxtLink>
          </li>
        </ol>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { getCourse } from '~/data/courses'

// key: la página se monta de nuevo en cada lección
definePageMeta({ layout: 'panel', middleware: 'auth', key: route => route.fullPath })

const route = useRoute()
const course = getCourse(String(route.params.course))
const index = course?.lessons.findIndex(l => l.slug === route.params.lesson) ?? -1
if (!course || index < 0) throw createError({ statusCode: 404, statusMessage: 'Lección no encontrada', fatal: true })

const lesson = course.lessons[index]!
const prev = course.lessons[index - 1]
const next = course.lessons[index + 1]

useSeo({ title: lesson.name, description: lesson.description, noindex: true })

const tab = ref('leccion')
const tabs = [
  { label: 'Lección', value: 'leccion' },
  { label: 'Quiz', value: 'quiz' },
]

function lessonUrl(slug: string) {
  return `/panel/cursos/${course!.slug}/${slug}`
}
</script>
