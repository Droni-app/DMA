<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-8">
    <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
      <NuxtLink :to="`/cursos/${slug}`" class="hover:underline">{{ course?.name }}</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink :to="`/cursos/${slug}/preguntas`" class="hover:underline">Banco de preguntas</NuxtLink>
      <span class="mx-2">/</span>
      <span>{{ questionId ? 'Editar pregunta' : 'Nueva pregunta' }}</span>
    </nav>

    <h1 class="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
      {{ questionId ? 'Editar pregunta' : 'Nueva pregunta' }}
    </h1>
    <p class="mt-2 text-zinc-600 dark:text-zinc-400">
      {{ questionId ? 'Actualiza el enunciado y las opciones de respuesta.' : 'Crea una pregunta reutilizable en los cuestionarios del curso.' }}
    </p>

    <DuiForm class="mt-8 space-y-6" :loading="saving" @submit="saveQuestion">
      <DuiLabel title="Enunciado" required>
        <DuiInput v-model="form.name" placeholder="Escribe el enunciado de la pregunta" required block />
      </DuiLabel>

      <RichContentEditor
        v-model="form.description"
        format="html"
        label="Contexto adicional"
        placeholder="Agrega contexto, datos o instrucciones para responder"
        :rows="4"
      />

      <div class="space-y-4">
        <DuiLabel
          v-for="(_, index) in form.responses"
          :key="index"
          :title="`Opción ${index + 1}`"
          :required="index < 2"
        >
          <DuiInput v-model="form.responses[index]" :required="index < 2" block />
        </DuiLabel>
      </div>

      <DuiLabel title="Respuesta correcta" required>
        <DuiSelect v-model="form.responseCorrect" :options="correctOptions" block />
      </DuiLabel>

      <DuiLabel title="URL de imagen">
        <DuiInput v-model="form.picture" type="url" placeholder="https://…" block />
      </DuiLabel>

      <DuiLabel title="URL de archivo de apoyo">
        <DuiInput v-model="form.attachment" type="url" placeholder="https://…" block />
      </DuiLabel>

      <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>

      <div class="flex flex-wrap gap-3">
        <DuiButton type="submit" color="primary" :loading="saving">
          {{ questionId ? 'Guardar cambios' : 'Crear pregunta' }}
        </DuiButton>
        <DuiAction :to="`/cursos/${slug}/preguntas`" variant="outline" color="neutral">Cancelar</DuiAction>
      </div>
    </DuiForm>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Question } from '~/types/api'

const props = defineProps<{ questionId?: string }>()
const route = useRoute()
const slug = String(route.params.slug)
const { course, enrollment } = await useCourse(slug)

if (!course.value) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })
if (!['teacher', 'admin'].includes(enrollment.value?.role ?? '')) {
  throw createError({ statusCode: 403, statusMessage: 'No tienes permiso para gestionar preguntas en este curso', fatal: true })
}

const question = ref<Question | null>(null)
if (props.questionId) {
  const { data } = await useApi<Question>(`/learn/courses/${slug}/questions/${props.questionId}`)
  if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Pregunta no encontrada', fatal: true })
  question.value = data.value
}

useSeo({
  title: `${props.questionId ? 'Editar pregunta' : 'Nueva pregunta'} · ${course.value.name}`,
  description: 'Gestiona una pregunta del curso.',
  noindex: true,
})

const toast = useToast()
const saving = ref(false)
const error = ref('')
const form = reactive({
  name: question.value?.name ?? '',
  description: question.value?.description ?? '',
  responses: [
    question.value?.response1 ?? question.value?.response_1 ?? '',
    question.value?.response2 ?? question.value?.response_2 ?? '',
    question.value?.response3 ?? question.value?.response_3 ?? '',
    question.value?.response4 ?? question.value?.response_4 ?? '',
    question.value?.response5 ?? question.value?.response_5 ?? '',
  ],
  responseCorrect: Number(question.value?.responseCorrect ?? question.value?.response_correct) || 1,
  picture: question.value?.picture ?? '',
  attachment: question.value?.attachment ?? '',
})
const correctOptions = computed(() => form.responses
  .map((response, index) => ({ label: `Opción ${index + 1}`, value: index + 1, disabled: !response.trim() })))

async function saveQuestion() {
  if (!form.name.trim()) {
    error.value = 'Escribe el enunciado de la pregunta.'
    return
  }
  if (form.responses.slice(0, 2).some(response => !response.trim())) {
    error.value = 'Debes completar al menos las dos primeras opciones.'
    return
  }
  if (!form.responses[form.responseCorrect - 1]?.trim()) {
    error.value = 'La opción marcada como correcta debe tener un texto.'
    return
  }

  saving.value = true
  error.value = ''
  const body = {
    name: form.name,
    description: form.description || null,
    response_1: form.responses[0]!.trim(),
    response_2: form.responses[1]!.trim(),
    response_3: form.responses[2]!.trim() || null,
    response_4: form.responses[3]!.trim() || null,
    response_5: form.responses[4]!.trim() || null,
    response_correct: form.responseCorrect,
    picture: form.picture || null,
    attachment: form.attachment || null,
  }

  try {
    await apiFetch(
      props.questionId
        ? `/learn/courses/${slug}/questions/${props.questionId}`
        : `/learn/courses/${slug}/questions`,
      { method: props.questionId ? 'PUT' : 'POST', body },
    )
    toast.success(props.questionId ? 'La pregunta fue actualizada.' : 'La pregunta fue creada.')
    await navigateTo(`/cursos/${slug}/preguntas`)
  } catch (e) {
    error.value = apiError(e, 'No pudimos guardar la pregunta.')
  } finally {
    saving.value = false
  }
}
</script>
