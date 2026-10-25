<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Cursos</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Crea cursos, edítalos y asigna docentes y estudiantes.</p>
      </div>
      <DuiButton color="primary" @click="showForm = true">
        <i class="mdi mdi-plus mr-1" aria-hidden="true" /> Nuevo curso
      </DuiButton>
    </div>

    <form class="mt-6" role="search" @submit.prevent="applySearch">
      <DuiInput v-model="search" type="search" placeholder="Buscar cursos…" aria-label="Buscar cursos" block />
    </form>

    <ul v-if="courses?.data.length" class="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      <li v-for="course in courses.data" :key="course.id">
        <NuxtLink :to="`/panel/admin/cursos/${course.id}`" class="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
          <CourseCover :group="course.group" :picture="course.picture" class="size-12 shrink-0 [&_i]:text-2xl" />
          <div class="min-w-0 flex-1">
            <p class="truncate font-medium text-zinc-900 dark:text-white">{{ course.name }}</p>
            <p class="truncate text-sm text-zinc-500">{{ course.group || 'Sin grupo' }} · /cursos/{{ course.slug }}</p>
          </div>
          <div class="hidden flex-wrap gap-2 sm:flex">
            <DuiBadge :label="isTrue(course.active) ? 'Publicado' : 'Oculto'" :color="isTrue(course.active) ? 'success' : 'warning'" variant="soft" size="sm" />
            <DuiBadge v-if="isTrue(course.autoEnroll)" label="Inscripción abierta" variant="outline" color="neutral" size="sm" />
          </div>
          <i class="mdi mdi-chevron-right text-xl text-zinc-400" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
    <EmptyState v-else class="mt-6" icon="mdi mdi-school-outline" :title="q ? 'No hay cursos con esa búsqueda' : 'Aún no hay cursos'" />

    <DuiPagination v-if="(courses?.meta.lastPage ?? 1) > 1" v-model="page" :total="courses!.meta.total" :per-page="courses!.meta.perPage" class="mt-8 justify-center" />

    <ClientOnly>
      <DuiModal v-model="showForm" title="Nuevo curso" description="Luego podrás agregar imagen, video, docentes y lecciones.">
        <DuiForm :loading="saving" @submit="create">
          <DuiLabel title="Nombre" required>
            <DuiInput v-model="form.name" placeholder="Ej: Álgebra básica" required block />
          </DuiLabel>
          <DuiLabel title="Grupo" help-text="Materia y grado, por ejemplo «Matemáticas · 8»">
            <DuiInput v-model="form.group" placeholder="Matemáticas · 8" block />
          </DuiLabel>
          <DuiLabel title="Descripción">
            <DuiTextarea v-model="form.description" rows="3" block />
          </DuiLabel>
          <DuiSwitch v-model="form.auto_enroll" label="Inscripción abierta" description="Los estudiantes pueden inscribirse solos." />
          <DuiSwitch v-model="form.active" label="Publicado" description="Visible en el catálogo." />
          <template #footer>
            <DuiButton type="submit" color="primary" block :loading="saving">Crear curso</DuiButton>
          </template>
        </DuiForm>
      </DuiModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Course, Paginated } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'owner' })
useSeo({ title: 'Administrar cursos', description: 'Administración de cursos.', noindex: true })

const toast = useToast()
const page = ref(1)
const search = ref('')
const q = ref('')
const { data: courses } = await useApi<Paginated<Course>>(() => `/admin/learn/courses?per_page=20&page=${page.value}&q=${encodeURIComponent(q.value)}`)

function applySearch() {
  page.value = 1
  q.value = search.value.trim()
}

const showForm = ref(false)
const saving = ref(false)
const form = reactive({ name: '', group: '', description: '', auto_enroll: true, active: false })

async function create() {
  saving.value = true
  try {
    const course = await apiFetch<Course>('/admin/learn/courses', {
      method: 'POST',
      body: { ...form, group: form.group || null, description: form.description || null },
    })
    toast.success('El curso fue creado.')
    await navigateTo(`/panel/admin/cursos/${course.id}`)
  } catch (e) {
    toast.error(apiError(e, 'No pudimos crear el curso.'))
  } finally {
    saving.value = false
  }
}
</script>
