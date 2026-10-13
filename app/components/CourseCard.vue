<template>
  <DuiCard class="block h-full">
    <div class="space-y-3">
      <NuxtLink :to="to ?? `/cursos/${course.slug}`" aria-label="Ver curso">
        <CourseCover :group="course.group" :picture="course.picture" class="h-36 w-full mb-2" />
      </NuxtLink>
      <div class="flex flex-wrap gap-2">
        <DuiBadge :label="info.subject" variant="soft" size="sm" />
        <DuiBadge v-if="info.grade" :label="`Grado ${info.grade}`" variant="outline" color="neutral" size="sm" />
      </div>

      <NuxtLink :to="to ?? `/cursos/${course.slug}`" aria-label="Ver curso">
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">{{ course.name }}</h3>
      </NuxtLink>
      <p class="line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{{ course.description }}</p>
      <slot />
    </div>
  </DuiCard>
</template>

<script setup lang="ts">
import { parseGroup } from '~/data/subjects'
import type { Course } from '~/types/api'

const props = defineProps<{ course: Course; to?: string }>()
const info = computed(() => parseGroup(props.course.group))
</script>
