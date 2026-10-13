<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Mis cursos</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">Los cursos en los que estás inscrito.</p>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CourseCard
        v-for="item in myCourses"
        :key="item.course.id"
        :course="item.course"
        :to="`/panel/cursos/${item.course.slug}/${item.next.slug}`"
      >
        <div>
          <div class="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
            <span>{{ item.completed }} de {{ item.course.lessons.length }} lecciones</span>
            <span>{{ item.progress }}%</span>
          </div>
          <ProgressBar :value="item.progress" class="mt-2" />
        </div>
      </CourseCard>
    </div>

    <div class="mt-12 rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
      <p class="text-zinc-600 dark:text-zinc-400">¿Quieres aprender algo nuevo?</p>
      <DuiAction to="/cursos" variant="outline" color="neutral" class="mt-4">Explorar cursos</DuiAction>
    </div>
  </div>
</template>

<script setup lang="ts">
import { myCourses } from '~/data/progress'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mis cursos', description: 'Tus cursos en DMA.', noindex: true })
</script>
