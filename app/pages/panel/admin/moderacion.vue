<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Moderación</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">Las preguntas de la comunidad y los comentarios del blog se publican cuando los apruebas.</p>

    <DuiTabs v-model="tab" :tabs="tabs" class="mt-6" aria-label="Contenido a moderar">
      <template #temas>
        <ul v-if="topics?.data.length" class="mt-6 space-y-3">
          <li v-for="topic in topics.data" :key="topic.id" class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold text-zinc-900 dark:text-white">{{ topic.name }}</p>
                <p class="text-sm text-zinc-500">{{ userName(topic.user) }} · {{ formatDate(topic.createdAt) }}<template v-if="topic.group"> · {{ /^[0-9a-f-]{36}$/.test(topic.group) ? 'Pregunta de una lección' : topic.group }}</template></p>
              </div>
              <DuiBadge :label="isTrue(topic.active) ? 'Publicado' : 'Pendiente'" :color="isTrue(topic.active) ? 'success' : 'warning'" variant="soft" size="sm" />
            </div>
            <div class="reading mt-3 line-clamp-6 !text-base !leading-7" v-html="renderRichText(topic.content)" />
            <div class="mt-4 flex flex-wrap gap-2">
              <DuiButton size="sm" :color="isTrue(topic.active) ? 'neutral' : 'success'" :variant="isTrue(topic.active) ? 'outline' : 'solid'" @click="setActive('topics', topic.id, !isTrue(topic.active))">
                {{ isTrue(topic.active) ? 'Ocultar' : 'Aprobar' }}
              </DuiButton>
              <DuiAction v-if="isTrue(topic.active)" :to="`/comunidad/${topic.slug}`" size="sm" variant="ghost" color="neutral">Ver tema</DuiAction>
            </div>
          </li>
        </ul>
        <EmptyState v-else class="mt-6" icon="mdi mdi-forum-outline" title="No hay preguntas en la comunidad" />
        <DuiPagination v-if="(topics?.meta.lastPage ?? 1) > 1" v-model="topicsPage" :total="topics!.meta.total" :per-page="topics!.meta.perPage" class="mt-6 justify-center" />
      </template>

      <template #comentarios>
        <ul v-if="comments?.data.length" class="mt-6 space-y-3">
          <li v-for="comment in comments.data" :key="comment.id" class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <p class="text-sm text-zinc-500">{{ userName(comment.user) }} · {{ formatDate(comment.createdAt) }}<template v-if="comment.parentId"> · respuesta</template></p>
              <DuiBadge :label="isTrue(comment.active) ? 'Publicado' : 'Pendiente'" :color="isTrue(comment.active) ? 'success' : 'warning'" variant="soft" size="sm" />
            </div>
            <p class="mt-2 whitespace-pre-line text-zinc-700 dark:text-zinc-300">{{ comment.content }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <DuiButton size="sm" :color="isTrue(comment.active) ? 'neutral' : 'success'" :variant="isTrue(comment.active) ? 'outline' : 'solid'" @click="setActive('comments', comment.id, !isTrue(comment.active))">
                {{ isTrue(comment.active) ? 'Ocultar' : 'Aprobar' }}
              </DuiButton>
              <DuiButton size="sm" variant="ghost" color="danger" @click="removeComment(comment.id)">Eliminar</DuiButton>
            </div>
          </li>
        </ul>
        <EmptyState v-else class="mt-6" icon="mdi mdi-comment-outline" title="No hay comentarios" />
        <DuiPagination v-if="(comments?.meta.lastPage ?? 1) > 1" v-model="commentsPage" :total="comments!.meta.total" :per-page="comments!.meta.perPage" class="mt-6 justify-center" />
      </template>
    </DuiTabs>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Comment, Paginated, Topic } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'owner' })
useSeo({ title: 'Moderación', description: 'Moderación de la comunidad.', noindex: true })

const toast = useToast()
const tab = ref('temas')
const topicsPage = ref(1)
const commentsPage = ref(1)
const [{ data: topics, refresh: refreshTopics }, { data: comments, refresh: refreshComments }] = await Promise.all([
  useApi<Paginated<Topic>>(() => `/admin/social/topics?per_page=20&page=${topicsPage.value}`),
  useApi<Paginated<Comment>>(() => `/admin/social/comments?per_page=20&page=${commentsPage.value}`),
])

const tabs = computed(() => [
  { label: 'Comunidad', value: 'temas', icon: 'mdi mdi-forum-outline', badge: pending(topics.value?.data) },
  { label: 'Comentarios del blog', value: 'comentarios', icon: 'mdi mdi-comment-outline', badge: pending(comments.value?.data) },
])

// Pendientes en la página actual
function pending(items?: { active?: boolean | number }[]) {
  return items?.filter(item => !isTrue(item.active)).length || undefined
}

async function setActive(kind: 'topics' | 'comments', id: string, active: boolean) {
  try {
    await apiFetch(`/admin/social/${kind}/${id}`, { method: 'PUT', body: { active } })
    await (kind === 'topics' ? refreshTopics() : refreshComments())
    toast.success(active ? 'Publicado.' : 'Ocultado.')
  } catch (e) {
    toast.error(apiError(e))
  }
}

async function removeComment(id: string) {
  if (!window.confirm('¿Eliminar este comentario?')) return
  try {
    await apiFetch(`/admin/social/comments/${id}`, { method: 'DELETE' })
    await refreshComments()
    toast.success('Comentario eliminado.')
  } catch (e) {
    toast.error(apiError(e))
  }
}
</script>
