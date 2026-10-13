<template>
  <div v-if="data" class="mx-auto max-w-3xl px-4 py-12">
    <NuxtLink to="/comunidad" class="text-sm text-zinc-500 hover:underline dark:text-zinc-400">← Volver a la comunidad</NuxtLink>

    <article class="mt-6">
      <DuiBadge v-if="topic.group" :label="topic.group" variant="soft" />
      <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{{ topic.name }}</h1>
      <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{{ topic.user?.fullName }} · {{ formatDate(topic.createdAt) }}</p>
      <p class="mt-6 whitespace-pre-line text-lg leading-8 text-zinc-700 dark:text-zinc-300">{{ topic.content }}</p>
    </article>

    <section class="mt-12" aria-labelledby="respuestas">
      <h2 id="respuestas" class="text-lg font-semibold text-zinc-900 dark:text-white">{{ data.replies.meta.total }} respuestas</h2>
      <ul class="mt-4 space-y-4">
        <li v-for="reply in data.replies.data" :key="reply.id" class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <p class="text-sm font-medium text-zinc-900 dark:text-white">
            {{ reply.user?.fullName }} <span class="font-normal text-zinc-500 dark:text-zinc-400">· {{ formatDate(reply.createdAt) }}</span>
          </p>
          <p class="mt-2 whitespace-pre-line leading-7 text-zinc-700 dark:text-zinc-300">{{ reply.content }}</p>
        </li>
      </ul>

      <DuiForm v-if="user" class="mt-8" :loading="sending" @submit="sendReply">
        <DuiLabel title="Tu respuesta">
          <DuiTextarea v-model="answer" rows="4" placeholder="Escribe una respuesta clara y amable…" required block />
        </DuiLabel>
        <template #footer>
          <DuiButton type="submit" color="primary" :loading="sending">Responder</DuiButton>
        </template>
      </DuiForm>
      <DuiAlert v-else color="neutral" variant="outline" class="mt-8">
        <NuxtLink :to="{ path: '/login', query: { redirect: route.path } }" class="font-semibold underline">Ingresa</NuxtLink>
        para responder esta pregunta.
      </DuiAlert>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Paginated, Reply, Topic } from '~/types/api'

const route = useRoute()
const { data, refresh } = await useApi<{ topic: Topic; replies: Paginated<Reply> }>(`/social/topics/${route.params.slug}`)
if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Tema no encontrado', fatal: true })

const topic = computed(() => data.value!.topic)
useSeo({ title: topic.value.name, description: topic.value.content.slice(0, 155) })

const { user } = useAuth()
const toast = useToast()
const answer = ref('')
const sending = ref(false)

async function sendReply() {
  sending.value = true
  try {
    await apiFetch(`/social/topics/${topic.value.id}/replies`, { method: 'POST', body: { content: answer.value } })
    answer.value = ''
    await refresh()
  } catch (e) {
    toast.error(apiError(e, 'No pudimos publicar tu respuesta.'))
  } finally {
    sending.value = false
  }
}
</script>
