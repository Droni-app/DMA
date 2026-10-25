<template>
  <div v-if="course" class="flex h-full flex-col">
    <!-- Curso y avance -->
    <div class="border-b border-zinc-200 p-5 dark:border-zinc-800">
      <NuxtLink :to="user ? '/panel' : '/cursos'" class="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white" @click="emit('navigate')">
        <i class="mdi mdi-arrow-left" aria-hidden="true" /> {{ user ? 'Mis cursos' : 'Todos los cursos' }}
      </NuxtLink>
      <div class="mt-4 flex items-center gap-3">
        <CourseCover :group="course.group" :picture="course.picture" class="size-12 shrink-0 [&_i]:text-2xl" />
        <div class="min-w-0">
          <p class="text-xs font-medium uppercase tracking-wide text-zinc-500">{{ course.group }}</p>
          <h2 class="font-semibold leading-snug text-zinc-900 dark:text-white">{{ course.name }}</h2>
        </div>
      </div>
      <div v-if="enrollment && !canManage" class="mt-5">
        <div class="mb-2 flex justify-between text-sm">
          <span class="text-zinc-600 dark:text-zinc-400">Tu avance</span>
          <span class="font-semibold text-zinc-900 dark:text-white">{{ percent }}%</span>
        </div>
        <ProgressBar :value="percent" />
        <p class="mt-2 text-xs text-zinc-500">{{ doneCount }} de {{ lessons.length }} lecciones completadas</p>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-3">
      <NuxtLink
        :to="base"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
        :class="linkClass(route.path === base)"
        @click="emit('navigate')"
      >
        <i class="mdi mdi-information-outline text-lg" aria-hidden="true" /> Presentación del curso
      </NuxtLink>

      <h3 class="mt-5 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Lecciones</h3>
      <label class="relative mt-2 block px-1">
        <span class="sr-only">Buscar lecciones</span>
        <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-lg text-zinc-400" aria-hidden="true" />
        <input
          v-model="lessonSearch"
          type="search"
          placeholder="Buscar lecciones..."
          class="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-zinc-700"
        >
      </label>
      <ol class="mt-2 space-y-0.5">
        <li v-for="{ lesson, index } in filteredLessons" :key="lesson.id">
          <NuxtLink
            :to="`${base}/${lesson.slug}`"
            class="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm"
            :class="linkClass(route.params.lesson === lesson.slug)"
            @click="emit('navigate')"
          >
            <i
              class="mt-0.5 text-lg leading-none"
              :class="isDone(lesson) ? 'mdi mdi-check-circle text-emerald-500' : 'mdi mdi-circle-outline text-zinc-400'"
              :aria-label="isDone(lesson) ? 'Completada' : 'Pendiente'"
            />
            <span class="flex-1">
              <span class="block">{{ index + 1 }}. {{ lesson.name }}</span>
              <span class="mt-0.5 flex flex-wrap gap-2 text-xs text-zinc-500">
                <span v-if="!isTrue(lesson.active)" class="font-medium text-amber-600 dark:text-amber-400"><i class="mdi mdi-eye-off-outline" aria-hidden="true" /> Oculta</span>
                <span v-if="lesson.video"><i class="mdi mdi-play-circle-outline" aria-hidden="true" /> Video</span>
                <span v-if="lesson.activity"><i class="mdi mdi-pencil-outline" aria-hidden="true" /> Actividad</span>
                <span v-if="lesson.limitDate"><i class="mdi mdi-calendar-clock" aria-hidden="true" /> {{ formatDate(lesson.limitDate) }}</span>
              </span>
            </span>
          </NuxtLink>
        </li>
      </ol>
      <p v-if="lessonSearch.trim() && !filteredLessons.length" class="px-3 py-3 text-sm text-zinc-500">
        No se encontraron lecciones.
      </p>
      <!-- Herramientas del docente -->
      <template v-if="canManage">
        <h3 class="mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Gestión del curso</h3>
        <ul class="mt-2 space-y-0.5">
          <li v-for="tool in tools" :key="tool.to">
            <NuxtLink
              :to="tool.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
              :class="linkClass(route.path === tool.to)"
              @click="emit('navigate')"
            >
              <i :class="tool.icon" class="text-lg" aria-hidden="true" /> {{ tool.label }}
            </NuxtLink>
          </li>
        </ul>
      </template>

      <!-- Recursos del curso -->
      <template v-if="course.video">
        <h3 class="mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Recursos</h3>
        <a :href="course.video" target="_blank" rel="noopener" class="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          <i class="mdi mdi-youtube text-lg" aria-hidden="true" /> Video de presentación
        </a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ slug: string }>()
const emit = defineEmits<{ navigate: [] }>()

const route = useRoute()
const { course, lessons, enrollment, canManage, isDone, doneCount, percent } = await useCourse(props.slug)
const base = `/cursos/${props.slug}`
const { user } = useAuth()
const tools = [
  { label: 'Crear nueva lección', to: `${base}/lecciones/nueva`, icon: 'mdi mdi-plus-circle-outline' },
  { label: 'Banco de preguntas', to: `${base}/preguntas`, icon: 'mdi mdi-help-circle-outline' },
  { label: 'Estudiantes', to: `${base}/estudiantes`, icon: 'mdi mdi-account-group-outline' },
]
const lessonSearch = ref('')
const filteredLessons = computed(() => {
  const search = lessonSearch.value.trim().toLocaleLowerCase()
  return lessons.value
    .map((lesson, index) => ({ lesson, index }))
    .filter(({ lesson }) => lesson.name.toLocaleLowerCase().includes(search))
})

function linkClass(active: boolean) {
  return active
    ? 'bg-slate-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white'
    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
}
</script>
