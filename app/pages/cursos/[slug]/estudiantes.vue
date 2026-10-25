<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-8">
    <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
      <NuxtLink :to="`/cursos/${slug}`" class="hover:underline">{{ course?.name }}</NuxtLink>
      <span class="mx-2">/</span>
      <span>Estudiantes</span>
    </nav>

    <h1 class="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">Estudiantes</h1>
    <p class="mt-2 text-zinc-600 dark:text-zinc-400">Personas inscritas en el curso y su avance.</p>

    <div v-if="enrollments?.data.length" class="mt-6 grid gap-4 sm:grid-cols-3">
      <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p class="text-sm text-zinc-500">{{ stat.label }}</p>
        <p class="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{{ stat.value }}</p>
      </div>
    </div>

    <DuiAlert v-if="error" color="danger" variant="outline" class="mt-6">{{ apiError(error, 'No pudimos cargar los inscritos.') }}</DuiAlert>

    <ul v-if="enrollments?.data.length" class="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      <li v-for="item in enrollments.data" :key="item.id" class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <img v-if="item.user?.avatar" :src="item.user.avatar" alt="" class="size-10 rounded-full object-cover">
          <span v-else class="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">{{ initials(item.user?.fullName) }}</span>
          <div class="min-w-0">
            <p class="truncate font-medium text-zinc-900 dark:text-white">{{ userName(item.user) }}</p>
            <p class="truncate text-sm text-zinc-500">{{ item.user?.email }}</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <DuiBadge :label="roleLabels[item.role ?? ''] ?? item.role" variant="outline" color="neutral" size="sm" />
          <DuiBadge :label="statusLabels[item.status] ?? item.status" :color="item.status === 'active' ? 'success' : 'neutral'" variant="soft" size="sm" />
        </div>
        <div class="w-full sm:w-40">
          <div class="mb-1 flex justify-between text-xs text-zinc-500"><span>Avance</span><span>{{ toPercent(item.progress) }}%</span></div>
          <ProgressBar :value="toPercent(item.progress)" />
        </div>
      </li>
    </ul>
    <EmptyState v-else-if="!error" class="mt-8" icon="mdi mdi-account-group-outline" title="Aún no hay inscritos" text="Cuando los estudiantes se inscriban aparecerán aquí." />

    <DuiPagination
      v-if="(enrollments?.meta.lastPage ?? 1) > 1"
      v-model="page"
      :total="enrollments!.meta.total"
      :per-page="enrollments!.meta.perPage"
      class="mt-8 justify-center"
    />
  </div>
</template>

<script setup lang="ts">
import type { LearnEnrollment, Paginated } from '~/types/api'

definePageMeta({ layout: 'course' })

const route = useRoute()
const slug = String(route.params.slug)
const { course, canManage } = await useCourse(slug)
if (!course.value) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })
if (!canManage.value) throw createError({ statusCode: 403, statusMessage: 'Solo los docentes del curso pueden ver los inscritos', fatal: true })

useSeo({ title: `Estudiantes · ${course.value.name}`, description: 'Inscritos del curso.', noindex: true })

const page = ref(1)
const { data: enrollments, error } = await useApi<Paginated<LearnEnrollment>>(() => `/learn/courses/${slug}/enrollments?per_page=50&page=${page.value}`)

const stats = computed(() => {
  const list = enrollments.value?.data ?? []
  const students = list.filter(e => e.role === 'student')
  const average = students.length ? Math.round(students.reduce((sum, e) => sum + toPercent(e.progress), 0) / students.length) : 0
  return [
    { label: 'Inscritos', value: enrollments.value?.meta.total ?? 0 },
    { label: 'Avance promedio', value: `${average}%` },
    { label: 'Terminaron el curso', value: students.filter(e => toPercent(e.progress) === 100).length },
  ]
})
</script>
