<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-8">
    <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
      <NuxtLink :to="`/cursos/${slug}`" class="hover:underline">{{ course?.name }}</NuxtLink>
      <span class="mx-2">/</span>
      <span>Banco de preguntas</span>
    </nav>

    <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white">Banco de preguntas</h1>
        <p class="mt-2 text-zinc-600 dark:text-zinc-400">Administra las preguntas reutilizables de este curso.</p>
      </div>
      <DuiAction :to="`/cursos/${slug}/preguntas/nueva`" color="primary">
        <i class="mdi mdi-plus mr-1" aria-hidden="true" /> Nueva pregunta
      </DuiAction>
    </div>

    <DuiAlert v-if="loadError" color="danger" variant="outline" class="mt-6">{{ loadError }}</DuiAlert>

    <div v-if="questions?.data.length" class="mt-8 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table class="w-full min-w-[720px] divide-y divide-zinc-200 text-left dark:divide-zinc-800">
        <thead class="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th scope="col" class="px-4 py-3 font-semibold">Pregunta</th>
            <th scope="col" class="px-4 py-3 text-right font-semibold">Wons</th>
            <th scope="col" class="px-4 py-3 text-right font-semibold">Losses</th>
            <th scope="col" class="px-4 py-3 text-right font-semibold">Dificultad</th>
            <th scope="col" class="px-4 py-3 text-right font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
          <tr v-for="question in questions.data" :key="question.id" class="align-top">
            <td class="px-4 py-4">
              <div class="reading text-base" v-html="renderContent(question.name, 'html')" />
            </td>
            <td class="px-4 py-4 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{{ metric(question.wons) }}</td>
            <td class="px-4 py-4 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{{ metric(question.losses) }}</td>
            <td class="px-4 py-4 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{{ difficulty(question) }}</td>
            <td class="px-4 py-4">
              <div class="flex justify-end gap-2">
                <DuiAction :to="`/cursos/${slug}/preguntas/${question.id}/editar`" variant="outline" color="neutral" size="sm">
                  <i class="mdi mdi-pencil-outline mr-1" aria-hidden="true" /> Editar
                </DuiAction>
                <DuiButton v-if="isAdmin" variant="outline" color="danger" size="sm" :loading="deletingId === question.id" @click="deleteQuestion(question)">
                  <i class="mdi mdi-delete-outline mr-1" aria-hidden="true" /> Eliminar
                </DuiButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState
      v-else-if="!loadError"
      class="mt-8"
      icon="mdi mdi-help-circle-outline"
      title="Aún no hay preguntas en este curso"
      text="Crea preguntas para reutilizarlas en los cuestionarios del curso."
    />

  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Paginated, Question } from '~/types/api'

definePageMeta({ layout: 'course' })

const route = useRoute()
const slug = String(route.params.slug)
const { course, enrollment } = await useCourse(slug)

if (!course.value) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })
const role = enrollment.value?.role
if (role !== 'teacher' && role !== 'admin') {
  throw createError({ statusCode: 403, statusMessage: 'No tienes permiso para gestionar preguntas en este curso', fatal: true })
}

useSeo({ title: `Banco de preguntas · ${course.value.name}`, description: 'Gestiona las preguntas del curso.', noindex: true })

const isAdmin = role === 'admin'
const toast = useToast()
const { data: questions, refresh, error: requestError } = await useApi<Paginated<Question>>(`/learn/courses/${slug}/questions?per_page=100`)
const loadError = computed(() => requestError.value ? apiError(requestError.value, 'No pudimos cargar las preguntas.') : '')
const deletingId = ref('')

function metric(value: number | string | undefined) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function difficulty(question: Question) {
  if (question.difficulty != null && Number.isFinite(Number(question.difficulty))) {
    return `${Number(question.difficulty).toFixed(1)}%`
  }

  const wons = metric(question.wons)
  const losses = metric(question.losses)
  const attempts = wons + losses
  return attempts ? `${((losses / attempts) * 100).toFixed(1)}%` : '—'
}

async function deleteQuestion(question: Question) {
  if (!window.confirm(`¿Eliminar la pregunta «${question.name}»? Esta acción no se puede deshacer.`)) return

  deletingId.value = question.id
  try {
    await apiFetch(`/learn/courses/${slug}/questions/${question.id}`, { method: 'DELETE' })
    await refresh()
    toast.success('La pregunta fue eliminada.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos eliminar la pregunta.'))
  } finally {
    deletingId.value = ''
  }
}
</script>
