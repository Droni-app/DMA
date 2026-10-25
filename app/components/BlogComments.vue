<template>
  <section aria-labelledby="comentarios">
    <h2 id="comentarios" class="text-xl font-bold text-zinc-900 dark:text-white">
      Comentarios <span v-if="comments?.meta.total" class="font-normal text-zinc-500">({{ comments.meta.total }})</span>
    </h2>

    <DuiForm v-if="user" class="mt-6" :loading="sending" @submit="send(null)">
      <DuiLabel title="Deja un comentario">
        <DuiTextarea v-model="text" rows="3" placeholder="¿Qué te pareció? ¿Tienes alguna duda?" required block />
      </DuiLabel>
      <template #footer>
        <DuiButton type="submit" color="primary" :loading="sending">Comentar</DuiButton>
      </template>
    </DuiForm>
    <DuiAlert v-else color="neutral" variant="outline" class="mt-6">
      <NuxtLink :to="{ path: '/login', query: { redirect: route.path } }" class="font-semibold underline">Ingresa</NuxtLink>
      para dejar un comentario.
    </DuiAlert>

    <ul v-if="comments?.data.length" class="mt-8 space-y-6">
      <li v-for="comment in comments.data" :key="comment.id">
        <article class="flex gap-3">
          <span class="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">{{ initials(comment.user?.fullName) }}</span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-zinc-900 dark:text-white">
              {{ userName(comment.user) }}
              <span class="font-normal text-zinc-500">· {{ formatDate(comment.createdAt) }}<template v-if="comment.isEdited"> · editado</template></span>
            </p>
            <p class="mt-1 whitespace-pre-line text-zinc-700 dark:text-zinc-300">{{ comment.content }}</p>
            <button v-if="user" type="button" class="mt-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white" @click="replyTo = replyTo === comment.id ? '' : comment.id">
              Responder
            </button>

            <DuiForm v-if="replyTo === comment.id" class="mt-3" :loading="sending" @submit="send(comment.id)">
              <DuiTextarea v-model="replyText" rows="2" placeholder="Escribe tu respuesta…" required block />
              <template #footer>
                <DuiButton type="submit" size="sm" color="primary" :loading="sending">Responder</DuiButton>
              </template>
            </DuiForm>

            <ul v-if="comment.children?.length" class="mt-4 space-y-4 border-l-2 border-zinc-200 pl-4 dark:border-zinc-800">
              <li v-for="child in comment.children" :key="child.id">
                <p class="text-sm font-medium text-zinc-900 dark:text-white">
                  {{ userName(child.user) }} <span class="font-normal text-zinc-500">· {{ formatDate(child.createdAt) }}</span>
                </p>
                <p class="mt-1 whitespace-pre-line text-zinc-700 dark:text-zinc-300">{{ child.content }}</p>
              </li>
            </ul>
          </div>
        </article>
      </li>
    </ul>
    <p v-else class="mt-8 text-zinc-500">Aún no hay comentarios. ¡Sé el primero!</p>

    <DuiPagination v-if="(comments?.meta.lastPage ?? 1) > 1" v-model="page" :total="comments!.meta.total" :per-page="comments!.meta.perPage" class="mt-8 justify-center" />
  </section>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Comment, Paginated } from '~/types/api'

const props = defineProps<{ postId: string }>()

const route = useRoute()
const { user } = useAuth()
const toast = useToast()
const page = ref(1)
// Se cargan en el navegador: no hacen falta para el SEO del artículo
const { data: comments } = useApi<Paginated<Comment>>(
  () => `/social/comments?commentable_type=ContentPost&commentable_id=${props.postId}&per_page=20&page=${page.value}`,
  { server: false },
)

const text = ref('')
const replyText = ref('')
const replyTo = ref('')
const sending = ref(false)

async function send(parentId: string | null) {
  sending.value = true
  try {
    await apiFetch('/social/comments', {
      method: 'POST',
      body: { commentable_type: 'ContentPost', commentable_id: props.postId, content: parentId ? replyText.value : text.value, parent_id: parentId },
    })
    text.value = ''
    replyText.value = ''
    replyTo.value = ''
    // Los comentarios nuevos esperan aprobación antes de mostrarse
    toast.success('¡Gracias! Tu comentario aparecerá cuando sea aprobado.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos publicar tu comentario.'))
  } finally {
    sending.value = false
  }
}
</script>
