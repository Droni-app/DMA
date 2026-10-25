<template>
  <div v-if="data" class="mx-auto max-w-3xl px-4 py-12">
    <NuxtLink to="/comunidad" class="text-sm text-zinc-500 hover:underline dark:text-zinc-400">← Volver a la comunidad</NuxtLink>

    <article class="mt-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{{ topic.name }}</h1>
      <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{{ userName(topic.user) }} · {{ formatDate(topic.createdAt) }}</p>
      <div class="reading mt-6" v-html="renderRichText(topic.content)" />
    </article>

    <section class="mt-12" aria-labelledby="respuestas">
      <h2 id="respuestas" class="text-lg font-semibold text-zinc-900 dark:text-white">
        {{ data.replies.meta.total }} {{ data.replies.meta.total === 1 ? 'respuesta' : 'respuestas' }}
      </h2>
      <ul class="mt-4 space-y-4">
        <li v-for="reply in data.replies.data" :key="reply.id" class="flex gap-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <img v-if="reply.user?.avatar" :src="reply.user.avatar" alt="" class="size-9 shrink-0 rounded-full object-cover" loading="lazy" referrerpolicy="no-referrer">
          <span v-else class="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">{{ initials(reply.user?.fullName) }}</span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-zinc-900 dark:text-white">
              {{ userName(reply.user) }} <span class="font-normal text-zinc-500 dark:text-zinc-400">· {{ formatDate(reply.createdAt) }}</span>
            </p>
            <p class="mt-2 whitespace-pre-line leading-7 text-zinc-700 dark:text-zinc-300">{{ reply.content }}</p>
          </div>
        </li>
      </ul>
      <DuiPagination
        v-if="data.replies.meta.lastPage > 1"
        v-model="page"
        :total="data.replies.meta.total"
        :per-page="data.replies.meta.perPage"
        class="mt-6 justify-center"
      />

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
const slug = String(route.params.slug)
const page = ref(1)
const { data, refresh } = await useApi<{ topic: Topic; replies: Paginated<Reply> }>(() => `/social/topics/${slug}?per_page=20&page=${page.value}`)
if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Tema no encontrado', fatal: true })

const topic = computed(() => data.value!.topic)
useSeo({ title: topic.value.name, description: plainText(topic.value.content).slice(0, 155) })

const { user } = useAuth()
const toast = useToast()
const answer = ref('')
const sending = ref(false)

async function sendReply() {
  sending.value = true
  try {
    await apiFetch(`/social/topics/${slug}/replies`, { method: 'POST', body: { content: answer.value } })
    answer.value = ''
    // Las respuestas llegan de la más reciente a la más antigua
    if (page.value === 1) await refresh()
    else page.value = 1
    toast.success('Tu respuesta fue publicada.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos publicar tu respuesta.'))
  } finally {
    sending.value = false
  }
}
</script>
