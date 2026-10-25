<template>
  <div>
    <!-- Botón flotante: siempre a mano mientras se lee la lección -->
    <button
      type="button"
      class="fixed right-4 bottom-4 z-30 flex items-center gap-2 rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 sm:right-6 sm:bottom-6"
      @click="open = true"
    >
      <i class="mdi mdi-forum-outline text-lg" aria-hidden="true" />
      Preguntas
      <span v-if="topics?.meta.total" class="grid min-w-6 place-items-center rounded-full bg-white/25 px-1.5 text-xs">{{ topics.meta.total }}</span>
    </button>

    <ClientOnly>
      <DuiDrawer v-model="open" position="right" size="md">
        <template #header>
          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase tracking-wide text-zinc-500">Preguntas de la lección</p>
            <p class="truncate font-semibold text-zinc-900 dark:text-white">{{ lessonName }}</p>
          </div>
        </template>

        <!-- Una pregunta con sus respuestas -->
        <div v-if="current">
          <button type="button" class="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white" @click="current = null">
            <i class="mdi mdi-arrow-left" aria-hidden="true" /> Todas las preguntas
          </button>
          <h3 class="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">{{ current.topic.name }}</h3>
          <p class="mt-1 text-xs text-zinc-500">{{ userName(current.topic.user) }} · {{ formatDate(current.topic.createdAt) }}</p>
          <div class="reading mt-3 !text-base !leading-7" v-html="renderRichText(current.topic.content)" />

          <p class="mt-6 text-sm font-semibold text-zinc-900 dark:text-white">
            {{ current.replies.length }} {{ current.replies.length === 1 ? 'respuesta' : 'respuestas' }}
          </p>
          <ul class="mt-3 space-y-3">
            <li v-for="reply in current.replies" :key="reply.id" class="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
              <p class="text-xs text-zinc-500"><strong class="text-zinc-800 dark:text-zinc-200">{{ userName(reply.user) }}</strong> · {{ formatDate(reply.createdAt) }}</p>
              <p class="mt-1 whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-300">{{ reply.content }}</p>
            </li>
          </ul>

          <DuiForm v-if="user" class="mt-4" :loading="sending" @submit="reply">
            <DuiTextarea v-model="replyText" rows="3" placeholder="Escribe tu respuesta…" required block autoheight />
            <template #footer>
              <DuiButton type="submit" color="primary" size="sm" :loading="sending">Responder</DuiButton>
            </template>
          </DuiForm>
        </div>

        <!-- Nueva pregunta -->
        <div v-else-if="asking">
          <button type="button" class="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white" @click="asking = false">
            <i class="mdi mdi-arrow-left" aria-hidden="true" /> Todas las preguntas
          </button>
          <DuiForm class="mt-4" :loading="sending" @submit="ask">
            <DuiLabel title="Tu duda en una frase" required>
              <DuiInput v-model="form.name" placeholder="Ej: ¿Por qué el resultado da negativo?" required block />
            </DuiLabel>
            <RichContentEditor v-model="form.content" format="html" label="Detalles" />
            <p class="text-sm text-zinc-500">Explica qué intentaste y dónde te quedaste.</p>
            <p class="text-sm text-zinc-500">Tu pregunta aparecerá aquí cuando el equipo la revise.</p>
            <template #footer>
              <DuiButton type="submit" color="primary" block :loading="sending">Publicar pregunta</DuiButton>
            </template>
          </DuiForm>
        </div>

        <!-- Listado -->
        <div v-else>
          <DuiButton v-if="user" color="primary" block @click="asking = true">
            <i class="mdi mdi-plus mr-1" aria-hidden="true" /> Hacer una pregunta
          </DuiButton>
          <DuiAlert v-else color="neutral" variant="outline">
            <NuxtLink :to="{ path: '/login', query: { redirect: route.path } }" class="font-semibold underline">Ingresa</NuxtLink>
            para preguntar y responder.
          </DuiAlert>

          <ul v-if="topics?.data.length" class="mt-5 space-y-2">
            <li v-for="topic in topics.data" :key="topic.id">
              <button
                type="button"
                class="w-full rounded-xl border border-zinc-200 p-3 text-left transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                @click="openTopic(topic)"
              >
                <p class="font-medium text-zinc-900 dark:text-white">{{ topic.name }}</p>
                <p class="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{{ plainText(topic.content) }}</p>
                <p class="mt-2 text-xs text-zinc-500">{{ userName(topic.user) }} · {{ formatDate(topic.createdAt) }}</p>
              </button>
            </li>
          </ul>
          <div v-else-if="status !== 'pending'" class="mt-10 text-center">
            <i class="mdi mdi-chat-question-outline text-4xl text-zinc-300 dark:text-zinc-600" aria-hidden="true" />
            <p class="mt-2 font-medium text-zinc-900 dark:text-white">Nadie ha preguntado todavía</p>
            <p class="text-sm text-zinc-500">¿Algo no quedó claro? Pregunta y otros te ayudarán.</p>
          </div>
          <p v-if="loadingTopic" class="mt-4 text-center text-sm text-zinc-500"><i class="mdi mdi-loading mdi-spin" aria-hidden="true" /> Cargando…</p>
        </div>
      </DuiDrawer>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Paginated, Reply, Topic } from '~/types/api'

// Preguntas de la comunidad de una lección: son temas cuyo `group` es el id de la lección
const props = defineProps<{ group: string; lessonName: string }>()

const route = useRoute()
const { user } = useAuth()
const toast = useToast()
const open = ref(false)
const { data: topics, status } = useApi<Paginated<Topic>>(`/social/topics?group=${props.group}&per_page=50`, { server: false })

// Pregunta abierta, con sus respuestas de la más antigua a la más reciente
const current = ref<{ topic: Topic; replies: Reply[] } | null>(null)
const loadingTopic = ref(false)
const asking = ref(false)
const sending = ref(false)
const replyText = ref('')
const form = reactive({ name: '', content: '' })

async function openTopic(topic: Topic) {
  loadingTopic.value = true
  try {
    const res = await apiFetch<{ topic: Topic; replies: Paginated<Reply> }>(`/social/topics/${topic.slug}`, { query: { per_page: 100 } })
    current.value = { topic: res.topic, replies: [...res.replies.data].reverse() }
  } catch (e) {
    toast.error(apiError(e, 'No pudimos abrir la pregunta.'))
  } finally {
    loadingTopic.value = false
  }
}

async function reply() {
  if (!current.value) return
  sending.value = true
  try {
    const created = await apiFetch<Reply>(`/social/topics/${current.value.topic.slug}/replies`, { method: 'POST', body: { content: replyText.value } })
    current.value.replies.push({ ...created, user: created.user ?? user.value ?? undefined })
    replyText.value = ''
  } catch (e) {
    toast.error(apiError(e, 'No pudimos publicar tu respuesta.'))
  } finally {
    sending.value = false
  }
}

async function ask() {
  if (!plainText(form.content)) return toast.error('Escribe los detalles de tu pregunta.')
  sending.value = true
  try {
    await apiFetch('/social/topics', { method: 'POST', body: { ...form, group: props.group } })
    Object.assign(form, { name: '', content: '' })
    asking.value = false
    // Los temas nuevos quedan pendientes hasta que el equipo los aprueba
    toast.success('¡Gracias! Tu pregunta aparecerá cuando el equipo la revise.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos publicar tu pregunta.'))
  } finally {
    sending.value = false
  }
}
</script>
