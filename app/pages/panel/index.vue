<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Hola, {{ firstName }} 👋</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">¿Qué quieres aprender hoy?</p>

    <section class="mt-8 flex flex-col gap-4 rounded-2xl bg-slate-900 p-6 text-white sm:flex-row sm:items-center">
      <i class="mdi mdi-compass-outline text-4xl text-slate-300" aria-hidden="true" />
      <div class="flex-1">
        <h2 class="text-xl font-semibold">Explora el catálogo</h2>
        <p class="text-sm text-slate-300">Inscríbete gratis en cualquier curso y avanza a tu ritmo.</p>
      </div>
      <DuiAction to="/cursos" color="neutral">Ver cursos</DuiAction>
    </section>

    <section class="mt-10">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Cursos disponibles</h2>
        <NuxtLink to="/panel/cursos" class="text-sm text-zinc-500 hover:underline">Ver todos</NuxtLink>
      </div>
      <div v-if="courses?.data.length" class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard v-for="course in courses.data" :key="course.id" :course="course" />
      </div>
      <EmptyState v-else class="mt-4" icon="mdi mdi-book-clock-outline" title="Muy pronto tendremos cursos aquí" />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Course, Paginated } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mi panel', description: 'Tu panel de estudiante en DMA.', noindex: true })

const { user } = useAuth()
const firstName = computed(() => user.value?.fullName?.split(' ')[0] ?? '')
const { data: courses } = await useApi<Paginated<Course>>('/learn/courses?per_page=6')
</script>
