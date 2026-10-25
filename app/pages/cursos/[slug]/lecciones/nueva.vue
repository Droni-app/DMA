<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:px-8">
    <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
      <NuxtLink :to="`/cursos/${slug}`" class="hover:underline">{{ course?.name }}</NuxtLink>
      <span class="mx-2">/</span>
      <span>Nueva lección</span>
    </nav>

    <h1 class="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">Crear nueva lección</h1>
    <p class="mt-2 text-zinc-600 dark:text-zinc-400">Completa la información de la lección para agregarla al curso.</p>

    <DuiForm class="mt-8 space-y-5" :loading="sending" @submit="createLesson">
      <DuiLabel title="Título" required>
        <DuiInput v-model="form.name" placeholder="Título de la lección" required block />
      </DuiLabel>

      <DuiLabel title="Orden en el listado" required>
        <DuiInput v-model.number="form.order" type="number" min="1" step="1" required block />
      </DuiLabel>

      <DuiLabel title="Resumen">
        <DuiTextarea v-model="form.description" rows="2" placeholder="Descripción breve de la lección" block />
      </DuiLabel>

      <DuiLabel title="Formato del contenido">
        <DuiSelect v-model="form.format" :options="formatOptions" block />
      </DuiLabel>

      <RichContentEditor v-model="form.content" :format="form.format" label="Contenido" placeholder="Escribe el contenido de la lección" />

      <RichContentEditor v-model="form.activity" :format="form.format" label="Actividad" placeholder="Instrucciones para la actividad (opcional)" :rows="5" />

      <DuiLabel title="URL del video">
        <DuiInput v-model="form.video" type="url" placeholder="https://…" block />
      </DuiLabel>

      <DuiLabel title="Fecha límite de actividad (opcional)">
        <DuiInput v-model="form.limitDate" type="datetime-local" block />
      </DuiLabel>

      <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>

      <div class="flex flex-wrap gap-3">
        <DuiButton type="submit" color="primary" :loading="sending">Crear lección</DuiButton>
        <DuiAction :to="`/cursos/${slug}`" variant="outline" color="neutral">Cancelar</DuiAction>
      </div>
    </DuiForm>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'

definePageMeta({ layout: 'course' })

const route = useRoute()
const slug = String(route.params.slug)
const { course, lessons, enrollment, refreshLessons } = await useCourse(slug)

if (!course.value) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })
if (!['teacher', 'admin'].includes(enrollment.value?.role ?? '')) {
  throw createError({ statusCode: 403, statusMessage: 'No tienes permiso para crear lecciones en este curso', fatal: true })
}

useSeo({ title: `Nueva lección · ${course.value.name}`, description: 'Crear una lección para el curso.', noindex: true })

const toast = useToast()
const sending = ref(false)
const error = ref('')
const formatOptions = [
  { label: 'Texto', value: 'text' },
  { label: 'HTML', value: 'html' },
  { label: 'Markdown', value: 'markdown' },
]
const form = reactive({
  name: '',
  order: lessons.value.length + 1,
  description: '',
  format: 'markdown',
  content: '',
  activity: '',
  video: '',
  limitDate: '',
})

async function createLesson() {
  sending.value = true
  error.value = ''

  try {
    await apiFetch(`/learn/courses/${slug}/lessons`, {
      method: 'POST',
      body: {
        name: form.name,
        description: form.description || null,
        format: form.format,
        content: form.content || null,
        activity: form.activity || null,
        video: form.video || null,
        order: form.order,
        active: true,
        limit_date: form.limitDate ? new Date(form.limitDate).toISOString() : null,
      },
    })
    await refreshLessons()
    toast.success('La lección fue creada.')
    await navigateTo(`/cursos/${slug}`)
  } catch (e) {
    error.value = apiError(e, 'No pudimos crear la lección. Intenta de nuevo.')
  } finally {
    sending.value = false
  }
}
</script>
