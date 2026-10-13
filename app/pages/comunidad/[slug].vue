<template>
  <div v-if="topic" class="mx-auto max-w-3xl px-4 py-12">
    <NuxtLink to="/comunidad" class="text-sm text-zinc-500 hover:underline dark:text-zinc-400">← Volver a la comunidad</NuxtLink>

    <article class="mt-6">
      <DuiBadge :label="topic.group" variant="soft" />
      <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{{ topic.name }}</h1>
      <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{{ topic.author }} · {{ formatDate(topic.createdAt) }}</p>
      <p class="mt-6 text-lg leading-8 text-zinc-700 dark:text-zinc-300">{{ topic.content }}</p>
    </article>

    <section class="mt-12" aria-labelledby="respuestas">
      <h2 id="respuestas" class="text-lg font-semibold text-zinc-900 dark:text-white">{{ replies.length }} respuestas</h2>
      <ul class="mt-4 space-y-4">
        <li v-for="reply in replies" :key="reply.id" class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <p class="text-sm font-medium text-zinc-900 dark:text-white">
            {{ reply.author }} <span class="font-normal text-zinc-500 dark:text-zinc-400">· {{ formatDate(reply.createdAt) }}</span>
          </p>
          <p class="mt-2 leading-7 text-zinc-700 dark:text-zinc-300">{{ reply.content }}</p>
        </li>
      </ul>

      <DuiForm v-if="user" class="mt-8" @submit="sendReply">
        <DuiLabel title="Tu respuesta">
          <DuiTextarea v-model="answer" rows="4" placeholder="Escribe una respuesta clara y amable…" required block />
        </DuiLabel>
        <template #footer>
          <DuiButton type="submit" color="primary">Responder</DuiButton>
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
import { getTopic } from '~/data/topics'

const route = useRoute()
const topic = getTopic(String(route.params.slug))
if (!topic) throw createError({ statusCode: 404, statusMessage: 'Tema no encontrado', fatal: true })

useSeo({ title: topic.name, description: topic.content.slice(0, 155) })

const { user } = useAuth()
const replies = ref([...topic.replies])
const answer = ref('')

function sendReply() {
  // Se conectará a POST /social/topics/{topic_id}/replies
  replies.value.push({ id: String(Date.now()), author: user.value!.fullName, createdAt: new Date().toISOString().slice(0, 10), content: answer.value })
  answer.value = ''
}
</script>
