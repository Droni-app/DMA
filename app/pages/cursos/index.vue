<template>
  <div>
    <PageHeader
      eyebrow="Catálogo"
      title="Cursos de refuerzo para bachillerato"
      description="Encuentra el curso que necesitas por materia o grado. Todos incluyen lecciones cortas y actividades."
    />

    <div class="mx-auto max-w-6xl px-4 py-10">
      <form class="grid gap-3 sm:grid-cols-[1fr_auto_auto]" role="search" @submit.prevent>
        <DuiInput v-model="search" type="search" placeholder="Buscar un curso…" aria-label="Buscar un curso" block />
        <DuiSelect v-model="subject" :options="subjectOptions" aria-label="Materia" />
        <DuiSelect v-model="grade" :options="gradeOptions" aria-label="Grado" />
      </form>

      <p class="mt-6 text-sm text-zinc-500 dark:text-zinc-400">{{ filtered.length }} cursos encontrados</p>

      <div v-if="filtered.length" class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard v-for="course in filtered" :key="course.id" :course="course" />
      </div>
      <EmptyState v-else class="mt-4" icon="mdi mdi-magnify-close" title="No encontramos cursos" text="Prueba con otra materia, otro grado u otra búsqueda." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseGroup } from '~/data/subjects'
import type { Course, Paginated } from '~/types/api'

useSeo({
  title: 'Cursos de matemáticas, lenguaje, ciencias e inglés',
  description: 'Catálogo de cursos virtuales para estudiantes de 6° a 11°: matemáticas, lenguaje, ciencias naturales, sociales, inglés, física, química y Saber 11.',
})

const route = useRoute()
const { data } = await useApi<Paginated<Course>>('/learn/courses?per_page=100')

const courses = computed(() => (data.value?.data ?? []).map(course => ({ ...course, ...parseGroup(course.group) })))

const search = ref('')
const subject = ref(String(route.query.materia ?? ''))
const grade = ref(String(route.query.grado ?? ''))

// Las opciones salen de los cursos que existen
const unique = (values: (string | null)[]) => [...new Set(values.filter(Boolean))].sort() as string[]
const subjectOptions = computed(() => [{ label: 'Todas las materias', value: '' }, ...unique(courses.value.map(c => c.subject)).map(s => ({ label: s, value: s }))])
const gradeOptions = computed(() => [{ label: 'Todos los grados', value: '' }, ...unique(courses.value.map(c => c.grade)).map(g => ({ label: `Grado ${g}`, value: g }))])

const filtered = computed(() =>
  courses.value.filter(c =>
    (!subject.value || c.subject === subject.value)
    && (!grade.value || c.grade === grade.value)
    && c.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

// Mantiene el filtro sincronizado con la URL (?materia=…)
watch(() => route.query.materia, value => (subject.value = String(value ?? '')))
</script>
