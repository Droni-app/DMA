<template>
  <div>
    <DuiAlert v-if="quiz" color="success" variant="outline" class="mb-8">
      <strong>Ya enviaste este quiz.</strong>
      <span v-if="quiz.results"> Resultado: {{ quiz.results }}</span>
    </DuiAlert>

    <div v-else class="space-y-8">
      <fieldset v-for="(q, i) in questions" :key="q.id" class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <legend class="px-2 text-sm text-zinc-500">Pregunta {{ i + 1 }} de {{ questions.length }}</legend>
        <p class="text-lg font-medium text-zinc-900 dark:text-white">{{ q.name }}</p>
        <p v-if="q.description" class="mt-1 text-zinc-600 dark:text-zinc-400">{{ q.description }}</p>
        <DuiRadio v-model="answers[q.id]" :name="q.id" :options="options(q)" class="mt-4" />
      </fieldset>

      <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>
      <DuiButton v-if="!readonly" color="primary" :loading="sending" :disabled="Object.keys(answers).length < questions.length" @click="send">
        Enviar respuestas
      </DuiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LessonQuiz, Question } from '~/types/api'

const props = defineProps<{ path: string; questions: Question[]; quiz: LessonQuiz | null; readonly?: boolean }>()
const emit = defineEmits<{ sent: [] }>()

const answers = ref<Record<string, string>>({})
const sending = ref(false)
const error = ref('')

// Las opciones van numeradas desde 1, igual que responseCorrect en la API
function options(q: Question) {
  return [q.response1, q.response2, q.response3, q.response4, q.response5]
    .map((label, i) => ({ label: label ?? '', value: String(i + 1) }))
    .filter(option => option.label)
}

async function send() {
  sending.value = true
  error.value = ''
  try {
    await apiFetch(`${props.path}/quizzes`, {
      method: 'POST',
      body: { answers: Object.entries(answers.value).map(([question_id, selected]) => ({ question_id, selected: Number(selected) })) },
    })
    emit('sent')
  } catch (e) {
    error.value = apiError(e, 'No pudimos enviar tus respuestas.')
  } finally {
    sending.value = false
  }
}
</script>
