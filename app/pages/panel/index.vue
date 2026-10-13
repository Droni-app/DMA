<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Hola, {{ firstName }} 👋</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">Sigue donde lo dejaste. ¡Vas muy bien!</p>

    <dl class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <dt class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <i :class="stat.icon" class="text-lg" aria-hidden="true" /> {{ stat.label }}
        </dt>
        <dd class="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{{ stat.value }}</dd>
      </div>
    </dl>

    <!-- Continuar -->
    <section v-if="current" class="mt-8 flex flex-col gap-6 rounded-2xl bg-slate-900 p-6 text-white sm:flex-row sm:items-center">
      <CourseCover :subject-slug="current.course.subject" class="h-24 sm:w-40" />
      <div class="flex-1">
        <p class="text-sm text-slate-300">Continúa con</p>
        <h2 class="mt-1 text-xl font-semibold">{{ current.next.name }}</h2>
        <p class="text-sm text-slate-300">{{ current.course.name }}</p>
        <div class="mt-4 max-w-sm"><ProgressBar :value="current.progress" /></div>
      </div>
      <DuiAction :to="`/panel/cursos/${current.course.slug}/${current.next.slug}`" color="neutral">Continuar</DuiAction>
    </section>

    <div class="mt-10 grid gap-8 lg:grid-cols-3">
      <section class="lg:col-span-2">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Mis cursos</h2>
          <NuxtLink to="/panel/cursos" class="text-sm text-zinc-500 hover:underline">Ver todos</NuxtLink>
        </div>
        <ul class="mt-4 space-y-3">
          <li v-for="item in myCourses.slice(0, 3)" :key="item.course.id">
            <NuxtLink :to="`/panel/cursos/${item.course.slug}/${item.next.slug}`" class="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CourseCover :subject-slug="item.course.subject" class="size-12 shrink-0 [&_i]:text-2xl" />
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium text-zinc-900 dark:text-white">{{ item.course.name }}</p>
                <div class="mt-2 flex items-center gap-3">
                  <ProgressBar :value="item.progress" class="flex-1" />
                  <span class="text-sm text-zinc-500">{{ item.progress }}%</span>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Próximas actividades</h2>
        <ul class="mt-4 space-y-3">
          <li v-for="task in tasks" :key="task.title" class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p class="font-medium text-zinc-900 dark:text-white">{{ task.title }}</p>
            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{{ task.course }}</p>
            <DuiBadge :label="task.when" :color="task.urgent ? 'warning' : 'neutral'" variant="soft" size="sm" class="mt-3" />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { myCourses } from '~/data/progress'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mi panel', description: 'Tu panel de estudiante en DMA.', noindex: true })

const { user } = useAuth()
const firstName = computed(() => user.value?.fullName.split(' ')[0])
const current = myCourses[0]

const stats = [
  { label: 'Cursos activos', value: myCourses.length, icon: 'mdi mdi-book-open-variant' },
  { label: 'Lecciones vistas', value: myCourses.reduce((n, c) => n + c.completed, 0), icon: 'mdi mdi-check-circle-outline' },
  { label: 'Racha', value: '5 días', icon: 'mdi mdi-fire' },
  { label: 'Promedio quizzes', value: '86%', icon: 'mdi mdi-chart-line' },
]

const tasks = [
  { title: 'Quiz: Ecuaciones de primer grado', course: 'Álgebra desde cero', when: 'Hoy', urgent: true },
  { title: 'Lectura: Inferencias', course: 'Comprensión lectora crítica', when: 'Mañana', urgent: false },
  { title: 'Simulacro de lectura crítica', course: 'Simulacro Saber 11', when: 'Viernes', urgent: false },
]
</script>
