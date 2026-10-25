<template>
  <div>
    <p v-if="limitDate" class="mb-6 flex items-center gap-2 text-sm" :class="closed ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500'">
      <i class="mdi mdi-calendar-clock" aria-hidden="true" />
      {{ closed ? 'El cuestionario cerró el' : 'Disponible hasta el' }} {{ formatDateTime(limitDate) }}
    </p>

    <!-- Último intento: nota y revisión de cada pregunta -->
    <div v-if="quiz && !retrying" class="space-y-6">
      <div class="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-6 sm:flex-row sm:items-center dark:border-zinc-800">
        <span class="grid size-20 shrink-0 place-items-center rounded-full text-2xl font-extrabold" :class="score >= 60 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'">
          {{ score }}%
        </span>
        <div class="flex-1">
          <p class="text-lg font-semibold text-zinc-900 dark:text-white">{{ score >= 60 ? '¡Buen trabajo!' : 'Puedes mejorar' }}</p>
          <p class="text-zinc-600 dark:text-zinc-400">
            Acertaste {{ correctCount }} de {{ questions.length }} preguntas en tu último intento.
          </p>
        </div>
        <DuiButton v-if="!readonly && !closed" variant="outline" color="neutral" @click="retry">
          <i class="mdi mdi-refresh mr-1" aria-hidden="true" /> Intentar de nuevo
        </DuiButton>
      </div>

      <ol v-if="review.size" class="space-y-3">
        <li v-for="(q, i) in questions" :key="q.id" class="flex gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <i
            class="mt-0.5 text-xl"
            :class="review.get(q.id)?.correct ? 'mdi mdi-check-circle text-emerald-500' : 'mdi mdi-close-circle text-rose-500'"
            :aria-label="review.get(q.id)?.correct ? 'Correcta' : 'Incorrecta'"
          />
          <div class="min-w-0 flex-1">
            <div class="reading text-base font-medium" v-html="`${i + 1}. ${renderContent(q.name, 'html')}`" />
            <p class="mt-1 text-sm text-zinc-500">Tu respuesta: {{ optionLabel(q, review.get(q.id)?.selected) }}</p>
          </div>
        </li>
      </ol>
    </div>

    <DuiAlert v-else-if="closed && !readonly" color="warning" variant="outline">
      La fecha límite ya pasó y no es posible responder este cuestionario.
    </DuiAlert>

    <div v-else class="space-y-8">
      <fieldset v-for="(q, i) in questions" :key="q.id" class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <legend class="px-2 text-sm text-zinc-500">Pregunta {{ i + 1 }} de {{ questions.length }}</legend>
        <div class="reading text-lg font-medium" v-html="renderContent(q.name, 'html')" />
        <div v-if="q.description" class="reading mt-1 text-zinc-600 dark:text-zinc-400" v-html="renderContent(q.description, 'html')" />
        <img v-if="q.picture" :src="q.picture" alt="" class="mt-4 max-h-80 rounded-lg" loading="lazy">
        <a v-if="q.attachment" :href="q.attachment" target="_blank" rel="noopener" class="mt-3 inline-flex items-center gap-1 text-sm font-medium underline">
          <i class="mdi mdi-paperclip" aria-hidden="true" /> Material de apoyo
        </a>
        <DuiRadio v-model="answers[q.id]" :name="q.id" :options="options(q)" :disabled="readonly" class="mt-4" />
      </fieldset>

      <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>
      <div v-if="!readonly" class="flex flex-wrap items-center gap-3">
        <DuiButton color="primary" :loading="sending" :disabled="answered < questions.length" @click="send">
          Enviar respuestas
        </DuiButton>
        <DuiButton v-if="retrying" variant="ghost" color="neutral" @click="retrying = false">Cancelar</DuiButton>
        <span class="text-sm text-zinc-500">{{ answered }} de {{ questions.length }} respondidas</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LessonQuiz, Question } from '~/types/api'

const props = defineProps<{ path: string; questions: Question[]; quiz: LessonQuiz | null; limitDate?: string | null; readonly?: boolean }>()
const emit = defineEmits<{ sent: [] }>()

const answers = ref<Record<string, string>>({})
const sending = ref(false)
const retrying = ref(false)
const error = ref('')
const closed = computed(() => !!props.limitDate && new Date(props.limitDate) < new Date())
const answered = computed(() => props.questions.filter(q => answers.value[q.id]).length)

// answers llega como JSON en string: [{ question_id, selected, correct }]
const review = computed(() => {
  const map = new Map<string, { selected: number; correct: boolean }>()
  try {
    for (const a of JSON.parse(props.quiz?.answers ?? '[]')) map.set(a.question_id, { selected: Number(a.selected), correct: !!a.correct })
  } catch {}
  return map
})
const correctCount = computed(() => [...review.value.values()].filter(a => a.correct).length)
const score = computed(() => toPercent(props.quiz?.results))

// Las opciones van numeradas desde 1, igual que responseCorrect en la API
function options(q: Question) {
  return [
    q.response1 ?? q.response_1,
    q.response2 ?? q.response_2,
    q.response3 ?? q.response_3,
    q.response4 ?? q.response_4,
    q.response5 ?? q.response_5,
  ]
    .map((label, i) => ({ label: label ?? '', value: String(i + 1) }))
    .filter(option => option.label)
}

function optionLabel(q: Question, selected?: number) {
  return options(q).find(o => o.value === String(selected))?.label ?? '—'
}

function retry() {
  answers.value = {}
  retrying.value = true
}

async function send() {
  sending.value = true
  error.value = ''
  try {
    await apiFetch(`${props.path}/quizzes`, {
      method: 'POST',
      body: { answers: props.questions.map(q => ({ question_id: q.id, selected: Number(answers.value[q.id]) })) },
    })
    retrying.value = false
    emit('sent')
  } catch (e) {
    error.value = apiError(e, 'No pudimos enviar tus respuestas.')
  } finally {
    sending.value = false
  }
}
</script>
