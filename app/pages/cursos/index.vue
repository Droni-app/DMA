<template>
  <div>
    <PageHeader
      eyebrow="Catálogo"
      title="Cursos de refuerzo para bachillerato"
      description="Encuentra el curso que necesitas por materia o grado. Todos incluyen lecciones cortas y ejercicios con retroalimentación."
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
      <DuiAlert v-else color="neutral" variant="outline" class="mt-4">
        No encontramos cursos con esos filtros. Prueba con otra materia o grado.
      </DuiAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { courses, grades, subjects } from '~/data/courses'

useSeo({
  title: 'Cursos de matemáticas, lenguaje, ciencias e inglés',
  description: 'Catálogo de cursos virtuales para estudiantes de 6° a 11°: matemáticas, lenguaje, ciencias naturales, sociales, inglés, física, química y Saber 11.',
})

const route = useRoute()
const search = ref('')
const subject = ref(String(route.query.materia ?? ''))
const grade = ref(String(route.query.grado ?? ''))

const subjectOptions = [{ label: 'Todas las materias', value: '' }, ...subjects.map(s => ({ label: s.name, value: s.slug }))]
const gradeOptions = [{ label: 'Todos los grados', value: '' }, ...grades.map(g => ({ label: `Grado ${g}`, value: g }))]

const filtered = computed(() =>
  courses.filter(c =>
    (!subject.value || c.subject === subject.value)
    && (!grade.value || c.grade === grade.value)
    && c.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

// Mantiene el filtro sincronizado con la URL (?materia=…)
watch(() => route.query.materia, value => (subject.value = String(value ?? '')))
</script>
