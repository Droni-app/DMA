<template>
  <div>
    <div class="reading" v-html="renderContent(activity, format)" />

    <p v-if="limitDate" class="mt-4 flex items-center gap-2 text-sm" :class="closed ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500'">
      <i class="mdi mdi-calendar-clock" aria-hidden="true" />
      {{ closed ? 'La entrega cerró el' : 'Fecha límite:' }} {{ formatDateTime(limitDate) }}
    </p>

    <!-- Respuesta ya enviada (una sola entrega por lección) -->
    <div v-if="answer" class="mt-8 space-y-4">
      <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <p class="text-sm font-semibold text-zinc-500">Tu entrega</p>
        <p class="mt-2 whitespace-pre-line text-zinc-800 dark:text-zinc-200">{{ answer.answer }}</p>
        <a v-if="answer.attachment" :href="answer.attachment" target="_blank" rel="noopener" class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-700 underline dark:text-slate-300">
          <i class="mdi mdi-paperclip" aria-hidden="true" /> Ver archivo adjunto
        </a>
      </div>
      <div v-if="answer.feedback || answer.result != null" class="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
        <div class="flex items-center justify-between gap-4">
          <p class="font-semibold text-emerald-800 dark:text-emerald-300">Calificación de tu docente</p>
          <span v-if="answer.result != null" class="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{{ toPercent(answer.result) }}/100</span>
        </div>
        <p v-if="answer.feedback" class="mt-2 whitespace-pre-line text-emerald-900 dark:text-emerald-200">{{ answer.feedback }}</p>
      </div>
      <p v-else class="text-sm text-zinc-500"><i class="mdi mdi-clock-outline" aria-hidden="true" /> Tu docente revisará tu entrega pronto.</p>
    </div>

    <DuiAlert v-else-if="closed && !readonly" color="warning" variant="outline" class="mt-8">
      La fecha límite ya pasó y no es posible enviar esta actividad.
    </DuiAlert>

    <DuiForm v-else-if="!readonly" class="mt-8" @submit="send">
      <DuiLabel title="Tu respuesta" required>
        <DuiTextarea v-model="text" rows="6" placeholder="Escribe aquí tu respuesta…" required block autoheight />
      </DuiLabel>
      <DuiLabel title="Archivo adjunto (opcional)" help-text="PDF, Word, Excel, imagen o ZIP. Máximo 10 MB.">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,.md"
          class="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-800 hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-200"
          @change="file = ($event.target as HTMLInputElement).files?.[0] ?? null"
        >
      </DuiLabel>
      <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>
      <p class="text-sm text-zinc-500">Solo puedes enviar la actividad una vez, revísala antes de enviarla.</p>
      <template #footer>
        <DuiButton type="submit" color="primary" :loading="sending">Enviar actividad</DuiButton>
      </template>
    </DuiForm>
  </div>
</template>

<script setup lang="ts">
import type { LessonAnswer } from '~/types/api'

const props = defineProps<{ path: string; activity: string; format: string; answer: LessonAnswer | null; limitDate?: string | null; readonly?: boolean }>()
const emit = defineEmits<{ sent: [] }>()

const text = ref('')
const file = ref<File | null>(null)
const sending = ref(false)
const error = ref('')
const closed = computed(() => !!props.limitDate && new Date(props.limitDate) < new Date())

async function send() {
  if (file.value && file.value.size > 10 * 1024 * 1024) {
    error.value = 'El archivo es demasiado grande (máximo 10 MB).'
    return
  }
  sending.value = true
  error.value = ''
  try {
    const attachment = file.value ? (await uploadFile(file.value)).url : null
    await apiFetch(`${props.path}/answers`, { method: 'POST', body: { answer: text.value, attachment } })
    emit('sent')
  } catch (e) {
    error.value = apiError(e, 'No pudimos enviar tu actividad.')
  } finally {
    sending.value = false
  }
}
</script>
