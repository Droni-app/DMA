<template>
  <div>
    <div class="reading" v-html="renderContent(activity, format)" />

    <!-- Respuesta ya enviada -->
    <div v-if="answer" class="mt-8 space-y-4">
      <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <p class="text-sm font-semibold text-zinc-500">Tu respuesta</p>
        <p class="mt-2 whitespace-pre-line text-zinc-800 dark:text-zinc-200">{{ answer.answer }}</p>
      </div>
      <DuiAlert v-if="answer.feedback || answer.result" color="success" variant="outline">
        <strong v-if="answer.result">Resultado: {{ answer.result }}</strong>
        <p v-if="answer.feedback" class="mt-1">{{ answer.feedback }}</p>
      </DuiAlert>
      <p v-else class="text-sm text-zinc-500"><i class="mdi mdi-clock-outline" aria-hidden="true" /> Tu docente revisará tu respuesta pronto.</p>
    </div>

    <DuiForm v-else-if="!readonly" class="mt-8" @submit="send">
      <DuiLabel title="Tu respuesta" required>
        <DuiTextarea v-model="text" rows="6" placeholder="Escribe aquí tu respuesta…" required block autoheight />
      </DuiLabel>
      <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>
      <template #footer>
        <DuiButton type="submit" color="primary" :loading="sending">Enviar actividad</DuiButton>
      </template>
    </DuiForm>
  </div>
</template>

<script setup lang="ts">
import type { LessonAnswer } from '~/types/api'

const props = defineProps<{ path: string; activity: string; format: string; answer: LessonAnswer | null; readonly?: boolean }>()
const emit = defineEmits<{ sent: [] }>()

const text = ref('')
const sending = ref(false)
const error = ref('')

async function send() {
  sending.value = true
  error.value = ''
  try {
    await apiFetch(`${props.path}/answers`, { method: 'POST', body: { answer: text.value } })
    emit('sent')
  } catch (e) {
    error.value = apiError(e, 'No pudimos enviar tu actividad.')
  } finally {
    sending.value = false
  }
}
</script>
