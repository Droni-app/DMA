<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Hola, {{ firstName }} 👋</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">Continúa donde lo dejaste o explora un curso nuevo.</p>

    <!-- Resumen -->
    <div class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <i :class="stat.icon" class="text-2xl text-slate-500" aria-hidden="true" />
        <p class="mt-3 text-2xl font-bold text-zinc-900 dark:text-white">{{ stat.value }}</p>
        <p class="text-sm text-zinc-500">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Continuar -->
    <NuxtLink
      v-if="continueCourse"
      :to="`/cursos/${continueCourse.slug}`"
      class="mt-6 flex items-center gap-4 rounded-2xl bg-slate-900 p-5 text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      <CourseCover :group="continueCourse.group" :picture="continueCourse.picture" class="size-14 shrink-0 [&_i]:text-2xl" />
      <div class="min-w-0 flex-1">
        <p class="text-sm text-slate-300">Continúa aprendiendo</p>
        <p class="truncate text-lg font-semibold">{{ continueCourse.name }}</p>
        <ProgressBar :value="progress(continueCourse)" class="mt-2 max-w-xs bg-slate-700 [&>div]:bg-white" />
      </div>
      <span class="hidden text-sm font-semibold sm:block">{{ progress(continueCourse) }}%</span>
      <i class="mdi mdi-arrow-right text-2xl" aria-hidden="true" />
    </NuxtLink>

    <!-- Cursos como estudiante -->
    <h2 class="mt-10 text-xl font-bold text-zinc-900 dark:text-white">Mis cursos</h2>
    <div v-if="studying.length" class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CourseCard v-for="course in studying" :key="course.id" :course="course">
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>{{ progress(course) === 100 ? '¡Completado!' : 'Avance' }}</span>
            <span>{{ progress(course) }}%</span>
          </div>
          <ProgressBar :value="progress(course)" />
        </div>
      </CourseCard>
    </div>
    <EmptyState
      v-else
      class="mt-4"
      icon="mdi mdi-book-clock-outline"
      title="Aún no estás inscrito en ningún curso"
      text="Explora el catálogo e inscríbete para empezar a aprender."
    >
      <DuiAction to="/cursos" color="primary" class="mt-5">Explorar cursos</DuiAction>
    </EmptyState>

    <!-- Cursos que enseña -->
    <template v-if="teaching.length">
      <h2 class="mt-10 text-xl font-bold text-zinc-900 dark:text-white">Cursos que gestionas</h2>
      <ul class="mt-4 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        <li v-for="course in teaching" :key="course.id" class="flex flex-wrap items-center gap-3 p-4">
          <CourseCover :group="course.group" :picture="course.picture" class="size-10 shrink-0 [&_i]:text-xl" />
          <div class="min-w-0 flex-1">
            <NuxtLink :to="`/cursos/${course.slug}`" class="font-medium text-zinc-900 hover:underline dark:text-white">{{ course.name }}</NuxtLink>
            <p class="text-sm text-zinc-500">{{ roleLabels[course.enrollments[0]?.role ?? ''] }}</p>
          </div>
          <DuiAction :to="`/cursos/${course.slug}/estudiantes`" size="sm" variant="ghost" color="neutral">Estudiantes</DuiAction>
          <DuiAction :to="`/cursos/${course.slug}/preguntas`" size="sm" variant="ghost" color="neutral">Preguntas</DuiAction>
          <DuiAction :to="`/cursos/${course.slug}/lecciones/nueva`" size="sm" variant="outline" color="neutral">
            <i class="mdi mdi-plus mr-1" aria-hidden="true" /> Lección
          </DuiAction>
        </li>
      </ul>
    </template>

    <!-- Últimas lecciones vistas -->
    <template v-if="recent.length">
      <h2 class="mt-10 text-xl font-bold text-zinc-900 dark:text-white">Lecciones vistas recientemente</h2>
      <ul class="mt-4 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        <li v-for="lesson in recent" :key="lesson.id">
          <NuxtLink :to="`/cursos/${lesson.course.slug}/${lesson.slug}`" class="flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <i class="mdi mdi-check-circle text-xl text-emerald-500" aria-hidden="true" />
            <span class="min-w-0 flex-1">
              <span class="block truncate font-medium text-zinc-900 dark:text-white">{{ lesson.name }}</span>
              <span class="block truncate text-sm text-zinc-500">{{ lesson.course.name }}</span>
            </span>
            <i class="mdi mdi-chevron-right text-xl text-zinc-400" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CompletedLesson, MyLearningCourse, Paginated } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mis cursos', description: 'Tus cursos en DMA.', noindex: true })

const { user } = useAuth()
const [{ data: courses }, { data: lessons }] = await Promise.all([
  useApi<Paginated<MyLearningCourse>>('/learn/user/courses?per_page=100'),
  useApi<Paginated<CompletedLesson>>('/learn/user/lessons?per_page=5'),
])

const firstName = computed(() => user.value?.fullName?.split(' ')[0] ?? '')
const progress = (course: MyLearningCourse) => toPercent(course.enrollments[0]?.progress)
const isStudent = (course: MyLearningCourse) => (course.enrollments[0]?.role ?? 'student') === 'student'

const studying = computed(() => (courses.value?.data ?? []).filter(isStudent))
const teaching = computed(() => (courses.value?.data ?? []).filter(course => !isStudent(course)))
const recent = computed(() => lessons.value?.data ?? [])
// El curso más reciente que aún no termina
const continueCourse = computed(() => studying.value.find(course => progress(course) < 100))

const stats = computed(() => [
  { label: 'Cursos inscritos', value: studying.value.length, icon: 'mdi mdi-book-open-variant' },
  { label: 'Lecciones vistas', value: lessons.value?.meta.total ?? 0, icon: 'mdi mdi-check-circle-outline' },
  { label: 'Cursos completados', value: studying.value.filter(course => progress(course) === 100).length, icon: 'mdi mdi-trophy-outline' },
  {
    label: 'Avance promedio',
    value: `${studying.value.length ? Math.round(studying.value.reduce((sum, course) => sum + progress(course), 0) / studying.value.length) : 0}%`,
    icon: 'mdi mdi-chart-line',
  },
])
</script>
