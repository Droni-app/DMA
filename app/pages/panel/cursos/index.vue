<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Mis cursos</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">Abre un curso para ver tu avance y continuar donde lo dejaste.</p>

    <!-- Pendiente: endpoint general de inscripciones del estudiante; mientras tanto se listan todos los cursos -->
    <div v-if="courses?.data.length" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CourseCard v-for="course in courses.data" :key="course.id" :course="course" />
    </div>
    <EmptyState v-else class="mt-8" icon="mdi mdi-book-clock-outline" title="Aún no hay cursos disponibles" />
  </div>
</template>

<script setup lang="ts">
import type { Course, Paginated } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mis cursos', description: 'Tus cursos en DMA.', noindex: true })

const { data: courses } = await useApi<Paginated<Course>>('/learn/courses?per_page=100')
</script>
