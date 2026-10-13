<template>
  <div class="space-y-8">
    <fieldset v-for="(q, i) in questions" :key="q.id" class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <legend class="px-2 text-sm text-zinc-500">Pregunta {{ i + 1 }} de {{ questions.length }}</legend>
      <p class="mb-4 text-lg font-medium text-zinc-900 dark:text-white">{{ q.name }}</p>
      <DuiRadio v-model="answers[q.id]" :name="q.id" :options="options(q)" :disabled="checked" />
      <p v-if="checked" class="mt-4 text-sm font-medium" :class="isCorrect(q) ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
        <i :class="isCorrect(q) ? 'mdi mdi-check-circle' : 'mdi mdi-close-circle'" aria-hidden="true" />
        {{ isCorrect(q) ? '¡Correcto!' : `La respuesta correcta es: ${q[`response${q.responseCorrect}` as keyof typeof q]}` }}
      </p>
    </fieldset>

    <DuiAlert v-if="checked" :color="score === questions.length ? 'success' : 'warning'" variant="outline">
      Obtuviste {{ score }} de {{ questions.length }}. {{ score === questions.length ? '¡Excelente trabajo!' : 'Repasa la lección y vuelve a intentarlo.' }}
    </DuiAlert>

    <div class="flex gap-3">
      <DuiButton v-if="!checked" color="primary" :disabled="Object.keys(answers).length < questions.length" @click="checked = true">
        Revisar respuestas
      </DuiButton>
      <DuiButton v-else variant="outline" color="neutral" @click="reset">Intentar de nuevo</DuiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questions } from '~/data/courses'

type Question = (typeof questions)[number]

const answers = ref<Record<string, string>>({})
const checked = ref(false)

// La API trae response1..response5 y responseCorrect (número)
function options(q: Question) {
  return [q.response1, q.response2, q.response3, q.response4]
    .map((label, i) => ({ label, value: String(i + 1) }))
}

function isCorrect(q: Question) {
  return answers.value[q.id] === String(q.responseCorrect)
}

const score = computed(() => questions.filter(isCorrect).length)

function reset() {
  answers.value = {}
  checked.value = false
}
</script>
