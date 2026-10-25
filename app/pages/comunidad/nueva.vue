<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <NuxtLink to="/comunidad" class="text-sm text-zinc-500 hover:underline dark:text-zinc-400">← Volver a la comunidad</NuxtLink>

    <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Nueva pregunta</h1>
    <p class="mt-2 text-zinc-600 dark:text-zinc-400">Cuéntale a la comunidad qué necesitas. Mientras más detalles des, mejores respuestas recibirás.</p>

    <DuiForm class="mt-8 space-y-5" :loading="sending" @submit="createTopic">
      <DuiLabel title="Título" help-text="Resume tu duda en una frase." required>
        <DuiInput v-model="form.name" placeholder="Ej: ¿Cómo despejo una ecuación?" required block />
      </DuiLabel>
      <RichContentEditor v-model="form.content" format="html" label="Tu pregunta" />
      <p class="-mt-3 text-sm text-zinc-500">Explica qué intentaste y en qué parte te quedaste.</p>

      <DuiAlert color="neutral" variant="outline">
        <i class="mdi mdi-shield-check-outline mr-1" aria-hidden="true" />
        Tu pregunta será visible para todos cuando el equipo la revise.
      </DuiAlert>
      <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>

      <div class="flex flex-wrap gap-3">
        <DuiButton type="submit" color="primary" :loading="sending">Publicar pregunta</DuiButton>
        <DuiAction to="/comunidad" variant="outline" color="neutral">Cancelar</DuiAction>
      </div>
    </DuiForm>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'

definePageMeta({ middleware: 'auth' })
useSeo({ title: 'Nueva pregunta', description: 'Haz una pregunta a la comunidad DMA.', noindex: true })

const toast = useToast()
const sending = ref(false)
const error = ref('')
const form = reactive({ name: '', content: '' })

async function createTopic() {
  error.value = ''
  if (!plainText(form.content)) {
    error.value = 'Escribe tu pregunta.'
    return
  }
  sending.value = true
  try {
    await apiFetch('/social/topics', { method: 'POST', body: form })
    // Los temas nuevos quedan pendientes hasta que el equipo los aprueba
    toast.success('¡Gracias! Tu pregunta será visible cuando el equipo la revise.')
    await navigateTo('/comunidad')
  } catch (e) {
    error.value = apiError(e, 'No pudimos publicar tu pregunta.')
  } finally {
    sending.value = false
  }
}
</script>
