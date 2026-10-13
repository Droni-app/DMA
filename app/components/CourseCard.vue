<template>
  <DuiCard :to="to ?? `/cursos/${course.slug}`" class="block h-full">
    <div class="space-y-3">
      <CourseCover :subject-slug="course.subject" class="h-32" />
      <div class="flex flex-wrap gap-2">
        <DuiBadge :label="getSubject(course.subject).name" variant="soft" size="sm" />
        <DuiBadge :label="`Grado ${course.grade}`" variant="outline" color="neutral" size="sm" />
      </div>
      <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">{{ course.name }}</h3>
      <p class="line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{{ course.description }}</p>
      <slot>
        <div class="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span><i class="mdi mdi-book-outline" aria-hidden="true" /> {{ course.lessons.length }} lecciones</span>
          <span><i class="mdi mdi-star text-amber-500" aria-hidden="true" /> {{ course.rating }}</span>
        </div>
      </slot>
    </div>
  </DuiCard>
</template>

<script setup lang="ts">
import { getSubject, type Course } from '~/data/courses'

defineProps<{ course: Course; to?: string }>()
</script>
