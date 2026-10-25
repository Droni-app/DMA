<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Mis cursos</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">Abre un curso para ver tu avance y continuar donde lo dejaste.</p>

    <div v-if="courses?.data.length" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CourseCard v-for="course in courses.data" :key="course.id" :course="course">
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>Avance</span>
            <span>{{ progress(course) }}%</span>
          </div>
          <ProgressBar :value="progress(course)" />
        </div>
      </CourseCard>
    </div>
    <EmptyState
      v-else
      class="mt-8"
      icon="mdi mdi-book-clock-outline"
      title="Aún no estás inscrito en ningún curso"
      text="Explora el catálogo e inscríbete para empezar a aprender."
    >
      <DuiAction to="/cursos" color="primary" class="mt-5">Explorar cursos</DuiAction>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import type { MyLearningCourse, Paginated } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mis cursos', description: 'Tus cursos en DMA.', noindex: true })

const { data: courses } = await useApi<Paginated<MyLearningCourse>>('/learn/user/courses?per_page=100')

function progress(course: MyLearningCourse) {
  const value = Number(course.enrollments[0]?.progress)
  return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0
}
</script>
